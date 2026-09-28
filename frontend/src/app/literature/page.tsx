'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  BookOpen, Search, Filter, Shield, CheckCircle2, AlertTriangle, 
  ExternalLink, ChevronLeft, ChevronRight, Sparkles, Layers, Cpu
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { Document, Species, Technology } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';
import { getAuthorityTierBadge, getVerificationStatusBadge } from '@/lib/utils';

function LiteratureContent() {
  const searchParams = useSearchParams();
  const initialSpecies = searchParams.get('species_id') || '';
  const initialTech = searchParams.get('technology_id') || '';
  const initialApp = searchParams.get('application_id') || '';
  const initialRegion = searchParams.get('region') || '';

  const [documents, setDocuments] = useState<Document[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [techList, setTechList] = useState<Technology[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [query, setQuery] = useState('');
  const [speciesId, setSpeciesId] = useState(initialSpecies);
  const [technologyId, setTechnologyId] = useState(initialTech);
  const [applicationId, setApplicationId] = useState(initialApp);
  const [region, setRegion] = useState(initialRegion);
  const [authorityTier, setAuthorityTier] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isOpenAccess, setIsOpenAccess] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const { openDrawerWithDocId } = useSourceDrawer();

  // Load taxonomic filter lists on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const [sp, tc] = await Promise.all([
          api.getSpeciesList(),
          api.getTechnologies()
        ]);
        setSpeciesList(sp);
        setTechList(tc);
      } catch (err) {
        console.error(err);
      }
    }
    loadFilters();
  }, []);

  // Fetch literature whenever filter state changes
  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      try {
        const data = await api.getDocuments({
          page,
          page_size: 8,
          query: query || undefined,
          species_id: speciesId || undefined,
          technology_id: technologyId || undefined,
          application_id: applicationId || undefined,
          geographic_region: region || undefined,
          authority_tier: authorityTier || undefined,
          verification_status: verificationStatus || undefined,
          is_open_access: isOpenAccess ? true : undefined,
          sort_by: sortBy
        });
        setDocuments(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [page, query, speciesId, technologyId, applicationId, region, authorityTier, verificationStatus, isOpenAccess, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Peer-Reviewed Literature Corpus</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
            Scholarly Literature Discovery Engine
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
            Continuously harvested, deduplicated, and classified research articles from OpenAlex, Crossref, and PubMed with traceable methodology.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          Indexed Works: <span className="font-bold text-slate-900 dark:text-slate-100">{total}</span>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Document Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-forest-600" />
                Corpus Filters
              </span>
              {(speciesId || technologyId || region || authorityTier || verificationStatus || isOpenAccess || query) && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSpeciesId('');
                    setTechnologyId('');
                    setApplicationId('');
                    setRegion('');
                    setAuthorityTier('');
                    setVerificationStatus('');
                    setIsOpenAccess(false);
                    setPage(1);
                  }}
                  className="text-[11px] text-burgundy-700 dark:text-burgundy-400 hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="e.g. lameness, mastitis, YOLO..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-slate-900 dark:text-slate-100"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Geographic Region Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Geographic Region</label>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none font-medium"
              >
                <option value="">All Regions (Global)</option>
                <option value="Sub-Saharan Africa">🌍 Sub-Saharan Africa (70+ Papers)</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>

            {/* Species Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Animal Species</label>
              <select
                value={speciesId}
                onChange={(e) => { setSpeciesId(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Species</option>
                {speciesList.map((s) => (
                  <option key={s.id} value={s.id}>{s.common_name}</option>
                ))}
              </select>
            </div>

            {/* Technology Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Sensing Technology</label>
              <select
                value={technologyId}
                onChange={(e) => { setTechnologyId(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Technologies</option>
                {techList.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Authority Tier */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Authority Tier</label>
              <select
                value={authorityTier}
                onChange={(e) => { setAuthorityTier(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Authority Tiers</option>
                <option value="A">Tier A: Peer-Reviewed Scientific Journals</option>
                <option value="B">Tier B: Intergovernmental / FAO / USDA</option>
                <option value="C">Tier C: University & Institutional Repos</option>
                <option value="D">Tier D: Commercial Vendor Documentation</option>
              </select>
            </div>

            {/* Verification Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Peer Verification Flag</label>
              <select
                value={verificationStatus}
                onChange={(e) => { setVerificationStatus(e.target.value); setPage(1); }}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Verified">Verified Evidence</option>
                <option value="Needs Review">Needs Review</option>
                <option value="Conflicting Evidence">Conflicting Evidence</option>
                <option value="Outdated">Outdated / Superseded</option>
              </select>
            </div>

            {/* Open Access Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Open Access Only</span>
              <input
                type="checkbox"
                checked={isOpenAccess}
                onChange={(e) => { setIsOpenAccess(e.target.checked); setPage(1); }}
                className="w-4 h-4 rounded text-forest-600 focus:ring-forest-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="recent">Most Recent First</option>
                <option value="citations">Most Cited First</option>
                <option value="year_asc">Chronological (Oldest First)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Document Cards Stream */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <button
              onClick={() => { setRegion(''); setSpeciesId(''); setTechnologyId(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                !region && !speciesId && !technologyId
                  ? 'bg-forest-700 text-sand-200 border-forest-600 shadow-sm'
                  : 'bg-sand-200/50 dark:bg-forest-800/40 text-forest-800 dark:text-sand-300 border-sand-300/60 hover:bg-sand-300/60'
              }`}
            >
              All Corpus ({total})
            </button>
            <button
              onClick={() => { setRegion(region === 'Sub-Saharan Africa' ? '' : 'Sub-Saharan Africa'); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
                region === 'Sub-Saharan Africa'
                  ? 'bg-burgundy-700 text-sand-200 border-burgundy-600'
                  : 'bg-sand-200/70 dark:bg-forest-800/60 text-burgundy-700 dark:text-sand-300 border-sand-300 hover:bg-sand-300/80'
              }`}
            >
              <span>🌍 Sub-Saharan Africa (70+ Papers)</span>
            </button>
            <button
              onClick={() => { setSpeciesId(speciesId === 'dairy-cattle' ? '' : 'dairy-cattle'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                speciesId === 'dairy-cattle'
                  ? 'bg-forest-700 text-sand-200 border-forest-600 shadow-sm'
                  : 'bg-sand-200/50 dark:bg-forest-800/40 text-forest-800 dark:text-sand-300 border-sand-300/60 hover:bg-sand-300/60'
              }`}
            >
              Dairy Cattle
            </button>
            <button
              onClick={() => { setSpeciesId(speciesId === 'beef-cattle' ? '' : 'beef-cattle'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                speciesId === 'beef-cattle'
                  ? 'bg-forest-700 text-sand-200 border-forest-600 shadow-sm'
                  : 'bg-sand-200/50 dark:bg-forest-800/40 text-forest-800 dark:text-sand-300 border-sand-300/60 hover:bg-sand-300/60'
              }`}
            >
              Beef Cattle
            </button>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center">
              <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm">No literature found matching these filter criteria.</p>
              <p className="text-xs text-slate-500">Try broadening your keyword or taxonomy filters.</p>
            </div>
          ) : (
            <>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 rounded-2xl academic-card space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${getAuthorityTierBadge(doc.authority_tier).color}`}>
                          {getAuthorityTierBadge(doc.authority_tier).label}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${getVerificationStatusBadge(doc.verification_status).color}`}>
                          {getVerificationStatusBadge(doc.verification_status).label}
                        </span>
                        {doc.geographic_region === 'Sub-Saharan Africa' && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-burgundy-700/15 text-burgundy-700 dark:text-sand-300 border border-burgundy-700/30">
                            🌍 Africa &amp; Pastoral
                          </span>
                        )}
                        {doc.is_open_access && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            Open Access
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        Citations: <strong className="text-slate-800 dark:text-slate-200">{doc.citation_count}</strong>
                      </span>
                    </div>

                    {/* Title & Metadata */}
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {doc.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {doc.authors?.map(a => a.name).join(', ') || 'Scholarly Authors'} • <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.venue_name}</span> ({doc.publication_year})
                      </p>
                    </div>

                    {/* Findings & Limitations Snippet */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {doc.findings_summary || doc.abstract || 'Peer-reviewed empirical investigation.'}
                    </p>

                    {/* Entity Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {doc.technologies?.map(t => (
                        <span key={t.id} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px] font-medium border border-blue-500/20">
                          {t.name}
                        </span>
                      ))}
                      {doc.species?.map(s => (
                        <span key={s.id} className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 dark:text-sand-300 text-[10px] font-medium border border-forest-700/20">
                          {s.common_name}
                        </span>
                      ))}
                      {doc.applications?.map(a => (
                        <span key={a.id} className="px-2 py-0.5 rounded bg-sand-300/20 text-sand-700 dark:text-sand-300 text-[10px] font-medium border border-amber-500/20">
                          {a.name}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    {doc.doi ? (
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                        DOI: {doc.doi}
                      </span>
                    ) : <span></span>}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDrawerWithDocId(doc.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-forest-700 hover:bg-forest-800 text-white font-semibold transition flex items-center gap-1 shadow-sm"
                      >
                        <span>View Source Record</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              {/* Pagination Controls */}
              <div className="pt-6 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">
                  Showing page <strong className="text-slate-900 dark:text-slate-100">{page}</strong> of <strong className="text-slate-900 dark:text-slate-100">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}

export default function LiteraturePage() {
  return (
    <Suspense fallback={
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LiteratureContent />
    </Suspense>
  );
}
