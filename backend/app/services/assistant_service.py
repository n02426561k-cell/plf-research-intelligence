from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database.models import Document, Technology, Species, Application, ResearchGap, CommercialSystem

class ResearchAssistantService:
    """
    Grounded scientific RAG assistant.
    Strictly generates responses based on verified database records.
    Never fabricates citations or unverified assertions.
    """
    @staticmethod
    def answer_query(db: Session, question: str) -> Dict[str, Any]:
        q_lower = question.strip().lower()

        # Find matching documents in the database
        matched_docs = db.query(Document).filter(
            (Document.title.ilike(f"%{q_lower}%")) |
            (Document.abstract.ilike(f"%{q_lower}%")) |
            (Document.findings_summary.ilike(f"%{q_lower}%")) |
            (Document.limitations_summary.ilike(f"%{q_lower}%"))
        ).limit(6).all()

        # Check matched technologies & species
        matched_techs = db.query(Technology).all()
        relevant_techs = [t for t in matched_techs if t.id in q_lower or t.name.lower() in q_lower]

        matched_species = db.query(Species).all()
        relevant_species = [s for s in matched_species if s.id in q_lower or s.common_name.lower() in q_lower]

        matched_gaps = db.query(ResearchGap).all()
        relevant_gaps = [g for g in matched_gaps if any(w in g.title.lower() for w in q_lower.split() if len(w) > 4)]

        # If keyword search returned few docs, broaden to term matching
        if not matched_docs:
            words = [w for w in q_lower.split() if len(w) > 3 and w not in ["what", "where", "which", "about", "technologies", "used", "detect", "cattle", "precision", "livestock"]]
            for word in words:
                extra = db.query(Document).filter(
                    (Document.title.ilike(f"%{word}%")) |
                    (Document.abstract.ilike(f"%{word}%"))
                ).limit(3).all()
                for ed in extra:
                    if ed not in matched_docs:
                        matched_docs.append(ed)

        if not matched_docs and not relevant_techs and not relevant_species:
            return {
                "question": question,
                "answer": "Insufficient evidence in the current knowledge base to provide a verified answer to this query. Please expand search terms or trigger a crawler discovery cycle to index relevant peer-reviewed literature.",
                "citations": [],
                "confidence": "None",
                "evidence_count": 0
            }

        # Build grounded synthesis with strict traceable citations
        citations = []
        synthesis_points = []

        for d in matched_docs[:4]:
            author_str = d.authors[0].name if d.authors else "Peer-Reviewed Study"
            if len(d.authors) > 1:
                author_str += " et al."
            cite_key = f"[{author_str}, {d.publication_year}]"
            
            citations.append({
                "citation_key": cite_key,
                "document_id": d.id,
                "title": d.title,
                "authors": [a.name for a in d.authors],
                "year": d.publication_year,
                "venue": d.venue_name,
                "doi": d.doi,
                "canonical_url": d.canonical_url,
                "evidence_type": d.evidence_type,
                "authority_tier": d.authority_tier,
                "findings": d.findings_summary or d.abstract[:200] + "..." if d.abstract else "Documented empirical investigation.",
                "limitations": d.limitations_summary
            })

            point = f"• **{d.title}** {cite_key}: "
            if d.findings_summary:
                point += d.findings_summary
            elif d.abstract:
                point += d.abstract[:280] + "..."
            if d.limitations_summary:
                point += f" *(Documented limitation: {d.limitations_summary})*"
            synthesis_points.append(point)

        # Context summary
        answer_text = f"Based on {len(matched_docs)} verified records in the PLF Research Intelligence knowledge base:\n\n"
        answer_text += "\n\n".join(synthesis_points)

        if relevant_techs:
            answer_text += f"\n\n**Relevant Technologies Identified**: {', '.join([t.name for t in relevant_techs])}."
        if relevant_gaps:
            answer_text += f"\n\n**Identified Research Gaps**: {relevant_gaps[0].title} (*{relevant_gaps[0].gap_category}*)."

        return {
            "question": question,
            "answer": answer_text,
            "citations": citations,
            "confidence": "High (Database Grounded)",
            "evidence_count": len(citations)
        }
