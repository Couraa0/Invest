import { User, Bell, Shield, Wallet, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const sections = [
    { icon: User, label: 'Profil Pengguna', desc: 'Kelola informasi pribadi dan preferensi' },
    { icon: Bell, label: 'Notifikasi', desc: 'Atur cara Anda menerima sinyal AI' },
    { icon: Shield, label: 'Keamanan', desc: 'Kata sandi dan autentikasi dua faktor' },
    { icon: Wallet, label: 'Langganan', desc: 'Atur paket InvestAI Pro Anda' },
  ];

  const handleLogout = () => {
    // In a real app, you would clear tokens/session here
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Settings</h1>
        <p className="text-on-surface-variant">Sesuaikan pengalaman InvestAI Anda.</p>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b border-white/20 flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl overflow-hidden">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJNDn9tNW7r8eHm_SzPyiz195oTRN2TBCM085ZSwfJCxBkH9fOhy_Ak6v70xpYyYkkDdiAlfEdz-NmEvkEWvbEif5nqrHUbwqn7Kw475IOVbTAgtdFYBtNQWprLUEnjnzg1jNXjZKHvpOMqyFUdDOyqktbuCG37XhWbS86GovntTIeMF96wUrtOtPDaSybwhV71Kbh82o-399Jz5fDVjt2M7ghLRPeQZFWMM1HTuDWqhsrS3DrI1j78ZyaDDZwC9yjRZHhH4yZA_Q" 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Investor Pemula</h2>
            <p className="text-on-surface-variant font-medium">investor.pemula@example.com</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Beginner Level 2
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {sections.map((section, i) => (
            <button key={i} className="w-full p-8 flex items-center justify-between hover:bg-white/30 transition-colors text-left group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">{section.label}</h3>
                  <p className="text-sm text-on-surface-variant">{section.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="p-8 bg-error/5 border-t border-white/20">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-error font-bold hover:opacity-80 transition-opacity"
          >
            <LogOut className="w-5 h-5" /> Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  );
}
