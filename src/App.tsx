import React, { useState, useEffect, useCallback } from 'react';
import { 
  FarmPlot, LandUnit, PlotVertex, MandiCommodity, OrderBookEntry, 
  CommissionAgent, HarvestLot 
} from './types';
import { 
  INITIAL_PLOTS, MANDI_COMMODITIES, INITIAL_ORDER_BOOK, 
  COMMISSION_AGENTS, IOT_TELEMETRY_STATION, INITIAL_CERTIFICATES 
} from './data/mockData';
import { Header } from './components/Header';
import { RtkStatusRibbon } from './components/RtkStatusRibbon';
import { UnitConversionHud } from './components/UnitConversionHud';
import { GisMapCanvas } from './components/GisMapCanvas';
import { MandiExchange } from './components/MandiExchange';
import { AgronomicStation } from './components/AgronomicStation';
import { CadastralVault } from './components/CadastralVault';
import { RainWeatherReport } from './components/RainWeatherReport';
import { CreateLotModal } from './components/CreateLotModal';
import { NewPlotModal } from './components/NewPlotModal';
import { AgentCallModal } from './components/AgentCallModal';
import { QuickBidModal } from './components/QuickBidModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CloudRain } from 'lucide-react';

function AppContent() {
  const { language, t } = useLanguage();

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'map' | 'mandi' | 'agronomy' | 'cadastral' | 'weather'>('map');
  const [activeUnit, setActiveUnit] = useState<LandUnit>('acres');
  const [activeLayer, setActiveLayer] = useState<'ortho' | 'ndvi' | 'elevation' | 'cadastral'>('ortho');

  // Plots & Survey State
  const [plots, setPlots] = useState<FarmPlot[]>(INITIAL_PLOTS);
  const [selectedPlot, setSelectedPlot] = useState<FarmPlot | null>(INITIAL_PLOTS[0]);
  const [isSurveyMode, setIsSurveyMode] = useState<boolean>(false);
  const [isSimulatingWalk, setIsSimulatingWalk] = useState<boolean>(false);

  // Mandi & Commodity State
  const [commodities, setCommodities] = useState<MandiCommodity[]>(MANDI_COMMODITIES);
  const [orderBook, setOrderBook] = useState<OrderBookEntry[]>(INITIAL_ORDER_BOOK);
  const [commissionAgents] = useState<CommissionAgent[]>(COMMISSION_AGENTS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);

  // IoT Station State
  const [station, setStation] = useState(IOT_TELEMETRY_STATION);
  const [isIrrigating, setIsIrrigating] = useState(false);

  // RTK Receiver Coordinates
  const [currentRtkPos, setCurrentRtkPos] = useState({
    lat: 24.47182,
    lng: 74.87412,
    elevationM: 482.4,
  });

  // Modals
  const [showCreateLotModal, setShowCreateLotModal] = useState(false);
  const [pendingSurveyPlot, setPendingSurveyPlot] = useState<{
    vertices: PlotVertex[];
    areaSqM: number;
    perimeterM: number;
  } | null>(null);
  const [selectedAgentToCall, setSelectedAgentToCall] = useState<CommissionAgent | null>(null);
  const [selectedCommodityToBid, setSelectedCommodityToBid] = useState<MandiCommodity | null>(null);

  // Sound feedback for RTK logging using Web Audio API
  const playSurveyBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // Audio not supported or blocked
    }
  }, []);

  // Handler: Log GPS Vertex
  const handleLogVertex = () => {
    playSurveyBeep();
    setCurrentRtkPos((prev) => ({
      ...prev,
      lat: prev.lat + (Math.random() - 0.5) * 0.0001,
      lng: prev.lng + (Math.random() - 0.5) * 0.0001,
      elevationM: prev.elevationM + (Math.random() - 0.5) * 0.1,
    }));
  };

  // Handler: Save newly surveyed parcel
  const handleSaveSurveyPlot = (plot: FarmPlot) => {
    setPlots((prev) => [plot, ...prev]);
    setSelectedPlot(plot);

    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNo: `CAD-GIS-2026-MP-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      plotId: plot.id,
      khasraNo: plot.khasraNo,
      surveyNo: plot.surveyNo,
      farmerName: plot.ownerName,
      state: 'Madhya Pradesh',
      district: plot.district,
      tehsil: 'Malhargarh',
      village: plot.village,
      areaAcres: plot.areaSqMeters / 4046.856,
      areaHectares: plot.areaSqMeters / 10000,
      areaBigha: plot.areaSqMeters / 2529.289,
      perimeterMeters: plot.perimeterMeters,
      verifiedBy: 'Er. Rajeshwar Varma (Lic. #RTK-GIS-SURV-4819)',
      licenseNumber: 'GOI-SURV-A4819',
      digitalSealHash: `SHA256: ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      vertices: plot.vertices.map((v, i) => ({
        point: `P${i + 1}`,
        lat: `${v.lat.toFixed(5)}°N`,
        lng: `${v.lng.toFixed(5)}°E`,
        utmEast: `487,${Math.round(200 + i * 50)}.0 m`,
        utmNorth: `2,706,${Math.round(500 + i * 40)}.0 m`,
        elevation: `${v.elevationM.toFixed(1)} m`,
      })),
    };
    setCertificates((prev) => [newCert, ...prev]);
  };

  // Handler: Add harvest lot and order book entry
  const handleSubmitHarvestLot = (lot: HarvestLot, order: OrderBookEntry) => {
    setOrderBook((prev) => [order, ...prev]);
  };

  // Handler: Quick bid submit
  const handleQuickBid = (order: OrderBookEntry) => {
    setOrderBook((prev) => [order, ...prev]);
  };

  // Handler: Simulate Irrigation Pulse Cycle
  const handleTriggerIrrigation = () => {
    setIsIrrigating(true);
    setTimeout(() => {
      setIsIrrigating(false);
      setStation((prev) => ({
        ...prev,
        horizons: prev.horizons.map((h) => ({
          ...h,
          moistureVolumetricPct: Math.min(h.optimalMaxPct, h.moistureVolumetricPct + 3.2),
        })),
      }));
    }, 3000);
  };

  // Periodic subtle ticker price updates
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCommodities((prev) =>
        prev.map((c) => {
          if (Math.random() > 0.6) {
            const delta = (Math.random() - 0.48) * 10;
            const newRate = Math.round(c.currentRateQtl + delta);
            return {
              ...c,
              currentRateQtl: newRate,
              changePct: Number((((newRate - c.prevRateQtl) / c.prevRateQtl) * 100).toFixed(2)),
              lastTradeTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            };
          }
          return c;
        })
      );
    }, 6000);
    return () => clearInterval(tickerInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col selection:bg-[#1e6b3d] selection:text-[#dae2fd]">
      {/* 3-Zone Header Contract with Language Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rtkStatus="fix"
        onLogVertex={handleLogVertex}
        isSurveyMode={isSurveyMode}
        setIsSurveyMode={setIsSurveyMode}
      />

      {/* Floating RTK Kinematic GPS Status Ribbon */}
      <RtkStatusRibbon
        currentLat={currentRtkPos.lat}
        currentLng={currentRtkPos.lng}
        currentElevation={currentRtkPos.elevationM}
        satellitesCount={28}
        pdop={0.78}
        accuracyM={0.018}
        isSimulatingWalk={isSimulatingWalk}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Screen 1: Field GIS Console */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            {/* Real-time Precipitation Warning & Shortcut Strip */}
            <div 
              onClick={() => setActiveTab('weather')}
              className="bg-[#131b2e] border border-[#22c55e]/40 rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#171f33] transition-colors group shadow-sm"
            >
              <div className="flex items-center gap-2.5 text-xs font-mono">
                <CloudRain className="w-4 h-4 text-[#22c55e] group-hover:scale-110 transition-transform" />
                <span className="text-[#dae2fd]">
                  {language === 'kn' ? 'ಮಳೆ ಮುನ್ಸೂಚನೆ (ಇಂದು ೧೬:೦೦ IST): ' : 'Rain Prediction (Today 16:00 IST): '}
                  <span className="text-[#22c55e] font-bold">88% PoP (18.6 mm)</span>
                </span>
                <span className="text-[#899389] hidden sm:inline">· {language === 'kn' ? 'ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಬೇಡ' : 'Pesticide spray prohibited'}</span>
              </div>
              <span className="text-xs font-mono text-[#8bd79f] group-hover:underline flex items-center gap-1">
                {language === 'kn' ? 'ಗಂಟೆವಾರು ಹವಾಮಾನ ನೋಡಿ →' : 'View Hourly Radar →'}
              </span>
            </div>

            {/* Real-time Multi-Unit Land Conversion HUD */}
            <UnitConversionHud
              areaSqMeters={selectedPlot ? selectedPlot.areaSqMeters : 17199.1}
              perimeterMeters={selectedPlot ? selectedPlot.perimeterMeters : 536.8}
              selectedUnit={activeUnit}
              onSelectUnit={setActiveUnit}
              plotLabel={selectedPlot?.name}
              khasraNo={selectedPlot?.khasraNo}
            />

            {/* Interactive GIS Orthomosaic Map Canvas */}
            <GisMapCanvas
              plots={plots}
              selectedPlot={selectedPlot}
              onSelectPlot={setSelectedPlot}
              activeUnit={activeUnit}
              isSurveyMode={isSurveyMode}
              setIsSurveyMode={setIsSurveyMode}
              onSaveNewPlot={(vertices, areaSqM, perimeterM) => {
                setPendingSurveyPlot({ vertices, areaSqM, perimeterM });
              }}
              currentRtkPos={currentRtkPos}
              onUpdateRtkPos={setCurrentRtkPos}
              isSimulatingWalk={isSimulatingWalk}
              setIsSimulatingWalk={setIsSimulatingWalk}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
            />

            {/* Selected Plot Telemetry Inspector Sheet */}
            {selectedPlot && (
              <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
                    <span className="font-semibold">{selectedPlot.cropType}</span>
                    <span className="text-[#899389]">·</span>
                    <span className="text-[#dae2fd]">{selectedPlot.variety}</span>
                    <span className="text-[#899389]">·</span>
                    <span className="text-[#ffb77d]">
                      {language === 'kn' ? 'ಬಿತ್ತನೆ: ' : 'Sown: '}
                      {selectedPlot.sowingDate}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#dae2fd]">
                    {selectedPlot.name}
                  </h3>
                  <p className="text-xs text-[#bfc9be] font-mono">
                    {language === 'kn' ? 'ಮಾಲೀಕರು: ' : 'Owner: '}
                    {selectedPlot.ownerName} · {t.cadastral.khasra} {selectedPlot.khasraNo} · Survey #{selectedPlot.surveyNo}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#222a3d] text-center">
                    <div className="text-[10px] text-[#899389] uppercase">NDVI Chlorophyll</div>
                    <div className="text-base font-bold text-[#22c55e] mt-0.5">
                      {selectedPlot.ndviAverage} {language === 'kn' ? '(ಉತ್ತಮ ಚೈತನ್ಯ)' : '(High Vigor)'}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#131b2e] rounded-lg border border-[#222a3d] text-center">
                    <div className="text-[10px] text-[#899389] uppercase">
                      {language === 'kn' ? 'ಸರಾಸರಿ ತೇವಾಂಶ' : 'Avg Soil Moisture'}
                    </div>
                    <div className="text-base font-bold text-[#8bd79f] mt-0.5">
                      {selectedPlot.soilMoistureAveragePct}% {language === 'kn' ? '(ಸೂಕ್ತ)' : '(Optimal)'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('mandi');
                      setShowCreateLotModal(true);
                    }}
                    className="h-10 px-4 rounded-lg bg-[#d97706] hover:bg-[#f59e0b] text-[#0b1326] font-semibold flex items-center gap-1.5 transition-all shadow"
                  >
                    <span>{t.actions.listHarvestLot}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Screen 2: Mandi Commodity Exchange */}
        {activeTab === 'mandi' && (
          <MandiExchange
            commodities={commodities}
            orderBook={orderBook}
            commissionAgents={commissionAgents}
            plots={plots}
            onOpenCreateLot={() => setShowCreateLotModal(true)}
            onCallAgent={(agent) => setSelectedAgentToCall(agent)}
            onPlaceQuickBid={(comm) => setSelectedCommodityToBid(comm)}
          />
        )}

        {/* Screen 3: Agronomic IoT Telemetry Station */}
        {activeTab === 'agronomy' && (
          <AgronomicStation
            station={station}
            plots={plots}
            onTriggerIrrigationSimulation={handleTriggerIrrigation}
            isIrrigating={isIrrigating}
          />
        )}

        {/* Screen 4: Cadastral Survey Land Vault */}
        {activeTab === 'cadastral' && (
          <CadastralVault
            plots={plots}
            certificates={certificates}
            activeUnit={activeUnit}
            onSelectPlotForMap={(plot) => {
              setSelectedPlot(plot);
              setActiveTab('map');
            }}
          />
        )}

        {/* Screen 5: Rain Prediction & Precision Weather Report by Date & Time */}
        {activeTab === 'weather' && (
          <RainWeatherReport
            plots={plots}
            selectedPlot={selectedPlot}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0b1326] border-t border-[#222a3d] py-4 px-6 text-xs font-mono text-[#899389] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            {t.appName} · {t.appSubtitle}
          </div>
          <div className="flex items-center gap-4 text-[#bfc9be]">
            <span>RTK Kinematic Datum: WGS-84</span>
            <span>·</span>
            <span>{t.rtk.utmZone}</span>
            <span>·</span>
            <span className="text-[#8bd79f]">CORS Station Online</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showCreateLotModal && (
        <CreateLotModal
          plots={plots}
          commodities={commodities}
          onClose={() => setShowCreateLotModal(false)}
          onSubmitLot={handleSubmitHarvestLot}
        />
      )}

      {pendingSurveyPlot && (
        <NewPlotModal
          vertices={pendingSurveyPlot.vertices}
          areaSqMeters={pendingSurveyPlot.areaSqM}
          perimeterMeters={pendingSurveyPlot.perimeterM}
          onClose={() => setPendingSurveyPlot(null)}
          onSavePlot={handleSaveSurveyPlot}
        />
      )}

      {selectedAgentToCall && (
        <AgentCallModal
          agent={selectedAgentToCall}
          onClose={() => setSelectedAgentToCall(null)}
        />
      )}

      {selectedCommodityToBid && (
        <QuickBidModal
          commodity={selectedCommodityToBid}
          onClose={() => setSelectedCommodityToBid(null)}
          onSubmitBid={handleQuickBid}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
