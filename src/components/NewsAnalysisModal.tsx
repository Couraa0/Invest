import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Newspaper,
  Calendar,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Lightbulb,
  Tag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StockForNews {
  ticker: string;
  symbol: string;
  name:   string;
}

interface ArticleItem {
  title:   string;
  link:    string;
  source:  string;
  date:    string;
  summary: string;
}

interface EvaluationResult {
  quality_score:        number;
  sentiment_consistent: boolean;
  recommendation_clear: boolean;
  issues:               string[];
  verdict:              'APPROVED' | 'NEEDS_REVISION';
  forced_approve?:      boolean;
}

interface NewsResult {
  status:                 string;
  ticker:                 string;
  sentiment:              'BULLISH' | 'BEARISH' | 'NETRAL';
  sentiment_score:        number;
  confidence:             'TINGGI' | 'SEDANG' | 'RENDAH';
  article_count:          number;
  filtered_article_count: number;
  data_quality:           string;
  evaluation_result:      EvaluationResult | null;
  retry_count:            number;
  key_topics:             string[];
  risk_factors:           string[];
  catalysts:              string[];
  final_report:           string;
  articles:               ArticleItem[];
  lookback_days:          number;
}

interface LoadingStep {
  key:   string;
  label: string;
  desc:  string;
  done:  boolean;
}

interface Props {
  stock:    StockForNews | null;
  onClose:  () => void;
  apiBase:  string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { days: 7,  label: '7 Hari',  desc: 'Berita minggu ini' },
  { days: 30, label: '30 Hari', desc: 'Berita bulan ini' },
  { days: 90, label: '90 Hari', desc: 'Berita 3 bulan' },
] as const;

