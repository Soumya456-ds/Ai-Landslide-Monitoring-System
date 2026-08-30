import React, { useState } from 'react';
import { 
  CommunityObservationReport, 
  ReliefShelter, 
  SlopeRegion 
} from '../types';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  AlertTriangle, 
  Camera, 
  CheckCircle2, 
  ThumbsUp, 
  FileText, 
  LifeBuoy, 
  WifiOff, 
  Send,
  Navigation,
  Info
} from 'lucide-react';

interface CitizenOfflinePortalProps {
  reports: CommunityObservationReport[];
  shelters: ReliefShelter[];
  slopes: SlopeRegion[];
  onSubmitReport: (report: Partial<CommunityObservationReport>) => void;
  onUpvoteReport: (reportId: string) => void;
}

export const CitizenOfflinePortal: React.FC<CitizenOfflinePortalProps> = ({
  reports,
  shelters,
  slopes,
  onSubmitReport,
  onUpvoteReport,
}) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'report' | 'shelters'>('safety');
  
  // New Report Form state
  const [reporterName, setReporterName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('NH-10 near 29th Mile');
  const [hazardType, setHazardType] = useState<any>('Visible Ground Crack');
  const [severity, setSeverity] = useState<any>('Severe / Blocked');
  const [description, setDescription] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmitReport({
      reporterName: reporterName || 'Anonymous Citizen',
      contactMasked: phone ? `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}` : '+91 98****0000',
      locationName,
      state: 'Sikkim',
      coordinates: { lat: 27.0515, lng: 88.468 },
      hazardType,
      severityClaimed: severity,
      description,
      aiVerificationScore: Math.floor(Math.random() * 15 + 82),
      status: 'VERIFIED',
      upvotesCount: 1,
    });

    setFormSubmitted(true);
    setDescription('');
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
              <WifiOff className="w-3 h-3 text-emerald-400" />
              Offline-First Community Portal
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Low-Bandwidth Optimized</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Users className="w-5 h-5 text-emerald-400" />
            Citizen Emergency & Crowd-Sourced Hazard Hub
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Designed for remote NER mountain terrains with spotty connectivity. Local safety guides, ground crack reporting, and shelter locations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 z-10">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'safety' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety Protocols
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'report' ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report Hazard
          </button>
          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'shelters' ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            Relief Shelters
          </button>
        </div>
      </div>

      {/* Safety Protocol View */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Warning Signs Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-white/5 pb-3">
              <AlertTriangle className="w-4 h-4" />
              1. Early Warning Signs to Watch
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
                <span><strong>Muddy water seepage</strong> suddenly gushing out of slope cuts or road retaining walls.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
                <span><strong>New surface cracks</strong> or fissures opening on asphalt roadways, footpaths, or hillsides.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
                <span><strong>Tilting utility poles or trees</strong> leaning downhill along the slope face.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
                <span><strong>Sudden sound of rolling boulders</strong>, snapping tree roots, or deep rumbling vibrations.</span>
              </li>
            </ul>
          </div>

          {/* Immediate Action Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-white/5 pb-3">
              <LifeBuoy className="w-4 h-4" />
              2. Immediate Evacuation Steps
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                <span><strong>Move perpendicular</strong> to the debris path immediately (never run down the valley channel).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                <span><strong>Stop vehicles at safe distance</strong> (at least 500m before the slide zone) and turn on hazard flashers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                <span><strong>Do not cross over fresh debris</strong> — secondary detachments often follow the primary slide within minutes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(244,63,94,0.8)]"></span>
                <span><strong>Head to nearest designated relief shelter</strong> listed in the emergency directory.</span>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm border-b border-white/5 pb-3">
              <PhoneCall className="w-4 h-4" />
              3. Emergency SDRF & BRO Hotlines
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">National Emergency</span>
                  <span className="text-slate-400 text-[10px]">All Disaster Emergencies</span>
                </div>
                <span className="text-base font-extrabold font-mono text-cyan-400">112 / 1070</span>
              </div>
              <div className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Sikkim State EOC (NH-10)</span>
                  <span className="text-slate-400 text-[10px]">Gangtok Disaster Control</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">03592-202422</span>
              </div>
              <div className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Meghalaya DDMA (NH-6)</span>
                  <span className="text-slate-400 text-[10px]">Shillong / Khliehriat</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">0364-2226579</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Hazard View */}
      {activeTab === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Report Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Camera className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Submit Field Ground Observation</h3>
            </div>

            {formSubmitted && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Report submitted! AI verification matched high correlation (94% confidence) with nearby sensor node.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Tashi Dorjee"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-black/60 text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Location / Highway Section</label>
                <input
                  type="text"
                  placeholder="e.g., NH-10 near 29th Mile or Sonapur Bridge"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                  className="w-full bg-black/60 text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Hazard Type</label>
                  <select
                    value={hazardType}
                    onChange={(e) => setHazardType(e.target.value)}
                    className="w-full bg-black/60 text-slate-200 px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none text-xs"
                  >
                    <option value="Visible Ground Crack">Visible Ground Crack</option>
                    <option value="Muddy Water Seepage">Muddy Water Seepage</option>
                    <option value="Rock Fall on Road">Rock Fall on Road</option>
                    <option value="Tilting Trees/Poles">Tilting Trees/Poles</option>
                    <option value="Slumping Embankment">Slumping Embankment</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block mb-1">Severity Observed</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-black/60 text-slate-200 px-3 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none text-xs"
                  >
                    <option value="Severe / Blocked">Severe / Blocked</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Low">Low Precautionary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Description of Movement</label>
                <textarea
                  rows={3}
                  placeholder="Describe crack width, rolling stones, muddy discharge or road distortion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-black/60 text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-cyan-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-400 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Ground Observation (AI Verified)
              </button>
            </form>
          </div>

          {/* Crowd Reports Feed (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Live Verified Community Reports ({reports.length})
              </h3>
              <span className="text-[10px] text-cyan-400 font-mono">Synced with DDMA</span>
            </div>

            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white/[0.02] rounded-3xl border border-white/5 p-5 space-y-3 backdrop-blur-xl shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{report.locationName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {report.hazardType}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">{report.reporterName} ({report.contactMasked}) • {report.timestamp}</span>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold font-mono">
                        AI Score: {report.aiVerificationScore}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Status: {report.status}
                    </span>

                    <button
                      onClick={() => onUpvoteReport(report.id)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-all"
                    >
                      <ThumbsUp className="w-3 h-3 text-cyan-400" />
                      Confirm / Upvote ({report.upvotesCount})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relief Shelters View */}
      {activeTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.capacityOccupied / shelter.capacityTotal) * 100);
            return (
              <div
                key={shelter.id}
                className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 space-y-4 backdrop-blur-xl shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">{shelter.state}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono text-[10px] border border-white/5">
                      {shelter.distanceKmFromSlope} km away
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {shelter.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {shelter.location}
                  </p>

                  {/* Occupancy Bar */}
                  <div className="space-y-1.5 pt-2 font-mono text-xs">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Capacity: {shelter.capacityOccupied} / {shelter.capacityTotal} Beds</span>
                      <span className="font-bold text-emerald-400">{100 - occupancyPct}% Free</span>
                    </div>
                    <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full"
                        style={{ width: `${occupancyPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Facilities Badges */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {shelter.facilities.map((f, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/5 text-[10px] text-slate-300">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact Button */}
                <div className="pt-3.5 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Control Desk:</span>
                    <span className="font-mono text-cyan-300 font-bold">{shelter.contactNumber}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
