'use client';

import React, { useEffect, useState } from 'react';
import { 
  Cpu, Play, RefreshCw, AlertTriangle, ShieldCheck, Database, 
  Layers, CheckCircle2, Clock, Plus, Edit2, Save, X, Loader2
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { TaxonomyTerm } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const [crawlerStatus, setCrawlerStatus] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [taxonomyTerms, setTaxonomyTerms] = useState<TaxonomyTerm[]>([]);
  const [crawlQuery, setCrawlQuery] = useState('Precision Livestock Farming');
  const [isTriggering, setIsTriggering] = useState(false);
  const [isReclassifying, setIsReclassifying] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Term editing state
  const [editingTermId, setEditingTermId] = useState<number | null>(null);
  const [editSynonyms, setEditSynonyms] = useState<string>('');

  const loadAllAdminData = async () => {
    try {
      const [st, jb, errs, tax] = await Promise.all([
        api.getCrawlerStatus(),
        api.getCrawlJobs(),
        api.getCrawlErrors(),
        api.getTaxonomyTerms()
      ]);
      setCrawlerStatus(st);
      setJobs(jb);
      setErrors(errs);
      setTaxonomyTerms(tax);
    } catch (e) {
      console.error("Admin load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
    const interval = setInterval(loadAllAdminData, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlQuery.trim()) return;
    setIsTriggering(true);
    try {
      const res = await api.startCrawlJob(crawlQuery.trim(), 10);
      setMsg(res.message || 'Discovery cycle started.');
      setTimeout(() => setMsg(''), 4000);
      loadAllAdminData();
    } catch (err: any) {
      console.error(err);
      setMsg(err.message || 'Failed to trigger crawl.');
    } finally {
      setIsTriggering(false);
    }
  };

  const handleReclassify = async () => {
    setIsReclassifying(true);
    try {
      const res = await api.reclassifyDocuments();
      setMsg(res.message || 'Reclassification completed.');
      setTimeout(() => setMsg(''), 4000);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsReclassifying(false);
    }
  };

  const startEditTerm = (t: TaxonomyTerm) => {
    setEditingTermId(t.id);
    setEditSynonyms(t.synonyms.join(', '));
  };

  const saveEditTerm = async (t: TaxonomyTerm) => {
    try {
      const synArray = editSynonyms.split(',').map(s => s.trim()).filter(Boolean);
      await api.updateTaxonomyTerm(t.id, { synonyms: synArray });
      setEditingTermId(null);
      setMsg(`Updated synonyms for ${t.canonical_term}`);
      setTimeout(() => setMsg(''), 3000);
      loadAllAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Crawler Control & Taxonomy Editor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
            Crawler Administration
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Trigger asynchronous scholarly harvests, inspect audit runs and error logs, and configure research synonym mapping rules in real time.
          </p>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${crawlerStatus?.is_running ? 'bg-amber-500 animate-ping' : 'bg-sand-1000'}`}></span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Crawler Engine: {crawlerStatus?.is_running ? 'Harvesting Active' : 'Idle / Ready'}
          </span>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-forest-700/10 border border-forest-700/30 text-forest-800 dark:text-sand-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* 1. CRAWL TRIGGER CONTROLS */}
      <section className="p-6 sm:p-8 rounded-3xl academic-card space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Play className="w-5 h-5 text-forest-600" />
          Trigger Scholarly Ingestion Cycle
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Dispatches polite asynchronous queries to OpenAlex and Crossref APIs, applies the deduplication engine, and classifies records into the database.
        </p>

        <form onSubmit={handleStartCrawl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={crawlQuery}
            onChange={(e) => setCrawlQuery(e.target.value)}
            placeholder="Scholarly query term (e.g. Precision Livestock Farming, animal welfare sensors)..."
            className="flex-1 text-xs px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="submit"
            disabled={isTriggering || crawlerStatus?.is_running}
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
          >
            {isTriggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>Start Discovery Cycle</span>
          </button>
          <button
            type="button"
            onClick={handleReclassify}
            disabled={isReclassifying}
            className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isReclassifying ? 'animate-spin' : ''}`} />
            <span>Re-Apply Taxonomy Rules</span>
          </button>
        </form>
      </section>

      {/* 2. TAXONOMY & SYNONYM DICTIONARY (EDITABLE) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Configurable Taxonomy & Synonym Dictionary
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live mapping rules used by the multi-axis classifier. Edit synonyms to adapt classification in real time.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taxonomyTerms.map((t) => (
            <div key={t.id} className="p-5 rounded-2xl academic-card space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-mono text-blue-600 dark:text-blue-400 block font-semibold">
                    Category: {t.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t.canonical_term}
                  </h3>
                </div>
                {editingTermId !== t.id && (
                  <button
                    onClick={() => startEditTerm(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editingTermId === t.id ? (
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 block font-medium">Edit Synonyms (comma separated):</label>
                  <textarea
                    rows={3}
                    value={editSynonyms}
                    onChange={(e) => setEditSynonyms(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTermId(null)}
                      className="px-3 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEditTerm(t)}
                      className="px-3 py-1 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Save Rule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {t.synonyms?.map((syn, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                        {syn}
                      </span>
                    ))}
                  </div>
                  {t.description && (
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                      {t.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. CRAWL JOBS AUDIT LOG */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-burgundy-700" />
          Crawl Ingestion Audit Trail
        </h2>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Job ID</th>
                <th className="p-3.5">Target / Scope</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Discovered</th>
                <th className="p-3.5">Ingested</th>
                <th className="p-3.5">Duplicates Merged</th>
                <th className="p-3.5">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 font-mono font-bold">#{j.id}</td>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{j.source_target}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${j.status === 'Completed' ? 'bg-forest-700/10 text-forest-700 dark:text-sand-300' : 'bg-sand-300/20 text-sand-700 dark:text-sand-300'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{j.records_discovered}</td>
                  <td className="p-3.5 font-mono font-bold text-forest-600">{j.records_processed}</td>
                  <td className="p-3.5 font-mono text-purple-600">{j.duplicates_removed}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{formatDate(j.started_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
