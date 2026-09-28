from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import GlossaryTerm

router = APIRouter()

@router.get("/")
def list_glossary_terms(db: Session = Depends(get_db)):
    """Returns PLF scientific glossary with traceable primary academic definitions."""
    terms = db.query(GlossaryTerm).order_by(GlossaryTerm.term.asc()).all()
    return [{
        "id": g.id,
        "term": g.term,
        "acronym": g.acronym,
        "category": g.category,
        "definition": g.definition,
        "academic_context": g.academic_context,
        "primary_citations": g.primary_citations or []
    } for g in terms]
