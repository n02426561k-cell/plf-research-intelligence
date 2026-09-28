import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.crawler.rate_limiter import rate_limiter

class OpenAlexHarvester:
    BASE_URL = "https://api.openalex.org/works"

    @classmethod
    async def search_works(cls, query: str = "Precision Livestock Farming", per_page: int = 15) -> List[Dict[str, Any]]:
        """
        Queries OpenAlex open scholarly works API respecting rate limits and polite User-Agent.
        """
        await rate_limiter.wait_for_domain("api.openalex.org", min_delay=0.5)
        headers = {
            "User-Agent": settings.USER_AGENT,
            "Accept": "application/json"
        }
        params = {
            "search": query,
            "per-page": per_page,
            "sort": "cited_by_count:desc"
        }
        
        results = []
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(cls.BASE_URL, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    works = data.get("results", [])
                    for work in works:
                        # Extract structured metadata
                        doi = work.get("doi")
                        if doi:
                            doi = doi.replace("https://doi.org/", "")
                        
                        authors = []
                        for authorship in work.get("authorships", []):
                            author_obj = authorship.get("author", {})
                            name = author_obj.get("display_name")
                            if name:
                                authors.append(name)

                        # Extract abstract from inverted index if present
                        abstract = None
                        inverted_index = work.get("abstract_inverted_index")
                        if inverted_index:
                            word_positions = []
                            for word, positions in inverted_index.items():
                                for pos in positions:
                                    word_positions.append((pos, word))
                            word_positions.sort(key=lambda x: x[0])
                            abstract = " ".join([w[1] for w in word_positions])

                        venue = work.get("primary_location", {}).get("source", {}).get("display_name") or "Scholarly Publication"
                        oa_status = work.get("open_access", {})

                        results.append({
                            "openalex_id": work.get("id"),
                            "doi": doi,
                            "title": work.get("title") or "Untitled PLF Research",
                            "abstract": abstract,
                            "publication_year": work.get("publication_year") or 2023,
                            "published_date": work.get("publication_date"),
                            "venue_name": venue,
                            "citation_count": work.get("cited_by_count", 0),
                            "is_open_access": oa_status.get("is_oa", False),
                            "open_access_url": oa_status.get("oa_url"),
                            "canonical_url": work.get("doi") or work.get("id") or "https://openalex.org",
                            "authors": authors,
                            "source_name": "OpenAlex Scholarly Graph",
                            "authority_tier": "A"
                        })
        except Exception as e:
            print(f"[OpenAlexHarvester] Error fetching data: {e}")

        return results
