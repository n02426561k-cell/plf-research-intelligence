from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import TimelineEvent

router = APIRouter()

@router.get("/")
def list_timeline_events(
    era: Optional[str] = None,
    species: Optional[str] = None,
    technology: Optional[str] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Returns chronologically ordered, authentic PLF historical milestones with citations."""
    q = db.query(TimelineEvent)
    if era:
        q = q.filter(TimelineEvent.era.ilike(f"%{era}%"))
    if species:
        q = q.filter(TimelineEvent.species_focus.ilike(f"%{species}%"))
    if technology:
        q = q.filter(TimelineEvent.technology_focus.ilike(f"%{technology}%"))
    if min_year:
        q = q.filter(TimelineEvent.year >= min_year)
    if max_year:
        q = q.filter(TimelineEvent.year <= max_year)

    events = q.order_by(TimelineEvent.year.asc()).all()

    return [{
        "id": e.id,
        "year": e.year,
        "exact_period": e.exact_period,
        "era": e.era,
        "milestone_title": e.milestone_title,
        "development_summary": e.development_summary,
        "technology_focus": e.technology_focus,
        "species_focus": e.species_focus,
        "significance": e.significance,
        "primary_source_citation": e.primary_source_citation,
        "source_url": e.source_url,
        "evidence_level": e.evidence_level,
        "document_id": e.document_id
    } for e in events]
