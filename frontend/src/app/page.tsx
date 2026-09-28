'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Cpu, AlertTriangle, ArrowRight, Database, 
  Layers, Compass, Activity, Globe, Sparkles, TrendingUp, Calendar, ExternalLink,
  Microscope, Network, Shield, Search, ChevronRight, Zap, BarChart3, Radio
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { LiveStats, Document, ResearchGap, TimelineEvent } from '@/lib/types';
import { useSourceDrawer } from '@/context/SourceDrawerContext';
import { getAuthorityTierBadge, formatDate } from '@/lib/utils';

/* -------------------------------------------------------
   Animated Count-Up Hook
------------------------------------------------------- */
function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

/* -------------------------------------------------------
   Stat Card sub-component
------------------------------------------------------- */
function StatCard({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const animated = useCountUp(value, 900 + delay * 100);
  return (
    <div 
      className="p-4 rounded-2xl bg-white/15 dark:bg-white/10 border border-white/30 shadow-sm backdrop-blur-md animate-fade-in-up"
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      <span className="text-3xl font-extrabold block text-white tabular-nums drop-shadow" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {animated}
      </span>
      <span className="text-xs font-medium text-white/80 mt-1 block leading-snug">
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------
   Main Page Component
------------------------------------------------------- */
export default function HomePage() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [milestones, setMilestones] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { openDrawerWithDocId } = useSourceDrawer();

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, docsData, gapsData, timelineData] = await Promise.all([
          api.getOverviewStats(),
          api.getDocuments({ page_size: 4, sort_by: 'recent' }),
          api.getResearchGaps(),
          api.getTimelineEvents({ limit: 3 })
        ]);
        setStats(statsData);
        setRecentDocs(docsData.items || []);
        setGaps(gapsData.slice(0, 3));
        setMilestones(timelineData.slice(0, 3));
      } catch (err) {
        console.error("Failed to load live platform data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statItems = [
    { label: 'Sources Indexed', value: stats?.sources_indexed ?? 0, color: 'text-forest-600 dark:text-forest-400' },
    { label: 'Research Papers', value: stats?.research_papers_discovered ?? 0, color: 'text-forest-600 dark:text-forest-400' },
    { label: 'Technologies', value: stats?.technologies_identified ?? 0, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Species Covered', value: stats?.animal_species_covered ?? 0, color: 'text-forest-600 dark:text-forest-400' },
    { label: 'Applications', value: stats?.applications_identified ?? 0, color: 'text-sand-600 dark:text-sand-400' },
    { label: 'Countries', value: stats?.countries_represented ?? 0, color: 'text-burgundy-700 dark:text-burgundy-400' },
    { label: 'Research Gaps', value: stats?.research_gaps_detected ?? 0, color: 'text-burgundy-700 dark:text-burgundy-400' },
  ];

  return (
    <div className="space-y-20 pb-24">

      {/* ===================================================
          1. HERO SECTION — Full-bleed aerial farm background
      =================================================== */}
      <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>

        {/* Background: aerial farm photo */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/farm-aerial.jpg')" }}
        />

        {/* Multi-layer gradient overlay for text legibility */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, rgba(8,33,32,0.82) 0%, rgba(15,61,58,0.72) 40%, rgba(108,21,30,0.55) 100%)'
        }} />

        {/* Subtle dot overlay for texture */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(8,33,32,0.4))'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 sm:py-32">

          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white/95 text-xs font-semibold mb-8 animate-fade-in backdrop-blur-md shadow-sm">
            <Image src="/logo-emblem.png" alt="PLF Emblem" width={22} height={22} className="w-5 h-5 object-contain" />
            <span>Living Knowledge Base · Continuously Harvested &amp; Updated</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.05] animate-fade-in-up drop-shadow-lg">
            <span className="block">Precision Livestock</span>
            <span className="block mt-1" style={{
              background: 'linear-gradient(135deg, #F5DABF, #daa875)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Farming Intelligence
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-3xl leading-relaxed animate-fade-in-up animate-delay-100 drop-shadow">
            The evidence-driven research platform for <strong className="text-sand-300">PLF science</strong> — exploring sensor technologies,
            empirical validations, bio-response models, historical timelines, commercial systems,
            and unresolved research frontiers across all livestock species.
          </p>

          {/* Action Buttons with high-visibility palette highlighting */}
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up animate-delay-200">
            <Link
              href="/what-is-plf"
              id="hero-explore-btn"
              className="px-7 py-3.5 rounded-xl text-forest-950 text-sm font-bold shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 hover:shadow-2xl"
              style={{ 
                background: 'linear-gradient(135deg, #F5DABF, #e0b080)', 
                border: '1px solid #daa875',
                boxShadow: '0 6px 24px rgba(245,218,191,0.4)' 
              }}
            >
              <Compass className="w-4 h-4 text-forest-800" />
              <span>Explore the Knowledge Base</span>
            </Link>
            <Link
              href="/literature"
              id="hero-literature-btn"
              className="px-7 py-3.5 rounded-xl text-sand-200 text-sm font-bold shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #0f3d3a, #1b5a54)',
                border: '1px solid rgba(245,218,191,0.45)',
                boxShadow: '0 6px 24px rgba(15,61,58,0.45)'
              }}
            >
              <Database className="w-4 h-4 text-sand-300" />
              <span>Discover Research</span>
            </Link>
            <Link
              href="/technologies"
              id="hero-technologies-btn"
              className="px-7 py-3.5 rounded-xl text-sand-200 text-sm font-bold shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #6c151e, #831b27)',
                border: '1px solid rgba(245,218,191,0.45)',
                boxShadow: '0 6px 24px rgba(108,21,30,0.45)'
              }}
            >
              <Cpu className="w-4 h-4 text-sand-300" />
              <span>Technology Catalog</span>
            </Link>
          </div>

          {/* --- LIVE METRICS COUNTER STRIP --- */}
          <div className="mt-16 pt-10 border-t border-white/20">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-sand-300 animate-pulse" />
                Live Database Intelligence Metrics
              </span>
              <span className="text-xs text-white/60 font-mono">
                Last ingestion: {stats?.last_crawl_date ? formatDate(stats.last_crawl_date) : '—'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {statItems.map((item, idx) => (
                !loading && stats ? (
                  <StatCard key={idx} label={item.label} value={item.value} color={item.color} delay={idx} />
                ) : (
                  <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm h-20 shimmer" />
                )
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================
          2. RESEARCH MISSION STATEMENT
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl academic-card academic-card-elevated bg-gradient-to-br from-forest-700/10 via-sand-200/20 to-burgundy-700/10 border border-sand-300/60 dark:border-forest-700/50 shadow-lg">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-700/10 dark:bg-forest-700/30 border border-forest-700/30 text-forest-800 dark:text-sand-300 text-xs font-semibold">
              <Microscope className="w-3.5 h-3.5 text-forest-600 dark:text-sand-300" />
              Central Research Mandate
            </span>
            <blockquote className="text-lg sm:text-2xl font-semibold text-forest-950 dark:text-sand-100 leading-relaxed font-serif italic">
              &ldquo;What is currently known about Precision Livestock Farming, how has it evolved, where is it being applied, 
              what technologies and evidence exist, what challenges remain, and where are the unresolved research opportunities?&rdquo;
            </blockquote>
            <p className="text-xs sm:text-sm text-forest-800/80 dark:text-sand-300/80">
              Every page in this platform is driven by <strong className="text-forest-900 dark:text-sand-200">traceable, peer-reviewed evidence</strong> — not vendor marketing or editorialisation.
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. FEATURE SHOWCASE: REAL-WORLD CATTLE TELEMETRY
          Full-width atmospheric image banner using cattle-tagged.jpg
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-sand-300/50 dark:border-forest-700/60" style={{ minHeight: '440px' }}>
          
          {/* Background: cattle close-up with ear tags */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/cattle-tagged.jpg')" }}
          />

          {/* Multi-layer gradient overlay for high contrast and brand coherence */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(8,33,32,0.94) 0%, rgba(15,61,58,0.85) 45%, rgba(108,21,30,0.72) 100%)'
            }}
          />

          {/* Subtle dot overlay for texture */}
          <div className="absolute inset-0 bg-dot-pattern opacity-15 pointer-events-none" />

          {/* Content overlay */}
          <div className="relative z-10 p-8 sm:p-14 max-w-3xl flex flex-col justify-between h-full space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-300/20 border border-sand-300/40 text-sand-200 text-xs font-semibold mb-5 backdrop-blur-sm">
                <Radio className="w-3.5 h-3.5 text-sand-300 animate-pulse" />
                <span>Continuous Individual Bio-Sensing · Tag Telemetry</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Treating Every Animal as an <span className="text-sand-300">Individual Biological System</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                Precision Livestock Farming replaces herd-average approximations with continuous, real-time monitoring of each individual animal. 
                Through RFID/EID ear tags, 3D accelerometers, and acoustic sensor networks, researchers and producers detect health alerts, estrus cycles, and welfare anomalies up to 48 hours before visible symptoms manifest.
              </p>
            </div>

            {/* Feature telemetry metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15">
                <span className="text-2xl font-extrabold text-sand-300 block font-mono">99.4%</span>
                <span className="text-xs text-white/80 mt-0.5 block">RFID EID Read Reliability</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15">
                <span className="text-2xl font-extrabold text-white block font-mono">±2.1 min</span>
                <span className="text-xs text-white/80 mt-0.5 block">Daily Rumination Precision</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 col-span-2 sm:col-span-1">
                <span className="text-2xl font-extrabold text-sand-300 block font-mono">48 hrs</span>
                <span className="text-xs text-white/80 mt-0.5 block">Pre-Clinical Disease Warning</span>
              </div>
            </div>

            {/* High-visibility Action Buttons matching palette: #6c151e, #0f3d3a, #F5DABF */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                href="/species/dairy-cattle"
                id="feature-cattle-btn"
                className="px-6 py-3 rounded-xl text-sand-200 text-xs sm:text-sm font-bold shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #6c151e, #831b27)', 
                  border: '1px solid rgba(245,218,191,0.35)', 
                  boxShadow: '0 4px 16px rgba(108,21,30,0.45)' 
                }}
              >
                <Layers className="w-4 h-4 text-sand-300" />
                <span>Explore Cattle Research Hub</span>
              </Link>
              <Link
                href="/technologies"
                id="feature-sensors-btn"
                className="px-6 py-3 rounded-xl text-sand-100 text-xs sm:text-sm font-bold shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #0f3d3a, #1b5a54)', 
                  border: '1px solid rgba(245,218,191,0.35)', 
                  boxShadow: '0 4px 16px rgba(15,61,58,0.45)' 
                }}
              >
                <Cpu className="w-4 h-4 text-sand-300" />
                <span>View Sensor Modalities</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          3. CORE KNOWLEDGE HUB NAVIGATION
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Comprehensive PLF Research Architecture
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Navigate through structured scientific domains — from sensor physics to economic feasibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {[
            {
              href: '/what-is-plf', icon: Compass, iconBg: 'bg-forest-700/10', iconColor: 'text-forest-600 dark:text-forest-400',
              hoverColor: 'group-hover:text-forest-600',
              title: 'What is PLF?',
              desc: 'Formal definitions, the 10-stage closed-loop bio-response architecture, and how PLF differs from conventional livestock management and digital agriculture.',
              cta: 'Read conceptual foundation',
              ctaColor: 'text-forest-600 dark:text-forest-400'
            },
            {
              href: '/technologies', icon: Cpu, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600 dark:text-blue-400',
              hoverColor: 'group-hover:text-blue-600',
              title: 'Technology Catalog',
              desc: '8 sensor families: Computer Vision, Tri-Axial Wearables, RFID/EID, Acoustic Monitors, IRT Thermal Cameras, Gas Sensors, GNSS/UWB, and Robotic Systems.',
              cta: 'Explore sensor modalities',
              ctaColor: 'text-blue-600 dark:text-blue-400'
            },
            {
              href: '/species', icon: Layers, iconBg: 'bg-forest-500/10', iconColor: 'text-forest-600 dark:text-forest-400',
              hoverColor: 'group-hover:text-forest-600',
              title: 'Species Hubs',
              desc: 'Dedicated knowledge hubs for Dairy Cattle, Beef, Pigs, Poultry, Sheep, Goats, Horses and Aquaculture with species-specific literature and biological signals.',
              cta: 'Explore per-species evidence',
              ctaColor: 'text-forest-600 dark:text-forest-400'
            },
            {
              href: '/research-landscape', icon: BarChart3, iconBg: 'bg-burgundy-700/10', iconColor: 'text-burgundy-700 dark:text-burgundy-400',
              hoverColor: 'group-hover:text-burgundy-700',
              title: 'Research Landscape',
              desc: 'Dynamic visual analytics: publication chronology, species concentration in literature, sensor modality prevalence, geographic spread, and evidence authority tiers.',
              cta: 'View live research charts',
              ctaColor: 'text-burgundy-700 dark:text-burgundy-400'
            },
            {
              href: '/existing-systems', icon: Shield, iconBg: 'bg-sand-300/20', iconColor: 'text-sand-600 dark:text-sand-400',
              hoverColor: 'group-hover:text-sand-600',
              title: 'Commercial Systems',
              desc: 'Rigorously distinguishing vendor marketing claims from independently documented peer-reviewed scientific evaluations for 4+ commercial PLF deployments.',
              cta: 'Compare claims vs evidence',
              ctaColor: 'text-sand-600 dark:text-sand-400'
            },
            {
              href: '/research-gaps', icon: AlertTriangle, iconBg: 'bg-burgundy-700/10', iconColor: 'text-burgundy-700 dark:text-burgundy-400',
              hoverColor: 'group-hover:text-burgundy-700',
              title: 'Research Gaps Explorer',
              desc: 'Systematic detection of recurring limitations: single-farm validation bias, sensor fusion deficits, tropical grazing system exclusion, and ROI evidence vacuums.',
              cta: 'Explore unresolved frontiers',
              ctaColor: 'text-burgundy-700 dark:text-burgundy-400'
            },
            {
              href: '/literature', icon: BookOpen, iconBg: 'bg-forest-700/10', iconColor: 'text-forest-600 dark:text-forest-400',
              hoverColor: 'group-hover:text-forest-600',
              title: 'Literature Discovery',
              desc: 'Continuously harvested, deduplicated, and classified scholarly articles from OpenAlex, Crossref, and PubMed with full filter, sort, and evidence trace.',
              cta: 'Search peer-reviewed papers',
              ctaColor: 'text-forest-600 dark:text-forest-400'
            },
            {
              href: '/timeline', icon: Calendar, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600 dark:text-purple-400',
              hoverColor: 'group-hover:text-purple-600',
              title: 'Historical Timeline',
              desc: 'From 1975 RFID implantation in livestock through robotic milking commercialization (1992) to today\'s multi-modal foundation AI models and autonomous virtual fencing.',
              cta: 'View PLF evolutionary history',
              ctaColor: 'text-purple-600 dark:text-purple-400'
            },
            {
              href: '/regional-plf', icon: Globe, iconBg: 'bg-forest-700/10', iconColor: 'text-forest-600 dark:text-forest-400',
              hoverColor: 'group-hover:text-forest-600',
              title: 'Africa & Global South',
              desc: 'Dedicated evidence evaluation for sub-Saharan Africa and pastoral systems where >85% of PLF literature\'s indoor European assumptions fail to transfer.',
              cta: 'View regional evidence',
              ctaColor: 'text-forest-600 dark:text-forest-400'
            },
          ].map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              id={`hub-card-${idx}`}
              className="p-6 rounded-2xl academic-card group flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <card.icon className="w-5 h-5" />
              </div>
              <h3 className={`text-base font-bold text-slate-900 dark:text-slate-100 ${card.hoverColor} transition-colors duration-200`}>
                {card.title}
              </h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                {card.desc}
              </p>
              <div className={`mt-4 flex items-center text-xs font-semibold ${card.ctaColor} gap-1`}>
                <span>{card.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* ===================================================
          4. RECENTLY INDEXED RESEARCH LITERATURE
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-600" />
              Recently Indexed Scholarly Discoveries
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Harvested from OpenAlex, Crossref & PubMed · Deduplicated · Authority-tier classified
            </p>
          </div>
          <Link
            href="/literature"
            id="recent-docs-view-all"
            className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400 flex items-center gap-1 shrink-0"
          >
            <span>View full library</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl shimmer h-40" />
              ))
            : recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  id={`recent-doc-${doc.id}`}
                  className="p-5 rounded-2xl academic-card flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${getAuthorityTierBadge(doc.authority_tier).color}`}>
                        {getAuthorityTierBadge(doc.authority_tier).label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono shrink-0">
                        {doc.venue_name || 'Peer-Reviewed Journal'} · {doc.publication_year}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {doc.findings_summary || doc.abstract || 'Peer-reviewed empirical investigation into precision livestock farming.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="text-xs text-slate-400 truncate max-w-[60%]">
                      {doc.authors?.slice(0, 2).map(a => a.name).join(', ')}{doc.authors?.length > 2 ? ' et al.' : ''}
                    </div>
                    <button
                      onClick={() => openDrawerWithDocId(doc.id)}
                      id={`open-doc-${doc.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-sand-100 bg-forest-700 hover:bg-forest-800 rounded-lg border border-sand-300/30 shadow-sm transition flex items-center gap-1 shrink-0"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3 h-3 text-sand-300" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ===================================================
          5. RESEARCH GAPS BANNER
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-burgundy-900/10 via-sand-200/25 to-forest-900/10 dark:from-burgundy-950/40 dark:via-forest-950/60 dark:to-sand-900/20 border border-burgundy-700/30 dark:border-burgundy-700/40 shadow-lg">
          <div className="flex items-center justify-between mb-7">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-700 dark:text-sand-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sand-400" />
                Empirical Research Frontier
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-forest-950 dark:text-sand-100 mt-1">
                Candidate Research Gaps Detected in Literature
              </h2>
            </div>
            <Link
              href="/research-gaps"
              id="gaps-view-all-btn"
              className="px-4 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-sand-200 text-xs font-bold shadow-md transition hidden sm:inline-flex items-center gap-1.5 border border-sand-300/30"
            >
              <span>Explore All Gaps</span>
              <ArrowRight className="w-3.5 h-3.5 text-sand-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl shimmer h-40" />
                ))
              : gaps.map((gap) => (
                  <div
                    key={gap.id}
                    id={`gap-card-${gap.id}`}
                    className="p-5 rounded-2xl academic-card flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-semibold text-burgundy-700 dark:text-burgundy-400 uppercase tracking-wider">
                        {gap.gap_category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug line-clamp-2">
                        {gap.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {gap.why_this_is_a_gap}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">{gap.confidence_coverage}</span>
                      <Link href={`/research-gaps#${gap.id}`} className="text-burgundy-700 dark:text-burgundy-400 font-semibold hover:underline">
                        Inspect Evidence →
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          6. TIMELINE MILESTONES
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest-600" />
              Evolutionary Milestones in PLF
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Key scientific and commercial inflection points from 1975 to present.
            </p>
          </div>
          <Link
            href="/timeline"
            id="timeline-view-all"
            className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400 flex items-center gap-1 shrink-0"
          >
            <span>View full interactive timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl shimmer h-44" />
              ))
            : milestones.map((m, idx) => (
                <div
                  key={m.id}
                  id={`milestone-card-${m.id}`}
                  className="p-5 rounded-2xl academic-card group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-forest-700/10 text-forest-700 dark:text-sand-300 font-mono font-bold text-sm border border-forest-700/20">
                      {m.year}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {m.era}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-forest-700 dark:group-hover:text-sand-300 transition-colors">
                    {m.milestone_title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                    {m.development_summary}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-serif italic">
                    {m.primary_source_citation.slice(0, 120)}{m.primary_source_citation.length > 120 ? '...' : ''}
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ===================================================
          7. PLATFORM TRUST INDICATORS
      =================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-12 border border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Built on Scientific Principles</h2>
            <p className="text-sm text-slate-400 mt-2">Every assertion in this platform is backed by a verifiable academic chain of evidence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Evidence Traceability', desc: 'Every empirical statement tied to a primary peer-reviewed DOI, author cohort, and retrieval timestamp.', color: 'text-forest-400' },
              { icon: Microscope, title: 'Epistemological Rigor', desc: 'Strict separation: Data, Interpretation, Vendor Claim, Independent Evidence, Candidate Gap, Hypothesis.', color: 'text-blue-400' },
              { icon: Radio, title: 'Ethical Harvesting', desc: '100% robots.txt compliance, polite rate-limiting, zero paywall circumvention, and copyright preservation.', color: 'text-sand-400' },
              { icon: Globe, title: 'Global Inclusivity', desc: 'Dedicated focus on sub-Saharan Africa, smallholder tropical systems, and extensive pastoralist evidence.', color: 'text-burgundy-400' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className={`w-10 h-10 rounded-xl bg-white/5 ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick links row */}
          <div className="mt-10 pt-6 border-t border-slate-700/50 flex flex-wrap gap-3 justify-center">
            {[
              { label: 'Methodology', href: '/methodology' },
              { label: 'Source Directory', href: '/sources' },
              { label: 'Taxonomy Dictionary', href: '/admin' },
              { label: 'Knowledge Graph', href: '/knowledge-graph' },
              { label: 'About the Platform', href: '/about' },
            ].map((lnk, idx) => (
              <Link
                key={idx}
                href={lnk.href}
                id={`trust-link-${idx}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-700/60 hover:border-slate-600 transition"
              >
                {lnk.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
