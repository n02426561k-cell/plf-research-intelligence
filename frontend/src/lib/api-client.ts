const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      next: { revalidate: 10 } // incremental static revalidation or client-side caching
    });
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`API error ${res.status}: ${errBody}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[API Fetch Failed] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  getOverviewStats: () => fetchJson<any>('/stats/overview'),
  getLandscapeAnalytics: () => fetchJson<any>('/stats/landscape'),
  
  getDocuments: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    return fetchJson<any>(`/documents?${query.toString()}`);
  },
  
  getDocumentDetails: (id: number) => fetchJson<any>(`/documents/${id}`),
  updateDocumentStatus: (id: number, status: string, notes?: string) => 
    fetchJson<any>(`/documents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_status: status, verification_notes: notes })
    }),

  getTechnologies: (category?: string) => 
    fetchJson<any[]>(`/technologies${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getTechnology: (id: string) => fetchJson<any>(`/technologies/${id}`),

  getSpeciesList: () => fetchJson<any[]>('/species'),
  getSpeciesHub: (id: string) => fetchJson<any>(`/species/${id}`),

  getUseCases: (category?: string) => 
    fetchJson<any[]>(`/use-cases${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getUseCase: (id: string) => fetchJson<any>(`/use-cases/${id}`),

  getTimelineEvents: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    return fetchJson<any[]>(`/timeline?${query.toString()}`);
  },

  getCommercialSystems: () => fetchJson<any[]>('/commercial-systems'),
  getCommercialSystem: (id: string) => fetchJson<any>(`/commercial-systems/${id}`),

  getResearchGaps: () => fetchJson<any[]>('/research-gaps'),
  getResearchGap: (id: string) => fetchJson<any>(`/research-gaps/${id}`),

  getSources: () => fetchJson<any[]>('/sources'),
  getGlossaryTerms: () => fetchJson<any[]>('/glossary'),
  
  getTaxonomyTerms: () => fetchJson<any[]>('/taxonomy'),
  updateTaxonomyTerm: (id: number, payload: any) => 
    fetchJson<any>(`/taxonomy/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  globalSearch: (query: string, filters: Record<string, any> = {}) => {
    const params = new URLSearchParams({ q: query });
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    return fetchJson<any>(`/search?${params.toString()}`);
  },

  queryAssistant: (query: string) => 
    fetchJson<any>('/assistant/query', {
      method: 'POST',
      body: JSON.stringify({ query })
    }),

  getKnowledgeGraph: () => fetchJson<any>('/graph'),

  getCrawlerStatus: () => fetchJson<any>('/crawler/status'),
  startCrawlJob: (query: string, limit: number = 10) => 
    fetchJson<any>('/crawler/start', {
      method: 'POST',
      body: JSON.stringify({ query, limit_per_source: limit })
    }),
  getCrawlJobs: () => fetchJson<any[]>('/crawler/jobs'),
  getCrawlErrors: () => fetchJson<any[]>('/crawler/errors'),
  reclassifyDocuments: () => fetchJson<any>('/crawler/reclassify', { method: 'POST' })
};
