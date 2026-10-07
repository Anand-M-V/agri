import React, { useState, useRef, useEffect } from 'react';
import { FarmPlot, PlotVertex, LandUnit } from '../types';
import { calculatePerimeterMeters, calculateGeodesicAreaSqM, haversineDistanceM, formatArea } from '../utils/geoMath';
import { 
  ZoomIn, ZoomOut, RotateCcw, Play, Square, Plus, 
  Trash2, Undo, Check, Compass
} from 'lucide-react';
import aerialSatelliteImg from '../assets/images/aerial_satellite_farmland_1791364306114.jpg';
import { useLanguage } from '../context/LanguageContext';

interface GisMapCanvasProps {
  plots: FarmPlot[];
  selectedPlot: FarmPlot | null;
  onSelectPlot: (plot: FarmPlot | null) => void;
  activeUnit: LandUnit;
  isSurveyMode: boolean;
  setIsSurveyMode: (v: boolean) => void;
  onSaveNewPlot: (vertices: PlotVertex[], areaSqM: number, perimeterM: number) => void;
  currentRtkPos: { lat: number; lng: number; elevationM: number };
  onUpdateRtkPos: (pos: { lat: number; lng: number; elevationM: number }) => void;
  isSimulatingWalk: boolean;
  setIsSimulatingWalk: (v: boolean) => void;
  activeLayer: 'ortho' | 'ndvi' | 'elevation' | 'cadastral';
  setActiveLayer: (layer: 'ortho' | 'ndvi' | 'elevation' | 'cadastral') => void;
}

