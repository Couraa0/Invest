import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { LayoutDashboard, BookOpen, Zap, LineChart, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mobileNavItems = [
    { icon: LayoutDashboard, path: '/dashboard' },
    { icon: BookOpen, path: '/academy' },
    { icon: Zap, path: '/signals' },
    { icon: LineChart, path: '/simulator' },
    { icon: MessageSquare, path: '/mentorship' },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      <div className={cn(
        "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform lg:translate-x-0 w-72 flex-shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="pt-20 px-6 md:px-12 pb-32 lg:pb-12">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Nav Bar */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 glass-card rounded-3xl flex items-center justify-around px-2 z-50 border-white/40 shadow-2xl">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "p-4 rounded-2xl transition-all duration-300",
              isActive 
                ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" 
                : "text-on-surface-variant hover:bg-white/50"
            )}
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
