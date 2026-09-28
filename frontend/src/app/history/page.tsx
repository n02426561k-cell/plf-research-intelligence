import React from 'react';
import Link from 'next/link';
import { 
  Clock, ArrowRight, BookOpen, Compass, Layers, CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function HistoryPage() {
  const evolutionStages = [
    {
      era: 'Stage 1: Traditional Observation',
      period: 'Pre-1970s',
      focus: 'Human Herdsman Intuition',
      desc: 'Animal management relied entirely on episodic visual and tactile observation by skilled stockpersons during feeding and milking chores. Diseases were identified primarily at late clinical stages.'
    },
    {
      era: 'Stage 2: Mechanical Measurement',
      period: '1970s',
      focus: 'Mechanical Milk Meters & Weigh Scales',
      desc: 'Introduction of mechanical flow meters (Tru-Test, Waikato) and chute scale dial indicators, establishing the first standardized physical quantification of yield and body mass.'
    },
    {
      era: 'Stage 3: Electronic Identification (RFID)',
      period: 'Late 1970s - 1980s',
      focus: 'LF Transponders & Ear Tags',
      desc: 'Los Alamos National Laboratory and USDA pioneers implanted passive RFID microchips, creating ISO 11784/11785 standards that enabled individual animal recognition at automated feeding doors.'
    },
    {
      era: 'Stage 4: Automated Sensing & Robotic Milking',
      period: '1990s - Early 2000s',
      focus: 'AMS & In-line Conductivity',
      desc: 'Lely and Prolion introduced voluntary robotic milking stalls with laser-guided arm attachment and continuous quarter-level electrical conductivity meters for subclinical mastitis.'
    },
    {
      era: 'Stage 5: Wearable IoT & Tri-Axial Accelerometry',
      period: '2010 - 2015',
      focus: 'Rumination & Heat Collars',
      desc: 'Miniaturized MEMS accelerometers in neck collars and ear tags achieved mass commercial adoption (Nedap, CowManager, SCR), transforming rumination time into an essential biomarker.'
    },
    {
      era: 'Stage 6: Computer Vision & Deep Learning',
      period: '2018 - 2022',
      focus: 'Non-Contact 2D/3D CNNs',
      desc: 'Transition from wearables to overhead optical 2D/3D depth cameras and deep convolutional neural networks (YOLO, ResNet) for non-invasive lameness scoring, BCS estimation, and piglet aggression tracking.'
    },
    {
      era: 'Stage 7: Autonomous Pasture Robotics & Multimodal AI',
      period: '2023 - Present',
      focus: 'Virtual Fencing & Vision-Transformer Fusion',
      desc: 'Scaling of solar-powered GPS virtual fencing collars (Halter, eShepherd) combined with multimodal transformer neural networks fusing audio, vision, and kinetic streams for autonomous regenerative grazing.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Epochs of Agricultural Automation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          History & Evolution of PLF
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The scientific journey from manual stockmanship observation to mechanical instrumentation, digital micro-sensing, deep neural networks, and autonomous robotics.
        </p>
      </div>

      {/* Epochs List */}
      <div className="space-y-6">
        {evolutionStages.map((stage, idx) => (
          <div key={idx} className="p-6 rounded-2xl academic-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-forest-600 dark:text-forest-400 block uppercase">
                  {stage.period}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {stage.era}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                Focus: {stage.focus}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {stage.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA to Interactive Timeline */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-700/8 to-burgundy-700/8 border border-forest-700/30 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Want to explore specific dated milestones with academic DOIs?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            View our interactive database timeline with full traceable citations.
          </p>
        </div>
        <Link
          href="/timeline"
          className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold transition shrink-0 ml-4 flex items-center gap-1.5"
        >
          <span>Explore Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
