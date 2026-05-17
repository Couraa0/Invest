import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, hasCompletedOnboarding } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login();
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2.5 group">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform overflow-hidden">
          <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
        </div>
        <span className="text-lg font-bold text-primary tracking-tight">InvestAI</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-slate-100 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Selamat Datang Kembali</h1>
          <p className="text-sm text-on-surface-variant/60">Masuk ke akun Anda untuk melanjutkan perjalanan investasi bersama AI.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-primary">Kata Sandi</label>
              <a href="#" className="text-xs font-semibold text-secondary hover:text-secondary/80">Lupa sandi?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-on-surface-variant/40 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Masuk <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-on-surface-variant/60">
            Belum punya akun? <a href="#" className="font-bold text-primary hover:text-secondary transition-colors">Daftar sekarang</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