const LOADING_STEPS: LoadingStep[] = [
  { key: 'fetch',    label: 'Fetch News',         desc: 'Scraping Google News RSS...', done: false },
  { key: 'quality',  label: 'Data Quality Check', desc: 'Validasi jumlah artikel...', done: false },
  { key: 'filter',   label: 'Filter Articles',    desc: 'Keyword + LLM relevance scoring...', done: false },
  { key: 'sentiment',label: 'Analyze Sentiment',  desc: 'LLM analisis sentimen berita...', done: false },
  { key: 'report',   label: 'Generate Report',    desc: 'Menyusun laporan analisis...', done: false },
  { key: 'evaluate', label: 'Evaluate Output',    desc: 'Quality gate & self-healing check...', done: false },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function sentimentColor(s: string) {
  if (s === 'BULLISH') return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (s === 'BEARISH') return { text: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200'     };
  return                       { text: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-200'   };
}

function confidenceColor(c: string) {
  if (c === 'TINGGI') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (c === 'SEDANG') return 'text-amber-600   bg-amber-50   border-amber-200';
  return                     'text-slate-500   bg-slate-50   border-slate-200';
}

function SentimentIcon({ s }: { s: string }) {
  if (s === 'BULLISH') return <TrendingUp  className="w-5 h-5 text-emerald-600" />;
  if (s === 'BEARISH') return <TrendingDown className="w-5 h-5 text-red-500"    />;
  return                      <Minus        className="w-5 h-5 text-amber-500"   />;
}

/** Render laporan markdown sederhana (headers, bullets, bold) */
function MarkdownReport({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## '))  return <h2 key={i} className="text-base font-bold text-slate-900 mt-4 mb-1 first:mt-0">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h3>;
        if (line.startsWith('- '))   return <li key={i} className="ml-3 list-disc list-inside text-slate-600">{line.replace('- ', '')}</li>;
        if (line.trim() === '')      return <div key={i} className="h-1" />;
        // Render **bold**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NewsAnalysisModal({ stock, onClose, apiBase }: Props) {
  const [selectedDays, setSelectedDays] = useState<7 | 30 | 90>(30);
  const [phase, setPhase]               = useState<'picker' | 'loading' | 'result' | 'error'>('picker');
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(LOADING_STEPS.map(s => ({ ...s })));
  const [currentStep, setCurrentStep]   = useState(0);
  const [result, setResult]             = useState<NewsResult | null>(null);
  const [errorMsg, setErrorMsg]         = useState('');
  const [showArticles, setShowArticles] = useState(false);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAnalyze = async () => {
    if (!stock) return;
    setPhase('loading');
    setResult(null);
    setErrorMsg('');
    setShowArticles(false);

    // Initialize loading steps
    setLoadingSteps(LOADING_STEPS.map(s => ({ ...s, done: false })));
    setCurrentStep(0);

    try {
      const res = await fetch(`${apiBase}/api/news/analyze/stream`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ticker: stock.ticker, days: selectedDays }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error("Tidak ada data stream dari server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        // Save the last incomplete line
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.replace(/^data:\s*/, "").trim();
          if (!cleanLine) continue;

          try {
            const parsed = JSON.parse(cleanLine);
            
            if (parsed.status === 'start') {
              setCurrentStep(0);
            } else if (parsed.status === 'progress') {
              if (parsed.step === 'analyze_sentiment') {
                // Fetch news is done, starting sentiment analysis
                setLoadingSteps(prev => prev.map((s, i) => i === 0 ? { ...s, done: true } : s));
                setCurrentStep(1);
              } else if (parsed.step === 'generate_report') {
                // Sentiment analysis is done, starting report generation
                setLoadingSteps(prev => prev.map((s, i) => i <= 1 ? { ...s, done: true } : s));
                setCurrentStep(2);
              }
            } else if (parsed.status === 'complete') {
              const data: NewsResult = parsed.result;
              setResult(data);
              setLoadingSteps(prev => prev.map(s => ({ ...s, done: true })));
              setCurrentStep(3);
              // Short delay for UX — show all steps green before result
              setTimeout(() => setPhase('result'), 600);
            } else if (parsed.status === 'error') {
              throw new Error(parsed.message || "Gagal melakukan analisis berita.");
            }
          } catch (err) {
            console.error("Error parsing stream chunk:", err);
            // If it is our thrown error, rethrow it to trigger the catch block
            if (err instanceof Error && (err.message || "").includes("Gagal")) {
              throw err;
            }
          }
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setPhase('error');
    }
  };

  if (!stock) return null;

  const sc = result ? sentimentColor(result.sentiment) : null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      {/* Drawer / Modal */}
      <motion.div
        key="drawer"
        initial={{ opacity: 0, x: "-50%", y: "-40%", scale: 0.97 }}
        animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
        exit={{ opacity: 0, x: "-50%", y: "-40%", scale: 0.97 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        className="fixed top-1/2 left-1/2 z-50 w-[92%] sm:w-[640px] md:w-[768px] lg:w-[850px] bg-white rounded-2xl shadow-2xl shadow-black/20 border border-slate-100 overflow-hidden flex flex-col max-h-[calc(100vh-160px)] sm:max-h-[90vh]"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Analisis Berita AI</p>
              <p className="text-[11px] text-slate-400 font-medium">{stock.symbol} · {stock.name}</p>
            </div>
          </div>
          <button
            id="news-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 min-h-0">

          {/* ──────────────── PICKER PHASE ──────────────── */}
          <AnimatePresence mode="wait">
            {phase === 'picker' && (
              <motion.div
                key="picker"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-5 space-y-5"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Pilih Periode Analisis
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {PERIOD_OPTIONS.map(opt => (
                      <button
                        key={opt.days}
                        id={`news-period-${opt.days}`}
                        onClick={() => setSelectedDays(opt.days)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all',
                          selectedDays === opt.days
                            ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary'
                        )}
                      >
                        <p className="text-sm font-bold">{opt.label}</p>
                        <p className={cn('text-[10px] mt-0.5 font-medium', selectedDays === opt.days ? 'text-white/70' : 'text-slate-400')}>
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> LangGraph Agent — 6 Node Pipeline</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { icon: '📡', label: 'Fetch News' },
                      { icon: '🔍', label: 'Data Quality' },
                      { icon: '🗂️', label: 'Filter Articles' },
                      { icon: '🧠', label: 'Analyze Sentiment' },
                      { icon: '📝', label: 'Generate Report' },
                      { icon: '✅', label: 'Evaluate Output' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-500">
                        <span>{s.icon}</span><span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-400">Estimasi waktu: 45–90 detik · Self-healing loop aktif</p>
                </div>

                <button
                  id="news-analyze-btn"
                  onClick={handleAnalyze}
                  className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
                >
                  <Newspaper className="w-4 h-4" />
                  Analisis {selectedDays} Hari Terakhir
                </button>
              </motion.div>
            )}

            {/* ──────────────── LOADING PHASE ──────────────── */}
            {phase === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center text-center gap-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                  >
                    <Newspaper className="w-7 h-7 text-primary" />
                  </motion.div>
                  <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 animate-pulse" />
                </div>

                <div>
                  <p className="text-base font-bold text-slate-900 mb-1">
                    Menganalisis {stock.symbol}...
                  </p>
                  <p className="text-xs text-slate-400">
                    Periode: {selectedDays} hari · LangGraph AI Agent berjalan
                  </p>
                </div>

                {/* Step indicators */}
                <div className="w-full space-y-2">
                  {loadingSteps.map((step, idx) => {
                    const isActive = idx === currentStep && !step.done;
                    const isDone   = step.done;
                    const isPending = !isDone && !isActive;
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                          isDone
                            ? 'bg-emerald-50 border-emerald-200'
                            : isActive
                              ? 'bg-primary/8 border-primary/25 shadow-sm shadow-primary/10'
                              : 'bg-slate-50/60 border-slate-100'
                        )}
                      >
                        {/* Node index badge */}
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold',
                          isDone    ? 'bg-emerald-500 text-white'
                          : isActive ? 'bg-primary text-white'
                          : 'bg-slate-200 text-slate-400'
                        )}>
                          {isDone ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                        </div>

                        {/* Label + desc */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-xs font-semibold leading-tight',
                            isDone ? 'text-emerald-700' : isActive ? 'text-primary' : 'text-slate-400'
                          )}>
                            {step.label}
                          </p>
                          {(isActive || isDone) && (
                            <p className={cn(
                              'text-[10px] mt-0.5 truncate',
                              isDone ? 'text-emerald-500' : 'text-primary/60'
                            )}>
                              {isDone ? '✓ Selesai' : step.desc}
                            </p>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="flex-shrink-0">
                          {isDone && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded">DONE</span>}
                          {isActive && (
                            <div className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin text-primary" />
                              <motion.span
                                className="text-[9px] font-bold text-primary"
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                              >
                                RUN
                              </motion.span>
                            </div>
                          )}
                          {isPending && <Clock className="w-3 h-3 text-slate-300" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ──────────────── ERROR PHASE ──────────────── */}
            {phase === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-6 flex flex-col items-center text-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">Analisis Gagal</p>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">{errorMsg}</p>
                </div>
                <button
                  id="news-retry-btn"
                  onClick={() => setPhase('picker')}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Coba Lagi
                </button>
              </motion.div>
            )}

            {/* ──────────────── RESULT PHASE ──────────────── */}
            {phase === 'result' && result && sc && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="divide-y divide-slate-100"
              >
                {/* Sentiment Overview */}
                <div className={cn('p-5 flex items-center justify-between gap-4', sc.bg)}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-11 h-11 rounded-xl border flex items-center justify-center', sc.bg, sc.border)}>
                      <SentimentIcon s={result.sentiment} />
                    </div>
                    <div>
                      <p className={cn('text-lg font-bold', sc.text)}>{result.sentiment}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {result.filtered_article_count ?? result.article_count} artikel relevan
                        {result.filtered_article_count != null && result.filtered_article_count !== result.article_count && (
                          <span className="text-slate-400"> (dari {result.article_count})</span>
                        )}
                        {' '}· {result.lookback_days} hari
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-3xl font-bold tabular-nums', sc.text)}>
                      {result.sentiment_score > 0 ? '+' : ''}{result.sentiment_score}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Sentiment Score</p>
                  </div>
                </div>

                {/* Evaluation Badge */}
                {result.evaluation_result && (
                  <div className={cn(
                    'mx-5 mt-3 mb-0 px-3 py-2 rounded-xl border flex items-center gap-2 text-xs',
                    result.evaluation_result.verdict === 'APPROVED'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  )}>
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-semibold">Evaluasi LLM:</span>
                    <span>Skor {result.evaluation_result.quality_score}/100</span>
                    <span className="ml-auto font-bold text-[10px]">
                      {result.evaluation_result.forced_approve ? 'MAX RETRY' : result.evaluation_result.verdict}
                    </span>
                    {result.retry_count > 0 && (
                      <span className="text-[10px] text-slate-400">· {result.retry_count}x retry</span>
                    )}
                  </div>
                )}

                {/* Confidence + Score Bar */}
                <div className="px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Confidence Level</p>
                    <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-bold border', confidenceColor(result.confidence))}>
                      {result.confidence}
                    </span>
                  </div>
                  {/* Score bar */}
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300" />
                    <motion.div
                      className={cn('absolute top-0 h-full rounded-full', result.sentiment_score >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
                      style={{ left: result.sentiment_score >= 0 ? '50%' : `${50 + result.sentiment_score / 2}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.abs(result.sentiment_score) / 2}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                    <span>-100 BEARISH</span>
                    <span>NETRAL</span>
                    <span>BULLISH +100</span>
                  </div>
                </div>

                {/* Key Topics */}
                {result.key_topics.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" /> Topik Utama
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.key_topics.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-primary/8 border border-primary/15 text-primary rounded-lg text-xs font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catalysts */}
                {result.catalysts.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-500" /> Katalis Positif
                    </p>
                    <ul className="space-y-1.5">
                      {result.catalysts.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk Factors */}
                {result.risk_factors.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Faktor Risiko
                    </p>
                    <ul className="space-y-1.5">
                      {result.risk_factors.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Final Report */}
                {result.final_report && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5 text-primary" /> Ringkasan Analisis
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <MarkdownReport text={result.final_report} />
                    </div>
                  </div>
                )}

                {/* Articles */}
                {result.articles.length > 0 && (
                  <div className="px-5 py-4">
                    <button
                      id="news-toggle-articles"
                      onClick={() => setShowArticles(v => !v)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 group"
                    >
                      <span className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                        Daftar Berita ({result.articles.length})
                      </span>
                      {showArticles
                        ? <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      }
                    </button>

                    <AnimatePresence>
                      {showArticles && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden mt-3 space-y-2"
                        >
                          {result.articles.map((a, i) => (
                            <a
                              key={i}
                              href={a.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-primary/20 hover:bg-primary/3 transition-all group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold text-slate-800 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                  {a.title}
                                </p>
                                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                              </div>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-slate-400 font-medium">{a.source}</span>
                                <span className="text-[10px] text-slate-300">·</span>
                                <span className="text-[10px] text-slate-400">{a.date}</span>
                              </div>
                              {a.summary && (
                                <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-snug">{a.summary}</p>
                              )}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Analyze Again */}
                <div className="px-5 py-4">
                  <button
                    id="news-analyze-again-btn"
                    onClick={() => setPhase('picker')}
                    className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:border-primary/30 hover:text-primary transition-colors"
                  >
                    Analisis Ulang
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
