from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import Application, Document

router = APIRouter()

@router.get("/")
def list_use_cases(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Lists searchable PLF use-cases: problem, technology, data, algorithm, decision, benefits, limitations."""
    q = db.query(Application)
    if category:
        q = q.filter(Application.category.ilike(f"%{category}%"))
    apps = q.all()

    results = []
    for a in apps:
        doc_count = db.query(Document).filter(Document.applications.any(Application.id == a.id)).count()
        results.append({
            "id": a.id,
            "name": a.name,
            "category": a.category,
            "problem_statement": a.problem_statement,
            "biological_signal": a.biological_signal,
            "algorithm_family": a.algorithm_family,
            "decision_output": a.decision_output,
            "expected_benefit": a.expected_benefit,
            "known_limitations": a.known_limitations or [],
            "economic_impact_summary": a.economic_impact_summary,
            "evidence_count": doc_count
        })
    return results

@router.get("/{app_id}")
def get_use_case(app_id: str, db: Session = Depends(get_db)):
    """Gets detailed use-case analysis and linked research papers."""
    a = db.query(Application).filter(Application.id == app_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Use case not found")

    docs = db.query(Document).filter(Document.applications.any(Application.id == a.id)).all()
    evidence_docs = [{
        "id": d.id,
        "title": d.title,
        "authors": [auth.name for auth in d.authors],
        "year": d.publication_year,
        "doi": d.doi,
        "findings": d.findings_summary,
        "limitations": d.limitations_summary
    } for d in docs]

    return {
        "id": a.id,
        "name": a.name,
        "category": a.category,
        "problem_statement": a.problem_statement,
        "biological_signal": a.biological_signal,
        "algorithm_family": a.algorithm_family,
        "decision_output": a.decision_output,
        "expected_benefit": a.expected_benefit,
        "known_limitations": a.known_limitations or [],
        "economic_impact_summary": a.economic_impact_summary,
        "evidence_papers": evidence_docs
    }
