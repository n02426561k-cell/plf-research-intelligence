import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "PLF Research Intelligence"
    PROJECT_SUBTITLE: str = "A Living Knowledge Base for Precision Livestock Farming"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./plf_research.db")
    
    # Crawler Settings
    USER_AGENT: str = "PLF-Research-Bot/1.0 (+https://plf-research.org/methodology; research@plf-intel.org)"
    MAX_CRAWL_DEPTH: int = 2
    RATE_LIMIT_PER_SECOND: float = 2.0
    ENABLE_REAL_TIME_DISCOVERY: bool = True
    
    # Admin security
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "plf-research-admin-key-2025")

    class Config:
        case_sensitive = True

settings = Settings()
