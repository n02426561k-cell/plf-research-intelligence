'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api-client';
import { GlossaryTerm } from '@/lib/types';

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGlossary() {
      try {
        const data = await api.getGlossaryTerms();
        setTerms(data);
      } catch (err) {
        console.error("Failed to load glossary:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGlossary();
  }, []);

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(query.toLowerCase()) ||
    t.definition.toLowerCase().includes(query.toLowerCase()) ||
    (t.acronym && t.acronym.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Terminology & Definitions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
            Scientific PLF Glossary
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Authoritative definitions and peer-reviewed citations for core terminology across animal bio-responses, sensor physics, and decision support algorithms.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search definitions..."
            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>
      </div>

      {/* Terms Stream */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTerms.map((term) => (
            <div
              key={term.id}
              id={term.id}
              className="p-6 rounded-2xl academic-card space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {term.term}
                  </h2>
                  {term.acronym && (
                    <span className="px-2 py-0.5 rounded bg-forest-700/10 text-forest-700 dark:text-sand-300 font-mono text-xs font-bold border border-forest-700/20">
                      {term.acronym}
                    </span>
                  )}
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {term.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {term.definition}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong className="text-slate-800 dark:text-slate-200 font-semibold block mb-0.5">
                  Academic & Clinical Context:
                </strong>
                {term.academic_context}
              </div>

              {term.primary_citations?.length > 0 && (
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-serif italic">
                  <span>Primary Academic Citation:</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {term.primary_citations[0].authors} ({term.primary_citations[0].year}). "{term.primary_citations[0].title}".
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
