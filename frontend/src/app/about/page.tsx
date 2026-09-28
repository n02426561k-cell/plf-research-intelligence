import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, ShieldCheck, BookOpen, Compass, ArrowRight, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-slate-700 dark:text-slate-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl bg-white dark:bg-forest-950/80 p-3 border border-sand-300/80 dark:border-forest-700/60 shadow-lg flex items-center justify-center">
          <Image
            src="/logo-transparent.png"
            alt="PLF Research Intelligence Logo"
            width={160}
            height={160}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Project Purpose & Scope</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-heading">
            About PLF Research Intelligence
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-sand-300/80 leading-relaxed italic font-serif">
            A Living Knowledge Base for Precision Livestock Farming.
          </p>
        </div>
      </div>

      {/* Narrative */}
      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          <strong>PLF Research Intelligence</strong> is an academic-grade, evidence-driven research discovery and synthesis platform designed to serve researchers, agricultural students, veterinarians, livestock engineers, policymakers, and innovative livestock producers worldwide.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-4">
          Core Research Mission
        </h2>
        <p>
          The platform answers the overarching research questions:
          <br />
          <em>
            "What is currently known about Precision Livestock Farming, how has it evolved, where is it being used, what technologies exist, what evidence supports them, what problems remain unsolved, and where are the research and implementation opportunities?"
          </em>
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-4">
          Guiding Scientific Principles
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Evidence Traceability:</strong> Every empirical statement is tied to a primary peer-reviewed DOI, publication venue, author cohort, and retrieval timestamp.</li>
          <li><strong>Epistemological Rigor:</strong> Clear distinction between raw data, author interpretations, commercial vendor claims, independent evidence, candidate gaps, and exploratory hypotheses.</li>
          <li><strong>Ethical Harvesting:</strong> 100% adherence to robots.txt, polite token-bucket rate limiting, copyright preservation, and zero paywall circumvention.</li>
          <li><strong>Global Inclusivity:</strong> Dedicated scientific focus on extensive rangelands, tropical climates, and smallholder farming in sub-Saharan Africa, challenging the assumption that indoor European barn technologies automatically transfer.</li>
        </ul>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4">
          <Link
            href="/literature"
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <span>Explore Literature</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/methodology"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Read Methodology
          </Link>
        </div>
      </div>

    </div>
  );
}
