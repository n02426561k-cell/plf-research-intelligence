from datetime import datetime
import json
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Table, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

# Association Tables
document_technologies = Table(
    "document_technologies",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True),
    Column("technology_id", String(64), ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True)
)

document_species = Table(
    "document_species",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True),
    Column("species_id", String(64), ForeignKey("species.id", ondelete="CASCADE"), primary_key=True)
)

document_applications = Table(
    "document_applications",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True),
    Column("application_id", String(64), ForeignKey("applications.id", ondelete="CASCADE"), primary_key=True)
)

document_authors = Table(
    "document_authors",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True),
    Column("author_id", Integer, ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True)
)

document_institutions = Table(
    "document_institutions",
    Base.metadata,
    Column("document_id", Integer, ForeignKey("documents.id", ondelete="CASCADE"), primary_key=True),
    Column("institution_id", Integer, ForeignKey("institutions.id", ondelete="CASCADE"), primary_key=True)
)


class Source(Base):
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    base_url = Column(String(512), nullable=False)
    source_type = Column(String(64), default="scholarly_api") # scholarly_api, journal_feed, repo, vendor, govt
    authority_tier = Column(String(8), default="A") # A (Peer-reviewed), B (Govt), C (Uni), D (Vendor), E (Prof), F (Web)
    authority_description = Column(String(255), nullable=True)
    rate_limit_per_min = Column(Integer, default=60)
    robots_txt_status = Column(String(64), default="Permitted")
    is_active = Column(Boolean, default=True)
    last_crawled_at = Column(DateTime, nullable=True)
    records_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    documents = relationship("Document", back_populates="source")


class Author(Base):
    __tablename__ = "authors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    orcid = Column(String(64), nullable=True, unique=True)
    affiliation = Column(String(512), nullable=True)
    country = Column(String(128), nullable=True)
    
    documents = relationship("Document", secondary=document_authors, back_populates="authors")


class Institution(Base):
    __tablename__ = "institutions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    country = Column(String(128), nullable=True, index=True)
    institution_type = Column(String(64), default="University") # University, Research Institute, Govt Agency, Enterprise
    ror_id = Column(String(128), nullable=True)
    
    documents = relationship("Document", secondary=document_institutions, back_populates="institutions")


class Technology(Base):
    __tablename__ = "technologies"
    
    id = Column(String(64), primary_key=True) # slug e.g. "computer-vision", "rfid"
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False, index=True) # Identification, Wearables, Vision, Audio, Environmental, Location, Analytics, Automation
    description = Column(Text, nullable=False)
    what_it_measures = Column(Text, nullable=False)
    maturity_level = Column(String(64), default="Field-Validated") # Emerging, Research-Stage, Field-Validated, Commercial Standard
    advantages = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    cost_level = Column(String(64), default="Moderate") # Low, Moderate, High, Capital Intensive
    power_requirements = Column(String(128), default="Battery / Low-power")
    connectivity_needs = Column(String(128), default="LoRaWAN / Wi-Fi / Cellular")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    documents = relationship("Document", secondary=document_technologies, back_populates="technologies")


class Species(Base):
    __tablename__ = "species"
    
    id = Column(String(64), primary_key=True) # slug e.g. "dairy-cattle", "pigs"
    common_name = Column(String(128), nullable=False)
    scientific_name = Column(String(128), nullable=True)
    production_category = Column(String(128), default="Dairy") # Dairy, Beef, Swine, Poultry, Small Ruminant, Equine, Aquaculture
    management_systems = Column(JSON, default=list) # Intensive Indoor, Free-Stall, Pasture / Extensive, Semi-Intensive, Smallholder
    key_biological_signals = Column(JSON, default=list)
    overview = Column(Text, nullable=False)
    
    documents = relationship("Document", secondary=document_species, back_populates="species")


