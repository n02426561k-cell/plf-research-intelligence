from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.api.deps import get_db
from app.services.assistant_service import ResearchAssistantService

router = APIRouter()

class AssistantQueryRequest(BaseModel):
    query: str

@router.post("/query")
def query_assistant(payload: AssistantQueryRequest, db: Session = Depends(get_db)):
    """
    RAG Research Assistant answering strictly from verified database records with citations.
    Falls back to 'Insufficient evidence in the current knowledge base' if unsupported.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    return ResearchAssistantService.answer_query(db=db, question=payload.query)
