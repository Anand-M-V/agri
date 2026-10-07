import React, { useState } from 'react';
import { FarmPlot, CadastralCertificate, LandUnit } from '../types';
import { formatArea, getUnitLabel } from '../utils/geoMath';
import { 
  ShieldCheck, FileText, Download, Printer, CheckCircle, 
  MapPin, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CadastralVaultProps {
  plots: FarmPlot[];
  certificates: CadastralCertificate[];
  activeUnit: LandUnit;
  onSelectPlotForMap: (plot: FarmPlot) => void;
}

export const CadastralVault: React.FC<CadastralVaultProps> = ({
  plots,
  certificates,
  activeUnit,
  onSelectPlotForMap,
}) => {
  const { language, t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<CadastralCertificate | null>(null);

  // GeoJSON file exporter
  const handleDownloadGeoJson = (plot: FarmPlot) => {
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            plotId: plot.id,
            name: plot.name,
            khasraNo: plot.khasraNo,
            surveyNo: plot.surveyNo,
            ownerName: plot.ownerName,
            cropType: plot.cropType,
            areaSqMeters: plot.areaSqMeters,
            perimeterMeters: plot.perimeterMeters,
            surveyTimestamp: plot.surveyTimestamp,
            surveyorLicense: plot.surveyorLicense,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                ...plot.vertices.map((v) => [v.lng, v.lat, v.elevationM]),
                [plot.vertices[0].lng, plot.vertices[0].lat, plot.vertices[0].elevationM],
              ],
            ],
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khasra_${plot.khasraNo.replace('/', '_')}_cadastral.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const unitMeta = getUnitLabel(activeUnit, language);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
              <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
              <span>{t.cadastral.badge}</span>
              <span className="text-[#899389]">·</span>
              <span className="text-[#bfc9be]">WGS-84 &amp; UTM Zone 43N Certified</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#dae2fd] mt-1 tracking-tight">
              {t.cadastral.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#bfc9be] mt-0.5">
              {t.cadastral.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#1e6b3d]/30 border border-[#22c55e]/40 text-xs font-mono text-[#8bd79f]">
              {plots.length} {t.cadastral.verifiedParcels}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Plot Geometry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plots.map((plot) => {
          const cert = certificates.find((c) => c.plotId === plot.id) || certificates[0];
          const pointsString = plot.vertices.map((v) => `${v.xPct},${v.yPct}`).join(' ');

          return (
            <div
              key={plot.id}
              className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#404941] transition-all shadow-md"
            >
              <div>
                {/* Header: Khasra number & Verification chip */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#ffb77d] px-2 py-0.5 rounded bg-[#131b2e] border border-[#222a3d]">
                    {t.cadastral.khasra} {plot.khasraNo}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                      plot.status === 'verified'
                        ? 'bg-[#1e6b3d]/40 text-[#8bd79f] border border-[#22c55e]/30'
                        : 'bg-[#904c00]/40 text-[#ffb77d] border border-[#d97706]/30'
                    }`}
                  >
                    <CheckCircle className="w-3 h-3 text-[#22c55e]" />
                    <span>{plot.status === 'verified' ? t.cadastral.rtkVerified : 'PENDING'}</span>
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-[#dae2fd] mt-2">
                  {plot.name}
                </h3>
                <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
                  {plot.village}, {plot.district}
                </p>

                {/* Stylized Vectorized Polygon Silhouette Thumbnail */}
                <div className="mt-4 w-full h-32 rounded-lg bg-[#0b1326] border border-[#222a3d] relative overflow-hidden flex items-center justify-center p-3">
                  <div className="absolute inset-0 bg-graticule-dense opacity-30 pointer-events-none" />
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <polygon
                      points={pointsString}
                      fill="rgba(34, 197, 94, 0.25)"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                    {plot.vertices.map((v, i) => (
                      <circle
                        key={i}
                        cx={v.xPct}
                        cy={v.yPct}
                        r="3.5"
                        fill="#8bd79f"
                        stroke="#0b1326"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                  <div className="absolute bottom-1.5 right-2 font-mono text-[10px] text-[#899389]">
                    {plot.vertices.length} Vertices
                  </div>
                </div>

                {/* Plot Telemetry Schedule */}
                <div className="mt-4 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-[#899389]">
                    <span>{t.cadastral.surveyedArea}</span>
                    <span className="text-[#dae2fd] font-bold tabular-nums">
                      {formatArea(plot.areaSqMeters, activeUnit)} {unitMeta.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#899389]">
                    <span>{t.cadastral.perimeterLength}</span>
                    <span className="text-[#dae2fd] tabular-nums">
                      {plot.perimeterMeters.toFixed(1)} m
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#899389]">
                    <span>{t.cadastral.recordedOwner}</span>
                    <span className="text-[#bfc9be] font-medium">
                      {plot.ownerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#899389]">
                    <span>{t.cadastral.surveyorStamp}</span>
                    <span className="text-[#8bd79f]">
                      {plot.surveyorLicense}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#222a3d] flex items-center gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 h-9 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#22c55e]/30 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{t.actions.viewCertificate}</span>
                </button>

                <button
                  onClick={() => handleDownloadGeoJson(plot)}
                  className="h-9 px-3 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] text-[#bfc9be] hover:text-[#dae2fd] font-mono text-xs flex items-center justify-center border border-[#222a3d] transition-colors"
                  title={t.actions.downloadGeoJson}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectPlotForMap(plot)}
                  className="h-9 px-3 rounded-lg bg-[#131b2e] hover:bg-[#222a3d] text-[#8bd79f] font-mono text-xs flex items-center justify-center border border-[#222a3d] transition-colors"
                  title={t.actions.inspectOnMap}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cadastral Survey Certificate Modal Viewer */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0b1326] border-2 border-[#1e6b3d] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#dae2fd]">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#131b2e] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#bfc9be] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Certificate Header */}
            <div className="text-center border-b-2 border-[#1e6b3d] pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e6b3d]/30 border border-[#22c55e]/50 font-mono text-xs text-[#8bd79f] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                {t.cadastral.certHeader}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#dae2fd]">
                {t.cadastral.certTitle}
              </h2>
              <p className="font-mono text-xs text-[#899389] mt-1">
                Certificate ID: {selectedCert.certificateNo} · Issued: {selectedCert.issueDate}
              </p>
            </div>

            {/* Certificate Details 2-Column Schedule */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[#899389]">{t.cadastral.jurisdiction}</div>
                <div className="text-sm font-bold text-[#dae2fd] mt-1">
                  {t.cadastral.khasra} {selectedCert.khasraNo} (Survey #{selectedCert.surveyNo})
                </div>
                <div className="text-[#bfc9be] mt-0.5">
                  Village: {selectedCert.village}, Tehsil: {selectedCert.tehsil}
                </div>
                <div className="text-[#bfc9be]">
                  District: {selectedCert.district}, State: {selectedCert.state}
                </div>
              </div>

              <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
                <div className="text-[#899389]">RECORDED EXTENT</div>
                <div className="text-sm font-bold text-[#dae2fd] mt-1">
                  {selectedCert.farmerName}
                </div>
                <div className="text-[#8bd79f] font-bold mt-0.5">
                  {selectedCert.areaAcres.toFixed(3)} Acres / {(selectedCert.areaAcres * 40).toFixed(1)} Guntha
                </div>
                <div className="text-[#899389]">
                  Total Perimeter: {selectedCert.perimeterMeters.toFixed(1)} m
                </div>
              </div>
            </div>

            {/* Boundary Vertex Coordinate Schedule Table */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-bold text-[#8bd79f] uppercase tracking-wider mb-2">
                {t.cadastral.controlPoints}
              </h4>
              <div className="overflow-x-auto border border-[#222a3d] rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#131b2e] text-[#899389] border-b border-[#222a3d]">
                    <tr>
                      <th className="py-2 px-3">Vertex</th>
                      <th className="py-2 px-3">Latitude (WGS84)</th>
                      <th className="py-2 px-3">Longitude (WGS84)</th>
                      <th className="py-2 px-3">UTM Easting</th>
                      <th className="py-2 px-3">UTM Northing</th>
                      <th className="py-2 px-3 text-right">Elevation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222a3d]">
                    {selectedCert.vertices.map((v, idx) => (
                      <tr key={idx} className="hover:bg-[#131b2e]/50">
                        <td className="py-2 px-3 font-bold text-[#8bd79f]">{v.point}</td>
                        <td className="py-2 px-3 text-[#dae2fd]">{v.lat}</td>
                        <td className="py-2 px-3 text-[#dae2fd]">{v.lng}</td>
                        <td className="py-2 px-3 text-[#bfc9be]">{v.utmEast}</td>
                        <td className="py-2 px-3 text-[#bfc9be]">{v.utmNorth}</td>
                        <td className="py-2 px-3 text-right text-[#ffb77d]">{v.elevation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic Hash Seal & Surveyor Signature */}
            <div className="mt-6 pt-4 border-t border-[#222a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#899389]">{t.cadastral.digitalSeal}</div>
                <div className="text-[#8bd79f] text-[11px] font-semibold break-all">
                  {selectedCert.digitalSealHash}
                </div>
                <div className="text-[#899389] text-[10px] mt-0.5">
                  {t.cadastral.verifiedBy} {selectedCert.verifiedBy}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="h-10 px-4 rounded-lg bg-[#131b2e] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] flex items-center gap-2 border border-[#222a3d] transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.actions.printDocument}</span>
                </button>

                <button
                  onClick={() => setSelectedCert(null)}
                  className="h-10 px-4 rounded-lg bg-[#22c55e] text-[#0b1326] font-semibold hover:bg-[#8bd79f] transition-colors"
                >
                  {t.actions.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