class Application(Base):
    __tablename__ = "applications"
    
    id = Column(String(64), primary_key=True) # slug e.g. "lameness-detection"
    name = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False, index=True) # Health, Reproduction, Nutrition, Growth, Behaviour, Welfare, Environmental Sustainability, Farm Management
    problem_statement = Column(Text, nullable=False)
    biological_signal = Column(Text, nullable=False)
    algorithm_family = Column(String(255), default="Deep Learning / Computer Vision")
    decision_output = Column(Text, nullable=False)
    expected_benefit = Column(Text, nullable=False)
    known_limitations = Column(JSON, default=list)
    economic_impact_summary = Column(Text, nullable=True)
    
    documents = relationship("Document", secondary=document_applications, back_populates="applications")


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    doi = Column(String(255), unique=True, nullable=True, index=True)
    pmid = Column(String(64), unique=True, nullable=True, index=True)
    openalex_id = Column(String(128), unique=True, nullable=True, index=True)
    canonical_url = Column(String(1024), nullable=False)
    title = Column(String(512), nullable=False, index=True)
    abstract = Column(Text, nullable=True)
    publication_year = Column(Integer, nullable=False, index=True)
    published_date = Column(String(32), nullable=True)
    venue_name = Column(String(255), nullable=True, index=True)
    citation_count = Column(Integer, default=0)
    is_open_access = Column(Boolean, default=False)
    open_access_url = Column(String(1024), nullable=True)
    pdf_url = Column(String(1024), nullable=True)
    peer_reviewed = Column(Boolean, default=True)
    
    # Evidence & Epistemology
    evidence_type = Column(String(64), default="Primary Empirical") # Primary Empirical, Systematic Review, Meta-Analysis, Narrative Review, Technical Report, Field Trial
    authority_tier = Column(String(8), default="A")
    methodology_summary = Column(Text, nullable=True)
    sample_size_details = Column(String(255), nullable=True)
    dataset_environment = Column(String(128), nullable=True) # Commercial Farm, Research Herd, Laboratory Chamber, Simulated
    findings_summary = Column(Text, nullable=True)
    limitations_summary = Column(Text, nullable=True)
    raw_metadata = Column(JSON, default=dict)
    
    # Verification & Quality Gate
    verification_status = Column(String(64), default="Verified") # Verified, Needs Review, Conflicting Evidence, Outdated, Insufficient Evidence
    verification_notes = Column(Text, nullable=True)
    geographic_region = Column(String(128), default="Global") # Europe, North America, Oceania, Sub-Saharan Africa, Asia, Latin America
    country = Column(String(128), nullable=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    retrieved_at = Column(DateTime, default=datetime.utcnow)
    
    source = relationship("Source", back_populates="documents")
    authors = relationship("Author", secondary=document_authors, back_populates="documents")
    institutions = relationship("Institution", secondary=document_institutions, back_populates="documents")
    technologies = relationship("Technology", secondary=document_technologies, back_populates="documents")
    species = relationship("Species", secondary=document_species, back_populates="documents")
    applications = relationship("Application", secondary=document_applications, back_populates="documents")
    claims = relationship("Claim", back_populates="document")
    timeline_events = relationship("TimelineEvent", back_populates="document")


class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=True)
    claim_type = Column(String(64), default="Empirical Finding") # Empirical Finding, Commercial Vendor Claim, Author Hypothesis, Regulatory Guideline
    entity_target = Column(String(255), nullable=False) # e.g. "Neck Collar Rumination Sensor"
    statement = Column(Text, nullable=False)
    metrics_reported = Column(JSON, default=dict) # e.g. {"sensitivity": "92.4%", "specificity": "88.1%", "accuracy": "91%"}
    independent_validation_status = Column(String(64), default="Peer-Reviewed Validated") # Peer-Reviewed Validated, Single Study Unreplicated, Vendor Claim Unverified, Conflicted
    source_citation = Column(String(512), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    document = relationship("Document", back_populates="claims")


class CommercialSystem(Base):
    __tablename__ = "commercial_systems"
    
    id = Column(String(64), primary_key=True) # slug e.g. "delaval-delpro", "nedap-smarttag"
    company_name = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    species_target = Column(JSON, default=list) # ["dairy-cattle", "beef-cattle"]
    technology_categories = Column(JSON, default=list) # ["wearables", "analytics"]
    purpose = Column(Text, nullable=False)
    measurements_collected = Column(Text, nullable=False)
    deployment_environment = Column(String(255), default="Commercial Dairy / Feedlot")
    geographical_availability = Column(String(255), default="Worldwide")
    vendor_claims = Column(JSON, default=list)
    independent_evidence_summary = Column(Text, nullable=True)
    evidence_paper_dois = Column(JSON, default=list)
    limitations = Column(JSON, default=list)
    website_url = Column(String(512), nullable=True)
    date_verified = Column(String(32), default="2025-01")
    created_at = Column(DateTime, default=datetime.utcnow)


class ResearchGap(Base):
    __tablename__ = "research_gaps"
    
    id = Column(String(64), primary_key=True) # slug e.g. "multimodal-sensor-fusion-pasture"
    title = Column(String(255), nullable=False)
    gap_category = Column(String(128), nullable=False) # Generalisation & Sample Size, Extensive / Grazing Systems, Multi-Sensor Fusion, Economic & ROI Proof, Farmer Adoption & Usability, Sensor Drift & Longevity, Welfare Grounding, Developing World
    description = Column(Text, nullable=False)
    why_this_is_a_gap = Column(Text, nullable=False)
    evidence_supporting_observation = Column(Text, nullable=False)
    sources_reporting_limitation = Column(JSON, default=list) # [{title, authors, year, doi}]
    research_already_addressing = Column(Text, nullable=True)
    open_research_questions = Column(JSON, default=list)
    confidence_coverage = Column(String(64), default="High Evidence Consensus") # High Evidence Consensus, Moderate Evidence, Emerging Signal
    affected_species = Column(JSON, default=list)
    affected_technologies = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)


