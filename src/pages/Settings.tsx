import { User, Bell, Shield, Wallet, ChevronRight, LogOut, Camera, Zap, HelpCircle, Save, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const { investorLevel, user, updateProfile, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    avatar_url: '',
    risk_profile: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        risk_profile: user.risk_profile || 'Moderat'
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    const res = await updateProfile(editForm);
    setIsLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setTimeout(() => { setIsEditing(false); setMessage({ type: '', text: '' }); }, 2000);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

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
        className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <div className="relative group shrink-0 mt-2 sm:mt-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-slate-50 shadow-xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
            {user?.avatar_url || (isEditing && editForm.avatar_url) ? (
              <img
                src={isEditing ? editForm.avatar_url : (user?.avatar_url || '')}
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span>{getInitials(user?.full_name || '')}</span>
            )}
          </div>
          {isEditing && (
            <div className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg text-primary ring-1 ring-slate-100 pointer-events-none">
              <Camera className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-center sm:pt-2 w-full">
          {!isEditing ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight truncate">{user?.full_name || 'User'}</h2>
                <div className="inline-flex mx-auto sm:mx-0 px-3 py-1 bg-gradient-to-r from-primary to-primary/80 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" /> Pro Member
                </div>
              </div>
              <p className="text-sm font-medium text-on-surface-variant/50 truncate mb-1">{user?.email}</p>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">{labels[investorLevel]} • {user?.risk_profile} Risk</p>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-primary font-semibold text-sm rounded-xl transition-colors border border-slate-200/60 w-full sm:w-auto"
                 >
                   Edit Profil
                 </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 w-full">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/70 mb-1.5 uppercase tracking-wider text-left">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/70 mb-1.5 uppercase tracking-wider text-left">URL Foto Profil (Opsional)</label>
                <input 
                  type="text" 
                  value={editForm.avatar_url}
                  placeholder="https://..."
                  onChange={(e) => setEditForm({...editForm, avatar_url: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant/70 mb-1.5 uppercase tracking-wider text-left">Profil Risiko</label>
                <select 
                  value={editForm.risk_profile}
                  onChange={(e) => setEditForm({...editForm, risk_profile: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Konservatif">Konservatif (Aman & Terukur)</option>
                  <option value="Moderat">Moderat (Seimbang)</option>
                  <option value="Agresif">Agresif (Tinggi Risiko Tinggi Untung)</option>
                </select>
              </div>

              {message.text && (
                <div className={cn("p-3 rounded-xl text-xs font-semibold flex items-center gap-2", message.type === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-600')}>
                  {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-2">
                 <button 
                   onClick={handleSave}
                   disabled={isLoading}
                   className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                 >
                   {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
                 </button>
                 <button 
                   onClick={() => { setIsEditing(false); setMessage({ type: '', text: '' }); }}
                   disabled={isLoading}
                   className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-on-surface-variant font-semibold text-sm rounded-xl transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                 >
                   <X className="w-4 h-4" /> Batal
                 </button>
              </div>
            </div>
          )}
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
          onClick={() => { logout(); navigate('/'); }}
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
