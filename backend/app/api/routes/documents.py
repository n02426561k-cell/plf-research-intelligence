from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel
from app.api.deps import get_db
from app.database.models import Document, Species, Technology, Application

router = APIRouter()

class DocumentStatusUpdate(BaseModel):
    verification_status: str
    verification_notes: Optional[str] = None

@router.get("/")
def list_documents(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    species_id: Optional[str] = None,
    technology_id: Optional[str] = None,
    application_id: Optional[str] = None,
    authority_tier: Optional[str] = None,
    verification_status: Optional[str] = None,
    is_open_access: Optional[bool] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    sort_by: str = Query("recent", pattern="^(recent|citations|year_asc)$"),
    query: Optional[str] = None,
    geographic_region: Optional[str] = None
):
    """Lists research literature documents with rich multi-axis filters and pagination."""
    q = db.query(Document)

    if query:
        term = f"%{query.strip().lower()}%"
        q = q.filter(
            or_(
                Document.title.ilike(term),
                Document.abstract.ilike(term),
                Document.venue_name.ilike(term),
                Document.findings_summary.ilike(term)
            )
        )

    if geographic_region:
        q = q.filter(Document.geographic_region.ilike(f"%{geographic_region.strip()}%"))

    if species_id:
        q = q.filter(Document.species.any(Species.id == species_id))
    if technology_id:
        q = q.filter(Document.technologies.any(Technology.id == technology_id))
    if application_id:
        q = q.filter(Document.applications.any(Application.id == application_id))
    if authority_tier:
        q = q.filter(Document.authority_tier == authority_tier)
    if verification_status:
        q = q.filter(Document.verification_status == verification_status)
    if is_open_access is not None:
        q = q.filter(Document.is_open_access == is_open_access)
    if min_year:
        q = q.filter(Document.publication_year >= min_year)
    if max_year:
        q = q.filter(Document.publication_year <= max_year)

    total = q.count()

    if sort_by == "citations":
        q = q.order_by(Document.citation_count.desc())
    elif sort_by == "year_asc":
        q = q.order_by(Document.publication_year.asc())
    else: # recent
        q = q.order_by(Document.publication_year.desc(), Document.id.desc())

    offset = (page - 1) * page_size
    items = q.offset(offset).limit(page_size).all()

    formatted_items = []
    for d in items:
        formatted_items.append({
            "id": d.id,
            "doi": d.doi,
            "pmid": d.pmid,
            "openalex_id": d.openalex_id,
            "canonical_url": d.canonical_url,
            "title": d.title,
            "abstract": d.abstract,
            "publication_year": d.publication_year,
            "published_date": d.published_date,
            "venue_name": d.venue_name,
            "citation_count": d.citation_count,
            "is_open_access": d.is_open_access,
            "open_access_url": d.open_access_url,
            "peer_reviewed": d.peer_reviewed,
            "evidence_type": d.evidence_type,
            "authority_tier": d.authority_tier,
            "methodology_summary": d.methodology_summary,
            "sample_size_details": d.sample_size_details,
            "dataset_environment": d.dataset_environment,
            "findings_summary": d.findings_summary,
            "limitations_summary": d.limitations_summary,
            "verification_status": d.verification_status,
            "verification_notes": d.verification_notes,
            "geographic_region": d.geographic_region,
            "country": d.country,
            "source_name": d.source.name if d.source else "Scholarly Source",
            "authors": [{"id": a.id, "name": a.name, "affiliation": a.affiliation, "country": a.country} for a in d.authors],
            "institutions": [{"id": i.id, "name": i.name, "country": i.country} for i in d.institutions],
            "technologies": [{"id": t.id, "name": t.name, "category": t.category} for t in d.technologies],
            "species": [{"id": s.id, "common_name": s.common_name} for s in d.species],
            "applications": [{"id": a.id, "name": a.name, "category": a.category} for a in d.applications]
        })

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 1,
        "items": formatted_items
    }

@router.get("/{document_id}")
def get_document_details(document_id: int, db: Session = Depends(get_db)):
    """Retrieves full traceable metadata and citation details for an individual document."""
    d = db.query(Document).filter(Document.id == document_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": d.id,
        "doi": d.doi,
        "pmid": d.pmid,
        "openalex_id": d.openalex_id,
        "canonical_url": d.canonical_url,
        "title": d.title,
        "abstract": d.abstract,
        "publication_year": d.publication_year,
        "published_date": d.published_date,
        "venue_name": d.venue_name,
        "citation_count": d.citation_count,
        "is_open_access": d.is_open_access,
        "open_access_url": d.open_access_url,
        "peer_reviewed": d.peer_reviewed,
        "evidence_type": d.evidence_type,
        "authority_tier": d.authority_tier,
        "methodology_summary": d.methodology_summary,
        "sample_size_details": d.sample_size_details,
        "dataset_environment": d.dataset_environment,
        "findings_summary": d.findings_summary,
        "limitations_summary": d.limitations_summary,
        "verification_status": d.verification_status,
        "verification_notes": d.verification_notes,
        "geographic_region": d.geographic_region,
        "country": d.country,
        "retrieved_at": d.retrieved_at.isoformat() if d.retrieved_at else None,
        "source": {
            "id": d.source.id,
            "name": d.source.name,
            "authority_tier": d.source.authority_tier,
            "base_url": d.source.base_url
        } if d.source else None,
        "authors": [{"id": a.id, "name": a.name, "affiliation": a.affiliation, "country": a.country} for a in d.authors],
        "institutions": [{"id": i.id, "name": i.name, "country": i.country} for i in d.institutions],
        "technologies": [{"id": t.id, "name": t.name, "category": t.category, "description": t.description} for t in d.technologies],
        "species": [{"id": s.id, "common_name": s.common_name, "scientific_name": s.scientific_name} for s in d.species],
        "applications": [{"id": a.id, "name": a.name, "category": a.category, "problem_statement": a.problem_statement} for a in d.applications]
    }

@router.patch("/{document_id}/status")
def update_verification_status(document_id: int, payload: DocumentStatusUpdate, db: Session = Depends(get_db)):
    """Allows researchers to update document verification status."""
    d = db.query(Document).filter(Document.id == document_id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Document not found")
    
    valid_statuses = ["Verified", "Needs Review", "Conflicting Evidence", "Outdated", "Insufficient Evidence"]
    if payload.verification_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")

    d.verification_status = payload.verification_status
    if payload.verification_notes is not None:
        d.verification_notes = payload.verification_notes
    db.commit()
    return {"message": "Status updated successfully", "status": d.verification_status}
