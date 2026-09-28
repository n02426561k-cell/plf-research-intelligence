import httpx
import json

queries = [
    "precision livestock farming Africa",
    "livestock tracking pastoralism Kenya",
    "cattle GPS tracking Zimbabwe rangeland",
    "electronic identification livestock South Africa",
    "smart livestock farming smallholder Africa",
    "rangeland livestock monitoring sensor Africa",
    "livestock disease early warning IoT Africa",
    "precision agriculture livestock Ethiopia pastoral"
]

OPENALEX_API = "https://api.openalex.org/works"
HEADERS = {"User-Agent": "PLF-Research-Intelligence/1.0 (mailto:info@plf-intelligence.org)"}

found = []
seen_ids = set()

with httpx.Client(timeout=15.0) as client:
    for q in queries:
        res = client.get(OPENALEX_API, params={"search": q, "per-page": 8, "sort": "cited_by_count:desc"}, headers=HEADERS)
        if res.status_code == 200:
            results = res.json().get("results", [])
            print(f"Query '{q}': found {len(results)} works")
            for w in results:
                wid = w.get("id")
                if wid not in seen_ids:
                    seen_ids.add(wid)
                    title = w.get("title")
                    year = w.get("publication_year")
                    doi = w.get("doi")
                    venue = w.get("primary_location", {}).get("source", {}).get("display_name")
                    citations = w.get("cited_by_count", 0)
                    found.append({"id": wid, "title": title, "year": year, "doi": doi, "venue": venue, "citations": citations})
        else:
            print(f"Failed query '{q}': status {res.status_code}")

print(f"\nTotal unique works found: {len(found)}")
for i, f in enumerate(found[:15]):
    print(f"{i+1}. [{f['year']}] {f['title']} ({f['venue']}) - Citations: {f['citations']}")
