import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, Mail, Lock, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register: registerUser, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Email atau password salah');
    }
    setIsLoading(false);
  };

  const handleQuickDemo = async () => {
    const demoEmail = 'demo@investai.id';
    const demoPass = 'demo1234';
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    setError('');

    // Try logging in with demo account
    const result = await login(demoEmail, demoPass);
    if (result.success) {
      navigate('/dashboard');
    } else {
      // Auto-register demo account if it doesn't exist in Supabase DB yet
      const regResult = await registerUser(demoEmail, demoPass, 'Demo Investor');
      if (regResult.success) {
        navigate('/dashboard');
      } else {
        // Direct fallback navigation so quick demo never blocks user testing
        navigate('/dashboard');
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      setIsLoading(true);
      setError('');
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Google Login gagal memverifikasi akun.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[50%] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[50%] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Top Header */}
      <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2.5 group z-20">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
          <img src="/logo.svg" alt="Logo" className="w-5.5 h-5.5 brightness-0 invert" />
        </div>
        <span className="text-xl font-extrabold text-primary tracking-tight font-display">
          Invest<span className="text-emerald-600">AI</span>
        </span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,35,111,0.12)] border border-slate-200/90 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12 my-12"
      >
        {/* Left Side: Visual FinTech Graphic & Social Proof */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary via-[#002B85] to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/15 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-300 text-xs font-bold font-mono">
              <Zap className="w-3.5 h-3.5 fill-emerald-300" /> REALTIME IDX YFINANCE
            </span>
            <h2 className="text-2xl font-black tracking-tight leading-snug">
              Investasi Saham Lebih Cerdas Dengan AI.
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              Akses sinyal beli/jual real-time, analisis laporan keuangan emiten BEI, dan simulator tanpa risiko.
            </p>
          </div>

          {/* Floating Live Stock Mini HUD */}
          <div className="relative z-10 my-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold font-mono text-emerald-300">$BBCA (IDX)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                STRONG BUY
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xl font-extrabold text-white font-mono">Rp 10,250</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                +2.45% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>Target Price AI: <strong className="text-cyan-300">Rp 11,800</strong></span>
              <span>Conf: <strong className="text-emerald-400">98.4%</strong></span>
            </div>
          </div>

          <div className="relative z-10 space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Akurasi backtest sinyal hingga 94.2%
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Keamanan data terenkripsi 256-bit
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-display mb-1.5">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Masuk ke akun InvestAI Anda untuk mengakses sinyal saham real-time.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                {error}
              </div>
            )}

            <div className="mb-5 flex justify-center w-full overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Catatan Google OAuth: Tambahkan origin http://localhost:3000 di Google Cloud Console untuk login Google.')}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signin_with"
                width="320"
              />
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">atau masuk dengan email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                  <a href="#" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors">Lupa sandi?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Masuk Ke Akun <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Masuk Cepat (Akun Demo Investor)
            </button>
            <p className="text-xs font-medium text-slate-500">
              Belum punya akun? <Link to="/register" className="font-bold text-primary hover:text-emerald-700 transition-colors">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
