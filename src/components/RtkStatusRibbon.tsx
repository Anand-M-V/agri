import React from 'react';
import { Satellite, BatteryCharging, Compass, Navigation, SignalHigh, Crosshair } from 'lucide-react';
import { formatDms } from '../utils/geoMath';
import { useLanguage } from '../context/LanguageContext';

interface RtkStatusRibbonProps {
  currentLat: number;
  currentLng: number;
  currentElevation: number;
  satellitesCount: number;
  pdop: number;
  accuracyM: number;
  isSimulatingWalk?: boolean;
}

export const RtkStatusRibbon: React.FC<RtkStatusRibbonProps> = ({
  currentLat,
  currentLng,
  currentElevation,
  satellitesCount,
  pdop,
  accuracyM,
  isSimulatingWalk,
}) => {
  const { t } = useLanguage();

  // UTM conversion approximation for Zone 43N
  const utmEasting = Math.round(487214 + (currentLng - 74.874) * 100000);
  const utmNorthing = Math.round(2706532 + (currentLat - 24.471) * 111000);

  return (
    <div className="w-full bg-[#131b2e] border-b border-[#222a3d] px-4 py-2 font-mono text-xs text-[#bfc9be]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Constellation & Carrier Lock */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#8bd79f]">
            <Satellite className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="font-semibold">{satellitesCount}</span>
            <span className="text-[#899389] text-[10px] hidden sm:inline">
              {t.rtk.satellites}
            </span>
          </div>

          <span className="text-[#404941]">|</span>

          <div className="flex items-center gap-1.5">
            <SignalHigh className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="text-[#dae2fd]">PDOP {pdop.toFixed(2)}</span>
            <span className="text-[#899389] text-[10px]">L1/L2/L5</span>
          </div>

          <span className="text-[#404941] hidden md:inline">|</span>

          <div className="hidden md:flex items-center gap-1 text-[#8bd79f]">
            <Crosshair className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>{t.rtk.accuracyH}</span>
            <span className="text-[#899389]">· {t.rtk.accuracyV}</span>
          </div>
        </div>

        {/* Live Coordinate Feed: WGS84 + UTM Zone 43N */}
        <div className="flex items-center gap-3 tabular-nums">
          <div className="flex items-center gap-1.5 text-[#dae2fd]">
            <Compass className="w-3.5 h-3.5 text-[#ffb77d]" />
            <span className="font-medium tracking-tight">
              {formatDms(currentLat, true)} {formatDms(currentLng, false)}
            </span>
          </div>

          <span className="text-[#404941] hidden lg:inline">|</span>

          <div className="hidden lg:flex items-center gap-2 text-[#899389]">
            <span>{t.rtk.utmZone}:</span>
            <span className="text-[#dae2fd]">E {utmEasting.toLocaleString()}</span>
            <span className="text-[#dae2fd]">N {utmNorthing.toLocaleString()}</span>
            <span className="text-[#8bd79f]">
              {currentElevation.toFixed(1)} {t.rtk.msl}
            </span>
          </div>
        </div>

        {/* Base Station Baseline & Hardware Power */}
        <div className="flex items-center gap-3">
          {isSimulatingWalk && (
            <div className="flex items-center gap-1.5 text-[#22c55e] animate-pulse">
              <Navigation className="w-3 h-3" />
              <span className="text-[11px] font-semibold">{t.rtk.cadenceTracking}</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1 text-[#899389] text-[11px]">
            <span>{t.rtk.corsBase}</span>
          </div>

          <span className="text-[#404941] hidden sm:inline">|</span>

          <div className="flex items-center gap-1 text-[#8bd79f]">
            <BatteryCharging className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>94%</span>
            <span className="text-[#899389] text-[10px] hidden sm:inline">{t.rtk.battery}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
