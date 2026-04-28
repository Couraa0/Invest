import {
  Plus,
  LayoutDashboard,
  BookOpen,
  Zap,
  LineChart,
  MessageSquare,
  Settings,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Academy', path: '/academy' },
  { icon: Zap, label: 'AI Signals', path: '/signals' },
  { icon: LineChart, label: 'Paper Trading', path: '/simulator' },
  { icon: MessageSquare, label: 'Mentorship', path: '/mentorship' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const [showNotification, setShowNotification] = useState(false);

  const handleUpgrade = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <>
      <aside className="flex flex-col h-full w-72 bg-white/60 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-blue-900/5 py-8 z-40">
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-primary">InvestAI Pro</p>
              <p className="text-xs text-on-surface-variant">Beginner Level 2</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-on-surface-variant">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3 mx-2 px-4 py-3 rounded-full transition-all duration-200 font-medium",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-on-surface-variant hover:bg-white/50 hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="glass-card p-6 rounded-2xl border-secondary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <ArrowUpRight className="w-12 h-12 text-secondary" />
            </div>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Pro Member</p>
            <p className="text-sm font-bold text-primary mb-4">Dapatkan akses ke sinyal AI eksklusif.</p>
            <button
              onClick={handleUpgrade}
              className="w-full py-3 bg-secondary text-white rounded-xl text-xs font-black shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </aside>

      {/* Coming Soon Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[100] bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 min-w-[300px]"
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-secondary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Feature Coming Soon!</p>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Sistem pembayaran sedang disiapkan.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
