import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Search,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  X,
  RefreshCw,
  AlertCircle,
  Layers,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils';
import StockIcon from '../components/StockIcon';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StockData {
  ticker:      string;
  symbol:      string;
  name:        string;
  category:    string;
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

interface CategoryMeta {
  ticker: string;
  symbol: string;
  name:   string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000';

// Sektor order & ikon
const SECTOR_CONFIG: Record<string, { emoji: string; short: string }> = {
  'Perbankan & Keuangan':      { emoji: '🏦', short: 'Perbankan' },
  'Energi & Pertambangan':     { emoji: '⚡', short: 'Energi' },
  'Consumer Goods & Retail':   { emoji: '🛒', short: 'Consumer' },
  'Telekomunikasi & Teknologi':{ emoji: '📡', short: 'Telko' },
  'Industri & Manufaktur':     { emoji: '🏭', short: 'Industri' },
  'Properti & Konstruksi':     { emoji: '🏗️', short: 'Properti' },
  'Healthcare & Farmasi':      { emoji: '🏥', short: 'Healthcare' },
  'Infrastruktur & Utilitas':  { emoji: '🛣️', short: 'Infrastruktur' },
  'Agribisnis':                { emoji: '🌾', short: 'Agri' },
  'Media & Hiburan':           { emoji: '📺', short: 'Media' },
  'Logistik & Pergudangan':    { emoji: '📦', short: 'Logistik' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('id-ID');
  return price.toFixed(0);
}

function formatChange(pct: number): string {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
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
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StockSkeleton() {
  return (
    <div className="card p-5 rounded-2xl animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div>
            <div className="h-3 w-12 bg-slate-200 rounded mb-1" />
            <div className="h-2 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-5 w-16 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-slate-200 rounded mb-1" />
      <div className="h-1 w-full bg-slate-100 rounded-full mt-3" />
      <div className="h-8 w-full bg-slate-100 rounded-xl mt-4" />
    </div>
  );
}

// ─── Category Loading State ───────────────────────────────────────────────────

interface CategoryState {
  data:    StockData[];
  loading: boolean;
  error:   string | null;
  loaded:  boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Signals() {
  const [view, setView] = useState<'list' | 'analysis'>('list');
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Kategori dari API
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<Record<string, CategoryMeta[]>>({});

  // Per-category data cache
  const [categoryStates, setCategoryStates] = useState<Record<string, CategoryState>>({});

  // Global error (gagal fetch categories)
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Visible count untuk "Show More"
  const [visibleCount, setVisibleCount] = useState(12);

  // Ref to track which categories have been fetched (avoids closure stale state)
  const loadedRef = useRef<Set<string>>(new Set());

  // ── Fetch daftar kategori saat mount ─────────────────────────────────────

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setGlobalError(null);
    // Reset loaded tracking on full refresh
    loadedRef.current.clear();
    setCategoryStates({});
    try {
      const res = await fetch(`${API_BASE}/api/stocks/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const cats = Object.keys(json.categories ?? {});
      setCategories(cats);
      setCategoryMeta(json.categories ?? {});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGlobalError(`Gagal terhubung ke AI server. Pastikan server berjalan di port 8000.\n(${msg})`);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Fetch satu kategori (lazy) — stable ref via loadedRef ──────────────

  const fetchCategory = useCallback(async (category: string) => {
    if (loadedRef.current.has(category)) return; // already fetched
    loadedRef.current.add(category); // mark as in-flight immediately

    setCategoryStates(prev => ({
      ...prev,
      [category]: { data: [], loading: true, error: null, loaded: false },
    }));

    try {
      const encoded = encodeURIComponent(category);
      const res = await fetch(`${API_BASE}/api/stocks/by-category/${encoded}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const stocks: StockData[] = json.data ?? [];
      setCategoryStates(prev => ({
        ...prev,
        [category]: { data: stocks, loading: false, error: null, loaded: true },
      }));
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      loadedRef.current.delete(category); // allow retry on error
      setCategoryStates(prev => ({
        ...prev,
        [category]: { data: [], loading: false, error: msg, loaded: false },
      }));
    }
  }, []); // stable — no deps needed, uses ref

  // ── Auto-fetch when active category or categories list changes ───────────

  useEffect(() => {
    if (loadingCategories || categories.length === 0) return;

    if (activeCategory !== 'Semua') {
      fetchCategory(activeCategory);
    } else {
      // Sequential fetch across all categories
      let cancelled = false;
      const fetchAll = async () => {
        for (const cat of categories) {
          if (cancelled) break;
          await fetchCategory(cat);
        }
      };
      fetchAll();
      return () => { cancelled = true; };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, loadingCategories, categories.length]);

  // ── Data yang ditampilkan ─────────────────────────────────────────────────

  const allStocks: StockData[] = (() => {
    if (activeCategory === 'Semua') {
      const all: StockData[] = [];
      for (const cat of categories) {
        all.push(...(categoryStates[cat]?.data ?? []));
      }
      return all;
    }
    return categoryStates[activeCategory]?.data ?? [];
  })();

  const isCurrentLoading = (() => {
    if (activeCategory === 'Semua') {
      return categories.some(cat => categoryStates[cat]?.loading);
    }
    return categoryStates[activeCategory]?.loading ?? (!categoryStates[activeCategory]?.loaded);
  })();

  const filtered = allStocks.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  // Reset visible count when category/search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, search]);

  // ── Mulai analisis ───────────────────────────────────────────────────────

  const handleStartAnalysis = (stock: StockData) => {
    setSelectedStock(stock);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setView('analysis');
    }, 1500);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Analyzing screen
  // ─────────────────────────────────────────────────────────────────────────

  if (isAnalyzing) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6"
        >
          <Zap className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="text-xl font-bold text-primary mb-2">
          Menganalisis {selectedStock?.symbol}...
        </h2>
        <p className="text-sm text-on-surface-variant/60 max-w-xs">
          XGBoost AI sedang membedah {selectedStock?.category} · {selectedStock?.name}
        </p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 bg-primary/30 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Global error (server not running)
  // ─────────────────────────────────────────────────────────────────────────

  if (globalError) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-primary">Sinyal AI</h1>
        <div className="card p-8 rounded-2xl flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <div>
            <h2 className="font-bold text-primary mb-1">AI Server Tidak Terhubung</h2>
            <p className="text-sm text-on-surface-variant/60 whitespace-pre-line max-w-sm">{globalError}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-xs font-mono text-on-surface-variant/60 w-full max-w-sm">
            <p className="mb-1 font-semibold text-primary">Cara menjalankan AI server:</p>
            <p>cd backend/ai</p>
            <p>pip install -r requirements.txt</p>
            <p>uvicorn app.main:app --port 8000</p>
          </div>
          <button
            onClick={fetchCategories}
            className="btn-primary flex items-center gap-2"
          >
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
    <div className="space-y-5 pb-28">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">Sinyal AI — 90+ Saham IDX</h1>
                <p className="text-sm text-on-surface-variant/60 mt-1">
                  Prediksi XGBoost real-time · {allStocks.length} saham termuat
                  {lastUpdated && (
                    <span className="ml-2 text-secondary font-semibold">
                      · {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                  <input
                    type="text"
                    placeholder="Cari saham (BBCA, Energi...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
                <button
                  onClick={() => {
                    setCategoryStates({});
                    fetchCategories();
                  }}
                  disabled={isCurrentLoading}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all shadow-sm disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={cn("w-4 h-4", isCurrentLoading && "animate-spin")} />
                </button>
              </div>
            </div>

            {/* ── Sector Filter Tabs ── */}
            <div className="overflow-x-auto pb-1 -mx-1 px-1">
              <div className="flex gap-2 min-w-max">
                {/* "Semua" tab */}
                <button
                  onClick={() => setActiveCategory('Semua')}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                    activeCategory === 'Semua'
                      ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                      : "bg-white text-on-surface-variant/70 border-slate-200 hover:border-primary/20 hover:text-primary"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Semua
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                    activeCategory === 'Semua' ? "bg-white/20" : "bg-slate-100"
                  )}>
                    {allStocks.length || '90+'}
                  </span>
                </button>

                {/* Per-sector tabs */}
                {loadingCategories
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 rounded-xl bg-slate-100 animate-pulse" />
                  ))
                  : categories.map(cat => {
                    const cfg = SECTOR_CONFIG[cat] ?? { emoji: '📊', short: cat.split(' ')[0] };
                    const state = categoryStates[cat];
                    const count = state?.data?.length ?? (categoryMeta[cat]?.length ?? 0);
                    const isActive = activeCategory === cat;
                    const isLoading = state?.loading;

                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                          isActive
                            ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                            : "bg-white text-on-surface-variant/70 border-slate-200 hover:border-primary/20 hover:text-primary"
                        )}
                      >
                        <span>{cfg.emoji}</span>
                        {cfg.short}
                        {isLoading
                          ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          : (
                            <span className={cn(
                              "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                              isActive ? "bg-white/20" : "bg-slate-100"
                            )}>
                              {count}
                            </span>
                          )
                        }
                      </button>
                    );
                  })
                }
              </div>
            </div>

            {/* ── Stats Bar ── */}
            {allStocks.length > 0 && !search && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  {
                    label: 'Bullish',
                    value: allStocks.filter(s => s.signal === 'BULLISH').length,
                    color: 'text-secondary',
                    bg: 'bg-secondary/8 border-secondary/12',
                  },
                  {
                    label: 'Bearish',
                    value: allStocks.filter(s => s.signal === 'BEARISH').length,
                    color: 'text-error',
                    bg: 'bg-error/8 border-error/12',
                  },
                  {
                    label: 'Confidence Rata-rata',
                    value: allStocks.length
                      ? `${(allStocks.reduce((a, s) => a + s.confidence, 0) / allStocks.length).toFixed(0)}%`
                      : '—',
                    color: 'text-primary',
                    bg: 'bg-primary/6 border-primary/10',
                  },
                ].map((stat, i) => (
                  <div key={i} className={cn("rounded-xl p-3 border text-center", stat.bg)}>
                    <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-[10px] text-on-surface-variant/50 font-medium mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── Stock Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isCurrentLoading && displayed.length === 0)
                ? Array.from({ length: 6 }).map((_, i) => <StockSkeleton key={i} />)
                : displayed.map((stock, i) => (
                  <motion.div
                    key={stock.ticker}
                    custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    className="card p-5 rounded-2xl hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Category badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/40 flex items-center gap-1">
                        <span>{SECTOR_CONFIG[stock.category]?.emoji ?? '📊'}</span>
                        {SECTOR_CONFIG[stock.category]?.short ?? stock.category?.split(' ')[0]}
                      </span>
                      {/* Signal badge */}
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                        stock.signal === 'BULLISH'
                          ? "bg-secondary/10 text-secondary border-secondary/15"
                          : "bg-error/10 text-error border-error/15"
                      )}>
                        {stock.action}
                      </span>
                    </div>

                    {/* Stock identity */}
                    <div className="flex items-center gap-3 mb-4">
                      <StockIcon symbol={stock.symbol} />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-primary">{stock.symbol}</h3>
                        <p className="text-[10px] text-on-surface-variant/50 font-medium truncate max-w-[130px]">{stock.name}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-xl font-bold text-primary tracking-tight">
                          Rp {formatPrice(stock.harga)}
                        </p>
                        <p className={cn(
                          "text-xs font-semibold mt-0.5 flex items-center gap-1",
                          stock.change_pct >= 0 ? "text-secondary" : "text-error"
                        )}>
                          {stock.change_pct >= 0
                            ? <TrendingUp className="w-3 h-3" />
                            : <TrendingDown className="w-3 h-3" />
                          }
                          {formatChange(stock.change_pct)}
                        </p>
                      </div>
                      {/* Confidence */}
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant/50 mb-1">AI Confidence</p>
                        <p className={cn(
                          "text-sm font-bold",
                          stock.confidence >= 70 ? "text-secondary" : stock.confidence >= 60 ? "text-primary" : "text-on-surface-variant/60"
                        )}>
                          {stock.confidence.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mb-4">
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stock.confidence}%` }}
                          transition={{ duration: 1, delay: 0.2 + i * 0.04 }}
                          className={cn("h-full rounded-full", stock.signal === 'BULLISH' ? "bg-secondary" : "bg-error")}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartAnalysis(stock)}
                      className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Analisis dengan AI
                    </button>
                  </motion.div>
                ))
              }

              {/* Loading more cards while fetching */}
              {isCurrentLoading && displayed.length > 0 &&
                Array.from({ length: 3 }).map((_, i) => <StockSkeleton key={`sk-${i}`} />)
              }
            </div>

            {/* ── Show More / Empty ── */}
            {!isCurrentLoading && filtered.length === 0 && allStocks.length > 0 && (
              <div className="text-center py-12 text-on-surface-variant/50 text-sm">
                Tidak ada saham yang cocok dengan "{search}"
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => setVisibleCount(v => v + 12)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-primary hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <ChevronDown className="w-4 h-4" />
                  Tampilkan lebih banyak ({filtered.length - visibleCount} tersisa)
                </button>
              </div>
            )}

          </motion.div>

        ) : (
          // ─── Analysis View ────────────────────────────────────────────────────
          <motion.div key="analysis" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">

            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('list')}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-base font-bold text-primary">Analisis Saham {selectedStock?.symbol}</h1>
                  <p className="text-xs text-on-surface-variant/50">
                    Data per {selectedStock?.tanggal} · XGBoost AI Engine ·{' '}
                    <span className="text-secondary font-semibold">
                      {SECTOR_CONFIG[selectedStock?.category ?? '']?.emoji}{' '}
                      {selectedStock?.category}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {selectedStock && (
              <>
                {/* Stock Info Card */}
                <div className="card p-6 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <StockIcon symbol={selectedStock.symbol} className="w-14 h-14 text-xl" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-primary tracking-tight">{selectedStock.symbol}</h2>
                          <span className="px-2 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[9px] font-bold uppercase tracking-wider">IDX</span>
                        </div>
                        <p className="text-xs text-on-surface-variant/50 font-medium mb-2">{selectedStock.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">Rp {formatPrice(selectedStock.harga)}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-lg text-xs font-bold border flex items-center gap-1",
                            selectedStock.change_pct >= 0
                              ? "bg-secondary/10 text-secondary border-secondary/15"
                              : "bg-error/10 text-error border-error/15"
                          )}>
                            {selectedStock.change_pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {formatChange(selectedStock.change_pct)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Signal badge */}
                    <div className={cn(
                      "px-6 py-3 rounded-2xl border text-center",
                      selectedStock.signal === 'BULLISH'
                        ? "bg-secondary/8 border-secondary/15"
                        : "bg-error/8 border-error/15"
                    )}>
                      <p className="text-[10px] font-semibold text-on-surface-variant/50 mb-1">AI SIGNAL</p>
                      <p className={cn(
                        "text-lg font-bold",
                        selectedStock.signal === 'BULLISH' ? "text-secondary" : "text-error"
                      )}>
                        {selectedStock.action}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/50 mt-1">{selectedStock.strength} · {selectedStock.confidence.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>

                {/* AI Summary + Confidence Ring */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-8 card p-6 rounded-2xl">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-primary">Ringkasan XGBoost AI</h3>
                    </div>
                    <p className="text-sm text-primary/75 leading-relaxed mb-5">
                      {selectedStock.symbol} menunjukkan sinyal <strong className={selectedStock.signal === 'BULLISH' ? 'text-secondary' : 'text-error'}>{selectedStock.signal}</strong>{' '}
                      dengan confidence <strong>{selectedStock.confidence.toFixed(1)}%</strong> ({selectedStock.strength}).
                      RSI berada di {selectedStock.rsi.toFixed(1)} ({selectedStock.rsi_status}),
                      MACD {selectedStock.macd_status} (diff: {selectedStock.macd_diff.toFixed(5)}).
                      Harga saat ini {selectedStock.ma_status} SMA20 (Rp {formatPrice(selectedStock.sma20)}).
                      Probabilitas naik {selectedStock.prob_naik.toFixed(1)}% vs turun {selectedStock.prob_turun.toFixed(1)}%.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        selectedStock.signal === 'BULLISH' ? 'Momentum Positif' : 'Tekanan Jual',
                        `RSI ${selectedStock.rsi_status}`,
                        `MACD ${selectedStock.macd_status}`,
                        selectedStock.ma_status,
                        `${SECTOR_CONFIG[selectedStock.category]?.emoji ?? ''} ${selectedStock.category?.split(' ')[0]}`,
                      ].map((tag, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/6 border border-secondary/10 text-secondary rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Confidence Ring */}
                  <div className="lg:col-span-4 card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <h3 className="stat-label mb-5">AI Confidence Score</h3>
                    <div className="relative w-36 h-36 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="72" cy="72" r="62" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                        <motion.circle
                          cx="72" cy="72" r="62" fill="none"
                          stroke={selectedStock.signal === 'BULLISH' ? '#006c49' : '#ef4444'}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={389.56}
                          initial={{ strokeDashoffset: 389.56 }}
                          animate={{ strokeDashoffset: 389.56 * (1 - selectedStock.confidence / 100) }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-primary tracking-tight">{selectedStock.confidence.toFixed(0)}%</span>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-wider",
                          selectedStock.signal === 'BULLISH' ? "text-secondary" : "text-error"
                        )}>
                          {selectedStock.signal}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/50 max-w-[160px] leading-relaxed">
                      Naik {selectedStock.prob_naik.toFixed(1)}% · Turun {selectedStock.prob_turun.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Technical + Target */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Technical Indicators */}
                  <div className="card p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-4 h-4 text-secondary" />
                      <h3 className="text-sm font-bold text-primary">Indikator Teknikal</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          label: 'RSI (14)',
                          value: selectedStock.rsi.toFixed(1),
                          status: selectedStock.rsi_status,
                          up: selectedStock.rsi_status === 'Normal',
                        },
                        {
                          label: 'MACD Histogram',
                          value: selectedStock.macd_diff.toFixed(5),
                          status: selectedStock.macd_status,
                          up: selectedStock.macd_status === 'Bullish',
                        },
                        {
                          label: 'Moving Average (SMA20)',
                          value: `Rp ${formatPrice(selectedStock.sma20)}`,
                          status: selectedStock.ma_status,
                          up: selectedStock.ma_status === 'Di Atas MA',
                        },
                        {
                          label: 'RSI (7) — Jangka Pendek',
                          value: selectedStock.stoch_k.toFixed(1),
                          status: selectedStock.stoch_k > 70 ? 'Overbought' : selectedStock.stoch_k < 30 ? 'Oversold' : 'Normal',
                          up: selectedStock.stoch_k >= 30 && selectedStock.stoch_k <= 70,
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-semibold text-primary">{item.label}</p>
                            <p className="stat-label mt-0.5">Real-time · {selectedStock.tanggal}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn("text-sm font-bold", item.up ? "text-secondary" : "text-error")}>{item.value}</p>
                            <p className={cn("text-[9px] font-bold uppercase tracking-wider", item.up ? "text-secondary/70" : "text-error/70")}>{item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TP / SL & Bollinger */}
                  <div className="card p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-4 h-4 text-secondary" />
                      <h3 className="text-sm font-bold text-primary">Target Harga & Risk</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Harga Sekarang', value: `Rp ${formatPrice(selectedStock.harga)}`, status: 'Close Terakhir', up: true },
                        { label: 'Take Profit (Target)', value: `Rp ${formatPrice(selectedStock.take_profit)}`, status: '+3%', up: true },
                        { label: 'Stop Loss (Batas Risiko)', value: `Rp ${formatPrice(selectedStock.stop_loss)}`, status: selectedStock.action === 'BUY' ? '-2%' : '+2%', up: false },
                        { label: 'Bollinger Band', value: `${formatPrice(selectedStock.bb_lower)} – ${formatPrice(selectedStock.bb_upper)}`, status: 'Lower – Upper', up: null as unknown as boolean },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-semibold text-primary">{item.label}</p>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              "text-sm font-bold",
                              item.up === null ? "text-primary" : item.up ? "text-secondary" : "text-error"
                            )}>
                              {item.value}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/40">{item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Action Bar */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 z-30">
                  <div className="bg-primary/95 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between text-white border border-white/8">
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
                  {showRecommendation && (
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
                          className="absolute top-5 right-5 p-1.5 text-on-surface-variant/40 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                            <Sparkles className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-primary">Rekomendasi Final AI</h2>
                            <p className="text-xs text-on-surface-variant/50 font-medium">XGBoost Engine · {selectedStock.category}</p>
                          </div>
                        </div>

                        <div className={cn(
                          "rounded-2xl p-5 mb-5 border",
                          selectedStock.signal === 'BULLISH' ? "bg-secondary/6 border-secondary/10" : "bg-error/6 border-error/10"
                        )}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="stat-label">Keputusan InvestAI</span>
                            <span className={cn(
                              "px-3 py-1 text-white rounded-lg text-xs font-bold shadow-sm",
                              selectedStock.signal === 'BULLISH' ? "bg-secondary" : "bg-error"
                            )}>
                              {selectedStock.action}
                            </span>
                          </div>
                          <p className="text-sm text-primary/75 leading-relaxed">
                            Berdasarkan analisis XGBoost real-time ({selectedStock.confidence.toFixed(0)}% confidence),
                            kami merekomendasikan aksi <strong>{selectedStock.action}</strong> pada {selectedStock.symbol}{' '}
                            di harga saat ini (Rp {formatPrice(selectedStock.harga)}).
                          </p>
                        </div>

                        <div className="space-y-3 mb-6">
                          {[
                            `Take Profit target: Rp ${formatPrice(selectedStock.take_profit)} (+3%)`,
                            `Stop Loss di: Rp ${formatPrice(selectedStock.stop_loss)} (${selectedStock.action === 'BUY' ? '-2%' : '+2%'})`,
                            `RSI ${selectedStock.rsi.toFixed(1)} — ${selectedStock.rsi_status}. MACD ${selectedStock.macd_status}.`,
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                              <p className="text-sm text-primary/70">{item}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setShowRecommendation(false)}
                          className="btn-primary w-full justify-center"
                        >
                          Gunakan Rekomendasi Ini
                        </button>
                        <p className="text-center mt-4 stat-label">⚠ Investasi memiliki risiko. Gunakan AI sebagai referensi riset mandiri Anda.</p>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
