import { User, Bell, Shield, Wallet, ChevronRight, LogOut, Camera, Zap, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';

export default function Settings() {
  const navigate = useNavigate();
  const { investorLevel } = useUser();

  const labels = {
    'Pemula': 'Investor Pemula',
    'Menengah': 'Investor Menengah',
    'Berpengalaman': 'Investor Berpengalaman'
  };

  const sections = [
    { icon: User, label: 'Profil Pengguna', desc: 'Kelola informasi pribadi dan preferensi akun.', color: 'text-primary bg-primary/8' },
    { icon: Bell, label: 'Notifikasi', desc: 'Atur cara menerima sinyal AI dan update pasar.', color: 'text-secondary bg-secondary/8' },
    { icon: Shield, label: 'Keamanan', desc: 'Lindungi akun dengan kata sandi dan 2FA.', color: 'text-amber-600 bg-amber-50' },
    { icon: Wallet, label: 'Langganan & Billing', desc: 'Atur paket InvestAI Pro dan riwayat transaksi.', color: 'text-emerald-600 bg-emerald-50' },
    { icon: HelpCircle, label: 'Pusat Bantuan', desc: 'Butuh bantuan? Tim support kami siap membantu.', color: 'text-slate-500 bg-slate-100' },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' } }),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Settings</h1>
          <p className="text-sm text-on-surface-variant/60 mt-1">Kustomisasi akun dan pengalaman investasi Anda.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Akun Terverifikasi</span>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.section
        custom={0} variants={fadeUp} initial="hidden" animate="visible"
        className="card rounded-2xl overflow-hidden"
      >
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-primary via-primary/80 to-primary/60 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
        </div>

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-10">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNDn9tNW7r8eHm_SzPyiz195oTRN2TBCM085ZSwfJCxBkH9fOhy_Ak6v70xpYyYkkDdiAlfEdz-NmEvkEWvbEif5nqrHUbwqn7Kw475IOVbTAgtdFYBtNQWprLUEnjnzg1jNXjZKHvpOMqyFUdDOyqktbuCG37XhWbS86GovntTIeMF96wUrtOtPDaSybwhV71Kbh82o-399Jz5fDVjt2M7ghLRPeQZFWMM1HTuDWqhsrS3DrI1j78ZyaDDZwC9yjRZHhH4yZA_Q"
                  alt="Profile"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-lg shadow-md text-primary hover:text-secondary transition-colors border border-slate-100">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-primary tracking-tight">{labels[investorLevel]}</h2>
                <div className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-current" /> Pro Member
                </div>
              </div>
              <p className="text-sm text-on-surface-variant/50">investor.pemula@example.com</p>
            </div>

            <button className="shrink-0 btn-outline px-5 py-2 text-xs">Edit Profil</button>
          </div>
        </div>
      </motion.section>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((section, i) => (
          <motion.button
            key={i}
            custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="card p-5 rounded-2xl flex items-center gap-4 group text-left hover:shadow-md transition-all duration-200"
          >
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105",
              section.color
            )}>
              <section.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-primary mb-0.5">{section.label}</h3>
              <p className="text-xs text-on-surface-variant/50 leading-relaxed truncate">{section.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/25 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        ))}

        {/* Logout */}
        <motion.button
          custom={sections.length + 1} variants={fadeUp} initial="hidden" animate="visible"
          onClick={() => navigate('/')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="card p-5 rounded-2xl flex items-center gap-4 group text-left hover:shadow-md hover:border-red-100 transition-all duration-200 border-red-50/60 bg-red-50/10"
        >
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-600 mb-0.5">Keluar Akun</h3>
            <p className="text-xs text-red-500/40">Logout dari sistem</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300 shrink-0" />
        </motion.button>
      </div>
    </div>
  );
}
