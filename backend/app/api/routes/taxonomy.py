from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api.deps import get_db
from app.database.models import TaxonomyTerm

router = APIRouter()

class TaxonomyTermCreate(BaseModel):
    category: str
    canonical_term: str
    synonyms: List[str]
    regex_pattern: Optional[str] = None
    description: Optional[str] = None

class TaxonomyTermUpdate(BaseModel):
    category: Optional[str] = None
    synonyms: Optional[List[str]] = None
    regex_pattern: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/")
def list_taxonomy_terms(db: Session = Depends(get_db)):
    """Returns the configurable PLF taxonomy and research terminology dictionary."""
    terms = db.query(TaxonomyTerm).all()
    return [{
        "id": t.id,
        "category": t.category,
        "canonical_term": t.canonical_term,
        "synonyms": t.synonyms or [],
        "regex_pattern": t.regex_pattern,
        "description": t.description,
        "is_active": t.is_active,
        "updated_at": t.updated_at.isoformat() if t.updated_at else None
    } for t in terms]

@router.post("/")
def create_taxonomy_term(payload: TaxonomyTermCreate, db: Session = Depends(get_db)):
    existing = db.query(TaxonomyTerm).filter(TaxonomyTerm.canonical_term.ilike(payload.canonical_term)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Canonical term already exists in dictionary")

    new_term = TaxonomyTerm(
        category=payload.category,
        canonical_term=payload.canonical_term,
        synonyms=payload.synonyms,
        regex_pattern=payload.regex_pattern,
        description=payload.description,
        is_active=True
    )
    db.add(new_term)
    db.commit()
    db.refresh(new_term)
    return {"message": "Taxonomy term created successfully", "id": new_term.id}

@router.put("/{term_id}")
def update_taxonomy_term(term_id: int, payload: TaxonomyTermUpdate, db: Session = Depends(get_db)):
    term = db.query(TaxonomyTerm).filter(TaxonomyTerm.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Taxonomy term not found")

    if payload.category is not None:
        term.category = payload.category
    if payload.synonyms is not None:
        term.synonyms = payload.synonyms
    if payload.regex_pattern is not None:
        term.regex_pattern = payload.regex_pattern
    if payload.description is not None:
        term.description = payload.description
    if payload.is_active is not None:
        term.is_active = payload.is_active

    db.commit()
    return {"message": "Taxonomy term updated successfully"}
