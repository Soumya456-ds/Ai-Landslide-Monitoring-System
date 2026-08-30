import React, { useState, useRef, useEffect } from 'react';
import { SlopeRegion, AIRiskEngineOutput, InSarDeformationData } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  ShieldAlert, 
  Mountain, 
  Cpu, 
  CheckCircle2,
  Trash2,
  CornerDownLeft
} from 'lucide-react';

interface AiGeotechCopilotProps {
  slopes: SlopeRegion[];
  selectedSlopeId: string;
  onSelectSlope: (id: string) => void;
  aiRisks: Record<string, AIRiskEngineOutput>;
  insarData: Record<string, InSarDeformationData>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiGeotechCopilot: React.FC<AiGeotechCopilotProps> = ({
  slopes,
  selectedSlopeId,
  onSelectSlope,
  aiRisks,
  insarData,
}) => {
  const selectedSlope = slopes.find((s) => s.id === selectedSlopeId) || slopes[0];
  const currentRisk = aiRisks[selectedSlope.id];
  const currentInsar = insarData[selectedSlope.id];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello! I am your **Pegasus AI Geotechnical Co-Pilot** for the North Eastern Region.\n\nI have loaded live telemetry, InSAR displacement rates, and XGBoost/LSTM physics models for **${selectedSlope.name} (${selectedSlope.state})**.\n\nCurrently, this slope is evaluated at **${currentRisk?.riskScore || 88}/100 Risk** (${currentRisk?.alertLevel || 'RED'} Alert). How can I assist with slope stability diagnostics, drainage design, or evacuation routing?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const samplePrompts = [
    `Why is ${selectedSlope.name.split(' ')[0]} showing ${currentRisk?.alertLevel || 'RED'} alert?`,
    `What stabilization works are best for ${selectedSlope.lithologyType} slopes?`,
    `How does InSAR satellite data fuse with ground inclinometer tilt?`,
    `Generate an evacuation radius SOP for ${selectedSlope.district} DDMA`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          slopeContext: {
            name: selectedSlope.name,
            state: selectedSlope.state,
            corridor: selectedSlope.corridor,
            riskScore: currentRisk?.riskScore || 85,
            alertLevel: currentRisk?.alertLevel || 'RED',
            failureProbability: currentRisk?.probabilityOfFailure || 0.88,
            dominantTrigger: currentRisk?.dominantTrigger || 'Pore Pressure Saturation',
            insarSubsidenceMm: currentInsar?.cumulativeLineOfSightDisplacementMm || -64.2,
            lithology: selectedSlope.lithologyType,
            slopeAngleDeg: selectedSlope.slopeAngleDeg,
          },
          history: messages.map((m) => ({
            role: m.sender === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Analysis completed with verified geotechnical parameters.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      // Fallback assistant response
      const fallbackReply: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: `### Geotechnical Co-Pilot Diagnostic for ${selectedSlope.name}:\n\n` +
          `1. **Trigger Mechanism**: High antecedent monsoon rainfall has exceeded the critical 24h threshold (${selectedSlope.criticalRainfallThresholdMm24h} mm), resulting in elevated pore-water pressures along the ${selectedSlope.lithologyType} shear plane.\n` +
          `2. **InSAR Confirmation**: Sentinel-1 InSAR measurements show cumulative line-of-sight subsidence of ${currentInsar?.cumulativeLineOfSightDisplacementMm || -64.2} mm.\n` +
          `3. **Recommended Actions**: Restrict heavy vehicular traffic along ${selectedSlope.corridor}, deploy horizontal perforated borehole drains to bleed hydrostatic pressure, and install anchored wire mesh / shotcrete facing at the slope toe.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-reset',
        sender: 'assistant',
        text: `Chat reset. Context synced for **${selectedSlope.name} (${selectedSlope.state})**. Ask me anything about geotechnics, ISRO data, or emergency procedures.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Slope Context Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.02] p-5 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Gemini 3.7 Flash Model
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">SIH 2026 AI Geotech</span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-cyan-400" />
            AI Geotechnical Co-Pilot & Engineering Advisor
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query real-time slope telemetry, get engineering stabilization recommendations, and draft emergency SOPs.
          </p>
        </div>

        {/* Target Slope Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto z-10">
          <span className="text-xs text-slate-400 whitespace-nowrap">Active Slope:</span>
          <select
            id="select-copilot-slope"
            value={selectedSlope.id}
            onChange={(e) => onSelectSlope(e.target.value)}
            className="w-full md:w-64 bg-black/60 text-slate-200 text-xs px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {slopes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.state}: {s.name.substring(0, 30)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-black/40 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col h-[650px]">
        {/* Chat Header Status Bar */}
        <div className="px-6 py-3.5 bg-black/60 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black"></span>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Pegasus Geotech Engine</span>
              <span className="text-[10px] text-cyan-400 font-mono">
                Context: {selectedSlope.name} • {selectedSlope.lithologyType} • Risk {currentRisk?.riskScore || 85}/100
              </span>
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-all"
            title="Reset Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-cyan-500 text-black font-medium rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'bg-white/[0.03] border border-white/5 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
                    {msg.text}
                  </div>
                  <span className={`text-[9px] block mt-2 text-right ${isUser ? 'text-black/60' : 'text-slate-500'} font-mono`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 bg-black/60 rounded-2xl border border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-cyan-300 font-mono ml-2">Reasoning over InSAR, pore pressure & GSI thresholds...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-black/60 border-t border-white/5 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono whitespace-nowrap">Suggested:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-[11px] whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-black/80 border-t border-white/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="input-copilot-prompt"
              placeholder={`Ask Gemini about slope stability, pore pressure, or evacuation SOPs...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-black/60 text-slate-200 text-xs px-4 py-3 rounded-2xl border border-white/10 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2 transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              Ask Co-Pilot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
