import { Search, Bell, Menu, LayoutDashboard, BookOpen, Zap, LineChart, MessageSquare, Settings, TrendingUp, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { investorLevel } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const profileInfo = {
    'Pemula': { label: 'Investor Pemula', level: 'Beginner' },
    'Menengah': { label: 'Investor Menengah', level: 'Intermediate' },
    'Berpengalaman': { label: 'Investor Berpengalaman', level: 'Expert' }
  };

  const currentProfile = profileInfo[investorLevel];

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
    <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 flex items-center justify-between px-6 md:px-12 bg-white/70 backdrop-blur-lg border-b border-white/30 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hidden sm:flex">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-primary">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari emiten, berita, atau modul..."
            className="pl-11 pr-6 py-2.5 bg-surface-container-low border-none rounded-full w-64 lg:w-80 focus:ring-2 focus:ring-primary/10 text-sm"
          />
        </div>

        <button className="relative p-2.5 bg-white rounded-full border border-white/50 shadow-sm text-primary hover:scale-105 transition-transform">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group hover:bg-white/50 p-1.5 -m-1.5 rounded-full transition-all"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-primary">{currentProfile.label}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{currentProfile.level}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNDn9tNW7r8eHm_SzPyiz195oTRN2TBCM085ZSwfJCxBkH9fOhy_Ak6v70xpYyYkkDdiAlfEdz-NmEvkEWvbEif5nqrHUbwqn7Kw475IOVbTAgtdFYBtNQWprLUEnjnzg1jNXjZKHvpOMqyFUdDOyqktbuCG37XhWbS86GovntTIeMF96wUrtOtPDaSybwhV71Kbh82o-399Jz5fDVjt2M7ghLRPeQZFWMM1HTuDWqhsrS3DrI1j78ZyaDDZwC9yjRZHhH4yZA_Q"
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 15, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 z-50 w-56 glass-card bg-white/90 backdrop-blur-2xl rounded-xl border-white/60 shadow-2xl overflow-hidden p-1.5"
                >
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 text-primary transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs font-black">Settings</span>
                  </Link>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-black">Logout</span>
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
