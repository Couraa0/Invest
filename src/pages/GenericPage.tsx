import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Bot
} from 'lucide-react';
import Footer from '../components/Footer';
import StockTicker from '../components/StockTicker';

interface GenericPageProps {
  title: string;
}

const pageConfigs: Record<string, {
  category: string;
  subtitle: string;
  icon: React.ElementType;
  content: React.ReactNode;
}> = {
  "Tentang Kami": {
    category: "PERUSAHAAN",
    subtitle: "Mendemokratisasi literasi dan kecerdasan analisis saham di Indonesia.",
    icon: Building,
    content: (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary to-[#003B99] text-white p-8 rounded-3xl shadow-xl space-y-4">
          <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
            VISI UTAMA KAMI
          </span>
          <h3 className="text-2xl font-black tracking-tight">
            Menjadi Ekosistem AI Saham #1 Di Indonesia
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            InvestAI didirikan dengan satu misi utama: membantu setiap investor saham di Indonesia mengambil keputusan investasi berbasis data nyata (*yfinance & machine learning*), bebas dari bias emosi atau kepanikan pasar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-primary">Teknologi Terdepan</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Memanfaatkan algoritma *Machine Learning Neural Network* yang mengolah data teknikal, laporan keuangan, dan arus kas asing saham BEI (IDX).
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-primary">Paper Trading Bebas Risiko</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Menyediakan simulator ber-modal virtual Rp 100 Juta agar pengguna dapat melatih keahlian trading tanpa risiko kehilangan uang sungguhan.
            </p>
          </div>
        </div>
      </div>
    )
  },

  "Karir": {
    category: "KARIR & LOWONGAN",
    subtitle: "Bergabung bersama tim bertalenta yang membangun masa depan FinTech Indonesia.",
    icon: Briefcase,
    content: (
      <div className="space-y-8">
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          Kami selalu mencari talenta terbaik di bidang *software engineering*, *artificial intelligence*, dan *financial research* yang bersemangat menciptakan produk yang berdampak bagi jutaan investor ritel.
        </p>

        <h4 className="text-lg font-extrabold text-primary font-display pt-2">Lowongan Terbuka Saat Ini:</h4>

        <div className="space-y-4">
          {[
            {
              role: 'Senior Frontend Engineer (React & TypeScript)',
              location: 'Remote / Jakarta',
              type: 'Full-time',
              desc: 'Mengembangkan antarmuka terminal saham interaktif dengan performa tinggi & Recharts visualization.'
            },
            {
              role: 'AI Research Scientist (Financial Forecasting)',
              location: 'Jakarta (Sudirman HQ)',
              type: 'Full-time',
              desc: 'Merancang model Machine Learning prediktif pergerakan harga saham IDX & analisis sentimen laporan keuangan.'
            },
            {
              role: 'Stock Market Content & Curriculum Writer',
              location: 'Remote',
              type: 'Full-time / Part-time',
              desc: 'Membuat kurikulum edukasi saham dari tingkat pemula hingga lanjutan yang menyenangkan dan mudah dipahami.'
            }
          ].map((job, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {job.location}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {job.type}
                  </span>
                </div>
                <h5 className="text-base font-extrabold text-slate-900">{job.role}</h5>
                <p className="text-xs text-slate-500 mt-1 font-medium">{job.desc}</p>
              </div>
              <a
                href="mailto:karir@investai.id?subject=Lamaran%20Karir"
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-5 py-2.5 rounded-xl text-center shadow-md shadow-primary/15 transition-all shrink-0"
              >
                Lamar Sekarang
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  },

  "Kontak": {
    category: "HUBUNGI KAMI",
    subtitle: "Kami siap membantu pertanyaan, kerja sama, atau kendala Anda 24/7.",
    icon: Mail,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
            <Mail className="w-6 h-6 text-emerald-600" />
            <h5 className="text-sm font-extrabold text-slate-900">Email Dukungan</h5>
            <p className="text-xs text-slate-600 font-mono">support@investai.id</p>
            <p className="text-[11px] text-slate-400">Respon dalam &lt; 2 jam</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
            <Phone className="w-6 h-6 text-blue-600" />
            <h5 className="text-sm font-extrabold text-slate-900">Call Center</h5>
            <p className="text-xs text-slate-600 font-mono">+62 (21) 5088-9900</p>
            <p className="text-[11px] text-slate-400">Senin - Jumat (08:30 - 17:30 WIB)</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <h5 className="text-sm font-extrabold text-slate-900">Kantor Pusat</h5>
            <p className="text-xs text-slate-600">Menara Sudirman Lt. 18, Jakarta Selatan 12190</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-primary p-7 rounded-3xl text-white flex items-center justify-between flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/15">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold">Butuh Bantuan Bantuan Instan?</h4>
              <p className="text-xs text-slate-300 font-medium">Asisten AI kami siap menjawab pertanyaan Anda di halaman Signals & Mentor 24/7.</p>
            </div>
          </div>
          <Link
            to="/signals"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Tanya AI Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  },

  "Kebijakan Privasi": {
    category: "LEGAL & PRIVASI",
    subtitle: "Komitmen kami untuk melindungi data dan privasi pengguna platform.",
    icon: ShieldCheck,
    content: (
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-medium">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          Seluruh data pengguna terenkripsi SSL 256-bit standar perbankan.
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-primary">1. Pengumpulan Data Pengguna</h4>
          <p>
            Kami mengumpulkan data pendaftaran berupa Nama Lengkap, Alamat Email, serta statistik aktivitas simulasi Paper Trading Anda untuk memberikan rekomendasi materi edukasi dan sinyal saham yang terpersonalisasi.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-primary">2. Keamanan & Tanpa Penjualan Data</h4>
          <p>
            InvestAI **tidak pernah membagikan atau menjual** data pribadi Anda kepada pihak ketiga untuk kepentingan iklan. Data Anda sepenuhnya dilindungi untuk kenyamanan berinvestasi.
          </p>
        </div>
      </div>
    )
  },

  "Edukasi Risiko": {
    category: "DISCLAIMER RESMI",
    subtitle: "Pahami risiko investasi di pasar modal secara bijak dan rasional.",
    icon: AlertTriangle,
    content: (
      <div className="space-y-6">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-900 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-700">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h4 className="text-base font-extrabold">Bukan Nasihat Finansial Mengikat</h4>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            Seluruh informasi, sinyal indikator AI, dan data harga saham yang ditampilkan di InvestAI disediakan khusus untuk **tujuan edukasi dan simulasi (Paper Trading)** semata.
          </p>
        </div>

        <div className="space-y-4 text-slate-700 text-sm font-medium leading-relaxed">
          <h4 className="text-lg font-bold text-primary">Tanggung Jawab Keputusan Investasi</h4>
          <p>
            Investasi saham mengandung risiko kerugian sebagian atau seluruh modal. Keputusan untuk membeli atau menjual saham di pasar asli sepenuhnya merupakan tanggung jawab independen pengguna.
          </p>
        </div>
      </div>
    )
  },

  "Syarat & Ketentuan": {
    category: "ATURAN PENGGUNAAN",
    subtitle: "Syarat dan ketentuan resmi penggunaan layanan platform InvestAI.",
    icon: FileText,
    content: (
      <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-medium">
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-primary">1. Penggunaan Layanan Platform</h4>
          <p>
            Pengguna setuju untuk memanfaatkan platform InvestAI untuk tujuan edukasi yang sah dan dilarang keras melakukan *scraping* data atau penyalahgunaan sistem secara otomatis.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-primary">2. Saldo Virtual Paper Trading</h4>
          <p>
            Saldo "Rp 100 Juta" pada fitur Paper Trading sepenuhnya merupakan dana virtual fiktif untuk keperluan simulasi dan tidak dapat ditarik (*withdrawn*) atau ditukarkan dengan uang tunai asli.
          </p>
        </div>
      </div>
    )
  }
};

export default function GenericPage({ title }: GenericPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const config = pageConfigs[title] || {
    category: "INFORMASI",
    subtitle: "Informasi mengenai platform InvestAI.",
    icon: FileText,
    content: <p className="text-slate-600 text-sm font-medium">Konten sedang disiapkan.</p>
  };

  const IconComp = config.icon;

  return (
    <div className="bg-slate-50/60 min-h-screen font-sans flex flex-col justify-between overflow-x-hidden">
      <div>
        {/* Top Ticker */}
        <StockTicker />

        {/* Navbar */}
        <nav className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 h-16 transition-all duration-300 shadow-sm">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.svg" alt="Logo" className="w-5.5 h-5.5 brightness-0 invert" />
              </div>
              <span className="text-xl font-extrabold text-primary tracking-tight font-display">
                Invest<span className="text-emerald-600">AI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/signals" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Sinyal AI</Link>
              <Link to="/academy" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Academy</Link>
              <Link to="/simulator" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Simulator</Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/" className="text-sm font-bold text-slate-700 hover:text-primary px-3 py-2 flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <Link
                to="/signals"
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.97] transition-all"
              >
                Mulai Gratis
              </Link>
            </div>

            <button 
              className="md:hidden p-2 text-slate-700 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Header Hero Banner */}
        <section className="bg-gradient-to-b from-white to-slate-100/60 pt-10 pb-12 px-6 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono uppercase tracking-wider">
              <IconComp className="w-3.5 h-3.5" /> {config.category}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-primary tracking-tight font-display">
              {title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              {config.subtitle}
            </p>
          </div>
        </section>

        {/* Content Body */}
        <main className="max-w-4xl mx-auto py-12 px-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-10 shadow-[0_15px_45px_rgba(0,35,111,0.06)]">
            {config.content}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
