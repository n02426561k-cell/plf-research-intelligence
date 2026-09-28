# PLF Research Intelligence
> **A Living Knowledge Base for Precision Livestock Farming**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat&logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-Academic%20Open-blue.svg)](LICENSE)

An academic-grade, evidence-driven research discovery and synthesis platform designed to serve researchers, agricultural students, veterinarians, livestock engineers, policymakers, and innovative livestock producers worldwide.

---

## Overarching Research Mission

The platform synthesizes the core question:
> *"What is currently known about Precision Livestock Farming (PLF), how has it evolved, where is it being used, what technologies exist, what evidence supports them, what problems remain unsolved, and where are the research and implementation opportunities?"*

---

## Architectural Principles

1. **Strict Epistemological Rigor:**
   - Explicit operational separation between **Data**, **Interpretation**, **Vendor Claims**, **Independent Scientific Evidence**, **Candidate Gaps**, and **Exploratory Hypotheses**.
   - Commercial systems are tracked alongside their empirical peer-reviewed validation status and authority tiers (Tier A: Peer-reviewed/official; Tier B: Institutional/FAO; Tier C: Industry whitepapers; Tier D: Unverified vendor marketing).
2. **Ethical Web Harvesting & Provenance:**
   - Adheres strictly to `robots.txt` and polite token-bucket rate limits per domain.
   - Preserves source citations, DOIs, PMIDs, OpenAlex work IDs, and retrieval timestamps.
   - Zero paywall circumvention or ungrounded synthetic citations.
3. **Inclusive Global Scope:**
   - Covers intensive indoor housing (Europe, North America) alongside extensive rangelands, pastoral systems, and smallholder farming in sub-Saharan Africa.
4. **Grounded In-App RAG Research Assistant:**
   - Interactive conversational assistant citing indexed peer-reviewed literature with direct source links.

---

## System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       External Scholarly Sources       │
                               │  (OpenAlex, Crossref, PubMed, etc.)    │
                               └───────────────────┬────────────────────┘
                                                   │ Polite Rate-Limited
                                                   │ Ingestion / Harvester
                                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend (:8000)                         │
│  ┌──────────────────────┐  ┌───────────────────┐  ┌─────────────────┐  │
│  │ Ingestion & Crawler  │  │ Multi-Axis        │  │ Grounded RAG    │  │
│  │ (Rate Limiter)       │  │ Classifier        │  │ Assistant Engine│  │
│  └──────────────────────┘  └───────────────────┘  └─────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 15 REST API Routers (/documents, /stats, /graph, /species, etc.) │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                  │                                     │
│                                  ▼                                     │
│                 SQLite Database (plf_research.db)                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ JSON REST API
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 14 Frontend (:3005)                     │
│  ┌──────────────────────┐  ┌───────────────────┐  ┌─────────────────┐  │
│  │ Academic Card UI &   │  │ 20+ Research Hub  │  │ Interactive     │  │
│  │ Glassmorphism Tokens │  │ Views & Tables    │  │ Evidence Drawer │  │
│  └──────────────────────┘  └───────────────────┘  └─────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Global Search (⌘K), Knowledge Graph, Assistant Floating Widget    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Windows PowerShell / Terminal

### 1. One-Click Launch (PowerShell)
From the root repository directory:
```powershell
.\start.ps1
```
This automatically launches:
- **Backend API Server**: `http://localhost:8000` (Swagger UI: `http://localhost:8000/docs`)
- **Frontend Web Platform**: `http://localhost:3000`

---

### 2. Manual Startup

