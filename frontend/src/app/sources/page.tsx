'use client';

import React, { useEffect, useState } from 'react';
import { Database, ShieldCheck, ExternalLink, Activity, Globe, CheckCircle2, Clock } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Source } from '@/lib/types';
import { getAuthorityTierBadge, formatDate } from '@/lib/utils';

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSources() {
      try {
        const data = await api.getSources();
        setSources(data);
      } catch (err) {
        console.error("Failed to load sources:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>Ingestion & Harvesting Registries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Indexed Research Sources & Authority Tiers
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          The system explicitly declares all scholarly APIs, open-access feeds, and institutional repositories from which information was discovered, adhering strictly to robots.txt and polite harvesting rate limits.
        </p>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl academic-card space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getAuthorityTierBadge(s.authority_tier).color}`}>
                    {getAuthorityTierBadge(s.authority_tier).label}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 dark:text-sand-300 border border-forest-700/20 font-medium">
                    {s.robots_txt_status}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {s.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                    {s.base_url}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {s.authority_description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase block">Source Type</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{s.source_type}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase block">Rate Budget</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{s.rate_limit_per_min} req/min</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 uppercase block">Indexed Docs</span>
                    <span className="font-semibold text-forest-600 dark:text-forest-400 font-mono">{s.records_count}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Last crawl: {s.last_crawled_at ? formatDate(s.last_crawled_at) : 'Active'}
                </span>
                <a
                  href={s.base_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-1"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
