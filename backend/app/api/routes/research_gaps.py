from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import ResearchGap

router = APIRouter()

@router.get("/")
def list_research_gaps(db: Session = Depends(get_db)):
    """
    Returns candidate research gaps identified across literature patterns:
    single-farm bias, multimodal deficits, extensive pastoral deficits, economic ROI vacuums.
    """
    gaps = db.query(ResearchGap).all()
    return [{
        "id": g.id,
        "title": g.title,
        "gap_category": g.gap_category,
        "description": g.description,
        "why_this_is_a_gap": g.why_this_is_a_gap,
        "evidence_supporting_observation": g.evidence_supporting_observation,
        "sources_reporting_limitation": g.sources_reporting_limitation or [],
        "research_already_addressing": g.research_already_addressing,
        "open_research_questions": g.open_research_questions or [],
        "confidence_coverage": g.confidence_coverage,
        "affected_species": g.affected_species or [],
        "affected_technologies": g.affected_technologies or []
    } for g in gaps]

@router.get("/{gap_id}")
def get_research_gap(gap_id: str, db: Session = Depends(get_db)):
    g = db.query(ResearchGap).filter(ResearchGap.id == gap_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Research gap not found")

    return {
        "id": g.id,
        "title": g.title,
        "gap_category": g.gap_category,
        "description": g.description,
        "why_this_is_a_gap": g.why_this_is_a_gap,
        "evidence_supporting_observation": g.evidence_supporting_observation,
        "sources_reporting_limitation": g.sources_reporting_limitation or [],
        "research_already_addressing": g.research_already_addressing,
        "open_research_questions": g.open_research_questions or [],
        "confidence_coverage": g.confidence_coverage,
        "affected_species": g.affected_species or [],
        "affected_technologies": g.affected_technologies or []
    }
