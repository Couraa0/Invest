import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  ArrowLeft, 
  TrendingUp, 
  Newspaper, 
  Activity, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  PieChart,
  Target,
  BarChart3,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import StockIcon from '../components/StockIcon';

function BotIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  );
}

const stocks = [
  { symbol: 'BBCA', name: 'PT Bank Central Asia Tbk.', price: '10.250', change: '+1.25%', up: true },
  { symbol: 'ASII', name: 'Astra International Tbk.', price: '5.125', change: '-0.50%', up: false },
  { symbol: 'TLKM', name: 'Telkom Indonesia Tbk.', price: '3.890', change: '+0.75%', up: true },
  { symbol: 'BMRI', name: 'Bank Mandiri Tbk.', price: '6.700', change: '+1.50%', up: true },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk.', price: '68', change: '0.00%', up: true },
  { symbol: 'UNVR', name: 'Unilever Indonesia Tbk.', price: '3.120', change: '-1.10%', up: false },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
};

export default function Signals() {
  const [view, setView] = useState<'list' | 'analysis'>('list');
  const [selectedStock, setSelectedStock] = useState<typeof stocks[0] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleStartAnalysis = (stock: typeof stocks[0]) => {
    setSelectedStock(stock);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setView('analysis');
    }, 2000);
  };

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
        <h2 className="text-xl font-bold text-primary mb-2">Menganalisis {selectedStock?.symbol}...</h2>
        <p className="text-sm text-on-surface-variant/60 max-w-xs">Membedah fundamental, teknikal, dan sentimen pasar secara real-time.</p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 bg-primary/30 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary tracking-tight">Pilih Saham untuk Analisis</h1>
                <p className="text-sm text-on-surface-variant/60 mt-1">Dapatkan sinyal beli/jual mendalam dengan algoritma InvestAI.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input
                  type="text"
                  placeholder="Cari kode saham (BBCA, ASII...)"
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>

            {/* Stock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock, i) => (
                <motion.div
                  key={stock.symbol}
                  custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  className="card p-5 rounded-2xl hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <StockIcon symbol={stock.symbol} />
                      <div>
                        <h3 className="text-sm font-bold text-primary">{stock.symbol}</h3>
                        <p className="text-[10px] text-on-surface-variant/50 font-medium truncate max-w-[110px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">Rp {stock.price}</p>
                      <p className={cn("text-xs font-semibold", stock.up ? "text-secondary" : "text-error")}>{stock.change}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartAnalysis(stock)}
                    className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Analisis dengan AI
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
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
                  <p className="text-xs text-on-surface-variant/50">Real-time AI Analysis</p>
                </div>
              </div>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                <input type="text" placeholder="Cari kode lain..." className="input-field pl-9 text-xs py-2 w-52" />
              </div>
            </div>

            {/* Stock Info Card */}
            <div className="card p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <StockIcon symbol={selectedStock?.symbol || ''} className="w-14 h-14 text-xl" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-primary tracking-tight">{selectedStock?.symbol}</h2>
                      <span className="px-2 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[9px] font-bold uppercase tracking-wider">IDX</span>
                    </div>
                    <p className="text-xs text-on-surface-variant/50 font-medium mb-2">{selectedStock?.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-primary">Rp {selectedStock?.price}</span>
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-lg text-xs font-bold border border-secondary/15">+1.25%</span>
                    </div>
                  </div>
                </div>
                {/* Mini Chart */}
                <div className="flex-1 max-w-xs hidden lg:block">
                  <div className="flex items-end gap-1 h-16">
                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex-1 bg-secondary/20 rounded-sm origin-bottom"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 stat-label">
                    <span>9:00 AM</span><span>TODAY</span><span>4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary + Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 card p-6 rounded-2xl">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-primary">Ringkasan AI InvestAI</h3>
                </div>
                <p className="text-sm text-primary/75 leading-relaxed mb-5">
                  {selectedStock?.symbol} menunjukkan performa yang sangat stabil dengan fundamental yang kuat. Harga berada di area konsolidasi sehat setelah kenaikan minggu lalu. AI kami mendeteksi sentimen positif dari laporan kuartal terakhir yang melampaui ekspektasi analis. Pilihan aman untuk pertumbuhan jangka panjang.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Likuiditas Tinggi', 'Dividen Rutin', 'Blue Chip', 'Bullish Momentum'].map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/6 border border-secondary/10 text-secondary rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <h3 className="stat-label mb-5">InvestAI Rating</h3>
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="72" cy="72" r="62" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <motion.circle
                      cx="72" cy="72" r="62" fill="none" stroke="#006c49" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={389.56}
                      initial={{ strokeDashoffset: 389.56 }}
                      animate={{ strokeDashoffset: 389.56 * (1 - 0.88) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-primary tracking-tight">8.8</span>
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-wider">SANGAT BAIK</span>
                  </div>
                </div>
                <p className="text-[10px] text-on-surface-variant/50 max-w-[160px] leading-relaxed">Rata-rata tertimbang Fundamental, Teknikal & Sentimen.</p>
              </div>
            </div>

            {/* Technical + News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-bold text-primary">Indikator Teknikal</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'RSI (Relative Strength Index)', value: '65.4', status: 'Oversold' },
                    { label: 'Tren Momentum', value: 'Strong Buy', status: 'Optimistic' },
                    { label: 'Moving Average (MA20)', value: 'Above MA', status: 'Bullish' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs font-semibold text-primary">{item.label}</p>
                        <p className="stat-label mt-0.5">Diperbarui 5 menit lalu</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-secondary">{item.value}</p>
                        <p className="text-[9px] font-bold text-secondary/70 uppercase tracking-wider">{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-bold text-primary">Sentimen Berita</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { title: `${selectedStock?.symbol} Catat Laba Bersih Tumbuh 12% di Q1`, time: '2 jam lalu', source: 'Bisnis.com', pos: true },
                    { title: `Analis Prediksi Target Harga ${selectedStock?.symbol} ke Rp 11.000`, time: '5 jam lalu', source: 'CNBC Indonesia', pos: true },
                    { title: 'Sektor Perbankan Tetap Tangguh Hadapi Suku Bunga', time: '1 hari lalu', source: 'Kontan', pos: false },
                  ].map((news, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", news.pos ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-on-surface-variant')}>
                        {news.pos ? <TrendingUp className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-primary leading-snug mb-1">{news.title}</h4>
                        <p className="stat-label">{news.time} · {news.source}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant/20 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fundamental */}
            <div className="card p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-5">
                <PieChart className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-primary">Kesehatan Fundamental</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'P/E Ratio', value: '24.5x', status: 'Wajar (Avg: 22x)' },
                  { label: 'ROE', value: '22.1%', status: 'Sangat Efisien' },
                  { label: 'Dividend Yield', value: '2.45%', status: 'Stabil' },
                  { label: 'Market Cap', value: '1.26k T', status: 'Blue Chip' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="stat-label mb-1.5">{item.label}</p>
                    <p className="text-xl font-bold text-primary mb-0.5">{item.value}</p>
                    <p className="text-[10px] font-semibold text-secondary uppercase tracking-wider">{item.status}</p>
                  </div>
                ))}
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
                        <p className="text-xs text-on-surface-variant/50 font-medium">Deep Analysis Terakhir</p>
                      </div>
                    </div>

                    <div className="bg-secondary/6 rounded-2xl p-5 mb-5 border border-secondary/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="stat-label">Keputusan InvestAI</span>
                        <span className="px-3 py-1 bg-secondary text-white rounded-lg text-xs font-bold shadow-sm">STRONG BUY</span>
                      </div>
                      <p className="text-sm text-primary/75 leading-relaxed">
                        Berdasarkan integrasi data teknikal bullish dan fundamental superior, kami merekomendasikan akumulasi bertahap pada {selectedStock?.symbol} di area harga saat ini (Rp {selectedStock?.price}).
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {[
                        'Potensi kenaikan 15-20% dalam 3-6 bulan kedepan.',
                        'Dukungan kuat pada level Moving Average 20 hari.',
                        'Sentimen positif dari ekspansi pasar regional baru-baru ini.'
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
                    <p className="text-center mt-4 stat-label text-center">⚠ Investasi memiliki risiko. Gunakan AI sebagai referensi riset mandiri Anda.</p>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
