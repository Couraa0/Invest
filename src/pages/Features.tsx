import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  BookOpen, 
  Gamepad2, 
  Shield, 
  Bot,
  Brain,
  LineChart,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const features = [
  {
    icon: Brain,
    title: 'AI Signal & Insight',
    desc: 'Analisis mendalam terhadap ratusan saham secara real-time dengan bantuan kecerdasan buatan. Dapatkan sentimen pasar dan prediksi arah tren yang akurat.',
    color: 'text-primary bg-primary/10'
  },
  {
    icon: Gamepad2,
    title: 'Paper Trading',
    desc: 'Simulator trading realistis dengan dana virtual Rp 100 juta. Latih psikologi dan strategi investasi Anda tanpa takut kehilangan uang sungguhan.',
    color: 'text-secondary bg-secondary/10'
  },
  {
    icon: BookOpen,
    title: 'Academy & Edukasi',
    desc: 'Modul belajar dari dasar fundamental hingga analisis teknikal tingkat mahir. Disusun dengan kurikulum interaktif yang mudah dipahami pemula.',
    color: 'text-amber-600 bg-amber-50'
  },
  {
    icon: Bot,
    title: 'AI Mentorship',
    desc: 'Tanya apa saja seputar saham kepada asisten AI kami 24/7. Mentor personal Anda yang siap membedah laporan keuangan dan memberi opini objektif.',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    icon: LineChart,
    title: 'Advanced Charting',
    desc: 'Grafik interaktif dengan berbagai indikator teknikal terpopuler seperti MACD, RSI, Moving Averages, hingga Bollinger Bands.',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    icon: Shield,
    title: 'Risk Management',
    desc: 'Fitur pelindung nilai portofolio. Sistem otomatis menghitung batas toleransi risiko untuk setiap trade yang akan Anda lakukan.',
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export default function Features() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 px-6 h-16 transition-all duration-300">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">InvestAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm font-bold text-primary transition-colors">Fitur</Link>
            <Link to="/academy" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Academy</Link>
            <Link to="/pricing" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Harga</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-3 py-2 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <Link
              to="/dashboard"
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.97] transition-all"
            >
              Coba Sekarang
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-100 p-6 shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-primary py-2 border-b border-slate-50">Fitur</Link>
              <Link to="/academy" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-50">Academy</Link>
              <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-50">Harga</Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 hover:text-primary py-2 border-b border-slate-50 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold text-center mt-2 shadow-lg shadow-primary/25">
                Coba Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-primary tracking-tight mb-6">
              Teknologi di Balik <span className="text-secondary">Kesuksesan Anda</span>
            </h1>
            <p className="text-lg text-on-surface-variant/60 leading-relaxed">
              Jelajahi seluruh fitur inovatif yang kami sediakan. 
              Mulai dari analisis prediktif AI hingga simulasi real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
