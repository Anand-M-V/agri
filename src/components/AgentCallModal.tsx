import React, { useState } from 'react';
import { CommissionAgent } from '../types';
import { X, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AgentCallModalProps {
  agent: CommissionAgent;
  onClose: () => void;
}

export const AgentCallModal: React.FC<AgentCallModalProps> = ({ agent, onClose }) => {
  const { language, t } = useLanguage();
  const [callInitiated, setCallInitiated] = useState(false);

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
          <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
          <span>{t.modals.agentDeskTitle}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#dae2fd] mt-1">
          {agent.name}
        </h3>
        <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
          {agent.shopNo} · {agent.mandiYard}
        </p>

        <div className="mt-4 p-4 bg-[#131b2e] rounded-xl border border-[#222a3d] space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-[#899389]">{language === 'kn' ? 'ಎಪಿಎಂಸಿ ಪರವಾನಗಿ:' : 'APMC License:'}</span>
            <span className="text-[#dae2fd] font-semibold">{agent.apmcLicense}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#899389]">{language === 'kn' ? 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್:' : 'Registered Phone:'}</span>
            <span className="text-[#8bd79f] font-semibold">{agent.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#899389]">{language === 'kn' ? 'ವ್ಯಾಪಾರಿ ರೇಟಿಂಗ್:' : 'Trader Trust Score:'}</span>
            <span className="text-[#ffb77d]">★ {agent.rating} / 5.0</span>
          </div>
        </div>

        {callInitiated ? (
          <div className="mt-5 p-4 bg-[#1e6b3d]/30 border border-[#22c55e]/50 rounded-xl text-center">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto mb-2" />
            <h4 className="font-display text-sm font-bold text-[#dae2fd]">
              {language === 'kn' ? 'ನೇರ ಧ್ವನಿ ಸಂಪರ್ಕ ಕಲ್ಪಿಸಲಾಗಿದೆ' : 'Direct Audio Relay Connected'}
            </h4>
            <p className="text-xs text-[#8bd79f] font-mono mt-1">
              {language === 'kn' ? `${agent.phone} ಗೆ ಕರೆ ಹೋಗುತ್ತಿದೆ...` : `Calling ${agent.phone}... Trader line ringing.`}
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setCallInitiated(true)}
              className="h-11 w-full rounded-lg bg-[#22c55e] hover:bg-[#8bd79f] text-[#0b1326] font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>{t.actions.directDial}</span>
            </button>
            <p className="text-[11px] text-center text-[#899389] font-mono">
              {language === 'kn' ? 'ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿದ ಮಂಡಿ ವಿನಿಮಯದ ಮೂಲಕ ನೇರ ಕರೆ' : 'Direct connection via encrypted mandi trade exchange'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
