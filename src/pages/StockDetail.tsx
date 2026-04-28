import { useState } from 'react';
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
  Bot,
  Lightbulb,
  Newspaper,
  LayoutGrid
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

const chartData = [
  { name: '09:00', price: 10100 },
  { name: '10:00', price: 10150 },
  { name: '11:00', price: 10120 },
  { name: '12:00', price: 10200 },
  { name: '13:00', price: 10180 },
  { name: '14:00', price: 10220 },
  { name: '15:00', price: 10250 },
];

export default function StockDetail() {
  const { symbol } = useParams();
  const [showRecommendation, setShowRecommendation] = useState(false);

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-3 bg-white rounded-2xl border border-slate-100 text-on-surface-variant hover:text-primary shadow-sm hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-5">
            <StockIcon symbol={symbol || ''} className="w-16 h-16 text-2xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-primary tracking-tighter">PT Bank Central Asia Tbk.</h1>
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-sm">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              </div>
              <p className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-widest">Satu dari 10 bank terbesar di Asia Tenggara</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 glass-card px-8 py-5 rounded-[2.5rem] shadow-xl border-white/60">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1.5">Harga Terkini</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-primary tracking-tighter">10.250</span>
              <span className="text-secondary font-black text-xs bg-secondary/10 px-3 py-1 rounded-full flex items-center gap-1 border border-secondary/10">
                <TrendingUp className="w-3.5 h-3.5" /> +1.25%
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
          <button className="p-4 bg-slate-50 rounded-2xl text-on-surface-variant hover:text-primary transition-all active:scale-95">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Card */}
        <section className="lg:col-span-8 glass-card rounded-[3rem] p-10 overflow-hidden relative border-white/60 shadow-2xl shadow-primary/[0.02]">
          <div className="flex items-center justify-between mb-10 relative z-10">
             <div className="flex bg-slate-100/50 backdrop-blur-sm p-1.5 rounded-2xl gap-1 border border-white/50">
               {['1D', '1W', '1M', '1Y', '5Y'].map(t => (
                 <button key={t} className={cn(
                    "px-5 py-2 text-xs font-black rounded-xl transition-all",
                    t === '1D' ? "bg-white text-primary shadow-md" : "text-on-surface-variant/60 hover:text-primary"
                 )}>{t}</button>
               ))}
             </div>
             <div className="flex items-center gap-3 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest bg-white/40 px-4 py-2 rounded-xl border border-white/60">
                <Clock className="w-3.5 h-3.5" /> Update: 4:00 PM WIB
             </div>
          </div>
          
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                   <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0E7490" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#0E7490" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px' }}
                  itemStyle={{ fontWeight: '900', color: '#0F172A', fontSize: '14px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#0E7490" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Rating Card */}
        <section className="lg:col-span-4 glass-card rounded-[3rem] p-10 flex flex-col items-center justify-center text-center border-white/60 shadow-2xl shadow-primary/[0.02]">
          <h3 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em] mb-12">InvestAI Rating</h3>
          
          <div className="relative w-52 h-52">
             <svg className="w-full h-full -rotate-90">
               <circle cx="104" cy="104" r="92" fill="none" stroke="#f1f5f9" strokeWidth="14" />
               <motion.circle 
                 cx="104" cy="104" r="92" fill="none" stroke="#0E7490" strokeWidth="14" strokeLinecap="round"
                 strokeDasharray="578 578"
                 initial={{ strokeDashoffset: 578 }}
                 animate={{ strokeDashoffset: 578 * (1 - 0.88) }}
                 transition={{ duration: 2, ease: "easeOut" }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-primary tracking-tighter mb-1">8.8</span>
                <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Sangat Baik</span>
             </div>
          </div>
          
          <p className="mt-12 text-[10px] font-bold text-on-surface-variant/60 leading-loose max-w-[220px] uppercase tracking-widest">
            Berdasarkan Fundamental (9.2), Teknikal (8.5), dan Sentimen (8.7).
          </p>
        </section>

        {/* AI Insight Analysis */}
        <section className="lg:col-span-8 glass-card rounded-[3rem] p-12 border-secondary/20 relative overflow-hidden bg-white/40 border-white/60 shadow-xl">
          <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px]"></div>
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-primary tracking-tight">Ringkasan AI InvestAI</h3>
          </div>
          <p className="text-lg text-primary/80 leading-relaxed font-medium mb-12 relative z-10">
            BBCA menunjukkan performa yang sangat stabil dengan fundamental yang kuat. 
            Saat ini, harga sedang berada di area konsolidasi sehat setelah kenaikan minggu lalu. 
            AI kami mendeteksi sentimen positif dari rilis laporan kuartal terakhir yang melampaui ekspektasi analis. 
            Ini adalah pilihan aman bagi investor pemula yang mencari pertumbuhan jangka panjang.
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
            {['Likuiditas Tinggi', 'Dividen Rutin', 'Blue Chip', 'Aman'].map(tag => (
              <div key={tag} className="flex items-center gap-2 bg-secondary/5 px-6 py-3 rounded-full border border-secondary/10 text-xs font-black text-secondary">
                <CheckCircle2 className="w-4 h-4" /> {tag}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Sidebar */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[3rem] p-10 border-white/60 shadow-xl">
             <div className="flex items-center justify-between mb-10">
               <h4 className="text-xl font-black text-primary tracking-tight">Teknikal Indikator</h4>
               <div className="p-2 bg-slate-50 rounded-xl text-on-surface-variant/30">
                <TrendingUp className="w-5 h-5" />
               </div>
             </div>
             <div className="space-y-8">
               {[
                 { label: 'RSI (14)', value: '58.4', status: 'Netral', color: 'secondary' },
                 { label: 'MACD', value: 'Golden Cross', status: 'Beli Kuat', color: 'secondary' },
                 { label: 'MA (20)', value: 'Di Atas MA', status: 'Bullish', color: 'primary' },
               ].map((ind, i) => (
                 <div key={i} className="flex justify-between items-center group">
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1.5">{ind.label}</p>
                      <p className="text-base font-black text-primary group-hover:text-secondary transition-colors tracking-tight">{ind.value}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm",
                        ind.color === 'secondary' ? "bg-secondary/5 text-secondary border-secondary/10" : "bg-primary/5 text-primary border-primary/10"
                      )}>
                        {ind.status}
                      </span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* News & Sentiment */}
        <section className="lg:col-span-12 glass-card rounded-[3.5rem] p-12 border-white/60 shadow-2xl shadow-primary/[0.02]">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
              <div>
                <h3 className="text-3xl font-black text-primary tracking-tight mb-2">Sentimen & Berita Terkini</h3>
                <p className="text-on-surface-variant/60 font-medium text-lg">Analisis real-time dari 20+ sumber berita finansial terpercaya.</p>
              </div>
              <div className="flex items-center gap-10 bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/80 shadow-xl">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-secondary tracking-tighter">82%</span>
                  <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-1">Positif</span>
                </div>
                <div className="w-48 h-4 bg-slate-100/50 rounded-full overflow-hidden flex border border-slate-50 p-0.5">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '82%' }}></div>
                  <div className="h-full bg-error rounded-full ml-0.5" style={{ width: '18%' }}></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-error tracking-tighter">18%</span>
                  <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-1">Negatif</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'BCA Catat Laba Bersih Tumbuh 12% di Q1 2024', source: 'Bisnis.com', time: '2 jam yang lalu', pos: true },
                { title: 'Analis Prediksi Target Harga BBCA Tembus 11.000', source: 'CNBC Indonesia', time: '5 jam yang lalu', pos: true },
              ].map((news, i) => (
                <div key={i} className="flex gap-6 p-8 bg-white/40 hover:bg-white/80 border border-transparent hover:border-white rounded-[2.5rem] transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    {news.pos ? <TrendingUp className="w-7 h-7 text-secondary" /> : <Newspaper className="w-7 h-7 text-primary" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2 leading-tight tracking-tight">{news.title}</h4>
                    <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">{news.time} • {news.source}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30">
          <div className="bg-primary/95 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] flex items-center justify-between text-white border border-white/10">
            <div className="flex items-center gap-5 ml-4">
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                <BotIcon className="w-7 h-7 text-secondary" />
              </div>
              <p className="text-sm font-bold tracking-tight">Butuh bantuan memutuskan?</p>
            </div>
            <button 
              onClick={() => setShowRecommendation(true)}
              className="bg-secondary text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-secondary/20"
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
                className="absolute top-8 right-10 text-on-surface-variant/40 hover:text-primary transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
              >
                Tutup [X]
              </button>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-secondary/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary tracking-tight">Rekomendasi Final AI</h2>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-1">Deep Analysis Terakhir</p>
                </div>
              </div>

              <div className="bg-secondary/5 rounded-[2.5rem] p-8 mb-10 border border-secondary/10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Keputusan Akhir</span>
                  <span className="px-5 py-2 bg-secondary text-white rounded-full text-[10px] font-black shadow-lg shadow-secondary/20 tracking-widest">STRONG BUY</span>
                </div>
                <p className="text-lg text-primary/80 leading-relaxed font-black tracking-tight">
                  Berdasarkan fundamental superior dan sentimen positif, kami merekomendasikan akumulasi bertahap pada {symbol} di area harga saat ini.
                </p>
              </div>

              <div className="space-y-4 mb-10">
                  {[
                    'Potensi kenaikan 15-20% dalam 3-6 bulan kedepan.',
                    'Dukungan kuat pada level Moving Average harian.',
                    'Dividen stabil yang mendukung performa jangka panjang.'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 px-2">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-primary/70 leading-relaxed">{item}</p>
                    </div>
                  ))}
              </div>

              <button 
                onClick={() => setShowRecommendation(false)}
                className="w-full py-6 bg-primary text-white rounded-2xl font-black text-sm shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Gunakan Rekomendasi Ini
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BotIcon(props: any) {
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
