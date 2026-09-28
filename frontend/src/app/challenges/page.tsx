import React from 'react';
import { 
  AlertTriangle, DollarSign, Wrench, ShieldCheck, Heart, 
  Cpu, Battery, Wifi, Database, CheckCircle2, BookOpen
} from 'lucide-react';

export default function ChallengesPage() {
  const challengeCategories = [
    {
      title: 'Technical & Engineering Challenges',
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/10',
      items: [
        { name: 'Harsh Barn & Rangeland Environments', desc: 'Ammonia fumes, high dust, slurry, moisture, and animal rubbing cause rapid sensor corrosion, lens fouling, and physical tag detachment.' },
        { name: 'Battery Longevity vs Sampling Frequency', desc: 'Balancing high-frequency IMU telemetry (10-50 Hz) or GNSS fixes against finite lithium battery lifespans (3-7 years).' },
        { name: 'Interoperability & Data Silos', desc: 'Lack of open standardization across proprietary vendor protocols prevents unified multi-sensor farm dashboards.' },
        { name: 'Model Generalisation & Illumination Drift', desc: 'Vision algorithms trained on single research barns suffer steep performance drops under variable daylight and mud accumulation.' }
      ]
    },
    {
      title: 'Economic & Financial Feasibility',
      icon: <DollarSign className="w-5 h-5 text-forest-600" />,
      color: 'border-forest-700/30 bg-forest-700/5 dark:bg-forest-800/10',
      items: [
        { name: 'High Upfront Capital Investment', desc: 'Robotic milking stations ($150k+), overhead 3D camera grids, and herd-wide wearables create prohibitive capital hurdles.' },
        { name: 'SaaS Subscription Lock-in', desc: 'Recurring software license fees per cow/month erode farm operational profit margins during low milk/meat price cycles.' },
        { name: 'Uncertain Return on Investment (ROI)', desc: 'Scarcity of peer-reviewed longitudinal balance-sheet studies proving clear payback periods across diverse herd sizes.' },
        { name: 'False Alarm Economic Waste', desc: 'False positive mastitis alerts cause unnecessary labor inspection and discard of salable milk.' }
      ]
    },
    {
      title: 'Operational & Farmer Usability',
      icon: <Wrench className="w-5 h-5 text-sand-600" />,
      color: 'border-sand-400/35 bg-amber-50/20 dark:bg-amber-950/10',
      items: [
        { name: 'Information Overload & Alert Fatigue', desc: 'Farmers receiving dozens of disparate notifications daily frequently turn off notification alarms, defeating early-warning benefits.' },
        { name: 'Digital Literacy & Rural Training', desc: 'Complex software interfaces without intuitive mobile ergonomics create steep learning curves for aging farming demographics.' },
        { name: 'Workflow Integration Friction', desc: 'Sensor alerts that fail to integrate automatically with sorting gates or veterinary drafting lists require redundant manual re-entry.' }
      ]
    },
    {
      title: 'Ethical, Welfare & Legal Dimensions',
      icon: <Heart className="w-5 h-5 text-burgundy-700" />,
      color: 'border-burgundy-700/25 bg-rose-50/20 dark:bg-rose-950/10',
      items: [
        { name: 'Erosion of Stockmanship & Human-Animal Bond', desc: 'Over-reliance on automated screens risks diminishing the traditional observational intuition and empathetic contact of stockpersons.' },
        { name: 'Data Ownership & Commercial Lock-in', desc: 'Questions regarding whether farmers, equipment vendors, or cloud platforms own the continuous biological and yield data generated.' },
        { name: 'Welfare Concerns with Virtual Fencing', desc: 'Ensuring auditory warnings provide ethical operant learning without causing chronic stress or fear-conditioned boundary anxiety.' }
      ]
    },
    {
      title: 'Scientific & Methodological Gaps',
      icon: <Database className="w-5 h-5 text-burgundy-700" />,
      color: 'border-burgundy-700/25 bg-indigo-50/20 dark:bg-indigo-950/10',
      items: [
        { name: 'Single-Herd Evaluation Bias', desc: '75%+ of published machine learning models are evaluated on single research herds without external multi-farm cross-validation.' },
        { name: 'Lack of Open Benchmark Datasets', desc: 'Few publicly available annotated agricultural computer vision datasets exist compared to mainstream computer science (e.g. ImageNet).' },
        { name: 'Scarcity of Multimodal Sensor Fusion', desc: 'Most studies examine sensors in isolation rather than fusing concurrent video, acoustic, and kinetic signals.' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy-700/10 border border-rose-500/20 text-burgundy-700 dark:text-burgundy-300 text-xs font-semibold mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Multidisciplinary Constraints</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          Challenges in Precision Livestock Farming
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive synthesis of technical, economic, operational, ethical, and scientific barriers preventing widespread, equitable, and robust PLF adoption.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {challengeCategories.map((cat, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl border ${cat.color} backdrop-blur-sm space-y-6 shadow-sm`}
          >
            <div className="flex items-center gap-3 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                {cat.icon}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {cat.title}
              </h2>
            </div>

            <div className="space-y-4">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
