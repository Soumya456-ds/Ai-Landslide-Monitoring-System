import React, { useState } from 'react';
import { 
  EmergencyAlert, 
  EmergencyActionItem, 
  AlertSeverity, 
  SlopeRegion 
} from '../types';
import { 
  Bell, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Send, 
  Radio, 
  Truck, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileCode, 
  Share2, 
  AlertTriangle, 
  Megaphone, 
  ExternalLink,
  Globe,
  Sparkles,
  Download
} from 'lucide-react';

interface WarnRespondControlProps {
  alerts: EmergencyAlert[];
  slopes: SlopeRegion[];
  onTriggerSiren: () => void;
  sirenActive: boolean;
  onUpdateActionStatus: (alertId: string, actionId: string, status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED') => void;
  onBroadcastSms: (alertId: string) => void;
}

export const WarnRespondControl: React.FC<WarnRespondControlProps> = ({
  alerts,
  slopes,
  onTriggerSiren,
  sirenActive,
  onUpdateActionStatus,
  onBroadcastSms,
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.alertId || '');
  const [activeLanguage, setActiveLanguage] = useState<'english' | 'hindi' | 'khasi' | 'bengali' | 'assamese' | 'mizo'>('english');
  const [showCapXml, setShowCapXml] = useState<boolean>(false);
  const [broadcastSuccessMessage, setBroadcastSuccessMessage] = useState<string | null>(null);

  const selectedAlert = alerts.find((a) => a.alertId === selectedAlertId) || alerts[0];
  const targetSlope = slopes.find((s) => s.id === selectedAlert?.slopeId) || slopes[0];

  const handleBroadcast = () => {
    onBroadcastSms(selectedAlert.alertId);
    setBroadcastSuccessMessage(`Emergency Broadcast & Cell Broadcast successfully transmitted to ${selectedAlert.broadcastChannels.smsCountSent.toLocaleString()} mobile subscribers in ${selectedAlert.corridor}!`);
    setTimeout(() => setBroadcastSuccessMessage(null), 5000);
  };

  const getSeverityBadge = (level: AlertSeverity) => {
    switch (level) {
      case 'RED':
        return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse';
      case 'ORANGE':
        return 'bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'YELLOW':
        return 'bg-yellow-500 text-black font-bold shadow-[0_0_12px_rgba(234,179,8,0.3)]';
      default:
        return 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">WARN → RESPOND Engine</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">CAP v1.2 Gateway</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-rose-400" />
            Warn & Respond Control Room & Multi-Agency Dispatcher
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated SOP generation, Common Alerting Protocol (CAP v1.2), Multilingual SMS broadcasts, and BRO highway barrier controls.
          </p>
        </div>

        {/* Live Siren Actuation Button */}
        <div className="flex items-center gap-3 z-10">
          <button
            id="btn-trigger-siren"
            onClick={onTriggerSiren}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              sirenActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-600/40 shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-bounce'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {sirenActive ? '120dB SIREN ACTIVE (Silence)' : 'Test Emergency Siren Trigger'}
          </button>
        </div>
      </div>

      {/* Broadcast Toast Banner */}
      {broadcastSuccessMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-2xl text-xs flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{broadcastSuccessMessage}</span>
          </div>
          <button onClick={() => setBroadcastSuccessMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Grid: Active Alerts List & Dispatch Actions Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Alerts Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Active Warning Feeds ({alerts.length})
            </h3>
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-ping"></span>
              Live Geotargeted
            </span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alert) => {
              const isSelected = alert.alertId === selectedAlert.alertId;
              return (
                <div
                  key={alert.alertId}
                  id={`alert-card-${alert.alertId}`}
                  onClick={() => setSelectedAlertId(alert.alertId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black/60 border-rose-500/40 ring-2 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity} ALERT
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp.split('T')[1]?.replace('Z', '')} UTC</span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-2.5 leading-snug">
                    {alert.slopeName}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {alert.synopsis}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Failure Prob: <strong className="text-rose-400">{(alert.probabilityOfFailure * 100).toFixed(0)}%</strong></span>
                    <span>SMS Sent: <strong className="text-cyan-400">{alert.broadcastChannels.smsCountSent.toLocaleString()}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CAP Protocol & Broadcast Actions */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-5 space-y-3 backdrop-blur-xl shadow-2xl">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Common Alerting Protocol (CAP v1.2)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Compliant with National Disaster Management Authority (NDMA) & Sachet national disaster alert gateway.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                id="btn-toggle-cap"
                onClick={() => setShowCapXml(!showCapXml)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs font-medium transition-all"
              >
                {showCapXml ? 'Hide CAP XML' : 'View CAP v1.2 XML'}
              </button>
              <a
                href={`/api/cap/${selectedAlert.alertId}.xml`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs flex items-center justify-center transition-all"
                title="Download CAP XML"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Detailed SOP Dispatch Playbook & Multilingual Broadcaster (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Alert Directive Header Card */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold uppercase ${getSeverityBadge(selectedAlert.severity)}`}>
                    {selectedAlert.severity} EMERGENCY DIRECTIVE
                  </span>
                  <span className="text-xs text-slate-500 font-mono">ID: {selectedAlert.alertId}</span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug mt-1.5">
                  {selectedAlert.title}
                </h3>
              </div>

              <button
                id="btn-broadcast-alert"
                onClick={handleBroadcast}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 whitespace-nowrap transition-all"
              >
                <Megaphone className="w-4 h-4" />
                Push Emergency Broadcast
              </button>
            </div>

            {/* Synopsis & Key Geotechnical Metrics */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed">
              <p>{selectedAlert.synopsis}</p>
              <div className="mt-3 pt-2.5 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                <div>24h Rain: <strong className="text-blue-300">{selectedAlert.rainfall24hMm} mm</strong></div>
                <div>Tilt Rate: <strong className="text-amber-300">{selectedAlert.tiltRateDegHr} °/hr</strong></div>
                <div>Displacement: <strong className="text-purple-300">{selectedAlert.displacementMm} mm</strong></div>
                <div>Failure Prob: <strong className="text-rose-400">{(selectedAlert.probabilityOfFailure * 100).toFixed(0)}%</strong></div>
              </div>
            </div>

            {/* Standard Operating Procedure (SOP) Action Items by Target Agency */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Target Agency Standard Operating Procedures (SOP Dispatch Matrix)
              </h4>

              <div className="space-y-2.5">
                {selectedAlert.actionItems.map((action) => {
                  return (
                    <div
                      key={action.id}
                      className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-bold text-[10px] border border-cyan-500/20">
                            {action.targetAgency}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono font-medium">
                            {action.urgency}
                          </span>
                        </div>
                        <p className="font-semibold text-white text-[11px]">{action.actionTitle}</p>
                        <p className="text-[10px] text-slate-400">{action.details}</p>
                      </div>

                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => onUpdateActionStatus(selectedAlert.alertId, action.id, 'DISPATCHED')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                            action.status === 'DISPATCHED'
                              ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          Dispatched
                        </button>
                        <button
                          onClick={() => onUpdateActionStatus(selectedAlert.alertId, action.id, 'ACKNOWLEDGED')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                            action.status === 'ACKNOWLEDGED'
                              ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          Acknowledged
                        </button>
                        <button
                          onClick={() => onUpdateActionStatus(selectedAlert.alertId, action.id, 'RESOLVED')}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                            action.status === 'RESOLVED'
                              ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          Resolved
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Multilingual Citizen Advisory Broadcaster */}
          <div className="bg-white/[0.02] rounded-3xl border border-white/5 p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Multilingual Citizen Warning Feed (Zero Language Barrier)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Natural dialect translations for local North-Eastern hill tribes and transport operators
                </p>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
                {(['english', 'hindi', 'khasi', 'bengali', 'assamese'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                      activeLanguage === lang
                        ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Translated Alert Box */}
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-slate-200 text-xs leading-relaxed space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
                <span>Active Language Broadcast: <strong className="text-cyan-400">{activeLanguage}</strong></span>
                <span>Cell Radius: 15 km Geo-Fence</span>
              </div>
              <p className="text-sm font-medium text-amber-200 leading-relaxed">
                {selectedAlert.multilingualAdvisories[activeLanguage] || selectedAlert.multilingualAdvisories.english}
              </p>
            </div>
          </div>

          {/* CAP XML Code View (Collapsible) */}
          {showCapXml && (
            <div className="bg-black/60 rounded-3xl border border-white/10 p-5 space-y-2 font-mono text-[10px] text-slate-300 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Common Alerting Protocol (CAP v1.2) XML Payload</span>
                <span>OASIS Standard</span>
              </div>
              <pre className="p-4 bg-black/80 rounded-2xl overflow-x-auto text-cyan-300 border border-white/5">
{`<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>PEGASUS-NER-${selectedAlert.alertId}</identifier>
  <sender>ddma-ner-pegasus@ndma.gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code>NER-SIH26001-LANDSLIDE</code>
  <info>
    <category>Geo</category>
    <event>${selectedAlert.title}</event>
    <urgency>Immediate</urgency>
    <severity>${selectedAlert.severity === 'RED' ? 'Extreme' : 'Severe'}</severity>
    <certainty>Observed</certainty>
    <headline>${selectedAlert.title}</headline>
    <description>${selectedAlert.synopsis}</description>
    <instruction>${selectedAlert.multilingualAdvisories.english}</instruction>
    <area>
      <areaDesc>${selectedAlert.corridor} (${selectedAlert.state})</areaDesc>
    </area>
  </info>
</alert>`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
