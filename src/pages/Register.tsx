import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, User, Mail, Lock, ShieldCheck, Zap, Sparkles, Gamepad2, Gift } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useUser } from '../context/UserContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register: registerUser, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    const result = await registerUser(email, password, fullName);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true);
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }
  };

  const passwordChecks = [
    { label: 'Minimal 6 karakter', valid: password.length >= 6 },
    { label: 'Mengandung huruf', valid: /[a-zA-Z]/.test(password) },
    { label: 'Mengandung angka', valid: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background lighting */}
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
        {/* Left Side: Visual FinTech Graphic & Member Benefits */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary via-[#002B85] to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/15 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-300 text-xs font-bold font-mono">
              <Gift className="w-3.5 h-3.5" /> BONUS ANGGOTA BARU
            </span>
            <h2 className="text-2xl font-black tracking-tight leading-snug">
              Dapatkan Modal Virtual Rp 100 Juta Gratis.
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              Daftar sekarang untuk membuka akses penuh ke simulator Paper Trading saham IDX dan sinyal prediksi AI real-time dari yfinance.
            </p>
          </div>

          {/* Virtual Bonus Card Mockup */}
          <div className="relative z-10 my-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-bold font-mono text-emerald-300">PORTFOLIO VIRTUAL</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                READY TO TRADE
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-emerald-400 font-mono">Rp 100,000,000</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Gunakan modal virtual ini untuk menguji strategi saham tanpa risiko finansial.
            </p>
          </div>

          <div className="relative z-10 space-y-2 pt-2 border-t border-white/10 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" /> Sinyal AI real-time saham BEI (BBCA, BBRI, BMRI)
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Pendaftaran 100% Gratis selamanya
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-display mb-1.5">
                Buat Akun Baru
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Mulai perjalanan investasi saham cerdas Anda bersama AI sekarang.
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
                onError={() => setError('Pendaftaran via Google Gagal. Silakan coba lagi.')}
                theme="outline"
                size="large"
                shape="rectangular"
                text="signup_with"
                width="320"
              />
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">atau daftar dengan email</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

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
                <label className="text-xs font-bold text-slate-700 ml-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimal 6 karakter"
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
                {password && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-1">
                    {passwordChecks.map((check) => (
                      <div key={check.label} className="flex items-center gap-1">
                        <CheckCircle className={`w-3 h-3 ${check.valid ? 'text-emerald-500' : 'text-slate-300'}`} />
                        <span className={`text-[10px] font-medium ${check.valid ? 'text-emerald-700' : 'text-slate-400'}`}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !email || !password || !fullName}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Daftar Akun Gratis <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs font-medium text-slate-500">
              Sudah punya akun? <Link to="/login" className="font-bold text-primary hover:text-emerald-700 transition-colors">Masuk ke akun Anda</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
