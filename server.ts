import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Pegasus AI Landslide Early Warning System (NER)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// CAP XML generator endpoint (Common Alerting Protocol v1.2)
app.get('/api/cap/:alertId.xml', (req, res) => {
  const alertId = req.params.alertId;
  const now = new Date().toISOString();
  const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>PEGASUS-NER-${alertId}</identifier>
  <sender>ddma-ner-pegasus@ndma.gov.in</sender>
  <sent>${now}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <code>NER-SIH26001-LANDSLIDE</code>
  <info>
    <category>Geo</category>
    <event>Severe Landslide Warning / Slope Failure Imminent</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>SAME</valueName>
      <value>EVI</value>
    </eventCode>
    <headline>Pegasus AI Warning: Immediate Road Closure & Evacuation Ordered for High Risk Hill Corridor</headline>
    <description>Hybrid XGBoost+LSTM and IoT sensor fusion identified critical slope shear acceleration, saturated pore pressure, and continuous heavy precipitation exceeding regional thresholds.</description>
    <instruction>Halt all uphill vehicular traffic. Evacuate vulnerable roadside settlements to identified relief shelters. BRO machinery on standby.</instruction>
    <contact>State Disaster Management Authority Control Room / BRO Project Swastik/Pushpak</contact>
    <area>
      <areaDesc>North Eastern Region High-Risk Mountain Highway Sector</areaDesc>
    </area>
  </info>
</alert>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(capXml);
});

