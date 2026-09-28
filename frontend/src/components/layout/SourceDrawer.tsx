'use client';

import React, { useState } from 'react';
import { useSourceDrawer } from '@/context/SourceDrawerContext';
import { X, ExternalLink, ShieldCheck, BookOpen, AlertTriangle, CheckCircle, Tag, Calendar, Database, MapPin } from 'lucide-react';
import { getAuthorityTierBadge, getVerificationStatusBadge, formatDate } from '@/lib/utils';
import { api } from '@/lib/api-client';

export default function SourceDrawer() {
  const { isOpen, activeDoc, isLoading, closeDrawer } = useSourceDrawer();
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: string) => {
    if (!activeDoc) return;
    setUpdating(true);
    try {
      await api.updateDocumentStatus(activeDoc.id, newStatus);
      activeDoc.verification_status = newStatus;
      setStatusMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-forest-600 dark:text-forest-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Primary Scholarly Source
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-500">Retrieving verifiable citation metadata...</p>
              </div>
            ) : activeDoc ? (
              <>
                {/* Title and Authority Tier */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getAuthorityTierBadge(activeDoc.authority_tier).color}`}>
                      {getAuthorityTierBadge(activeDoc.authority_tier).label}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getVerificationStatusBadge(activeDoc.verification_status).color}`}>
                      {getVerificationStatusBadge(activeDoc.verification_status).label}
                    </span>
                    {activeDoc.is_open_access && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                        Open Access
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {activeDoc.title}
                  </h3>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-sm border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-medium text-slate-400 block uppercase">Authors</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {activeDoc.authors?.map(a => a.name).join(', ') || 'Scholarly Authors'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block uppercase">Publication Venue</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {activeDoc.venue_name || 'Academic Journal'} ({activeDoc.publication_year})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block uppercase">DOI / Identifier</span>
                    {activeDoc.doi ? (
                      <a
                        href={`https://doi.org/${activeDoc.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest-600 dark:text-forest-400 hover:underline flex items-center gap-1 font-mono text-xs"
                      >
                        {activeDoc.doi} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 text-xs">Unindexed DOI</span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400 block uppercase">Retrieved From</span>
                    <span className="text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                      <Database className="w-3 h-3 text-slate-400" /> {activeDoc.source_name || 'OpenAlex / Crossref'}
                    </span>
                  </div>
                </div>

                {/* Epistemological Findings vs Limitations */}
                <div className="space-y-4">
                  {activeDoc.findings_summary && (
                    <div className="p-4 rounded-xl bg-sand-100/60 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-800/40">
                      <div className="flex items-center gap-2 mb-2 text-forest-800 dark:text-sand-300 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Documented Empirical Findings</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeDoc.findings_summary}
                      </p>
                    </div>
                  )}

                  {activeDoc.limitations_summary && (
                    <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                      <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-sand-300 font-semibold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Documented Limitations & Scope Constraints</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeDoc.limitations_summary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Abstract */}
                {activeDoc.abstract && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">
                      Abstract
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      {activeDoc.abstract}
                    </p>
                  </div>
                )}

                {/* Entity Tags */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Associated Entities & Classifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeDoc.technologies?.map(t => (
                      <span key={t.id} className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                        ⚡ Tech: {t.name}
                      </span>
                    ))}
                    {activeDoc.species?.map(s => (
                      <span key={s.id} className="px-2.5 py-1 text-xs rounded-lg bg-forest-700/10 text-forest-700 dark:text-sand-300 border border-forest-700/20">
                        🐄 Species: {s.common_name}
                      </span>
                    ))}
                    {activeDoc.applications?.map(a => (
                      <span key={a.id} className="px-2.5 py-1 text-xs rounded-lg bg-sand-300/20 text-sand-700 dark:text-sand-300 border border-amber-500/20">
                        🎯 Use Case: {a.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Researcher Verification Actions */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">
                    Researcher Peer Verification
                  </h4>
                  {statusMsg && (
                    <div className="mb-3 p-2 bg-sand-1000/20 text-forest-700 dark:text-sand-300 text-xs rounded-lg border border-forest-700/30">
                      {statusMsg}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {["Verified", "Needs Review", "Conflicting Evidence", "Outdated"].map(st => (
                      <button
                        key={st}
                        disabled={updating || activeDoc.verification_status === st}
                        onClick={() => handleStatusChange(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                          activeDoc.verification_status === st
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent cursor-default'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        Mark as {st}
                      </button>
                    ))}
                  </div>
                </div>

              </>
            ) : null}
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">
              PLF Knowledge Base ID: #{activeDoc?.id}
            </span>
            {activeDoc?.canonical_url && (
              <a
                href={activeDoc.canonical_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg flex items-center gap-1.5 transition shadow-sm"
              >
                Access Source via DOI <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
