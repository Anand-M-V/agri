import React, { useState } from 'react';
import { IoTTelemetryStation, FarmPlot } from '../types';
import { 
  Droplets, Sun, Wind, Gauge, CheckCircle2, Zap
} from 'lucide-react';
import probeStationImg from '../assets/images/field_station_sensor_probe_1791364318269.jpg';
import { useLanguage } from '../context/LanguageContext';

interface AgronomicStationProps {
  station: IoTTelemetryStation;
  plots: FarmPlot[];
  onTriggerIrrigationSimulation: () => void;
  isIrrigating: boolean;
}

export const AgronomicStation: React.FC<AgronomicStationProps> = ({
  station,
  onTriggerIrrigationSimulation,
  isIrrigating,
}) => {
  const { t } = useLanguage();
  const [selectedDepth, setSelectedDepth] = useState<number>(10);
  const activeHorizon = station.horizons.find((h) => h.depthCm === selectedDepth) || station.horizons[0];

  const timeSeries = [
    { hour: '00:00', moisture: 30.2, vpd: 0.65, temp: 21.2 },
    { hour: '03:00', moisture: 29.8, vpd: 0.58, temp: 19.8 },
    { hour: '06:00', moisture: 29.4, vpd: 0.72, temp: 22.4 },
    { hour: '09:00', moisture: 29.0, vpd: 0.98, temp: 27.5 },
    { hour: '12:00', moisture: 28.5, vpd: 1.25, temp: 32.1 },
    { hour: '15:00', moisture: 28.4, vpd: 1.15, temp: 31.4 },
    { hour: '18:00', moisture: 31.0, vpd: 0.85, temp: 28.0 },
    { hour: '21:00', moisture: 30.8, vpd: 0.74, temp: 24.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header & Station Overview */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span>{t.agronomy.badge}</span>
              <span className="text-[#899389]">·</span>
              <span className="text-[#bfc9be]">4G LTE-M / LoRaWAN Relay</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#dae2fd] mt-1 tracking-tight">
              {t.agronomy.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#bfc9be] font-mono mt-0.5">
              {t.agronomy.assignedPlot}
            </p>
          </div>

          {/* Quick Irrigation Cycle Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerIrrigationSimulation}
              disabled={isIrrigating}
              className={`h-11 px-5 rounded-lg font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all shadow-md ${
                isIrrigating
                  ? 'bg-[#1e6b3d] text-[#dae2fd] border-[#22c55e] animate-pulse'
                  : 'bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] border-[#22c55e]/40 active:scale-95'
              }`}
            >
              <Droplets className="w-4 h-4 text-[#8bd79f]" />
              <span>
                {isIrrigating ? t.actions.dripInProgress : t.actions.triggerDrip}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: 3 Telemetry Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pillar 1: Field Microclimate Sensors */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <span className="text-xs font-mono font-semibold text-[#8bd79f] uppercase tracking-wider">
                {t.agronomy.microclimateTitle}
              </span>
              <Sun className="w-4 h-4 text-[#ffb77d]" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 font-mono">
              {/* Solar Irradiance */}
              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[10px] text-[#899389] uppercase">{t.agronomy.solarIrradiance}</div>
                <div className="text-xl font-bold text-[#dae2fd] mt-0.5 tabular-nums">
                  {station.solarIrradianceWm2} <span className="text-xs text-[#899389]">W/m²</span>
                </div>
                <div className="text-[10px] text-[#ffb77d] mt-1">Direct Sun</div>
              </div>

              {/* Vapor Pressure Deficit */}
              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[10px] text-[#899389] uppercase">{t.agronomy.vpdDeficit}</div>
                <div className="text-xl font-bold text-[#8bd79f] mt-0.5 tabular-nums">
                  {station.vpdKpa.toFixed(2)} <span className="text-xs text-[#899389]">kPa</span>
                </div>
                <div className="text-[10px] text-[#22c55e] mt-1">Optimal</div>
              </div>

              {/* Ambient vs Canopy Temp Differential */}
              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[10px] text-[#899389] uppercase">{t.agronomy.canopyTemp}</div>
                <div className="text-xl font-bold text-[#dae2fd] mt-0.5 tabular-nums">
                  {station.canopyTempC.toFixed(1)}°C
                </div>
                <div className="text-[10px] text-[#8bd79f] mt-1">
                  -3.6°C vs Ambient ({station.ambientTempC}°C)
                </div>
              </div>

              {/* Evapotranspiration */}
              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[10px] text-[#899389] uppercase">{t.agronomy.referenceEt}</div>
                <div className="text-xl font-bold text-[#dae2fd] mt-0.5 tabular-nums">
                  {station.et0MmDay.toFixed(2)} <span className="text-xs text-[#899389]">mm/day</span>
                </div>
                <div className="text-[10px] text-[#bfc9be] mt-1">Penman-Monteith</div>
              </div>
            </div>

            {/* Wind and Humidity */}
            <div className="mt-3 p-3 bg-[#131b2e] rounded-lg border border-[#222a3d] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-[#bfc9be]">
                <Wind className="w-4 h-4 text-[#899389]" />
                <span>{t.agronomy.wind}: {station.windSpeedKmh} km/h (WSW)</span>
              </div>
              <div className="text-[#dae2fd]">
                {t.agronomy.rh}: <span className="font-bold">{station.relativeHumidityPct}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222a3d] text-[11px] font-mono text-[#899389] flex items-center justify-between">
            <span>Barometric Pressure: 1013.2 hPa</span>
            <span className="text-[#8bd79f]">Calibrated</span>
          </div>
        </div>

        {/* Pillar 2: Multi-Depth Soil Horizons Profile */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <span className="text-xs font-mono font-semibold text-[#8bd79f] uppercase tracking-wider">
                {t.agronomy.soilStrataTitle}
              </span>
              <Droplets className="w-4 h-4 text-[#22c55e]" />
            </div>

            {/* Depth Selector Tabs */}
            <div className="flex items-center gap-2 mt-4 p-1 bg-[#131b2e] rounded-lg border border-[#222a3d]">
              {station.horizons.map((h) => (
                <button
                  key={h.depthCm}
                  onClick={() => setSelectedDepth(h.depthCm)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                    selectedDepth === h.depthCm
                      ? 'bg-[#1e6b3d] text-[#dae2fd] font-semibold shadow-sm'
                      : 'text-[#bfc9be] hover:text-[#dae2fd]'
                  }`}
                >
                  {h.depthCm} cm {t.agronomy.depthSelector}
                </button>
              ))}
            </div>

            {/* Selected Horizon Metrics */}
            <div className="mt-4 p-4 bg-[#131b2e] rounded-xl border border-[#222a3d] font-mono">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#899389]">{t.agronomy.volumetricMoisture}</span>
                <span className="text-2xl font-bold text-[#8bd79f] tabular-nums">
                  {activeHorizon.moistureVolumetricPct.toFixed(1)}%
                </span>
              </div>

              {/* Progress bar with optimal zone markers */}
              <div className="mt-3 relative w-full h-3 bg-[#0b1326] rounded-full overflow-hidden border border-[#222a3d]">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] to-[#8bd79f] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, activeHorizon.moistureVolumetricPct * 2)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-[#899389]">
                <span>Wilting: 14%</span>
                <span className="text-[#8bd79f]">Optimal: {activeHorizon.optimalMinPct}% - {activeHorizon.optimalMaxPct}%</span>
                <span>Field Cap: 45%</span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222a3d] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#899389] uppercase">Temp:</span>
                  <div className="text-sm font-semibold text-[#dae2fd] mt-0.5">
                    {activeHorizon.temperatureC.toFixed(1)}°C
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#899389] uppercase">Root Zone:</span>
                  <div className="text-sm font-semibold text-[#8bd79f] mt-0.5">
                    High Vigor
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Chemistry: pH & Electrical Conductivity */}
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <span className="text-[10px] text-[#899389]">{t.agronomy.soilPh}</span>
                <div className="text-base font-bold text-[#dae2fd] mt-0.5">
                  {station.soilPh.toFixed(2)} <span className="text-[10px] text-[#8bd79f]">(Loam)</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <span className="text-[10px] text-[#899389]">{t.agronomy.soilEc}</span>
                <div className="text-base font-bold text-[#dae2fd] mt-0.5">
                  {station.soilEcDsM.toFixed(2)} <span className="text-[10px] text-[#8bd79f]">dS/m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222a3d] text-[11px] font-mono text-[#899389]">
            Sensor: TDT Dielectric Moisture Probe
          </div>
        </div>

        {/* Pillar 3: Irrigation Automation Decision Engine */}
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <span className="text-xs font-mono font-semibold text-[#ffb77d] uppercase tracking-wider">
                {t.agronomy.advisoryTitle}
              </span>
              <Gauge className="w-4 h-4 text-[#ffb77d]" />
            </div>

            <div className="mt-4 p-4 bg-[#131b2e] rounded-xl border border-[#222a3d]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                <div>
                  <h4 className="font-display text-sm font-bold text-[#dae2fd]">
                    {t.agronomy.optimalMoisture}
                  </h4>
                  <p className="text-xs text-[#899389] font-mono">
                    Soil water retention is currently in target envelope.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#bfc9be]">
                  <span>{t.agronomy.nextRecommended}</span>
                  <span className="text-[#dae2fd] font-semibold">
                    {station.irrigationRecommendation.recommendedWindow}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#bfc9be]">
                  <span>{t.agronomy.recommendedPulse}</span>
                  <span className="text-[#8bd79f] font-semibold">
                    {station.irrigationRecommendation.pulseMinutes} Minutes
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#bfc9be]">
                  <span>{t.agronomy.waterVolume}</span>
                  <span className="text-[#dae2fd] font-semibold">
                    {station.irrigationRecommendation.waterVolumeLiters.toLocaleString()} L
                  </span>
                </div>
              </div>
            </div>

            {/* Probe Station Image Card */}
            <div className="mt-4 rounded-lg overflow-hidden border border-[#222a3d] relative">
              <img
                src={probeStationImg}
                alt="IoT soil telemetry probe and field station"
                className="w-full h-32 object-cover object-center"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-[#0b1326]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#222a3d] text-[10px] font-mono text-[#dae2fd] flex items-center justify-between">
                <span>Node: RTK-0194</span>
                <span className="text-[#8bd79f]">Solar Active 18.4V</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222a3d]">
            <button
              onClick={onTriggerIrrigationSimulation}
              disabled={isIrrigating}
              className="w-full h-10 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs font-semibold flex items-center justify-center gap-2 border border-[#22c55e]/30 shadow transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#8bd79f]" />
              <span>
                {isIrrigating ? t.actions.dripInProgress : t.actions.triggerDrip}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 24-Hour Time Series Telemetry Ribbon Graph */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-[#dae2fd]">
              {t.agronomy.diurnalTitle}
            </h3>
            <p className="text-xs text-[#bfc9be] font-mono">
              Continuous empirical logging via RTK Telemetry Bus
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#8bd79f]">
              <span className="w-3 h-0.5 bg-[#22c55e]"></span>
              Moisture % (10cm)
            </span>
            <span className="flex items-center gap-1.5 text-[#ffb77d]">
              <span className="w-3 h-0.5 bg-[#f59e0b]"></span>
              VPD (kPa)
            </span>
          </div>
        </div>

        {/* Crisp SVG Telemetry Line Chart */}
        <div className="w-full h-44 relative bg-[#131b2e] rounded-lg border border-[#222a3d] p-3 flex items-end">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 120">
            <line x1="0" y1="30" x2="700" y2="30" stroke="#222a3d" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="700" y2="60" stroke="#222a3d" strokeDasharray="3 3" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="#222a3d" strokeDasharray="3 3" />

            {/* Moisture Line (Emerald) */}
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              points="0,45 100,50 200,54 300,58 400,64 500,65 600,38 700,40"
            />
            {/* VPD Line (Amber) */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 2"
              points="0,85 100,92 200,80 300,60 400,35 500,42 600,70 700,80"
            />

            {[
              { x: 0, y: 45 }, { x: 100, y: 50 }, { x: 200, y: 54 },
              { x: 300, y: 58 }, { x: 400, y: 64 }, { x: 500, y: 65 },
              { x: 600, y: 38 }, { x: 700, y: 40 }
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#8bd79f" stroke="#0b1326" strokeWidth="1.5" />
            ))}
          </svg>
        </div>

        {/* X-Axis Hour Labels */}
        <div className="flex justify-between mt-2 font-mono text-[10px] text-[#899389] px-1">
          {timeSeries.map((tItem, idx) => (
            <span key={idx}>{tItem.hour}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
