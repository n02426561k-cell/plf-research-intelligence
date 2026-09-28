from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.graph_service import KnowledgeGraphService

router = APIRouter()

@router.get("/")
def get_knowledge_graph_data(db: Session = Depends(get_db)):
    """Returns nodes and links representation of the PLF entity knowledge graph."""
    return KnowledgeGraphService.get_full_graph(db)
