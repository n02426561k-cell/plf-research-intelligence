from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import Species, Document, Technology, Application, ResearchGap

router = APIRouter()

@router.get("/")
def list_species(db: Session = Depends(get_db)):
    """Lists all livestock species covered with production systems and research counts."""
    species_list = db.query(Species).all()
    results = []
    for s in species_list:
        doc_count = db.query(Document).filter(Document.species.any(Species.id == s.id)).count()
        results.append({
            "id": s.id,
            "common_name": s.common_name,
            "scientific_name": s.scientific_name,
            "production_category": s.production_category,
            "management_systems": s.management_systems or [],
            "key_biological_signals": s.key_biological_signals or [],
            "overview": s.overview,
            "paper_count": doc_count
        })
    return results

@router.get("/{species_id}")
def get_species_hub(species_id: str, db: Session = Depends(get_db)):
    """Returns species knowledge hub: technologies used, problems addressed, research evidence, and gaps."""
    s = db.query(Species).filter(Species.id == species_id).first()
    if not s:
        # Common aliases and singular/plural mapping
        alias_map = {
            "cattle": "dairy-cattle",
            "cow": "dairy-cattle",
            "cows": "dairy-cattle",
            "pig": "pigs",
            "swine": "pigs",
            "chicken": "poultry",
            "chickens": "poultry",
            "poultry": "poultry",
            "sheep": "sheep",
            "goat": "goats",
            "goats": "goats",
            "horse": "horses",
            "horses": "horses",
            "equine": "horses",
            "fish": "aquaculture",
            "aquaculture": "aquaculture"
        }
        target_id = alias_map.get(species_id.lower())
        if target_id:
            s = db.query(Species).filter(Species.id == target_id).first()
    
    if not s:
        raise HTTPException(status_code=404, detail="Species not found")

    docs = db.query(Document).filter(Document.species.any(Species.id == s.id)).all()
    
    # Extract unique technologies used for this species
    tech_ids = set()
    for d in docs:
        for t in d.technologies:
            tech_ids.add(t.id)
    technologies = db.query(Technology).filter(Technology.id.in_(list(tech_ids))).all() if tech_ids else []

    # Extract unique applications addressed
    app_ids = set()
    for d in docs:
        for a in d.applications:
            app_ids.add(a.id)
    applications = db.query(Application).filter(Application.id.in_(list(app_ids))).all() if app_ids else []

    # Extract gaps affecting this species
    all_gaps = db.query(ResearchGap).all()
    relevant_gaps = [g for g in all_gaps if s.id in (g.affected_species or [])]

    return {
        "id": s.id,
        "common_name": s.common_name,
        "scientific_name": s.scientific_name,
        "production_category": s.production_category,
        "management_systems": s.management_systems or [],
        "key_biological_signals": s.key_biological_signals or [],
        "overview": s.overview,
        "technologies_used": [{"id": t.id, "name": t.name, "category": t.category, "maturity_level": t.maturity_level} for t in technologies],
        "applications_addressed": [{"id": a.id, "name": a.name, "category": a.category, "decision_output": a.decision_output} for a in applications],
        "research_gaps": [{"id": g.id, "title": g.title, "gap_category": g.gap_category, "why_this_is_a_gap": g.why_this_is_a_gap} for g in relevant_gaps],
        "research_papers": [{
            "id": d.id,
            "title": d.title,
            "authors": [a.name for a in d.authors],
            "year": d.publication_year,
            "venue": d.venue_name,
            "doi": d.doi,
            "findings": d.findings_summary,
            "limitations": d.limitations_summary
        } for d in docs[:10]]
    }
