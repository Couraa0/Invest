import { 
  Plus, 
  LayoutDashboard, 
  BookOpen, 
  Zap, 
  LineChart, 
  MessageSquare, 
  Settings,
  ArrowUpRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Academy', path: '/academy' },
  { icon: Zap, label: 'AI Signals', path: '/signals' },
  { icon: LineChart, label: 'Paper Trading', path: '/simulator' },
  { icon: MessageSquare, label: 'Mentorship', path: '/mentorship' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="flex flex-col h-full w-72 bg-white/60 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-blue-900/5 py-8 z-40">
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <img src="/src/public/logo.svg" alt="Logo" className="w-8 h-8" />
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
          <button className="w-full py-3 bg-secondary text-white rounded-xl text-xs font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-transform">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </aside>
  );
}
