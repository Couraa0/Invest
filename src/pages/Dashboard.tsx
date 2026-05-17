import { motion } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Landmark, 
  ChevronRight,
  TrendingDown,
  Sparkles,
  Activity,
  ArrowUpRight,
  BarChart2
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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

export default function Dashboard() {
  const { investorLevel } = useUser();

  const profileMapping = {
    'Pemula': { label: 'Investor Pemula', badge: 'Pemula', risk: 'Aman & Terukur', emoji: '🌱' },
    'Menengah': { label: 'Investor Menengah', badge: 'Menengah', risk: 'Moderat & Bertumbuh', emoji: '📈' },
    'Berpengalaman': { label: 'Investor Berpengalaman', badge: 'Berpengalaman', risk: 'Agresif & Dinamis', emoji: '🚀' }
  };

  const currentProfile = profileMapping[investorLevel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Selamat Datang {currentProfile.emoji}</h1>
            <span className="px-2.5 py-0.5 bg-primary/8 text-primary text-[10px] font-semibold uppercase tracking-wider rounded-full border border-primary/12">
              {currentProfile.badge}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant/60">Strategi investasimu terlihat stabil hari ini.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/8 rounded-xl border border-secondary/12">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">IDX Open</span>
        </div>
      </motion.div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* AI Insight - Large Card */}
        <motion.section
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-8 card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-semibold text-primary text-sm">AI Insight Summary</h2>
            </div>
            <span className="text-[10px] text-on-surface-variant/40 font-medium">Diperbarui 5m lalu</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 space-y-3">
              <p className="text-base text-on-surface leading-relaxed">
                IHSG terpantau menguat tipis seiring sentimen positif dari data inflasi.
                Untuk profil <span className="font-semibold text-secondary">{currentProfile.risk}</span> Anda,
                emiten perbankan besar masih menjadi jangkar portofolio yang ideal.
              </p>
              <p className="text-sm text-on-surface-variant/60 leading-relaxed">
                Analisis AI mendeteksi volume akumulasi pada sektor energi. Kami menyarankan
                <em> Hold</em> untuk BBCA dan mulai memantau TLKM untuk peluang entry jangka menengah.
              </p>
              <Link
                to="/signals"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all duration-200"
              >
                Lihat sinyal lengkap <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="md:w-1/3 bg-secondary/5 border border-secondary/10 rounded-xl p-5 flex flex-col items-center justify-center text-center">
              <p className="stat-label mb-3">Sentimen Pasar</p>
              <div className="flex items-end justify-center gap-1 h-14 mb-3">
                {[30, 50, 65, 80, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5, ease: 'easeOut' }}
                    className={cn("w-3 rounded-t-sm", i === 3 ? "bg-secondary" : "bg-secondary/30")}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-xl font-bold text-secondary">Bullish</p>
              <p className="stat-label mt-1">Confidence: 88%</p>
            </div>
          </div>
        </motion.section>

        {/* Market Overview */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card p-6 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-on-surface-variant/40" />
              <h3 className="stat-label">Simplified IDX</h3>
            </div>
            <span className="text-[10px] text-secondary font-semibold">Live</span>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xl font-bold text-primary">IHSG</span>
              <span className="text-secondary font-bold text-sm">+0.42%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-secondary h-full rounded-full"
              />
            </div>
            <p className="stat-label mt-2">7,164.50 · Vol 2.1T</p>
          </div>

          <div className="pt-4 border-t border-slate-100 mb-4">
            <p className="stat-label mb-3">Top Sector</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Finance</p>
                  <p className="stat-label">Sektor Utama</p>
                </div>
              </div>
              <span className="text-secondary font-bold text-sm">+1.2%</span>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-16 -mx-2 opacity-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="dashColorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#006c49" fillOpacity={1} fill="url(#dashColorVal)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Watchlist */}
        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-primary">Watchlist Saham</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/70 transition-colors">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {watchlist.map((stock, idx) => (
              <motion.div
                key={idx}
                custom={idx + 2} variants={fadeUp} initial="hidden" animate="visible"
              >
                <Link to={`/stock/${stock.symbol}`} className="block group">
                  <div className="card p-5 rounded-2xl hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5 transition-all duration-200">
                    {/* Stock Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StockIcon symbol={stock.symbol} />
                        <div>
                          <p className="text-sm font-semibold text-primary">{stock.symbol}</p>
                          <p className="stat-label max-w-[100px] truncate">{stock.name}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        stock.status === 'BUY' ? "bg-secondary/10 text-secondary border border-secondary/15" : "bg-slate-100 text-slate-500 border border-slate-200"
                      )}>
                        {stock.status}
                      </span>
                    </div>

                    {/* Price Row */}
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary tracking-tight">{stock.price}</p>
                        <p className={cn("text-xs font-semibold mt-0.5 flex items-center gap-1", stock.type === 'up' ? "text-secondary" : "text-error")}>
                          {stock.type === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {stock.change}
                        </p>
                      </div>
                      {/* Mini sparkline */}
                      <div className="flex items-end gap-0.5 h-10">
                        {[40, 60, 45, 80, 70, 100].map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className={cn(
                              "w-1.5 rounded-sm",
                              stock.type === 'up' ? "bg-secondary/30" : "bg-error/25",
                              i === 5 && (stock.type === 'up' ? "bg-secondary" : "bg-error")
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Confidence */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="stat-label">AI Confidence</span>
                        <span className="text-[10px] font-bold text-primary">{stock.confidence}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stock.confidence}%` }}
                          transition={{ duration: 1, delay: 0.4 + idx * 0.15 }}
                          className="bg-primary h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions Row */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: Sparkles, label: 'Cek Sinyal AI', desc: 'Real-time signals', to: '/signals', color: 'bg-primary text-white' },
            { icon: Activity, label: 'Paper Trading', desc: 'Simulasi gratis', to: '/simulator', color: 'bg-secondary/10 text-secondary' },
            { icon: Brain, label: 'Tanya Mentor', desc: 'AI-powered chat', to: '/mentorship', color: 'bg-primary/8 text-primary' },
            { icon: ArrowUpRight, label: 'Belajar Sekarang', desc: 'Kurikulum terstruktur', to: '/academy', color: 'bg-secondary/8 text-secondary' },
          ].map((action, i) => (
            <Link key={i} to={action.to}>
              <div className="card p-4 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 group">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", action.color)}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary truncate">{action.label}</p>
                  <p className="stat-label truncate">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-10 right-8 w-12 h-12 bg-primary text-white rounded-xl shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 hidden md:flex">
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
