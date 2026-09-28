import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, TrendingUp, Cpu, Globe, Heart, ShieldCheck, ArrowRight, BookOpen
} from 'lucide-react';

export default function OpportunitiesPage() {
  const opportunities = [
    {
      title: 'Multimodal Foundation Models & Edge Vision Transformers',
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
      desc: 'Deploying lightweight Vision Transformers (ViTs) directly on low-power barn edge boxes to fuse 2D RGB video, 3D depth, and audio streams into unified behavioural embeddings.',
      impact: 'Eliminates cloud bandwidth costs, ensures zero-latency real-time aggression/lameness alerting, and preserves farmer data privacy on-premise.'
    },
    {
      title: 'Regenerative Virtual Fencing & Landscape-Scale Grazing',
      icon: <Globe className="w-5 h-5 text-forest-600" />,
      desc: 'Combining satellite direct-to-collar IoT constellations with autonomous GNSS virtual fencing to enable precision strip grazing and riparian conservation zone exclusion.',
      impact: 'Boosts pasture biomass utilization by 15-25% without physical fencing labor while actively regenerating soil carbon stocks.'
    },
    {
      title: 'Enteric Methane Quantification & Genomic Carbon Auditing',
      icon: <TrendingUp className="w-5 h-5 text-forest-600" />,
      desc: 'Integrating continuous NDIR eructation breath sniffers at automated milking and feeding stations to quantify individual cow methane emissions.',
      impact: 'Enables verified carbon credit certification and accelerated genomic selection for naturally low-emission ruminant bloodlines.'
    },
    {
      title: 'Non-Invasive Biometric Re-Identification',
      icon: <Sparkles className="w-5 h-5 text-burgundy-700" />,
      desc: 'Using muzzle dermatoglyphics, iris patterns, and dorsal coat pigmentation with contrastive self-supervised neural networks to replace invasive plastic and electronic ear tags.',
      impact: 'Zero animal pain, zero ear tearing, zero tag replacement costs, and tamper-proof disease traceability.'
    },
    {
      title: 'Smallholder Inclusive PLF & Micro-Insurance Integration',
      icon: <Heart className="w-5 h-5 text-sand-600" />,
      desc: 'Deploying low-cost solar-harvested LoRaWAN ear tags bundled with automated drought index insurance and livestock theft tracking in developing pastoral regions.',
      impact: 'De-risks smallholder livestock banking, improves rural financial inclusion, and enhances climate resilience across sub-Saharan Africa.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research Frontiers & Future Horizons</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Research & Implementation Opportunities
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          High-impact scientific directions, emerging technological integrations, and commercial deployment opportunities poised to transform animal agriculture over the next decade.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl academic-card space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {opp.icon}
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {opp.title}
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {opp.desc}
              </p>
              <div className="p-3.5 rounded-xl bg-sand-200/30 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-800/40 text-xs">
                <strong className="text-forest-800 dark:text-sand-300 font-semibold block mb-0.5">
                  Scientific & Environmental Impact:
                </strong>
                <span className="text-slate-700 dark:text-slate-300">{opp.impact}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Link
                href="/literature"
                className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400 flex items-center gap-1"
              >
                <span>Search Related Literature</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
