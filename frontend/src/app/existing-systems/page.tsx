'use client';

import React, { useEffect, useState } from 'react';
import { 
  Layers, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, 
  BookOpen, Building2, MapPin, Activity, Calendar
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { CommercialSystem } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function ExistingSystemsPage() {
  const [systems, setSystems] = useState<CommercialSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  useEffect(() => {
    async function fetchSystems() {
      try {
        const data = await api.getCommercialSystems();
        setSystems(data);
      } catch (err) {
        console.error("Failed to load commercial systems:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSystems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-300/20 border border-amber-500/20 text-amber-800 dark:text-sand-300 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Industry vs Scientific Evaluation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Commercial PLF Systems Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          A rigorous directory of commercially deployed precision livestock products, cataloging claimed vendor capabilities alongside independently reported peer-reviewed validation evidence.
        </p>
      </div>

      {/* Critical Epistemological Notice */}
      <div className="p-4 rounded-2xl bg-sand-300/20 border border-sand-400/35 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-sand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Scientific Epistemology Rule:</span>
          <p className="leading-relaxed">
            This platform strictly segregates <strong>"Vendor Claims"</strong> (unverified commercial promotional statements) from <strong>"Independent Scientific Evidence"</strong> (third-party university or peer-reviewed validation trials). Never present marketing claims as established scientific truth.
          </p>
        </div>
      </div>

      {/* Systems Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {systems.map((sys) => (
            <div
              key={sys.id}
              id={sys.id}
              className="p-6 sm:p-8 rounded-3xl academic-card space-y-6"
            >
              {/* Product Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{sys.company_name}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{sys.geographical_availability}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {sys.product_name}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
                    Verified: {sys.date_verified}
                  </span>
                  {sys.website_url && (
                    <a
                      href={sys.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                    >
                      <span>Vendor Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Purpose & Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Product Purpose & Target Operational Environment
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {sys.purpose}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Environment: {sys.deployment_environment}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Sensors & Continuous Measurements Collected
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sys.measurements_collected}
                  </p>
                </div>
              </div>

              {/* BIFURCATION: VENDOR CLAIMS VS INDEPENDENT EVIDENCE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* VENDOR CLAIMS COLUMN */}
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-sand-300 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-sand-600" />
                    <span>Vendor Marketing Claims (Unverified Baseline)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {sys.vendor_claims?.map((claim, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sand-600 font-bold">▪</span>
                        <span>"{claim}"</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* INDEPENDENT SCIENTIFIC EVIDENCE COLUMN */}
                <div className="p-5 rounded-2xl bg-sand-200/30 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-700/30 space-y-3">
                  <div className="flex items-center gap-2 text-forest-800 dark:text-sand-300 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-forest-600" />
                    <span>Independent Peer-Reviewed Scientific Evidence</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sys.independent_evidence_summary || 'Independent university field validation documented in peer-reviewed literature.'}
                  </p>
                  {sys.evidence_paper_dois?.length > 0 && (
                    <div className="pt-2 border-t border-sand-300/60 dark:border-forest-700/40 flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] uppercase font-bold text-forest-700 dark:text-forest-400">
                        Evidence DOIs:
                      </span>
                      {sys.evidence_paper_dois.map((doi) => (
                        <a
                          key={doi}
                          href={`https://doi.org/${doi}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded bg-forest-700 text-white text-[10px] font-mono hover:bg-forest-700 flex items-center gap-1"
                        >
                          {doi} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Documented Limitations */}
              {sys.limitations?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Documented Operational Constraints & Failure Modes:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                    {sys.limitations.map((lim, idx) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
