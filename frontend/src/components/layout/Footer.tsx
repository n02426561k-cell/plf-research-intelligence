import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, Shield, BookOpen, Database, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand and Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-xl bg-sand-50 dark:bg-slate-900 p-0.5 border border-sand-300/80 dark:border-slate-800 flex items-center justify-center shadow-sm overflow-hidden">
                <Image
                  src="/logo-emblem.png"
                  alt="PLF Research Intelligence"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-heading block">
                  PLF Research Intelligence
                </span>
                <span className="text-[10px] text-slate-400 font-sans block">Knowledge Base</span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              A living knowledge base and empirical research engine for Precision Livestock Farming, digital animal agriculture, and bio-response analytics.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-forest-600 dark:text-forest-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Ethical & Polite Harvesting Protocol</span>
            </div>
          </div>

          {/* Core Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Knowledge Hubs
            </h4>
            <ul className="space-y-1.5">
              <li><Link href="/what-is-plf" className="hover:text-forest-600 transition">What is PLF?</Link></li>
              <li><Link href="/technologies" className="hover:text-forest-600 transition">Technology Directory</Link></li>
              <li><Link href="/species" className="hover:text-forest-600 transition">Species Hubs</Link></li>
              <li><Link href="/applications" className="hover:text-forest-600 transition">Use Cases & Problems</Link></li>
              <li><Link href="/existing-systems" className="hover:text-forest-600 transition">Commercial Systems (Claims vs Evidence)</Link></li>
              <li><Link href="/regional-plf" className="hover:text-forest-600 transition">Sub-Saharan Africa & Pastoralism</Link></li>
            </ul>
          </div>

          {/* Research & Analytics */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Research & Evidence
            </h4>
            <ul className="space-y-1.5">
              <li><Link href="/research-landscape" className="hover:text-forest-600 transition">Research Landscape & Charts</Link></li>
              <li><Link href="/literature" className="hover:text-forest-600 transition">Literature Explorer</Link></li>
              <li><Link href="/comparison" className="hover:text-forest-600 transition">Technology Comparison Matrix</Link></li>
              <li><Link href="/research-gaps" className="hover:text-forest-600 transition">Candidate Research Gaps</Link></li>
              <li><Link href="/timeline" className="hover:text-forest-600 transition">Historical Timeline</Link></li>
              <li><Link href="/knowledge-graph" className="hover:text-forest-600 transition">Interactive Knowledge Graph</Link></li>
            </ul>
          </div>

          {/* Governance & Methodology */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Methodology & Standards
            </h4>
            <ul className="space-y-1.5">
              <li><Link href="/methodology" className="hover:text-forest-600 transition">Transparency & Methodology</Link></li>
              <li><Link href="/sources" className="hover:text-forest-600 transition">Discovered Sources & Authority Tiers</Link></li>
              <li><Link href="/glossary" className="hover:text-forest-600 transition">Scientific Glossary</Link></li>
              <li><Link href="/about" className="hover:text-forest-600 transition">About the Project</Link></li>
              <li><Link href="/admin" className="hover:text-forest-600 transition">Crawler Administration & Taxonomy</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} PLF Research Intelligence. Open scholarly knowledge base for sustainable animal agriculture.
          </p>
          <div className="flex items-center space-x-4">
            <span>Evidence-Driven</span>
            <span>•</span>
            <span>Non-Invasive Sensing</span>
            <span>•</span>
            <span>Animal Welfare Focused</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