// AI Slope Geotechnical Assessment Endpoint
app.post('/api/gemini/analyze-slope', async (req, res) => {
  try {
    const { slope, telemetry, insar, riskData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback geotechnical heuristics if no API key
      return res.json({
        analysis: generateHeuristicAnalysis(slope, telemetry, insar, riskData),
        source: 'heuristic_engine',
      });
    }

    const prompt = `You are the Lead Geotechnical and Disaster Management AI Expert for Project Pegasus (Smart India Hackathon 2026 - Problem SIH26001: AI-Based Landslide Early Warning in North Eastern Region, India).

Analyze this real-time geotechnical telemetry for the following hill corridor in the North East:
- Corridor/Slope: ${slope.name} (${slope.state}, ${slope.district})
- Highway: ${slope.corridor}
- Geology & Lithology: ${slope.geology} (${slope.lithologyType})
- Slope Angle: ${slope.slopeAngleDeg}°, Elevation: ${slope.elevationM}m
- 24h Rainfall: ${telemetry.rainfall24hMm} mm (Critical Threshold: ${slope.criticalRainfallThresholdMm24h} mm)
- 72h Cumulative Rainfall: ${telemetry.rainfall72hMm} mm
- Pore Water Pressure: ${telemetry.poreWaterPressureKPa} kPa
- Tilt Rate: ${telemetry.tiltRateDegHr} °/hr (Current Tilt X: ${telemetry.tiltAngleXDeg}°)
- InSAR Cumulative LOS Subsidence: ${insar.cumulativeLineOfSightDisplacementMm} mm (Mean Velocity: ${insar.meanVelocityMmPerYear} mm/yr)
- AI Model Probability of Failure: ${(riskData.probabilityOfFailure * 100).toFixed(1)}% (Alert Level: ${riskData.alertLevel})

Provide a structured, authoritative Geotechnical Assessment and Rapid Response Directive for the District Disaster Management Authority (DDMA), Border Roads Organisation (BRO), and State Disaster Response Force (SDRF):
1. **Geotechnical Failure Mechanism & Trigger Analysis**: Explain the physics of shear failure, effective stress reduction due to pore pressure, and InSAR creep correlation.
2. **Imminent Hazard Horizon**: Estimated time to catastrophic detachment or debris flow.
3. **Actionable Emergency Playbook**: Clear directives for traffic halting, heavy machinery pre-positioning, structural drainage clearing, and citizen evacuation.
4. **Resilience Strategy for Remote NER Terrain**: Specific recommendations considering monsoon cloud cover, offline mesh buffers, and local soil mechanics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite geotechnical engineering AI specializing in Himalayan slope stability and Indian disaster management protocol.',
      },
    });

    res.json({
      analysis: response.text || generateHeuristicAnalysis(slope, telemetry, insar, riskData),
      source: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze-slope:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze slope telemetry',
      fallback: generateHeuristicAnalysis(req.body.slope, req.body.telemetry, req.body.insar, req.body.riskData),
    });
  }
});

// AI SOP & Multilingual Advisory Generator
app.post('/api/gemini/generate-sop', async (req, res) => {
  try {
    const { slope, alertLevel, targetLanguages = ['Khasi', 'Mizo', 'Assamese', 'Bengali', 'Hindi', 'English'] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        sopText: `STANDARD OPERATING PROCEDURE: ${alertLevel} ALERT FOR ${slope?.name || 'CORRIDOR'}
1. TRAFFIC: Enforce immediate stop at upstream checkpoints.
2. BRO/PWD: Dispatch heavy earthmovers to safe staging bays.
3. SDRF: Alert quick-reaction rescue battalions.
4. PUBLIC: Broadcast multilingual siren and cell broadcast warning.`,
        translations: {
          english: `EMERGENCY ALERT: ${alertLevel} warning active for ${slope?.corridor}. Exercise extreme caution and avoid travel.`,
          hindi: `आपातकालीन चेतावनी: ${slope?.corridor} के लिए ${alertLevel} चेतावनी जारी। यात्रा से बचें।`,
          assamese: `জৰুৰী সতৰ্কবাৰ্তা: ${slope?.corridor} ত ${alertLevel} সতৰ্কতা জাৰি কৰা হৈছে। যাত্ৰা পৰিহাৰ কৰক।`,
        },
        source: 'heuristic_engine',
      });
    }

    const prompt = `Generate an official Disaster Management Standard Operating Procedure (SOP) and Multilingual Public Emergency Broadcast for:
Slope/Corridor: ${slope.name} (${slope.state})
Alert Level: ${alertLevel}
Corridor: ${slope.corridor}

Include:
1. Target Agencies & Precise Dispatch Instructions (District Magistrate / DDMA, SDRF/NDRF, Border Roads Organisation Project Task Force, Traffic Police).
2. Public Safety Warning message translated accurately and naturally into these North Eastern languages: ${targetLanguages.join(', ')}.

Format response clearly with Markdown headers.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({
      sopText: response.text,
      source: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-sop:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Geotechnical & Disaster Copilot Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `[Pegasus Offline AI Engine]: Regarding your query on "${message.substring(0, 60)}...": In the North Eastern Region, slope failure thresholds are heavily governed by antecedent 72h precipitation combined with high pore water pressures in sheared phyllites and Disang shales. Project Pegasus integrates IoT tiltmeters with Sentinel-1 InSAR for continuous risk monitoring. (Note: Connect GEMINI_API_KEY in Settings > Secrets for full live generative AI dialogues).`,
        source: 'heuristic_engine',
      });
    }

    const prompt = `You are Pegasus AI Co-Pilot, an expert AI geotechnical and disaster management advisor for Smart India Hackathon 2026 (SIH26001: AI Landslide Early Warning & Risk Monitoring in North Eastern Region).
Current System Context:
${JSON.stringify(context || {})}

User Question: "${message}"

Provide a concise, practical, and highly professional answer referencing Indian disaster protocols (NDMA/DDMA/BRO), geological formations of the North-East (Daling phyllite, Disang shale, Jaintia sandstones), sensor telemetry (pore pressure, tiltmeters, LoRa mesh), and InSAR satellite interferometry.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({
      reply: response.text || 'Unable to generate response',
      source: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({ error: error.message });
  }
});

function generateHeuristicAnalysis(slope: any, telemetry: any, insar: any, riskData: any): string {
  const isHigh = riskData?.alertLevel === 'RED' || riskData?.alertLevel === 'ORANGE';
  return `### Geotechnical Situation Report & Hazard Assessment

**Location**: ${slope?.name || 'NER High Risk Corridor'} (${slope?.state})
**Risk Classification**: **${riskData?.alertLevel || 'MONITORING'}** (Failure Probability: ${((riskData?.probabilityOfFailure || 0.5) * 100).toFixed(1)}%)

#### 1. Geomechanical Mechanism & Critical Factors
- **Pore Water Pressure Dynamics**: Telemetry records ${telemetry?.poreWaterPressureKPa || 24} kPa at the slip plane. As water content (${telemetry?.soilMoistureVwcPct || 42}% VWC) reaches saturation in the ${slope?.lithologyType || 'phyllite'} matrix, effective normal stress $\\sigma'$ drops sharply ($\\sigma' = \\sigma - u$), triggering tertiary shear strain.
- **Kinematic Tilt & Displacement**: Current angular velocity of ${telemetry?.tiltRateDegHr || 0.3}°/hr along axis X confirms active rotational creep.
- **Spaceborne Satellite InSAR Deformation**: Sentinel-1 LOS mean velocity is ${insar?.meanVelocityMmPerYear || -45} mm/year with ${insar?.cumulativeLineOfSightDisplacementMm || -60} mm cumulative displacement, validating deep-seated slope movement.

#### 2. Imminent Hazard Horizon
${isHigh ? '⚠️ **CRITICAL WINDOW**: High probability of sudden debris detachment or road embankment subsidence within **2 to 4 hours** if rainfall intensity exceeds 15 mm/hr.' : '✅ **STABLE WINDOW**: Slope is currently exhibiting primary viscoelastic creep within manageable tolerances. Continued continuous telemetry monitoring active.'}

#### 3. Immediate Action Directives
1. **Traffic Control**: ${isHigh ? 'Halt all heavy commercial vehicular movement immediately at upstream police checkpoints. Clear queue before the danger sector.' : 'Maintain normal traffic speed with caution signage.'}
2. **BRO Engineering Task Force**: Position ${slope?.broUnit || 'BRO Task Force'} crawler excavators and rock-breaker equipment at safe 500m stand-off bays.
3. **Emergency Dispatches**: Verify LoRaWAN edge buffer sync and ensure community warning sirens are energized.`;
}

// Vite middleware for development & static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pegasus AI Landslide Monitoring Server running on port ${PORT}`);
  });
}

startServer();
