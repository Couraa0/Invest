import { Search, Bell, Menu, LayoutDashboard, BookOpen, Zap, LineChart, MessageSquare, Settings, TrendingUp, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { investorLevel, user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const profileInfo = {
    'Pemula': { label: 'Investor Pemula', level: 'Beginner', initials: 'IP' },
    'Menengah': { label: 'Investor Menengah', level: 'Intermediate', initials: 'IM' },
    'Berpengalaman': { label: 'Investor Berpengalaman', level: 'Expert', initials: 'IB' }
  };

  const currentProfile = profileInfo[investorLevel];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  const userInitials = user ? getInitials(user.full_name) : currentProfile.initials;
  const userName = user?.full_name || currentProfile.label;

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/dashboard') return { title: 'Dashboard', icon: LayoutDashboard };
    if (path === '/academy') return { title: 'Academy', icon: BookOpen };
    if (path === '/simulator') return { title: 'Paper Trading', icon: LineChart };
    if (path === '/mentorship') return { title: 'Mentorship', icon: MessageSquare };
    if (path === '/signals') return { title: 'AI Signals', icon: Zap };
    if (path === '/settings') return { title: 'Settings', icon: Settings };
    if (path.startsWith('/stock/')) return { title: 'Analisis Saham', icon: TrendingUp };
    return { title: 'InvestAI', icon: LayoutDashboard };
  };

  const { title, icon: Icon } = getPageInfo();

  const handleLogout = () => {
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 flex items-center justify-between px-5 md:px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 z-30">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center text-primary hidden sm:flex">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-primary tracking-tight">{title}</h2>
        </div>
      </div>

      {/* Center: Search */}
      <div className={`hidden md:flex relative transition-all duration-300 ${searchFocused ? 'w-96' : 'w-72'}`}>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
        <input
          type="text"
          placeholder="Cari emiten, modul, atau berita..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-100 rounded-xl text-sm text-primary font-medium placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/10 focus:border-primary/20 focus:bg-white outline-none transition-all duration-200"
        />
      </div>

      {/* Right: Bell + Profile */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 text-on-surface-variant hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white animate-pulse" />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100/80 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200/80 shadow-sm group-hover:border-primary/20 transition-colors flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-primary leading-tight truncate max-w-[120px]">{userName}</p>
              <p className="text-[9px] font-semibold text-on-surface-variant/50 uppercase tracking-wider">{currentProfile.level}</p>
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-[48]" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 12, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 z-50 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden p-1.5"
                >
                  <div className="px-3 py-2 mb-1 border-b border-slate-100">
                    <p className="text-xs font-bold text-primary truncate">{userName}</p>
                    <p className="text-[10px] text-on-surface-variant/50 font-medium">{currentProfile.label}</p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-on-surface transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4 text-on-surface-variant" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
