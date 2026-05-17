import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { LayoutDashboard, BookOpen, Zap, LineChart, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mobileNavItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Home' },
    { icon: BookOpen, path: '/academy', label: 'Academy' },
    { icon: Zap, path: '/signals', label: 'Signals' },
    { icon: LineChart, path: '/simulator', label: 'Trade' },
    { icon: MessageSquare, path: '/mentorship', label: 'Mentor' },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 w-72 flex-shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 pt-16 px-5 md:px-8 pb-28 lg:pb-8 max-w-full overflow-x-hidden">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-100/80 flex items-center justify-around px-2 z-50">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 flex-1",
              isActive
                ? "text-primary"
                : "text-on-surface-variant/50 hover:text-on-surface-variant"
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className={cn("text-[9px] font-semibold uppercase tracking-wider", isActive ? "text-primary" : "text-on-surface-variant/40")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
