import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  History, Briefcase, Trophy, BarChart2, Search, X, Plus, Minus,
  RefreshCw, AlertCircle, CheckCircle2, ShoppingCart, ChevronDown,
  Info, RotateCcw, Zap, LineChart, Activity, Target,
  ChevronsUp, ChevronsDown, Sparkles,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTrading } from '../context/TradingContext';
import StockIcon from '../components/StockIcon';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  CartesianGrid, ReferenceLine, LineChart as RechartLineChart, Line,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000';

interface LiveStock {
  ticker: string;
  symbol: string;
  name: string;
  harga: number;
  change_pct: number;
  signal: string;
  action: string;
  confidence: number;
  category: string;
  take_profit?: number;
  stop_loss?: number;
  prob_naik?: number;
  prob_turun?: number;
  rsi?: number;
  rsi_status?: string;
  macd_status?: string;
  strength?: string;
}

interface ChartPoint {
  name: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRp(v: number, short = false): string {
  if (short) {
    if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`;
    if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(1)}jt`;
    if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}rb`;
    return `Rp ${v.toFixed(0)}`;
  }
  return `Rp ${v.toLocaleString('id-ID')}`;
}

function formatPrice(v: number): string {
  if (v >= 1000) return v.toLocaleString('id-ID');
  return v.toFixed(0);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function formatLabel(time: string, period: string): string {
  try {
    const d = new Date(time);
    if (period === '1D') return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (period === '1W') return d.toLocaleDateString('id-ID', { weekday: 'short' });
    if (period === '5Y') return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  } catch { return time; }
}

// ─── Monte Carlo Price Simulation ─────────────────────────────────────────────

function generateSimulation(basePrice: number, days: number, drift: number, volatility: number): { day: string; price: number; sim?: number }[] {
  const result: { day: string; price: number; sim?: number }[] = [];
  let price = basePrice;
  for (let i = 0; i <= days; i++) {
    const rand = (Math.random() - 0.5) * 2;
    const daily = drift / 252 + (volatility / Math.sqrt(252)) * rand;
    price = price * Math.exp(daily);
    result.push({
      day: `H+${i}`,
      price: Math.round(price),
    });
  }
  return result;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast { id: string; message: string; type: 'success' | 'error' }

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={cn(
              'flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto max-w-xs',
              t.type === 'success' ? 'bg-secondary text-white' : 'bg-red-500 text-white'
            )}
          >
            {t.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="leading-snug">{t.message}</span>
            <button onClick={() => onDismiss(t.id)} className="ml-1 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Stock Chart + Simulator Panel ───────────────────────────────────────────

function StockChartPanel({
  stock,
  onClose,
  onBuy,
  onSell,
  ownedLots,
}: {
  stock: LiveStock;
  onClose: () => void;
  onBuy: () => void;
  onSell: () => void;
  ownedLots: number;
}) {
  const [activeRange, setActiveRange] = useState('1M');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'sim'>('chart');

  // Simulation state
  const [simDays, setSimDays] = useState(30);
  const [simDrift, setSimDrift] = useState(stock.signal === 'BULLISH' ? 0.15 : -0.1);
  const [simVol, setSimVol] = useState(0.25);
  const [simData, setSimData] = useState<{ day: string; price: number }[]>([]);
  const [simCount, setSimCount] = useState(0);

  const isBullish = stock.signal === 'BULLISH';
  const primaryColor = isBullish ? '#006c49' : '#ef4444';

  // Fetch chart data
  useEffect(() => {
    const fetchChart = async () => {
      setChartLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/stocks/${stock.symbol}?period=${activeRange}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const raw = json.chart ?? [];
        setChartData(raw.map((p: { time: string; close: number; open: number; high: number; low: number; volume: number }) => ({
          name: formatLabel(p.time, activeRange),
          price: p.close,
          open: p.open,
          high: p.high,
          low: p.low,
          volume: p.volume,
        })));
      } catch {
        // Generate placeholder if server not available
        const placeholder: ChartPoint[] = [];
        let p = stock.harga;
        for (let i = 30; i >= 0; i--) {
          p = p * (1 + (Math.random() - 0.5) * 0.02);
          placeholder.push({ name: `H-${i}`, price: Math.round(p) });
        }
        setChartData(placeholder.reverse());
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [stock.symbol, activeRange]);

  const runSimulation = useCallback(() => {
    const result = generateSimulation(stock.harga, simDays, simDrift, simVol);
    setSimData(result);
    setSimCount(c => c + 1);
  }, [stock.harga, simDays, simDrift, simVol]);

  useEffect(() => {
    if (activeTab === 'sim') runSimulation();
  }, [activeTab, runSimulation]);

  const simFinal = simData[simData.length - 1]?.price ?? stock.harga;
  const simChange = ((simFinal - stock.harga) / stock.harga) * 100;
  const simProfit = ownedLots > 0
    ? (simFinal - stock.harga) * ownedLots * 100
    : 0;

  const chartMin = chartData.length > 0
    ? Math.min(...chartData.map(d => d.price)) * 0.995
    : 0;
  const chartMax = chartData.length > 0
    ? Math.max(...chartData.map(d => d.price)) * 1.005
    : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <StockIcon symbol={stock.symbol} className="w-10 h-10" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-primary">{stock.symbol}</p>
                <span className={cn(
                  'px-2 py-0.5 rounded-lg text-[10px] font-bold border',
                  isBullish ? 'bg-secondary/10 text-secondary border-secondary/15' : 'bg-error/10 text-error border-error/15'
                )}>{stock.action}</span>
              </div>
              <p className="text-xs text-on-surface-variant/50 truncate max-w-[200px]">{stock.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-primary">Rp {formatPrice(stock.harga)}</p>
              <p className={cn('text-xs font-semibold flex items-center justify-end gap-1', stock.change_pct >= 0 ? 'text-secondary' : 'text-error')}>
                {stock.change_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.change_pct >= 0 ? '+' : ''}{stock.change_pct.toFixed(2)}%
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-on-surface-variant transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-slate-100 shrink-0">
          {[
            { id: 'chart', label: 'Grafik Harga', icon: LineChart },
            { id: 'sim', label: 'Simulasi Harga', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'chart' | 'sim')}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 -mb-px transition-all',
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-on-surface-variant/50 border-transparent hover:text-primary'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'chart' ? (
              <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                {/* Period selector */}
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    {['1D', '1W', '1M', '1Y', '5Y'].map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveRange(t)}
                        className={cn(
                          'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                          t === activeRange ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-primary'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {chartLoading && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
                </div>

                {/* Chart */}
                <div className="h-56">
                  {chartLoading ? (
                    <div className="h-full animate-pulse flex items-end gap-1">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-1 bg-slate-100 rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
                      ))}
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                        <YAxis
                          domain={[chartMin, chartMax]}
                          tick={{ fontSize: 10, fill: '#94a3b8' }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={v => formatRp(v, true)}
                          width={56}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                          formatter={(val: number) => [`Rp ${formatPrice(val)}`, 'Harga']}
                        />
                        {/* Take profit & stop loss reference lines */}
                        {stock.take_profit && (
                          <ReferenceLine y={stock.take_profit} stroke="#006c49" strokeDasharray="4 4" strokeWidth={1.5}
                            label={{ value: 'TP', position: 'right', fontSize: 9, fill: '#006c49' }}
                          />
                        )}
                        {stock.stop_loss && (
                          <ReferenceLine y={stock.stop_loss} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5}
                            label={{ value: 'SL', position: 'right', fontSize: 9, fill: '#ef4444' }}
                          />
                        )}
                        <Area type="monotone" dataKey="price" stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" dot={false} animationDuration={800} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Key levels */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Harga Sekarang', val: `Rp ${formatPrice(stock.harga)}`, color: 'text-primary' },
                    { label: 'Take Profit (+3%)', val: stock.take_profit ? `Rp ${formatPrice(stock.take_profit)}` : '—', color: 'text-secondary' },
                    { label: 'Stop Loss (-2%)', val: stock.stop_loss ? `Rp ${formatPrice(stock.stop_loss)}` : '—', color: 'text-error' },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 bg-slate-50 rounded-xl">
                      <p className="text-[10px] text-on-surface-variant/50 mb-1">{item.label}</p>
                      <p className={cn('text-sm font-bold', item.color)}>{item.val}</p>
                    </div>
                  ))}
                </div>

                {/* Technical Indicators */}
                {stock.rsi && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'RSI (14)', val: stock.rsi?.toFixed(1), status: stock.rsi_status, good: stock.rsi_status === 'Normal' },
                      { label: 'MACD', val: stock.macd_status, status: stock.macd_status, good: stock.macd_status === 'Bullish' },
                      { label: 'Confidence', val: `${stock.confidence.toFixed(0)}%`, status: stock.strength, good: stock.confidence >= 60 },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-on-surface-variant/50 mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-primary">{item.val}</p>
                        <span className={cn(
                          'text-[9px] font-bold uppercase tracking-wider',
                          item.good ? 'text-secondary' : 'text-error'
                        )}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                {/* Simulation Result Banner */}
                <div className={cn(
                  'rounded-2xl p-4 border',
                  simChange >= 0 ? 'bg-secondary/6 border-secondary/12' : 'bg-error/6 border-error/12'
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-on-surface-variant/60 font-medium">Prediksi harga dalam {simDays} hari</p>
                    {simChange >= 0
                      ? <ChevronsUp className="w-5 h-5 text-secondary" />
                      : <ChevronsDown className="w-5 h-5 text-error" />
                    }
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">Rp {formatPrice(simFinal)}</p>
                      <p className={cn('text-sm font-bold', simChange >= 0 ? 'text-secondary' : 'text-error')}>
                        {simChange >= 0 ? '+' : ''}{simChange.toFixed(2)}%
                      </p>
                    </div>
                    {ownedLots > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant/50">Est. P&L ({ownedLots} lot)</p>
                        <p className={cn('text-lg font-bold', simProfit >= 0 ? 'text-secondary' : 'text-error')}>
                          {simProfit >= 0 ? '+' : ''}{formatRp(simProfit, true)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulation Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartLineChart data={simData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={Math.floor(simDays / 5)} />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => formatRp(v, true)}
                        width={56}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        formatter={(val: number) => [`Rp ${formatPrice(val)}`, 'Proyeksi']}
                      />
                      <ReferenceLine y={stock.harga} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1}
                        label={{ value: 'Harga Kini', position: 'right', fontSize: 9, fill: '#64748b' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={simChange >= 0 ? '#006c49' : '#ef4444'}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={600}
                        key={simCount} // re-animate on re-run
                      />
                    </RechartLineChart>
                  </ResponsiveContainer>
                </div>

                {/* Simulation Controls */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> Parameter Simulasi
                  </p>

                  {/* Drift (Annual Return) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-on-surface-variant/70 font-medium">
                        Proyeksi Return Tahunan
                      </label>
                      <span className={cn('text-sm font-bold tabular-nums', simDrift >= 0 ? 'text-secondary' : 'text-error')}>
                        {simDrift >= 0 ? '+' : ''}{(simDrift * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-0.5}
                      max={0.5}
                      step={0.05}
                      value={simDrift}
                      onChange={e => setSimDrift(Number(e.target.value))}
                      className="w-full h-2 rounded-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant/40 mt-1">
                      <span>-50% (Bearish)</span>
                      <span>0%</span>
                      <span>+50% (Bullish)</span>
                    </div>
                    {/* Preset buttons */}
                    <div className="flex gap-2 mt-2">
                      {[
                        { label: '🐻 -20%', v: -0.2 },
                        { label: '📉 -10%', v: -0.1 },
                        { label: '→ 0%',   v: 0 },
                        { label: '📈 +15%', v: 0.15 },
                        { label: '🚀 +30%', v: 0.3 },
                      ].map(p => (
                        <button
                          key={p.label}
                          onClick={() => setSimDrift(p.v)}
                          className={cn(
                            'flex-1 py-1 rounded-lg text-[10px] font-semibold border transition-all',
                            Math.abs(simDrift - p.v) < 0.01
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-slate-200 text-on-surface-variant hover:border-primary/20 hover:text-primary'
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volatility */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-on-surface-variant/70 font-medium">
                        Volatilitas (Ketidakpastian)
                      </label>
                      <span className="text-sm font-bold text-primary tabular-nums">
                        {(simVol * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.8}
                      step={0.05}
                      value={simVol}
                      onChange={e => setSimVol(Number(e.target.value))}
                      className="w-full h-2 rounded-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-on-surface-variant/40 mt-1">
                      <span>5% (Stabil)</span>
                      <span>40% (Normal)</span>
                      <span>80% (Ekstrem)</span>
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-on-surface-variant/70 font-medium">
                        Horizon Waktu
                      </label>
                      <span className="text-sm font-bold text-primary">{simDays} hari</span>
                    </div>
                    <div className="flex gap-2">
                      {[7, 14, 30, 60, 90].map(d => (
                        <button
                          key={d}
                          onClick={() => setSimDays(d)}
                          className={cn(
                            'flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                            simDays === d
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-slate-200 text-on-surface-variant hover:border-primary/20'
                          )}
                        >
                          {d}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Run button */}
                  <button
                    onClick={runSimulation}
                    className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] shadow-md"
                  >
                    <Sparkles className="w-4 h-4" /> Jalankan Simulasi Ulang
                  </button>

                  <p className="text-[10px] text-on-surface-variant/40 text-center leading-relaxed">
                    ⚠️ Simulasi menggunakan model geometric Brownian motion. Bukan prediksi nyata. Untuk latihan & edukasi saja.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
          {ownedLots > 0 && (
            <button
              onClick={onSell}
              className="flex-1 py-2.5 border border-error/20 bg-error/6 text-error rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-error/10 transition-all"
            >
              <TrendingDown className="w-4 h-4" /> Jual ({ownedLots} lot)
            </button>
          )}
          <button
            onClick={onBuy}
            className="flex-1 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20"
          >
            <ShoppingCart className="w-4 h-4" /> Beli Sekarang
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Trade Modal ──────────────────────────────────────────────────────────────

function TradeModal({
  stock, mode, onClose, onSuccess, maxLotsToSell = 0,
}: {
  stock: LiveStock;
  mode: 'BUY' | 'SELL';
  onClose: () => void;
  onSuccess: (msg: string, type: 'success' | 'error') => void;
  maxLotsToSell?: number;
}) {
  const { buyStock, sellStock, cash } = useTrading();
  const [lots, setLots] = useState(1);
  const [loading, setLoading] = useState(false);

  const price = stock.harga;
  const shares = lots * 100;
  const totalValue = price * shares;
  const maxAffordable = Math.floor(cash / (price * 100));
  const isSell = mode === 'SELL';
  const maxLots = isSell ? maxLotsToSell : maxAffordable;
  const canSubmit = lots >= 1 && lots <= maxLots && !loading && (isSell || totalValue <= cash);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = mode === 'BUY'
      ? buyStock(stock.symbol, stock.name, price, lots)
      : sellStock(stock.symbol, lots, price);
    setLoading(false);
    onSuccess(result.message, result.success ? 'success' : 'error');
    if (result.success) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className={cn(
          'px-6 py-4 flex items-center justify-between',
          isSell ? 'bg-error/8 border-b border-error/10' : 'bg-secondary/8 border-b border-secondary/10'
        )}>
          <div className="flex items-center gap-3">
            <StockIcon symbol={stock.symbol} className="w-10 h-10" />
            <div>
              <p className="font-bold text-primary text-sm">{stock.symbol}</p>
              <p className="text-[10px] text-on-surface-variant/50 truncate max-w-[160px]">{stock.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-bold',
              isSell ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
            )}>{mode}</span>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-on-surface-variant">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant/50 mb-0.5">Harga per lembar</p>
              <p className="text-xl font-bold text-primary">{formatRp(price)}</p>
              <p className={cn('text-xs font-semibold flex items-center gap-1', stock.change_pct >= 0 ? 'text-secondary' : 'text-error')}>
                {stock.change_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.change_pct >= 0 ? '+' : ''}{stock.change_pct.toFixed(2)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant/50 mb-0.5">{isSell ? 'Maks. dijual' : 'Maks. dibeli'}</p>
              <p className="text-sm font-bold text-primary">{maxLots} lot</p>
              {!isSell && <p className="text-[10px] text-on-surface-variant/40">Saldo: {formatRp(cash, true)}</p>}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-primary mb-2">Jumlah Lot (1 lot = 100 lembar)</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setLots(l => Math.max(1, l - 1))} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Minus className="w-4 h-4 text-primary" />
              </button>
              <input
                type="number" min={1} max={maxLots} value={lots}
                onChange={e => setLots(Math.max(1, Math.min(maxLots, Number(e.target.value))))}
                className="flex-1 h-10 text-center font-bold text-lg text-primary border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
              <button onClick={() => setLots(l => Math.min(maxLots, l + 1))} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Plus className="w-4 h-4 text-primary" />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {[1, 5, 10, 50].filter(v => v <= maxLots).map(v => (
                <button key={v} onClick={() => setLots(v)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                    lots === v ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-on-surface-variant hover:border-primary/20'
                  )}>
                  {v}L
                </button>
              ))}
              {maxLots > 0 && (
                <button onClick={() => setLots(maxLots)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                    lots === maxLots ? 'bg-primary text-white border-primary' : 'bg-white border-slate-200 text-on-surface-variant hover:border-primary/20'
                  )}>
                  Maks
                </button>
              )}
            </div>
          </div>

          <div className={cn('rounded-xl p-4 space-y-2', isSell ? 'bg-error/5 border border-error/10' : 'bg-secondary/5 border border-secondary/10')}>
            {[
              { label: 'Jumlah Lembar', val: `${shares.toLocaleString('id-ID')} lembar` },
              { label: 'Total Nilai', val: formatRp(totalValue), bold: true },
              ...(!isSell ? [{ label: 'Saldo Setelah', val: formatRp(cash - totalValue) }] : []),
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant/60">{row.label}</span>
                <span className={cn('text-xs font-semibold', row.bold ? 'text-primary text-sm font-bold' : 'text-primary/80')}>{row.val}</span>
              </div>
            ))}
          </div>

          {!isSell && totalValue > cash && (
            <p className="text-xs text-error flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Saldo tidak mencukupi
            </p>
          )}

          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]',
              !canSubmit ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400'
                : isSell ? 'bg-error text-white hover:bg-error/90 shadow-md shadow-error/20'
                : 'bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/20'
            )}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" />
              : isSell ? <TrendingDown className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {loading ? 'Memproses...' : `Konfirmasi ${mode} ${lots} Lot`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Stock Picker Panel ───────────────────────────────────────────────────────

function StockPicker({ onSelect, onClose }: {
  onSelect: (stock: LiveStock) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [stocks, setStocks] = useState<LiveStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingPrice, setFetchingPrice] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/stocks/categories`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const cats = json.categories as Record<string, { ticker: string; symbol: string; name: string }[]>;
        const all: LiveStock[] = [];
        for (const [, items] of Object.entries(cats)) {
          for (const item of items) {
            all.push({ ticker: item.ticker, symbol: item.symbol, name: item.name, harga: 0, change_pct: 0, signal: '', action: '', confidence: 0, category: '' });
          }
        }
        setStocks(all);
      } catch {
        setError('AI Server tidak terhubung.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = async (raw: LiveStock) => {
    setFetchingPrice(raw.symbol);
    try {
      const res = await fetch(`${API_BASE}/api/stocks/${raw.symbol}`);
      if (res.ok) {
        const json = await res.json();
        const pred = json.prediction;
        onSelect({ ...raw, ...pred });
      } else {
        onSelect({ ...raw, harga: 1000, change_pct: 0, signal: 'BULLISH', action: 'BUY', confidence: 50, category: '' });
      }
    } catch {
      onSelect({ ...raw, harga: 1000, change_pct: 0, signal: 'BULLISH', action: 'BUY', confidence: 50, category: '' });
    } finally {
      setFetchingPrice(null);
    }
  };

  const filtered = stocks.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
            <input
              autoFocus type="text" placeholder="Cari saham (BBCA, Telkom...)"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-on-surface-variant">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {loading && <div className="flex items-center justify-center py-12"><RefreshCw className="w-5 h-5 text-primary animate-spin" /></div>}
          {error && <div className="p-6 text-center"><AlertCircle className="w-8 h-8 text-error mx-auto mb-2" /><p className="text-xs text-on-surface-variant/60">{error}</p></div>}
          {!loading && !error && filtered.map(s => (
            <button key={s.symbol} onClick={() => handleSelect(s)} disabled={!!fetchingPrice}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
              <StockIcon symbol={s.symbol} className="w-9 h-9 shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className="font-bold text-sm text-primary">{s.symbol}</p>
                <p className="text-[10px] text-on-surface-variant/50 truncate">{s.name}</p>
              </div>
              {fetchingPrice === s.symbol
                ? <RefreshCw className="w-4 h-4 text-primary animate-spin shrink-0" />
                : <ChevronDown className="w-4 h-4 text-on-surface-variant/30 -rotate-90 shrink-0" />
              }
            </button>
          ))}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-center py-8 text-sm text-on-surface-variant/50">Saham tidak ditemukan</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Simulator ───────────────────────────────────────────────────────────

type ModalState =
  | { type: 'picker' }
  | { type: 'chart'; stock: LiveStock }
  | { type: 'trade'; stock: LiveStock; mode: 'BUY' | 'SELL'; maxLotsToSell?: number }
  | null;

type TabType = 'portfolio' | 'history';

// ─── IHSG Chart Component ─────────────────────────────────────────────────────

interface IHSGPoint { name: string; price: number }

function IHSGChart() {
  const [period, setPeriod] = useState('1M');
  const [data, setData] = useState<IHSGPoint[]>([]);
  const [ihsg, setIhsg] = useState<{ value: number; change: number; status: string; bullish: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/market/ihsg?period=${period}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        const d = json.data;
        setIhsg({ value: d.ihsg, change: d.change_pct, status: d.status, bullish: d.bullish_percent ?? 50 });
        // chart dari get_chart_data => { time, close, ... }
        const raw = d.chart ?? [];
        if (raw.length > 0 && raw[0].close !== undefined) {
          setData(raw.map((p: { time: string; close: number }) => ({
            name: formatLabel(p.time, period),
            price: p.close,
          })));
        } else {
          // fallback: data dari market/overview format { name, value }
          setData(raw.map((p: { name: string; value: number }) => ({ name: p.name, price: p.value })));
        }
      } catch {
        // offline fallback: generate dummy IHSG-like data
        const base = 7200;
        const pts: IHSGPoint[] = [];
        let v = base;
        for (let i = 30; i >= 0; i--) {
          v = v + (Math.random() - 0.48) * 40;
          pts.push({ name: `H-${i}`, price: Math.round(v) });
        }
        setData(pts);
        setIhsg({ value: pts[pts.length - 1].price, change: 0.42, status: 'Bullish', bullish: 62 });
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [period]);

  const isUp = (ihsg?.change ?? 0) >= 0;
  const primaryColor = isUp ? '#006c49' : '#ef4444';
  const chartMin = data.length > 0 ? Math.min(...data.map(d => d.price)) * 0.998 : 0;
  const chartMax = data.length > 0 ? Math.max(...data.map(d => d.price)) * 1.002 : 0;

  return (
    <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-8 card p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-primary">IHSG — Indeks Harga Saham Gabungan</h3>
            {ihsg && (
              <span className={cn(
                'px-2 py-0.5 rounded-lg text-[10px] font-bold border',
                isUp ? 'bg-secondary/10 text-secondary border-secondary/15' : 'bg-error/10 text-error border-error/15'
              )}>{ihsg.status}</span>
            )}
          </div>
          {ihsg ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary tabular-nums">{ihsg.value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</span>
              <span className={cn('text-sm font-bold flex items-center gap-1', isUp ? 'text-secondary' : 'text-error')}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isUp ? '+' : ''}{ihsg.change.toFixed(2)}%
              </span>
            </div>
          ) : (
            <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg" />
          )}
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {['1D','1W','1M','3M','1Y','5Y'].map(t => (
            <button key={t} onClick={() => setPeriod(t)}
              className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                t === period ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/50 hover:text-primary'
              )}>{t}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-52">
        {loading ? (
          <div className="h-full animate-pulse flex items-end gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t" style={{ height: `${35 + Math.random() * 55}%` }} />
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="ihsgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis
                domain={[chartMin, chartMax]}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => v.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                width={60}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                formatter={(v: number) => [v.toLocaleString('id-ID', { maximumFractionDigits: 2 }), 'IHSG']}
              />
              <Area type="monotone" dataKey="price" stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill="url(#ihsgGrad)" dot={false} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 mt-4">
        {[
          { label: 'IHSG Kini', value: ihsg ? ihsg.value.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : '—', color: 'text-primary' },
          { label: 'Sentimen Bullish', value: ihsg ? `${ihsg.bullish.toFixed(0)}%` : '—', color: isUp ? 'text-secondary' : 'text-error' },
          { label: 'Perubahan Hari Ini', value: ihsg ? `${ihsg.change >= 0 ? '+' : ''}${ihsg.change.toFixed(2)}%` : '—', color: isUp ? 'text-secondary' : 'text-error' },
        ].map((m, i) => (
          <div key={i}>
            <p className="text-[10px] text-on-surface-variant/50 mb-0.5">{m.label}</p>
            <p className={cn('text-lg font-bold', m.color)}>{m.value}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Main Simulator ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
};

export default function Simulator() {
  const {
    cash, totalPortfolioValue, totalPnL, totalPnLPct,
    positions, transactions, equityHistory, resetPortfolio, updatePrice,
  } = useTrading();

  const [modal, setModal] = useState<ModalState>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tab, setTab] = useState<TabType>('portfolio');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const priceUpdateRef = useRef(false);

  // Live price update every 60s
  useEffect(() => {
    const updatePrices = async () => {
      if (priceUpdateRef.current || positions.length === 0) return;
      priceUpdateRef.current = true;
      for (const pos of positions) {
        try {
          const res = await fetch(`${API_BASE}/api/stocks/${pos.symbol}`);
          if (res.ok) {
            const json = await res.json();
            updatePrice(pos.symbol, json.prediction.harga);
          }
        } catch { /* silent */ }
      }
      priceUpdateRef.current = false;
    };
    updatePrices();
    const timer = setInterval(updatePrices, 60_000);
    return () => clearInterval(timer);
  }, [positions.length, updatePrice]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = `${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const gainPct = ((totalPortfolioValue - 100_000_000) / 100_000_000) * 100;
  const winCount = transactions.filter(t => t.type === 'SELL' && (t.pnl ?? 0) > 0).length;
  const sellCount = transactions.filter(t => t.type === 'SELL').length;
  const winRate = sellCount > 0 ? (winCount / sellCount) * 100 : 0;

  const getOwnedLots = (symbol: string) => positions.find(p => p.symbol === symbol)?.lots ?? 0;

  const handleChartBuy = (stock: LiveStock) => {
    setModal({ type: 'trade', stock, mode: 'BUY' });
  };

  const handleChartSell = (stock: LiveStock) => {
    const pos = positions.find(p => p.symbol === stock.symbol);
    if (pos) setModal({ type: 'trade', stock: { ...stock, harga: pos.currentPrice }, mode: 'SELL', maxLotsToSell: pos.lots });
  };

  const handleSellClick = (symbol: string) => {
    const pos = positions.find(p => p.symbol === symbol);
    if (!pos) return;
    setModal({
      type: 'trade',
      stock: { ticker: `${symbol}.JK`, symbol: pos.symbol, name: pos.name, harga: pos.currentPrice, change_pct: pos.unrealizedPct, signal: pos.unrealizedPnL >= 0 ? 'BULLISH' : 'BEARISH', action: 'SELL', confidence: 0, category: '' },
      mode: 'SELL',
      maxLotsToSell: pos.lots,
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

      <AnimatePresence>
        {modal?.type === 'picker' && (
          <StockPicker
            onSelect={stock => setModal({ type: 'chart', stock })}
            onClose={() => setModal(null)}
          />
        )}
        {modal?.type === 'chart' && (
          <StockChartPanel
            stock={modal.stock}
            ownedLots={getOwnedLots(modal.stock.symbol)}
            onClose={() => setModal(null)}
            onBuy={() => handleChartBuy(modal.stock)}
            onSell={() => handleChartSell(modal.stock)}
          />
        )}
        {modal?.type === 'trade' && (
          <TradeModal
            stock={modal.stock}
            mode={modal.mode}
            maxLotsToSell={modal.maxLotsToSell}
            onClose={() => setModal(null)}
            onSuccess={addToast}
          />
        )}
      </AnimatePresence>

      {/* Reset Confirm */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-base font-bold text-primary text-center mb-2">Reset Portofolio?</h3>
              <p className="text-xs text-on-surface-variant/60 text-center mb-5">
                Semua posisi, riwayat, dan P&L akan dihapus. Saldo kembali ke Rp 100.000.000.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button onClick={() => { resetPortfolio(); setShowResetConfirm(false); addToast('Portofolio direset', 'success'); }}
                  className="flex-1 py-2.5 bg-error text-white rounded-xl text-sm font-semibold hover:bg-error/90 transition-colors">
                  Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 border border-secondary/12 text-secondary text-[10px] font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3 h-3 fill-current" /> Paper Trading Live
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Simulasi Trading</h1>
            <p className="text-sm text-on-surface-variant/60 mt-0.5">Beli & jual saham IDX · Chart & simulasi harga · Data real-time</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowResetConfirm(true)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-error hover:border-error/20 transition-all shadow-sm" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setModal({ type: 'picker' })} className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary/90 transition-all shadow-md shadow-secondary/20 active:scale-[0.97]">
              <ShoppingCart className="w-4 h-4" /> Beli Saham
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Portofolio', value: formatRp(totalPortfolioValue, true), sub: `${gainPct >= 0 ? '+' : ''}${gainPct.toFixed(2)}%`, icon: Wallet, up: gainPct >= 0 },
            { label: 'Unrealized P&L', value: formatRp(Math.abs(totalPnL), true), sub: `${totalPnLPct >= 0 ? '+' : ''}${totalPnLPct.toFixed(2)}%`, icon: totalPnL >= 0 ? TrendingUp : TrendingDown, up: totalPnL >= 0 },
            { label: 'Buying Power', value: formatRp(cash, true), sub: `${((cash / totalPortfolioValue) * 100).toFixed(0)}% kas`, icon: Briefcase, up: null as boolean | null },
            { label: 'Win Rate', value: `${winRate.toFixed(0)}%`, sub: `${winCount}/${sellCount} untung`, icon: Trophy, up: winRate >= 50 ? true : winRate > 0 ? false : null as boolean | null },
          ].map((stat, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="card p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.up === true && <ArrowUpRight className="w-4 h-4 text-secondary" />}
                {stat.up === false && <ArrowDownRight className="w-4 h-4 text-error" />}
              </div>
              <p className="text-[10px] text-on-surface-variant/50 font-medium mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className={cn('text-xs font-semibold mt-0.5', stat.up === true ? 'text-secondary' : stat.up === false ? 'text-error' : 'text-on-surface-variant/50')}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* IHSG Chart + Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <IHSGChart />

          <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-4 card p-6 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-on-surface-variant/40" />
                <h3 className="text-sm font-bold text-primary">Komposisi</h3>
              </div>
            </div>
            {positions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <Briefcase className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs text-on-surface-variant/50">Belum ada posisi</p>
                <button onClick={() => setModal({ type: 'picker' })} className="mt-3 text-xs text-primary font-semibold underline">
                  Beli saham sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {positions.map((pos, i) => {
                  const weight = (pos.currentPrice * pos.shares / totalPortfolioValue) * 100;
                  const colors = ['bg-primary', 'bg-secondary', 'bg-blue-400', 'bg-violet-400', 'bg-orange-400', 'bg-pink-400'];
                  return (
                    <div key={pos.symbol}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold text-primary">{pos.symbol}</span>
                        <span className="text-[10px] text-on-surface-variant/50">{weight.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${weight}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className={cn('h-full rounded-full', colors[i % colors.length])} />
                      </div>
                    </div>
                  );
                })}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-on-surface-variant/60">KAS</span>
                    <span className="text-[10px] text-on-surface-variant/50">{((cash / totalPortfolioValue) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(cash / totalPortfolioValue) * 100}%` }} transition={{ duration: 0.8, delay: 0.6 }} className="h-full rounded-full bg-slate-300" />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-on-surface-variant/50">Saldo Tersedia</p>
                <p className="text-sm font-bold text-primary">{formatRp(cash, true)}</p>
              </div>
              <button onClick={() => setModal({ type: 'picker' })} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/8 text-secondary rounded-lg text-xs font-semibold hover:bg-secondary/15 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Beli
              </button>
            </div>
          </motion.section>
        </div>

        {/* Portfolio + History Tabs */}
        <motion.section custom={6} variants={fadeUp} initial="hidden" animate="visible" className="card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-0 border-b border-slate-100">
            <div className="flex gap-1">
              {(['portfolio', 'history'] as TabType[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn('px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 -mb-px transition-all',
                    tab === t ? 'text-primary border-primary bg-white' : 'text-on-surface-variant/50 border-transparent hover:text-primary'
                  )}>
                  {t === 'portfolio' ? `Posisi Aktif (${positions.length})` : `Riwayat (${transactions.length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {tab === 'portfolio' ? (
                <motion.div key="portfolio" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {positions.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="font-semibold text-primary/50 mb-1">Belum ada posisi aktif</p>
                      <button onClick={() => setModal({ type: 'picker' })} className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-semibold">
                        <ShoppingCart className="w-4 h-4" /> Beli Saham Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100">
                            {['Saham', 'Lot', 'Harga Beli', 'Harga Kini', 'Nilai Pasar', 'P&L', 'Aksi'].map((h, i) => (
                              <th key={i} className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40 pb-3 pr-4 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {positions.map(pos => (
                            <tr key={pos.symbol} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3 pr-4">
                                <button
                                  onClick={() => setModal({ type: 'chart', stock: { ticker: `${pos.symbol}.JK`, symbol: pos.symbol, name: pos.name, harga: pos.currentPrice, change_pct: pos.unrealizedPct, signal: pos.unrealizedPnL >= 0 ? 'BULLISH' : 'BEARISH', action: pos.unrealizedPnL >= 0 ? 'BUY' : 'SELL', confidence: 0, category: '' } })}
                                  className="flex items-center gap-2.5 group"
                                >
                                  <StockIcon symbol={pos.symbol} className="w-8 h-8 shrink-0" />
                                  <div className="text-left">
                                    <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{pos.symbol}</p>
                                    <p className="text-[10px] text-on-surface-variant/40 truncate max-w-[90px]">{pos.name}</p>
                                  </div>
                                </button>
                              </td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary">{pos.lots}L</td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary whitespace-nowrap">{formatRp(pos.buyPrice)}</td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary whitespace-nowrap">{formatRp(pos.currentPrice)}</td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary whitespace-nowrap">{formatRp(pos.currentPrice * pos.shares, true)}</td>
                              <td className="py-3 pr-4">
                                <p className={cn('text-sm font-bold whitespace-nowrap', pos.unrealizedPnL >= 0 ? 'text-secondary' : 'text-error')}>
                                  {pos.unrealizedPnL >= 0 ? '+' : ''}{formatRp(pos.unrealizedPnL, true)}
                                </p>
                                <p className={cn('text-[10px] font-semibold', pos.unrealizedPct >= 0 ? 'text-secondary' : 'text-error')}>
                                  {pos.unrealizedPct >= 0 ? '+' : ''}{pos.unrealizedPct.toFixed(2)}%
                                </p>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setModal({ type: 'chart', stock: { ticker: `${pos.symbol}.JK`, symbol: pos.symbol, name: pos.name, harga: pos.currentPrice, change_pct: pos.unrealizedPct, signal: pos.unrealizedPnL >= 0 ? 'BULLISH' : 'BEARISH', action: pos.unrealizedPnL >= 0 ? 'BUY' : 'SELL', confidence: 0, category: '' } })}
                                    className="px-2 py-1.5 bg-primary/8 text-primary rounded-lg text-xs font-semibold hover:bg-primary/15 transition-colors flex items-center gap-1"
                                    title="Lihat chart"
                                  >
                                    <LineChart className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleSellClick(pos.symbol)}
                                    className="px-2 py-1.5 bg-error/8 text-error border border-error/15 rounded-lg text-xs font-semibold hover:bg-error/15 transition-colors flex items-center gap-1"
                                  >
                                    <Minus className="w-3 h-3" /> Jual
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="font-semibold text-primary/50">Belum ada transaksi</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100">
                            {['Saham', 'Tipe', 'Harga', 'Lot', 'Total', 'Realized P&L', 'Waktu'].map((h, i) => (
                              <th key={i} className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40 pb-3 pr-4 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-2">
                                  <StockIcon symbol={tx.symbol} className="w-8 h-8 shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-primary">{tx.symbol}</p>
                                    <p className="text-[10px] text-on-surface-variant/40 truncate max-w-[90px]">{tx.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4">
                                <span className={cn('px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase',
                                  tx.type === 'BUY' ? 'bg-secondary/10 text-secondary border border-secondary/15' : 'bg-error/10 text-error border border-error/15'
                                )}>{tx.type}</span>
                              </td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary whitespace-nowrap">{formatRp(tx.price)}</td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary">{tx.lots}L</td>
                              <td className="py-3 pr-4 text-sm font-semibold text-primary whitespace-nowrap">{formatRp(tx.totalValue, true)}</td>
                              <td className="py-3 pr-4">
                                {tx.type === 'SELL' && tx.pnl !== undefined ? (
                                  <>
                                    <p className={cn('text-sm font-bold whitespace-nowrap', tx.pnl >= 0 ? 'text-secondary' : 'text-error')}>
                                      {tx.pnl >= 0 ? '+' : ''}{formatRp(tx.pnl, true)}
                                    </p>
                                    <p className={cn('text-[10px] font-semibold', tx.pnl >= 0 ? 'text-secondary' : 'text-error')}>
                                      {(tx.pnlPct ?? 0) >= 0 ? '+' : ''}{(tx.pnlPct ?? 0).toFixed(2)}%
                                    </p>
                                  </>
                                ) : <span className="text-[10px] text-on-surface-variant/30">—</span>}
                              </td>
                              <td className="py-3 text-[10px] text-on-surface-variant/50 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-primary/4 border border-primary/8 rounded-xl">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant/70 leading-relaxed">
            <strong className="text-primary">Paper Trading</strong> dengan saldo virtual Rp 100.000.000. Klik nama saham di tabel untuk melihat <strong>grafik harga</strong> dan <strong>simulasi Monte Carlo</strong>. Data disimpan di browser Anda.
          </p>
        </div>
      </div>
    </>
  );
}
