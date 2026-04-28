import { motion } from 'motion/react';
import { 
  BookOpen, 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Search, 
  Filter, 
  LayoutGrid, 
  Clock, 
  ArrowRight, 
  Bot,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Star,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const modules = [
  { 
    id: 1, 
    title: 'Analisis Fundamental', 
    category: 'Dasar',
    desc: 'Memahami nilai intrinsik perusahaan melalui laporan keuangan dan model valuasi.', 
    time: '30 menit', 
    progress: 100, 
    status: 'Selesai', 
    icon: LayoutGrid,
    color: 'bg-emerald-500' 
  },
  { 
    id: 2, 
    title: 'Risk Management', 
    category: 'Strategi',
    desc: 'Strategi bertahan dan melindungi portofolio dari risiko pasar yang tidak terduga.', 
    time: '45 menit', 
    progress: 40, 
    status: 'Lanjutkan', 
    icon: Shield, 
    active: true,
    color: 'bg-primary'
  },
  { 
    id: 3, 
    title: 'Psikologi Trading', 
    category: 'Mindset',
    desc: 'Mengelola emosi dan disiplin saat menghadapi ketidakpastian pergerakan harga.', 
    time: '25 menit', 
    progress: 0, 
    status: 'Terkunci', 
    icon: Brain,
    color: 'bg-secondary'
  },
];

export default function Academy() {
  return (
    <div className="relative min-h-screen pb-16 overflow-hidden">
      {/* Dynamic Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-3"
            >
              <Zap className="w-3 h-3 fill-current" /> Learning Journey
            </motion.div>
            <h1 className="text-4xl font-black text-primary tracking-tight mb-2">InvestAI Academy</h1>
            <p className="text-on-surface-variant/70 font-medium text-base max-w-lg">
              Kurikulum terstruktur untuk membawa Anda dari pemula menjadi investor profesional.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="glass-card px-6 py-3 rounded-2xl border-white/60 flex items-center gap-4 shadow-lg shadow-primary/5">
                <div className="text-right">
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Rank</p>
                  <p className="text-lg font-black text-primary">Pro Investor</p>
                </div>
                <div className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Star className="w-6 h-6 fill-current" />
                </div>
             </div>
          </div>
        </div>

        {/* Learning Bento Section */}
        <div className="grid grid-cols-12 gap-6">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden group border-white/60 shadow-xl"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest">Ongoing</span>
                  <div className="flex items-center gap-2 text-on-surface-variant/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">45m left</span>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-primary tracking-tight mb-4">Risk Management</h2>
                <p className="text-on-surface-variant/70 max-w-sm text-sm leading-relaxed font-medium">
                  Pelajari cara membatasi kerugian dan memaksimalkan keuntungan dengan manajemen posisi yang cerdas.
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl group/btn"
              >
                <PlayCircle className="w-9 h-9 fill-current" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mb-10 relative z-10">
              <div className="flex justify-between items-end mb-3">
                <p className="text-sm font-bold text-primary">2. Menentukan Risk Reward Ratio</p>
                <p className="text-lg font-black text-secondary">40%</p>
              </div>
              <div className="w-full h-3 bg-slate-100/50 rounded-full overflow-hidden border border-white/50 backdrop-blur-sm">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>

            {/* Learning Path */}
            <div className="flex items-center justify-between relative pt-8 z-10 px-2">
              <div className="absolute top-[52px] left-0 w-full h-[2px] bg-slate-100/50 z-0 rounded-full"></div>
              {[
                { label: 'Basic', status: 'done', icon: CheckCircle2 },
                { label: 'Risk', status: 'current', icon: Zap },
                { label: 'Technical', status: 'locked', icon: Lock },
                { label: 'Advanced', status: 'locked', icon: Star },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center max-w-[80px] text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2",
                    step.status === 'done' ? "bg-emerald-500 border-emerald-50 text-white shadow-lg" : 
                    step.status === 'current' ? "bg-primary border-white text-white shadow-xl scale-110 ring-4 ring-primary/5" : 
                    "bg-white border-slate-50 text-on-surface-variant/20 shadow-sm"
                  )}>
                    <step.icon className={cn("w-5 h-5", step.status === 'current' && "animate-pulse")} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-black mt-4 uppercase tracking-widest",
                    step.status === 'locked' ? "text-on-surface-variant/20" : "text-primary"
                  )}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Curriculum Sidebar */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col border-white/60 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> Kurikulum
              </h3>
              <span className="px-2 py-0.5 bg-slate-50 text-on-surface-variant/40 rounded-full text-[9px] font-black uppercase tracking-widest">4 Pelajaran</span>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {[
                { title: 'Apa itu Manajemen Risiko?', time: '12m', status: 'done' },
                { title: 'Menentukan Risk Reward Ratio', time: '25m', status: 'active' },
                { title: 'Psychology of Loss Control', time: '18m', status: 'locked' },
                { title: 'Aplikasi Posisi Lot', time: '15m', status: 'locked' },
              ].map((lesson, i) => (
                <div key={i} className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all border cursor-pointer",
                    lesson.status === 'done' ? "bg-emerald-50/30 border-emerald-100/30" : 
                    lesson.status === 'active' ? "bg-white border-primary shadow-md" : 
                    "bg-slate-50/20 border-transparent opacity-40"
                  )}>
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    lesson.status === 'done' ? "bg-emerald-100 text-emerald-600" : 
                    lesson.status === 'active' ? "bg-primary text-white" : 
                    "bg-slate-100 text-on-surface-variant/20"
                  )}>
                    {lesson.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : 
                     lesson.status === 'active' ? <PlayCircle className="w-5 h-5" /> : 
                     <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className={cn("text-xs font-bold truncate", lesson.status === 'active' ? "text-primary" : "text-primary/70")}>{lesson.title}</p>
                     <p className="text-[9px] font-black text-on-surface-variant/30 uppercase mt-0.5">{lesson.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-white">
               <div>
                 <p className="text-[9px] font-black text-on-surface-variant/30 uppercase mb-0.5">Sisa Waktu</p>
                 <p className="text-base font-black text-primary">~45 MENIT</p>
               </div>
               <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </motion.section>
        </div>

        {/* Discovery Section */}
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-4">
            <div>
              <h3 className="text-2xl font-black text-primary tracking-tight mb-1">Explore Modul</h3>
              <p className="text-on-surface-variant/60 font-medium text-sm">Pilih jalur belajar yang paling sesuai dengan target Anda.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30" />
                  <input 
                    type="text" 
                    placeholder="Cari materi..."
                    className="pl-10 pr-6 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-primary/5 w-60 shadow-sm"
                  />
               </div>
               <button className="p-2.5 bg-white rounded-xl border border-slate-100 text-on-surface-variant hover:text-primary shadow-sm"><Filter className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={cn(
                  "glass-card p-8 rounded-[2rem] group border-white/60 flex flex-col shadow-lg shadow-primary/[0.02]",
                  mod.active && "ring-2 ring-primary bg-white/60"
                )}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110",
                    mod.color,
                    mod.status === 'Terkunci' && "grayscale opacity-40"
                  )}>
                    <mod.icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className="px-2 py-0.5 bg-slate-50 text-on-surface-variant/40 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">{mod.category}</span>
                     <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                      mod.status === 'Selesai' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                      mod.status === 'Lanjutkan' ? "bg-primary text-white" : 
                      "bg-slate-50 text-on-surface-variant/30 border border-slate-100"
                    )}>{mod.status}</span>
                  </div>
                </div>

                <h4 className="text-xl font-black text-primary mb-2 tracking-tight">{mod.title}</h4>
                <p className="text-on-surface-variant/60 text-xs leading-relaxed mb-8 font-medium line-clamp-2">{mod.desc}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest mb-3">
                    <div className="flex items-center gap-2 text-on-surface-variant/30">
                      <Clock className="w-3.5 h-3.5" /> {mod.time}
                    </div>
                    <div className={cn("font-black", mod.progress === 100 ? "text-emerald-500" : "text-primary")}>
                      {mod.progress}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100/50 rounded-full overflow-hidden border border-white">
                     <div className={cn(
                         "h-full rounded-full transition-all duration-1000",
                         mod.progress === 100 ? "bg-emerald-500" : "bg-primary"
                       )} style={{ width: `${mod.progress}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Banner */}
        <motion.section 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card bg-primary p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white border-none relative overflow-hidden shadow-xl shadow-primary/20"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 -skew-x-12 translate-x-12"></div>
          <div className="absolute left-10 bottom-0 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-inner">
              <Bot className="w-8 h-8 text-secondary" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-black mb-1 tracking-tighter">Bingung dengan Materi?</h4>
              <p className="text-white/70 text-sm font-medium leading-relaxed">Tanyakan apa saja kepada AI Mentor untuk penjelasan yang lebih personal.</p>
            </div>
          </div>
          
          <Link to="/mentorship" className="shrink-0 bg-secondary text-white px-8 py-4 rounded-xl font-black text-xs hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-secondary/20 relative z-10">
            Tanya AI Mentor <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
