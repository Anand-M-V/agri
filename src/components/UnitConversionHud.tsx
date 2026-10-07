import React from 'react';
import { LandUnit } from '../types';
import { formatArea, getUnitLabel } from '../utils/geoMath';
import { Ruler, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface UnitConversionHudProps {
  areaSqMeters: number;
  perimeterMeters: number;
  selectedUnit: LandUnit;
  onSelectUnit: (unit: LandUnit) => void;
  plotLabel?: string;
  khasraNo?: string;
}

export const UnitConversionHud: React.FC<UnitConversionHudProps> = ({
  areaSqMeters,
  perimeterMeters,
  selectedUnit,
  onSelectUnit,
  plotLabel,
  khasraNo,
}) => {
  const { language, t } = useLanguage();

  const units: LandUnit[] = [
    'acres',
    'guntha', // Primary in Karnataka
    'hectares',
    'bigha',
    'biswa',
    'cent',
    'sq_meters',
    'sq_yards',
  ];

  const perimeterFeet = perimeterMeters * 3.28084;
  const currentUnitMeta = getUnitLabel(selectedUnit, language);

  return (
    <div className="w-full bg-[#171f33] border border-[#222a3d] rounded-xl p-3 sm:p-4 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Active Parcel Identification & Primary Prominent Telemetry Display */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-2.5 rounded-lg bg-[#1e6b3d]/30 border border-[#22c55e]/30 shrink-0">
            <Layers className="w-5 h-5 text-[#22c55e]" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-[#bfc9be]">
              <span className="font-medium text-[#dae2fd]">
                {plotLabel || t.units.activePolygon}
              </span>
              {khasraNo && (
                <>
                  <span className="text-[#899389]">·</span>
                  <span className="font-mono text-[#ffb77d]">{t.cadastral.khasra} {khasraNo}</span>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#dae2fd] tabular-nums">
                {formatArea(areaSqMeters, selectedUnit)}
              </span>
              <span className="font-mono text-sm font-semibold text-[#8bd79f] uppercase">
                {currentUnitMeta.name}
              </span>
              <span className="text-xs text-[#899389] hidden sm:inline">
                ({currentUnitMeta.region})
              </span>
            </div>
          </div>

          {/* Perimeter readout */}
          <div className="border-l border-[#222a3d] pl-4 ml-2 hidden sm:block">
            <div className="flex items-center gap-1.5 text-xs text-[#bfc9be]">
              <Ruler className="w-3.5 h-3.5 text-[#ffb77d]" />
              <span>{t.units.boundaryPerimeter}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-mono text-lg font-semibold text-[#dae2fd] tabular-nums">
                {perimeterMeters.toFixed(1)}
              </span>
              <span className="font-mono text-xs text-[#899389]">m</span>
              <span className="text-xs text-[#899389] font-mono">
                ({Math.round(perimeterFeet)} ft)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Simultaneous Multi-Unit Regional Equivalents Bar */}
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-mono text-[#899389] flex items-center justify-between">
            <span>{t.units.simultaneousConversions}</span>
            <span className="text-[#bfc9be]">{t.units.clickToSetPrimary}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {units.map((u) => {
              const isSelected = selectedUnit === u;
              const valueFormatted = formatArea(areaSqMeters, u);
              const uMeta = getUnitLabel(u, language);
              return (
                <button
                  key={u}
                  onClick={() => onSelectUnit(u)}
                  className={`px-2.5 py-1.5 rounded-md font-mono text-xs transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#1e6b3d] border-[#22c55e] text-[#dae2fd] font-semibold shadow-sm'
                      : 'bg-[#131b2e] border-[#222a3d] text-[#bfc9be] hover:text-[#dae2fd] hover:border-[#404941]'
                  }`}
                  title={`${uMeta.name} (${uMeta.region})`}
                >
                  <span className="tabular-nums">{valueFormatted}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-[#9ce9af]' : 'text-[#899389]'}`}>
                    {uMeta.symbol}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
