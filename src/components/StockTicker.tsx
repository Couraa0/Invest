import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import StockIcon from './StockIcon';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  aiSignal?: 'STRONG BUY' | 'BULLISH' | 'ACCUMULATE';
}

const defaultIndonesianTickers: TickerItem[] = [
  { symbol: 'IHSG', name: 'Indeks Saham BEI', price: '7,842.15', change: '+1.14%', isUp: true, aiSignal: 'BULLISH' },
  { symbol: 'BBCA', name: 'Bank Central Asia', price: 'Rp 10,250', change: '+2.40%', isUp: true, aiSignal: 'STRONG BUY' },
  { symbol: 'BBRI', name: 'Bank Rakyat Indonesia', price: 'Rp 5,450', change: '+1.85%', isUp: true, aiSignal: 'STRONG BUY' },
  { symbol: 'BMRI', name: 'Bank Mandiri', price: 'Rp 6,850', change: '+2.10%', isUp: true, aiSignal: 'STRONG BUY' },
  { symbol: 'TLKM', name: 'Telkom Indonesia', price: 'Rp 3,120', change: '-0.65%', isUp: false },
  { symbol: 'ASII', name: 'Astra International', price: 'Rp 5,100', change: '+3.10%', isUp: true, aiSignal: 'BULLISH' },
  { symbol: 'AMRT', name: 'Sumber Alfaria', price: 'Rp 2,890', change: '+1.40%', isUp: true, aiSignal: 'ACCUMULATE' },
  { symbol: 'ICBP', name: 'Indofood CBP', price: 'Rp 11,400', change: '+1.78%', isUp: true, aiSignal: 'ACCUMULATE' },
  { symbol: 'GOTO', name: 'GoTo Tokopedia', price: 'Rp 68', change: '+4.61%', isUp: true, aiSignal: 'BULLISH' },
];

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:8000' : '');

export default function StockTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(defaultIndonesianTickers);

  useEffect(() => {
    let isMounted = true;
    async function fetchRealPrices() {
      try {
        const res = await fetch(`${API_BASE}/api/stocks?limit=8`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: TickerItem[] = json.data.map((item: any) => ({
              symbol: item.symbol || item.ticker?.replace('.JK', '') || 'BEI',
              name: item.name || 'Saham Indonesia',
              price: item.harga ? `Rp ${item.harga.toLocaleString('id-ID')}` : 'Rp 0',
              change: item.change_pct ? `${item.change_pct >= 0 ? '+' : ''}${item.change_pct.toFixed(2)}%` : '0%',
              isUp: (item.change_pct ?? 0) >= 0,
              aiSignal: item.action === 'BUY' ? 'STRONG BUY' : (item.signal === 'BULLISH' ? 'BULLISH' : 'ACCUMULATE')
            }));
            if (isMounted) setTickers(mapped);
          }
        }
      } catch {
        // Fallback to defaults
      }
    }
    fetchRealPrices();
    return () => { isMounted = false; };
  }, []);

  const displayItems = [...tickers, ...tickers];

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 py-2 overflow-hidden select-none text-xs font-mono">
      <div className="flex animate-marquee items-center space-x-8">
        {displayItems.map((item, idx) => (
          <div key={`${item.symbol}-${idx}`} className="flex items-center space-x-2 shrink-0 hover:text-white transition-colors cursor-pointer group">
            <StockIcon symbol={item.symbol} className="w-5 h-5 rounded-md p-0.5 border-0 shadow-none bg-white" />
            <span className="font-bold text-white tracking-wide group-hover:text-emerald-400 transition-colors">
              {item.symbol}
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">{item.name}</span>
            <span className="font-semibold text-slate-200">{item.price}</span>
            <span
              className={`flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded ${
                item.isUp
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {item.isUp ? (
                <TrendingUp className="w-3 h-3 mr-0.5" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-0.5" />
              )}
              {item.change}
            </span>
            {item.aiSignal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                <Zap className="w-2.5 h-2.5 fill-cyan-300" />
                {item.aiSignal}
              </span>
            )}
            <span className="text-slate-700 mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
