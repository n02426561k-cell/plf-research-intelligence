'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, BookOpen, Layers, Activity, AlertTriangle, 
  Cpu, ExternalLink, CheckCircle2, Compass, Shield, Sparkles, 
  FileText, Lightbulb, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

const SPECIES_CONFIG: Record<string, { icon: string; themeColor: string }> = {
  'dairy-cattle': { icon: '🐄', themeColor: 'from-amber-700/20 via-sand-500/10 to-transparent' },
  'beef-cattle': { icon: '🐂', themeColor: 'from-rose-900/20 via-sand-500/10 to-transparent' },
  'cattle': { icon: '🐄', themeColor: 'from-amber-700/20 via-sand-500/10 to-transparent' },
  'pigs': { icon: '🐖', themeColor: 'from-pink-900/20 via-sand-500/10 to-transparent' },
  'poultry': { icon: '🐔', themeColor: 'from-yellow-800/20 via-sand-500/10 to-transparent' },
  'sheep': { icon: '🐑', themeColor: 'from-emerald-900/20 via-sand-500/10 to-transparent' },
  'goats': { icon: '🐐', themeColor: 'from-teal-900/20 via-sand-500/10 to-transparent' },
  'horses': { icon: '🐎', themeColor: 'from-indigo-900/20 via-sand-500/10 to-transparent' },
  'aquaculture': { icon: '🐟', themeColor: 'from-cyan-900/20 via-sand-500/10 to-transparent' },
};

const ALL_SPECIES = [
  { id: 'dairy-cattle', name: 'Dairy Cattle', icon: '🐄' },
  { id: 'beef-cattle', name: 'Beef Cattle', icon: '🐂' },
  { id: 'pigs', name: 'Pigs / Swine', icon: '🐖' },
  { id: 'poultry', name: 'Poultry', icon: '🐔' },
  { id: 'sheep', name: 'Sheep', icon: '🐑' },
  { id: 'goats', name: 'Goats', icon: '🐐' },
  { id: 'horses', name: 'Horses', icon: '🐎' },
  { id: 'aquaculture', name: 'Aquaculture', icon: '🐟' },
];

