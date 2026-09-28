'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, Filter, Eye, Activity, Radio, Mic, Wind, MapPin, 
  Bot, CheckCircle2, AlertTriangle, Battery, Wifi, DollarSign, BookOpen, ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { Technology } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  const categories = ['All', 'Vision', 'Wearables', 'Identification', 'Audio', 'Environmental', 'Location', 'Automation'];

  useEffect(() => {
    async function fetchTechs() {
      setLoading(true);
      try {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory;
        const data = await api.getTechnologies(cat);
        setTechnologies(data);
      } catch (err) {
        console.error("Failed to load technologies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTechs();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Sensing & Instrumentation Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
            PLF Technology Catalog
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore documented sensing modalities, physical parameters measured, advantages, limitations, and empirical readiness levels.
          </p>
        </div>

        <Link
          href="/comparison"
          className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Compare Technologies Matrix</span>
          <span>→</span>
        </Link>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold uppercase text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by Modality:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Technology Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              id={tech.id}
              className="p-6 rounded-2xl academic-card flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-500/20">
                    Category: {tech.category}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 dark:text-sand-300 font-medium border border-forest-700/30">
                    Maturity: {tech.maturity_level}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {tech.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>
                </div>

                {/* What it Measures */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    What It Measures (Biological & Environmental Signals)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {tech.what_it_measures}
                  </p>
                </div>

                {/* Advantages vs Limitations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-forest-700 dark:text-forest-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Documented Advantages
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {tech.advantages?.map((adv, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-forest-500 mt-0.5">•</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-sand-700 dark:text-sand-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Known Limitations
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                      {tech.limitations?.map((lim, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{lim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Operational Profile */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase">Cost Tier</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{tech.cost_level}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase">Power Specs</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{tech.power_requirements}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase">Telemetry</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">{tech.connectivity_needs}</span>
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {tech.paper_count ?? 0} indexed research papers
                </span>
                <Link
                  href={`/literature?technology_id=${tech.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                >
                  <span>Explore Literature for this Tech</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
