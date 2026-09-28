import httpx
from typing import List, Dict, Any
from app.core.config import settings
from app.crawler.rate_limiter import rate_limiter

class CrossrefHarvester:
    BASE_URL = "https://api.crossref.org/works"

    @classmethod
    async def search_works(cls, query: str = "precision livestock farming", rows: int = 15) -> List[Dict[str, Any]]:
        """
        Queries Crossref metadata API with polite headers and rate limiting.
        """
        await rate_limiter.wait_for_domain("api.crossref.org", min_delay=1.0)
        headers = {
            "User-Agent": settings.USER_AGENT,
            "Accept": "application/json"
        }
        params = {
            "query": query,
            "rows": rows,
            "sort": "relevance",
            "select": "DOI,title,abstract,author,published,container-title,is-referenced-by-count,URL"
        }

        results = []
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(cls.BASE_URL, params=params, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    items = data.get("message", {}).get("items", [])
                    for item in items:
                        title_list = item.get("title", [])
                        title = title_list[0] if title_list else "Untitled Work"
                        
                        doi = item.get("DOI")
                        authors = []
                        for a in item.get("author", []):
                            given = a.get("given", "")
                            family = a.get("family", "")
                            full = f"{given} {family}".strip()
                            if full:
                                authors.append(full)

                        # Extract publication year
                        pub_year = 2023
                        pub_date_parts = item.get("published", {}).get("date-parts", [[]])
                        if pub_date_parts and pub_date_parts[0]:
                            pub_year = pub_date_parts[0][0]

                        container = item.get("container-title", [])
                        venue = container[0] if container else "Academic Journal"

                        abstract = item.get("abstract")
                        if abstract:
                            # Strip basic JATS XML tags if present in Crossref abstracts
                            import re
                            abstract = re.sub(r"<[^>]+>", "", abstract).strip()

                        results.append({
                            "doi": doi,
                            "title": title,
                            "abstract": abstract,
                            "publication_year": pub_year,
                            "venue_name": venue,
                            "citation_count": item.get("is-referenced-by-count", 0),
                            "canonical_url": item.get("URL") or (f"https://doi.org/{doi}" if doi else "https://crossref.org"),
                            "is_open_access": False,
                            "authors": authors,
                            "source_name": "Crossref Metadata Hub",
                            "authority_tier": "A"
                        })
        except Exception as e:
            print(f"[CrossrefHarvester] Error fetching data: {e}")

        return results
