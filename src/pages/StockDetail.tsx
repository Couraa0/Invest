import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  Star, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Newspaper,
  X
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

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}

const chartData = [
  { name: '09:00', price: 10100 },
  { name: '10:00', price: 10150 },
  { name: '11:00', price: 10120 },
  { name: '12:00', price: 10200 },
  { name: '13:00', price: 10180 },
  { name: '14:00', price: 10220 },
  { name: '15:00', price: 10250 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' } }),
};

export default function StockDetail() {
  const { symbol } = useParams();
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [activeRange, setActiveRange] = useState('1D');

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
                <h1 className="text-xl font-bold text-primary tracking-tight">PT Bank Central Asia Tbk.</h1>
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              </div>
              <p className="text-xs text-on-surface-variant/50 font-medium">Satu dari 10 bank terbesar di Asia Tenggara</p>
            </div>
          </div>
        </div>

        <div className="card px-5 py-3 rounded-2xl flex items-center gap-4">
          <div>
            <p className="stat-label mb-1">Harga Terkini</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary tracking-tight">10.250</span>
              <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-lg text-xs font-bold border border-secondary/15 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +1.25%
              </span>
            </div>
          </div>
          <div className="w-px h-10 bg-slate-100 hidden sm:block" />
          <button className="p-2.5 bg-slate-50 rounded-xl text-on-surface-variant hover:text-primary transition-all hover:bg-slate-100 active:scale-95">
            <Share2 className="w-4 h-4" />
          </button>
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
                  onClick={() => setActiveRange(t)}
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
              <Clock className="w-3 h-3" /> Update: 4:00 PM WIB
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sdColorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 80', 'dataMax + 80']} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  itemStyle={{ fontWeight: '700', color: '#0F172A' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#006c49"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#sdColorPrice)"
                  dot={false}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Rating */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card p-6 rounded-2xl flex flex-col items-center justify-center text-center"
        >
          <h3 className="stat-label mb-6">InvestAI Rating</h3>
          <div className="relative w-40 h-40 mb-5">
            <svg className="w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <motion.circle
                cx="80" cy="80" r="68" fill="none" stroke="#006c49" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={427.08}
                initial={{ strokeDashoffset: 427.08 }}
                animate={{ strokeDashoffset: 427.08 * (1 - 0.88) }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-primary tracking-tight">8.8</span>
              <span className="text-[9px] font-bold text-secondary uppercase tracking-wider mt-0.5">Sangat Baik</span>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant/50 max-w-[180px] leading-relaxed">
            Berdasarkan Fundamental (9.2), Teknikal (8.5), dan Sentimen (8.7).
          </p>
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
          <p className="text-sm text-primary/70 leading-relaxed mb-5 relative">
            BBCA menunjukkan performa yang sangat stabil dengan fundamental yang kuat. Harga berada di area konsolidasi sehat setelah kenaikan minggu lalu. AI kami mendeteksi sentimen positif dari laporan kuartal terakhir yang melampaui ekspektasi analis. Pilihan aman bagi investor yang mencari pertumbuhan jangka panjang.
          </p>
          <div className="flex flex-wrap gap-2 relative">
            {['Likuiditas Tinggi', 'Dividen Rutin', 'Blue Chip', 'Aman'].map(tag => (
              <div key={tag} className="flex items-center gap-1.5 bg-secondary/6 px-3 py-1.5 rounded-lg border border-secondary/10 text-xs font-semibold text-secondary">
                <CheckCircle2 className="w-3 h-3" /> {tag}
              </div>
            ))}
          </div>
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
            {[
              { label: 'RSI (14)', value: '58.4', status: 'Netral', up: false },
              { label: 'MACD', value: 'Golden Cross', status: 'Beli Kuat', up: true },
              { label: 'MA (20)', value: 'Di Atas MA', status: 'Bullish', up: true },
            ].map((ind, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div>
                  <p className="stat-label mb-1">{ind.label}</p>
                  <p className="text-sm font-semibold text-primary">{ind.value}</p>
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border",
                  ind.up ? "bg-secondary/8 text-secondary border-secondary/12" : "bg-primary/8 text-primary border-primary/12"
                )}>
                  {ind.status}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* News & Sentiment */}
        <motion.section
          custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-12 card p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-5">
            <div>
              <h3 className="text-base font-bold text-primary mb-0.5">Sentimen & Berita Terkini</h3>
              <p className="text-xs text-on-surface-variant/50">Analisis real-time dari 20+ sumber berita finansial terpercaya.</p>
            </div>
            <div className="flex items-center gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <div className="text-center">
                <span className="text-2xl font-bold text-secondary">82%</span>
                <p className="stat-label mt-0.5">Positif</p>
              </div>
              <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-secondary rounded-l-full" style={{ width: '82%' }} />
                <div className="h-full bg-error rounded-r-full" style={{ width: '18%' }} />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-error">18%</span>
                <p className="stat-label mt-0.5">Negatif</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'BCA Catat Laba Bersih Tumbuh 12% di Q1 2024', source: 'Bisnis.com', time: '2 jam lalu', pos: true },
              { title: 'Analis Prediksi Target Harga BBCA Tembus 11.000', source: 'CNBC Indonesia', time: '5 jam lalu', pos: true },
            ].map((news, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 bg-slate-50/60 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group shadow-[0_0_0_0] hover:shadow-sm"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {news.pos ? <TrendingUp className="w-5 h-5 text-secondary" /> : <Newspaper className="w-5 h-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-primary mb-1.5 line-clamp-2 leading-snug group-hover:text-secondary transition-colors">{news.title}</h4>
                  <p className="stat-label">{news.time} · {news.source}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/20 shrink-0 self-center" />
              </div>
            ))}
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
                  <p className="text-xs text-on-surface-variant/50">Deep Analysis Terakhir</p>
                </div>
              </div>

              <div className="bg-secondary/6 rounded-2xl p-5 mb-5 border border-secondary/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="stat-label">Keputusan Akhir</span>
                  <span className="px-3 py-1 bg-secondary text-white rounded-lg text-xs font-bold shadow-sm">STRONG BUY</span>
                </div>
                <p className="text-sm text-primary/70 leading-relaxed">
                  Berdasarkan fundamental superior dan sentimen positif, kami merekomendasikan akumulasi bertahap pada {symbol} di area harga saat ini.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  'Potensi kenaikan 15-20% dalam 3-6 bulan kedepan.',
                  'Dukungan kuat pada level Moving Average harian.',
                  'Dividen stabil yang mendukung performa jangka panjang.'
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
