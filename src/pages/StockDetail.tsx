import { motion } from 'motion/react';
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-3 bg-white rounded-full border border-slate-100 text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-3xl font-black text-primary">
              {symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-primary tracking-tight">PT Bank Central Asia Tbk.</h1>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-on-surface-variant">Satu dari 10 bank terbesar di Asia Tenggara</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-slate-50">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-1">Harga Saat Ini</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">10.250</span>
              <span className="text-secondary font-bold text-sm bg-secondary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +1.25%
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
          <button className="p-3 bg-slate-50 rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Card */}
        <section className="lg:col-span-8 glass-card rounded-[2.5rem] p-8 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
             <div className="flex bg-slate-100 p-1 rounded-full gap-1">
               {['1D', '1W', '1M', '1Y', '5Y'].map(t => (
                 <button key={t} className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-full transition-all",
                    t === '1D' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
                 )}>{t}</button>
               ))}
             </div>
             <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                <Clock className="w-3 h-3" /> Update: 4:00 PM WIB
             </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                   <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#006c49" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#1e3a8a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#006c49" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Rating Card */}
        <section className="lg:col-span-4 glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-[0.2em] mb-10">InvestAI Rating</h3>
          
          <div className="relative w-56 h-56">
             <svg className="w-full h-full -rotate-90">
               <circle cx="112" cy="112" r="90" fill="none" stroke="#f1f5f9" strokeWidth="16" />
               <motion.circle 
                 cx="112" cy="112" r="90" fill="none" stroke="#006c49" strokeWidth="16" strokeLinecap="round"
                 initial={{ strokeDasharray: "565 565", strokeDashoffset: 565 }}
                 animate={{ strokeDashoffset: 113 }}
                 transition={{ duration: 2, ease: "easeOut" }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-primary mb-2">8.8</span>
                <span className="text-xs font-black text-secondary tracking-widest uppercase">Sangat Baik</span>
             </div>
          </div>
          
          <p className="mt-10 text-xs text-on-surface-variant/70 leading-loose max-w-[240px]">
            Skor ini berdasarkan rata-rata tertimbang Fundamental (9.2), Teknikal (8.5), dan Sentimen (8.7).
          </p>
        </section>

        {/* AI Insight Analysis */}
        <section className="lg:col-span-8 glass-card rounded-[2.5rem] p-10 border-l-[12px] border-secondary">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-secondary" />
            <h3 className="text-2xl font-bold text-primary">Ringkasan AI InvestAI</h3>
          </div>
          <p className="text-xl text-on-surface leading-loose mb-8">
            BBCA menunjukkan performa yang sangat stabil dengan fundamental yang kuat. 
            Saat ini, harga sedang berada di area konsolidasi sehat setelah kenaikan minggu lalu. 
            AI kami mendeteksi sentimen positif dari rilis laporan kuartal terakhir yang melampaui ekspektasi analis. 
            Ini adalah pilihan aman bagi investor pemula yang mencari pertumbuhan jangka panjang.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Likuiditas Tinggi', 'Dividen Rutin', 'Blue Chip'].map(tag => (
              <div key={tag} className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-sm font-bold text-primary">
                <CheckCircle2 className="w-4 h-4 text-secondary" /> {tag}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Sidebar */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-8">
               <h4 className="font-bold text-primary">Indikator Teknikal</h4>
               <TrendingUp className="w-5 h-5 text-on-surface-variant/40" />
             </div>
             <div className="space-y-8">
               {[
                 { label: 'RSI (14)', value: '58.4', status: 'Netral', color: 'secondary' },
                 { label: 'MACD', value: 'Golden Cross', status: 'Beli Kuat', color: 'secondary' },
                 { label: 'MA (20)', value: 'Di Atas MA', status: 'Bullish', color: 'primary' },
               ].map((ind, i) => (
                 <div key={i} className="flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest mb-1">{ind.label}</p>
                      <p className="font-bold text-primary group-hover:text-secondary transition-colors">{ind.value}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-${ind.color}/10 text-${ind.color}`}>
                        {ind.status}
                      </span>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* News & Sentiment */}
        <section className="lg:col-span-12 glass-card rounded-[2.5rem] p-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Sentimen & Berita</h3>
                <p className="text-on-surface-variant">Analisis real-time dari 20+ sumber berita finansial.</p>
              </div>
              <div className="flex items-center gap-8 bg-surface p-6 rounded-2xl border border-white">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-secondary">82%</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Positif</span>
                </div>
                <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary" style={{ width: '82%' }}></div>
                  <div className="h-full bg-error" style={{ width: '18%' }}></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-error">18%</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Negatif</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'BCA Catat Laba Bersih Tumbuh 12% di Q1 2024', source: 'Bisnis.com', time: '2 jam yang lalu', pos: true },
                { title: 'Analis Prediksi Target Harga BBCA Tembus 11.000', source: 'CNBC Indonesia', time: '5 jam yang lalu', pos: true },
              ].map((news, i) => (
                <div key={i} className="flex gap-6 p-6 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {news.pos ? <TrendingUp className="w-6 h-6 text-secondary" /> : <Newspaper className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-1">{news.title}</h4>
                    <p className="text-xs text-on-surface-variant">{news.time} • {news.source}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Persistent Recommendation Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-40">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="glass-card p-4 rounded-full flex flex-col md:flex-row items-center justify-between gap-4 border-primary/10 shadow-[0_30px_60px_-15px_rgba(0,35,111,0.2)]"
        >
          <div className="hidden md:flex items-center gap-4 pl-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Lightbulb className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-primary">Butuh bantuan memutuskan?</p>
          </div>
          <button className="w-full md:w-auto bg-primary text-white px-12 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30">
            <Sparkles className="w-5 h-5 fill-current" />
            Minta Rekomendasi AI
          </button>
        </motion.div>
      </div>
    </div>
  );
}
