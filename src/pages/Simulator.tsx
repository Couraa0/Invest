import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  History, 
  Briefcase,
  Trophy,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';

const portfolioData = [
  { name: 'Mon', value: 100000000 },
  { name: 'Tue', value: 102500000 },
  { name: 'Wed', value: 101200000 },
  { name: 'Thu', value: 104800000 },
  { name: 'Fri', value: 103900000 },
  { name: 'Today', value: 106425000 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

function formatRp(value: number) {
  return `Rp ${(value / 1000000).toFixed(1)}jt`;
}

export default function Simulator() {
  return (
    <div className="space-y-5">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saldo Virtual', value: 'Rp 106.4jt', change: '+6.4%', icon: Wallet, up: true },
          { label: 'Unrealized G/L', value: 'Rp 4.25jt', change: '+12.5%', icon: ArrowUpRight, up: true },
          { label: 'Buying Power', value: 'Rp 22.15jt', change: '20% Cash', icon: Layers, up: null },
          { label: 'Ranking AI Cup', value: '#1,242', change: 'Top 5%', icon: Trophy, up: null },
        ].map((stat, i) => (
          <motion.div
            key={i}
            custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="card p-5 rounded-2xl group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <stat.icon className="w-4 h-4" />
              </div>
              {stat.up !== null && (
                stat.up
                  ? <ArrowUpRight className="w-4 h-4 text-secondary" />
                  : <ArrowDownRight className="w-4 h-4 text-error" />
              )}
            </div>
            <p className="stat-label mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-primary tracking-tight">{stat.value}</p>
            <p className={cn("text-xs font-semibold mt-0.5", stat.up === true ? "text-secondary" : "text-on-surface-variant/50")}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Equity Chart */}
        <motion.section
          custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-8 card p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-primary mb-0.5">Performa Ekuitas</h3>
              <p className="stat-label">Akun Simulasi · 7 Hari Terakhir</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white text-primary shadow-sm">Equity</button>
              <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-on-surface-variant/50 hover:text-primary transition-colors">Benchmark</button>
            </div>
          </div>

          <div className="h-64 w-full mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="simColorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#006c49"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#simColorVal)"
                  dot={false}
                />
                <Tooltip
                  formatter={(value: number) => [formatRp(value), 'Saldo']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
            {[
              { label: 'Max Drawdown', value: '-2.4%', color: 'text-error' },
              { label: 'Sharpe Ratio', value: '1.82', color: 'text-primary' },
              { label: 'Win Rate', value: '68%', color: 'text-secondary' },
            ].map((m, i) => (
              <div key={i}>
                <p className="stat-label mb-1">{m.label}</p>
                <p className={cn("text-lg font-bold", m.color)}>{m.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Portfolio Composition */}
        <motion.section
          custom={5} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card p-6 rounded-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-on-surface-variant/40" />
              <h3 className="text-sm font-bold text-primary">Komposisi</h3>
            </div>
            <BarChart2 className="w-4 h-4 text-on-surface-variant/30" />
          </div>

          <div className="space-y-5 flex-1">
            {[
              { symbol: 'BBCA', weight: 40, colorClass: 'bg-primary' },
              { symbol: 'TLKM', weight: 25, colorClass: 'bg-secondary' },
              { symbol: 'ASII', weight: 15, colorClass: 'bg-blue-400' },
              { symbol: 'CASH', weight: 20, colorClass: 'bg-slate-300' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-semibold text-primary">{item.symbol}</span>
                  <span className="stat-label">{item.weight}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.weight}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                    className={cn("h-full rounded-full", item.colorClass)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant/60 italic leading-relaxed">
                "Portofolio terkonsentrasi di sektor perbankan. Diversifikasi ke Properti atau Teknologi bisa menurunkan risiko." — AI Advisor
              </p>
            </div>
          </div>
        </motion.section>

        {/* Transaction History */}
        <motion.section
          custom={6} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-12 card p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-on-surface-variant/50" />
              <h3 className="text-base font-bold text-primary">Riwayat Transaksi</h3>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary px-5 py-2 text-xs">Buy Stock</button>
              <button className="btn-outline px-5 py-2 text-xs">Portfolio Report</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Saham', 'Type', 'Harga', 'Lot', 'Total Value', 'Status'].map((h, i) => (
                    <th key={i} className={cn("stat-label pb-4", i === 5 && "text-right")}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { symbol: 'BBCA', type: 'BUY', price: '9,850', lot: 10, total: '9.850.000', status: 'MATCHED', date: 'Hari ini, 10:15' },
                  { symbol: 'TLKM', type: 'SELL', price: '3,450', lot: 50, total: '17.250.000', status: 'MATCHED', date: 'Kemarin, 14:20' },
                  { symbol: 'GOTO', type: 'BUY', price: '68', lot: 1000, total: '6.800.000', status: 'CANCELLED', date: '2 hari lalu, 09:30' },
                ].map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4">
                      <p className="text-sm font-semibold text-primary">{t.symbol}</p>
                      <p className="stat-label mt-0.5">{t.date}</p>
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                        t.type === 'BUY' ? "bg-secondary/10 text-secondary border border-secondary/15" : "bg-error/10 text-error border border-error/15"
                      )}>{t.type}</span>
                    </td>
                    <td className="py-4 text-sm font-semibold text-primary">{t.price}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{t.lot}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{t.total}</td>
                    <td className="py-4 text-right">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        t.status === 'MATCHED' ? "text-secondary" : "text-on-surface-variant/30"
                      )}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
