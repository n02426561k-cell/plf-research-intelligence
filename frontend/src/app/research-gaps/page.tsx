'use client';

import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, AlertCircle, HelpCircle, CheckCircle2, BookOpen, 
  ExternalLink, Layers, ArrowRight, ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { ResearchGap } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function ResearchGapsPage() {
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  useEffect(() => {
    async function fetchGaps() {
      try {
        const data = await api.getResearchGaps();
        setGaps(data);
      } catch (err) {
        console.error("Failed to load research gaps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGaps();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-700/10 border border-rose-500/20 text-burgundy-700 dark:text-burgundy-300 text-xs font-semibold mb-3">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Systematic Limitation & Void Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Candidate Research Gaps Explorer
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Systematically identified research voids derived from recurring limitations, small sample sizes, single-farm biases, and translational deficits documented across literature.
        </p>
      </div>

      {/* Epistemological Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
        <span className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
          <ShieldCheck className="w-4 h-4 text-forest-600" />
          Methodological Principle:
        </span>
        <p className="leading-relaxed">
          The platform does not claim that AI can objectively 'prove' a research gap. Instead, candidate gaps are identified based on verifiable evidence patterns: repeated authorial limitations, sample sizes under 50 animals, lack of cross-farm validation, absence of economic ROI calculations, and geographical concentration.
        </p>
      </div>

      {/* Gaps List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              id={gap.id}
              className="p-6 sm:p-8 rounded-3xl academic-card space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-burgundy-700/10 text-burgundy-700 dark:text-burgundy-300 text-xs font-semibold border border-rose-500/20">
                    Category: {gap.gap_category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                    {gap.title}
                  </h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                  Consensus: {gap.confidence_coverage}
                </span>
              </div>

              {/* Rationale & Empirical Proof */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="space-y-2 p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                  <span className="text-xs font-bold uppercase text-burgundy-700 dark:text-burgundy-300 tracking-wider block">
                    Why This May Represent a Research Gap
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {gap.why_this_is_a_gap}
                  </p>
                </div>

                <div className="space-y-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                    Evidence Supporting This Observation
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {gap.evidence_supporting_observation}
                  </p>
                </div>

              </div>

              {/* Emerging Work & Open Questions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Emerging research addressing it */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-forest-700 dark:text-forest-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-forest-500" />
                    Research Already Attempting to Address It
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {gap.research_already_addressing || 'Emerging interdisciplinary trials currently underway.'}
                  </p>
                </div>

                {/* Open Research Questions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    Questions That Remain Open
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {gap.open_research_questions?.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">?</span>
                        <span className="italic">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Sources Reporting the Limitation */}
              {gap.sources_reporting_limitation?.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Peer-Reviewed Literature Reporting Limitation:
                  </span>
                  {gap.sources_reporting_limitation.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>{s.title} ({s.year})</span>
                    </span>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
