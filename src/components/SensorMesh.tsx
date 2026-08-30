import React, { useState, useEffect } from 'react';
import { SensorNode, SlopeRegion } from '../types';
import { 
  Radio, 
  Wifi, 
  Battery, 
  Signal, 
  Activity, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  HardDrive, 
  RefreshCw, 
  Database,
  Compass,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface SensorMeshProps {
  sensors: SensorNode[];
  slopes: SlopeRegion[];
  onSelectSlope: (slopeId: string) => void;
}

export const SensorMesh: React.FC<SensorMeshProps> = ({
  sensors,
  slopes,
  onSelectSlope,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(sensors[0]?.nodeId || 'PEG-01');
  const [simNetworkOutage, setSimNetworkOutage] = useState<boolean>(false);
  const [livePacketsCount, setLivePacketsCount] = useState<number>(14298);
  const [recentPackets, setRecentPackets] = useState<Array<{ id: string; time: string; node: string; type: string; val: string }>>([
    { id: '1', time: '12:04:12', node: 'PEG-01', type: 'Pore Pressure', val: '28.4 kPa' },
    { id: '2', time: '12:04:10', node: 'PEG-02', type: 'Tilt Axis X', val: '+0.12°' },
    { id: '3', time: '12:04:08', node: 'PEG-03', type: 'Soil Moisture', val: '38.2%' },
    { id: '4', time: '12:04:05', node: 'PEG-04', type: 'Rainfall 24h', val: '124 mm' },
  ]);

  const selectedNode = sensors.find((s) => s.nodeId === selectedNodeId) || sensors[0];
  const nodeSlope = slopes.find((s) => s.id === selectedNode.slopeId) || slopes[0];

  // Packet simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePacketsCount((prev) => prev + 1);
      const randomNode = sensors[Math.floor(Math.random() * sensors.length)];
      const types = ['Tilt Rate', 'Pore Pressure', 'Rainfall', 'Soil Moisture', 'Vibration'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const newPkt = {
        id: `pkt-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        node: randomNode.nodeId,
        type: chosenType,
        val: `${(Math.random() * 20 + 10).toFixed(1)} unit`,
      };
      setRecentPackets((prev) => [newPkt, ...prev.slice(0, 5)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [sensors]);

  return (
    <div className="space-y-6">
      {/* Top Header & Resilience Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">IoT Mesh Architecture</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">ESP32 + LoRaWAN (865 MHz)</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400" />
            Live IoT Node Mesh & Edge Telemetry Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed sensor nodes measuring pore water pressure, multi-axis tilt, rainfall, and soil moisture with edge buffer resilience.
          </p>
        </div>

        {/* Edge Outage Simulation Toggle */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 z-10">
          <span className="text-xs text-slate-300 font-medium px-2 hidden sm:inline">Network Simulation:</span>
          <button
            id="btn-toggle-outage"
            onClick={() => setSimNetworkOutage(!simNetworkOutage)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              simNetworkOutage
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                : 'bg-white/5 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10'
            }`}
          >
            {simNetworkOutage ? (
              <>
                <HardDrive className="w-3.5 h-3.5" />
                Edge Buffer Active (Offline Mode)
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" />
                Mesh Gateway Live (Online)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Active Nodes</span>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {sensors.length} / 48 <span className="text-xs text-emerald-400 font-normal">Deployed</span>
          </div>
        </div>
        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Packets Ingested</span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {livePacketsCount.toLocaleString()}
          </div>
        </div>
        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Mesh Topology</span>
          <div className="text-sm font-bold text-slate-200 mt-2 flex items-center gap-1.5">
            <Signal className="w-4 h-4 text-purple-400" />
            LoRaWAN Multi-Hop
          </div>
        </div>
        <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block">Self-Health State</span>
          <div className="text-sm font-bold text-emerald-300 mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            98.4% Drift Free
          </div>
        </div>
      </div>

      {/* Main Grid: Node Selector & Real-Time Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Node List Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Deployed Sensor Stations ({sensors.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">1s Telemetry Stream</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {sensors.map((sensor) => {
              const isSelected = sensor.nodeId === selectedNode.nodeId;
              const slope = slopes.find((s) => s.id === sensor.slopeId);
              return (
                <div
                  key={sensor.nodeId}
                  id={`node-card-${sensor.nodeId}`}
                  onClick={() => {
                    setSelectedNodeId(sensor.nodeId);
                    onSelectSlope(sensor.slopeId);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black/60 border-cyan-500/40 ring-2 ring-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{sensor.nodeId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                          {slope?.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{sensor.name}</p>
                    </div>

                    <span className={`w-2.5 h-2.5 rounded-full ${
                      simNetworkOutage ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse' : sensor.status === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'
                    }`}></span>
                  </div>

                  {/* Telemetry Quick Badges */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400">
                    <div>Pore: <strong className="text-purple-300">{sensor.telemetry.poreWaterPressureKPa} kPa</strong></div>
                    <div>Tilt: <strong className="text-amber-300">{sensor.telemetry.tiltRateDegHr}°/h</strong></div>
                    <div>Rain: <strong className="text-blue-300">{sensor.telemetry.rainfall24hMm}mm</strong></div>
                  </div>

                  {/* Battery & RSSI Bar */}
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Battery className="w-3 h-3 text-emerald-400" />
                      {sensor.batteryPct}% ({sensor.solarInputV}V)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 text-cyan-400" />
                      {sensor.loraRssiDbm} dBm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Telemetry Graphs & Diagnostics (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Node Profile Header Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{selectedNode.nodeId}</span>
                  <span className="text-xs text-cyan-400 font-semibold">• {selectedNode.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Installed on: {nodeSlope.name} ({nodeSlope.corridor})
                </p>
              </div>

              {/* Hardware Connection Mode Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  {simNetworkOutage ? 'Offline Buffer Active (24 Packets)' : selectedNode.connectionMode}
                </span>
              </div>
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase block">Pore Water Pressure</span>
                <span className="text-lg font-bold text-purple-300 mt-0.5 block">{selectedNode.telemetry.poreWaterPressureKPa} kPa</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Piezometer Node</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase block">Tilt Velocity</span>
                <span className="text-lg font-bold text-amber-300 mt-0.5 block">{selectedNode.telemetry.tiltRateDegHr} °/hr</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">MEMS Inclinometer</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase block">24h Rainfall</span>
                <span className="text-lg font-bold text-blue-300 mt-0.5 block">{selectedNode.telemetry.rainfall24hMm} mm</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Tipping Bucket</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase block">Soil Moisture (VWC)</span>
                <span className="text-lg font-bold text-emerald-300 mt-0.5 block">{selectedNode.telemetry.soilMoistureVwcPct}%</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Capacitive Sensor</span>
              </div>
            </div>

            {/* Telemetry Chart 1: Pore Water Pressure & Rainfall (24h Trend) */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  Pore Water Pressure (kPa) vs 24h Rainfall Intensity (mm)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">24h History Buffer</span>
              </div>

              <div className="h-44 w-full bg-black/40 p-3 rounded-2xl border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedNode.telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#050608', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="poreWaterPressureKPa" stroke="#a855f7" fillOpacity={1} fill="url(#colorPore)" name="Pore Pressure (kPa)" />
                    <Area type="monotone" dataKey="rainfall24hMm" stroke="#38bdf8" fillOpacity={1} fill="url(#colorRain)" name="24h Rainfall (mm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Telemetry Chart 2: 3-Axis Inclinometer Rotation (Tilt X, Y, Z Degrees) */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  MEMS Inclinometer 3-Axis Tilt Angles (° Departure)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Axis X/Y/Z Vector</span>
              </div>

              <div className="h-44 w-full bg-black/40 p-3 rounded-2xl border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedNode.telemetryHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#050608', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="tiltAngleXDeg" stroke="#f59e0b" strokeWidth={2} name="Tilt Axis X (Slope Downhill)" />
                    <Line type="monotone" dataKey="tiltAngleYDeg" stroke="#ec4899" strokeWidth={1.5} name="Tilt Axis Y (Lateral Strike)" />
                    <Line type="monotone" dataKey="tiltAngleZDeg" stroke="#10b981" strokeWidth={1.5} name="Tilt Axis Z (Normal)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Live Ingested Packets Feed */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Live Ingested Telemetry Packet Stream (LoRa Gateway Ingestion)
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                CRC32 Verified
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {recentPackets.map((pkt) => (
                <div key={pkt.id} className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-[11px]">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{pkt.time}</span>
                    <span className="font-bold text-cyan-400">{pkt.node}</span>
                    <span className="text-slate-300">{pkt.type}</span>
                  </div>
                  <span className="font-bold text-white bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/10">
                    {pkt.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
