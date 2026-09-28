'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Cpu, Sparkles, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useSourceDrawer } from '@/context/SourceDrawerContext';
import Link from 'next/link';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { openDrawerWithDocId } = useSourceDrawer();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query.trim());
        setResults(res);
      } catch (e) {
        console.error("Search failed:", e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-20">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-forest-600 dark:text-forest-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search technologies, research papers, species, applications, or candidate gaps..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 text-forest-500 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!results && !loading && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm">Try queries like:</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["AI for mastitis detection", "computer vision cattle", "RFID sheep", "animal welfare sensors", "PLF Africa", "virtual fencing"].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-sand-100 hover:text-forest-600 dark:hover:bg-slate-700 text-xs rounded-full transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && (
            <>
              {/* Matched Documents */}
              {results.documents?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-forest-500" />
                    Research Literature ({results.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {results.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          onClose();
                          openDrawerWithDocId(doc.id);
                        }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-forest-700/10 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {doc.title}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {doc.authors?.slice(0, 3).join(', ')} • {doc.venue} ({doc.year})
                          </p>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 bg-forest-700/10 text-forest-600 dark:text-forest-400 rounded shrink-0 ml-2">
                          View Source
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Technologies */}
              {results.technologies?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    Technologies ({results.technologies.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.technologies.map((tech: any) => (
                      <Link
                        key={tech.id}
                        href={`/technologies#${tech.id}`}
                        onClick={onClose}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-500/10 border border-slate-200/80 dark:border-slate-800 transition block"
                      >
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium block">
                          {tech.category}
                        </span>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {tech.name}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Research Gaps */}
              {results.research_gaps?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    Candidate Research Gaps ({results.research_gaps.length})
                  </h4>
                  <div className="space-y-2">
                    {results.research_gaps.map((gap: any) => (
                      <Link
                        key={gap.id}
                        href={`/research-gaps#${gap.id}`}
                        onClick={onClose}
                        className="p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition block"
                      >
                        <span className="text-xs text-burgundy-700 dark:text-burgundy-400 font-medium block">
                          {gap.gap_category}
                        </span>
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {gap.title}
                        </h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.total_matches === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No direct records found for "{query}". Try broadening your search terms.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center text-xs text-slate-400">
          <span>Press ESC to close</span>
          <span>PLF Live Knowledge Engine</span>
        </div>

      </div>
    </div>
  );
}
