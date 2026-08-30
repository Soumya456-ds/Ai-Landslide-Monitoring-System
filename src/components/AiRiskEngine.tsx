import React, { useState, useMemo } from 'react';
import { 
  SlopeRegion, 
  AIRiskEngineOutput, 
  InSarDeformationData, 
  SensorNode, 
  AlertSeverity,
  ShapAttribution
} from '../types';
import { 
  Activity, 
  Sliders, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  RefreshCw, 
  BarChart3, 
  Cpu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface AiRiskEngineProps {
  slopes: SlopeRegion[];
  selectedSlopeId: string;
  onSelectSlope: (id: string) => void;
  aiRisks: Record<string, AIRiskEngineOutput>;
  insarData: Record<string, InSarDeformationData>;
  sensors: SensorNode[];
  onTriggerAudit: (slopeId: string) => void;
  isAuditing: boolean;
  auditResult: string | null;
}

export const AiRiskEngine: React.FC<AiRiskEngineProps> = ({
  slopes,
  selectedSlopeId,
  onSelectSlope,
  aiRisks,
  insarData,
  sensors,
  onTriggerAudit,
  isAuditing,
  auditResult,
}) => {
  const selectedSlope = slopes.find((s) => s.id === selectedSlopeId) || slopes[0];
  const currentInsar = insarData[selectedSlope.id];
  const primarySensor = sensors.find((s) => s.slopeId === selectedSlope.id) || sensors[0];

  // Interactive Simulator Sliders State
  const [simRainfall24, setSimRainfall24] = useState<number>(primarySensor?.telemetry.rainfall24hMm || 110);
  const [simPorePressure, setSimPorePressure] = useState<number>(primarySensor?.telemetry.poreWaterPressureKPa || 28);
  const [simTiltRate, setSimTiltRate] = useState<number>(primarySensor?.telemetry.tiltRateDegHr || 0.35);
  const [simInsarDeform, setSimInsarDeform] = useState<number>(Math.abs(currentInsar?.cumulativeLineOfSightDisplacementMm || 60));
  const [simSoilMoisture, setSimSoilMoisture] = useState<number>(primarySensor?.telemetry.soilMoistureVwcPct || 42);

  // Reset simulator back to live telemetry
  const handleResetSimulator = () => {
    if (primarySensor) {
      setSimRainfall24(primarySensor.telemetry.rainfall24hMm);
      setSimPorePressure(primarySensor.telemetry.poreWaterPressureKPa);
      setSimTiltRate(primarySensor.telemetry.tiltRateDegHr);
      setSimSoilMoisture(primarySensor.telemetry.soilMoistureVwcPct);
    }
    if (currentInsar) {
      setSimInsarDeform(Math.abs(currentInsar.cumulativeLineOfSightDisplacementMm));
    }
  };

  // Real-time Hybrid XGBoost + LSTM Physics-Informed ML Simulation Calculation
  const simResults = useMemo(() => {
    const porePressureRatio = Math.min(1.5, simPorePressure / 32);
    const rainRatio = simRainfall24 / selectedSlope.criticalRainfallThresholdMm24h;
    const tiltFactor = Math.min(2.0, simTiltRate / 0.3);
    const insarFactor = Math.min(1.5, simInsarDeform / 75);
    const slopeAngleMultiplier = Math.tan((selectedSlope.slopeAngleDeg * Math.PI) / 180) / Math.tan((40 * Math.PI) / 180);

    const xgbRaw = 0.35 * rainRatio + 0.30 * porePressureRatio + 0.20 * insarFactor + 0.15 * slopeAngleMultiplier;
    const lstmRaw = 0.50 * tiltFactor + 0.30 * (simSoilMoisture / 45) + 0.20 * (simRainfall24 / 120);

    const combinedLogit = (xgbRaw * 0.55 + lstmRaw * 0.45) * 2.2 - 2.0;
    const probability = Math.max(0.04, Math.min(0.98, 1 / (1 + Math.exp(-combinedLogit))));
    const riskScore = Math.round(probability * 100);

    let alertLevel: AlertSeverity = 'GREEN';
    if (riskScore >= 85) alertLevel = 'RED';
    else if (riskScore >= 70) alertLevel = 'ORANGE';
    else if (riskScore >= 45) alertLevel = 'YELLOW';

    let estimatedHours: number | null = null;
    if (probability > 0.85) {
      estimatedHours = Number((1.5 + (1 - probability) * 8).toFixed(1));
    } else if (probability > 0.70) {
      estimatedHours = Number((4.0 + (1 - probability) * 12).toFixed(1));
    }

    const shapData: ShapAttribution[] = [
      {
        featureName: `24h Rainfall (${simRainfall24}mm / ${selectedSlope.criticalRainfallThresholdMm24h}mm)`,
        featureValue: `${simRainfall24} mm`,
        shapWeightPct: Math.round(35 * Math.min(1.4, rainRatio)),
        direction: rainRatio > 0.8 ? 'increases_risk' : 'decreases_risk',
        description: rainRatio > 1 ? 'Precipitation breached trigger threshold' : 'Below critical threshold',
      },
      {
        featureName: `Pore Water Pressure (${simPorePressure} kPa)`,
        featureValue: `${simPorePressure} kPa`,
        shapWeightPct: Math.round(28 * Math.min(1.4, porePressureRatio)),
        direction: porePressureRatio > 0.8 ? 'increases_risk' : 'decreases_risk',
        description: 'Hydrostatic pressure reducing effective normal stress',
      },
      {
        featureName: `Angular Tilt Velocity (${simTiltRate.toFixed(2)} °/hr)`,
        featureValue: `${simTiltRate.toFixed(2)} °/hr`,
        shapWeightPct: Math.round(22 * Math.min(1.5, tiltFactor)),
        direction: tiltFactor > 0.9 ? 'increases_risk' : 'decreases_risk',
        description: tiltFactor > 1 ? 'Accelerating tertiary creep phase' : 'Stable creep rate',
      },
      {
        featureName: `InSAR LOS Subsidence (${simInsarDeform} mm)`,
        featureValue: `-${simInsarDeform} mm`,
        shapWeightPct: Math.round(15 * Math.min(1.3, insarFactor)),
        direction: 'increases_risk',
        description: 'Long-term satellite phase interferometry displacement',
      },
      {
        featureName: `Vegetation Canopy Root Anchoring (${selectedSlope.vegetationCoverPct}%)`,
        featureValue: `${selectedSlope.vegetationCoverPct}% cover`,
        shapWeightPct: -Math.round(selectedSlope.vegetationCoverPct * 0.15),
        direction: 'decreases_risk',
        description: 'Biotechnical shear strength enhancement',
      },
    ];

    return {
      probability,
      riskScore,
      alertLevel,
      estimatedHours,
      shapData,
    };
  }, [simRainfall24, simPorePressure, simTiltRate, simInsarDeform, simSoilMoisture, selectedSlope]);

  // Empirical Rainfall Intensity-Duration (I-D) Threshold Curve Data
  const idCurveData = useMemo(() => {
    return [
      { durationHours: '1h', CriticalThreshold: 45, ObservedRainfall: Math.round(simRainfall24 * 0.35) },
      { durationHours: '3h', CriticalThreshold: 75, ObservedRainfall: Math.round(simRainfall24 * 0.55) },
      { durationHours: '6h', CriticalThreshold: 100, ObservedRainfall: Math.round(simRainfall24 * 0.72) },
      { durationHours: '12h', CriticalThreshold: 130, ObservedRainfall: Math.round(simRainfall24 * 0.88) },
      { durationHours: '24h', CriticalThreshold: selectedSlope.criticalRainfallThresholdMm24h, ObservedRainfall: simRainfall24 },
      { durationHours: '48h', CriticalThreshold: selectedSlope.criticalRainfallThresholdMm24h * 1.3, ObservedRainfall: Math.round(simRainfall24 * 1.25) },
    ];
  }, [simRainfall24, selectedSlope]);

  const getAlertBadge = (level: AlertSeverity) => {
    switch (level) {
      case 'RED':
        return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]';
      case 'ORANGE':
        return 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'YELLOW':
        return 'bg-yellow-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(234,179,8,0.3)]';
      default:
        return 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Slope Target Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Neural Forecasting Pipeline</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">XGBoost + LSTM</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            Hybrid AI Risk Engine & "What-If" Geotechnical Stress Lab
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Physics-informed machine learning fusing pore-water pressure, kinematic inclinometer tilt rates, InSAR deformation, and empirical I-D envelopes.
          </p>
        </div>

        {/* Selected Target Slope dropdown */}
        <div className="flex items-center gap-2 z-10">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold hidden sm:inline">Active Slope:</span>
          <select
            id="select-engine-slope"
            value={selectedSlope.id}
            onChange={(e) => onSelectSlope(e.target.value)}
            className="bg-black/60 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {slopes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Stress Simulator & Output Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive "What-If" Stress Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">"What-If" Stress Test Lab</h3>
            </div>
            <button
              onClick={handleResetSimulator}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Sync Live Telemetry
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Adjust multi-factor environmental parameters below to observe real-time recalculation of failure probability and trigger thresholds.
          </p>

          {/* Sliders List */}
          <div className="space-y-4">
            {/* 1. 24h Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]"></span>
                  24h Rainfall Intensity
                </span>
                <span className="font-mono text-blue-300 font-bold">{simRainfall24} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="2"
                value={simRainfall24}
                onChange={(e) => setSimRainfall24(Number(e.target.value))}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mm (Dry)</span>
                <span className="text-amber-400 font-semibold">Threshold: {selectedSlope.criticalRainfallThresholdMm24h} mm</span>
                <span>250 mm (Extreme)</span>
              </div>
            </div>

            {/* 2. Pore Water Pressure */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]"></span>
                  Slip Plane Pore Pressure ($u$)
                </span>
                <span className="font-mono text-purple-300 font-bold">{simPorePressure} kPa</span>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                step="1"
                value={simPorePressure}
                onChange={(e) => setSimPorePressure(Number(e.target.value))}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-purple-400 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 kPa</span>
                <span className="text-rose-400 font-semibold">Critical: &gt;30 kPa</span>
                <span>55 kPa</span>
              </div>
            </div>

            {/* 3. Inclinometer Angular Tilt Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
                  Inclinometer Tilt Velocity
                </span>
                <span className="font-mono text-amber-300 font-bold">{simTiltRate.toFixed(2)} °/hr</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.5"
                step="0.02"
                value={simTiltRate}
                onChange={(e) => setSimTiltRate(Number(e.target.value))}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.00 °/hr</span>
                <span className="text-rose-400 font-semibold">Tertiary Creep: &gt;0.40 °/hr</span>
                <span>1.50 °/hr</span>
              </div>
            </div>

            {/* 4. InSAR Cumulative Subsidence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"></span>
                  InSAR LOS Subsidence
                </span>
                <span className="font-mono text-cyan-300 font-bold">-{simInsarDeform} mm</span>
              </div>
              <input
                type="range"
                min="5"
                max="140"
                step="2"
                value={simInsarDeform}
                onChange={(e) => setSimInsarDeform(Number(e.target.value))}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-5 mm</span>
                <span>-140 mm</span>
              </div>
            </div>

            {/* 5. Soil Volumetric Moisture Content */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  Soil Moisture Content (VWC)
                </span>
                <span className="font-mono text-emerald-300 font-bold">{simSoilMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="58"
                step="1"
                value={simSoilMoisture}
                onChange={(e) => setSimSoilMoisture(Number(e.target.value))}
                className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-white/5"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Dry)</span>
                <span className="text-rose-400 font-semibold">Saturation: &gt;45%</span>
                <span>58% (Liquid)</span>
              </div>
            </div>
          </div>

          {/* Deep AI Audit Action Button */}
          <div className="pt-2">
            <button
              id="btn-trigger-ai-audit"
              onClick={() => onTriggerAudit(selectedSlope.id)}
              disabled={isAuditing}
              className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Generating Gemini Geotechnical Audit...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  Run Gemini Deep Geotechnical Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Real-time ML Probability Engine & SHAP Explainability (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Score Matrix Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Probability of Failure */}
            <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Failure Probability $P_f$</span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className={`text-3xl font-extrabold font-mono ${
                  simResults.probability > 0.8 ? 'text-rose-400' : simResults.probability > 0.6 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(simResults.probability * 100).toFixed(1)}%
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">XGBoost + LSTM Fusion</span>
            </div>

            {/* Dynamic Alert Tier */}
            <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Alert Tier</span>
              <div className="flex items-center gap-2 pt-1.5">
                <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wide ${getAlertBadge(simResults.alertLevel)}`}>
                  {simResults.alertLevel} ALERT
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block font-mono pt-1">Score: {simResults.riskScore}/100</span>
            </div>

            {/* Estimated Horizon */}
            <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Time to Failure
              </span>
              <div className="text-2xl font-extrabold font-mono text-white pt-1">
                {simResults.estimatedHours ? `${simResults.estimatedHours} hrs` : 'Stable (>24h)'}
              </div>
              <span className="text-[10px] text-slate-500 block">Kinematic Trend</span>
            </div>
          </div>

          {/* Explainable AI: SHAP Factor Attribution Waterfall Chart */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  SHAP Explainability Decomposition (Why this slope is at {(simResults.probability * 100).toFixed(0)}% risk)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Positive weights increase failure likelihood; negative weights provide geotechnical stabilization
                </p>
              </div>
            </div>

            {/* SHAP List Bars */}
            <div className="space-y-3.5">
              {simResults.shapData.map((shap, idx) => {
                const isPositive = shap.direction === 'increases_risk';
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium text-[11px]">{shap.featureName}</span>
                      <span className={`font-mono font-bold text-[11px] ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isPositive ? `+${shap.shapWeightPct}%` : `${shap.shapWeightPct}%`}
                      </span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden flex border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isPositive ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(shap.shapWeightPct) * 2.2)}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{shap.description}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Empirical I-D Threshold Curve Chart */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Rainfall Intensity-Duration (I-D) Threshold Curve (GSI / Caine Model)
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">Antecedent Index</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={idCurveData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="durationHours" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050608', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line type="monotone" dataKey="CriticalThreshold" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} name="Critical Failure Boundary" />
                  <Line type="monotone" dataKey="ObservedRainfall" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} name="Simulated / Live Rainfall" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Gemini Geotechnical Audit Report Modal / Card */}
      {auditResult && (
        <div className="bg-white/[0.02] rounded-3xl border-2 border-cyan-500/40 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Gemini AI Deep Geotechnical Situation Report & Hazard Assessment
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold">
              Model: gemini-3.7-flash
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-black/40 p-5 rounded-2xl border border-white/5 font-sans">
            {auditResult}
          </div>
        </div>
      )}
    </div>
  );
};
