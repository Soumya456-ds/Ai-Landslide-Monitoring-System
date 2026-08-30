import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Activity, 
  Radio, 
  Bell, 
  Users, 
  Presentation, 
  Bot, 
  Satellite, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  AlertTriangle,
  Flame,
  RotateCcw
} from 'lucide-react';
import { AlertSeverity } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  overallAlertLevel?: AlertSeverity;
  highestAlert?: AlertSeverity;
  activeSensorsCount?: number;
  totalSlopesCount?: number;
  onTriggerSimulation?: (scenario: 'cloudburst' | 'earthquake' | 'normal') => void;
  onSimulateScenario?: (scenario: 'cloudburst' | 'earthquake' | 'normal') => void;
  simulationActive?: boolean;
  sirenMuted?: boolean;
  setSirenMuted?: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  overallAlertLevel,
  highestAlert,
  activeSensorsCount = 48,
  totalSlopesCount = 8,
  onTriggerSimulation,
  onSimulateScenario,
  simulationActive = false,
  sirenMuted = true,
  setSirenMuted,
}) => {
  const currentAlert = overallAlertLevel || highestAlert || 'YELLOW';
  const handleScenario = onTriggerSimulation || onSimulateScenario || (() => {});

  const getAlertBadge = () => {
    switch (currentAlert) {
      case 'RED':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping"></div>
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">Imminent Failure (Red)</span>
          </div>
        );
      case 'ORANGE':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">High Vulnerability (Orange)</span>
          </div>
        );
      case 'YELLOW':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
            <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">Active Advisory (Yellow)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Normal Telemetry</span>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'map', label: 'GIS Explorer', icon: MapPin },
    { id: 'ai-engine', label: 'AI Risk Engine', icon: Activity },
    { id: 'iot-mesh', label: 'IoT Mesh', icon: Radio },
    { id: 'control-room', label: 'Warn & Respond', icon: Bell },
    { id: 'citizen-portal', label: 'Citizen Portal', icon: Users },
    { id: 'sih-deck', label: 'SIH Presentation', icon: Presentation },
    { id: 'copilot', label: 'Geotech Co-Pilot', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050608]/80 backdrop-blur-xl border-b border-white/5">
      {/* Top Banner Ticker with Immersive Glass Treatment */}
      <div className="bg-black/40 px-4 sm:px-8 py-1.5 text-xs border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold whitespace-nowrap">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <span className="font-mono text-cyan-400">SIH 2026</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Problem SIH26001</span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeSensorsCount} Active LoRa Nodes</span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
            <Satellite className="w-3.5 h-3.5 text-purple-400" />
            <span>Sentinel-1 InSAR Synced</span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden lg:block"></div>
          <div className="flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>IMD Doppler Connected</span>
          </div>
        </div>

        {/* Quick Simulation Stress-Test Triggers */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hidden xl:inline">
            Stress Test Lab:
          </span>
          <button
            id="btn-sim-cloudburst"
            onClick={() => handleScenario('cloudburst')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${
              simulationActive
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white'
            }`}
            title="Simulate severe monsoon cloudburst in North East corridor"
          >
            <CloudRain className="w-3 h-3 text-rose-400" />
            <span>Cloudburst</span>
          </button>
          <button
            id="btn-sim-earthquake"
            onClick={() => handleScenario('earthquake')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-1.5"
            title="Simulate micro-seismic shaking on regional thrust fault"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Tremor</span>
          </button>
          <button
            id="btn-sim-normal"
            onClick={() => handleScenario('normal')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all duration-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  PEGASUS
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                  NER GEOAI
                </span>
                {getAlertBadge()}
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                AI Landslide Early Warning & Risk Monitoring System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'citizen-portal' && activeTab === 'citizen') || (item.id === 'sih-deck' && activeTab === 'sih-pitch');
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Audio siren toggle & status */}
          <div className="flex items-center gap-2">
            {setSirenMuted && (
              <button
                id="btn-siren-toggle"
                onClick={() => setSirenMuted(!sirenMuted)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-2 ${
                  sirenMuted
                    ? 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                }`}
                title={sirenMuted ? 'Unmute Emergency Audio Siren' : 'Mute Emergency Siren'}
              >
                {sirenMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
                <span className="hidden sm:inline text-xs">{sirenMuted ? 'Siren Off' : 'Siren Active'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="lg:hidden flex items-center gap-1.5 py-2 overflow-x-auto border-t border-white/5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'citizen-portal' && activeTab === 'citizen') || (item.id === 'sih-deck' && activeTab === 'sih-pitch');
            return (
              <button
                key={`m-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
