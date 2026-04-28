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
    <div className="space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           {/* Learning Bento Section */}
      <div className="grid grid-cols-12 gap-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-[3rem] p-10 relative overflow-hidden group border-white/60 shadow-2xl shadow-primary/5"
        >
          {/* Background Elements */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-1000"></div>
          <div className="absolute left-1/4 top-1/2 w-48 h-48 bg-secondary/5 rounded-full blur-[80px]"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center justify-between mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Sedang Dipelajari</span>
                <span className="px-4 py-1.5 bg-slate-50 text-on-surface-variant/40 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">Level 2</span>
              </div>
              <h2 className="text-5xl font-black text-primary tracking-tighter mb-4">Risk Management</h2>
              <p className="text-on-surface-variant/70 max-w-md leading-relaxed font-medium">
                Kuasai teknik perlindungan modal dengan Risk/Reward ratio yang optimal dan psikologi ketenangan dalam trading.
              </p>
            </div>
            <button className="shrink-0 w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-90 transition-all group/btn">
              <PlayCircle className="w-10 h-10 fill-current group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          {/* Progress Visualizer */}
          <div className="mb-14 relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Materi Saat Ini</p>
                <p className="text-sm font-bold text-primary">2. Menentukan Risk Reward Ratio</p>
              </div>
              <p className="text-sm font-black text-secondary">40% Complete</p>
            </div>
            <div className="w-full h-4 bg-slate-100/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/40">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)]"
              />
            </div>
          </div>

          {/* Learning Path Nodes */}
          <div className="flex items-center justify-between relative pt-10 z-10 px-4">
            <div className="absolute top-[68px] left-0 w-full h-[3px] bg-slate-100/50 z-0"></div>
            {[
              { label: 'Dasar Investasi', status: 'done', icon: CheckCircle2 },
              { label: 'Risk Management', status: 'current', icon: Zap },
              { label: 'Analisis Teknikal', status: 'locked', icon: Lock },
              { label: 'Advanced Strategy', status: 'locked', icon: Star },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center max-w-[100px] text-center">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4",
                  step.status === 'done' ? "bg-emerald-500 border-emerald-50 text-white shadow-lg shadow-emerald-100" : 
                  step.status === 'current' ? "bg-primary border-white text-white shadow-2xl scale-125 ring-8 ring-primary/5" : 
                  "bg-white border-slate-50 text-on-surface-variant/20 shadow-sm"
                )}>
                  <step.icon className={cn("w-6 h-6", step.status === 'current' && "animate-pulse")} />
                </div>
                <span className={cn(
                  "text-[10px] font-black mt-6 uppercase tracking-widest",
                  step.status === 'locked' ? "text-on-surface-variant/20" : "text-primary"
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Lesson Sidebar */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4 glass-card rounded-[3rem] p-10 flex flex-col border-white/60 shadow-xl"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-primary flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-secondary" /> Kurikulum
            </h3>
            <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">4 Pelajaran</span>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[
              { title: 'Apa itu Manajemen Risiko?', time: '12m', status: 'done' },
              { title: 'Menentukan Risk Reward Ratio', time: '25m', status: 'active' },
              { title: 'Psychology of Loss Control', time: '18m', status: 'locked' },
              { title: 'Aplikasi Posisi Lot Berjenjang', time: '15m', status: 'locked' },
            ].map((lesson, i) => (
              <div key={i} className={cn(
                "group flex items-center gap-4 p-5 rounded-[2rem] transition-all border cursor-pointer",
                lesson.status === 'done' ? "bg-emerald-50/50 border-emerald-100/50" : 
                lesson.status === 'active' ? "bg-white border-primary shadow-md scale-[1.02]" : 
                "bg-slate-50/30 border-transparent opacity-40 hover:opacity-60"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  lesson.status === 'done' ? "bg-emerald-100 text-emerald-600" : 
                  lesson.status === 'active' ? "bg-primary text-white" : 
                  "bg-slate-100 text-on-surface-variant/30"
                )}>
                  {lesson.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : 
                   lesson.status === 'active' ? <PlayCircle className="w-5 h-5" /> : 
                   <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                   <p className={cn("text-sm font-bold truncate", lesson.status === 'active' ? "text-primary" : "text-primary/70")}>{lesson.title}</p>
                   <div className="flex items-center gap-2 mt-1">
                     <Clock className="w-3 h-3 text-on-surface-variant/30" />
                     <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest">{lesson.time} Video</p>
                   </div>
                </div>
                {lesson.status === 'active' && <ChevronRight className="w-4 h-4 text-primary ml-auto" />}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-white/50">
             <div>
               <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Estimasi Penyelesaian</p>
               <p className="text-xs font-black text-primary">45 MENIT LAGI</p>
             </div>
             <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
        </motion.section>
      </div>

      {/* Module Discovery */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
          <div>
            <h3 className="text-3xl font-black text-primary tracking-tight mb-2">Explore Modul Pembelajaran</h3>
            <p className="text-on-surface-variant font-medium">Pilih jalur belajar yang paling sesuai dengan kebutuhan investasi Anda.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Cari topik materi..."
                  className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-xl text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all w-64 lg:w-80"
                />
             </div>
             <button className="p-3 bg-white rounded-xl border border-slate-100 text-on-surface-variant hover:text-primary transition-colors shadow-sm"><Filter className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass-card p-10 rounded-[3rem] group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-white/40 flex flex-col",
                mod.active && "ring-2 ring-primary bg-white/60"
              )}
            >
              <div className="flex justify-between items-start mb-10">
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110",
                  mod.color,
                  mod.status === 'Terkunci' && "grayscale opacity-50"
                )}>
                  <mod.icon className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="px-3 py-1 bg-slate-50 text-on-surface-variant/40 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">{mod.category}</span>
                   <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                    mod.status === 'Selesai' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                    mod.status === 'Lanjutkan' ? "bg-primary text-white" : 
                    "bg-slate-50 text-on-surface-variant/30 border border-slate-100"
                  )}>{mod.status}</span>
                </div>
              </div>

              <h4 className="text-2xl font-black text-primary mb-3 tracking-tight">{mod.title}</h4>
              <p className="text-on-surface-variant/70 text-sm leading-relaxed mb-10 font-medium line-clamp-2">{mod.desc}</p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                  <div className="flex items-center gap-2 text-on-surface-variant/40">
                    <Clock className="w-4 h-4" /> {mod.time}
                  </div>
                  <div className={cn(
                    "font-black",
                    mod.progress === 100 ? "text-emerald-500" : "text-primary"
                  )}>
                    {mod.progress}% Progress
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-white">
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

      {/* AI Bot Enhanced Banner */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass-card bg-primary p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white border-none relative overflow-hidden shadow-2xl shadow-primary/20"
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
          Mulai Chat Mentor AI <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>
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
