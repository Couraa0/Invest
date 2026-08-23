import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Gamepad2, GraduationCap, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MobileBottomBar() {
  const location = useLocation();

  const navItems = [
    { label: 'Beranda', path: '/', icon: Home },
    { label: 'Sinyal AI', path: '/signals', icon: Zap },
    { label: 'Simulator', path: '/simulator', icon: Gamepad2 },
    { label: 'Academy', path: '/academy', icon: GraduationCap },
    { label: 'Akun', path: '/login', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-10px_25px_rgba(0,0,0,0.08)] px-3 py-1.5 flex justify-around items-center">
      {navItems.map((item) => {
        const IconComp = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[60px]",
              isActive
                ? "text-primary font-bold bg-primary/8"
                : "text-slate-500 hover:text-primary font-medium"
            )}
          >
            <div className="relative">
              <IconComp className={cn("w-5 h-5", isActive && "text-primary stroke-[2.5px]")} />
              {item.path === '/signals' && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
