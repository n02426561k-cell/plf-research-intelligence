'use client';

import React, { useEffect, useState } from 'react';
import { 
  Calendar, Filter, Clock, BookOpen, ExternalLink, Activity, 
  CheckCircle2, Compass, Layers, Cpu
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { TimelineEvent } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  const eras = ['All', 'Electronic ID Era', 'Automated Sensing Era', 'IoT & Deep Learning Era', 'Autonomous Robotics Era'];

  useEffect(() => {
    async function loadTimeline() {
      setLoading(true);
      try {
        const era = selectedEra === 'All' ? undefined : selectedEra;
        const data = await api.getTimelineEvents({ era });
        setEvents(data);
      } catch (err) {
        console.error("Failed to load timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, [selectedEra]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Historical & Paradigm Progression</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Interactive PLF Evolution Timeline
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Chronological progression of technological, conceptual, and clinical breakthroughs that defined modern Precision Livestock Farming, with verified historical citations.
        </p>
      </div>

      {/* Era Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold uppercase text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by Era:
        </span>
        {eras.map((era) => (
          <button
            key={era}
            onClick={() => setSelectedEra(era)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              selectedEra === era
                ? 'bg-forest-700 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-8 border-l-2 border-forest-700/30 dark:border-forest-700/20">
          {events.map((ev, idx) => (
            <div key={ev.id} className="relative group">
              
              {/* Timeline Pin */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-forest-700 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-slate-950 shadow-md group-hover:scale-125 transition">
                {idx + 1}
              </div>

              {/* Event Card */}
              <div className="p-6 rounded-2xl academic-card space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-forest-700 text-white text-xs font-mono font-bold">
                      {ev.year}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {ev.era}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-mono">
                    {ev.technology_focus}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {ev.milestone_title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {ev.development_summary}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <strong className="text-slate-900 dark:text-slate-100 font-bold block mb-1">
                    Significance & Impact on Animal Agriculture:
                  </strong>
                  <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ev.significance}
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="text-slate-500 font-serif italic truncate max-w-md">
                    Source: {ev.primary_source_citation}
                  </div>
                  {ev.document_id ? (
                    <button
                      onClick={() => openDrawerWithDocId(ev.document_id!)}
                      className="px-3 py-1 rounded-lg bg-forest-700/10 text-forest-700 dark:text-sand-300 hover:bg-sand-1000/20 border border-forest-700/30 transition flex items-center gap-1 font-semibold"
                    >
                      <span>View Primary Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : ev.source_url ? (
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1"
                    >
                      <span>Historical Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
