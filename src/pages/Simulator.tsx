import { motion } from 'motion/react';
import { 
  LineChart, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Layers, 
  History, 
  Briefcase,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

const portfolioData = [
  { name: 'Mon', value: 100000000 },
  { name: 'Tue', value: 102500000 },
  { name: 'Wed', value: 101200000 },
  { name: 'Thu', value: 104800000 },
  { name: 'Fri', value: 103900000 },
  { name: 'Today', value: 106425000 },
];

export default function Simulator() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Portfolio Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Total Saldo Virtual', value: 'Rp 106.425.000', change: '+6.4%', icon: Wallet, color: 'primary' },
          { label: 'Unrealized G/L', value: 'Rp 4.250.000', change: '+12.5%', icon: ArrowUpRight, color: 'secondary' },
          { label: 'Buying Power', value: 'Rp 22.150.000', change: '20% Cash', icon: Layers, color: 'on-tertiary-container' },
          { label: 'Ranking AI Cup', value: '#1,242', change: 'Top 5%', icon: Trophy, color: 'on-surface-variant' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2rem] group"
          >
            <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">{stat.label}</p>
            <h4 className="text-lg font-bold text-primary mb-1">{stat.value}</h4>
            <p className={cn(
               "text-xs font-bold",
               stat.change.startsWith('+') ? "text-secondary" : "text-on-surface-variant"
            )}>{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-8">
        {/* Equity Curve (Bento Large) */}
        <section className="col-span-12 lg:col-span-8 glass-card p-10 rounded-[2.5rem]">
           <div className="flex items-center justify-between mb-12">
             <div>
               <h3 className="text-2xl font-bold text-primary mb-1 tracking-tight">Performa Ekuitas</h3>
               <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Akun Simulasi • 7 Hari Terakhir</p>
             </div>
             <div className="flex bg-slate-100 p-1 rounded-full">
                <button className="px-6 py-2 text-xs font-bold rounded-full bg-white text-primary shadow-sm">Equity</button>
                <button className="px-6 py-2 text-xs font-bold rounded-full text-on-surface-variant">Benchmark</button>
             </div>
           </div>
           
           <div className="h-80 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006c49" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#006c49" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#006c49" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
                    <Tooltip 
                      formatter={(value: any) => `Rp ${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
             <div>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Max Drawdown</p>
                <p className="text-xl font-bold text-primary">-2.4%</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Sharpe Ratio</p>
                <p className="text-xl font-bold text-primary">1.82</p>
             </div>
             <div>
                <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest mb-2">Win Rate</p>
                <p className="text-xl font-bold text-secondary">68%</p>
             </div>
           </div>
        </section>

        {/* Portfolio Composition (Bento Sidebar) */}
        <section className="col-span-12 lg:col-span-4 glass-card p-10 rounded-[2.5rem] flex flex-col">
           <h3 className="text-xl font-bold text-primary mb-10 flex items-center justify-between">
              Komposisi <Briefcase className="w-5 h-5 text-on-surface-variant/40" />
           </h3>
           <div className="space-y-8 flex-1">
             {[
               { symbol: 'BBCA', weight: 40, color: 'primary' },
               { symbol: 'TLKM', weight: 25, color: 'secondary' },
               { symbol: 'ASII', weight: 15, color: 'on-tertiary-container' },
               { symbol: 'CASH', weight: 20, color: 'slate-300' },
             ].map((item, i) => (
               <div key={i} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="font-bold text-primary">{item.symbol}</span>
                    <span className="text-xs font-bold text-on-surface-variant">{item.weight}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.weight}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={`h-full bg-${item.color} rounded-full`}
                    />
                  </div>
               </div>
             ))}
           </div>
           
           <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-on-surface-variant leading-relaxed">
             "Portofolio kamu terkonsentrasi di sektor perbankan. Diversifikasi ke sektor Properti atau Teknologi bisa menurunkan profil risiko." — AI Advisor
           </div>
        </section>

        {/* Transactions & Orders */}
        <section className="col-span-12 glass-card rounded-[2.5rem] p-10">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
             <div className="flex items-center gap-4">
               <History className="w-6 h-6 text-primary" />
               <h3 className="text-2xl font-bold text-primary">Riwayat Transaksi</h3>
             </div>
             <div className="flex gap-4">
               <button className="px-8 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">Buy Stock</button>
               <button className="px-8 py-3 bg-white text-primary border border-primary/20 rounded-full font-bold text-sm hover:bg-primary/5 transition-all">Portfolio Report</button>
             </div>
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] border-b border-slate-100">
                   <th className="pb-6 pl-2">Saham</th>
                   <th className="pb-6">Type</th>
                   <th className="pb-6">Harga</th>
                   <th className="pb-6">Lot</th>
                   <th className="pb-6">Total Value</th>
                   <th className="pb-6 pr-2 text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {[
                   { symbol: 'BBCA', type: 'BUY', price: '9,850', lot: 10, total: '9.850.000', status: 'MATCHED', date: 'Hari ini, 10:15' },
                   { symbol: 'TLKM', type: 'SELL', price: '3,450', lot: 50, total: '17.250.000', status: 'MATCHED', date: 'Kemarin, 14:20' },
                   { symbol: 'GOTO', type: 'BUY', price: '68', lot: 1000, total: '6.800.000', status: 'CANCELLED', date: '2 hari lalu, 09:30' },
                 ].map((t, i) => (
                   <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                     <td className="py-6 pl-2">
                       <div className="font-bold text-primary">{t.symbol}</div>
                       <div className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">{t.date}</div>
                     </td>
                     <td className="py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                         t.type === 'BUY' ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error"
                       )}>{t.type}</span>
                     </td>
                     <td className="py-6 font-bold text-primary">{t.price}</td>
                     <td className="py-6 font-bold text-primary">{t.lot}</td>
                     <td className="py-6 font-bold text-primary">{t.total}</td>
                     <td className="py-6 pr-2 text-right">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          t.status === 'MATCHED' ? "text-secondary" : "text-on-surface-variant/30"
                        )}>{t.status}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </section>
      </div>
    </div>
  );
}
