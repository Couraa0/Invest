import {
  Plus,
  LayoutDashboard,
  BookOpen,
  Zap,
  LineChart,
  MessageSquare,
  Settings,
  ArrowUpRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', desc: 'Overview & Insights' },
  { icon: BookOpen, label: 'Academy', path: '/academy', desc: 'Belajar Investasi' },
  { icon: Zap, label: 'AI Signals', path: '/signals', desc: 'Analisis Saham' },
  { icon: LineChart, label: 'Paper Trading', path: '/simulator', desc: 'Simulasi Trading' },
  { icon: MessageSquare, label: 'Mentorship', path: '/mentorship', desc: 'AI Mentor' },
  { icon: Settings, label: 'Settings', path: '/settings', desc: 'Pengaturan Akun' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { investorLevel } = useUser();
  const [showNotification, setShowNotification] = useState(false);

  const levelConfig = {
    'Pemula': { label: 'Beginner', color: 'bg-emerald-500', dot: 'bg-emerald-400' },
    'Menengah': { label: 'Intermediate', color: 'bg-primary', dot: 'bg-blue-400' },
    'Berpengalaman': { label: 'Expert', color: 'bg-secondary', dot: 'bg-secondary' },
  };
  const level = levelConfig[investorLevel];

  const handleUpgrade = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  return (
    <>
      <aside className="flex flex-col h-full w-72 bg-white border-r border-slate-100/80 py-6 z-40 overflow-hidden">
        {/* Logo */}
        <div className="px-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm tracking-tight">InvestAI</p>
              <p className="text-[10px] font-semibold text-on-surface-variant/50 tracking-wider uppercase mt-0.5">
                {level.label}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 text-on-surface-variant hover:bg-slate-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Level Badge */}
        <div className="mx-5 mb-6 px-4 py-3 rounded-xl bg-primary/5 border border-primary/8 flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full animate-pulse", level.dot)} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-wider">Investor Level</p>
            <p className="text-xs font-bold text-primary">{investorLevel}</p>
          </div>
          <div className={cn("px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase tracking-wider", level.color)}>
            {level.label}
          </div>
        </div>

        {/* Navigation Label */}
        <p className="px-5 mb-2 text-[9px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.15em]">Menu Utama</p>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-on-surface-variant hover:bg-slate-50 hover:text-primary"
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0",
                    isActive ? "bg-white/15" : "bg-slate-100/80 group-hover:bg-primary/10"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold", isActive ? "text-white" : "text-on-surface")}>{item.label}</p>
                    <p className={cn("text-[10px] font-medium mt-0.5 truncate", isActive ? "text-white/60" : "text-on-surface-variant/50")}>{item.desc}</p>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="mx-3 mt-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-white">
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/8 rounded-full" />
            <div className="absolute top-3 -right-2 w-8 h-8 bg-white/5 rounded-full" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Premium</span>
            </div>
            <p className="text-sm font-semibold leading-snug mb-4 text-white/90">Akses sinyal AI eksklusif & analisis mendalam.</p>
            <button
              onClick={handleUpgrade}
              className="w-full py-2.5 bg-white text-primary rounded-xl text-xs font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              Upgrade Premium <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 60, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-primary text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold">Coming Soon!</p>
              <p className="text-[10px] text-white/60 font-medium">Sistem pembayaran sedang disiapkan.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
