import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Landmark, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';
import StockIcon from '../components/StockIcon';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

const data = [
  { name: '09:00', value: 7100 },
  { name: '10:00', value: 7120 },
  { name: '11:00', value: 7110 },
  { name: '12:00', value: 7140 },
  { name: '13:00', value: 7130 },
  { name: '14:00', value: 7150 },
  { name: '15:00', value: 7164 },
];

const watchlist = [
  { symbol: 'BBCA', name: 'Bank Central Asia', price: '9,850', change: '+150 (1.55%)', status: 'BUY', confidence: 92, type: 'up' },
  { symbol: 'TLKM', name: 'Telkom Indonesia', price: '3,420', change: '-20 (0.58%)', status: 'HOLD', confidence: 64, type: 'down' },
  { symbol: 'ASII', name: 'Astra International', price: '5,125', change: '+75 (1.48%)', status: 'BUY', confidence: 78, type: 'up' },
];

export default function Dashboard() {
  const { investorLevel } = useUser();

  const profileMapping = {
    'Pemula': {
      label: 'Investor Pemula',
      badge: 'Pemula',
      risk: 'Aman & Terukur'
    },
    'Menengah': {
      label: 'Investor Menengah',
      badge: 'Menengah',
      risk: 'Moderat & Bertumbuh'
    },
    'Berpengalaman': {
      label: 'Investor Berpengalaman',
      badge: 'Berpengalaman',
      risk: 'Agresif & Dinamis'
    }
  };

  const currentProfile = profileMapping[investorLevel];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-primary tracking-tight">Halo, {currentProfile.label} 👋</h1>
            <span className="bg-secondary-container text-on-secondary-container text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-secondary/20">
              {currentProfile.badge}
            </span>
          </div>
          <p className="text-on-surface-variant">Strategi investasi kamu terlihat stabil hari ini. Mari cek performa portofolio simulasi.</p>
        </div>
        
        <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3 border-secondary/30">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">IDX OPEN</span>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* AI Insight Narrative (Bento Large) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-card p-8 rounded-[2rem] border-primary/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-primary">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI Insight Summary</h2>
            </div>
            <span className="text-xs text-on-surface-variant">Diperbarui 5m yang lalu</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-2/3 space-y-4">
              <p className="text-xl text-on-surface leading-relaxed">
                IHSG terpantau menguat tipis seiring sentimen positif dari rilis data inflasi. 
                Untuk profil <span className="font-bold text-secondary">{currentProfile.risk}</span> Anda, 
                emiten perbankan besar masih menjadi jangkar portofolio yang ideal.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                Analisis AI mendeteksi volume akumulasi yang tidak biasa pada sektor energi. 
                Kami menyarankan untuk tetap pada rencana <span className="italic">Hold</span> untuk 
                BBCA dan mulai memantau TLKM untuk peluang entry jangka menengah.
              </p>
            </div>
            
            <div className="md:w-1/3 glass-card bg-primary/5 p-6 rounded-2xl border-primary/10 flex flex-col justify-center text-center">
              <p className="text-[10px] text-primary uppercase font-bold mb-4 tracking-widest">Sentimen Pasar</p>
              {/* Simple Chart Bar mockup */}
              <div className="flex items-end justify-center gap-1.5 h-20 mb-4">
                <div className="h-8 w-2.5 bg-secondary rounded-full opacity-30"></div>
                <div className="h-12 w-2.5 bg-secondary rounded-full opacity-50"></div>
                <div className="h-16 w-2.5 bg-secondary rounded-full"></div>
                <div className="h-20 w-2.5 bg-secondary rounded-full"></div>
                <div className="h-14 w-2.5 bg-slate-300 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-secondary">Bullish</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Confidence: 88%</p>
            </div>
          </div>
        </motion.section>

        {/* Market Overview (Bento Tall) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-card p-8 rounded-[2rem] overflow-hidden relative"
        >
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-[10px] text-primary uppercase font-bold tracking-widest mb-8">Simplified IDX</h3>
            
            <div className="space-y-10 flex-1">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-primary">IHSG</span>
                  <span className="text-secondary font-bold text-lg">+0.42%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    className="bg-secondary h-full"
                  />
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mt-3">7,164.50 • 2.1T Volume</p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-6">Top Sector</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary shadow-sm border border-white">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Finance</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Sektor Utama</p>
                    </div>
                  </div>
                  <span className="text-secondary font-bold text-lg">+1.2%</span>
                </div>
              </div>
            </div>

            <div className="h-24 mt-8 opacity-50 relative -mx-8">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006c49" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#006c49" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>
        </motion.section>

        {/* Watchlist Section */}
        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-primary tracking-tight">Watchlist Saham</h2>
            <button className="text-primary text-[10px] font-bold flex items-center gap-1 hover:underline uppercase tracking-widest">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {watchlist.map((stock, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/stock/${stock.symbol}`} className="block">
                  <div className="glass-card p-8 rounded-[2rem] hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <StockIcon symbol={stock.symbol} />
                        <div>
                          <p className="font-bold text-primary">{stock.name}</p>
                          <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest">Finance</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
                        stock.status === 'BUY' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        {stock.status}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-3xl font-bold text-primary">{stock.price}</p>
                        <p className={cn(
                          "font-bold text-sm",
                          stock.type === 'up' ? "text-secondary" : "text-error"
                        )}>{stock.change}</p>
                      </div>
                      <div className="flex items-end gap-1 h-12 w-20">
                        {[40, 60, 30, 80, 100].map((h, i) => (
                          <div 
                            key={i} 
                            style={{ height: `${h}%` }}
                            className={cn(
                              "w-full rounded-sm",
                              stock.type === 'up' ? "bg-secondary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-error opacity-50"
                            )}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-on-surface-variant/50 uppercase tracking-widest">AI Confidence</span>
                        <span className="text-primary">{stock.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stock.confidence}%` }}
                          className="bg-primary h-full"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 hidden md:flex">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