#### Backend Server
```powershell
# In root directory
.\venv\Scripts\Activate.ps1
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend Development Server
```powershell
cd frontend
npm run dev
# Or for production mode:
npm run build
npm start
```

---

## Knowledge Base Navigation & Pages

| Route | Focus & Scientific Scope |
|---|---|
| `/` | **Platform Homepage**: Animated live metric counters, ambient glow hero, knowledge hub index |
| `/what-is-plf` | **Foundational Synthesis**: Continuous, automated individual animal monitoring paradigms |
| `/technologies` | **Sensing & Hardware**: Computer vision, acoustics, accelerometers, boluses, thermal imaging, AMS |
| `/species` | **Species Taxonomies**: Dairy & beef cattle, swine, poultry (broilers/layers), sheep, goats, aquaculture |
| `/applications` | **Functional Domains**: Lameness detection, mastitis, estrus, weight estimation, enteric methane |
| `/research-landscape` | **Bibliometrics**: Publication growth trajectory, species distribution, technology maturity |
| `/literature` | **Evidence Repository**: Filterable peer-reviewed papers with full methodology and verification badges |
| `/existing-systems` | **Commercial PLF Directory**: Industry solutions evaluated against independent academic evidence |
| `/comparison` | **Academic Benchmark Matrix**: Systematic comparison across technologies, cost, accuracy, and power |
| `/research-gaps` | **Scientific Frontier**: Unsolved challenges (single-farm bias, battery life, alert fatigue, interoperability) |
| `/timeline` | **Historical Chronology**: Evolution from 1970s RFID cattle tracking to modern edge Vision Transformers |
| `/knowledge-graph` | **Interactive Graph**: Bi-directional graph linking technologies, species, applications, and documents |
| `/regional-plf` | **Geographic Analysis**: Intensive indoor vs pasture grazing vs sub-Saharan Africa smallholder PLF |
| `/sources` | **Provenance & Transparency**: Indexed scholarly APIs, authority tiers (Tier A-D), and crawl status |
| `/glossary` | **Terminology Dictionary**: Academic and technical definitions for key PLF terminology |
| `/methodology` | **Epistemological Protocol**: Quality assurance, evidence categorization, and deduplication logic |
| `/admin` | **Crawler Operations**: Trigger live OpenAlex/Crossref harvesting and monitor background jobs |
| `/about` | **Project Purpose & Scope**: Core mission and scientific principles |

---

## Backend REST API Endpoints

Interactive Swagger documentation is available at `http://localhost:8000/docs`.

### Core Endpoints:
- `GET /api/health` — System status and database connectivity check
- `GET /api/stats/overview` — Aggregated counts across all indexed entities
- `GET /api/stats/landscape` — Time-series publication trends and technology/species distributions
- `GET /api/documents` — Filterable scholarly literature with pagination, species, and technology filters
- `GET /api/technologies` — Comprehensive sensor and hardware taxonomy
- `GET /api/species` — Target animal biology, signals, and management systems
- `GET /api/use-cases` — Applied problems, biological signals, and algorithm families
- `GET /api/commercial-systems` — Market solutions, claims, and independent verification status
- `GET /api/research-gaps` — Open research challenges and unresolved questions
- `GET /api/timeline` — Chronological milestones in PLF history
- `GET /api/graph` — Network nodes and links for knowledge graph visualization
- `GET /api/sources` — Harvester registry and authority tiers
- `GET /api/glossary` — Domain terminology and concepts
- `POST /api/assistant/query` — Grounded RAG assistant answering user research inquiries
- `POST /api/crawler/trigger` — Trigger rate-limited scholarly harvesting jobs

---

## Technology Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic v2, Uvicorn, httpx, BeautifulSoup4
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React
- **Design System**: Academic-grade typography (Inter, Outfit), CSS tokens, glassmorphism, responsive data grids, animated counters, dark mode support

---

## Scientific Citation & Evidence Policy

All literature and claims cataloged on this platform must feature verifiable provenance:
- **DOI (Digital Object Identifier)** link
- **Author Cohort & Institutional Affiliation**
- **Methodology & Sample Size Characterization**
- **Explicit Limitations & Dataset Environment** (Commercial vs Research vs Lab)

Vendor claims are strictly separated from peer-reviewed evidence to protect users against marketing bias and unvalidated performance claims.
