import React from 'react';
import { Radio, MapPin, Activity, ShieldCheck, DollarSign, Sprout, CloudRain } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: 'map' | 'mandi' | 'agronomy' | 'cadastral' | 'weather';
  setActiveTab: (tab: 'map' | 'mandi' | 'agronomy' | 'cadastral' | 'weather') => void;
  rtkStatus: 'fix' | 'float' | 'single';
  onLogVertex: () => void;
  isSurveyMode: boolean;
  setIsSurveyMode: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLogVertex,
  isSurveyMode,
  setIsSurveyMode,
}) => {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1326]/95 backdrop-blur-md border-b border-[#222a3d] px-4 lg:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#1e6b3d] flex items-center justify-center border border-[#22c55e]/40 shadow-inner">
            <Sprout className="w-5 h-5 text-[#8bd79f]" />
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-left font-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-[#dae2fd] hover:text-[#8bd79f] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]"
          >
            {t.appName}
          </button>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-[#171f33] text-[#8bd79f] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            {t.tabs.map}
          </button>

          <button
            onClick={() => setActiveTab('mandi')}
            className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mandi'
                ? 'bg-[#171f33] text-[#ffb77d] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            {t.tabs.mandi}
          </button>

          <button
            onClick={() => setActiveTab('agronomy')}
            className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'agronomy'
                ? 'bg-[#171f33] text-[#8bd79f] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {t.tabs.agronomy}
          </button>

          <button
            onClick={() => setActiveTab('cadastral')}
            className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cadastral'
                ? 'bg-[#171f33] text-[#8bd79f] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.tabs.cadastral}
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-2 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'weather'
                ? 'bg-[#171f33] text-[#22c55e] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd] hover:bg-[#131b2e]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-[#22c55e]" />
            {t.tabs.weather}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + Language Toggle */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Bilingual Language Switcher (EN / ಕನ್ನಡ) */}
          <div className="flex items-center bg-[#131b2e] border border-[#222a3d] rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                language === 'en'
                  ? 'bg-[#1e6b3d] text-[#dae2fd] font-bold shadow-sm'
                  : 'text-[#899389] hover:text-[#dae2fd]'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('kn')}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                language === 'kn'
                  ? 'bg-[#1e6b3d] text-[#dae2fd] font-bold shadow-sm'
                  : 'text-[#899389] hover:text-[#dae2fd]'
              }`}
              title="ಕನ್ನಡ (Kannada)"
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* RTK Lock Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#131b2e] border border-[#222a3d] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
            </span>
            <span className="text-[#8bd79f] font-semibold tracking-wider">{t.rtk.fixStatus}</span>
            <span className="text-[#899389] hidden lg:inline">±0.018m</span>
          </div>

          {/* Primary Survey Gloved-Thumb Action Button */}
          {activeTab === 'map' ? (
            <button
              onClick={() => {
                if (!isSurveyMode) {
                  setIsSurveyMode(true);
                } else {
                  onLogVertex();
                }
              }}
              className="h-10 px-3.5 sm:px-4 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 border border-[#22c55e]/30 shadow-md transition-all active:scale-95 whitespace-nowrap"
              title="Add current RTK coordinate as polygon vertex"
            >
              <Radio className="w-4 h-4 text-[#8bd79f] animate-pulse" />
              <span>{isSurveyMode ? t.actions.logGpsVertex : t.actions.startSurvey}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('map')}
              className="h-10 px-3.5 sm:px-4 rounded-lg bg-[#171f33] hover:bg-[#222a3d] text-[#dae2fd] font-mono text-xs sm:text-sm font-medium flex items-center gap-2 border border-[#222a3d] transition-all whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#8bd79f]" />
              <span className="hidden sm:inline">{t.actions.backToGis}</span>
              <span className="sm:hidden">{t.tabs.map}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around pt-2.5 mt-2 border-t border-[#222a3d]/80 text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`py-1 px-2 font-medium rounded ${activeTab === 'map' ? 'text-[#8bd79f] font-semibold' : 'text-[#bfc9be]'}`}
        >
          {t.tabs.map}
        </button>
        <button
          onClick={() => setActiveTab('mandi')}
          className={`py-1 px-2 font-medium rounded ${activeTab === 'mandi' ? 'text-[#ffb77d] font-semibold' : 'text-[#bfc9be]'}`}
        >
          {t.tabs.mandi}
        </button>
        <button
          onClick={() => setActiveTab('agronomy')}
          className={`py-1 px-2 font-medium rounded ${activeTab === 'agronomy' ? 'text-[#8bd79f] font-semibold' : 'text-[#bfc9be]'}`}
        >
          {t.tabs.agronomy}
        </button>
        <button
          onClick={() => setActiveTab('cadastral')}
          className={`py-1 px-2 font-medium rounded ${activeTab === 'cadastral' ? 'text-[#8bd79f] font-semibold' : 'text-[#bfc9be]'}`}
        >
          {t.tabs.cadastral}
        </button>
        <button
          onClick={() => setActiveTab('weather')}
          className={`py-1 px-2 font-medium rounded ${activeTab === 'weather' ? 'text-[#22c55e] font-semibold' : 'text-[#bfc9be]'}`}
        >
          {t.tabs.weather}
        </button>
      </div>
    </header>
  );
};
