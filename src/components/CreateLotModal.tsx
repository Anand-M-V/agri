import React, { useState } from 'react';
import { FarmPlot, HarvestLot, MandiCommodity, OrderBookEntry } from '../types';
import { X, Scale, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CreateLotModalProps {
  plots: FarmPlot[];
  commodities: MandiCommodity[];
  onClose: () => void;
  onSubmitLot: (lot: HarvestLot, order: OrderBookEntry) => void;
}

export const CreateLotModal: React.FC<CreateLotModalProps> = ({
  plots,
  commodities,
  onClose,
  onSubmitLot,
}) => {
  const { language, t } = useLanguage();
  const [selectedPlotId, setSelectedPlotId] = useState(plots[0]?.id || '');
  const [commodityName, setCommodityName] = useState(commodities[0]?.name || 'Wheat (Sharbati MP)');
  const [variety, setVariety] = useState('C-306 Grade-A Bold');
  const [lotWeightQtl, setLotWeightQtl] = useState(120);
  const [moisturePct, setMoisturePct] = useState(10.2);
  const [reservePriceQtl, setReservePriceQtl] = useState(2880);
  const [grade, setGrade] = useState<'Grade-A FAQ' | 'Grade-B' | 'Special Premium'>('Grade-A FAQ');

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLot: HarvestLot = {
      id: `lot-${Date.now()}`,
      plotId: selectedPlotId,
      plotName: selectedPlot ? selectedPlot.name : 'Surveyed Field',
      commodityName,
      variety,
      lotWeightQtl: Number(lotWeightQtl),
      moisturePct: Number(moisturePct),
      purityPct: 98.8,
      grade,
      reservePriceQtl: Number(reservePriceQtl),
      status: 'listed',
      listedAt: 'Just now',
    };

    const newOrder: OrderBookEntry = {
      id: `order-ask-${Date.now()}`,
      type: 'ask',
      priceQtl: Number(reservePriceQtl),
      quantityQtl: Number(lotWeightQtl),
      entityName: `${selectedPlot?.ownerName || 'Verified Producer'} (${t.cadastral.khasra} ${selectedPlot?.khasraNo})`,
      badge: 'Farmer Producer Co',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    onSubmitLot(newLot, newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0b1326] border-2 border-[#d97706] rounded-2xl p-6 shadow-2xl text-[#dae2fd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#131b2e] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#bfc9be] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#ffb77d]">
          <Scale className="w-4 h-4 text-[#d97706]" />
          <span>APMC MANDI AUCTION YARD LISTING</span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#dae2fd] mt-1">
          {t.modals.createLotTitle}
        </h3>
        <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
          {t.modals.createLotSubtitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-mono text-xs">
          {/* Linked Cadastral Plot */}
          <div>
            <label className="block text-[#899389] mb-1">
              {language === 'kn' ? 'ಸರ್ವೆ ನಂಬರ್ ಜಮೀನು ಲಿಂಕ್ ಮಾಡಿ:' : 'LINK TO CADASTRAL SURVEY PARCEL:'}
            </label>
            <select
              value={selectedPlotId}
              onChange={(e) => setSelectedPlotId(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
            >
              {plots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({t.cadastral.khasra} {p.khasraNo} · {p.cropType})
                </option>
              ))}
            </select>
          </div>

          {/* Commodity & Variety */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಬೆಳೆ ಸರಕು:' : 'COMMODITY:'}
              </label>
              <select
                value={commodityName}
                onChange={(e) => {
                  setCommodityName(e.target.value);
                  const matched = commodities.find((c) => c.name === e.target.value);
                  if (matched) {
                    setVariety(matched.variety);
                    setReservePriceQtl(matched.currentRateQtl);
                  }
                }}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              >
                {commodities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {language === 'kn' && c.kannadaName ? c.kannadaName : c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ತಳಿ / ದರ್ಜೆ:' : 'SEED VARIETY / GRADE:'}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          {/* Lot Weight & Reserve Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ತೂಕ (ಕ್ವಿಂಟಾಲ್):' : 'LOT WEIGHT (QUINTALS):'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={lotWeightQtl}
                  onChange={(e) => setLotWeightQtl(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
                />
                <span className="absolute right-3 top-2.5 text-[#899389]">Qtl</span>
              </div>
              <div className="text-[10px] text-[#899389] mt-0.5">
                ≈ {Math.round(lotWeightQtl * 2)} {language === 'kn' ? 'ಚೀಲಗಳು (50 ಕೆಜಿ)' : 'Jute Bags (50kg)'}
              </div>
            </div>

            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಮೀಸಲು ಬೆಲೆ (₹/ಕ್ವಿಂಟಾಲ್):' : 'RESERVE PRICE (₹/QTL):'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  step="10"
                  value={reservePriceQtl}
                  onChange={(e) => setReservePriceQtl(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
                />
                <span className="absolute right-3 top-2.5 text-[#ffb77d]">₹/Qtl</span>
              </div>
              <div className="text-[10px] text-[#8bd79f] mt-0.5">
                {language === 'kn' ? 'ಒಟ್ಟು ಮೊತ್ತ: ' : 'Total: '}₹{(lotWeightQtl * reservePriceQtl).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Moisture Test Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#899389]">
                {language === 'kn' ? 'ಡಿಜಿಟಲ್ ತೇವಾಂಶ ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ (%):' : 'DIGITAL NIR MOISTURE READING (%):'}
              </label>
              <span className="text-[#8bd79f] font-bold">{moisturePct}%</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="16.0"
              step="0.1"
              value={moisturePct}
              onChange={(e) => setMoisturePct(Number(e.target.value))}
              className="w-full accent-[#22c55e]"
            />
            <div className="flex justify-between text-[10px] text-[#899389] mt-1">
              <span>{language === 'kn' ? 'ಒಣ (<8%)' : 'Dry (<8%)'}</span>
              <span className="text-[#22c55e]">{language === 'kn' ? 'ಸೂಕ್ತ ತೇವಾಂಶ (9% - 12%)' : 'Optimal (9% - 12%)'}</span>
              <span>{language === 'kn' ? 'ಹೆಚ್ಚಿನ ತೇವಾಂಶ (>14%)' : 'Damp (>14%)'}</span>
            </div>
          </div>

          {/* Quality Grade Buttons */}
          <div>
            <label className="block text-[#899389] mb-1.5">
              {language === 'kn' ? 'ಗುಣಮಟ್ಟದ ದರ್ಜೆ:' : 'MANDI GRADE STANDARD:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Grade-A FAQ', 'Special Premium', 'Grade-B'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-2 rounded-lg border text-center transition-all ${
                    grade === g
                      ? 'bg-[#1e6b3d] border-[#22c55e] text-[#dae2fd] font-semibold'
                      : 'bg-[#131b2e] border-[#222a3d] text-[#bfc9be]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#222a3d] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#bfc9be] hover:text-[#dae2fd]"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-[#d97706] hover:bg-[#f59e0b] text-[#0b1326] font-semibold flex items-center gap-2 border border-[#f59e0b] shadow transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{t.actions.listHarvestLot}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
