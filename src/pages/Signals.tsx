import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  ArrowLeft, 
  TrendingUp, 
  Newspaper, 
  BarChart3, 
  Activity, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  PieChart,
  Target
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const stocks = [
  { symbol: 'BBCA', name: 'PT Bank Central Asia Tbk.', price: '10.250', change: '+1.25%', color: 'text-secondary' },
  { symbol: 'ASII', name: 'Astra International Tbk.', price: '5.125', change: '-0.50%', color: 'text-error' },
  { symbol: 'TLKM', name: 'Telkom Indonesia Tbk.', price: '3.890', change: '+0.75%', color: 'text-secondary' },
  { symbol: 'BMRI', name: 'Bank Mandiri Tbk.', price: '6.700', change: '+1.50%', color: 'text-secondary' },
  { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk.', price: '68', change: '0.00%', color: 'text-on-surface-variant' },
  { symbol: 'UNVR', name: 'Unilever Indonesia Tbk.', price: '3.120', change: '-1.10%', color: 'text-error' },
];

export default function Signals() {
  const [view, setView] = useState<'list' | 'analysis'>('list');
  const [selectedStock, setSelectedStock] = useState<typeof stocks[0] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = (stock: typeof stocks[0]) => {
    setSelectedStock(stock);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setView('analysis');
    }, 2000);
  };

  const [showRecommendation, setShowRecommendation] = useState(false);

  if (isAnalyzing) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8"
        >
          <Zap className="w-10 h-10 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-black text-primary mb-2">AI sedang menganalisis {selectedStock?.symbol}...</h2>
        <p className="text-on-surface-variant max-w-sm mx-auto">Membedah data fundamental, teknikal, dan sentimen pasar secara real-time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Pilih Saham untuk Analisis AI</h1>
                <p className="text-on-surface-variant font-medium text-sm">Dapatkan sinyal beli/jual mendalam dengan algoritma InvestAI.</p>
              </div>
              <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari Kode Saham (BBCA, ASII, ...)"
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-primary font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="glass-card p-6 rounded-[2rem] group hover:shadow-2xl hover:shadow-primary/5 transition-all border-white/40">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-primary text-sm border border-slate-100 shadow-sm">
                        {stock.symbol}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary">{stock.symbol}</h3>
                        <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest truncate max-w-[120px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary">Rp {stock.price}</p>
                      <p className={cn("text-xs font-bold", stock.color)}>{stock.change}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartAnalysis(stock)}
                    className="w-full py-4 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Analisis dengan AI
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header / Back */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('list')}
                  className="p-3 bg-white rounded-2xl text-on-surface-variant hover:text-primary shadow-sm hover:shadow-md transition-all border border-slate-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-black text-primary tracking-tight">Analisis Saham {selectedStock?.symbol}</h1>
              </div>
              <div className="relative group w-64 lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input 
                  type="text" 
                  placeholder="Cari kode saham lain..."
                  className="w-full pl-10 pr-6 py-2.5 bg-white border border-slate-100 rounded-xl text-sm focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </header>

            {/* Stock Header Card */}
            <div className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-primary shadow-sm border border-slate-100">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-3xl font-black text-primary tracking-tighter">{selectedStock?.symbol}</h2>
                      <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">IDX: {selectedStock?.symbol}</span>
                    </div>
                    <p className="text-sm font-bold text-on-surface-variant/60">{selectedStock?.name}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-2xl font-black text-primary">Rp {selectedStock?.price}</span>
                      <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-black">+1.25%</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 max-w-md lg:block hidden">
                  <div className="h-24 w-full flex items-end gap-1 px-4">
                    {[40, 55, 45, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="flex-1 bg-secondary/20 rounded-t-sm"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest px-4">
                    <span>9:00 AM</span>
                    <span>TODAY</span>
                    <span>4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary and Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 glass-card p-10 rounded-[2.5rem] border-secondary/20 bg-white/40">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-primary">Ringkasan AI InvestAI</h3>
                </div>
                <p className="text-base text-primary/80 leading-relaxed font-medium mb-10">
                  {selectedStock?.symbol} menunjukkan performa yang sangat stabil dengan fundamental yang kuat. Saat ini, harga sedang berada di area konsolidasi sehat setelah kenaikan minggu lalu. AI kami mendeteksi sentimen positif dari rilis laporan kuartal terakhir yang melampaui ekspektasi analis. Ini adalah pilihan aman bagi investor pemula yang mencari pertumbuhan jangka panjang.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Likuiditas Tinggi', 'Dividen Rutin', 'Blue Chip', 'Bullish Momentum'].map((tag, i) => (
                    <div key={i} className="flex items-center gap-2 px-5 py-2.5 bg-secondary/5 border border-secondary/10 text-secondary rounded-full text-xs font-black">
                      <CheckCircle2 className="w-4 h-4" /> {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 glass-card p-10 rounded-[2.5rem] border-white/40 text-center flex flex-col items-center justify-center bg-white/40">
                <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] mb-10">InvestAI Rating</h3>
                <div className="relative w-48 h-48 mb-8">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100" />
                      <motion.circle 
                        cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" 
                        strokeDasharray={552.92}
                        initial={{ strokeDashoffset: 552.92 }}
                        animate={{ strokeDashoffset: 552.92 * (1 - 0.88) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-secondary" 
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-6xl font-black text-primary tracking-tighter">8.8</span>
                     <span className="text-[10px] font-black text-secondary uppercase tracking-widest">SANGAT BAIK</span>
                   </div>
                </div>
                <p className="text-[10px] text-on-surface-variant font-bold leading-relaxed max-w-[200px]">Skor ini berdasarkan rata-rata tertimbang Fundamental, Teknikal, dan Sentimen.</p>
              </div>
            </div>

            {/* Technical and News */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-[2.5rem] border-white/40">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-primary flex items-center gap-3"><Activity className="w-5 h-5 text-secondary" /> Indikator Teknikal</h3>
                  <TrendingUp className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'RSI (Relative Strength Index)', value: '65.4', status: 'Oversold', color: 'text-secondary' },
                    { label: 'Tren Momentum', value: 'Strong Buy', status: 'Optimistic', color: 'text-secondary' },
                    { label: 'Moving Average (MA20)', value: 'Above MA', status: 'Bullish', color: 'text-secondary' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div>
                        <p className="text-xs font-bold text-primary mb-1">{item.label}</p>
                        <p className="text-[10px] text-on-surface-variant/40 font-medium">Data diperbarui 5 menit lalu</p>
                      </div>
                      <div className="text-right">
                        <p className={cn("text-sm font-black", item.color)}>{item.value}</p>
                        <p className={cn("text-[9px] font-black uppercase tracking-widest", item.color)}>{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] border-white/40">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-primary flex items-center gap-3"><Newspaper className="w-5 h-5 text-secondary" /> Sentimen Berita</h3>
                  <Target className="w-5 h-5 text-on-surface-variant/30" />
                </div>
                <div className="space-y-6">
                  {[
                    { title: `${selectedStock?.symbol} Catat Laba Bersih Tumbuh 12% di Q1`, time: '2 jam lalu', source: 'Bisnis.com', type: 'positive' },
                    { title: `Analis Prediksi Target Harga ${selectedStock?.symbol} ke Rp 11.000`, time: '5 jam lalu', source: 'CNBC Indonesia', type: 'positive' },
                    { title: 'Sektor Perbankan Tetap Tangguh Hadapi Suku Bunga', time: '1 hari lalu', source: 'Kontan', type: 'neutral' },
                  ].map((news, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", news.type === 'positive' ? 'bg-secondary/10 text-secondary' : 'bg-slate-50 text-on-surface-variant')}>
                        {news.type === 'positive' ? <TrendingUp className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary mb-1 leading-snug">{news.title}</h4>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{news.time} • {news.source}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant/20 ml-auto self-center" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fundamental Section */}
            <div className="glass-card p-10 rounded-[2.5rem] border-white/40">
              <h3 className="font-black text-primary mb-10 flex items-center gap-3"><PieChart className="w-5 h-5 text-secondary" /> Kesehatan Fundamental</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: 'P/E Ratio (Murah/Mahal)', value: '24.5x', status: 'Wajar (Ind. Avg: 22x)', color: 'text-secondary' },
                  { label: 'ROE (Efisiensi Modal)', value: '22.1%', status: 'Sangat Efisien', color: 'text-secondary' },
                  { label: 'Dividend Yield', value: '2.45%', status: 'Stabil', color: 'text-secondary' },
                  { label: 'Market Cap', value: '1.26k T', status: 'Gajah di Bursa', color: 'text-primary' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-2">{item.label}</p>
                    <p className="text-2xl font-black text-primary mb-1">{item.value}</p>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest", item.color)}>{item.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30">
               <div className="bg-primary/95 backdrop-blur-xl p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between text-white border border-white/10">
                 <div className="flex items-center gap-4 ml-4">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                     <Bot className="w-6 h-6 text-secondary" />
                   </div>
                   <p className="text-sm font-bold">Butuh bantuan memutuskan?</p>
                 </div>
                 <button 
                   onClick={() => setShowRecommendation(true)}
                   className="bg-secondary text-white px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-secondary/20"
                 >
                   <Sparkles className="w-4 h-4" /> Minta Rekomendasi AI
                 </button>
               </div>
            </div>

            {/* Recommendation Modal */}
            <AnimatePresence>
              {showRecommendation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary/20 backdrop-blur-md">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass-card w-full max-w-xl p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-white/60 relative"
                  >
                    <button 
                      onClick={() => setShowRecommendation(false)}
                      className="absolute top-8 right-8 text-on-surface-variant/40 hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
                    >
                      Close [Esc]
                    </button>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-secondary/20">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-primary">Rekomendasi Final AI</h2>
                        <p className="text-xs font-bold text-on-surface-variant/60">Analisis Deep-Dive Terakhir</p>
                      </div>
                    </div>

                    <div className="bg-secondary/5 rounded-[2rem] p-8 mb-8 border border-secondary/10">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest">Keputusan InvestAI</span>
                        <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-xs font-black shadow-lg shadow-secondary/20">STRONG BUY</span>
                      </div>
                      <p className="text-base text-primary/80 leading-relaxed font-bold">
                        Berdasarkan integrasi data teknikal yang bullish dan fundamental yang superior, kami merekomendasikan untuk melakukan akumulasi bertahap pada {selectedStock?.symbol} di area harga saat ini (Rp {selectedStock?.price}).
                      </p>
                    </div>

                    <div className="space-y-4 mb-10">
                       {[
                         'Potensi kenaikan 15-20% dalam 3-6 bulan kedepan.',
                         'Dukungan kuat pada level Moving Average 20 hari.',
                         'Sentimen positif dari ekspansi pasar regional baru-baru ini.'
                       ].map((item, i) => (
                         <div key={i} className="flex items-start gap-3">
                           <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                             <CheckCircle2 className="w-3 h-3 text-secondary" />
                           </div>
                           <p className="text-sm font-medium text-primary/70">{item}</p>
                         </div>
                       ))}
                    </div>

                    <button 
                      onClick={() => setShowRecommendation(false)}
                      className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Gunakan Rekomendasi Ini
                    </button>
                    
                    <p className="text-center mt-6 text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest px-10">Peringatan: Investasi memiliki risiko. Gunakan rekomendasi AI ini sebagai referensi pendukung riset mandiri Anda.</p>
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

function Bot(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
