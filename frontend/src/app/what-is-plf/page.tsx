'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Compass, ArrowRight, Layers, Activity, Cpu, Network, Sparkles, 
  CheckCircle2, ShieldCheck, BookOpen, AlertCircle, Database, Repeat
} from 'lucide-react';
import { useSourceDrawer } from '@/context/SourceDrawerContext';

export default function WhatIsPLFPage() {
  const { openDrawerWithDocId } = useSourceDrawer();

  const architectureSteps = [
    { step: '1. SENTIENT ANIMAL', desc: 'Biological living organism emitting continuous physiological and behavioural bio-responses.', icon: '🐄' },
    { step: '2. SENSORS / CAMERAS', desc: 'Optical 3D vision, tri-axial wearables, acoustic mics, thermal IRT, or ruminal sensors.', icon: '📷' },
    { step: '3. DATA COLLECTION', desc: 'Raw high-frequency telemetry (10-50 Hz IMU acceleration, 30 FPS video, audio streams).', icon: '📡' },
    { step: '4. DATA TRANSMISSION', desc: 'Sub-GHz RF, LoRaWAN, Bluetooth Low Energy (BLE), Wi-Fi 6, or Cellular NB-IoT.', icon: '📶' },
    { step: '5. DATA STORAGE', desc: 'On-farm edge buffers and cloud database repositories with time-series indexing.', icon: '💾' },
    { step: '6. ANALYTICS / AI', desc: 'Computer vision, deep CNNs, anomaly detection, and spatio-temporal transformers.', icon: '🧠' },
    { step: '7. INTERPRETATION', desc: 'Converting mathematical anomalies into biological states (e.g. subclinical mastitis, estrus).', icon: '🔍' },
    { step: '8. DECISION SUPPORT', desc: 'Prioritised, actionable alerts delivered to farm management software or mobile dashboard.', icon: '📋' },
    { step: '9. FARM ACTION', desc: 'Targeted veterinary treatment, automated drafting gate separation, or ration rebalancing.', icon: '🚜' },
    { step: '10. OUTCOME / FEEDBACK', desc: 'Improved health, accelerated recovery, pain reduction, and closed-loop algorithm retraining.', icon: '🔄' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/10 border border-forest-700/20 text-forest-700 dark:text-sand-300 text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Epistemological & Scientific Foundations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100">
          What is Precision Livestock Farming?
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          An evidence-grounded analysis of PLF definitions, closed-loop bio-response architecture, and differentiation from general agricultural digitalization.
        </p>
      </div>

      {/* 1. ACADEMIC DEFINITION */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-forest-600" />
          Formal Academic Definition
        </h2>
        <div className="p-6 rounded-2xl bg-sand-100/60 dark:bg-forest-800/20 border border-sand-300 dark:border-forest-800/40 text-slate-800 dark:text-slate-200 leading-relaxed text-sm space-y-3">
          <p className="text-base font-serif italic text-forest-800 dark:text-sand-200">
            "Precision Livestock Farming (PLF) is the continuous automated real-time monitoring and management of individual animals or animal groups to improve animal welfare, health, productivity, and environmental sustainability."
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-sand-300 dark:border-forest-800/60 text-xs text-forest-800 dark:text-forest-400">
            <span>Primary Reference: Wathes et al. (2008); Berckmans (2014)</span>
            <button
              onClick={() => openDrawerWithDocId(1)}
              className="font-semibold underline hover:text-forest-800 dark:hover:text-sand-200"
            >
              View Canonical Source
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE 10-STAGE CLOSED-LOOP ARCHITECTURE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-blue-600" />
            The 10-Stage PLF Closed-Loop Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          PLF functions not as passive logging, but as a closed cybernetic feedback loop connecting the living animal to intelligent decision support and farm intervention.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {architectureSteps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl academic-card flex items-start space-x-3">
              <span className="text-2xl shrink-0">{step.icon}</span>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  {step.step}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW PLF DIFFERS FROM CONVENTIONAL LIVESTOCK FARMING */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          How PLF Differs from Conventional Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
              <tr>
                <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Management Dimension</th>
                <th className="p-3.5 border-b border-slate-200 dark:border-slate-700">Conventional Farming</th>
                <th className="p-3.5 border-b border-slate-200 dark:border-slate-700 text-forest-600 dark:text-forest-400">Precision Livestock Farming (PLF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="p-3.5 font-semibold">Monitoring Frequency</td>
                <td className="p-3.5">Intermittent visual inspection during daily chores (1-2 times daily).</td>
                <td className="p-3.5 font-medium text-forest-700 dark:text-sand-300">Continuous 24/7/365 real-time sensing telemetry.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Management Scale</td>
                <td className="p-3.5">Herd-level averages (e.g. bulk tank somatic cell count).</td>
                <td className="p-3.5 font-medium text-forest-700 dark:text-sand-300">Individualized animal granularity & quarter-level diagnostics.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Disease Detection Window</td>
                <td className="p-3.5">Late-stage clinical signs (severe limp, visibly abnormal milk, fever).</td>
                <td className="p-3.5 font-medium text-forest-700 dark:text-sand-300">Subclinical physiological changes 3–14 days prior to clinical symptoms.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Intervention Strategy</td>
                <td className="p-3.5">Reactive systemic medication (often broad-spectrum antibiotics).</td>
                <td className="p-3.5 font-medium text-forest-700 dark:text-sand-300">Proactive targeted intervention, selective dry cow therapy, early drafting.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">Data Traceability</td>
                <td className="p-3.5">Manual paper logs or episodic batch entry.</td>
                <td className="p-3.5 font-medium text-forest-700 dark:text-sand-300">Immutable automated digital health audit trails.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. RELATIONSHIPS WITH ALLIED DISCIPLINES */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Relationship with Allied Technological Disciplines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-2xl academic-card space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sand-1000"></span>
              PLF vs. Precision Crop Agriculture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              While precision crop agriculture focuses on managing static spatial variability across soil and fields (variable-rate fertilizer, yield monitors), PLF manages the dynamic temporal variability of individual sentient living organisms with active metabolic and behavioral responses.
            </p>
          </div>

          <div className="p-5 rounded-2xl academic-card space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              PLF vs. Smart Farming & Digital Agriculture
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Digital agriculture is the umbrella discipline encompassing enterprise resource planning (ERP), supply chain tracking, and satellite remote sensing. PLF is the specialised sub-discipline operating at the bio-interface of the animal.
            </p>
          </div>

          <div className="p-5 rounded-2xl academic-card space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              PLF & Artificial Intelligence (AI / Deep Learning)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI provides the mathematical inference engine for PLF. Raw high-dimensional sensor data (millions of video pixels or continuous acoustic soundscapes) is transformed into biological classifications through convolutional neural networks, vision transformers, and time-series anomaly detection.
            </p>
          </div>

          <div className="p-5 rounded-2xl academic-card space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              PLF & Internet of Things (Livestock IoT)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Livestock IoT supplies the hardware, low-power microcontrollers, energy harvesting, and telemetry protocols (LoRaWAN, NB-IoT) that transmit sensor payloads from harsh barn or pasture environments to computational endpoints.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
