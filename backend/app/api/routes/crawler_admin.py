import asyncio
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_db
from app.database.models import CrawlJob, CrawlError, Document
from app.crawler.engine import CrawlerEngine
from app.crawler.classifiers.taxonomy_classifier import TaxonomyClassifier
from app.database.session import SessionLocal

router = APIRouter()

class CrawlTriggerRequest(BaseModel):
    query: Optional[str] = "Precision Livestock Farming"
    limit_per_source: Optional[int] = 10

def background_crawl_task(query: str, limit: int):
    db = SessionLocal()
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(CrawlerEngine.run_discovery_cycle(db=db, query=query, limit_per_source=limit))
    finally:
        db.close()

@router.get("/status")
def get_crawler_status(db: Session = Depends(get_db)):
    """Returns current crawler status, last run, running job, and summary counts."""
    is_running = CrawlerEngine.is_running()
    latest_job = db.query(CrawlJob).order_by(CrawlJob.started_at.desc()).first()
    
    total_jobs = db.query(CrawlJob).count()
    total_errors = db.query(CrawlError).count()

    return {
        "is_running": is_running,
        "latest_job": {
            "id": latest_job.id,
            "status": latest_job.status,
            "started_at": latest_job.started_at.isoformat() if latest_job else None,
            "completed_at": latest_job.completed_at.isoformat() if (latest_job and latest_job.completed_at) else None,
            "records_discovered": latest_job.records_discovered if latest_job else 0,
            "records_processed": latest_job.records_processed if latest_job else 0,
            "duplicates_removed": latest_job.duplicates_removed if latest_job else 0,
            "error_count": latest_job.error_count if latest_job else 0,
            "logs": latest_job.logs if latest_job else []
        } if latest_job else None,
        "total_jobs_run": total_jobs,
        "total_errors_logged": total_errors
    }

@router.post("/start")
def start_crawl_job(payload: CrawlTriggerRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Triggers an asynchronous scholarly discovery cycle for permitted open scholarly sources."""
    if CrawlerEngine.is_running():
        raise HTTPException(status_code=409, detail="Crawler is currently already executing a job.")

    background_tasks.add_task(background_crawl_task, payload.query, payload.limit_per_source)
    return {
        "message": f"Discovery cycle initiated in background for query: '{payload.query}'",
        "status": "initiated"
    }

@router.get("/jobs")
def list_crawl_jobs(limit: int = 15, db: Session = Depends(get_db)):
    """Lists history of automated crawl runs and logs."""
    jobs = db.query(CrawlJob).order_by(CrawlJob.started_at.desc()).limit(limit).all()
    return [{
        "id": j.id,
        "job_type": j.job_type,
        "source_target": j.source_target,
        "status": j.status,
        "records_discovered": j.records_discovered,
        "records_processed": j.records_processed,
        "duplicates_removed": j.duplicates_removed,
        "error_count": j.error_count,
        "started_at": j.started_at.isoformat() if j.started_at else None,
        "completed_at": j.completed_at.isoformat() if j.completed_at else None,
        "logs": j.logs or []
    } for j in jobs]

@router.get("/errors")
def list_crawl_errors(limit: int = 20, db: Session = Depends(get_db)):
    """Lists logged crawler anomalies, timeouts, and rate limit occurrences."""
    errors = db.query(CrawlError).order_by(CrawlError.timestamp.desc()).limit(limit).all()
    return [{
        "id": e.id,
        "job_id": e.job_id,
        "source_url": e.source_url,
        "error_code": e.error_code,
        "error_message": e.error_message,
        "timestamp": e.timestamp.isoformat() if e.timestamp else None
    } for e in errors]

@router.post("/reclassify")
def reclassify_all_documents(db: Session = Depends(get_db)):
    """Re-runs the multi-axis taxonomy classifier across all stored documents using updated dictionary rules."""
    docs = db.query(Document).all()
    reclassified_count = 0

    for d in docs:
        classification = TaxonomyClassifier.classify_text(
            db=db,
            title=d.title,
            abstract=d.abstract or ""
        )
        if classification["regions"]:
            d.geographic_region = classification["regions"][0]
        reclassified_count += 1

    db.commit()
    return {"message": f"Successfully re-evaluated {reclassified_count} documents against current taxonomy rules."}
