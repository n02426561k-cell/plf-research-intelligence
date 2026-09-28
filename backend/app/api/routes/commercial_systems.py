from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import CommercialSystem

router = APIRouter()

@router.get("/")
def list_commercial_systems(db: Session = Depends(get_db)):
    """
    Returns commercial PLF systems directory with clear separation
    between vendor marketing claims and independent scientific evidence.
    """
    systems = db.query(CommercialSystem).all()
    return [{
        "id": s.id,
        "company_name": s.company_name,
        "product_name": s.product_name,
        "species_target": s.species_target or [],
        "technology_categories": s.technology_categories or [],
        "purpose": s.purpose,
        "measurements_collected": s.measurements_collected,
        "deployment_environment": s.deployment_environment,
        "geographical_availability": s.geographical_availability,
        "vendor_claims": s.vendor_claims or [],
        "independent_evidence_summary": s.independent_evidence_summary,
        "evidence_paper_dois": s.evidence_paper_dois or [],
        "limitations": s.limitations or [],
        "website_url": s.website_url,
        "date_verified": s.date_verified
    } for s in systems]

@router.get("/{system_id}")
def get_commercial_system(system_id: str, db: Session = Depends(get_db)):
    s = db.query(CommercialSystem).filter(CommercialSystem.id == system_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Commercial system not found")

    return {
        "id": s.id,
        "company_name": s.company_name,
        "product_name": s.product_name,
        "species_target": s.species_target or [],
        "technology_categories": s.technology_categories or [],
        "purpose": s.purpose,
        "measurements_collected": s.measurements_collected,
        "deployment_environment": s.deployment_environment,
        "geographical_availability": s.geographical_availability,
        "vendor_claims": s.vendor_claims or [],
        "independent_evidence_summary": s.independent_evidence_summary,
        "evidence_paper_dois": s.evidence_paper_dois or [],
        "limitations": s.limitations or [],
        "website_url": s.website_url,
        "date_verified": s.date_verified
    }
