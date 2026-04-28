import { motion } from 'motion/react';
import { 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Gamepad2, 
  Layers, 
  Zap, 
  MessageSquare, 
  Star,
  Users,
  Award,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-[#fcfdff] min-h-screen overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 h-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform overflow-hidden">
                <img src="/src/public/logo.svg" alt="Logo" className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-primary tracking-tighter">InvestAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-full transition-colors">Login</button>
            <Link 
              to="/dashboard"
              className="bg-primary text-white px-8 py-3.5 rounded-full text-sm font-black shadow-2xl shadow-primary/30 hover:scale-[1.05] hover:shadow-primary/40 active:scale-95 transition-all"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
            >
              <Zap className="w-3 h-3 fill-primary" /> #1 AI Investment App
            </motion.div>
            <h1 className="text-6xl lg:text-8xl font-black text-primary mb-8 leading-[1] tracking-tighter">
              Investasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">Lebih Cerdas.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
              Sederhanakan kerumitan pasar saham dengan kecerdasan buatan. 
              Keputusan tepat, hasil maksimal, untuk masa depan finansial Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                to="/dashboard"
                className="group bg-primary text-white px-10 py-5 rounded-[2rem] text-lg font-black shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Mulai Investasi <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/simulator"
                className="bg-white text-primary border-2 border-primary/10 px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-primary/5 transition-all flex items-center justify-center gap-3"
              >
                Coba Simulasi Gratis
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <div className="flex items-center gap-2 font-black text-lg text-primary"><Globe className="w-5 h-5" /> IDX</div>
               <div className="flex items-center gap-2 font-black text-lg text-primary"><Award className="w-5 h-5" /> OJK</div>
               <div className="flex items-center gap-2 font-black text-lg text-primary"><Users className="w-5 h-5" /> 500K+</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 w-full relative max-w-lg mx-auto lg:ml-auto lg:mr-0"
          >
            <div className="relative z-10 glass-card rounded-[2.5rem] p-3 shadow-[0_40px_80px_-20px_rgba(0,35,111,0.2)] border-white/50">
              <img 
                src="/landing_hero.png" 
                alt="InvestAI Interface"
                className="rounded-[2rem] w-full"
              />
              {/* Floating Widgets */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 glass-card p-5 rounded-2xl shadow-xl border-white/60 hidden md:block"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Bullish Signal</span>
                </div>
                <p className="text-lg font-black text-primary">BBCA +2.4%</p>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 glass-card p-5 rounded-2xl shadow-xl border-white/60 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Growth</p>
                    <p className="text-xl font-black text-primary">+18.5%</p>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] -z-10 scale-110 translate-y-6"></div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-white/40 shadow-xl">
          {[
            { label: 'Total AUM', value: 'Rp 2.4T+', icon: Layers },
            { label: 'Active Users', value: '500K+', icon: Users },
            { label: 'AI Accuracy', value: '94.2%', icon: Zap },
            { label: 'Trust Rating', value: '4.9/5', icon: Star },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary mx-auto mb-2">
                <stat.icon className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-black text-primary tracking-tight">{stat.value}</h4>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-black text-secondary uppercase tracking-[0.4em] mb-3 block"
          >
            Pilar Utama Kami
          </motion.span>
          <h2 className="text-3xl lg:text-5xl font-black text-primary mb-6 tracking-tighter">Ekosistem Investasi Lengkap</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
            Dari pemula hingga ahli, kami menyediakan semua alat yang Anda butuhkan untuk sukses di pasar modal.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: TrendingUp, title: 'AI Analysis', desc: 'Analisis fundamental dan teknikal otomatis yang disederhanakan untuk Anda.', color: 'primary' },
            { icon: BookOpen, title: 'Academy', desc: 'Belajar dari dasar hingga strategi lanjutan dengan kurikulum terpersonalisasi.', color: 'secondary' },
            { icon: Gamepad2, title: 'Paper Trading', desc: 'Latih insting Anda dengan modal virtual Rp 100 Juta tanpa risiko kehilangan uang.', color: 'primary' },
          ].map((pilar, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass-card p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 border-white/30"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 bg-${pilar.color}/10 text-${pilar.color} group-hover:bg-${pilar.color} group-hover:text-white shadow-lg shadow-${pilar.color}/10`}>
                <pilar.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-4 tracking-tight">{pilar.title}</h3>
              <p className="text-on-surface-variant leading-relaxed text-base font-medium">{pilar.desc}</p>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between group-hover:border-primary/20 transition-colors">
                 <Link to="/dashboard" className="text-primary font-black text-xs flex items-center gap-2 group/btn">
                   Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tighter">Kata Mereka Yang Sudah <span className="text-secondary">Cuan.</span></h2>
              <p className="text-lg text-on-surface-variant font-medium">Lebih dari 500,000 investor telah mempercayakan perjalanan finansial mereka kepada InvestAI.</p>
            </div>
            <div className="flex gap-3">
               <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"><ArrowRight className="w-5 h-5 rotate-180" /></div>
               <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"><ArrowRight className="w-5 h-5" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: 'Rizky Pratama', role: 'Karyawan Swasta', content: 'InvestAI benar-benar mengubah cara saya melihat pasar saham. Sinyal AI-nya sangat membantu untuk entry point yang tepat.', rating: 5 },
              { name: 'Sarah Wijaya', role: 'Mahasiswa', content: 'Fitur Paper Trading-nya luar biasa! Saya bisa belajar tanpa takut rugi sebelum akhirnya benar-benar terjun ke pasar asli.', rating: 5 },
              { name: 'Budi Santoso', role: 'Wirausaha', content: 'Academy-nya sangat terstruktur. Dari yang tidak tahu apa-apa, sekarang saya paham cara baca laporan keuangan perusahaan.', rating: 5 },
            ].map((testi, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[2.5rem] border-white/50 shadow-xl"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testi.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-lg text-primary font-medium italic mb-8 leading-relaxed">"{testi.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${testi.name}`} alt={testi.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-primary">{testi.name}</h4>
                    <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{testi.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fcfdff] pt-24 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform overflow-hidden">
                <img src="/src/public/logo.svg" alt="Logo" className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-primary tracking-tighter">InvestAI</span>
            </Link>
            <p className="text-base text-on-surface-variant leading-relaxed max-w-sm font-medium mb-8">
              Membangun masa depan finansial Indonesia melalui edukasi dan teknologi kecerdasan buatan kelas dunia.
            </p>
            <div className="flex gap-4">
               {[
                 { name: 'facebook', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                 { name: 'x', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z' },
                 { name: 'instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.981-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.947-.2-4.353-2.612-6.785-6.98-6.981C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                 { name: 'linkedin', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
               ].map(social => (
                 <a key={social.name} href="#" className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                     <path d={social.path} />
                   </svg>
                 </a>
               ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-primary font-black text-xs mb-6 uppercase tracking-[0.2em]">Produk</h5>
            <ul className="space-y-3 text-on-surface-variant font-bold text-sm">
              <li><Link to="/signals" className="hover:text-primary transition-colors">AI Signals</Link></li>
              <li><Link to="/academy" className="hover:text-primary transition-colors">Academy</Link></li>
              <li><Link to="/simulator" className="hover:text-primary transition-colors">Paper Trading</Link></li>
              <li><Link to="/mentorship" className="hover:text-primary transition-colors">Mentorship</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-primary font-black text-xs mb-6 uppercase tracking-[0.2em]">Perusahaan</h5>
            <ul className="space-y-3 text-on-surface-variant font-bold text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Karir</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h5 className="text-primary font-black text-xs mb-6 uppercase tracking-[0.2em]">Legal</h5>
            <ul className="space-y-3 text-on-surface-variant font-bold text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Edukasi Risiko</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] gap-6 text-center">
          <p>© 2026 InvestAI Indonesia. Berizin dan diawasi oleh OJK.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Edukasi Risiko</a>
            <a href="#" className="hover:text-primary">Kebijakan Privasi</a>
            <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
