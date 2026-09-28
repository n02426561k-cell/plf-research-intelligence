import asyncio
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.models import (
    Document, Source, Author, Technology, Species, Application,
    CrawlJob, CrawlError, TaxonomyTerm
)
from app.crawler.sources.openalex import OpenAlexHarvester
from app.crawler.sources.crossref import CrossrefHarvester
from app.crawler.deduplication.engine import DeduplicationEngine, normalize_doi
from app.crawler.classifiers.taxonomy_classifier import TaxonomyClassifier

class CrawlerEngine:
    """
    Central orchestration engine for polite scholarly discovery,
    parsing, deduplication, multi-axis classification, and database ingestion.
    """
    _is_running = False

    @classmethod
    def is_running(cls) -> bool:
        return cls._is_running

    @classmethod
    async def run_discovery_cycle(cls, db: Session, query: str = "Precision Livestock Farming", limit_per_source: int = 15) -> Dict[str, Any]:
        if cls._is_running:
            return {"status": "already_running", "message": "A crawl job is currently active."}

        cls._is_running = True
        job = CrawlJob(
            job_type="scholarly_harvest",
            source_target=f"Scholarly APIs (Query: {query})",
            status="Running",
            logs=[f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} [START] Initializing discovery cycle for '{query}'"]
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        discovered = 0
        processed = 0
        duplicates = 0
        errors = 0

        try:
            # 1. Query OpenAlex API
            job.logs.append(f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} [FETCH] Querying OpenAlex API...")
            openalex_results = await OpenAlexHarvester.search_works(query=query, per_page=limit_per_source)
            discovered += len(openalex_results)
            
            # 2. Query Crossref API
            job.logs.append(f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} [FETCH] Querying Crossref API...")
            crossref_results = await CrossrefHarvester.search_works(query=query, rows=limit_per_source)
            discovered += len(crossref_results)

            all_raw_works = openalex_results + crossref_results

            # Retrieve default source or create if missing
            default_source = db.query(Source).first()
            source_id = default_source.id if default_source else 1

            for raw in all_raw_works:
                try:
                    doi = raw.get("doi")
                    openalex_id = raw.get("openalex_id")
                    title = raw.get("title", "").strip()
                    year = raw.get("publication_year")

                    # Check for duplicates
                    existing_doc, match_reason = DeduplicationEngine.find_duplicate(
                        db=db,
                        doi=doi,
                        openalex_id=openalex_id,
                        title=title,
                        year=year
                    )

                    if existing_doc:
                        duplicates += 1
                        # Enrich existing record if it lacks abstract or open access info
                        if not existing_doc.abstract and raw.get("abstract"):
                            existing_doc.abstract = raw.get("abstract")
                        if not existing_doc.is_open_access and raw.get("is_open_access"):
                            existing_doc.is_open_access = True
                            existing_doc.open_access_url = raw.get("open_access_url")
                        db.commit()
                        continue

                    # Classify multi-axis taxonomy
                    classification = TaxonomyClassifier.classify_text(
                        db=db,
                        title=title,
                        abstract=raw.get("abstract") or ""
                    )

                    # Create canonical Document
                    new_doc = Document(
                        source_id=source_id,
                        doi=normalize_doi(doi),
                        openalex_id=openalex_id,
                        canonical_url=raw.get("canonical_url") or f"https://doi.org/{doi}" if doi else "https://plf-research.org",
                        title=title,
                        abstract=raw.get("abstract"),
                        publication_year=year or 2023,
                        published_date=raw.get("published_date"),
                        venue_name=raw.get("venue_name"),
                        citation_count=raw.get("citation_count", 0),
                        is_open_access=raw.get("is_open_access", False),
                        open_access_url=raw.get("open_access_url"),
                        peer_reviewed=True,
                        evidence_type="Primary Empirical" if "review" not in title.lower() else "Systematic Review",
                        authority_tier=raw.get("authority_tier", "A"),
                        verification_status="Verified",
                        geographic_region=classification["regions"][0] if classification["regions"] else "Global"
                    )
                    db.add(new_doc)
                    db.commit()
                    db.refresh(new_doc)

                    # Link associated technologies
                    for t_slug in classification["technologies"]:
                        tech_obj = db.query(Technology).filter(Technology.id == t_slug).first()
                        if tech_obj and tech_obj not in new_doc.technologies:
                            new_doc.technologies.append(tech_obj)

                    # Link associated species
                    for s_slug in classification["species"]:
                        sp_obj = db.query(Species).filter(Species.id == s_slug).first()
                        if sp_obj and sp_obj not in new_doc.species:
                            new_doc.species.append(sp_obj)

                    # Link associated applications
                    for a_slug in classification["applications"]:
                        app_obj = db.query(Application).filter(Application.id == a_slug).first()
                        if app_obj and app_obj not in new_doc.applications:
                            new_doc.applications.append(app_obj)

                    # Add authors
                    for author_name in raw.get("authors", []):
                        author_obj = db.query(Author).filter(Author.name == author_name).first()
                        if not author_obj:
                            author_obj = Author(name=author_name)
                            db.add(author_obj)
                            db.commit()
                            db.refresh(author_obj)
                        if author_obj not in new_doc.authors:
                            new_doc.authors.append(author_obj)

                    db.commit()
                    processed += 1

                except Exception as inner_e:
                    errors += 1
                    err = CrawlError(
                        job_id=job.id,
                        source_url=raw.get("canonical_url", "unknown"),
                        error_code="PARSE_OR_INGEST_ERROR",
                        error_message=str(inner_e)
                    )
                    db.add(err)
                    db.commit()

            job.status = "Completed"
            job.records_discovered = discovered
            job.records_processed = processed
            job.duplicates_removed = duplicates
            job.error_count = errors
            job.completed_at = datetime.utcnow()
            job.logs.append(f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} [DONE] Completed: {discovered} discovered, {processed} new docs ingested, {duplicates} duplicates merged, {errors} errors.")
            db.commit()

            return {
                "status": "completed",
                "job_id": job.id,
                "discovered": discovered,
                "processed": processed,
                "duplicates": duplicates,
                "errors": errors
            }

        except Exception as e:
            job.status = "Failed"
            job.error_count += 1
            job.logs.append(f"{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} [CRITICAL ERROR] {str(e)}")
            job.completed_at = datetime.utcnow()
            db.commit()
            return {"status": "failed", "error": str(e)}

        finally:
            cls._is_running = False
