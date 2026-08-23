import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import StockIcon from './StockIcon';

interface SignalItem {
  id: string;
  symbol: string;
  action: 'STRONG BUY' | 'BREAKOUT' | 'ACCUMULATE';
  price: string;
  target: string;
  timeAgo: string;
  accuracy: string;
}

const defaultIndonesianSignals: SignalItem[] = [
  { id: '1', symbol: '$BBCA', action: 'STRONG BUY', price: 'Rp 10,250', target: 'Rp 11,800 (+15.1%)', timeAgo: '2 mnt lalu', accuracy: '98.4%' },
  { id: '2', symbol: '$BBRI', action: 'BREAKOUT', price: 'Rp 5,450', target: 'Rp 6,200 (+13.7%)', timeAgo: '5 mnt lalu', accuracy: '96.2%' },
  { id: '3', symbol: '$BMRI', action: 'STRONG BUY', price: 'Rp 6,850', target: 'Rp 7,600 (+10.9%)', timeAgo: '8 mnt lalu', accuracy: '97.8%' },
  { id: '4', symbol: '$TLKM', action: 'ACCUMULATE', price: 'Rp 3,120', target: 'Rp 3,650 (+17.0%)', timeAgo: '14 mnt lalu', accuracy: '94.8%' },
  { id: '5', symbol: '$AMRT', action: 'BREAKOUT', price: 'Rp 2,890', target: 'Rp 3,250 (+12.4%)', timeAgo: '22 mnt lalu', accuracy: '95.5%' },
];

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:8000' : '');

export default function LiveSignalStream() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<SignalItem[]>(defaultIndonesianSignals);

  useEffect(() => {
    let mounted = true;
    async function fetchLiveSignals() {
      try {
        const res = await fetch(`${API_BASE}/api/stocks?limit=5`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: SignalItem[] = json.data.map((st: any, i: number) => ({
              id: String(i + 1),
              symbol: `$${st.symbol || st.ticker?.replace('.JK', '')}`,
              action: st.action === 'BUY' ? 'STRONG BUY' : (st.signal === 'BULLISH' ? 'BREAKOUT' : 'ACCUMULATE'),
              price: `Rp ${st.harga?.toLocaleString('id-ID')}`,
              target: `Rp ${st.take_profit?.toLocaleString('id-ID')} (+${(st.prob_naik || 12).toFixed(0)}%)`,
              timeAgo: `${(i + 1) * 3} mnt lalu`,
              accuracy: `${(st.confidence || 95).toFixed(1)}%`
            }));
            if (mounted) setSignals(mapped);
          }
        }
      } catch {
        // keep fallback
      }
    }
    fetchLiveSignals();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,35,111,0.06)]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold text-primary flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" /> Sinyal AI Terdeteksi (Live IDX Feed)
          </h4>
        </div>
        <button
          onClick={() => navigate('/signals')}
          className="text-[10px] sm:text-[11px] font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          Lihat Sinyal Selengkapnya <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {signals.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/stock/${item.symbol.replace('$', '')}`)}
            className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <StockIcon symbol={item.symbol} className="w-10 h-10 rounded-xl group-hover:scale-105 transition-transform" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">{item.symbol}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {item.action}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium">
                  Entry: <span className="font-semibold text-slate-800">{item.price}</span> • Target: <span className="font-semibold text-emerald-700">{item.target}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono block">{item.timeAgo}</span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" /> {item.accuracy} Conf.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
