import React, { useState, useEffect } from 'react';
import { 
  DailyWeatherPrediction, HourlyRainPrediction, FarmPlot 
} from '../types';
import { WEATHER_PREDICTIONS } from '../data/mockData';
import { 
  CloudRain, CloudSun, CloudDrizzle, Sun, CloudLightning, 
  Wind, Droplets, Gauge, AlertTriangle, ShieldCheck, 
  Play, Square, Compass, Clock, Calendar, CheckCircle2, 
  Ban, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RainWeatherReportProps {
  plots: FarmPlot[];
  selectedPlot: FarmPlot | null;
}

export const RainWeatherReport: React.FC<RainWeatherReportProps> = ({
  selectedPlot,
}) => {
  const { language, t } = useLanguage();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const activeDay = WEATHER_PREDICTIONS[selectedDateIndex] || WEATHER_PREDICTIONS[0];

  const [selectedHourIndex, setSelectedHourIndex] = useState(5); // Default to peak rain hour (16:00)
  const activeHour: HourlyRainPrediction = activeDay.hourly[selectedHourIndex] || activeDay.hourly[0];

  const [isRadarPlaying, setIsRadarPlaying] = useState(false);

  // Time-lapse loop through hours
  useEffect(() => {
    if (!isRadarPlaying) return;
    const interval = setInterval(() => {
      setSelectedHourIndex((prev) => (prev + 1) % activeDay.hourly.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isRadarPlaying, activeDay.hourly.length]);

  // When day changes, keep hour index in bounds
  const handleSelectDay = (index: number) => {
    setSelectedDateIndex(index);
    if (selectedHourIndex >= WEATHER_PREDICTIONS[index].hourly.length) {
      setSelectedHourIndex(0);
    }
  };

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'storm':
        return {
          label: t.weather.intensities.storm,
          bg: 'bg-[#93000a]/40 text-[#ffb4ab] border-[#ffb4ab]/30',
          icon: <CloudLightning className="w-3.5 h-3.5 text-[#ffb4ab]" />,
        };
      case 'heavy':
        return {
          label: t.weather.intensities.heavy,
          bg: 'bg-[#131b2e] text-[#8bd79f] border-[#22c55e]/40',
          icon: <CloudRain className="w-3.5 h-3.5 text-[#22c55e]" />,
        };
      case 'moderate':
        return {
          label: t.weather.intensities.moderate,
          bg: 'bg-[#171f33] text-[#dae2fd] border-[#ffb77d]/40',
          icon: <CloudRain className="w-3.5 h-3.5 text-[#ffb77d]" />,
        };
      case 'drizzle':
        return {
          label: t.weather.intensities.drizzle,
          bg: 'bg-[#131b2e] text-[#bfc9be] border-[#404941]',
          icon: <CloudDrizzle className="w-3.5 h-3.5 text-[#bfc9be]" />,
        };
      default:
        return {
          label: t.weather.intensities.none,
          bg: 'bg-[#131b2e] text-[#899389] border-[#222a3d]',
          icon: <Sun className="w-3.5 h-3.5 text-[#ffb77d]" />,
        };
    }
  };

  const activeBadge = getIntensityBadge(activeHour.intensity);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
              <CloudRain className="w-4 h-4 text-[#22c55e]" />
              <span>{t.weather.badge}</span>
              <span className="text-[#899389]">·</span>
              <span className="text-[#bfc9be]">High-Resolution Micro-Telemetry</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#dae2fd] mt-1 tracking-tight">
              {t.weather.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#bfc9be] mt-0.5">
              {t.weather.subtitle}
            </p>
          </div>

          {/* Quick Target Parcel */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] text-xs font-mono">
            <span className="text-[#899389]">Target Parcel:</span>
            <span className="text-[#8bd79f] font-semibold">
              {selectedPlot ? selectedPlot.name : 'North Khasra 142/2'}
            </span>
          </div>
        </div>

        {/* 5-Day Forecast Date Selector Cards */}
        <div className="mt-5 pt-4 border-t border-[#222a3d]">
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-[#899389]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#ffb77d]" />
              {t.weather.selectDate}
            </span>
            <span className="text-[#bfc9be]">Click day to inspect hourly rain timeline</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {WEATHER_PREDICTIONS.map((day, idx) => {
              const isSelected = selectedDateIndex === idx;
              const hasRain = day.totalRainExpectedMm > 0;
              const dayTitle = language === 'kn' ? day.dayLabelKn : day.dayLabel;

              return (
                <button
                  key={day.dateStr}
                  onClick={() => handleSelectDay(idx)}
                  className={`p-3 rounded-xl border text-left transition-all font-mono flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1e6b3d]/30 border-[#22c55e] shadow-md ring-1 ring-[#22c55e]'
                      : 'bg-[#131b2e] border-[#222a3d] hover:border-[#404941] hover:bg-[#171f33]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#dae2fd]">{dayTitle}</span>
                    {hasRain ? (
                      <CloudRain className="w-4 h-4 text-[#22c55e]" />
                    ) : (
                      <Sun className="w-4 h-4 text-[#ffb77d]" />
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-[11px] text-[#bfc9be] truncate">
                      {language === 'kn' ? day.overallConditionKn : day.overallCondition}
                    </div>

                    <div className="mt-1 flex items-baseline justify-between text-xs">
                      <span className="text-[#dae2fd] font-semibold tabular-nums">
                        {day.maxTempC}° / {day.minTempC}°
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          day.peakRainProbabilityPct >= 50
                            ? 'text-[#22c55e]'
                            : day.peakRainProbabilityPct > 0
                            ? 'text-[#ffb77d]'
                            : 'text-[#899389]'
                        }`}
                      >
                        {day.peakRainProbabilityPct}% PoP
                      </span>
                    </div>

                    <div className="mt-1 text-[10px] text-[#899389] flex justify-between">
                      <span>Total:</span>
                      <span className="text-[#dae2fd] font-bold">
                        {day.totalRainExpectedMm.toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Hour-by-Hour Timeline & Doppler Radar Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Hour-by-Hour Precipitation Scrubber & Volume Chart */}
        <div className="lg:col-span-7 bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#222a3d]">
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#dae2fd]">
                  {t.weather.timelineTitle}
                </h3>
                <p className="text-xs text-[#bfc9be] font-mono">
                  {language === 'kn' ? activeDay.dayLabelKn : activeDay.dayLabel} · {language === 'kn' ? activeDay.overallConditionKn : activeDay.overallCondition}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#ffb77d] px-2 py-0.5 rounded bg-[#131b2e] border border-[#222a3d]">
                  {t.weather.peakWindow}: {language === 'kn' ? activeDay.rainWindowKn : activeDay.rainWindow}
                </span>
              </div>
            </div>

            {/* Hourly Stepper Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#899389] mb-2">
                <span>{t.weather.selectTime}</span>
                <span className="text-[#8bd79f]">
                  Active: {activeHour.timeStr} IST ({activeHour.rainProbabilityPct}% Probability)
                </span>
              </div>

              {/* Hourly Tiles Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
                {activeDay.hourly.map((h, i) => {
                  const isSelectedHour = selectedHourIndex === i;
                  const isHighRain = h.rainProbabilityPct >= 50;
                  return (
                    <button
                      key={h.timeStr}
                      onClick={() => setSelectedHourIndex(i)}
                      className={`p-2 rounded-lg border text-center font-mono transition-all flex flex-col items-center justify-between ${
                        isSelectedHour
                          ? 'bg-[#1e6b3d] border-[#22c55e] text-[#dae2fd] shadow-md ring-1 ring-[#22c55e]'
                          : 'bg-[#131b2e] border-[#222a3d] text-[#bfc9be] hover:border-[#404941] hover:text-[#dae2fd]'
                      }`}
                    >
                      <span className="text-[10px] text-[#899389]">{h.timeStr}</span>

                      {/* Small Rain Height Bar */}
                      <div className="w-full h-8 my-1 flex items-end justify-center">
                        <div
                          className={`w-3 rounded-t transition-all ${
                            isHighRain
                              ? 'bg-[#22c55e]'
                              : h.rainProbabilityPct > 0
                              ? 'bg-[#ffb77d]'
                              : 'bg-[#222a3d]'
                          }`}
                          style={{ height: `${Math.max(4, (h.rainProbabilityPct / 100) * 32)}px` }}
                        />
                      </div>

                      <span className={`text-[11px] font-bold ${isHighRain ? 'text-[#8bd79f]' : 'text-[#dae2fd]'}`}>
                        {h.rainProbabilityPct}%
                      </span>
                      <span className="text-[9px] text-[#899389]">
                        {h.expectedRainfallMm.toFixed(1)}mm
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Telemetry Callout for Selected Hour */}
            <div className="mt-5 p-4 bg-[#131b2e] rounded-xl border border-[#222a3d] font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222a3d]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#0b1326] border border-[#222a3d]">
                    <Clock className="w-5 h-5 text-[#8bd79f]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#899389]">
                      SELECTED FORECAST HOUR: {activeHour.timeStr} IST
                    </div>
                    <div className="text-base font-bold text-[#dae2fd] mt-0.5">
                      {activeHour.tempC}°C (Feels like {activeHour.feelsLikeC}°C)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 ${activeBadge.bg}`}>
                    {activeBadge.icon}
                    <span>{activeBadge.label}</span>
                  </span>
                </div>
              </div>

              {/* 4 Telemetry Metrics */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 bg-[#0b1326] rounded-lg border border-[#222a3d]">
                  <span className="text-[10px] text-[#899389] uppercase">{t.weather.rainProbability}</span>
                  <div className="text-lg font-bold text-[#22c55e] mt-0.5 tabular-nums">
                    {activeHour.rainProbabilityPct}%
                  </div>
                </div>

                <div className="p-2.5 bg-[#0b1326] rounded-lg border border-[#222a3d]">
                  <span className="text-[10px] text-[#899389] uppercase">{t.weather.expectedRainfall}</span>
                  <div className="text-lg font-bold text-[#dae2fd] mt-0.5 tabular-nums">
                    {activeHour.expectedRainfallMm.toFixed(1)} <span className="text-xs text-[#899389]">mm/h</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0b1326] rounded-lg border border-[#222a3d]">
                  <span className="text-[10px] text-[#899389] uppercase">{t.weather.cloudCover}</span>
                  <div className="text-lg font-bold text-[#ffb77d] mt-0.5 tabular-nums">
                    {activeHour.cloudCoverPct}%
                  </div>
                </div>

                <div className="p-2.5 bg-[#0b1326] rounded-lg border border-[#222a3d]">
                  <span className="text-[10px] text-[#899389] uppercase">Wind Vector</span>
                  <div className="text-sm font-bold text-[#dae2fd] mt-1 truncate">
                    {activeHour.windSpeedKmh} km/h {activeHour.windDirection}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#222a3d] flex flex-wrap items-center justify-between text-[11px] text-[#899389]">
                <span>{t.weather.pressure}: {activeHour.pressureHpa.toFixed(1)} hPa</span>
                <span>{t.weather.dewPoint}: {activeHour.dewPointC.toFixed(1)}°C</span>
                <span>Relative Humidity: {activeHour.humidityPct}%</span>
              </div>
            </div>
          </div>

          {/* Precipitation Volume Curve SVG Graph */}
          <div className="mt-4 pt-3 border-t border-[#222a3d]">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#899389]">HOURLY PRECIPITATION VOLUME (MM):</span>
              <span className="text-[#8bd79f]">Daily Total: {activeDay.totalRainExpectedMm.toFixed(1)} mm</span>
            </div>

            <div className="w-full h-28 bg-[#131b2e] rounded-lg border border-[#222a3d] p-2 flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 900 80">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="900" y2="20" stroke="#222a3d" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="900" y2="50" stroke="#222a3d" strokeDasharray="3 3" />

                {/* Rain Area Bars */}
                {activeDay.hourly.map((h, i) => {
                  const barX = i * 100 + 20;
                  const barH = Math.min(70, h.expectedRainfallMm * 7);
                  const isCur = selectedHourIndex === i;
                  return (
                    <g key={i}>
                      <rect
                        x={barX}
                        y={80 - barH}
                        width="60"
                        height={barH}
                        fill={isCur ? '#22c55e' : h.expectedRainfallMm > 3 ? '#1e6b3d' : '#2d3449'}
                        rx="3"
                        className="transition-all"
                      />
                      {h.expectedRainfallMm > 0 && (
                        <text
                          x={barX + 30}
                          y={Math.max(12, 75 - barH)}
                          fill={isCur ? '#8bd79f' : '#bfc9be'}
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          {h.expectedRainfallMm.toFixed(1)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Doppler Rain Radar & Agronomic Spray Decision */}
        <div className="lg:col-span-5 space-y-5">
          {/* Doppler Rain Radar Simulation Canvas */}
          <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#222a3d]">
              <div>
                <h3 className="font-display text-base font-bold text-[#dae2fd]">
                  {t.weather.radarTitle}
                </h3>
                <p className="text-[11px] text-[#bfc9be] font-mono">
                  {t.weather.radarSubtitle} · {activeHour.timeStr} IST
                </p>
              </div>

              {/* Time-lapse Play / Pause Toggle */}
              <button
                onClick={() => setIsRadarPlaying(!isRadarPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                  isRadarPlaying
                    ? 'bg-[#d97706] text-[#0b1326] border-[#f59e0b]'
                    : 'bg-[#131b2e] hover:bg-[#222a3d] text-[#dae2fd] border-[#222a3d]'
                }`}
              >
                {isRadarPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#22c55e]" />
                    <span>Scan Loop</span>
                  </>
                )}
              </button>
            </div>

            {/* Radar Circular Visualizer Stage */}
            <div className="mt-4 relative w-full h-56 bg-[#060e20] rounded-xl border border-[#222a3d] overflow-hidden flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute inset-0 bg-graticule opacity-40 pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full border border-[#222a3d]/70 pointer-events-none" />
              <div className="absolute w-28 h-28 rounded-full border border-[#222a3d]/50 pointer-events-none" />
              <div className="absolute w-12 h-12 rounded-full border border-[#222a3d]/40 pointer-events-none" />

              {/* Crosshair axes */}
              <div className="absolute w-full h-[1px] bg-[#222a3d]/50 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-[#222a3d]/50 pointer-events-none" />

              {/* Simulated Radar Clouds based on Reflectivity dBZ */}
              {activeHour.radarReflectivityDbz > 10 && (
                <div
                  className="absolute rounded-full filter blur-xl transition-all duration-700 pointer-events-none"
                  style={{
                    width: `${Math.min(200, activeHour.radarReflectivityDbz * 4.2)}px`,
                    height: `${Math.min(200, activeHour.radarReflectivityDbz * 3.8)}px`,
                    backgroundColor:
                      activeHour.radarReflectivityDbz >= 40
                        ? 'rgba(239, 68, 68, 0.45)'
                        : activeHour.radarReflectivityDbz >= 25
                        ? 'rgba(245, 158, 11, 0.45)'
                        : 'rgba(34, 197, 94, 0.35)',
                    transform: `translate(${Math.sin(activeHour.hourNum) * 20}px, ${Math.cos(activeHour.hourNum) * 20}px)`,
                  }}
                />
              )}

              {/* Farmland Center Plot Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-[#0b1326] animate-pulse" />
                <span className="mt-1 px-1.5 py-0.5 rounded bg-[#0b1326]/90 border border-[#222a3d] text-[9px] font-mono text-[#dae2fd]">
                  {selectedPlot ? selectedPlot.khasraNo : 'Khasra 142/2'}
                </span>
              </div>

              {/* Sweep Line Animation */}
              <div
                className="absolute inset-0 origin-center pointer-events-none opacity-40"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34, 197, 94, 0.3) 60deg, transparent 65deg)',
                  animation: 'spin 4s linear infinite',
                }}
              />

              {/* dBZ Reflectivity Callout in Corner */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0b1326]/90 border border-[#222a3d] font-mono text-[10px] text-[#bfc9be]">
                REFLECTIVITY: <span className="text-[#8bd79f] font-bold">{activeHour.radarReflectivityDbz} dBZ</span>
              </div>

              {/* Color legend on bottom right */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#0b1326]/90 border border-[#222a3d] font-mono text-[9px] text-[#899389] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span> 15-25 (Light)
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span> 30-40 (Mod)
                <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span> 45+ (Heavy)
              </div>
            </div>
          </div>

          {/* Agronomic Decision & Action Matrix */}
          <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#222a3d]">
              <span className="font-bold text-[#dae2fd] font-display text-sm">
                Agronomic Field Weather Advisory
              </span>
              <ShieldCheck className="w-4 h-4 text-[#8bd79f]" />
            </div>

            {/* Spray Advisory Card */}
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#222a3d]">
              <div className="text-[10px] text-[#899389] uppercase">{t.weather.sprayAdvisory}:</div>
              {activeDay.sprayAdvisory === 'prohibited' ? (
                <div className="mt-1 flex items-start gap-2 text-[#ffb4ab]">
                  <Ban className="w-4 h-4 text-[#ffb4ab] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.weather.sprayProhibited}</span>
                    <p className="text-[11px] text-[#899389] mt-0.5">
                      {language === 'kn'
                        ? 'ಸಂಜೆ ಭಾರಿ ಮಳೆಯಾಗುವುದರಿಂದ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ. ರಾಸಾಯನಿಕ ತೊಳೆದುಹೋಗಿ ಅಪವ್ಯಯವಾಗುತ್ತದೆ.'
                        : 'Rain volume (>18mm) will wash foliar sprays off leaves within 3 hours. Postpone to Friday (09 Oct).'}
                    </p>
                  </div>
                </div>
              ) : activeDay.sprayAdvisory === 'warning' ? (
                <div className="mt-1 flex items-start gap-2 text-[#ffb77d]">
                  <AlertTriangle className="w-4 h-4 text-[#ffb77d] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.weather.sprayWarning}</span>
                    <p className="text-[11px] text-[#899389] mt-0.5">
                      {language === 'kn'
                        ? 'ಮುಂಜಾನೆ ಲಘು ತುಂತುರು ಮಳೆ ಸಾಧ್ಯತೆಯಿದೆ. ಮಧ್ಯಾಹ್ನ ನಂತರ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.'
                        : 'Morning drizzle predicted. Safe after 12:00 PM once canopy dries.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-start gap-2 text-[#8bd79f]">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.weather.spraySafe}</span>
                    <p className="text-[11px] text-[#899389] mt-0.5">
                      {language === 'kn'
                        ? 'ಸ್ಪಷ್ಟ ಬಿಸಿಲು ಮತ್ತು ಶೂನ್ಯ ಮಳೆ. ಕೀಟನಾಶಕ ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಸಿಂಪಡಣೆಗೆ ಅತ್ಯುತ್ತಮ ದಿನ.'
                        : 'Dry sunny canopy. Optimal penetration and zero wash risk.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Irrigation Override Card */}
            <div className="p-3 bg-[#131b2e] rounded-xl border border-[#222a3d]">
              <div className="text-[10px] text-[#899389] uppercase">{t.weather.irrigationAdvisory}:</div>
              {activeDay.irrigationAction === 'suspend' ? (
                <div className="mt-1 flex items-start gap-2 text-[#ffb77d]">
                  <Droplets className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.weather.irrigationSuspend}</span>
                    <p className="text-[11px] text-[#899389] mt-0.5">
                      {language === 'kn'
                        ? 'ಮಳೆಯಿಂದ ಮಣ್ಣಿನ ತೇವಾಂಶ ಭರ್ತಿಯಾಗಲಿದೆ. ಹೆಚ್ಚುವರಿ ನೀರು ನಿಲ್ಲದಂತೆ ಪಂಪ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ.'
                        : 'Incoming rainfall (18.6mm) provides 140% of ET₀ water requirement. Pump paused to avoid waterlogging.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-start gap-2 text-[#8bd79f]">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.weather.irrigationNormal}</span>
                    <p className="text-[11px] text-[#899389] mt-0.5">
                      {language === 'kn'
                        ? 'ಮಳೆಯಿಲ್ಲದ ಕಾರಣ ನಿಗದಿತ ಹನಿ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಮುಂದುವರಿಸಿ.'
                        : 'Normal drip irrigation cycle recommended at scheduled hours.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