export default function SpeciesDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'dairy-cattle';
  const speciesId = rawId.toLowerCase();
  
  const { openDrawerWithDocId } = useSourceDrawer();
  const [hubData, setHubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHub() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getSpeciesHub(speciesId);
        setHubData(data);
      } catch (err: any) {
        console.error("Failed to load species hub:", err);
        setError("Unable to load species research hub. The requested species taxonomy may not be registered.");
      } finally {
        setLoading(false);
      }
    }
    loadHub();
  }, [speciesId]);

  const config = SPECIES_CONFIG[speciesId] || SPECIES_CONFIG[hubData?.id] || { icon: '🐾', themeColor: 'from-forest-800/20 to-transparent' };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Species Knowledge Hub...</p>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Species Hub Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">{error}</p>
        <div className="pt-4">
          <Link
            href="/species"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-700 text-sand-200 text-sm font-semibold shadow-md hover:bg-forest-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Species Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Link href="/" className="hover:text-forest-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/species" className="hover:text-forest-600 transition">Species Hubs</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-200 font-semibold">{hubData.common_name}</span>
        </nav>

        <Link
          href="/species"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-forest-600 dark:hover:text-forest-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Species Directory</span>
        </Link>
      </div>

      {/* Quick Species Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap mr-1">
          Switch Species:
        </span>
        {ALL_SPECIES.map((s) => {
          const isActive = hubData.id === s.id || (speciesId === 'cattle' && s.id === 'dairy-cattle');
          return (
            <Link
              key={s.id}
              href={`/species/${s.id}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-forest-700 text-sand-200 border-forest-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-forest-600/40'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-sand-400/40 dark:border-forest-700/40 bg-gradient-to-br from-sand-100/90 via-sand-50/70 to-white dark:from-forest-900/60 dark:via-slate-900 dark:to-slate-950 shadow-md">
        <div className="absolute -top-12 -right-12 text-[140px] opacity-10 select-none pointer-events-none text-slate-900 dark:text-white">
          {config.icon}
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-4xl sm:text-5xl">{config.icon}</span>
            <div>
              <span className="px-3 py-1 rounded-full bg-forest-700/10 text-forest-800 dark:text-sand-200 border border-forest-700/20 text-xs font-bold tracking-wide">
                {hubData.production_category} Sector
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            {hubData.common_name} Research Hub
          </h1>
          {hubData.scientific_name && (
            <p className="text-sm sm:text-base font-serif italic text-forest-800 dark:text-sand-300 font-semibold">
              Taxonomy: {hubData.scientific_name}
            </p>
          )}

          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed pt-2 font-medium">
            {hubData.overview}
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-sand-300 dark:border-slate-700 shadow-sm flex items-center">
              <span className="text-forest-700 dark:text-sand-300 font-extrabold text-sm mr-2">{hubData.technologies_used?.length || 0}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Sensor Modalities</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-sand-300 dark:border-slate-700 shadow-sm flex items-center">
              <span className="text-forest-700 dark:text-sand-300 font-extrabold text-sm mr-2">{hubData.applications_addressed?.length || 0}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Clinical Applications</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-sand-300 dark:border-slate-700 shadow-sm flex items-center">
              <span className="text-forest-700 dark:text-sand-300 font-extrabold text-sm mr-2">{hubData.research_gaps?.length || 0}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">High-Priority Gaps</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-sand-300 dark:border-slate-700 shadow-sm flex items-center">
              <span className="text-forest-700 dark:text-sand-300 font-extrabold text-sm mr-2">{hubData.research_papers?.length || 0}</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">Indexed Studies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Systems & Biological Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Production Systems */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-bold text-base">
            <div className="p-2 rounded-xl bg-forest-700/10 text-forest-800 dark:text-sand-300 border border-forest-700/20">
              <Layers className="w-4 h-4" />
            </div>
            <h3>Housing & Production Systems</h3>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            PLF deployment constraints differ sharply depending on environmental confinement vs extensive pasture dispersion.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {hubData.management_systems?.map((sys: string, idx: number) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80"
              >
                {sys}
              </span>
            ))}
          </div>
        </div>

        {/* Biological Bio-Signals */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-bold text-base">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <h3>Key Biological Bio-Responses</h3>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            Primary physiological and behavioural proxies measured for early warning and clinical decision support.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {hubData.key_biological_signals?.map((sig: string, idx: number) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-950/20 text-xs font-semibold text-rose-800 dark:text-rose-300 border border-rose-500/25"
              >
                {sig}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Applied Sensor Technologies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <span>Deployed Sensor Modalities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Active precision technologies utilized in published research and commercial deployments for this species.
            </p>
          </div>
          <Link
            href="/technologies"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 dark:text-sand-300 flex items-center gap-1"
          >
            <span>All Technologies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hubData.technologies_used?.map((t: any) => (
            <div 
              key={t.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-forest-600/50 transition-all shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {t.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-800 dark:text-sand-300 font-bold border border-forest-700/20">
                    {t.maturity_level}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 pt-1">
                  {t.name}
                </h4>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <Link
                  href={`/literature?technology_id=${t.id}`}
                  className="text-xs font-bold text-forest-700 hover:text-forest-800 dark:text-forest-400 flex items-center gap-1"
                >
                  <span>Explore Papers</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Applications & Decision Support */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-forest-700 dark:text-forest-400" />
            <span>Target Applications & Automated Decision Support</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
            Clinical challenges and specific algorithmic decision outputs implemented for {hubData.common_name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hubData.applications_addressed?.map((a: any) => (
            <div 
              key={a.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-forest-700/10 text-forest-800 dark:text-sand-300 text-xs font-bold">
                  {a.category}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">ID: {a.id}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {a.name}
              </h4>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">
                  Automated Decision Output / Trigger:
                </span>
                <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-mono font-medium">
                  {a.decision_output}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Research Gaps */}
      {hubData.research_gaps && hubData.research_gaps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Unresolved Research Gaps</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                Methodological, operational, and commercial bottlenecks explicitly impeding PLF efficacy for this species.
              </p>
            </div>
            <Link
              href="/research-gaps"
              className="text-xs font-semibold text-forest-700 hover:text-forest-800 dark:text-sand-300 flex items-center gap-1"
            >
              <span>All Research Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubData.research_gaps.map((gap: any) => (
              <div 
                key={gap.id}
                className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200 text-xs font-bold border border-amber-500/30">
                    {gap.gap_category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {gap.title}
                </h4>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {gap.why_this_is_a_gap}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scholarly Literature & Empirical Evidence */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-forest-700 dark:text-forest-400" />
              <span>Peer-Reviewed Evidence & Literature</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Empirical studies, sensor validation trials, and systematic reviews evaluating {hubData.common_name}.
            </p>
          </div>
          <Link
            href={`/literature?species_id=${hubData.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 text-sand-200 text-xs font-bold shadow hover:bg-forest-800 transition"
          >
            <span>View All Papers in Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {hubData.research_papers?.map((p: any) => (
            <div 
              key={p.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-forest-600/40 transition-all shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 max-w-4xl">
                  <h3 
                    onClick={() => openDrawerWithDocId(p.id)}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-forest-700 dark:hover:text-sand-300 cursor-pointer transition leading-snug"
                  >
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {p.authors && p.authors.length > 0 && (
                      <span>{p.authors.slice(0, 3).join(', ')}{p.authors.length > 3 ? ' et al.' : ''}</span>
                    )}
                    {p.year && <span>• <strong className="text-slate-800 dark:text-slate-200">{p.year}</strong></span>}
                    {p.venue && <span>• <em>{p.venue}</em></span>}
                  </div>
                </div>

                <button
                  onClick={() => openDrawerWithDocId(p.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-700/10 text-forest-800 dark:text-sand-300 hover:bg-forest-700/20 text-xs font-bold border border-forest-700/20 flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Evidence</span>
                </button>
              </div>

              {/* Findings & Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {p.findings && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/25 border border-emerald-500/25">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                      Key Validated Findings:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {p.findings}
                    </p>
                  </div>
                )}

                {p.limitations && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/25 border border-amber-500/25">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                      Identified Limitations / Drift:
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {p.limitations}
                    </p>
                  </div>
                )}
              </div>

              {p.doi && (
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="font-mono">DOI: {p.doi}</span>
                  <a 
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-forest-700 flex items-center gap-1 transition"
                  >
                    <span>Publisher Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
