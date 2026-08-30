import React, { useState } from 'react';
import { SIH_SLIDES_CONTENT } from '../data/nerData';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Radio, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  ExternalLink,
  Target,
  Users,
  Compass
} from 'lucide-react';

interface SihPitchDeckProps {
  onNavigateToFeature: (tab: string) => void;
}

export const SihPitchDeck: React.FC<SihPitchDeckProps> = ({ onNavigateToFeature }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const slide = SIH_SLIDES_CONTENT[currentSlideIndex];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < SIH_SLIDES_CONTENT.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SIH_SLIDES_CONTENT.length - 1));
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">SIH 2026 Submission Deck</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Problem SIH26001</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Presentation className="w-5 h-5 text-amber-400" />
            Interactive Hackathon Presentation & Architecture Deck
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 6-Slide interactive briefing covering problem statement, technical stack, GeoAI pipeline, impact matrix, and ISRO/GSI research base.
          </p>
        </div>

        {/* Slide Carousel Navigator Controls */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 z-10">
          <button
            id="btn-prev-slide"
            onClick={handlePrev}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-all"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-cyan-400 px-3">
            Slide {currentSlideIndex + 1} of {SIH_SLIDES_CONTENT.length}
          </span>
          <button
            id="btn-next-slide"
            onClick={handleNext}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-all"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {SIH_SLIDES_CONTENT.map((s, idx) => (
          <button
            key={s.slideNumber}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentSlideIndex === idx
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            <span className="text-[10px] font-mono font-bold text-amber-400 block">Slide 0{s.slideNumber}</span>
            <span className="text-[11px] font-bold text-white line-clamp-1 mt-0.5">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Interactive Main Slide Stage */}
      <div className="bg-black/40 rounded-3xl border border-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        {/* Slide Title Header */}
        <div className="border-b border-white/5 pb-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              {slide.theme}
            </span>
            <span className="text-xs font-mono text-slate-500">
              SMART INDIA HACKATHON 2026 • SIH26001
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-sm font-medium text-cyan-300">
            {slide.subtitle}
          </p>
        </div>

        {/* Dynamic Slide Content by Slide Index */}
        {currentSlideIndex === 0 && (
          /* Slide 1: Problem Statement & Team Pegasus Profile */
          <div className="space-y-6">
            {/* Motto Banner */}
            <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-black flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  SIH
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-widest font-mono">Team Pegasus Core Motto</span>
                  <span className="text-lg font-bold text-white tracking-wide">
                    SENSE → PREDICT → WARN → RESPOND
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToFeature('map')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400"
                >
                  Explore Live Prototype
                </button>
              </div>
            </div>

            {/* Problem Statement Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-400" />
                  Problem Statement: SIH26001
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>AI-Based Early Warning and Landslide Risk Monitoring System in NER:</strong> The North Eastern Region (8 Himalayan states) experiences recurring catastrophic slope failures during monsoons, snapping lifelines (NH-10, NH-29, NH-6, NH-13), severing military supply routes, causing devastating loss of life and isolating entire states.
                </p>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Project Pegasus Innovation
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Pegasus transforms static geological maps into a dynamic 0-100 real-time risk score combining IoT telemetry (pore pressure, tilt, rainfall), spaceborne Copernicus Sentinel-1 InSAR ground deformation, and explainable XGBoost+LSTM models with offline-first mesh buffers.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentSlideIndex === 1 && (
          /* Slide 2: Today vs Pegasus Approach */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Today */}
              <div className="p-5 bg-black/40 rounded-2xl border border-rose-500/20 space-y-3">
                <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest">TODAY (Current State)</span>
                <h3 className="text-base font-bold text-white">Static Susceptibility Maps + Manual Checks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Historical static maps lack real-time rainfall and soil dynamics. Authorities only respond after catastrophic failure blocks the highway.
                </p>
              </div>

              {/* Pegasus Approach */}
              <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 space-y-3 shadow-xl">
                <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest">OUR APPROACH (Pegasus)</span>
                <h3 className="text-base font-bold text-white">Dynamic 0-100 Risk Score from Multi-Source AI</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time feature fusion combining ground IoT nodes (ESP32 LoRa), Sentinel-1 InSAR satellite deformation, and Doppler weather feeds.
                </p>
              </div>

              {/* Output */}
              <div className="p-5 bg-black/40 rounded-2xl border border-emerald-500/20 space-y-3">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">OUTPUT</span>
                <h3 className="text-base font-bold text-white">4-Tier Actionable Alerts for DDMA & Citizens</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated SOP dispatch, highway barrier closures, and multilingual warning broadcasts (Khasi, Mizo, Assamese, Bengali, Hindi, English).
                </p>
              </div>
            </div>

            {/* Why It Stands Out Banner */}
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-xs text-slate-200 flex items-center justify-between flex-wrap gap-3">
              <span className="font-semibold text-cyan-300">
                ⭐ WHY IT STANDS OUT: Hybrid AI + IoT + Earth Observation • Offline-first LoRa mesh • Explainable SHAP score • Built specifically for remote NER terrain
              </span>
              <button
                onClick={() => onNavigateToFeature('ai-engine')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                Test AI Engine
              </button>
            </div>
          </div>
        )}

        {currentSlideIndex === 2 && (
          /* Slide 3: Technical Architecture & Pipeline */
          <div className="space-y-5">
            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-xs space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                End-to-End Technology Pipeline
              </h3>
              
              {/* Visual Pipeline Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block">1. SENSE</span>
                  <span className="text-xs font-bold text-white mt-1 block">Live IoT & Satellite</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pore Pressure, Tilt, Rain, InSAR</span>
                </div>
                <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-purple-400 font-bold block">2. PREDICT</span>
                  <span className="text-xs font-bold text-white mt-1 block">XGBoost + LSTM Engine</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Failure Probability & SHAP</span>
                </div>
                <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">3. WARN</span>
                  <span className="text-xs font-bold text-white mt-1 block">4-Tier Alert Layer</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Green / Yellow / Orange / Red</span>
                </div>
                <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-rose-400 font-bold block">4. RESPOND</span>
                  <span className="text-xs font-bold text-white mt-1 block">Automated Dispatch</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">BRO, SDRF, Sirens & SMS</span>
                </div>
              </div>
            </div>

            {/* Stack Details Table */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">Frontend</span>
                <span className="font-bold text-cyan-300">React + TS</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">Backend</span>
                <span className="font-bold text-purple-300">Express + Python</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">AI / ML</span>
                <span className="font-bold text-amber-300">XGBoost + LSTM</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">GeoAI</span>
                <span className="font-bold text-emerald-300">GIS + DEM + InSAR</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">IoT Hardware</span>
                <span className="font-bold text-blue-300">ESP32 + LoRa</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <span className="text-slate-500 text-[10px] block">Copilot</span>
                <span className="font-bold text-rose-300">Gemini 3.7 Flash</span>
              </div>
            </div>
          </div>
        )}

        {currentSlideIndex === 3 && (
          /* Slide 4: Feasibility, Viability & Roadmap */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-emerald-400 block text-sm">FEASIBLE NOW</span>
                <ul className="space-y-2 text-slate-300">
                  <li>• Open geospatial data (ISRO/NRSC Bhuvan, Sentinel-1)</li>
                  <li>• Low-cost ESP32 LoRa sensor nodes (&lt; ₹6,500/unit)</li>
                  <li>• Python-based ML stack & cloud/edge deployment</li>
                </ul>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-rose-400 block text-sm">KEY RISKS</span>
                <ul className="space-y-2 text-slate-300">
                  <li>• False alarms / missed events</li>
                  <li>• Sensor failure or drift in damp soils</li>
                  <li>• Weak 4G connectivity in remote hills</li>
                </ul>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-cyan-400 block text-sm">MITIGATION</span>
                <ul className="space-y-2 text-slate-300">
                  <li>• Calibrated thresholds + ensemble ML</li>
                  <li>• Self-health diagnostics & cross-node redundancy</li>
                  <li>• Offline Flash buffer + LoRa/4G fallback</li>
                </ul>
              </div>
            </div>

            {/* Roadmap Steps */}
            <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-3">PILOT → SCALE ROADMAP</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                  <span className="text-cyan-400 font-bold block">Phase 1</span>
                  <span className="text-white font-medium">Select 2 high-risk corridors (NH-10 & NH-6)</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                  <span className="text-cyan-400 font-bold block">Phase 2</span>
                  <span className="text-white font-medium">Deploy 20 sensor nodes</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                  <span className="text-cyan-400 font-bold block">Phase 3</span>
                  <span className="text-white font-medium">Calibrate model with real events</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5">
                  <span className="text-cyan-400 font-bold block">Phase 4</span>
                  <span className="text-white font-medium">Expand district-wise across all 8 NER states</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSlideIndex === 4 && (
          /* Slide 5: Impact & Benefits */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-amber-400 text-sm block">COMMUNITIES</span>
                <p className="text-slate-300 leading-relaxed">
                  Earlier evacuation warnings (2-6 hours lead time), safer transport access, and zero language barrier with regional alerts.
                </p>
              </div>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-cyan-400 text-sm block">AUTHORITIES (DDMA/SDRF)</span>
                <p className="text-slate-300 leading-relaxed">
                  Common Operating Picture for District Magistrates, proactive rescue staging, and clear accountability dispatches.
                </p>
              </div>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-emerald-400 text-sm block">INFRASTRUCTURE (BRO)</span>
                <p className="text-slate-300 leading-relaxed">
                  Preventive slope maintenance, rapid debris clearance, and reducing highway closure durations from days to hours.
                </p>
              </div>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
                <span className="font-bold text-purple-400 text-sm block">ENVIRONMENT & DATA</span>
                <p className="text-slate-300 leading-relaxed">
                  Monitors unstable terrain continuously, creating India's first self-improving regional landslide intelligence dataset.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentSlideIndex === 5 && (
          /* Slide 6: Research & References */
          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">1. ISRO / NRSC — Landslide Atlas of India (2023)</span>
                <p className="text-slate-400 mt-0.5">~80,000 mapped landslides; inventory, susceptibility and exposure context for all 8 NER states.</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">ISRO NRSC</span>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">2. GSI — National Landslide Forecasting Centre (Bhusanket)</span>
                <p className="text-slate-400 mt-0.5">Experimental early-warning approach, regional threshold modeling, and geotechnical instrumentation.</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">GSI Bhusanket</span>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">3. ISRO / NE-SAC — North Eastern Space Applications Centre</span>
                <p className="text-slate-400 mt-0.5">NER-focused space technology, GIS, remote sensing, and state disaster-management support.</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">ISRO NESAC</span>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">4. ESA / Copernicus Sentinel-1</span>
                <p className="text-slate-400 mt-0.5">InSAR wide-area line-of-sight ground-deformation velocity monitoring for mountain slope failure.</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Copernicus</span>
            </div>
          </div>
        )}

        {/* Slide Footnote Bullet Highlights */}
        <div className="pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <span>Smart India Hackathon 2026 Submission Deck • Problem SIH26001</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              ← Previous Slide
            </button>
            <span>|</span>
            <button
              onClick={handleNext}
              className="text-cyan-400 hover:text-cyan-300 underline font-bold cursor-pointer"
            >
              Next Slide →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
