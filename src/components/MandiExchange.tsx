import React, { useState } from 'react';
import { 
  MandiCommodity, OrderBookEntry, CommissionAgent, FarmPlot 
} from '../types';
import { MANDI_TERMINALS } from '../data/mockData';
import { 
  TrendingUp, TrendingDown, Phone, Scale, Plus, Search 
} from 'lucide-react';
import mandiInspectionImg from '../assets/images/mandi_grain_inspection_1791364330341.jpg';
import { useLanguage } from '../context/LanguageContext';

interface MandiExchangeProps {
  commodities: MandiCommodity[];
  orderBook: OrderBookEntry[];
  commissionAgents: CommissionAgent[];
  plots: FarmPlot[];
  onOpenCreateLot: () => void;
  onCallAgent: (agent: CommissionAgent) => void;
  onPlaceQuickBid: (commodity: MandiCommodity) => void;
}

export const MandiExchange: React.FC<MandiExchangeProps> = ({
  commodities,
  orderBook,
  commissionAgents,
  onOpenCreateLot,
  onCallAgent,
  onPlaceQuickBid,
}) => {
  const { language, t } = useLanguage();
  const [selectedTerminal, setSelectedTerminal] = useState(MANDI_TERMINALS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ticker' | 'orderbook' | 'agents'>('ticker');

  const filteredCommodities = commodities.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.kannadaName && c.kannadaName.includes(searchQuery)) ||
      (c.hindiName && c.hindiName.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Mandi Market Terminal & Telemetry Ticker Header */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8bd79f] font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
              </span>
              <span>{t.mandi.badge}</span>
              <span className="text-[#899389]">·</span>
              <span className="text-[#bfc9be]">{t.mandi.sessionActive}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#dae2fd] mt-1 tracking-tight">
              {t.mandi.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#bfc9be] mt-0.5">
              {t.mandi.subtitle}
            </p>
          </div>

          {/* Action: Create Harvest Lot Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateLot}
              className="h-11 px-4 sm:px-5 rounded-lg bg-[#d97706] hover:bg-[#f59e0b] text-[#0b1326] font-mono text-xs sm:text-sm font-semibold flex items-center gap-2 border border-[#f59e0b] shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.actions.listHarvestLot}</span>
            </button>
          </div>
        </div>

        {/* Mandi Terminal Selector Segmented Bar */}
        <div className="mt-4 pt-4 border-t border-[#222a3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono text-[#899389] whitespace-nowrap">
            {t.mandi.selectYard}
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {MANDI_TERMINALS.map((term) => {
              const displayName = (language === 'kn' && term.nameKn) ? term.nameKn : term.name;
              return (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerminal(term.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                    selectedTerminal === term.id
                      ? 'bg-[#1e6b3d] border-[#22c55e] text-[#dae2fd] font-semibold'
                      : 'bg-[#131b2e] border-[#222a3d] text-[#bfc9be] hover:text-[#dae2fd] hover:border-[#404941]'
                  }`}
                >
                  {displayName} ({term.distanceKm} km)
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs: Tickers / Order Book / Licensed Agents */}
      <div className="flex items-center justify-between gap-4 border-b border-[#222a3d] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ticker')}
            className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'ticker'
                ? 'bg-[#171f33] text-[#ffb77d] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd]'
            }`}
          >
            {t.mandi.tabRates} ({commodities.length})
          </button>
          <button
            onClick={() => setActiveTab('orderbook')}
            className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'orderbook'
                ? 'bg-[#171f33] text-[#8bd79f] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd]'
            }`}
          >
            {t.mandi.tabOrderBook} ({orderBook.length})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'agents'
                ? 'bg-[#171f33] text-[#dae2fd] border border-[#222a3d]'
                : 'text-[#bfc9be] hover:text-[#dae2fd]'
            }`}
          >
            {t.mandi.tabAgents} ({commissionAgents.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#899389]" />
          <input
            type="text"
            placeholder={t.mandi.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131b2e] border border-[#222a3d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#dae2fd] placeholder:text-[#899389] focus:outline-none focus:border-[#22c55e] font-mono"
          />
        </div>
      </div>

      {/* Tab Content 1: Dual-Column Live Mandi Ticker Cards */}
      {activeTab === 'ticker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommodities.map((comm) => {
            const isPositive = comm.changePct >= 0;
            const commodityTitle = language === 'kn' && comm.kannadaName ? comm.kannadaName : comm.name;
            const commoditySubtitle = language === 'kn' && comm.kannadaVariety ? comm.kannadaVariety : comm.variety;

            return (
              <div
                key={comm.id}
                className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 hover:border-[#404941] transition-all shadow-md flex flex-col justify-between"
              >
                {/* Dual Column Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  {/* Left Column: Crop Category, Variety, Hindi/Kannada name, Arrival volume */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#899389]">
                        {comm.category}
                      </span>
                      {language === 'kn' && comm.hindiName && (
                        <>
                          <span className="text-[#404941]">·</span>
                          <span className="text-xs text-[#ffb77d]">{comm.name}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-[#dae2fd] mt-0.5">
                      {commodityTitle}
                    </h3>
                    <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
                      {commoditySubtitle}
                    </p>

                    <div className="mt-3 space-y-1 text-xs font-mono text-[#899389]">
                      <div className="flex items-center justify-between">
                        <span>{t.mandi.arrivalsToday}</span>
                        <span className="text-[#dae2fd] font-semibold tabular-nums">
                          {comm.arrivalsTodayMT.toLocaleString()} MT
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{t.mandi.moistureTest}</span>
                        <span className="text-[#8bd79f] tabular-nums">
                          {comm.avgMoisturePct}% (Max {comm.standardMoistureLimitPct}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span>{t.mandi.tradingVolume}</span>
                        <span className="text-[#bfc9be] tabular-nums">
                          {comm.tradingVolumeBags.toLocaleString()} bags
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Prominent Tabular Rates, Daily High/Low, CTAs */}
                  <div className="sm:text-right flex flex-col justify-between h-full sm:border-l sm:border-[#222a3d] sm:pl-3">
                    <div>
                      <div className="flex sm:justify-end items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                        </span>
                        <span className="text-[11px] font-mono text-[#899389]">
                          {comm.lastTradeTime}
                        </span>
                      </div>

                      {/* Prominent Tabular Rupee / Quintal Valuation */}
                      <div className="mt-1 flex sm:justify-end items-baseline gap-1.5">
                        <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#ffb77d] tabular-nums">
                          ₹{comm.currentRateQtl.toLocaleString('en-IN')}
                        </span>
                        <span className="font-mono text-xs text-[#899389]">/Qtl</span>
                      </div>

                      {/* Daily Change Badge */}
                      <div className="mt-1 flex sm:justify-end items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                            isPositive
                              ? 'bg-[#1e6b3d]/40 text-[#8bd79f] border border-[#22c55e]/30'
                              : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 text-[#22c55e]" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-[#ffb4ab]" />
                          )}
                          <span>
                            {isPositive ? '+' : ''}
                            {comm.changePct.toFixed(2)}%
                          </span>
                        </span>
                      </div>

                      {/* High / Low Daily Spread */}
                      <div className="mt-2 text-[11px] font-mono text-[#899389] flex sm:justify-end gap-2">
                        <span>L: ₹{comm.minRateQtl.toLocaleString('en-IN')}</span>
                        <span>·</span>
                        <span>H: ₹{comm.maxRateQtl.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Instant Action CTA */}
                    <div className="mt-4 flex items-center sm:justify-end gap-2">
                      <button
                        onClick={() => onPlaceQuickBid(comm)}
                        className="flex-1 sm:flex-initial h-9 px-3 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs font-semibold flex items-center justify-center gap-1 border border-[#22c55e]/30 transition-all"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{t.actions.placeYardBid}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content 2: Dynamic Order Book */}
      {activeTab === 'orderbook' && (
        <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#dae2fd]">
                {t.mandi.tabOrderBook}
              </h3>
              <p className="text-xs text-[#bfc9be] font-mono">
                Matching live wholesale orders across mandi platforms
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8bd79f]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span>
              <span>{t.mandi.matchingLive}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#131b2e] text-[#899389] uppercase tracking-wider border-b border-[#222a3d]">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Quantity (Qtl)</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹/Qtl)</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222a3d]">
                {orderBook.map((order) => {
                  const isBid = order.type === 'bid';
                  return (
                    <tr key={order.id} className="hover:bg-[#131b2e]/60 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isBid
                              ? 'bg-[#1e6b3d]/40 text-[#8bd79f] border border-[#22c55e]/30'
                              : 'bg-[#904c00]/40 text-[#ffb77d] border border-[#d97706]/30'
                          }`}
                        >
                          {isBid ? 'BUY BID' : 'SELL ASK'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#dae2fd]">
                        {order.entityName}
                      </td>
                      <td className="py-3 px-3 text-[#bfc9be]">
                        {order.badge}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-[#dae2fd] tabular-nums">
                        {order.quantityQtl.toLocaleString()} Qtl
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums text-sm text-[#ffb77d]">
                        ₹{order.priceQtl.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right text-[#899389]">
                        {order.time}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Licensed Commission Agents */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commissionAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#899389]">
                  <span className="text-[#8bd79f] font-semibold flex items-center gap-1">
                    APMC VERIFIED
                  </span>
                  <span>★ {agent.rating}</span>
                </div>

                <h4 className="font-display text-base font-bold text-[#dae2fd] mt-2">
                  {agent.name}
                </h4>
                <p className="text-xs text-[#bfc9be] font-mono mt-0.5">
                  {agent.shopNo} · {agent.mandiYard}
                </p>

                <div className="mt-3 p-2 bg-[#131b2e] rounded-lg border border-[#222a3d] text-xs font-mono">
                  <div className="text-[10px] text-[#899389]">License:</div>
                  <div className="text-[#dae2fd] font-semibold">{agent.apmcLicense}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222a3d]">
                <button
                  onClick={() => onCallAgent(agent)}
                  className="w-full h-10 rounded-lg bg-[#1e6b3d] hover:bg-[#22c55e] hover:text-[#0b1326] text-[#dae2fd] font-mono text-xs font-semibold flex items-center justify-center gap-2 border border-[#22c55e]/30 shadow transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t.actions.directDial}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Inspection Banner */}
      <div className="bg-[#171f33] border border-[#222a3d] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5">
        <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden border border-[#222a3d] shrink-0">
          <img
            src={mandiInspectionImg}
            alt="Physical grain inspection in mandi auction yard"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#ffb77d]">
            QUALITY CERTIFICATION ASSURANCE
          </span>
          <h3 className="font-display text-lg font-bold text-[#dae2fd] mt-1">
            {t.mandi.qualityCertTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#bfc9be] mt-1 leading-relaxed">
            {t.mandi.qualityCertDesc}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[#8bd79f]">
            <span>✓ Moisture &lt;12.0%</span>
            <span>✓ Zero foreign chaff</span>
            <span>✓ APMC e-Gatepass</span>
          </div>
        </div>
      </div>
    </div>
  );
};
