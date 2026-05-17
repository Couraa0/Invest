import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowLeft,
  Star,
  Zap,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Basic',
    price: 'Gratis',
    period: 'selamanya',
    desc: 'Cocok untuk pemula yang ingin mulai belajar dan berlatih investasi.',
    features: [
      'Akses InvestAI Academy (Modul Dasar)',
      'Simulator Paper Trading (Rp 10 Juta virtual)',
      'Data pasar delay 15 menit',
      'Analisis Fundamental Dasar',
      'Watchlist maksimal 5 saham'
    ],
    cta: 'Mulai Gratis',
    highlight: false,
    color: 'bg-white border-slate-200'
  },
  {
    name: 'Pro',
    price: 'Rp 49.000',
    period: '/bulan',
    desc: 'Untuk investor serius yang membutuhkan analisis AI real-time.',
    features: [
      'Semua fitur Basic',
      'Sinyal Trading AI Real-time',
      'Akses AI Mentor 24/7',
      'Simulator Paper Trading (Rp 100 Juta virtual)',
      'Akses seluruh modul Academy',
      'Watchlist tanpa batas'
    ],
    cta: 'Langganan Pro',
    highlight: true,
    color: 'bg-primary border-primary text-white'
  },
  {
    name: 'Ultimate',
    price: 'Rp 149.000',
    period: '/bulan',
    desc: 'Fitur VIP untuk trader aktif dengan kebutuhan analisis teknikal mendalam.',
    features: [
      'Semua fitur Pro',
      'Advanced Charting Tools',
      'Prioritas Notifikasi Sinyal via WhatsApp',
      'Konsultasi Portfolio Mingguan dengan AI',
      'Akses Grup Komunitas Eksklusif'
    ],
    cta: 'Langganan Ultimate',
    highlight: false,
    color: 'bg-white border-slate-200'
  }
];

export default function Pricing() {
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
            <Link to="/features" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Fitur</Link>
            <Link to="/academy" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Academy</Link>
            <Link to="/pricing" className="text-sm font-bold text-primary transition-colors">Harga</Link>
          </div>
          <div className="flex items-center gap-3">
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
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold mb-6 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-secondary" /> Investasi Terjangkau
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-primary tracking-tight mb-6">
              Harga Transparan untuk <br className="hidden sm:block" />
              Setiap Kebutuhan
            </h1>
            <p className="text-lg text-on-surface-variant/60 leading-relaxed max-w-xl mx-auto">
              Tidak ada biaya tersembunyi. Pilih paket yang sesuai dengan tujuan finansial dan gaya investasi Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`border rounded-3xl p-8 relative transition-all duration-300 ${plan.color} ${plan.highlight ? 'shadow-2xl shadow-primary/20 scale-105 z-10 py-10' : 'hover:shadow-xl'}`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Star className="w-3 h-3 fill-white" /> Pilihan Populer
                  </div>
                )}
                
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-primary'}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 h-10 ${plan.highlight ? 'text-white/80' : 'text-on-surface-variant/60'}`}>{plan.desc}</p>
                
                <div className="mb-8">
                  <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-white' : 'text-primary'}`}>{plan.price}</span>
                  <span className={`text-sm font-medium ${plan.highlight ? 'text-white/80' : 'text-on-surface-variant/50'}`}>{plan.period}</span>
                </div>
                
                <Link
                  to="/dashboard"
                  className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-8 ${
                    plan.highlight 
                      ? 'bg-white text-primary hover:bg-white/90 shadow-lg' 
                      : 'bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10'
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? 'text-secondary' : 'text-secondary'}`} />
                      <span className={`text-sm leading-snug ${plan.highlight ? 'text-white/90' : 'text-on-surface-variant'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Security Banner */}
      <section className="bg-slate-50 border-t border-slate-100 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-primary mb-1">100% Edukasi, Bebas Risiko</h4>
            <p className="text-sm text-on-surface-variant/60 leading-relaxed">
              Platform InvestAI murni merupakan platform edukasi dan simulasi. Anda dapat menguji berbagai strategi investasi menggunakan uang virtual tanpa risiko kehilangan uang sepeserpun.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
