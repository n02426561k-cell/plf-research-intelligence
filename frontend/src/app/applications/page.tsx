'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Compass, Filter, HeartPulse, Sparkles, TrendingUp, AlertTriangle, 
  CheckCircle, DollarSign, Database, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { Application } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  const categories = [
    'All', 'Health', 'Reproduction', 'Nutrition', 'Growth', 
    'Behaviour', 'Welfare', 'Environmental Sustainability', 'Farm Management'
  ];

  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      try {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory;
        const data = await api.getUseCases(cat);
        setApplications(data);
      } catch (err) {
        console.error("Failed to load use cases:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-300/20 border border-amber-500/20 text-amber-800 dark:text-sand-300 text-xs font-semibold mb-3">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Clinical & Operational Problem Solving</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Searchable Use-Case & Application Library
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Structured problem formulations mapping biological symptoms, sensor modalities, mathematical algorithms, actionable farm decisions, expected economic benefits, and documented constraints.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold uppercase text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Application Area:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Use Cases Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              id={app.id}
              className="p-6 rounded-2xl academic-card space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sand-300/20 text-sand-700 dark:text-sand-300 text-xs font-semibold border border-amber-500/20">
                    Domain: {app.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {app.name}
                  </h3>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Algorithm Family: <span className="font-semibold text-slate-700 dark:text-slate-300">{app.algorithm_family}</span>
                </div>
              </div>

              {/* Problem & Signal Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    Problem Statement & Clinical Impact
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {app.problem_statement}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    Biological Input Signal & Sensor Modality
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {app.biological_signal}
                  </p>
                </div>

              </div>

              {/* Decision Output & Expected Benefit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-forest-700 dark:text-forest-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Actionable Decision Output & Benefit
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Alert:</strong> {app.decision_output}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    <strong className="text-slate-800 dark:text-slate-200">Expected Benefit:</strong> {app.expected_benefit}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-sand-700 dark:text-sand-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Documented Limitations & False Alarm Triggers
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {app.known_limitations?.map((lim, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Economic Impact */}
              {app.economic_impact_summary && (
                <div className="p-3.5 rounded-xl bg-sand-200/30 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-800/40 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-forest-800 dark:text-sand-300 font-medium">
                    <DollarSign className="w-4 h-4 text-forest-600" />
                    <span>Economic Impact: {app.economic_impact_summary}</span>
                  </div>
                  <Link
                    href={`/literature?application_id=${app.id}`}
                    className="text-xs font-semibold text-forest-700 dark:text-forest-400 hover:underline shrink-0 ml-4"
                  >
                    View Papers ({app.evidence_count ?? 0}) →
                  </Link>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
