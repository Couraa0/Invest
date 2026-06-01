import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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
      navigate('/onboarding');
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
        navigate('/onboarding');
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
          <h1 className="text-2xl font-bold text-primary mb-2">Buat Akun Baru</h1>
          <p className="text-sm text-on-surface-variant/60">Mulai perjalanan investasi cerdasmu bersama AI Mentor.</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Pendaftaran via Google Gagal. Silakan coba lagi.')}
            theme="outline"
            size="large"
            shape="rectangular"
            text="signup_with"
            width="100%"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-on-surface-variant/40">atau daftar dengan email</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
            />
          </div>

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
            <label className="text-xs font-semibold text-primary ml-1">Kata Sandi</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
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
            {password && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-1">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-1">
                    <CheckCircle className={`w-3 h-3 ${check.valid ? 'text-green-500' : 'text-slate-300'}`} />
                    <span className={`text-[10px] ${check.valid ? 'text-green-600' : 'text-slate-400'}`}>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password || !fullName}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Daftar <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-on-surface-variant/60">
            Sudah punya akun? <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors">Masuk</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
