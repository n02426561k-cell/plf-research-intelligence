from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/overview")
def get_overview_statistics(db: Session = Depends(get_db)):
    """Returns dynamic live platform statistics calculated directly from the database."""
    return AnalyticsService.get_live_overview_stats(db)

@router.get("/landscape")
def get_landscape_analytics(db: Session = Depends(get_db)):
    """Returns dynamic research landscape distributions for charts and visualizations."""
    return AnalyticsService.get_research_landscape_analytics(db)
