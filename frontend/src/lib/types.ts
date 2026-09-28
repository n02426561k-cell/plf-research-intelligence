export interface LiveStats {
  sources_indexed: number;
  research_papers_discovered: number;
  technologies_identified: number;
  animal_species_covered: number;
  applications_identified: number;
  countries_represented: number;
  research_gaps_detected: number;
  commercial_systems_cataloged: number;
  timeline_milestones: number;
  last_crawl_date: string;
}

export interface Author {
  id?: number;
  name: string;
  affiliation?: string;
  country?: string;
}

export interface Institution {
  id?: number;
  name: string;
  country?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  description: string;
  what_it_measures: string;
  maturity_level: string;
  advantages?: string[];
  limitations?: string[];
  cost_level?: string;
  power_requirements?: string;
  connectivity_needs?: string;
  paper_count?: number;
  evidence_papers?: any[];
}

export interface Species {
  id: string;
  common_name: string;
  scientific_name?: string;
  production_category: string;
  management_systems: string[];
  key_biological_signals: string[];
  overview: string;
  paper_count?: number;
}

export interface Application {
  id: string;
  name: string;
  category: string;
  problem_statement: string;
  biological_signal: string;
  algorithm_family: string;
  decision_output: string;
  expected_benefit: string;
  known_limitations: string[];
  economic_impact_summary?: string;
  evidence_count?: number;
}

export interface Document {
  id: number;
  doi?: string;
  pmid?: string;
  openalex_id?: string;
  canonical_url: string;
  title: string;
  abstract?: string;
  publication_year: number;
  published_date?: string;
  venue_name?: string;
  citation_count: number;
  is_open_access: boolean;
  open_access_url?: string;
  peer_reviewed: boolean;
  evidence_type: string;
  authority_tier: string;
  methodology_summary?: string;
  sample_size_details?: string;
  dataset_environment?: string;
  findings_summary?: string;
  limitations_summary?: string;
  verification_status: string;
  verification_notes?: string;
  geographic_region?: string;
  country?: string;
  source_name?: string;
  retrieved_at?: string;
  authors: Author[];
  institutions?: Institution[];
  technologies: { id: string; name: string; category?: string }[];
  species: { id: string; common_name: string }[];
  applications: { id: string; name: string; category?: string }[];
}

export interface CommercialSystem {
  id: string;
  company_name: string;
  product_name: string;
  species_target: string[];
  technology_categories: string[];
  purpose: string;
  measurements_collected: string;
  deployment_environment: string;
  geographical_availability: string;
  vendor_claims: string[];
  independent_evidence_summary?: string;
  evidence_paper_dois: string[];
  limitations: string[];
  website_url?: string;
  date_verified: string;
}

export interface ResearchGap {
  id: string;
  title: string;
  gap_category: string;
  description: string;
  why_this_is_a_gap: string;
  evidence_supporting_observation: string;
  sources_reporting_limitation: { title: string; doi?: string; year?: number }[];
  research_already_addressing?: string;
  open_research_questions: string[];
  confidence_coverage: string;
  affected_species: string[];
  affected_technologies: string[];
}

export interface TimelineEvent {
  id: number;
  year: number;
  exact_period?: string;
  era: string;
  milestone_title: string;
  development_summary: string;
  technology_focus: string;
  species_focus: string;
  significance: string;
  primary_source_citation: string;
  source_url?: string;
  evidence_level: string;
  document_id?: number;
}

export interface Source {
  id: number;
  name: string;
  base_url: string;
  source_type: string;
  authority_tier: string;
  authority_description?: string;
  rate_limit_per_min: number;
  robots_txt_status: string;
  is_active: boolean;
  last_crawled_at?: string;
  records_count: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: string;
  definition: string;
  academic_context: string;
  primary_citations: { authors: string; year: number; title: string; doi?: string }[];
}

export interface TaxonomyTerm {
  id: number;
  category: string;
  canonical_term: string;
  synonyms: string[];
  regex_pattern?: string;
  description?: string;
  is_active: boolean;
  updated_at?: string;
}

export interface SearchResponse {
  query: string;
  total_matches: number;
  documents: any[];
  technologies: any[];
  species: any[];
  applications: any[];
  research_gaps: any[];
}
