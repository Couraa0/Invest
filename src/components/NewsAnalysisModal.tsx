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
  name: string;
}

interface ArticleItem {
  title: string;
  link: string;
  source: string;
  date: string;
  summary: string;
}

interface EvaluationResult {
  quality_score: number;
  sentiment_consistent: boolean;
  recommendation_clear: boolean;
  issues: string[];
  verdict: 'APPROVED' | 'NEEDS_REVISION';
  forced_approve?: boolean;
}

interface NewsResult {
  status: string;
  ticker: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NETRAL';
  sentiment_score: number;
  confidence: 'TINGGI' | 'SEDANG' | 'RENDAH';
  article_count: number;
  filtered_article_count: number;
  data_quality: string;
  evaluation_result: EvaluationResult | null;
  retry_count: number;
  key_topics: string[];
  risk_factors: string[];
  catalysts: string[];
  final_report: string;
  articles: ArticleItem[];
  lookback_days: number;
}

interface LoadingStep {
  key: string;
  label: string;
  desc: string;
  done: boolean;
}

interface Props {
  stock: StockForNews | null;
  initialDays: number;
  onClose: () => void;
  apiBase: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { days: 7, label: '7 Hari', desc: 'Berita minggu ini' },
  { days: 30, label: '30 Hari', desc: 'Berita bulan ini' },
  { days: 90, label: '90 Hari', desc: 'Berita 3 bulan' },
] as const;

const LOADING_STEPS: LoadingStep[] = [
  { key: 'fetch', label: 'Fetch News', desc: 'Scraping Google News RSS...', done: false },
  { key: 'quality', label: 'Data Quality Check', desc: 'Validasi jumlah artikel...', done: false },
  { key: 'filter', label: 'Filter Articles', desc: 'Keyword + LLM relevance scoring...', done: false },
  { key: 'sentiment', label: 'Analyze Sentiment', desc: 'LLM analisis sentimen berita...', done: false },
  { key: 'report', label: 'Generate Report', desc: 'Menyusun laporan analisis...', done: false },
  { key: 'evaluate', label: 'Evaluate Output', desc: 'Quality gate & self-healing check...', done: false },
];


// ─── Helpers ──────────────────────────────────────────────────────────────────