export const GisMapCanvas: React.FC<GisMapCanvasProps> = ({
  plots,
  selectedPlot,
  onSelectPlot,
  activeUnit,
  isSurveyMode,
  setIsSurveyMode,
  onSaveNewPlot,
  currentRtkPos,
  onUpdateRtkPos,
  isSimulatingWalk,
  setIsSimulatingWalk,
  activeLayer,
  setActiveLayer,
}) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [surveyVertices, setSurveyVertices] = useState<PlotVertex[]>([]);
  const [draggingVertexIndex, setDraggingVertexIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ xPct: number; yPct: number } | null>(null);
  const [simulationIndex, setSimulationIndex] = useState(0);

  // Calculated survey metrics
  const surveyAreaSqM = React.useMemo(() => {
    if (surveyVertices.length < 3) return 0;
    return calculateGeodesicAreaSqM(surveyVertices);
  }, [surveyVertices]);

  const surveyPerimeterM = React.useMemo(() => {
    if (surveyVertices.length < 2) return 0;
    return calculatePerimeterMeters(surveyVertices);
  }, [surveyVertices]);

  // Convert canvas % coordinates to simulated GPS Lat/Long
  const pctToGps = (xPct: number, yPct: number) => {
    const minLat = 24.466;
    const maxLat = 24.476;
    const minLng = 74.871;
    const maxLng = 74.882;
    const lat = maxLat - (yPct / 100) * (maxLat - minLat);
    const lng = minLng + (xPct / 100) * (maxLng - minLng);
    return { lat, lng, elevationM: 481.5 + Math.sin(xPct + yPct) * 2.5 };
  };

  // Convert GPS to Canvas %
  const gpsToPct = (lat: number, lng: number) => {
    const minLat = 24.466;
    const maxLat = 24.476;
    const minLng = 74.871;
    const maxLng = 74.882;
    const yPct = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 100;
    return { xPct, yPct };
  };

  // Add vertex on canvas click during survey mode
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSurveyMode) return;
    if (draggingVertexIndex !== null) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    const gps = pctToGps(xPct, yPct);
    const newVertex: PlotVertex = {
      id: `v-custom-${Date.now()}-${surveyVertices.length}`,
      lat: gps.lat,
      lng: gps.lng,
      xPct,
      yPct,
      elevationM: gps.elevationM,
      label: `CP-${surveyVertices.length + 1}`,
    };

    setSurveyVertices((prev) => [...prev, newVertex]);
    onUpdateRtkPos(gps);
  };

  // Handle vertex dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setMousePos({ xPct, yPct });

    if (draggingVertexIndex !== null) {
      const gps = pctToGps(xPct, yPct);
      setSurveyVertices((prev) => {
        const next = [...prev];
        next[draggingVertexIndex] = {
          ...next[draggingVertexIndex],
          xPct,
          yPct,
          lat: gps.lat,
          lng: gps.lng,
          elevationM: gps.elevationM,
        };
        return next;
      });
      onUpdateRtkPos(gps);
    }
  };

  const handleMouseUp = () => {
    setDraggingVertexIndex(null);
  };

  // Walk boundary cadence simulation loop
  useEffect(() => {
    if (!isSimulatingWalk) return;
    const targetPlot = selectedPlot || plots[0];
    if (!targetPlot || targetPlot.vertices.length < 3) return;

    const interval = setInterval(() => {
      setSimulationIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % targetPlot.vertices.length;
        const vertex = targetPlot.vertices[nextIdx];
        onUpdateRtkPos({
          lat: vertex.lat,
          lng: vertex.lng,
          elevationM: vertex.elevationM,
        });
        return nextIdx;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isSimulatingWalk, selectedPlot, plots, onUpdateRtkPos]);

  // Current RTK receiver position in canvas coordinates
  const receiverPos = gpsToPct(currentRtkPos.lat, currentRtkPos.lng);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#222a3d] bg-[#0b1326] shadow-xl">
      {/* Top Map HUD Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Layer Selector pills */}
        <div className="flex items-center gap-1 p-1 bg-[#131b2e]/90 backdrop-blur-md rounded-lg border border-[#222a3d] pointer-events-auto shadow-md">
          <button
            onClick={() => setActiveLayer('ortho')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors whitespace-nowrap ${
              activeLayer === 'ortho'
                ? 'bg-[#1e6b3d] text-[#dae2fd] font-semibold'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#171f33]'
            }`}
          >
            {t.mapLayers.ortho}
          </button>
          <button
            onClick={() => setActiveLayer('ndvi')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeLayer === 'ndvi'
                ? 'bg-[#1e6b3d] text-[#dae2fd] font-semibold'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#171f33]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            {t.mapLayers.ndvi}
          </button>
          <button
            onClick={() => setActiveLayer('elevation')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors whitespace-nowrap ${
              activeLayer === 'elevation'
                ? 'bg-[#1e6b3d] text-[#dae2fd] font-semibold'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#171f33]'
            }`}
          >
            {t.mapLayers.elevation}
          </button>
          <button
            onClick={() => setActiveLayer('cadastral')}
            className={`px-3 py-1.5 rounded-md font-mono text-xs transition-colors whitespace-nowrap ${
              activeLayer === 'cadastral'
                ? 'bg-[#1e6b3d] text-[#dae2fd] font-semibold'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#171f33]'
            }`}
          >
            {t.mapLayers.cadastral}
          </button>
        </div>

        {/* Right: Map Navigation FABs */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center bg-[#131b2e]/90 backdrop-blur-md rounded-lg border border-[#222a3d] p-1 shadow-md">
            <button
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
              className="p-1.5 hover:bg-[#222a3d] rounded text-[#bfc9be] hover:text-[#dae2fd] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
              className="p-1.5 hover:bg-[#222a3d] rounded text-[#bfc9be] hover:text-[#dae2fd] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-[#222a3d] rounded text-[#bfc9be] hover:text-[#dae2fd] transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Compass Rose */}
          <div className="w-9 h-9 bg-[#131b2e]/90 backdrop-blur-md rounded-lg border border-[#222a3d] flex items-center justify-center text-[#8bd79f] shadow-md">
            <Compass className="w-5 h-5 text-[#22c55e]" />
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
        className={`relative w-full h-[520px] md:h-[620px] cursor-crosshair select-none transition-transform duration-200 overflow-hidden ${
          isSurveyMode ? 'bg-[#060e20]' : 'bg-[#0b1326]'
        }`}
      >
        {/* Orthomosaic Satellite Background */}
        <img
          src={aerialSatelliteImg}
          alt="Aerial drone orthomosaic farmland telemetry"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-85"
        />

        {/* Graticule Reticle Lines */}
        <div className="absolute inset-0 bg-graticule pointer-events-none opacity-40" />

        {/* NDVI False Color Spectral Heatmap Overlay */}
        {activeLayer === 'ndvi' && (
          <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-75">
            <svg className="w-full h-full">
              <defs>
                <radialGradient id="ndviGrad1" cx="35%" cy="35%" r="45%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.85" />
                  <stop offset="65%" stopColor="#8bd79f" stopOpacity="0.65" />
                  <stop offset="90%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
                </radialGradient>
                <radialGradient id="ndviGrad2" cx="75%" cy="65%" r="40%">
                  <stop offset="0%" stopColor="#1e6b3d" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#ndviGrad1)" />
              <circle cx="75%" cy="65%" r="35%" fill="url(#ndviGrad2)" />
            </svg>
          </div>
        )}

        {/* Elevation GIS Contour Overlay */}
        {activeLayer === 'elevation' && (
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <svg className="w-full h-full" stroke="rgba(255, 183, 125, 0.4)" strokeWidth="1" fill="none">
              <path d="M 0 100 Q 250 80, 500 120 T 1000 90" strokeDasharray="4 2" />
              <path d="M 0 200 Q 300 180, 600 240 T 1000 180" />
              <path d="M 0 320 Q 280 340, 580 300 T 1000 340" />
              <path d="M 0 460 Q 320 420, 650 480 T 1000 440" strokeDasharray="4 2" />
              <text x="40" y="195" fill="#ffb77d" fontSize="10" fontFamily="JetBrains Mono">484m MSL</text>
              <text x="40" y="315" fill="#ffb77d" fontSize="10" fontFamily="JetBrains Mono">481m MSL</text>
              <text x="40" y="455" fill="#ffb77d" fontSize="10" fontFamily="JetBrains Mono">478m MSL</text>
            </svg>
          </div>
        )}

        {/* SVG Vector Polygon Layer */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {/* Render Existing Cadastral Plots */}
          {plots.map((plot) => {
            const isSelected = selectedPlot?.id === plot.id;
            const pointsString = plot.vertices.map((v) => `${v.xPct}%,${v.yPct}%`).join(' ');

            return (
              <g key={plot.id} className="pointer-events-auto cursor-pointer" onClick={(e) => {
                e.stopPropagation();
                if (!isSurveyMode) onSelectPlot(plot);
              }}>
                {/* Polygon Area Fill */}
                <polygon
                  points={pointsString}
                  fill={isSelected ? 'rgba(34, 197, 94, 0.28)' : 'rgba(30, 107, 61, 0.16)'}
                  stroke={isSelected ? '#22c55e' : plot.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={plot.status === 'pending_verification' ? '6 3' : 'none'}
                  className="transition-all hover:fill-[rgba(34,197,94,0.32)]"
                />

                {/* Plot Center Label Marker */}
                {plot.vertices.length > 0 && (() => {
                  const centerX = plot.vertices.reduce((acc, v) => acc + v.xPct, 0) / plot.vertices.length;
                  const centerY = plot.vertices.reduce((acc, v) => acc + v.yPct, 0) / plot.vertices.length;
                  return (
                    <foreignObject
                      x={`${centerX - 9}%`}
                      y={`${centerY - 3}%`}
                      width="18%"
                      height="6%"
                      className="overflow-visible pointer-events-none"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="px-2 py-0.5 rounded bg-[#0b1326]/85 border border-[#222a3d] text-[10px] sm:text-xs font-mono font-medium text-[#dae2fd] shadow-md whitespace-nowrap">
                          {plot.khasraNo} · {formatArea(plot.areaSqMeters, activeUnit)}
                        </span>
                      </div>
                    </foreignObject>
                  );
                })()}

                {/* Plot Vertices (when selected) */}
                {isSelected &&
                  plot.vertices.map((v, idx) => (
                    <g key={v.id}>
                      <circle
                        cx={`${v.xPct}%`}
                        cy={`${v.yPct}%`}
                        r="5"
                        fill="#22c55e"
                        stroke="#0b1326"
                        strokeWidth="2"
                      />
                      <text
                        x={`${v.xPct + 1}%`}
                        y={`${v.yPct - 1}%`}
                        fill="#8bd79f"
                        fontSize="10"
                        fontFamily="JetBrains Mono"
                        fontWeight="600"
                      >
                        {v.label || `P${idx + 1}`}
                      </text>
                    </g>
                  ))}
              </g>
            );
          })}

          {/* Active Custom Survey Polygon (When Drawing) */}
          {surveyVertices.length > 0 && (
            <g className="pointer-events-none">
              {/* Lines between logged survey vertices */}
              {surveyVertices.map((v, i) => {
                const nextV = surveyVertices[(i + 1) % surveyVertices.length];
                const isClosingSegment = i === surveyVertices.length - 1;

                return (
                  <g key={`survey-seg-${i}`}>
                    <line
                      x1={`${v.xPct}%`}
                      y1={`${v.yPct}%`}
                      x2={`${nextV.xPct}%`}
                      y2={`${nextV.yPct}%`}
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeDasharray={isClosingSegment && surveyVertices.length < 3 ? '4 4' : 'none'}
                    />
                    {/* Distance label along segment */}
                    {surveyVertices.length > 1 && (
                      <foreignObject
                        x={`${(v.xPct + nextV.xPct) / 2 - 4}%`}
                        y={`${(v.yPct + nextV.yPct) / 2 - 2}%`}
                        width="8%"
                        height="4%"
                        className="overflow-visible"
                      >
                        <div className="flex items-center justify-center">
                          <span className="px-1 py-0.2 rounded bg-[#0b1326]/90 border border-[#22c55e]/50 text-[9px] font-mono text-[#8bd79f] shadow">
                            {haversineDistanceM(v.lat, v.lng, nextV.lat, nextV.lng).toFixed(1)}m
                          </span>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}

              {/* In-progress Polygon Fill */}
              {surveyVertices.length >= 3 && (
                <polygon
                  points={surveyVertices.map((v) => `${v.xPct}%,${v.yPct}%`).join(' ')}
                  fill="rgba(34, 197, 94, 0.22)"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              )}

              {/* Vertices Draggable Knobs */}
              {surveyVertices.map((v, idx) => (
                <g
                  key={v.id}
                  className="pointer-events-auto cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingVertexIndex(idx);
                  }}
                >
                  <circle
                    cx={`${v.xPct}%`}
                    cy={`${v.yPct}%`}
                    r="7"
                    fill="#22c55e"
                    stroke="#0b1326"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />
                  <text
                    x={`${v.xPct + 1.2}%`}
                    y={`${v.yPct - 1.2}%`}
                    fill="#dae2fd"
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    fontWeight="700"
                  >
                    CP-{idx + 1}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Real-time RTK GPS Receiver Crosshair */}
          <g className="pointer-events-none">
            {/* Halo pulse */}
            <circle
              cx={`${receiverPos.xPct}%`}
              cy={`${receiverPos.yPct}%`}
              r="16"
              fill="rgba(34, 197, 94, 0.2)"
              className="animate-ping"
            />
            {/* Reticle center */}
            <circle
              cx={`${receiverPos.xPct}%`}
              cy={`${receiverPos.yPct}%`}
              r="6"
              fill="#22c55e"
              stroke="#0b1326"
              strokeWidth="2"
            />
            {/* Reticle crosshair arms */}
            <line
              x1={`${receiverPos.xPct - 2}%`}
              y1={`${receiverPos.yPct}%`}
              x2={`${receiverPos.xPct + 2}%`}
              y2={`${receiverPos.yPct}%`}
              stroke="#8bd79f"
              strokeWidth="1.5"
            />
            <line
              x1={`${receiverPos.xPct}%`}
              y1={`${receiverPos.yPct - 2.5}%`}
              x2={`${receiverPos.xPct}%`}
              y2={`${receiverPos.yPct + 2.5}%`}
              stroke="#8bd79f"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Live Coordinate Callout at Cursor / Receiver */}
        {mousePos && (
          <div className="absolute bottom-3 left-3 pointer-events-none bg-[#0b1326]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#222a3d] font-mono text-[11px] text-[#bfc9be] shadow-lg">
            <span>{t.rtk.gridCoords}: X {mousePos.xPct.toFixed(1)}% | Y {mousePos.yPct.toFixed(1)}%</span>
            <span className="text-[#899389] mx-2">·</span>
            <span className="text-[#8bd79f]">{t.rtk.fixStatus} ±0.018m</span>
          </div>
        )}
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="p-3 sm:p-4 bg-[#131b2e] border-t border-[#222a3d] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Survey Status / Drawing Controls */}
        <div className="flex items-center gap-2">
          {!isSurveyMode ? (
            <button
              onClick={() => setIsSurveyMode(true)}
              className="h-10 px-4 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs font-semibold flex items-center gap-2 border border-[#22c55e]/30 shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.actions.startSurvey}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-[#1e6b3d]/30 border border-[#22c55e]/40 text-xs font-mono text-[#8bd79f]">
                {surveyVertices.length} Vertices
              </span>

              {/* Undo Last Vertex */}
              <button
                onClick={() => setSurveyVertices((prev) => prev.slice(0, -1))}
                disabled={surveyVertices.length === 0}
                className="h-9 px-3 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#bfc9be] hover:text-[#dae2fd] disabled:opacity-40 font-mono text-xs flex items-center gap-1.5 border border-[#222a3d] transition-colors"
                title="Undo last vertex"
              >
                <Undo className="w-3.5 h-3.5" />
                <span>{t.actions.undo}</span>
              </button>

              {/* Clear */}
              <button
                onClick={() => setSurveyVertices([])}
                disabled={surveyVertices.length === 0}
                className="h-9 px-3 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#ffb4ab] hover:text-white disabled:opacity-40 font-mono text-xs flex items-center gap-1.5 border border-[#222a3d] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.actions.clear}</span>
              </button>

              {/* Complete & Save Parcel */}
              {surveyVertices.length >= 3 && (
                <button
                  onClick={() => {
                    onSaveNewPlot(surveyVertices, surveyAreaSqM, surveyPerimeterM);
                    setSurveyVertices([]);
                    setIsSurveyMode(false);
                  }}
                  className="h-9 px-3 rounded-lg bg-[#22c55e] text-[#0b1326] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#22c55e] shadow transition-all hover:bg-[#8bd79f]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.actions.saveParcel}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsSurveyMode(false);
                  setSurveyVertices([]);
                }}
                className="h-9 px-3 rounded-lg bg-transparent text-[#bfc9be] hover:text-[#dae2fd] text-xs font-mono"
              >
                {t.actions.cancel}
              </button>
            </div>
          )}
        </div>

        {/* Right: Field Walking Simulation & Real-time Live Log */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatingWalk(!isSimulatingWalk)}
            className={`h-10 px-4 rounded-lg font-mono text-xs font-medium flex items-center gap-2 border transition-all ${
              isSimulatingWalk
                ? 'bg-[#d97706] text-[#0b1326] border-[#f59e0b] shadow-md font-semibold'
                : 'bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] border-[#222a3d]'
            }`}
          >
            {isSimulatingWalk ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>{t.actions.stopBoundaryWalk}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-[#22c55e]" />
                <span>{t.actions.startBoundaryWalk}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
