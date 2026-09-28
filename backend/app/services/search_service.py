from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.models import (
    Document, Technology, Species, Application, ResearchGap,
    CommercialSystem, TimelineEvent, GlossaryTerm
)

class SearchService:
    @staticmethod
    def global_search(
        db: Session,
        query: str,
        species_id: Optional[str] = None,
        technology_id: Optional[str] = None,
        category: Optional[str] = None,
        min_year: Optional[int] = None,
        max_year: Optional[int] = None,
        open_access_only: bool = False,
        limit: int = 30
    ) -> Dict[str, Any]:
        q = query.strip().lower() if query else ""
        
        # 1. Search Documents
        doc_query = db.query(Document)
        if q:
            doc_query = doc_query.filter(
                or_(
                    Document.title.ilike(f"%{q}%"),
                    Document.abstract.ilike(f"%{q}%"),
                    Document.venue_name.ilike(f"%{q}%"),
                    Document.findings_summary.ilike(f"%{q}%")
                )
            )
        if species_id:
            doc_query = doc_query.filter(Document.species.any(Species.id == species_id))
        if technology_id:
            doc_query = doc_query.filter(Document.technologies.any(Technology.id == technology_id))
        if min_year:
            doc_query = doc_query.filter(Document.publication_year >= min_year)
        if max_year:
            doc_query = doc_query.filter(Document.publication_year <= max_year)
        if open_access_only:
            doc_query = doc_query.filter(Document.is_open_access == True)

        documents = doc_query.order_by(Document.publication_year.desc()).limit(limit).all()

        formatted_docs = []
        for d in documents:
            formatted_docs.append({
                "id": d.id,
                "title": d.title,
                "authors": [a.name for a in d.authors],
                "year": d.publication_year,
                "venue": d.venue_name,
                "doi": d.doi,
                "is_open_access": d.is_open_access,
                "open_access_url": d.open_access_url,
                "canonical_url": d.canonical_url,
                "authority_tier": d.authority_tier,
                "evidence_type": d.evidence_type,
                "verification_status": d.verification_status,
                "citation_count": d.citation_count,
                "species": [s.common_name for s in d.species],
                "technologies": [t.name for t in d.technologies],
                "applications": [a.name for a in d.applications],
                "abstract": d.abstract,
                "findings": d.findings_summary,
                "limitations": d.limitations_summary
            })

        # 2. Search Technologies
        tech_query = db.query(Technology)
        if q:
            tech_query = tech_query.filter(
                or_(
                    Technology.name.ilike(f"%{q}%"),
                    Technology.description.ilike(f"%{q}%"),
                    Technology.what_it_measures.ilike(f"%{q}%")
                )
            )
        technologies = tech_query.limit(8).all()
        formatted_techs = [{
            "id": t.id,
            "name": t.name,
            "category": t.category,
            "description": t.description,
            "what_it_measures": t.what_it_measures,
            "maturity_level": t.maturity_level
        } for t in technologies]

        # 3. Search Species
        species_query = db.query(Species)
        if q:
            species_query = species_query.filter(
                or_(
                    Species.common_name.ilike(f"%{q}%"),
                    Species.scientific_name.ilike(f"%{q}%"),
                    Species.overview.ilike(f"%{q}%")
                )
            )
        species = species_query.limit(8).all()
        formatted_species = [{
            "id": s.id,
            "common_name": s.common_name,
            "scientific_name": s.scientific_name,
            "production_category": s.production_category,
            "overview": s.overview
        } for s in species]

        # 4. Search Applications / Use Cases
        app_query = db.query(Application)
        if q:
            app_query = app_query.filter(
                or_(
                    Application.name.ilike(f"%{q}%"),
                    Application.problem_statement.ilike(f"%{q}%"),
                    Application.decision_output.ilike(f"%{q}%")
                )
            )
        apps = app_query.limit(8).all()
        formatted_apps = [{
            "id": a.id,
            "name": a.name,
            "category": a.category,
            "problem_statement": a.problem_statement,
            "decision_output": a.decision_output
        } for a in apps]

        # 5. Search Research Gaps
        gap_query = db.query(ResearchGap)
        if q:
            gap_query = gap_query.filter(
                or_(
                    ResearchGap.title.ilike(f"%{q}%"),
                    ResearchGap.description.ilike(f"%{q}%"),
                    ResearchGap.why_this_is_a_gap.ilike(f"%{q}%")
                )
            )
        gaps = gap_query.limit(6).all()
        formatted_gaps = [{
            "id": g.id,
            "title": g.title,
            "gap_category": g.gap_category,
            "description": g.description,
            "confidence_coverage": g.confidence_coverage
        } for g in gaps]

        return {
            "query": query,
            "total_matches": len(formatted_docs) + len(formatted_techs) + len(formatted_species) + len(formatted_apps) + len(formatted_gaps),
            "documents": formatted_docs,
            "technologies": formatted_techs,
            "species": formatted_species,
            "applications": formatted_apps,
            "research_gaps": formatted_gaps
        }