class TimelineEvent(Base):
    __tablename__ = "timeline_events"
    
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False, index=True)
    exact_period = Column(String(64), nullable=True)
    era = Column(String(64), default="Automated Sensing Era") # Mechanical Era, Electronic ID Era, Automated Sensing Era, IoT & Deep Learning Era, Autonomous Robotics Era
    milestone_title = Column(String(255), nullable=False)
    development_summary = Column(Text, nullable=False)
    technology_focus = Column(String(128), nullable=False)
    species_focus = Column(String(128), default="Multiple Livestock Species")
    significance = Column(Text, nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    primary_source_citation = Column(String(512), nullable=False)
    source_url = Column(String(1024), nullable=True)
    evidence_level = Column(String(64), default="Peer-Reviewed Historical Milestone")
    
    document = relationship("Document", back_populates="timeline_events")


class TaxonomyTerm(Base):
    __tablename__ = "taxonomy_dictionary"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(64), nullable=False) # plf_concept, technology, biological_management, regional
    canonical_term = Column(String(255), nullable=False, unique=True, index=True)
    synonyms = Column(JSON, default=list)
    regex_pattern = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GlossaryTerm(Base):
    __tablename__ = "glossary_terms"
    
    id = Column(String(64), primary_key=True) # slug e.g. "plf", "rumination"
    term = Column(String(128), nullable=False, unique=True)
    acronym = Column(String(32), nullable=True)
    category = Column(String(64), default="Core Concept")
    definition = Column(Text, nullable=False)
    academic_context = Column(Text, nullable=False)
    primary_citations = Column(JSON, default=list) # [{authors, year, title, doi}]


class CrawlJob(Base):
    __tablename__ = "crawl_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String(64), default="scholarly_harvest")
    source_target = Column(String(128), default="All Scholarly Sources")
    status = Column(String(32), default="Completed") # Running, Paused, Completed, Failed
    records_discovered = Column(Integer, default=0)
    records_processed = Column(Integer, default=0)
    duplicates_removed = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    logs = Column(JSON, default=list)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class CrawlError(Base):
    __tablename__ = "crawl_errors"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("crawl_jobs.id"), nullable=True)
    source_url = Column(String(1024), nullable=False)
    error_code = Column(String(64), nullable=False) # HTTP_429, ROBOTS_BLOCKED, PARSE_ERROR, TIMEOUT
    error_message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
