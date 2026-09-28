from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.search_service import SearchService

router = APIRouter()

@router.get("/")
def execute_search(
    q: str = Query(..., min_length=1),
    species_id: Optional[str] = None,
    technology_id: Optional[str] = None,
    category: Optional[str] = None,
    min_year: Optional[int] = None,
    max_year: Optional[int] = None,
    open_access_only: bool = False,
    limit: int = 30,
    db: Session = Depends(get_db)
):
    """Executes unified cross-entity search across literature, technologies, species, use-cases, and gaps."""
    return SearchService.global_search(
        db=db,
        query=q,
        species_id=species_id,
        technology_id=technology_id,
        category=category,
        min_year=min_year,
        max_year=max_year,
        open_access_only=open_access_only,
        limit=limit
    )
