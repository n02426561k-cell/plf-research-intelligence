'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu, CheckCircle2, AlertTriangle, Battery, Wifi, DollarSign, Layers, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Technology } from '@/lib/types';

export default function ComparisonPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTechs() {
      try {
        const data = await api.getTechnologies();
        setTechnologies(data);
      } catch (err) {
        console.error("Failed to load technologies for comparison:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTechs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-Dimensional Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Technology Comparison Platform
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Compare PLF sensing modalities side-by-side according to documented technical, physiological, and operational characteristics without subjective or commercial ranking.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4 min-w-[200px]">Technology & Family</th>
                <th className="p-4 min-w-[220px]">Physical Parameter Measured</th>
                <th className="p-4 min-w-[140px]">Readiness Level</th>
                <th className="p-4 min-w-[250px]">Primary Advantages</th>
                <th className="p-4 min-w-[250px]">Documented Limitations</th>
                <th className="p-4 min-w-[120px]">Cost Level</th>
                <th className="p-4 min-w-[160px]">Power & Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {technologies.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                  {/* Name & Category */}
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 block uppercase font-mono">
                      {t.category}
                    </span>
                    <span className="text-sm font-bold">{t.name}</span>
                  </td>

                  {/* Measures */}
                  <td className="p-4 leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                    {t.what_it_measures}
                  </td>

                  {/* Readiness */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-forest-700/10 text-forest-700 dark:text-sand-300 font-semibold text-[10px] border border-forest-700/20 whitespace-nowrap">
                      {t.maturity_level}
                    </span>
                  </td>

                  {/* Advantages */}
                  <td className="p-4 space-y-1">
                    {t.advantages?.slice(0, 2).map((adv, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-500 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </div>
                    ))}
                  </td>

                  {/* Limitations */}
                  <td className="p-4 space-y-1">
                    {t.limitations?.slice(0, 2).map((lim, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-sand-700 dark:text-sand-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{lim}</span>
                      </div>
                    ))}
                  </td>

                  {/* Cost */}
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {t.cost_level}
                  </td>

                  {/* Power & Telemetry */}
                  <td className="p-4 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Battery className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{t.power_requirements}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Wifi className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{t.connectivity_needs}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
