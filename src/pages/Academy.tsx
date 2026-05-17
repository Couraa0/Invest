import { motion } from 'motion/react';
import { 
  BookOpen, 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Search, 
  Clock, 
  ArrowRight, 
  Bot,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Star,
  Filter,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const modules = [
  { 
    id: 1, 
    title: 'Analisis Fundamental', 
    category: 'Dasar',
    desc: 'Pahami nilai intrinsik perusahaan melalui laporan keuangan dan model valuasi.', 
    time: '30 menit', 
    progress: 100, 
    status: 'Selesai', 
    icon: LayoutGrid,
    colorClass: 'bg-emerald-500 text-white'
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
    colorClass: 'bg-primary text-white'
  },
  { 
    id: 3, 
    title: 'Psikologi Trading', 
    category: 'Mindset',
    desc: 'Kelola emosi dan disiplin saat menghadapi ketidakpastian pergerakan harga.', 
    time: '25 menit', 
    progress: 0, 
    status: 'Terkunci', 
    icon: Brain,
    colorClass: 'bg-secondary text-white'
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

export default function Academy() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 border border-secondary/12 text-secondary text-[10px] font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3 h-3 fill-current" /> Learning Journey
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">InvestAI Academy</h1>
          <p className="text-sm text-on-surface-variant/60 mt-1 max-w-lg">
            Kurikulum terstruktur untuk membawa Anda dari pemula menjadi investor profesional.
          </p>
        </div>
        <div className="card px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center text-white shadow-sm">
            <Star className="w-4 h-4 fill-current" />
          </div>
          <div>
            <p className="stat-label">Rank</p>
            <p className="text-sm font-bold text-primary">Pro Investor</p>
          </div>
        </div>
      </motion.div>

      {/* Active Module + Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Module Hero */}
        <motion.section
          custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-8 card rounded-2xl p-6 relative overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/4 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between mb-6 relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">Ongoing</span>
                <div className="flex items-center gap-1.5 text-on-surface-variant/50">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">45m tersisa</span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-primary tracking-tight mb-1">Risk Management</h2>
              <p className="text-sm text-on-surface-variant/60 max-w-sm">
                Pelajari cara membatasi kerugian dan memaksimalkan keuntungan dengan posisi yang cerdas.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25"
            >
              <PlayCircle className="w-7 h-7 fill-current" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-xs font-semibold text-primary">2. Menentukan Risk Reward Ratio</p>
              <p className="text-sm font-bold text-secondary">40%</p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              />
            </div>
          </div>

          {/* Learning Path */}
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-px bg-slate-100" />
            <div className="flex items-start justify-between relative">
              {[
                { label: 'Basic', status: 'done', icon: CheckCircle2 },
                { label: 'Risk', status: 'current', icon: Zap },
                { label: 'Technical', status: 'locked', icon: Lock },
                { label: 'Advanced', status: 'locked', icon: Star },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                    step.status === 'done'
                      ? "bg-emerald-500 border-emerald-100 text-white shadow-md"
                      : step.status === 'current'
                        ? "bg-primary border-white text-white shadow-lg shadow-primary/20 scale-110 ring-4 ring-primary/8"
                        : "bg-white border-slate-100 text-on-surface-variant/25 shadow-sm"
                  )}>
                    <step.icon className={cn("w-4 h-4", step.status === 'current' && "animate-pulse")} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider",
                    step.status === 'locked' ? "text-on-surface-variant/25" : "text-primary"
                  )}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Curriculum Sidebar */}
        <motion.section
          custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="lg:col-span-4 card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-bold text-primary">Kurikulum</h3>
            </div>
            <span className="px-2 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[9px] font-bold uppercase tracking-wider">4 Pelajaran</span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {[
              { title: 'Apa itu Manajemen Risiko?', time: '12m', status: 'done' },
              { title: 'Menentukan Risk Reward Ratio', time: '25m', status: 'active' },
              { title: 'Psychology of Loss Control', time: '18m', status: 'locked' },
              { title: 'Aplikasi Posisi Lot', time: '15m', status: 'locked' },
            ].map((lesson, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all border cursor-pointer",
                  lesson.status === 'done'
                    ? "bg-emerald-50/60 border-emerald-100/60"
                    : lesson.status === 'active'
                      ? "bg-white border-primary/20 shadow-sm shadow-primary/8"
                      : "bg-slate-50/40 border-transparent opacity-40"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  lesson.status === 'done' ? "bg-emerald-100 text-emerald-600" :
                  lesson.status === 'active' ? "bg-primary text-white" :
                  "bg-slate-100 text-on-surface-variant/25"
                )}>
                  {lesson.status === 'done' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   lesson.status === 'active' ? <PlayCircle className="w-4 h-4" /> :
                   <Lock className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-semibold truncate", lesson.status === 'active' ? "text-primary" : "text-primary/70")}>{lesson.title}</p>
                  <p className="stat-label mt-0.5">{lesson.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="stat-label mb-0.5">Sisa Waktu</p>
              <p className="text-sm font-bold text-primary">~45 Menit</p>
            </div>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
        </motion.section>
      </div>

      {/* Module Discovery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-primary">Explore Modul</h3>
            <p className="text-xs text-on-surface-variant/50 mt-0.5">Pilih jalur belajar yang sesuai target Anda</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/30" />
              <input
                type="text"
                placeholder="Cari materi..."
                className="input-field pl-9 text-xs py-2 w-52"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-on-surface-variant hover:text-primary transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              custom={i + 2} variants={fadeUp} initial="hidden" animate="visible"
              whileHover={{ y: -3 }}
              className={cn(
                "card p-5 rounded-2xl group cursor-pointer flex flex-col",
                mod.active && "ring-2 ring-primary/15"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105",
                  mod.colorClass,
                  mod.status === 'Terkunci' && "grayscale opacity-40"
                )}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[8px] font-bold uppercase tracking-wider">{mod.category}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider",
                    mod.status === 'Selesai' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    mod.status === 'Lanjutkan' ? "bg-primary text-white" :
                    "bg-slate-100 text-on-surface-variant/40"
                  )}>{mod.status}</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-primary mb-1 tracking-tight">{mod.title}</h4>
              <p className="text-xs text-on-surface-variant/50 leading-relaxed mb-4 flex-1 line-clamp-2">{mod.desc}</p>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 stat-label">
                    <Clock className="w-3 h-3" /> {mod.time}
                  </div>
                  <span className={cn("text-xs font-bold", mod.progress === 100 ? "text-emerald-500" : "text-primary")}>{mod.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", mod.progress === 100 ? "bg-emerald-500" : "bg-primary")}
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Banner */}
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl bg-primary p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-white relative overflow-hidden"
      >
        {/* Decorative shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/4 skew-x-[-12deg] translate-x-8 pointer-events-none" />
        <div className="absolute left-20 bottom-0 w-24 h-24 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/15 shrink-0">
            <Bot className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h4 className="text-base font-bold mb-0.5">Bingung dengan Materi?</h4>
            <p className="text-sm text-white/60">Tanyakan apa saja kepada AI Mentor untuk penjelasan personal.</p>
          </div>
        </div>

        <Link
          to="/mentorship"
          className="shrink-0 bg-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-secondary/90 active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-secondary/20 relative z-10"
        >
          Tanya AI Mentor <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.section>
    </div>
  );
}
