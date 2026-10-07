export type LandUnit = 
  | 'acres'
  | 'hectares'
  | 'bigha'
  | 'guntha'
  | 'biswa'
  | 'cent'
  | 'sq_meters'
  | 'sq_yards';

export interface GisCoordinate {
  lat: number;
  lng: number;
  elevationM: number;
  utmEasting?: number;
  utmNorthing?: number;
}

export interface PlotVertex {
  id: string;
  lat: number;
  lng: number;
  xPct: number; // 0-100% relative to canvas
  yPct: number;
  elevationM: number;
  label?: string;
}

export interface FarmPlot {
  id: string;
  name: string;
  khasraNo: string;
  surveyNo: string;
  ownerName: string;
  village: string;
  district: string;
  cropType: string;
  variety: string;
  sowingDate: string;
  areaSqMeters: number;
  vertices: PlotVertex[];
  perimeterMeters: number;
  status: 'verified' | 'draft' | 'pending_verification';
  surveyTimestamp: string;
  surveyorLicense: string;
  ndviAverage: number;
  soilMoistureAveragePct: number;
  color: string;
}

export interface MandiCommodity {
  id: string;
  name: string;
  variety: string;
  hindiName?: string;
  kannadaName?: string;
  kannadaVariety?: string;
  category: 'Cereal' | 'Pulse' | 'Oilseed' | 'Fiber' | 'Spices';
  currentRateQtl: number; // ₹ per Quintal
  prevRateQtl: number;
  changePct: number;
  minRateQtl: number;
  maxRateQtl: number;
  arrivalsTodayMT: number; // Metric Tonnes
  standardMoistureLimitPct: number;
  avgMoisturePct: number;
  mandiLocation: string;
  tradingVolumeBags: number;
  lastTradeTime: string;
}

export interface OrderBookEntry {
  id: string;
  type: 'bid' | 'ask';
  priceQtl: number;
  quantityQtl: number;
  entityName: string;
  badge: 'APMC Licensee' | 'Corporation' | 'Farmer Producer Co' | 'Miller';
  time: string;
}

export interface HarvestLot {
  id: string;
  plotId: string;
  plotName: string;
  commodityName: string;
  variety: string;
  lotWeightQtl: number;
  moisturePct: number;
  purityPct: number;
  grade: 'Grade-A FAQ' | 'Grade-B' | 'Special Premium';
  reservePriceQtl: number;
  status: 'listed' | 'bidding' | 'contracted';
  currentHighestBidQtl?: number;
  listedAt: string;
}

export interface CommissionAgent {
  id: string;
  name: string;
  shopNo: string;
  mandiYard: string;
  apmcLicense: string;
  phone: string;
  activeCommodities: string[];
  rating: number;
}

export interface SoilHorizon {
  depthCm: number;
  moistureVolumetricPct: number;
  optimalMinPct: number;
  optimalMaxPct: number;
  temperatureC: number;
}

export interface IoTTelemetryStation {
  id: string;
  stationName: string;
  plotId: string;
  batteryPct: number;
  solarIrradianceWm2: number;
  ambientTempC: number;
  canopyTempC: number;
  relativeHumidityPct: number;
  vpdKpa: number; // Vapor pressure deficit
  et0MmDay: number; // Reference evapotranspiration
  windSpeedKmh: number;
  windDirectionDeg: number;
  soilPh: number;
  soilEcDsM: number; // Electrical conductivity
  horizons: SoilHorizon[];
  irrigationRecommendation: {
    status: 'OPTIMAL' | 'IRRIGATION_RECOMMENDED' | 'WATERLOGGED';
    pulseMinutes: number;
    recommendedWindow: string;
    waterVolumeLiters: number;
  };
  lastPing: string;
}

export interface CadastralCertificate {
  id: string;
  certificateNo: string;
  issueDate: string;
  plotId: string;
  khasraNo: string;
  surveyNo: string;
  farmerName: string;
  state: string;
  district: string;
  tehsil: string;
  village: string;
  areaAcres: number;
  areaHectares: number;
  areaBigha: number;
  perimeterMeters: number;
  verifiedBy: string;
  licenseNumber: string;
  digitalSealHash: string;
  vertices: {
    point: string;
    lat: string;
    lng: string;
    utmEast: string;
    utmNorth: string;
    elevation: string;
  }[];
}

export type RainIntensity = 'none' | 'drizzle' | 'moderate' | 'heavy' | 'storm';

export interface HourlyRainPrediction {
  timeStr: string;
  hourNum: number;
  tempC: number;
  feelsLikeC: number;
  rainProbabilityPct: number;
  expectedRainfallMm: number;
  intensity: RainIntensity;
  cloudCoverPct: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirection: string;
  pressureHpa: number;
  dewPointC: number;
  radarReflectivityDbz: number;
}

export interface DailyWeatherPrediction {
  dateStr: string;
  dayLabel: string;
  dayLabelKn: string;
  minTempC: number;
  maxTempC: number;
  overallCondition: string;
  overallConditionKn: string;
  totalRainExpectedMm: number;
  peakRainProbabilityPct: number;
  rainWindow: string;
  rainWindowKn: string;
  sprayAdvisory: 'safe' | 'warning' | 'prohibited';
  irrigationAction: 'run_normally' | 'reduce_volume' | 'suspend';
  hourly: HourlyRainPrediction[];
}

