from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.database.models import Source, Document

router = APIRouter()

@router.get("/")
def list_sources(db: Session = Depends(get_db)):
    """Lists indexed sources with authority tiers (A to F), crawl frequencies, and records counts."""
    sources = db.query(Source).all()
    results = []
    for s in sources:
        doc_count = db.query(Document).filter(Document.source_id == s.id).count()
        results.append({
            "id": s.id,
            "name": s.name,
            "base_url": s.base_url,
            "source_type": s.source_type,
            "authority_tier": s.authority_tier,
            "authority_description": s.authority_description,
            "rate_limit_per_min": s.rate_limit_per_min,
            "robots_txt_status": s.robots_txt_status,
            "is_active": s.is_active,
            "last_crawled_at": s.last_crawled_at.isoformat() if s.last_crawled_at else None,
            "records_count": doc_count
        })
    return results
