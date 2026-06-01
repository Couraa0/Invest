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
        className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-100 shadow-sm"
      >
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-slate-50 shadow-xl overflow-hidden bg-slate-50">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNDn9tNW7r8eHm_SzPyiz195oTRN2TBCM085ZSwfJCxBkH9fOhy_Ak6v70xpYyYkkDdiAlfEdz-NmEvkEWvbEif5nqrHUbwqn7Kw475IOVbTAgtdFYBtNQWprLUEnjnzg1jNXjZKHvpOMqyFUdDOyqktbuCG37XhWbS86GovntTIeMF96wUrtOtPDaSybwhV71Kbh82o-399Jz5fDVjt2M7ghLRPeQZFWMM1HTuDWqhsrS3DrI1j78ZyaDDZwC9yjRZHhH4yZA_Q"
              alt="Profile"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg text-primary hover:text-secondary transition-all duration-300 ring-1 ring-slate-100 group-hover:scale-110">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-center sm:pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight truncate">{labels[investorLevel]}</h2>
            <div className="inline-flex mx-auto sm:mx-0 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md items-center gap-1.5">
              <Zap className="w-3 h-3 fill-current" /> Pro Member
            </div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant/50 truncate">investor.pemula@example.com</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
             <button className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-primary font-semibold text-sm rounded-xl transition-colors border border-slate-200/60 w-full sm:w-auto">
               Edit Profil
             </button>
          </div>
        </div>
      </motion.section>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {sections.map((section, i) => (
          <motion.button
            key={i}
            custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
            whileHover={{ y: -2, scale: 0.995 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-3xl flex items-center gap-4 group text-left border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
              section.color
            )}>
              <section.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-primary mb-0.5">{section.label}</h3>
              <p className="text-xs font-medium text-on-surface-variant/50 leading-relaxed truncate">{section.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/25 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        ))}

        {/* Logout */}
        <motion.button
          custom={sections.length + 1} variants={fadeUp} initial="hidden" animate="visible"
          onClick={() => navigate('/')}
          whileHover={{ y: -2, scale: 0.995 }}
          whileTap={{ scale: 0.98 }}
          className="bg-red-50/30 p-5 rounded-3xl flex items-center gap-4 group text-left border border-red-50 hover:border-red-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-white text-red-500 shadow-sm flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-red-600 mb-0.5">Keluar Akun</h3>
            <p className="text-xs font-medium text-red-500/50 truncate">Logout dari sistem</p>
          </div>
          <ChevronRight className="w-4 h-4 text-red-300 shrink-0 group-hover:translate-x-0.5 transition-all" />
        </motion.button>
      </div>
    </div>
  );
}
