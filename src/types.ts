export type AlertSeverity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SlopeRegion {
  id: string;
  name: string;
  state: 'Sikkim' | 'Meghalaya' | 'Assam' | 'Nagaland' | 'Mizoram' | 'Arunachal Pradesh' | 'Manipur' | 'Tripura';
  district: string;
  corridor: string;
  coordinates: Coordinates;
  elevationM: number;
  slopeAngleDeg: number;
  geology: string;
  lithologyType: 'Phyllite / Schist' | 'Disang Shale' | 'Sandstone Interbed' | 'Granite Gneiss' | 'Unconsolidated Clay' | 'Flysch Formation';
  soilCohesionKPa: number;
  frictionAngleDeg: number;
  vegetationCoverPct: number;
  historicalLandslidesCount: number;
  criticalRainfallThresholdMm24h: number;
  activeSensorsCount: number;
  vulnerabilityIndex: number; // 0-100
  nearestTown: string;
  broUnit: string;
}

export interface SensorTelemetry {
  timestamp: string;
  rainfall1hMm: number;
  rainfall24hMm: number;
  rainfall72hMm: number;
  soilMoistureVwcPct: number; // Volumetric Water Content %
  poreWaterPressureKPa: number;
  tiltRateDegHr: number;
  tiltAngleXDeg: number;
  tiltAngleYDeg: number;
  tiltAngleZDeg: number;
  cumulativeDisplacementMm: number;
  vibrationRmsHz: number;
  ambientTempC: number;
}

export interface SensorNode {
  nodeId: string;
  name: string;
  slopeId: string;
  coordinates: Coordinates;
  elevationM: number;
  batteryPct: number;
  solarInputV: number;
  loraRssiDbm: number;
  loraSnrDb: number;
  connectionMode: 'LoRaWAN Mesh' | '4G LTE-M' | 'Satellite Fallback' | 'Offline Edge Buffer';
  status: 'active' | 'degraded' | 'offline';
  firmwareVersion: string;
  lastHeartbeat: string;
  edgeBufferedPackets: number;
  driftConfidencePct: number; // Self-health diagnostic
  telemetry: SensorTelemetry;
  telemetryHistory: SensorTelemetry[];
}

export interface InSarDeformationData {
  slopeId: string;
  satellite: 'Sentinel-1A' | 'Sentinel-1B' | 'NISAR (Simulated)';
  orbitTrack: string;
  passDirection: 'Ascending' | 'Descending';
  meanVelocityMmPerYear: number;
  cumulativeLineOfSightDisplacementMm: number;
  coherenceScore: number; // 0-1.0
  lastAcquisitionDate: string;
  interferogramQuality: 'High' | 'Moderate' | 'Phase Decorrelated';
  opticalVegetationIndexNdvi: number;
}

export interface ShapAttribution {
  featureName: string;
  featureValue: string;
  shapWeightPct: number;
  direction: 'increases_risk' | 'decreases_risk';
  description: string;
}

export interface AIRiskEngineOutput {
  slopeId: string;
  timestamp: string;
  riskScore: number; // 0-100
  alertLevel: AlertSeverity;
  probabilityOfFailure: number; // 0.00 - 1.00
  modelConfidencePct: number;
  xgboostScore: number;
  lstmTemporalTrendScore: number;
  estimatedTimeToFailureHours?: number | null;
  dominantTrigger: 'Pore Pressure Saturation' | 'Rainfall Intensity Surge' | 'Ground Deformation Velocity' | 'Shear Plane Acceleration' | 'Stable Baseline';
  shapAttributions: ShapAttribution[];
  explainabilitySummary: string;
}

export interface EmergencyActionItem {
  id: string;
  targetAgency: 'DDMA' | 'SDRF / NDRF' | 'Border Roads Organisation (BRO)' | 'Traffic & Police' | 'Local Village Head (Gaonburha)' | 'Public Siren / Broadcast';
  actionTitle: string;
  urgency: 'Immediate (< 15 mins)' | 'High (< 1 hr)' | 'Precautionary (< 3 hrs)';
  status: 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED';
  details: string;
}

export interface EmergencyAlert {
  alertId: string;
  slopeId: string;
  slopeName: string;
  state: string;
  corridor: string;
  severity: AlertSeverity;
  timestamp: string;
  title: string;
  synopsis: string;
  probabilityOfFailure: number;
  rainfall24hMm: number;
  tiltRateDegHr: number;
  displacementMm: number;
  actionItems: EmergencyActionItem[];
  capXmlUrl?: string;
  multilingualAdvisories: {
    english: string;
    hindi: string;
    assamese?: string;
    bengali?: string;
    khasi?: string;
    mizo?: string;
    bodo?: string;
  };
  broadcastChannels: {
    smsCountSent: number;
    sirensActive: boolean;
    highwayBarriersClosed: boolean;
    ddmaPortalNotified: boolean;
  };
}

export interface CommunityObservationReport {
  id: string;
  reporterName: string;
  contactMasked: string;
  timestamp: string;
  locationName: string;
  state: string;
  coordinates: Coordinates;
  hazardType: 'Visible Ground Crack' | 'Muddy Water Seepage' | 'Rock Fall on Road' | 'Tilting Trees/Poles' | 'Slumping Embankment';
  severityClaimed: 'Low' | 'Moderate' | 'Severe / Blocked';
  description: string;
  aiVerificationScore: number; // 0-100
  status: 'VERIFIED' | 'REVIEW_PENDING' | 'FALSE_ALARM';
  upvotesCount: number;
}

export interface ReliefShelter {
  id: string;
  name: string;
  location: string;
  state: string;
  coordinates: Coordinates;
  capacityTotal: number;
  capacityOccupied: number;
  contactNumber: string;
  facilities: string[];
  distanceKmFromSlope: number;
}
