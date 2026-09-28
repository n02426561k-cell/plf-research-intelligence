from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.models import Document, Technology, Species, Application, ResearchGap

class KnowledgeGraphService:
    @staticmethod
    def get_full_graph(db: Session) -> Dict[str, Any]:
        nodes = []
        links = []
        node_ids = set()

        # 1. Species Nodes
        species = db.query(Species).all()
        for s in species:
            node_id = f"species_{s.id}"
            if node_id not in node_ids:
                nodes.append({
                    "id": node_id,
                    "name": s.common_name,
                    "type": "Species",
                    "category": s.production_category,
                    "val": 18,
                    "color": "#10b981", # Emerald green
                    "description": s.overview[:120] + "..."
                })
                node_ids.add(node_id)

        # 2. Technology Nodes
        technologies = db.query(Technology).all()
        for t in technologies:
            node_id = f"tech_{t.id}"
            if node_id not in node_ids:
                nodes.append({
                    "id": node_id,
                    "name": t.name,
                    "type": "Technology",
                    "category": t.category,
                    "val": 16,
                    "color": "#3b82f6", # Blue
                    "description": t.what_it_measures[:120] + "..."
                })
                node_ids.add(node_id)

        # 3. Application Nodes
        applications = db.query(Application).all()
        for a in applications:
            node_id = f"app_{a.id}"
            if node_id not in node_ids:
                nodes.append({
                    "id": node_id,
                    "name": a.name,
                    "type": "Application",
                    "category": a.category,
                    "val": 14,
                    "color": "#f59e0b", # Amber
                    "description": a.problem_statement[:120] + "..."
                })
                node_ids.add(node_id)

        # 4. Document Nodes and Links
        documents = db.query(Document).limit(15).all()
        for d in documents:
            doc_node_id = f"doc_{d.id}"
            if doc_node_id not in node_ids:
                author_lead = d.authors[0].name if d.authors else "Study"
                nodes.append({
                    "id": doc_node_id,
                    "name": f"{author_lead} et al. ({d.publication_year})",
                    "full_title": d.title,
                    "type": "Document",
                    "category": d.evidence_type,
                    "val": 10,
                    "color": "#8b5cf6", # Purple
                    "doi": d.doi,
                    "description": d.title
                })
                node_ids.add(doc_node_id)

            # Link Document -> Technologies
            for t in d.technologies:
                tech_node_id = f"tech_{t.id}"
                if tech_node_id in node_ids:
                    links.append({
                        "source": doc_node_id,
                        "target": tech_node_id,
                        "label": "evaluates",
                        "color": "#cbd5e1"
                    })

            # Link Document -> Species
            for s in d.species:
                sp_node_id = f"species_{s.id}"
                if sp_node_id in node_ids:
                    links.append({
                        "source": doc_node_id,
                        "target": sp_node_id,
                        "label": "studies",
                        "color": "#cbd5e1"
                    })

            # Link Document -> Applications
            for a in d.applications:
                app_node_id = f"app_{a.id}"
                if app_node_id in node_ids:
                    links.append({
                        "source": doc_node_id,
                        "target": app_node_id,
                        "label": "addresses",
                        "color": "#cbd5e1"
                    })

        # 5. Research Gap Nodes and Links
        gaps = db.query(ResearchGap).all()
        for g in gaps:
            gap_node_id = f"gap_{g.id}"
            if gap_node_id not in node_ids:
                nodes.append({
                    "id": gap_node_id,
                    "name": g.title[:35] + "...",
                    "full_title": g.title,
                    "type": "ResearchGap",
                    "category": g.gap_category,
                    "val": 15,
                    "color": "#ef4444", # Red
                    "description": g.why_this_is_a_gap[:120] + "..."
                })
                node_ids.add(gap_node_id)

            # Link Gap -> Technologies
            for t_slug in g.affected_technologies or []:
                target_id = f"tech_{t_slug}"
                if target_id in node_ids:
                    links.append({
                        "source": gap_node_id,
                        "target": target_id,
                        "label": "limitation_in",
                        "color": "#fca5a5"
                    })

            # Link Gap -> Species
            for s_slug in g.affected_species or []:
                target_id = f"species_{s_slug}"
                if target_id in node_ids:
                    links.append({
                        "source": gap_node_id,
                        "target": target_id,
                        "label": "pertains_to",
                        "color": "#fca5a5"
                    })

        return {
            "nodes": nodes,
            "links": links,
            "total_nodes": len(nodes),
            "total_links": len(links)
        }
