import React, { useState } from 'react';
import { MandiCommodity, OrderBookEntry } from '../types';
import { X, Scale, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface QuickBidModalProps {
  commodity: MandiCommodity;
  onClose: () => void;
  onSubmitBid: (order: OrderBookEntry) => void;
}

export const QuickBidModal: React.FC<QuickBidModalProps> = ({
  commodity,
  onClose,
  onSubmitBid,
}) => {
  const { language, t } = useLanguage();
  const [bidPrice, setBidPrice] = useState(commodity.currentRateQtl);
  const [quantityQtl, setQuantityQtl] = useState(100);
  const [bidderName, setBidderName] = useState(language === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಉತ್ಪಾದಕರ ಒಕ್ಕೂಟ' : 'Karnataka Agri Procurement Consortium');

  const commodityName = language === 'kn' && commodity.kannadaName ? commodity.kannadaName : commodity.name;
  const commodityVariety = language === 'kn' && commodity.kannadaVariety ? commodity.kannadaVariety : commodity.variety;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBid: OrderBookEntry = {
      id: `bid-${Date.now()}`,
      type: 'bid',
      priceQtl: Number(bidPrice),
      quantityQtl: Number(quantityQtl),
      entityName: bidderName,
      badge: 'Corporation',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    onSubmitBid(newBid);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#0b1326] border-2 border-[#1e6b3d] rounded-2xl p-6 shadow-2xl text-[#dae2fd]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#131b2e] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#bfc9be] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
          <Scale className="w-4 h-4 text-[#22c55e]" />
          <span>{t.modals.yardBidTitle}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#dae2fd] mt-1">
          {commodityName}
        </h3>
        <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
          {commodityVariety} · {language === 'kn' ? 'ಪ್ರಸ್ತುತ ದರ: ' : 'Current Rate: '}
          <span className="text-[#ffb77d] font-bold">₹{commodity.currentRateQtl}/Qtl</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#899389] mb-1">
              {language === 'kn' ? 'ಖರೀದಿದಾರರ ಸಂಸ್ಥೆ / ಹೆಸರು:' : 'BUYER ENTITY NAME:'}
            </label>
            <input
              type="text"
              required
              value={bidderName}
              onChange={(e) => setBidderName(e.target.value)}
              className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಬಿಡ್ ದರ (₹/ಕ್ವಿಂಟಾಲ್):' : 'BID RATE (₹/QTL):'}
              </label>
              <input
                type="number"
                step="10"
                required
                value={bidPrice}
                onChange={(e) => setBidPrice(Number(e.target.value))}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
            <div>
              <label className="block text-[#899389] mb-1">
                {language === 'kn' ? 'ಪರಿಮಾಣ (ಕ್ವಿಂಟಾಲ್):' : 'QUANTITY (QTL):'}
              </label>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(Number(e.target.value))}
                className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg p-2.5 text-[#dae2fd] focus:outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#131b2e] rounded-lg border border-[#222a3d]">
            <div className="flex justify-between text-xs">
              <span className="text-[#899389]">{language === 'kn' ? 'ಒಟ್ಟು ಬದ್ಧತೆಯ ಮೊತ್ತ:' : 'Gross Bid Commitment:'}</span>
              <span className="text-[#ffb77d] font-bold">
                ₹{(bidPrice * quantityQtl).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[10px] text-[#899389] mt-1">
              {language === 'kn' ? 'ಎಪಿಎಂಸಿ ಸೆಸ್ ಮತ್ತು ಶಾಸನಬದ್ಧ ಶುಲ್ಕಗಳನ್ನು ಒಳಗೊಂಡಿದೆ' : 'Includes APMC mandi cess & statutory handling charges'}
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
              <span>{t.actions.confirmBid}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
