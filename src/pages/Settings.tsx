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
    { icon: User, label: 'Profil Pengguna', desc: 'Kelola informasi pribadi dan preferensi akun Anda.', color: 'text-primary' },
    { icon: Bell, label: 'Notifikasi', desc: 'Atur cara Anda menerima sinyal AI dan update pasar.', color: 'text-secondary' },
    { icon: Shield, label: 'Keamanan', desc: 'Lindungi akun Anda dengan kata sandi dan 2FA.', color: 'text-amber-500' },
    { icon: Wallet, label: 'Langganan & Billing', desc: 'Atur paket InvestAI Pro dan riwayat transaksi.', color: 'text-emerald-500' },
    { icon: HelpCircle, label: 'Pusat Bantuan', desc: 'Butuh bantuan? Tim support kami siap membantu.', color: 'text-slate-500' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tighter mb-2">Settings</h1>
          <p className="text-on-surface-variant/70 font-medium text-lg">Kustomisasi akun dan pengalaman investasi Anda.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Akun Terverifikasi
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Card */}
        <section className="glass-card rounded-[2.5rem] overflow-hidden border-white/60 shadow-xl relative">
          {/* Cover Area */}
          <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-secondary relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="px-10 pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-8 -mt-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-white">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNDn9tNW7r8eHm_SzPyiz195oTRN2TBCM085ZSwfJCxBkH9fOhy_Ak6v70xpYyYkkDdiAlfEdz-NmEvkEWvbEif5nqrHUbwqn7Kw475IOVbTAgtdFYBtNQWprLUEnjnzg1jNXjZKHvpOMqyFUdDOyqktbuCG37XhWbS86GovntTIeMF96wUrtOtPDaSybwhV71Kbh82o-399Jz5fDVjt2M7ghLRPeQZFWMM1HTuDWqhsrS3DrI1j78ZyaDDZwC9yjRZHhH4yZA_Q" 
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2.5 bg-white rounded-2xl shadow-xl text-primary hover:text-secondary transition-colors border border-slate-100">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-primary tracking-tight">{labels[investorLevel]}</h2>
                   <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 flex items-center gap-1.5">
                     <Zap className="w-3 h-3 fill-current" /> Pro Member
                   </div>
                </div>
                <p className="text-on-surface-variant/60 font-bold tracking-tight">investor.pemula@example.com</p>
              </div>

              <button className="mb-2 px-8 py-3.5 bg-white border border-slate-100 text-primary font-black text-xs rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                Edit Profil
              </button>
            </div>
          </div>
        </section>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <motion.button 
              key={i}
              whileHover={{ y: -5, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="glass-card p-8 rounded-[2rem] flex items-center justify-between group border-white/60 shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all text-left bg-white/40"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6",
                  section.color
                )}>
                  <section.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary mb-1 tracking-tight">{section.label}</h3>
                  <p className="text-xs text-on-surface-variant/60 font-medium leading-relaxed max-w-[180px]">{section.desc}</p>
                </div>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-on-surface-variant/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
          
          {/* Logout Special Card */}
          <motion.button 
            onClick={handleLogout}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-[2rem] flex items-center justify-between group border-red-100 bg-red-50/10 shadow-lg text-left"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <LogOut className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-red-600 mb-1 tracking-tight">Keluar Akun</h3>
                <p className="text-xs text-red-600/40 font-medium uppercase tracking-widest">Logout dari sistem</p>
              </div>
            </div>
            <div className="p-2 bg-red-50 rounded-xl text-red-200">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