function sentimentColor(s: string) {
  if (s === 'BULLISH') return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (s === 'BEARISH') return { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' };
  return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
}

function confidenceColor(c: string) {
  if (c === 'TINGGI') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (c === 'SEDANG') return 'text-amber-600   bg-amber-50   border-amber-200';
  return 'text-slate-500   bg-slate-50   border-slate-200';
}

function SentimentIcon({ s }: { s: string }) {
  if (s === 'BULLISH') return <TrendingUp className="w-5 h-5 text-emerald-600" />;
  if (s === 'BEARISH') return <TrendingDown className="w-5 h-5 text-red-500" />;
  return <Minus className="w-5 h-5 text-amber-500" />;
}

/** Render laporan markdown sederhana (headers, bullets, bold) */
function MarkdownReport({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1 text-sm text-slate-700 leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-slate-900 mt-4 mb-1 first:mt-0">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-slate-800 mt-3 mb-1">{line.replace('### ', '')}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="ml-3 list-disc list-inside text-slate-600">{line.replace('- ', '')}</li>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
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

export default function NewsAnalysisModal({ stock, initialDays, onClose, apiBase }: Props) {
  const [phase, setPhase] = useState<'loading' | 'result' | 'error'>('loading');
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(LOADING_STEPS.map(s => ({ ...s })));
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<NewsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showArticles, setShowArticles] = useState(false);
  const analyzeRef = React.useRef<{ ticker: string, days: number } | null>(null);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAnalyze = React.useCallback(async () => {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: stock.ticker, days: initialDays }),
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
  }, [stock, initialDays, apiBase]);

  useEffect(() => {
    if (stock && (!analyzeRef.current || analyzeRef.current.ticker !== stock.ticker || analyzeRef.current.days !== initialDays)) {
      analyzeRef.current = { ticker: stock.ticker, days: initialDays };
      handleAnalyze();
    }
  }, [stock, initialDays, handleAnalyze]);

  if (!stock) return null;

  const sc = result ? sentimentColor(result.sentiment) : null;

  return (
    <motion.div
      key="news_view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full bg-white rounded-2xl border border-slate-100 flex flex-col min-h-[calc(100vh-130px)] shadow-sm overflow-hidden"
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          Kembali
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="overflow-y-auto flex-1 min-h-0">

        <AnimatePresence mode="wait">
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
                  Periode: {initialDays} hari · LangGraph AI Agent berjalan
                </p>
              </div>

              {/* Step indicators */}
              <div className="w-full space-y-2">
                {loadingSteps.map((step, idx) => {
                  const isActive = idx === currentStep && !step.done;
                  const isDone = step.done;
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
                        isDone ? 'bg-emerald-500 text-white'
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
                onClick={() => handleAnalyze()}
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
              className="p-5 flex flex-col gap-5"
            >
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
              {/* Header Grid: Sentiment & Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sentiment Overview */}
                <div className={cn('p-4 rounded-xl flex items-center justify-between gap-4 border', sc.bg, sc.border)}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-white border flex items-center justify-center', sc.border)}>
                      <SentimentIcon s={result.sentiment} />
                    </div>
                    <div>
                      <p className={cn('text-base font-bold', sc.text)}>{result.sentiment}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {result.filtered_article_count ?? result.article_count} artikel relevan
                        {result.filtered_article_count != null && result.filtered_article_count !== result.article_count && (
                          <span className="text-slate-400"> (dari {result.article_count})</span>
                        )}
                        {' '}· {result.lookback_days} hari
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-2xl font-bold tabular-nums leading-none', sc.text)}>
                      {result.sentiment_score > 0 ? '+' : ''}{result.sentiment_score}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Score</p>
                  </div>
                </div>

                {/* Confidence + Score Bar */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confidence</p>
                    <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold border', confidenceColor(result.confidence))}>
                      {result.confidence}
                    </span>
                  </div>
                  <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400" />
                    <motion.div
                      className={cn('absolute top-0 h-full rounded-full', result.sentiment_score >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
                      style={{ left: result.sentiment_score >= 0 ? '50%' : `${50 + result.sentiment_score / 2}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.abs(result.sentiment_score) / 2}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Bearish</span>
                    <span>Netral</span>
                    <span>Bullish</span>
                  </div>
                </div>
              </div>

              {/* Main Content Grid: Report vs Catalysts/Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Column: Summary */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  {result.final_report && (
                    <div className="flex-1 min-h-0 flex flex-col">
                      <p className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Newspaper className="w-4 h-4 text-primary" /> Ringkasan Analisis
                      </p>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex-1 overflow-y-auto max-h-[320px] custom-scrollbar">
                        <MarkdownReport text={result.final_report} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Key Topics, Catalysts, Risks */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Key Topics */}
                  {result.key_topics.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
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

                  {/* Catalysts & Risks in 2 columns on sm/md, stacked on lg */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Catalysts */}
                    {result.catalysts.length > 0 && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-emerald-500" /> Katalis Positif
                        </p>
                        <ul className="space-y-1.5">
                          {result.catalysts.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                              <span className="leading-snug">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {result.risk_factors.length > 0 && (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                        <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Faktor Risiko
                        </p>
                        <ul className="space-y-1.5">
                          {result.risk_factors.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                              <span className="leading-snug">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer: Articles & Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                {result.articles.length > 0 && (
                  <button
                    id="news-toggle-articles"
                    onClick={() => setShowArticles(v => !v)}
                    className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between sm:justify-center gap-2 group"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                      Referensi Berita ({result.articles.length})
                    </div>
                    {showArticles
                      ? <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors sm:hidden" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors sm:hidden" />
                    }
                  </button>
                )}

                <button
                  id="news-analyze-again-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 flex-shrink-0"
                >
                  Pilih Periode Lain
                </button>
              </div>

              <AnimatePresence>
                {showArticles && result.articles.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.articles.map((a, i) => (
                        <a
                          key={i}
                          href={a.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 bg-white border border-slate-100 shadow-sm rounded-xl hover:border-primary/30 hover:shadow-md transition-all group h-full flex flex-col"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[11px] font-bold text-slate-800 group-hover:text-primary transition-colors leading-snug line-clamp-3">
                              {a.title}
                            </p>
                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                          </div>
                          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-50">
                            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">{a.source}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">{a.date}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
