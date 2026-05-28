import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2, 
  Clock,
  ChevronRight,
  Newspaper,
  X,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useParams, Link } from 'react-router-dom';
import StockIcon from '../components/StockIcon';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StockDetail {
  ticker:      string;
  symbol:      string;
  name:        string;
  tanggal:     string;
  harga:       number;
  change_pct:  number;
  prediksi:    string;
  signal:      string;
  action:      string;
  confidence:  number;
  prob_naik:   number;
  prob_turun:  number;
  take_profit: number;
  stop_loss:   number;
  strength:    string;
  rsi:         number;
  rsi_status:  string;
  macd_diff:   number;
  macd_status: string;
  sma20:       number;
  ema12:       number;
  bb_upper:    number;
  bb_lower:    number;
  stoch_k:     number;
  ma_status:   string;
}

interface ChartPoint {
  time:   string;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000';

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('id-ID');
  return price.toFixed(0);
}

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' } }),
};

// Format timestamp untuk label chart
function formatLabel(time: string, period: string): string {
  try {
    const d = new Date(time);
    if (period === '1D') return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (period === '1W') return d.toLocaleDateString('id-ID', { weekday: 'short', hour: '2-digit' });
    if (period === '5Y') return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  } catch {
    return time;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="h-64 w-full animate-pulse flex items-end gap-1 px-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-slate-100 rounded-t"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StockDetail() {
  const { symbol }    = useParams<{ symbol: string }>();
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [activeRange, setActiveRange] = useState('1M');

  const [detail, setDetail]       = useState<StockDetail | null>(null);
  const [chartData, setChartData] = useState<{ name: string; price: number }[]>([]);
  const [loading, setLoading]     = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── Fetch detail + chart ─────────────────────────────────────────────────

  const fetchDetail = async (period = activeRange) => {
    if (!symbol) return;
    setLoading(true);
    setChartLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/stocks/${symbol}?period=${period}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      setDetail(json.prediction ?? null);

      // Transform chart data untuk recharts
      const raw: ChartPoint[] = json.chart ?? [];
      const mapped = raw.map(p => ({
        name:  formatLabel(p.time, period),
        price: p.close,
      }));
      setChartData(mapped);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Gagal memuat data saham. Pastikan AI server berjalan.\n(${msg})`);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail(activeRange);
  }, [symbol]);

  const handleRangeChange = (range: string) => {
    setActiveRange(range);
    fetchDetail(range);
  };

  const isBullish = detail?.signal === 'BULLISH';
  const primaryColor = isBullish ? '#006c49' : '#ef4444';

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Error state
  // ─────────────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="space-y-5 pb-24">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-primary transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-primary">{symbol}</h1>
        </div>
        <div className="card p-8 rounded-2xl flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <p className="text-sm text-on-surface-variant/60 whitespace-pre-line">{error}</p>
          <button onClick={() => fetchDetail()} className="btn-primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Main
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/20 shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <StockIcon symbol={symbol || ''} className="w-12 h-12 text-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-primary tracking-tight">
                  {loading ? `PT ${symbol} Tbk.` : detail?.name}
                </h1>
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              </div>
              <p className="text-xs text-on-surface-variant/50 font-medium">
                {loading ? 'Memuat data...' : `Data per ${detail?.tanggal}`}
              </p>
            </div>
          </div>
        </div>

        <div className="card px-5 py-3 rounded-2xl flex items-center gap-4">
          <div>
            <p className="stat-label mb-1">Harga Terkini</p>
            <div className="flex items-center gap-2">
              {loading
                ? <div className="h-7 w-20 bg-slate-200 rounded animate-pulse" />
                : (
                  <>
                    <span className="text-2xl font-bold text-primary tracking-tight">
                      {formatPrice(detail?.harga ?? 0)}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1",
                      isBullish ? "bg-secondary/10 text-secondary border-secondary/15" : "bg-error/10 text-error border-error/15"
                    )}>
                      {(detail?.change_pct ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {(detail?.change_pct ?? 0) >= 0 ? '+' : ''}{(detail?.change_pct ?? 0).toFixed(2)}%
                    </span>
                  </>
                )
              }
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100 hidden sm:block" />
          <div className="flex gap-2">
            <button
              onClick={() => fetchDetail(activeRange)}
              className="p-2.5 bg-slate-50 rounded-xl text-on-surface-variant hover:text-primary transition-all hover:bg-slate-100 active:scale-95"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
            <button className="p-2.5 bg-slate-50 rounded-xl text-on-surface-variant hover:text-primary transition-all hover:bg-slate-100 active:scale-95">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart + Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart */}
        <motion.section
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-8 card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {['1D', '1W', '1M', '1Y', '5Y'].map(t => (
                <button
                  key={t}
                  onClick={() => handleRangeChange(t)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                    t === activeRange ? "bg-white text-primary shadow-sm" : "text-on-surface-variant/50 hover:text-primary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 stat-label">
              <Clock className="w-3 h-3" />
              {detail ? `Update: ${detail.tanggal}` : 'Memuat...'}
            </div>
          </div>

          <div className="h-64 w-full">
            {chartLoading ? (
              <ChartSkeleton />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="sdColorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={primaryColor} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: '700', color: '#0F172A' }}
                    formatter={(val: number) => [`Rp ${formatPrice(val)}`, 'Harga']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={primaryColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#sdColorPrice)"
                    dot={false}
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-on-surface-variant/40">
                Tidak ada data chart tersedia
              </div>
            )}
          </div>
        </motion.section>

        {/* AI Rating */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card p-6 rounded-2xl flex flex-col items-center justify-center text-center"
        >
          <h3 className="stat-label mb-6">InvestAI Rating</h3>
          {loading ? (
            <div className="w-40 h-40 rounded-full bg-slate-100 animate-pulse" />
          ) : (
            <div className="relative w-40 h-40 mb-5">
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <motion.circle
                  cx="80" cy="80" r="68" fill="none" stroke={primaryColor} strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={427.08}
                  initial={{ strokeDashoffset: 427.08 }}
                  animate={{ strokeDashoffset: 427.08 * (1 - (detail?.confidence ?? 0) / 100) }}
                  transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary tracking-tight">
                  {((detail?.confidence ?? 0) / 10).toFixed(1)}
                </span>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider mt-0.5",
                  isBullish ? "text-secondary" : "text-error"
                )}>
                  {detail?.signal ?? 'N/A'}
                </span>
              </div>
            </div>
          )}
          {detail && (
            <p className="text-[10px] text-on-surface-variant/50 max-w-[180px] leading-relaxed">
              Confidence: {detail.confidence.toFixed(1)}% · {detail.strength}<br />
              Naik {detail.prob_naik.toFixed(1)}% · Turun {detail.prob_turun.toFixed(1)}%
            </p>
          )}
        </motion.section>

        {/* AI Insight */}
        <motion.section
          custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-8 card p-6 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2.5 mb-4 relative">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-primary">Ringkasan AI InvestAI</h3>
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-4/5" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          ) : detail ? (
            <>
              <p className="text-sm text-primary/70 leading-relaxed mb-5 relative">
                {detail.symbol} menunjukkan sinyal <strong className={isBullish ? "text-secondary" : "text-error"}>{detail.signal}</strong>{' '}
                dengan confidence <strong>{detail.confidence.toFixed(1)}%</strong> ({detail.strength}).
                RSI {detail.rsi.toFixed(1)} ({detail.rsi_status}), MACD {detail.macd_status}.
                Harga saat ini {detail.ma_status} (SMA20: Rp {formatPrice(detail.sma20)}).
                Probabilitas naik {detail.prob_naik.toFixed(1)}% vs turun {detail.prob_turun.toFixed(1)}%.
              </p>
              <div className="flex flex-wrap gap-2 relative">
                {[
                  detail.signal,
                  `RSI ${detail.rsi_status}`,
                  `MACD ${detail.macd_status}`,
                  detail.ma_status,
                ].map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 bg-secondary/6 px-3 py-1.5 rounded-lg border border-secondary/10 text-xs font-semibold text-secondary">
                    <CheckCircle2 className="w-3 h-3" /> {tag}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </motion.section>

        {/* Technical */}
        <motion.section
          custom={3} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card p-5 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-primary">Teknikal Indikator</h4>
            <TrendingUp className="w-4 h-4 text-on-surface-variant/30" />
          </div>
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-slate-50 last:border-0 animate-pulse">
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
              ))
              : detail && [
                { label: 'RSI (14)',      value: detail.rsi.toFixed(1),      status: detail.rsi_status,   up: detail.rsi_status === 'Normal' },
                { label: 'MACD',         value: detail.macd_diff.toFixed(4), status: detail.macd_status,  up: detail.macd_status === 'Bullish' },
                { label: 'MA (20)',      value: `Rp ${formatPrice(detail.sma20)}`, status: detail.ma_status, up: detail.ma_status === 'Di Atas MA' },
              ].map((ind, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                    <p className="stat-label mb-1">{ind.label}</p>
                    <p className="text-sm font-semibold text-primary">{ind.value}</p>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border",
                    ind.up ? "bg-secondary/8 text-secondary border-secondary/12" : "bg-error/8 text-error border-error/12"
                  )}>
                    {ind.status}
                  </span>
                </div>
              ))
            }
          </div>
        </motion.section>

        {/* Target Harga */}
        <motion.section
          custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-12 card p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-5">
            <div>
              <h3 className="text-base font-bold text-primary mb-0.5">Target Harga & Risk Management</h3>
              <p className="text-xs text-on-surface-variant/50">
                Berdasarkan prediksi AI model Random Forest multi-saham IDX.
              </p>
            </div>
            {detail && (
              <div className="flex items-center gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <div className="text-center">
                  <span className={cn("text-2xl font-bold", isBullish ? "text-secondary" : "text-error")}>
                    {detail.prob_naik.toFixed(0)}%
                  </span>
                  <p className="stat-label mt-0.5">Naik</p>
                </div>
                <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary rounded-l-full transition-all" style={{ width: `${detail.prob_naik}%` }} />
                  <div className="h-full bg-error rounded-r-full transition-all" style={{ width: `${detail.prob_turun}%` }} />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-error">{detail.prob_turun.toFixed(0)}%</span>
                  <p className="stat-label mt-0.5">Turun</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading
              ? [0, 1].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
              ))
              : detail && [
                {
                  icon: TrendingUp,
                  title: 'Take Profit (Target)',
                  value: `Rp ${formatPrice(detail.take_profit)}`,
                  sub: `+3% dari harga ${formatPrice(detail.harga)}`,
                  color: 'text-secondary',
                  bg: 'bg-secondary/6 border-secondary/12',
                },
                {
                  icon: detail.action === 'BUY' ? TrendingDown : TrendingUp,
                  title: 'Stop Loss (Batas Risiko)',
                  value: `Rp ${formatPrice(detail.stop_loss)}`,
                  sub: detail.action === 'BUY' ? '-2% dari entry' : '+2% dari entry short',
                  color: 'text-error',
                  bg: 'bg-error/6 border-error/12',
                },
              ].map((item, i) => (
                <div key={i} className={cn("flex gap-4 p-4 border rounded-2xl transition-all", item.bg)}>
                  <div className={cn("w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0")}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-primary mb-1">{item.title}</h4>
                    <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
                    <p className="stat-label mt-0.5">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant/20 shrink-0 self-center" />
                </div>
              ))
            }
          </div>
        </motion.section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 z-30">
        <div className="bg-primary/95 backdrop-blur-xl px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between text-white border border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <BotIcon className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-sm font-medium">Butuh bantuan memutuskan?</p>
          </div>
          <button
            onClick={() => setShowRecommendation(true)}
            className="bg-secondary text-white px-5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20"
          >
            <Sparkles className="w-3.5 h-3.5" /> Minta Rekomendasi
          </button>
        </div>
      </div>

      {/* Recommendation Modal */}
      <AnimatePresence>
        {showRecommendation && detail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-7 relative"
            >
              <button
                onClick={() => setShowRecommendation(false)}
                className="absolute top-5 right-5 p-1.5 text-on-surface-variant/30 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">Rekomendasi Final AI</h2>
                  <p className="text-xs text-on-surface-variant/50">Model Random Forest Multi-Stock · {detail.tanggal}</p>
                </div>
              </div>

              <div className={cn(
                "rounded-2xl p-5 mb-5 border",
                isBullish ? "bg-secondary/6 border-secondary/10" : "bg-error/6 border-error/10"
              )}>
                <div className="flex items-center justify-between mb-3">
                  <span className="stat-label">Keputusan Akhir</span>
                  <span className={cn("px-3 py-1 text-white rounded-lg text-xs font-bold shadow-sm", isBullish ? "bg-secondary" : "bg-error")}>
                    {detail.action}
                  </span>
                </div>
                <p className="text-sm text-primary/70 leading-relaxed">
                  Berdasarkan analisis teknikal real-time dan model ML, kami merekomendasikan aksi{' '}
                  <strong>{detail.action}</strong> pada {detail.symbol} di harga saat ini (Rp {formatPrice(detail.harga)}).
                  Confidence: <strong>{detail.confidence.toFixed(1)}%</strong> ({detail.strength}).
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  `Take Profit target: Rp ${formatPrice(detail.take_profit)} (+3%)`,
                  `Stop Loss di: Rp ${formatPrice(detail.stop_loss)} (${detail.action === 'BUY' ? '-2%' : '+2%'})`,
                  `RSI ${detail.rsi.toFixed(1)} (${detail.rsi_status}), MACD ${detail.macd_status}, Stoch: ${detail.stoch_k.toFixed(1)}`,
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-sm text-primary/70">{item}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRecommendation(false)}
                className="btn-primary w-full justify-center text-sm"
              >
                Gunakan Rekomendasi Ini
              </button>
              <p className="text-center mt-4 stat-label">⚠ Investasi memiliki risiko. Gunakan AI sebagai referensi riset mandiri Anda.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
