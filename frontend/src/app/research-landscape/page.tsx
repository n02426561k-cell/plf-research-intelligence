'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, BarChart3, PieChart, Globe, Shield, Calendar, 
  Layers, ArrowRight, BookOpen, Cpu, Sparkles
} from 'lucide-react';
import { api } from '@/lib/api-client';

export default function ResearchLandscapePage() {
  const [landscape, setLandscape] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLandscape() {
      try {
        const data = await api.getLandscapeAnalytics();
        setLandscape(data);
      } catch (err) {
        console.error("Failed to load landscape analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLandscape();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-700/10 border border-indigo-500/20 text-burgundy-700 dark:text-burgundy-300 text-xs font-semibold mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Macro Research Intelligence & Visual Distributions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          PLF Research Landscape
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Dynamic distributions generated directly from the knowledge base, highlighting historical publication trajectories, species concentration, sensing modality trends, and geographic coverage.
        </p>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : landscape ? (
        <div className="space-y-12">
          
          {/* Top Row: Publications by Year & Authority Tier */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Publications by Year */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-600" />
                  Publications Chronology
                </h3>
                <span className="text-xs text-slate-400 font-mono">Dynamic DB</span>
              </div>
              <p className="text-xs text-slate-500">
                Peer-reviewed publication volume indexed per year.
              </p>
              
              <div className="space-y-3 pt-2">
                {landscape.publications_by_year?.map((item: any) => {
                  const maxCount = Math.max(...landscape.publications_by_year.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.year} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Year {item.year}</span>
                        <span>{item.count} papers</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-500 to-forest-700 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research by Authority Tier */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Evidence Authority Tiers
                </h3>
                <span className="text-xs text-slate-400 font-mono">Hierarchy A-F</span>
              </div>
              <p className="text-xs text-slate-500">
                Classification of indexed sources across institutional and peer-review hierarchies.
              </p>

              <div className="space-y-3 pt-2">
                {landscape.authority_tier_distribution?.map((item: any) => {
                  const maxCount = Math.max(...landscape.authority_tier_distribution.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.tier} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.tier}</span>
                        <span>{item.count} sources</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-burgundy-700 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Middle Row: Research by Species & Technology */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Research by Species */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-forest-600" />
                  Species Concentration in Literature
                </h3>
                <span className="text-xs text-slate-400 font-mono">Cross-Species</span>
              </div>
              <p className="text-xs text-slate-500">
                Number of empirical studies evaluating specific livestock species.
              </p>

              <div className="space-y-3 pt-2">
                {landscape.research_by_species?.map((item: any) => {
                  const maxCount = Math.max(...landscape.research_by_species.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.species} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.species}</span>
                        <span>{item.count} papers</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-500 to-forest-700 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research by Technology Modality */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Sensing Modality Distribution
                </h3>
                <span className="text-xs text-slate-400 font-mono">Sensors</span>
              </div>
              <p className="text-xs text-slate-500">
                Prevalence of sensor modalities deployed across peer-reviewed investigations.
              </p>

              <div className="space-y-3 pt-2">
                {landscape.research_by_technology?.map((item: any) => {
                  const maxCount = Math.max(...landscape.research_by_technology.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.technology} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span className="truncate pr-2">{item.technology}</span>
                        <span className="shrink-0">{item.count} papers</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Row: Geographic Distribution & Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Geographic Coverage */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-burgundy-700" />
                  Geographic Region Coverage
                </h3>
                <span className="text-xs text-slate-400 font-mono">Global Spread</span>
              </div>
              <p className="text-xs text-slate-500">
                Regional field trial environments documented across the knowledge base.
              </p>

              <div className="space-y-3 pt-2">
                {landscape.geographic_distribution?.map((item: any) => {
                  const maxCount = Math.max(...landscape.geographic_distribution.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.region} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.region}</span>
                        <span>{item.count} studies</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Distribution */}
            <div className="p-6 rounded-2xl academic-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-forest-600" />
                  Evidence Peer-Verification Status
                </h3>
                <span className="text-xs text-slate-400 font-mono">Verification</span>
              </div>
              <p className="text-xs text-slate-500">
                Quality flags assigned by peer reviewers and systematic extraction checks.
              </p>

              <div className="space-y-3 pt-2">
                {landscape.verification_status_distribution?.map((item: any) => {
                  const maxCount = Math.max(...landscape.verification_status_distribution.map((x: any) => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.status} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{item.status}</span>
                        <span>{item.count} records</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-forest-500 to-forest-700 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
