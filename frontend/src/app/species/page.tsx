'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, BookOpen, Layers, Activity, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Species } from '@/lib/types';

export default function SpeciesPage() {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecies() {
      try {
        const data = await api.getSpeciesList();
        setSpeciesList(data);
      } catch (e) {
        console.error("Failed to load species:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecies();
  }, []);

  const speciesIcons: Record<string, string> = {
    'dairy-cattle': '🐄',
    'beef-cattle': '🐂',
    'pigs': '🐖',
    'poultry': '🐔',
    'sheep': '🐑',
    'goats': '🐐',
    'horses': '🐎',
    'aquaculture': '🐟'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Biological & Species Taxonomy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Animal Species Knowledge Hubs
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          PLF applications differ radically across species due to distinct anatomical, physiological, social, and housing constraints. Explore species-specific technologies, biological signals, and research evidence.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speciesList.map((sp) => (
            <div
              key={sp.id}
              className="p-6 rounded-2xl academic-card flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{speciesIcons[sp.id] || '🐾'}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 dark:text-sand-300 text-xs font-semibold border border-forest-700/20">
                    {sp.production_category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {sp.common_name}
                  </h3>
                  {sp.scientific_name && (
                    <span className="text-xs text-forest-700 dark:text-sand-300 font-serif italic block font-medium">
                      {sp.scientific_name}
                    </span>
                  )}
                  <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3 font-medium">
                    {sp.overview}
                  </p>
                </div>

                {/* Biological Signals */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider block mb-1">
                    Key Biological Bio-Responses
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sp.key_biological_signals?.map((sig, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Management Systems */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider block mb-1">
                    Production & Housing Systems
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {sp.management_systems?.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  href={`/species/${sp.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-forest-700 text-sand-200 text-xs font-bold shadow hover:bg-forest-800 transition"
                >
                  <span>Open Knowledge Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-mono font-medium">{sp.paper_count ?? 0} indexed papers</span>
                  <Link
                    href={`/literature?species_id=${sp.id}`}
                    className="font-bold text-forest-700 hover:text-forest-800 dark:text-forest-400 flex items-center gap-1"
                  >
                    <span>Literature Only</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
