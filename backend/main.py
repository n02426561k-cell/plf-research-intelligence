from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database.session import engine, SessionLocal
from app.database.models import Base
from app.database.seed_data import populate_seed_data

# Import Routes
from app.api.routes import (
    stats, documents, technologies, species, use_cases,
    timeline, commercial_systems, research_gaps, sources,
    glossary, taxonomy, search, assistant, crawler_admin, graph
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables and seed data exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        populate_seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_SUBTITLE,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for Frontend Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes under /api
app.include_router(stats.router, prefix="/api/stats", tags=["Live Statistics & Analytics"])
app.include_router(documents.router, prefix="/api/documents", tags=["Literature & Scholarly Documents"])
app.include_router(technologies.router, prefix="/api/technologies", tags=["PLF Technologies"])
app.include_router(species.router, prefix="/api/species", tags=["Livestock Species Hubs"])
app.include_router(use_cases.router, prefix="/api/use-cases", tags=["Applications & Use Cases"])
app.include_router(timeline.router, prefix="/api/timeline", tags=["Evolution Timeline"])
app.include_router(commercial_systems.router, prefix="/api/commercial-systems", tags=["Commercial Systems & Claims vs Evidence"])
app.include_router(research_gaps.router, prefix="/api/research-gaps", tags=["Research Gaps Explorer"])
app.include_router(sources.router, prefix="/api/sources", tags=["Indexed Scholarly Sources"])
app.include_router(glossary.router, prefix="/api/glossary", tags=["Scientific Glossary"])
app.include_router(taxonomy.router, prefix="/api/taxonomy", tags=["Taxonomy & Terminology Dictionary"])
app.include_router(search.router, prefix="/api/search", tags=["Global Unified Search"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Grounded Research Assistant"])
app.include_router(crawler_admin.router, prefix="/api/crawler", tags=["Crawler Administration & Harvest Engine"])
app.include_router(graph.router, prefix="/api/graph", tags=["Knowledge Graph Visualizer"])

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
