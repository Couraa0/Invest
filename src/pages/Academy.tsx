import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  BarChart2,
  Shield,
  Zap,
  Bot,
  ArrowRight,
  X,
  Star,
  Users,
  GraduationCap,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useUser } from '../context/UserContext';

// ─── Data ───────────────────────────────────────────────────────────────────

interface Curriculum {
  id: string;
  title: string;
  desc: string;
  duration: string;
  youtubeId: string;
  points: string[];
}

interface Module {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  curricula: Curriculum[];
}

const MODULES: Module[] = [
  {
    id: 1,
    title: 'Modul 1',
    subtitle: 'Dasar-Dasar Investasi',
    desc: 'Bangun fondasi pemahaman investasi yang kuat. Pelajari prinsip, instrumen, dan cara mengelola risiko serta return investasi Anda.',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    curricula: [
      {
        id: '1.1',
        title: 'Mengenal Investasi',
        desc: 'Pahami apa itu investasi, mengapa investasi penting, dan bagaimana investasi dapat membantu Anda mencapai kebebasan finansial.',
        duration: '12 menit',
        youtubeId: 'lwjhOcVYlo4',
        points: [
          'Definisi dan konsep dasar investasi',
          'Perbedaan investasi vs menabung',
          'Mengapa harus mulai investasi sejak dini',
          'Pengenalan konsep bunga majemuk',
          'Mindset investor yang sukses',
        ],
      },
      {
        id: '1.2',
        title: 'Instrumen Investasi di Indonesia',
        desc: 'Kenali berbagai instrumen investasi yang tersedia di Indonesia, mulai dari saham, obligasi, reksa dana, hingga properti.',
        duration: '18 menit',
        youtubeId: 'ChKvUwICApo',
        points: [
          'Saham: kepemilikan perusahaan',
          'Obligasi: surat utang negara & korporasi',
          'Reksa dana: investasi kolektif',
          'Deposito dan pasar uang',
          'Properti dan aset riil',
          'Perbandingan risiko & return tiap instrumen',
        ],
      },
      {
        id: '1.3',
        title: 'Risiko dan Return Investasi',
        desc: 'Pelajari hubungan antara risiko dan return, serta bagaimana mengelola risiko agar portofolio Anda tetap optimal.',
        duration: '15 menit',
        youtubeId: '4KGvoy_Ke9Y',
        points: [
          'Konsep risk-return tradeoff',
          'Jenis-jenis risiko investasi',
          'Cara mengukur return investasi',
          'Diversifikasi sebagai strategi manajemen risiko',
          'Profil risiko investor: konservatif, moderat, agresif',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Modul 2',
    subtitle: 'Analisis Saham untuk Pemula',
    desc: 'Kuasai teknik analisis saham dari fundamental hingga teknikal. Pelajari cara membaca pasar dan membuat keputusan investasi yang cerdas.',
    icon: BarChart2,
    color: 'text-violet-600',
    bgColor: 'bg-violet-500',
    curricula: [
      {
        id: '2.1',
        title: 'Dasar-Dasar Pasar Modal',
        desc: 'Pahami cara kerja Bursa Efek Indonesia (BEI), mekanisme perdagangan saham, dan ekosistem pasar modal secara menyeluruh.',
        duration: '20 menit',
        youtubeId: 'a-IkdCFGUeU',
        points: [
          'Struktur dan fungsi Bursa Efek Indonesia',
          'Mekanisme perdagangan saham di BEI',
          'Peran OJK, broker, dan kustodian',
          'Cara membuka rekening saham (RDN)',
          'Mengenal indeks IHSG dan LQ45',
          'Jam trading dan aturan perdagangan',
        ],
      },
      {
        id: '2.2',
        title: 'Analisis Fundamental Saham',
        desc: 'Pelajari cara menilai nilai intrinsik perusahaan melalui laporan keuangan, rasio keuangan, dan model valuasi saham.',
        duration: '25 menit',
        youtubeId: 'O5cGx35_VN0',
        points: [
          'Membaca laporan keuangan: neraca, laba-rugi, arus kas',
          'Rasio keuangan: PER, PBV, ROE, ROA',
          'Analisis pendapatan dan profitabilitas',
          'Menghitung nilai intrinsik saham',
          'Metode Discounted Cash Flow (DCF)',
          'Kapan saham dianggap murah atau mahal',
        ],
      },
      {
        id: '2.3',
        title: 'Analisis Teknikal Dasar',
        desc: 'Kuasai dasar-dasar analisis teknikal: membaca chart, pola candlestick, indikator populer, dan menentukan entry/exit point.',
        duration: '22 menit',
        youtubeId: '0N_iqF770Xc',
        points: [
          'Membaca chart saham: bar, line, candlestick',
          'Pola candlestick: bullish & bearish reversal',
          'Support & resistance: kunci entry/exit',
          'Indikator Moving Average (MA, EMA)',
          'RSI, MACD, dan Bollinger Bands',
          'Volume sebagai konfirmasi sinyal',
        ],
      },
      {
        id: '2.4',
        title: 'Analisis Sentimen dan Berita Pasar',
        desc: 'Pahami bagaimana berita, sentimen pasar, dan faktor makroekonomi mempengaruhi pergerakan harga saham.',
        duration: '16 menit',
        youtubeId: 'HP9NJfVXHnU',
        points: [
          'Pengaruh berita korporasi terhadap harga saham',
          'Sentimen pasar: Fear & Greed Index',
          'Dampak kebijakan Bank Indonesia & The Fed',
          'Pengaruh data ekonomi makro (inflasi, GDP)',
          'Media dan sumber informasi terpercaya',
          'Menghindari jebakan FOMO dan panic selling',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Modul 3',
    subtitle: 'Strategi Investasi & Manajemen Risiko',
    desc: 'Tingkatkan kemampuan investasi ke level profesional. Pelajari cara memilih saham potensial, mengelola risiko, dan membangun portofolio yang menguntungkan.',
    icon: Shield,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    curricula: [
      {
        id: '3.1',
        title: 'Memilih Saham yang Potensial',
        desc: 'Pelajari metode screening saham berkualitas, kriteria pemilihan emiten terbaik, dan strategi menemukan hidden gem di pasar modal.',
        duration: '24 menit',
        youtubeId: 'UfidNJo9e2Y',
        points: [
          'Kriteria saham berkualitas tinggi',
          'Teknik stock screening dengan filter',
          'Analisis moat (keunggulan kompetitif)',
          'Menilai kualitas manajemen perusahaan',
          'Sektor yang menarik di Indonesia',
          'Strategi menemukan undervalued stocks',
        ],
      },
      {
        id: '3.2',
        title: 'Manajemen Risiko Investasi',
        desc: 'Kuasai teknik-teknik manajemen risiko profesional untuk melindungi modal dan memaksimalkan keuntungan jangka panjang.',
        duration: '20 menit',
        youtubeId: 'P1bWwi9yyYc',
        points: [
          'Konsep position sizing yang tepat',
          'Risk/Reward ratio dan cara menghitungnya',
          'Stop loss: kapan dan bagaimana menggunakannya',
          'Diversifikasi portofolio antar sektor',
          'Rebalancing portofolio secara berkala',
          'Psikologi dalam menghadapi kerugian',
        ],
      },
      {
        id: '3.3',
        title: 'Membangun Portofolio Investasi',
        desc: 'Pelajari cara merancang dan mengelola portofolio investasi yang sesuai profil risiko dan tujuan keuangan jangka panjang Anda.',
        duration: '28 menit',
        youtubeId: 'J0Kpg65iOro',
        points: [
          'Menentukan alokasi aset yang optimal',
          'Strategi Dollar Cost Averaging (DCA)',
          'Membangun portofolio inti (core portfolio)',
          'Strategi satelit untuk pertumbuhan agresif',
          'Monitoring dan evaluasi portofolio',
          'Rencana investasi 1, 3, dan 5 tahun',
        ],
      },
    ],
  },
];

// ─── YouTube Modal ───────────────────────────────────────────────────────────

function VideoModal({ 
  videoId, 
  title, 
  onClose,
  isWatched,
  onMarkWatched,
  isMarking
}: { 
  videoId: string; 
  title: string; 
  onClose: () => void;
  isWatched: boolean;
  onMarkWatched: () => void;
  isMarking: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 w-full">
              <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center shrink-0">
                <PlayCircle className="w-4 h-4 text-white fill-white" />
              </div>
              <p className="font-bold text-sm text-primary truncate flex-1">{title}</p>
              
              {!isWatched ? (
                <button
                  onClick={onMarkWatched}
                  disabled={isMarking}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isMarking ? 'Loading...' : 'Tandai Selesai'}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                </div>
              )}

              <button
                onClick={onClose}
                className="p-1.5 ml-2 rounded-lg hover:bg-slate-100 text-on-surface-variant transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Curriculum Item ─────────────────────────────────────────────────────────

function CurriculumItem({ curriculum, moduleColor, onPlay, isWatched }: {
  key?: React.Key;
  curriculum: Curriculum;
  moduleColor: string;
  onPlay: (curriculum: Curriculum) => void;
  isWatched: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("border rounded-xl overflow-hidden bg-white hover:shadow-sm transition-all",
      isWatched ? "border-emerald-200" : "border-slate-100 hover:border-slate-200"
    )}>
      {/* Header Row */}
      <button
        className="w-full flex items-center gap-4 p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Thumbnail */}
        <div
          className="relative shrink-0 w-20 h-12 sm:w-24 sm:h-14 rounded-lg overflow-hidden bg-slate-100 group cursor-pointer"
          onClick={e => { e.stopPropagation(); onPlay(curriculum); }}
        >
          <img
            src={`https://img.youtube.com/vi/${curriculum.youtubeId}/mqdefault.jpg`}
            alt={curriculum.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-7 h-7 text-white fill-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md border whitespace-nowrap',
              isWatched ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
              moduleColor === 'text-blue-600' ? 'text-blue-600 bg-blue-50 border-blue-100' :
              moduleColor === 'text-violet-600' ? 'text-violet-600 bg-violet-50 border-violet-100' :
              'text-emerald-600 bg-emerald-50 border-emerald-100'
            )}>
              Kurikulum {curriculum.id}
            </span>
            {isWatched && (
              <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500 text-white whitespace-nowrap shadow-sm">
                <CheckCircle2 className="w-2.5 h-2.5" /> Selesai
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-primary leading-snug line-clamp-2 mt-1">{curriculum.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-on-surface-variant/40" />
            <span className="text-[10px] text-on-surface-variant/50 font-medium whitespace-nowrap">{curriculum.duration}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={cn('shrink-0 transition-transform duration-200 ml-1', expanded && 'rotate-180')}>
          <ChevronDown className="w-4 h-4 text-on-surface-variant/40" />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-slate-50">
              <p className="text-xs text-on-surface-variant/60 leading-relaxed mb-3 mt-3">
                {curriculum.desc}
              </p>
              <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider mb-2">
                Yang akan dipelajari:
              </p>
              <ul className="space-y-1.5">
                {curriculum.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                    <span className="text-xs text-on-surface-variant/70">{point}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onPlay(curriculum)}
                className="mt-4 w-full py-2.5 bg-primary text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <PlayCircle className="w-4 h-4" /> Tonton Sekarang
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Module Card ─────────────────────────────────────────────────────────────

function ModuleCard({ module, index, onPlay, watchedVideos }: {
  key?: React.Key;
  module: Module;
  index: number;
  onPlay: (curriculum: Curriculum) => void;
  watchedVideos: string[];
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = module.icon;
  const totalDuration = module.curricula.reduce((acc, c) => {
    const min = parseInt(c.duration);
    return acc + min;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card rounded-2xl overflow-hidden"
    >
      {/* Module Header */}
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md', module.bgColor)}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 w-full overflow-x-auto no-scrollbar pb-0.5">
            <span className={cn('text-[10px] font-bold uppercase tracking-wider shrink-0', module.color)}>
              {module.title}
            </span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[9px] font-bold shrink-0">
              {module.curricula.length} Kurikulum
            </span>
            <span className="px-1.5 py-0.5 bg-slate-100 text-on-surface-variant/50 rounded-md text-[9px] font-bold flex items-center gap-1 shrink-0">
              <Clock className="w-2.5 h-2.5" /> {totalDuration}m
            </span>
          </div>
          <h3 className="text-base font-bold text-primary">{module.subtitle}</h3>
          <p className="text-xs text-on-surface-variant/50 mt-0.5 line-clamp-1">{module.desc}</p>
        </div>

        {/* Expand Icon */}
        <div className={cn('shrink-0 transition-transform duration-300', expanded && 'rotate-180')}>
          <ChevronDown className="w-5 h-5 text-on-surface-variant/40" />
        </div>
      </button>

      {/* Curricula List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-slate-50 space-y-3">
              <p className="text-xs text-on-surface-variant/60 leading-relaxed pt-3">
                {module.desc}
              </p>
              {module.curricula.map(curriculum => (
                <CurriculumItem
                  key={curriculum.id}
                  curriculum={curriculum}
                  moduleColor={module.color}
                  onPlay={onPlay}
                  isWatched={watchedVideos.includes(curriculum.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Academy() {
  const { user } = useUser();
  const [activeVideo, setActiveVideo] = useState<Curriculum | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    if (user) {
      api.academy.getWatched(user.id).then(setWatchedVideos).catch(console.error);
    }
  }, [user]);

  const handleMarkWatched = async (videoId: string) => {
    if (!user || watchedVideos.includes(videoId)) return;
    setIsMarking(true);
    try {
      await api.academy.markWatched(user.id, videoId);
      setWatchedVideos(prev => [...prev, videoId]);
    } catch (err) {
      console.error('Failed to mark as watched', err);
    } finally {
      setIsMarking(false);
    }
  };

  const totalCurricula = MODULES.reduce((acc, m) => acc + m.curricula.length, 0);
  const totalMinutes = MODULES.reduce((acc, m) =>
    acc + m.curricula.reduce((a, c) => a + parseInt(c.duration), 0), 0);

  return (
    <>
      {/* Video Modal */}
      {activeVideo && (
        <VideoModal
          videoId={activeVideo.youtubeId}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
          isWatched={watchedVideos.includes(activeVideo.id)}
          onMarkWatched={() => handleMarkWatched(activeVideo.id)}
          isMarking={isMarking}
        />
      )}

      <div className="space-y-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 border border-secondary/12 text-secondary text-[10px] font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3 h-3" /> Learning Journey
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">InvestAI Academy</h1>
            <p className="text-sm text-on-surface-variant/60 mt-1 max-w-lg">
              Kurikulum terstruktur dengan video pembelajaran dari investor & praktisi terpercaya.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            {[
              { icon: BookOpen, label: 'Modul', value: `${MODULES.length}`, color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: PlayCircle, label: 'Video', value: `${totalCurricula}`, color: 'text-violet-600', bg: 'bg-violet-50' },
              { icon: Clock, label: 'Durasi', value: `${Math.round(totalMinutes / 60)}j ${totalMinutes % 60}m`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((stat, i) => (
              <div key={i} className="card p-2 sm:px-3 sm:py-2.5 rounded-xl text-center flex flex-col items-center justify-center min-w-0">
                <div className={cn('w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center mb-1 shrink-0', stat.bg)}>
                  <stat.icon className={cn('w-3 h-3 sm:w-3.5 sm:h-3.5', stat.color)} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary truncate w-full">{stat.value}</p>
                <p className="text-[9px] text-on-surface-variant/50 font-medium truncate w-full">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-secondary p-6 text-white"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-20 w-40 h-40 bg-secondary/20 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Jalur Belajar Lengkap</span>
              </div>
              <h2 className="text-xl font-bold mb-1">Dari Nol Hingga Investor Profesional</h2>
              <p className="text-sm text-white/70 max-w-md">
                3 modul komprehensif · 10 video pembelajaran · Materi dari fundamental sampai strategi portofolio
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-xs text-white/70">Cocok untuk pemula</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Target className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-xs text-white/70">Kurikulum terstruktur</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm font-bold">{totalCurricula} Kurikulum</span>
              </div>
              <button
                onClick={() => setActiveVideo(MODULES[0].curricula[0])}
                className="flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-all active:scale-[0.98] shadow-lg"
              >
                <PlayCircle className="w-4 h-4" /> Mulai Belajar
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Module List ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-primary">Kurikulum Lengkap</h2>
              <p className="text-xs text-on-surface-variant/50 mt-0.5">Klik modul untuk melihat materi, klik thumbnail untuk menonton video</p>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant/50 text-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>{MODULES.length} Modul</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>{totalCurricula} Video</span>
            </div>
          </div>

          <div className="space-y-4">
            {MODULES.map((module, i) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={i}
                onPlay={setActiveVideo}
                watchedVideos={watchedVideos}
              />
            ))}
          </div>
        </div>

        {/* ── AI Mentor Banner ── */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-primary p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/4 skew-x-[-12deg] translate-x-8 pointer-events-none" />
          <div className="absolute left-20 bottom-0 w-24 h-24 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/15 shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold mb-0.5">Ada Pertanyaan tentang Materi?</h4>
              <p className="text-sm text-white/60">Diskusikan langsung dengan AI Mentor untuk penjelasan yang personal & mendalam.</p>
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
    </>
  );
}
