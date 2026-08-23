import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  Gamepad2,
  Zap,
  Star,
  Users,
  Award,
  Globe,
  Sparkles,
  ChevronRight,
  BarChart3,
  Shield,
  Bot,
  ChevronDown,
  Menu,
  X,
  CheckCircle,
  HelpCircle,
  Cpu,
  Target,
  LineChart,
  ShieldCheck,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import StockTicker from '../components/StockTicker';
import StockChartHeroDemo from '../components/StockChartHeroDemo';
import CuanCalculator from '../components/CuanCalculator';
import LiveSignalStream from '../components/LiveSignalStream';
import MobileBottomBar from '../components/MobileBottomBar';

const faqs = [
  {
    q: "Apakah InvestAI aman untuk pemula yang belum paham saham Indonesia?",
    a: "Sangat aman! InvestAI dirancang khusus dengan fitur AI Co-Pilot dan simulator Paper Trading ber-modal virtual Rp 100 Juta agar Anda bisa berlatih di saham IDX (BEI) tanpa risiko kehilangan uang sungguhan."
  },
  {
    q: "Bagaimana cara AI memprediksi pergerakan harga saham IDX dari yfinance?",
    a: "AI kami mengambil indikator real-time dari Yahoo Finance (teknikal RSI, MACD, Moving Average), data fundamental emiten, serta sentiment analysis dari berita pasar modal Indonesia dan transaksi modal asing (Foreign Flow)."
  },
  {
    q: "Apakah sinyal AI garansi pasti untung/cuan?",
    a: "Sinyal AI kami memiliki tingkat akurasi historis backtest hingga 94.2% pada saham blue-chip IDX. Namun, semua bentuk investasi saham tetap mengandung risiko pasar. InvestAI hadir sebagai alat bantu keputusan cerdas berbasis data empiris."
  },
  {
    q: "Berapa biaya berlangganan platform InvestAI?",
    a: "Kami menyediakan Paket Starter Gratis selamanya. Untuk membuka fitur Sinyal Real-time Premium, AI Financial Screener, dan rekomendasi portfolio tanpa batas, Anda bisa berlangganan Paket Pro mulai Rp 49.000/bulan."
  },
  {
    q: "Apakah InvestAI terhubung dengan sekuritas di Indonesia?",
    a: "InvestAI berfokus sebagai platform intelligence & analytics. Anda dapat menggunakan sinyal dan analisis kami untuk mengeksekusi order di sekuritas favorit Anda (seperti Stockbit, Ajaib, IPOT, Mandiri Sekuritas, Mirae, dll)."
  }
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/80">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 sm:py-5 text-left group"
      >
        <span className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {q}
        </span>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-4 pl-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{a}</p>
      </motion.div>
    </div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const features = [
    {
      title: "AI Real-Time Screener Saham IDX",
      badge: "ALGORITHMIC SCANNER",
      desc: "Deteksi otomatis pola Chart Patterns saham Indonesia (Cup & Handle, Double Bottom, Breakout) serta akumulasi Bandar/Foreign Flow dari data yfinance.",
      icon: LineChart,
      details: ["Akurasi backtest 94.2% saham IDX", "Multi-timeframe scanner (5m, 1D, 1W)", "Notifikasi langsung sinyal beli"]
    },
    {
      title: "24/7 AI Co-Pilot & Analyst Emiten BEI",
      badge: "NEURAL FINANCIAL BOT",
      desc: "Tanyakan apa saja seputar laporan keuangan LK3/LK4 emiten seperti BBCA, BBRI, BMRI, TLKM, ASII tanpa membaca ratusan halaman PDF.",
      icon: Cpu,
      details: ["Rangkuman instant LK3/LK4", "Valuasi DCF & Fair Value emiten IDX", "Sentimen analisis berita saham"]
    },
    {
      title: "Paper Trading Simulator Rp 100 Juta",
      badge: "RISK-FREE SIMULATOR",
      desc: "Uji insting dan strategi saham Anda dengan modal virtual Rp 100 Juta yang tersambung ke orderbook nyata 100% tanpa risiko finansial.",
      icon: Gamepad2,
      details: ["Data harga realtime IDX yfinance", "Analisis kesalahan trade otomatis", "Kompetisi Leaderboard bulanan"]
    },
    {
      title: "Smart Risk Engine & Stop Loss Calculator",
      badge: "RISK MANAGEMENT",
      desc: "Proteksi modal Anda dengan penentuan Stop Loss, Take Profit otomatis, serta saran diversifikasi sektor portofolio berbasis Sharpe Ratio.",
      icon: ShieldCheck,
      details: ["Dynamic Stop-Loss Calculator", "Portfolio Heatmap & Matrix", "Saran Rebalancing Otomatis"]
    }
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen text-slate-900 overflow-x-hidden font-sans pb-16 md:pb-0">
      {/* ── TOP LIVE STOCK TICKER ── */}
      <StockTicker />

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 h-16 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5 sm:w-5.5 sm:h-5.5 brightness-0 invert" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-primary tracking-tight font-display">
              Invest<span className="text-emerald-600">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <a href="#fitur" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Fitur AI</a>
            <a href="#kalkulator" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Kalkulator Cuan</a>
            <Link to="/signals" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors flex items-center gap-1">
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-100" /> Sinyal AI
            </Link>
            <Link to="/simulator" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors flex items-center gap-1">
              <Gamepad2 className="w-4 h-4 text-emerald-600" /> Simulator
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-primary px-3 py-2 transition-colors">
              Login
            </Link>
            <Link
              to="/signals"
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] transition-all flex items-center gap-2"
            >
              Lihat Sinyal Selengkapnya <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-700 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 left-0 right-0 z-40 bg-white border-b border-slate-200 p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4 font-semibold text-slate-800">
              <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Fitur AI</a>
              <a href="#kalkulator" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Kalkulator Cuan</a>
              <Link to="/signals" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Sinyal AI</Link>
              <Link to="/simulator" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Simulator</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Login</Link>
              <Link to="/signals" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-bold text-center mt-2 shadow-lg shadow-primary/25">
                Lihat Sinyal Selengkapnya
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO SECTION ── */}
      <section className="pt-8 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/40">
        <div className="absolute top-10 left-[10%] w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 right-[5%] w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 text-center lg:text-left space-y-4 sm:space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-[11px] sm:text-xs font-bold shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 shrink-0" /> #1 Platform AI Saham Indonesia (BEI/IDX)
              </motion.div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-primary leading-[1.15] tracking-tight font-display">
                Investasi Saham IDX
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-primary">
                  Data Real, Presisi & Cuan.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Data harga real-time diambil langsung dari Yahoo Finance (`yfinance`). Dapatkan rekomendasi *entry & exit point* akurat untuk saham BBCA, BBRI, BMRI, TLKM, dan emiten BEI lainnya.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => navigate('/signals')}
                  className="w-full sm:w-auto group bg-primary hover:bg-primary/95 text-white px-7 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-extrabold shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Lihat Sinyal Selengkapnya <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/simulator')}
                  className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-200/90 hover:border-emerald-500 hover:text-emerald-700 px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" /> Coba Paper Trading
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 border-t border-slate-200/60 font-semibold text-[11px] sm:text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> IDX yfinance Data
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% Risk Free Trading
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 500K+ Investors
                </div>
              </div>
            </motion.div>

            {/* Right Hero Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 w-full"
            >
              <StockChartHeroDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-8 sm:py-10 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { label: 'Total AUM Dikelola', value: 'Rp 2.4T+', icon: BarChart3 },
            { label: 'Investor Aktif', value: '500,000+', icon: Users },
            { label: 'Akurasi Backtest AI', value: '94.2%', icon: Zap },
            { label: 'Rating Kepuasan', value: '4.9 / 5.0', icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="space-y-1"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-700 mx-auto mb-1 sm:mb-2">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="text-xl sm:text-3xl font-extrabold text-primary tracking-tight font-mono">{stat.value}</h4>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIVE ACTIVITY & SIGNALS STREAM SECTION ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Sinyal Saham Indonesia Realtime
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Sinyal Akurat Terdeteksi Dari Data yfinance Saham BEI
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              Algoritma AI melacak ribuan pola teknikal dan transaksi modal asing (*foreign flow*) saham Indonesia secara *real-time* untuk memberikan rekomendasi saham yang paling potensial cuan.
            </p>
            <div className="space-y-2.5 pt-1 font-semibold text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Filter saham breakout otomatis sebelum lonjakan harga.
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Target Price dan Stop-Loss kalkulasi presisi rasio risk/reward.
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Real data yfinance saham Indonesia (BBCA, BBRI, BMRI, TLKM).
              </div>
            </div>
            <button
              onClick={() => navigate('/signals')}
              className="w-full sm:w-auto mt-3 bg-primary hover:bg-primary/95 text-white font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer"
            >
              Lihat Sinyal Selengkapnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <LiveSignalStream />
          </div>
        </div>
      </section>

      {/* ── AI FEATURE TERMINAL (INTERACTIVE TABS) ── */}
      <section id="fitur" className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-block">
              Teknologi FinTech Generasi Baru
            </span>
            <h2 className="text-2xl sm:text-5xl font-black text-primary tracking-tight">
              4 Senjata AI Utama Untuk Sukses Di Pasar Saham Indonesia
            </h2>
            <p className="text-slate-600 text-xs sm:text-base font-medium">
              Semua alat analitis kelas institusi kini ada dalam genggaman Anda.
            </p>
          </div>

          {/* Interactive Feature Terminal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left: Tab Selectors */}
            <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                const isActive = activeFeatureTab === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFeatureTab(idx)}
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-primary to-[#003B99] text-white border-primary shadow-xl shadow-primary/20 scale-[1.01]"
                        : "bg-slate-50 hover:bg-slate-100/90 text-slate-800 border-slate-200/80"
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={cn(
                        "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 font-bold",
                        isActive ? "bg-white/15 text-emerald-400" : "bg-primary/10 text-primary"
                      )}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <span className={cn(
                          "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block mb-0.5",
                          isActive ? "text-emerald-300" : "text-emerald-700"
                        )}>
                          {feat.badge}
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold tracking-tight">{feat.title}</h4>
                        <p className={cn(
                          "text-[11px] sm:text-xs mt-1 line-clamp-2 font-medium leading-relaxed",
                          isActive ? "text-white/80" : "text-slate-600"
                        )}>
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Feature Live Detail Screen */}
            <div className="lg:col-span-7 bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    MODULE DEMO: {features[activeFeatureTab].badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">IDX STATION #04</span>
                </div>

                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {features[activeFeatureTab].title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                    {features[activeFeatureTab].desc}
                  </p>

                  <div className="pt-2 sm:pt-4 space-y-2 sm:space-y-3">
                    <h5 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Keunggulan Utama:</h5>
                    {features[activeFeatureTab].details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2.5 text-xs text-slate-200 font-medium bg-slate-800/60 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono text-center sm:text-left">Status: Live Engine Active</span>
                <button
                  onClick={() => navigate('/signals')}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Lihat Sinyal Selengkapnya <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUAN & PORTFOLIO CALCULATOR SECTION ── */}
      <section id="kalkulator" className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <CuanCalculator />
      </section>

      {/* ── COMPARISON TABLE: INVESTAI VS TRADITIONAL ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-2.5">
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1 rounded-full inline-block">
              Perbandingan Metode
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
              Mengapa Berinvestasi Saham Dengan InvestAI?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Bandingkan efisiensi analisis berbasis AI data yfinance dengan metode manual yang memakan waktu.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl bg-white">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] sm:text-xs uppercase font-mono tracking-wider">
                  <th className="p-4 sm:p-5 font-bold">Fitur Analisis</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-400 bg-slate-800/80 border-x border-slate-700">InvestAI Platform</th>
                  <th className="p-4 sm:p-5 font-bold text-slate-400">Analisis Saham Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                {[
                  { feature: 'Kecepatan Analisis LK BEI', ai: '2 Detik (Otomatis Neural Net)', manual: '3 - 5 Jam per Emiten' },
                  { feature: 'Deteksi Sinyal Breakout Saham IDX', ai: '24/7 Scanning Realtime yfinance', manual: 'Terlambat / Tertinggal Trend' },
                  { feature: 'Bias Emosi (FOMO/Fear)', ai: '0% (100% Algoritma)', manual: 'Tinggi (Mudah Panik)' },
                  { feature: 'Simulasi Latihan Tanpa Risiko', ai: 'Paper Trading Rp 100 Juta Virtual', manual: 'Tidak Ada (Uang Asli)' },
                  { feature: 'Penentuan Stop-Loss & Target', ai: 'Presisi Rasio Sharpe', manual: 'Tebak-tebakan' },
                ].map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 sm:p-5 font-bold text-slate-900">{row.feature}</td>
                    <td className="p-3.5 sm:p-5 font-extrabold text-emerald-700 bg-emerald-50/60 border-x border-emerald-100/80 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {row.ai}
                    </td>
                    <td className="p-3.5 sm:p-5 text-slate-500 font-medium">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Kisah Sukses Investor Indonesia
          </span>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Kata Mereka Yang Sudah Cuan Di Saham IDX
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Bergabunglah bersama 500,000+ investor di Indonesia yang meraih hasil optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              name: 'Dimas Kurniawan',
              role: 'Investor Saham Jakarta',
              returnVal: '+28.4% YTD',
              content: 'Sinyal AI di saham BBCA & BBRI presisi banget! Saya tidak perlu lagi begadang baca Laporan Keuangan 100 halaman.',
              rating: 5
            },
            {
              name: 'Dr. Clara Sinta',
              role: 'Investor Saham Surabaya',
              returnVal: '+34.1% YTD',
              content: 'Sebagai dokter yang sibuk, fitur AI Alert sangat membantu. Begitu sinyal breakout saham BMRI terdeteksi, notifikasi langsung masuk.',
              rating: 5
            },
            {
              name: 'Hendra Wijaya',
              role: 'Investor Saham Bandung',
              returnVal: '+19.8% YTD',
              content: 'Belajar dulu lewat Paper Trading modal Rp 100 juta virtual. Begitu sudah pede baru terjun ke pasar asli. Hasilnya mantap!',
              rating: 5
            }
          ].map((testi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,35,111,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex gap-1">
                    {[...Array(testi.rating)].map((_, r) => (
                      <Star key={r} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Return {testi.returnVal}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic mb-5">
                  "{testi.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20">
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{testi.name}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{testi.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION WITH SEARCH ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 space-y-2.5">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1 rounded-full inline-block">
              Pusat Informasi
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Pertanyaan Sering Diajukan (FAQ)
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Temukan jawaban cepat seputar platform, keamanan data yfinance, dan fitur AI InvestAI.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto pt-3 sm:pt-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-6 sm:top-7" />
              <input
                type="text"
                placeholder="Cari pertanyaan (misal: aman, akurasi, yfinance, biaya)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-200/80 pt-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))
            ) : (
              <p className="text-center py-8 text-slate-500 text-xs sm:text-sm">Tidak ditemukan pertanyaan sesuai kata kunci.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── HIGH IMPACT LIGHT FINTECH CTA BOX ── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-primary via-[#003399] to-primary rounded-2xl sm:rounded-3xl p-7 sm:p-10 lg:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-72 sm:h-72 bg-emerald-400/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-72 sm:h-72 bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-emerald-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Siap Melipatgandakan Cuan Saham Anda?
            </span>

            <h2 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight">
              Mulai Portofolio AI Saham Anda Hari Ini
            </h2>

            <p className="text-slate-200 text-xs sm:text-base font-medium leading-relaxed">
              Bergabung sekarang dan rasakan kemudahan sinyal rekomendasi saham Indonesia dengan kecerdasan buatan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 sm:pt-4">
              <button
                onClick={() => navigate('/signals')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Mulai Portofolio AI Sekarang <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => navigate('/simulator')}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 font-extrabold px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Coba Paper Trading
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <MobileBottomBar />
    </div>
  );
}
