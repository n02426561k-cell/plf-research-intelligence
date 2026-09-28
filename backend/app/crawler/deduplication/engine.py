import re
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.database.models import Document

def normalize_doi(doi: Optional[str]) -> Optional[str]:
    if not doi:
        return None
    cleaned = doi.strip().lower()
    cleaned = re.sub(r"^https?://(dx\.)?doi\.org/", "", cleaned)
    return cleaned if cleaned else None

def normalize_title(title: str) -> str:
    cleaned = re.sub(r"[^\w\s]", "", title.lower())
    return " ".join(cleaned.split())

def calculate_jaccard_similarity(str1: str, str2: str) -> float:
    words1 = set(normalize_title(str1).split())
    words2 = set(normalize_title(str2).split())
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / len(union)

class DeduplicationEngine:
    @staticmethod
    def find_duplicate(
        db: Session,
        doi: Optional[str] = None,
        pmid: Optional[str] = None,
        openalex_id: Optional[str] = None,
        title: Optional[str] = None,
        year: Optional[int] = None
    ) -> Tuple[Optional[Document], str]:
        """
        Evaluates potential duplicate documents.
        Returns (existing_document, match_reason) if found, else (None, "").
        """
        # 1. Exact DOI match
        clean_doi = normalize_doi(doi)
        if clean_doi:
            existing = db.query(Document).filter(Document.doi == clean_doi).first()
            if existing:
                return existing, "exact_doi_match"

        # 2. Exact PMID match
        if pmid:
            existing = db.query(Document).filter(Document.pmid == pmid.strip()).first()
            if existing:
                return existing, "exact_pmid_match"

        # 3. Exact OpenAlex ID match
        if openalex_id:
            existing = db.query(Document).filter(Document.openalex_id == openalex_id.strip()).first()
            if existing:
                return existing, "exact_openalex_match"

        # 4. High title similarity (>88%) + matching publication year (±1 year)
        if title and len(title) > 20:
            query = db.query(Document)
            if year:
                query = query.filter(Document.publication_year.between(year - 1, year + 1))
            candidates = query.limit(100).all()
            for doc in candidates:
                sim = calculate_jaccard_similarity(title, doc.title)
                if sim >= 0.88:
                    return doc, f"title_similarity_match_{int(sim*100)}%"

        return None, ""
