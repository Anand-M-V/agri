import React, { useState } from 'react';
import { FarmPlot, PlotVertex } from '../types';
import { X, Check, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NewPlotModalProps {
  vertices: PlotVertex[];
  areaSqMeters: number;
  perimeterMeters: number;
  onClose: () => void;
  onSavePlot: (plot: FarmPlot) => void;
}

export const NewPlotModal: React.FC<NewPlotModalProps> = ({
  vertices,
  areaSqMeters,
  perimeterMeters,
  onClose,
  onSavePlot,
}) => {
  const { language, t } = useLanguage();
  const [name, setName] = useState(language === 'kn' ? 'ಹೊಸ ಆರ್‌ಟಿಕೆ ಸರ್ವೆ ಜಮೀನು' : 'New RTK Survey Parcel');
  const [khasraNo, setKhasraNo] = useState('310/1');
  const [ownerName, setOwnerName] = useState(language === 'kn' ? 'ದೇವಿಂದ್ರ ಸಿಂಗ್ ಚೌಹಾಣ್' : 'Devendra Singh Chouhan');
  const [village, setVillage] = useState(language === 'kn' ? 'ಪಿಪ್ಲಿಯಾ ಮಂಡಿ' : 'Pipliya Mandi');
  const [district, setDistrict] = useState(language === 'kn' ? 'ಮಂದಸೌರ್' : 'Mandsaur');
  const [cropType, setCropType] = useState(language === 'kn' ? 'ಗೋಧಿ' : 'Wheat');
  const [variety, setVariety] = useState(language === 'kn' ? 'ಶರಬತಿ ಸಿ-೩೦೬' : 'Sharbati C-306');

  const acres = (areaSqMeters / 4046.856).toFixed(3);
  const guntha = (areaSqMeters / 101.171).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlot: FarmPlot = {
      id: `plot-${Date.now()}`,
      name,
      khasraNo,
      surveyNo: `KA-KL-2026-${Math.floor(100 + Math.random() * 900)}`,
      ownerName,
      village,
      district,
      cropType,
      variety,
      sowingDate: '2026-10-01',
      areaSqMeters,
      perimeterMeters,
      vertices,
      status: 'verified',
      surveyTimestamp: new Date().toLocaleString('en-IN') + ' IST',
      surveyorLicense: 'RTK-GIS-SURV-4819',
      ndviAverage: 0.76,
      soilMoistureAveragePct: 31.5,
      color: '#22c55e',
    };

    onSavePlot(newPlot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0b1326] border-2 border-[#1e6b3d] rounded-2xl p-6 shadow-2xl text-[#dae2fd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#131b2e] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#bfc9be] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
          <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
          <span>{t.cadastral.certHeader}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#dae2fd] mt-1">
          {t.modals.newPlotTitle}
        </h3>
        <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
          {language === 'kn' ? 'ಗಣಿಸಿದ ವಿಸ್ತೀರ್ಣ: ' : 'Calculated Area: '}
          <span className="text-[#8bd79f] font-bold">{acres} {t.units.acres}</span> ({guntha} {t.units.guntha}) · {vertices.length} Vertices
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#899389] mb-1">
              {language === 'kn' ? 'ಜಮೀನಿನ ಹೆಸರು:' : 'PARCEL DESCRIPTIVE NAME:'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಸರ್ವೆ ನಂಬರ್:' : 'KHASRA / SURVEY NUMBER:'}
              </label>
              <input
                type="text"
                required
                value={khasraNo}
                onChange={(e) => setKhasraNo(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಮಾಲೀಕರ ಹೆಸರು:' : 'RECORDED OWNER:'}
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಗ್ರಾಮ / ಪಂಚಾಯತ್:' : 'VILLAGE / PANCHAYAT:'}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಜಿಲ್ಲೆ:' : 'DISTRICT:'}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಬೆಳೆ:' : 'ACTIVE CROP:'}
              </label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ತಳಿ:' : 'SEED VARIETY:'}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

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
              className="h-10 px-6 rounded-lg bg-[#22c55e] text-[#0b1326] font-semibold flex items-center gap-2 shadow transition-all hover:bg-[#8bd79f]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{t.actions.saveParcel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
