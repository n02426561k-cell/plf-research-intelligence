from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import Technology, Document

router = APIRouter()

@router.get("/")
def list_technologies(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Lists all PLF technologies categorized with maturity levels and metrics."""
    q = db.query(Technology)
    if category:
        q = q.filter(Technology.category.ilike(category))
    techs = q.all()

    results = []
    for t in techs:
        doc_count = db.query(Document).filter(Document.technologies.any(Technology.id == t.id)).count()
        results.append({
            "id": t.id,
            "name": t.name,
            "category": t.category,
            "description": t.description,
            "what_it_measures": t.what_it_measures,
            "maturity_level": t.maturity_level,
            "advantages": t.advantages or [],
            "limitations": t.limitations or [],
            "cost_level": t.cost_level,
            "power_requirements": t.power_requirements,
            "connectivity_needs": t.connectivity_needs,
            "paper_count": doc_count
        })
    return results

@router.get("/{tech_id}")
def get_technology(tech_id: str, db: Session = Depends(get_db)):
    """Gets complete technical specifications and linked evidence for a technology."""
    t = db.query(Technology).filter(Technology.id == tech_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Technology not found")

    docs = db.query(Document).filter(Document.technologies.any(Technology.id == t.id)).limit(10).all()
    evidence_docs = [{
        "id": d.id,
        "title": d.title,
        "authors": [a.name for a in d.authors],
        "year": d.publication_year,
        "doi": d.doi,
        "findings": d.findings_summary,
        "limitations": d.limitations_summary
    } for d in docs]

    return {
        "id": t.id,
        "name": t.name,
        "category": t.category,
        "description": t.description,
        "what_it_measures": t.what_it_measures,
        "maturity_level": t.maturity_level,
        "advantages": t.advantages or [],
        "limitations": t.limitations or [],
        "cost_level": t.cost_level,
        "power_requirements": t.power_requirements,
        "connectivity_needs": t.connectivity_needs,
        "evidence_papers": evidence_docs
    }
