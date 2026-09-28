import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Database, Filter, Layers, CheckCircle2, 
  AlertTriangle, Lock, BookOpen, Compass, Scale, Cpu
} from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-slate-700 dark:text-slate-300">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Academic Defensibility & Protocol Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Methodology, Harvesting Ethics & Governance
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Detailed disclosure of discovery algorithms, deduplication criteria, multi-axis taxonomy tagging, ethical crawler boundaries, and copyright compliance protocols.
        </p>
      </div>

      {/* 1. DISCOVERY & HARVESTING STRATEGY */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-forest-600" />
          1. Source Discovery & Ingestion Channels
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed">
          PLF Research Intelligence does not claim to have scraped "the entire internet." Instead, it functions as a curated, continuously expanding research crawler that queries permitted scholarly APIs, open-access feeds, and institutional repositories.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <strong className="text-slate-900 dark:text-slate-100 block font-semibold">Method 1: Open Scholarly APIs</strong>
            <p className="text-slate-600 dark:text-slate-400">OpenAlex REST API, Crossref Works API, PubMed NCBI E-Utilities, and Europe PMC.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <strong className="text-slate-900 dark:text-slate-100 block font-semibold">Method 2: Institutional & Journal Feeds</strong>
            <p className="text-slate-600 dark:text-slate-400">RSS / Atom syndication feeds from leading ag-engineering journals and research institutes (ILRI, FAO, Teagasc).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <strong className="text-slate-900 dark:text-slate-100 block font-semibold">Method 3: Permitted Web Sitemaps</strong>
            <p className="text-slate-600 dark:text-slate-400">Periodic sitemap indexing of open-access university conference proceedings and agricultural extension services.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <strong className="text-slate-900 dark:text-slate-100 block font-semibold">Method 4: User & Researcher Submissions</strong>
            <p className="text-slate-600 dark:text-slate-400">Peer-reviewed DOI submission portal subjected to automated metadata validation and deduplication.</p>
          </div>
        </div>
      </section>

      {/* 2. DEDUPLICATION ENGINE */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          2. Multi-Key Deduplication Engine
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed">
          The same scientific publication frequently appears across multiple discovery databases (e.g. PubMed, Crossref, and university repositories). To prevent redundant duplication, incoming payloads pass through a 3-tier deduplication filter:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li><strong>Level 1 (Canonical DOI):</strong> Exact match against normalized, stripped digital object identifiers (lowercased without URL prefixes).</li>
          <li><strong>Level 2 (PMID / OpenAlex ID):</strong> Secondary exact matching on NCBI PubMed identifiers and OpenAlex persistent work IDs.</li>
          <li><strong>Level 3 (Jaccard Title Similarity & Year Match):</strong> For preprints or un-indexed reports, title word-token Jaccard similarity exceeding 88% combined with author overlap and publication year (±1 year) triggers merging rather than duplicate creation.</li>
        </ul>
      </section>

      {/* 3. MULTI-AXIS CLASSIFICATION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-burgundy-700" />
          3. Multi-Axis Taxonomy Classification
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed">
          Harvested abstracts and titles are automatically evaluated against the editable <strong>PLF Taxonomy Dictionary</strong>. The classifier auto-assigns tags across four orthogonal dimensions:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
          <div className="p-3 rounded-lg bg-sand-100 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-800">
            <span className="font-bold text-forest-800 dark:text-sand-300 block">Species</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Dairy cattle, beef, pigs, poultry, sheep, goats, horses, aquaculture.</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <span className="font-bold text-blue-800 dark:text-blue-300 block">Technology</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Computer vision, wearables, RFID, audio, thermal IRT, gas sensors, GNSS.</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span className="font-bold text-amber-800 dark:text-sand-300 block">Application</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Lameness, mastitis, estrus, coughing, BCS, methane, farrowing.</span>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <span className="font-bold text-purple-800 dark:text-purple-300 block">Geography</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Sub-Saharan Africa, Europe, North America, Oceania, Latin America.</span>
          </div>
        </div>
      </section>

      {/* 4. ETHICAL CRAWLING POLICY & ROBOTS.TXT COMPLIANCE */}
      <section id="crawler-policy" className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-5 h-5 text-forest-600" />
          4. Ethical Crawling Policy, Copyright & Robots.txt Compliance
        </h2>
        <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
          <p className="leading-relaxed font-medium text-slate-800 dark:text-slate-200">
            The crawler operates under a strict, verifiable ethical charter:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
            <li><strong>Polite Rate Limiting:</strong> Enforces minimum token-bucket delays (0.5 to 2.0 seconds between requests) to prevent server strain.</li>
            <li><strong>Transparent User-Agent:</strong> Identifies requests as <code>PLF-Research-Bot/1.0 (+https://plf-research.org/methodology)</code> with active contact information.</li>
            <li><strong>Strict robots.txt Compliance:</strong> Respects all <code>Disallow</code> directives and <code>Crawl-Delay</code> rules unconditionally.</li>
            <li><strong>Zero Paywall or DRM Circumvention:</strong> The system NEVER bypasses paywalls, authentication walls, Cloudflare challenges, or CAPTCHAs.</li>
            <li><strong>Copyright Adherence:</strong> We do NOT copy entire copyrighted articles or host full-text PDFs. We store metadata, open abstracts where legally permitted, structured factual extractions, and direct DOI destination links.</li>
          </ul>
        </div>
      </section>

      {/* 5. HOW RESEARCH GAPS ARE DETECTED */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-burgundy-700" />
          5. Research Gap Identification Methodology
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed">
          Candidate research gaps are extracted by analyzing systematic limitation patterns across literature cohorts, including:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <strong className="text-burgundy-700 dark:text-burgundy-300 block mb-1 font-semibold">Single-Farm & Sample Size Flags</strong>
            <p className="text-slate-600 dark:text-slate-400">Studies with cohorts under 50 animals or without external multi-farm validation.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <strong className="text-burgundy-700 dark:text-burgundy-300 block mb-1 font-semibold">Economic & ROI Evaluation Absence</strong>
            <p className="text-slate-600 dark:text-slate-400">Engineering publications omitting net present value or farm balance sheet metrics.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <strong className="text-burgundy-700 dark:text-burgundy-300 block mb-1 font-semibold">Extensive / Pastoralism Scarcity</strong>
            <p className="text-slate-600 dark:text-slate-400">Concentration of literature in indoor temperate barns vs extensive tropical rangelands.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <strong className="text-burgundy-700 dark:text-burgundy-300 block mb-1 font-semibold">Multi-Sensor Fusion Deficit</strong>
            <p className="text-slate-600 dark:text-slate-400">Isolated single-sensor telemetry vs integrated multimodal physiological modeling.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
