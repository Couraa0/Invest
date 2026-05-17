import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const faqs = [
  {
    q: "Apakah InvestAI aman untuk pemula?",
    a: "Sangat aman! InvestAI dirancang khusus dengan fitur pendampingan AI dan simulator Paper Trading agar Anda bisa belajar tanpa risiko sebelum berinvestasi dengan uang sungguhan."
  },
  {
    q: "Berapa biaya berlangganan InvestAI?",
    a: "Kami menyediakan paket gratis selamanya dengan fitur dasar. Untuk akses ke sinyal premium dan AI Mentor tanpa batas, Anda bisa berlangganan paket Pro mulai dari Rp 49.000/bulan."
  },
  {
    q: "Apakah sinyal AI dijamin akurat?",
    a: "AI kami memiliki tingkat akurasi historis 94.2% dalam memprediksi tren jangka menengah. Namun, semua bentuk investasi memiliki risiko, dan sinyal AI ditujukan sebagai alat bantu pengambilan keputusan, bukan jaminan pasti."
  },
  {
    q: "Apakah saya bisa menarik dana kapan saja?",
    a: "Tentu. Kami bermitra dengan sekuritas resmi yang diawasi OJK, sehingga dana Anda aman dan bisa ditarik ke rekening pribadi Anda kapan saja di hari kerja."
  }
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-base font-semibold text-primary group-hover:text-secondary transition-colors">{q}</span>
        <ChevronDown className={cn("w-5 h-5 text-on-surface-variant/40 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-on-surface-variant/60 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[40%] bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/4 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-primary/3 rounded-full blur-[80px]" />
      </div>

      {/* ── NAVBAR ── */}
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
            <Link to="/pricing" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Harga</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-primary hover:text-primary/70 px-3 py-2 transition-colors">
              Login
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.97] transition-all"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/6 border border-primary/10 text-primary text-xs font-semibold mb-6"
              >
                <Zap className="w-3.5 h-3.5 fill-primary" /> #1 AI Investment Platform di Indonesia
              </motion.div>

              <h1 className="text-5xl lg:text-7xl font-bold text-primary mb-6 leading-[1.1] tracking-tight">
                Investasi
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">Lebih Cerdas.</span>
              </h1>

              <p className="text-lg text-on-surface-variant/70 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Sederhanakan kerumitan pasar saham dengan kecerdasan buatan.
                Keputusan tepat, hasil maksimal, untuk masa depan finansial Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="group bg-primary text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
                >
                  Mulai Investasi <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/simulator"
                  className="bg-slate-50 text-primary border border-slate-200 px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white hover:border-primary/20 hover:shadow-md transition-all flex items-center justify-center gap-2.5"
                >
                  Coba Simulasi Gratis
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 opacity-50 hover:opacity-100 transition-opacity duration-500">
                {[
                  { icon: Globe, label: 'IDX' },
                  { icon: Award, label: 'OJK' },
                  { icon: Users, label: '500K+' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <Icon className="w-4 h-4" /> {label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Floating Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="flex-1 w-full relative max-w-lg mx-auto"
            >
              {/* Main card */}
              <div className="relative z-10 bg-white rounded-3xl p-3 shadow-[0_32px_80px_-16px_rgba(0,35,111,0.18)] border border-slate-100/80">
                <img
                  src="/landing_hero.png"
                  alt="InvestAI Interface"
                  className="rounded-2xl w-full"
                />

                {/* Floating widget - top right */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-5 -right-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden md:block"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Bullish Signal</span>
                  </div>
                  <p className="text-base font-bold text-primary">BBCA +2.4%</p>
                </motion.div>

                {/* Floating widget - bottom left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/8 rounded-xl flex items-center justify-center text-primary">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Growth</p>
                      <p className="text-lg font-bold text-primary">+18.5%</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Glow */}
              <div className="absolute inset-0 bg-primary/8 rounded-full blur-[60px] -z-10 scale-110 translate-y-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-10 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Total AUM', value: 'Rp 2.4T+', icon: BarChart3 },
            { label: 'Active Users', value: '500K+', icon: Users },
            { label: 'AI Accuracy', value: '94.2%', icon: Zap },
            { label: 'Trust Rating', value: '4.9/5', icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="space-y-1.5"
            >
              <div className="w-9 h-9 bg-primary/6 rounded-xl flex items-center justify-center text-primary mx-auto">
                <stat.icon className="w-4 h-4" />
              </div>
              <h4 className="text-2xl font-bold text-primary">{stat.value}</h4>
              <p className="text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES / PILLARS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] block mb-3"
            >
              Pilar Utama Kami
            </motion.span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary tracking-tight mb-4">Ekosistem Investasi Lengkap</h2>
            <p className="text-base text-on-surface-variant/60 max-w-xl mx-auto">
              Dari pemula hingga ahli, kami menyediakan semua alat yang Anda butuhkan untuk sukses di pasar modal.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              { icon: TrendingUp, title: 'AI Analysis', desc: 'Analisis fundamental dan teknikal otomatis yang disederhanakan untuk Anda.', accentColor: 'bg-primary/8 text-primary', hoverBorder: 'hover:border-primary/20' },
              { icon: BookOpen, title: 'Academy', desc: 'Belajar dari dasar hingga strategi lanjutan dengan kurikulum terpersonalisasi.', accentColor: 'bg-secondary/8 text-secondary', hoverBorder: 'hover:border-secondary/20' },
              { icon: Gamepad2, title: 'Paper Trading', desc: 'Latih insting Anda dengan modal virtual Rp 100 Juta tanpa risiko kehilangan uang nyata.', accentColor: 'bg-primary/8 text-primary', hoverBorder: 'hover:border-primary/20' },
            ].map((pilar, idx) => (
              <motion.div
                key={idx}
                variants={itemFade}
                className={`bg-white border border-slate-100 rounded-2xl p-7 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${pilar.hoverBorder}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${pilar.accentColor} group-hover:scale-105`}>
                  <pilar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">{pilar.title}</h3>
                <p className="text-sm text-on-surface-variant/60 leading-relaxed mb-5">{pilar.desc}</p>
                <Link to="/dashboard" className="text-xs font-semibold text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200">
                  Pelajari Lebih Lanjut <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-14">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-4 tracking-tight">Kata Mereka Yang Sudah <span className="text-secondary">Cuan.</span></h2>
              <p className="text-base text-on-surface-variant/60">Lebih dari 500,000 investor telah mempercayakan perjalanan finansial mereka kepada InvestAI.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Rizky Pratama', role: 'Karyawan Swasta', content: 'InvestAI benar-benar mengubah cara saya melihat pasar saham. Sinyal AI-nya sangat membantu untuk entry point yang tepat.', rating: 5 },
              { name: 'Sarah Wijaya', role: 'Mahasiswa', content: 'Fitur Paper Trading-nya luar biasa! Saya bisa belajar tanpa takut rugi sebelum terjun ke pasar asli.', rating: 5 },
              { name: 'Budi Santoso', role: 'Wirausaha', content: 'Academy-nya sangat terstruktur. Dari yang tidak tahu apa-apa, sekarang saya paham cara baca laporan keuangan.', rating: 5 },
            ].map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-slate-100 rounded-2xl p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-primary/75 leading-relaxed italic mb-6">"{testi.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full overflow-hidden border border-white shadow-sm">
                    <img src={`https://i.pravatar.cc/80?u=${testi.name}`} alt={testi.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">{testi.name}</h4>
                    <p className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-wider">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] block mb-3"
            >
              FAQ
            </motion.span>
            <h2 className="text-3xl lg:text-5xl font-bold text-primary tracking-tight mb-4">Pertanyaan Seputar InvestAI</h2>
            <p className="text-base text-on-surface-variant/60">Temukan jawaban untuk pertanyaan yang paling sering diajukan oleh pengguna kami.</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            {/* Decorative */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/4 rounded-full" />
              <div className="absolute top-8 right-24 w-24 h-24 bg-secondary/15 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-secondary" /> Platform #1 di Indonesia
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">Siap Mulai Perjalanan<br />Investasi Anda?</h2>
              <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">Bergabung dengan 500.000+ investor yang sudah merasakan manfaat AI dalam investasi mereka.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="bg-white text-primary px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                >
                  Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/simulator"
                  className="border border-white/25 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Coba Paper Trading
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform overflow-hidden">
                  <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
                </div>
                <span className="text-base font-bold text-primary">InvestAI</span>
              </Link>
              <p className="text-sm text-on-surface-variant/60 leading-relaxed max-w-sm mb-6">
                Membangun masa depan finansial Indonesia melalui edukasi dan teknologi kecerdasan buatan kelas dunia.
              </p>
              <div className="flex gap-2">
                {['facebook', 'x', 'instagram', 'linkedin'].map(s => (
                  <a key={s} href="#" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all duration-200">
                    <span className="text-[10px] font-bold uppercase">{s[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Produk', links: ['AI Signals', 'Academy', 'Paper Trading', 'Mentorship'] },
              { title: 'Perusahaan', links: ['Tentang Kami', 'Karir', 'Kontak'] },
              { title: 'Legal', links: ['Kebijakan Privasi', 'Edukasi Risiko', 'Syarat & Ketentuan'] },
            ].map((col, i) => (
              <div key={i} className="md:col-span-2">
                <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">{col.title}</h5>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-on-surface-variant/60 hover:text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant/40">
            <p>© 2026 InvestAI Indonesia. Berizin dan diawasi oleh OJK.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-primary transition-colors">Edukasi Risiko</a>
              <a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
