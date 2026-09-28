'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function ResearchAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { openDrawerWithDocId } = useSourceDrawer();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await api.queryAssistant(query.trim());
      setResponse(res);
    } catch (err) {
      console.error(err);
      setResponse({
        answer: "Error communicating with the grounded research assistant service. Please verify backend connectivity.",
        citations: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-forest-700 to-burgundy-700 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
        aria-label="Open PLF Research Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-semibold text-sm hidden sm:inline">Research Assistant</span>
      </button>

      {/* Slide-over Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-forest-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="text-sm font-bold leading-tight">PLF Research Assistant</h3>
                <p className="text-[11px] text-sand-200">Strictly grounded in peer-reviewed database records</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-sand-200 hover:text-white rounded-lg hover:bg-forest-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation History / Output */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {!response && !loading && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 space-y-3">
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  Ask questions regarding PLF literature, evidence, and technologies:
                </p>
                <div className="space-y-1.5 text-xs">
                  {[
                    "What are the main technologies used to detect lameness in cattle?",
                    "How does acoustic cough detection perform in pig barns?",
                    "What challenges limit PLF adoption in sub-Saharan Africa?"
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQuery(example)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-sand-100 hover:text-forest-700 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
                <p className="text-xs">Querying verified literature records...</p>
              </div>
            )}

            {response && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-forest-600 dark:text-forest-400 uppercase tracking-wider block mb-1">
                    Grounded Synthesis
                  </span>
                  <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
                    {response.answer}
                  </div>
                </div>

                {/* Primary Citations */}
                {response.citations?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Underlying Literature Citations ({response.citations.length})
                    </span>
                    <div className="space-y-1.5">
                      {response.citations.map((cite: any, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => openDrawerWithDocId(cite.document_id)}
                          className="p-2 rounded-lg bg-sand-1000/5 hover:bg-forest-700/10 border border-forest-700/20 cursor-pointer transition flex items-center justify-between"
                        >
                          <div className="truncate mr-2">
                            <span className="text-xs font-semibold text-forest-700 dark:text-sand-300 block truncate">
                              {cite.citation_key}: {cite.title}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {cite.venue} ({cite.year})
                            </span>
                          </div>
                          <BookOpen className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSearch} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask research questions..."
              className="flex-1 bg-white dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-forest-500 text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-3 py-2 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
