import React, { useState } from 'react';
import { 
  SlopeRegion, 
  AIRiskEngineOutput, 
  InSarDeformationData, 
  SensorNode, 
  AlertSeverity 
} from '../types';
import { 
  Layers, 
  Radio, 
  Satellite, 
  CloudRain, 
  Mountain, 
  AlertTriangle, 
  Compass, 
  ShieldAlert, 
  ArrowUpRight,
  Navigation,
  Eye,
  Activity,
  Sparkles
} from 'lucide-react';

interface MapExplorerProps {
  slopes: SlopeRegion[];
  selectedSlopeId: string;
  onSelectSlope: (slopeId: string) => void;
  aiRisks: Record<string, AIRiskEngineOutput>;
  insarData: Record<string, InSarDeformationData>;
  sensors: SensorNode[];
  onOpenDeepAudit: (slopeId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  slopes,
  selectedSlopeId,
  onSelectSlope,
  aiRisks,
  insarData,
  sensors,
  onOpenDeepAudit,
  onNavigateToTab,
}) => {
  const [activeLayer, setActiveLayer] = useState<'risk' | 'insar' | 'rainfall' | 'slope' | 'sensors'>('risk');
  const [show3DCrossSection, setShow3DCrossSection] = useState<boolean>(false);
  const [filterState, setFilterState] = useState<string>('ALL');

  const selectedSlope = slopes.find((s) => s.id === selectedSlopeId) || slopes[0];
  const currentRisk = aiRisks[selectedSlope.id] || {
    riskScore: 50,
    alertLevel: 'YELLOW' as AlertSeverity,
    probabilityOfFailure: 0.5,
    modelConfidencePct: 85,
    dominantTrigger: 'Pore Pressure Saturation',
    explainabilitySummary: 'Analysis in progress.',
    shapAttributions: [],
  };
  const currentInsar = insarData[selectedSlope.id];
  const slopeSensors = sensors.filter((s) => s.slopeId === selectedSlope.id);

  // Map projection bounding box for North Eastern Region
  const minLat = 22.5;
  const maxLat = 28.8;
  const minLng = 88.0;
  const maxLng = 96.5;

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getAlertColor = (level: AlertSeverity) => {
    switch (level) {
      case 'RED':
        return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500', hex: '#f43f5e', ring: 'ring-rose-500/40', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' };
      case 'ORANGE':
        return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500', hex: '#f59e0b', ring: 'ring-amber-500/40', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' };
      case 'YELLOW':
        return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500', hex: '#eab308', ring: 'ring-yellow-500/40', glow: 'shadow-[0_0_12px_rgba(234,179,8,0.2)]' };
      default:
        return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', hex: '#10b981', ring: 'ring-emerald-500/40', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]' };
    }
  };

  const filteredSlopes = filterState === 'ALL' 
    ? slopes 
    : slopes.filter(s => s.state.toLowerCase() === filterState.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Top Controls & State Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Geospatial Intelligence</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Live Stream</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-cyan-400" />
            North Eastern Region Geospatial Risk Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-source spatial overlay: ISRO/NRSC Susceptibility + Sentinel-1 InSAR + Live IoT Sensors + Hybrid XGBoost/LSTM Predictions
          </p>
        </div>

        {/* Layer Switches */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full z-10">
          <button
            id="layer-risk"
            onClick={() => setActiveLayer('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
              activeLayer === 'risk' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            Dynamic Risk (0-100)
          </button>
          <button
            id="layer-insar"
            onClick={() => setActiveLayer('insar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
              activeLayer === 'insar' 
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-purple-400" />
            InSAR Velocity (mm/yr)
          </button>
          <button
            id="layer-rainfall"
            onClick={() => setActiveLayer('rainfall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
              activeLayer === 'rainfall' 
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            Rainfall Isohyets
          </button>
          <button
            id="layer-slope"
            onClick={() => setActiveLayer('slope')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
              activeLayer === 'slope' 
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            DEM Slope Angles
          </button>
          <button
            id="layer-sensors"
            onClick={() => setActiveLayer('sensors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${
              activeLayer === 'sensors' 
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            IoT Mesh Pins
          </button>
        </div>
      </div>

      {/* Main Grid: GIS Map Canvas & Slope Geotechnical Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Map Stage (8 Cols) */}
        <div className="lg:col-span-8 bg-black/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl relative flex flex-col shadow-2xl">
          {/* Map Header Toolbar */}
          <div className="p-3.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              <span className="font-semibold text-white">NER Himalayan Corridor Matrix</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">WGS-84 Datum</span>
            </div>

            {/* Filter by State dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hidden sm:inline">Filter:</span>
              <select
                id="select-state-filter"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="bg-black/60 text-slate-200 text-xs px-3 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All 8 NER States</option>
                <option value="Sikkim">Sikkim (NH-10)</option>
                <option value="Meghalaya">Meghalaya (NH-6)</option>
                <option value="Nagaland">Nagaland (NH-29)</option>
                <option value="Assam">Assam (Dima Hasao)</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh (NH-13)</option>
                <option value="Mizoram">Mizoram (Aizawl)</option>
                <option value="Manipur">Manipur (NH-2)</option>
                <option value="Tripura">Tripura (NH-8)</option>
              </select>

              <button
                id="btn-toggle-3d-cross-section"
                onClick={() => setShow3DCrossSection(!show3DCrossSection)}
                className="px-3 py-1 rounded-lg bg-white/5 text-cyan-300 border border-white/10 hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                {show3DCrossSection ? 'Hide 3D Profile' : '3D Slope Profile'}
              </button>
            </div>
          </div>

          {/* Interactive Visual Map Area */}
          <div className="relative w-full h-[520px] bg-[#050608]/90 overflow-hidden flex items-center justify-center p-4">
            {/* Background Topological Terrain SVG Graphics */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* Elevation Contour Pattern */}
                <pattern id="contourPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 20 Q 20 5 40 20 T 80 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  <path d="M 0 35 Q 20 20 40 35 T 80 35" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>

                {/* Heatmap Radial Gradients */}
                <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatInSAR" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatRainfall" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#contourPattern)" />

              {/* Generalized North Eastern Mountain Corridors & Himalayan Ridge Lines */}
              <g stroke="#334155" strokeWidth="1" fill="none" strokeDasharray="3 3">
                <path d="M 80 120 C 180 90, 320 80, 520 60 C 650 45, 740 70, 780 110" stroke="#475569" strokeWidth="1.5" />
                <path d="M 120 220 C 220 200, 380 190, 500 160 C 620 130, 710 140, 750 150" stroke="#0284c7" strokeWidth="2.5" opacity="0.4" strokeDasharray="none" />
                <path d="M 320 380 C 400 360, 480 340, 560 380" stroke="#0284c7" strokeWidth="1.5" opacity="0.3" strokeDasharray="none" />
                <path d="M 520 200 C 580 250, 620 320, 640 420" stroke="#64748b" strokeWidth="1.2" />
                <ellipse cx="360" cy="270" rx="90" ry="45" stroke="#475569" strokeWidth="1.2" />
              </g>

              {/* Highway Corridor Lines */}
              <g strokeWidth="2" strokeLinecap="round" opacity="0.7">
                <path d="M 90 240 L 110 200 L 130 160 L 145 130" stroke="#38bdf8" strokeDasharray="4 2" />
                <text x="148" y="125" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">NH-10</text>

                <path d="M 340 250 L 370 270 L 410 310 L 445 340" stroke="#38bdf8" strokeDasharray="4 2" />
                <text x="415" y="305" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">NH-06</text>

                <path d="M 520 220 L 545 260 L 560 300" stroke="#38bdf8" strokeDasharray="4 2" />
                <text x="565" y="295" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">NH-29</text>

                <path d="M 280 180 L 290 140 L 270 100" stroke="#38bdf8" strokeDasharray="4 2" />
                <text x="275" y="95" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">NH-13</text>
              </g>

              {/* Active Heatmap Overlay circles based on selected layer */}
              {slopes.map((slope) => {
                const pos = projectToMap(slope.coordinates.lat, slope.coordinates.lng);
                const svgX = (pos.x / 100) * 800;
                const svgY = (pos.y / 100) * 500;
                const risk = aiRisks[slope.id];
                const insar = insarData[slope.id];

                if (activeLayer === 'risk') {
                  const gradient = risk?.alertLevel === 'RED' ? 'url(#heatRed)' : risk?.alertLevel === 'ORANGE' ? 'url(#heatOrange)' : null;
                  if (!gradient) return null;
                  return (
                    <circle
                      key={`heat-${slope.id}`}
                      cx={svgX}
                      cy={svgY}
                      r={risk?.alertLevel === 'RED' ? 70 : 50}
                      fill={gradient}
                      className="animate-pulse"
                    />
                  );
                }

                if (activeLayer === 'insar') {
                  return (
                    <circle
                      key={`insar-glow-${slope.id}`}
                      cx={svgX}
                      cy={svgY}
                      r={Math.min(65, Math.abs(insar?.meanVelocityMmPerYear || 20))}
                      fill="url(#heatInSAR)"
                    />
                  );
                }

                if (activeLayer === 'rainfall') {
                  return (
                    <circle
                      key={`rain-glow-${slope.id}`}
                      cx={svgX}
                      cy={svgY}
                      r={slope.id === 'slope-mg-02' ? 80 : 50}
                      fill="url(#heatRainfall)"
                    />
                  );
                }

                return null;
              })}
            </svg>

            {/* Interactive Slope Markers Layer */}
            {filteredSlopes.map((slope) => {
              const pos = projectToMap(slope.coordinates.lat, slope.coordinates.lng);
              const isSelected = slope.id === selectedSlope.id;
              const risk = aiRisks[slope.id] || {
                alertLevel: 'GREEN' as AlertSeverity,
                riskScore: 30,
                probabilityOfFailure: 0.2,
              };
              const colors = getAlertColor(risk.alertLevel);
              const insar = insarData[slope.id];

              return (
                <div
                  key={slope.id}
                  id={`marker-${slope.id}`}
                  onClick={() => onSelectSlope(slope.id)}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 group`}
                >
                  {/* Ping Animation for RED/ORANGE */}
                  {(risk.alertLevel === 'RED' || risk.alertLevel === 'ORANGE') && (
                    <span
                      className={`absolute inset-0 rounded-full ${colors.bg} opacity-60 animate-ping`}
                      style={{ animationDuration: risk.alertLevel === 'RED' ? '1.2s' : '2.2s' }}
                    ></span>
                  )}

                  {/* Marker Node Badge */}
                  <div
                    className={`relative px-2.5 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl transition-transform ${
                      isSelected
                        ? `scale-110 bg-[#050608] border-2 ${colors.border} ring-4 ${colors.ring} ${colors.glow}`
                        : 'bg-black/80 backdrop-blur-md border border-white/15 hover:scale-105 hover:border-white/30'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.bg} shadow-[0_0_8px_${colors.hex}]`}></span>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-bold text-white whitespace-nowrap leading-tight">
                        {slope.name.split(' ')[0]} {slope.name.split(' ')[1]}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {activeLayer === 'insar' && insar ? `${insar.meanVelocityMmPerYear} mm/yr` : `${risk.riskScore}/100 Risk`}
                      </span>
                    </div>
                  </div>

                  {/* Hover Tooltip Preview */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-black/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl text-xs text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    <p className="font-bold text-white text-xs">{slope.name}</p>
                    <p className="text-[10px] text-slate-400">{slope.state} • {slope.corridor}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                      <div>Failure Prob: <span className={colors.text}>{(risk.probabilityOfFailure * 100).toFixed(0)}%</span></div>
                      <div>Sensors: <span className="text-cyan-400">{slope.activeSensorsCount} Active</span></div>
                      <div>Elevation: <span className="text-slate-300">{slope.elevationM}m</span></div>
                      <div>Slope: <span className="text-slate-300">{slope.slopeAngleDeg}°</span></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-[11px] text-slate-300 space-y-1.5 z-10 shadow-xl">
              <div className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Active Layer: <span className="text-cyan-300 capitalize">{activeLayer}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] pt-1.5 border-t border-white/10">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span> Red (&gt;85%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"></span> Orange (70-84%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Yellow (50-69%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Green (&lt;50%)</span>
              </div>
            </div>

            {/* Quick State Navigation Pills */}
            <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 max-w-xs justify-end z-10">
              {slopes.slice(0, 4).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSlope(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                    s.id === selectedSlope.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'bg-black/60 text-slate-400 border-white/5 hover:text-slate-200 hover:border-white/15'
                  }`}
                >
                  {s.state} ({s.corridor.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* 3D Elevation Cross-Section Inspector (Collapsible Sub-Panel) */}
          {show3DCrossSection && (
            <div className="p-5 bg-black/60 border-t border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <Mountain className="w-4 h-4" />
                  3D Geotechnical Cross-Section: {selectedSlope.name} ({selectedSlope.slopeAngleDeg}° Cut)
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">DEM & Shear Slip Plane</span>
              </div>

              {/* Visual 2D/3D Cross Section Diagram */}
              <div className="relative h-44 bg-[#050608]/90 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
                <svg className="w-full h-full" viewBox="0 0 500 160">
                  {/* Bedrock Stratum */}
                  <polygon points="0,160 500,160 500,110 320,80 180,30 0,30" fill="#111827" />
                  
                  {/* Sheared Weathered Colluvium / Phyllite Layer */}
                  <polygon points="0,30 180,30 320,80 500,110 500,80 300,50 160,10 0,10" fill="#1f2937" opacity="0.9" />
                  
                  {/* Slip Failure Shear Arc (Dotted Red Line) */}
                  <path d="M 120 15 Q 260 75 420 120" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x="240" y="65" fill="#f43f5e" fontSize="9" fontWeight="bold">Critical Circular Shear Failure Surface</text>

                  {/* Phreatic Water Table Line (Blue) */}
                  <path d="M 80 40 Q 240 85 460 135" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 2" />
                  <text x="320" y="110" fill="#38bdf8" fontSize="8">Saturated Piezometric Surface (34.6 kPa)</text>

                  {/* Road Highway Embankment Cut */}
                  <polygon points="380,120 440,120 450,150 370,150" fill="#374151" />
                  <text x="385" y="138" fill="#ffffff" fontSize="9" fontWeight="bold">Roadway</text>

                  {/* Retaining Wall & Inclinometer Sensor Pin */}
                  <line x1="380" y1="120" x2="380" y2="90" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="260" cy="40" r="4" fill="#06b6d4" />
                  <text x="270" y="42" fill="#06b6d4" fontSize="8" fontWeight="bold">Sensor PEG-01 (Inclinometer & Pore Sensor)</text>
                </svg>

                {/* Annotation Badges */}
                <div className="absolute bottom-2 left-3 flex items-center gap-3 text-[10px] text-slate-400 bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                  <span>Lithology: <strong className="text-slate-200">{selectedSlope.lithologyType}</strong></span>
                  <span>Cohesion: <strong className="text-slate-200">{selectedSlope.soilCohesionKPa} kPa</strong></span>
                  <span>Friction Angle: <strong className="text-slate-200">{selectedSlope.frictionAngleDeg}°</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Detailed Slope Inspector & Action Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Main Selected Slope Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
                  {selectedSlope.state} • {selectedSlope.district}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug mt-1">
                  {selectedSlope.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-slate-500" />
                  {selectedSlope.corridor}
                </p>
              </div>

              {/* Alert Badge */}
              <div className={`px-3 py-1 rounded-xl text-xs font-bold ${getAlertColor(currentRisk.alertLevel).bg} text-white shadow-lg ${getAlertColor(currentRisk.alertLevel).glow}`}>
                {currentRisk.alertLevel}
              </div>
            </div>

            {/* Risk & Probability Metrics Box */}
            <div className="grid grid-cols-2 gap-3 bg-black/40 p-3.5 rounded-2xl border border-white/5 font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Failure Prob</span>
                <span className={`text-2xl font-bold ${getAlertColor(currentRisk.alertLevel).text}`}>
                  {(currentRisk.probabilityOfFailure * 100).toFixed(1)}%
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">XGBoost + LSTM</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Risk Score</span>
                <span className="text-2xl font-bold text-white">
                  {currentRisk.riskScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Confidence: {currentRisk.modelConfidencePct}%</span>
              </div>
            </div>

            {/* Key Geotechnical Parameters */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Dominant Trigger</span>
                <span className="font-semibold text-rose-300">{currentRisk.dominantTrigger}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">InSAR LOS Subsidence</span>
                <span className="font-mono text-purple-300 font-medium">
                  {currentInsar?.cumulativeLineOfSightDisplacementMm} mm ({currentInsar?.meanVelocityMmPerYear} mm/yr)
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Rainfall (24h / Threshold)</span>
                <span className="font-mono text-blue-300 font-medium">
                  {slopeSensors[0]?.telemetry.rainfall24hMm || 80} mm / {selectedSlope.criticalRainfallThresholdMm24h} mm
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">Slope Cut / Elevation</span>
                <span className="font-mono text-slate-200">
                  {selectedSlope.slopeAngleDeg}° / {selectedSlope.elevationM}m AMSL
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span className="text-slate-400">BRO Unit Responsible</span>
                <span className="font-medium text-slate-300">{selectedSlope.broUnit}</span>
              </div>
            </div>

            {/* AI Synopsis Box */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>AI Early Warning Synopsis</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{currentRisk.explainabilitySummary}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="btn-deep-audit"
                onClick={() => onOpenDeepAudit(selectedSlope.id)}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400 flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Audit
              </button>
              <button
                id="btn-view-sensors"
                onClick={() => onNavigateToTab('iot-mesh')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-xs border border-white/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Sensors ({slopeSensors.length})
              </button>
            </div>
          </div>

          {/* Quick Corridor Emergency Status */}
          <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/5 text-xs space-y-2.5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Emergency Corridor Status
              </span>
              <button
                onClick={() => onNavigateToTab('control-room')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-medium transition-colors"
              >
                Control Room <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Corridor {selectedSlope.corridor} is currently governed by active DDMA protocols with {selectedSlope.activeSensorsCount} telemetry nodes streaming to SDRF control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
