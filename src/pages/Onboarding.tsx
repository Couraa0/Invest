import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Zap, ArrowRight, Brain } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';

type InvestorLevel = 'Pemula' | 'Menengah' | 'Berpengalaman';

const levels = [
  {
    id: 'Pemula',
    title: 'Investor Pemula',
    desc: 'Saya baru memulai dan ingin belajar dari dasar.',
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'Menengah',
    title: 'Investor Menengah',
    desc: 'Saya sudah pernah berinvestasi dan paham dasar pasar modal.',
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    id: 'Berpengalaman',
    title: 'Investor Berpengalaman',
    desc: 'Saya trader/investor aktif dan butuh alat analisis canggih.',
    icon: Zap,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500'
  }
];

export default function Onboarding() {
  const [selectedLevel, setSelectedLevel] = useState<InvestorLevel | null>(null);
  const { completeOnboarding } = useUser();
  const navigate = useNavigate();

  const handleComplete = () => {
    if (selectedLevel) {
      completeOnboarding(selectedLevel);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-primary/4 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-secondary/4 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-6 md:mb-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-lg shadow-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
            <Brain className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 md:mb-3 tracking-tight">Kustomisasi AI Anda</h1>
          <p className="text-sm md:text-base text-on-surface-variant/60 max-w-md mx-auto px-2">
            Bantu kami memahami tingkat pengalaman Anda agar AI Mentor bisa memberikan rekomendasi dan materi yang paling tepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-10">
          {levels.map((level, i) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedLevel(level.id as InvestorLevel)}
              className={cn(
                "p-4 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all duration-300 relative overflow-hidden group",
                selectedLevel === level.id 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02] md:scale-105" 
                  : "bg-white border border-slate-200 text-on-surface hover:border-primary/30 hover:shadow-md"
              )}
            >
              {selectedLevel === level.id && (
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              )}
              <div className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors",
                selectedLevel === level.id 
                  ? "bg-white/15" 
                  : `${level.iconBg} ${level.iconColor}`
              )}>
                <level.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2">{level.title}</h3>
              <p className={cn(
                "text-xs md:text-sm leading-relaxed",
                selectedLevel === level.id ? "text-white/80" : "text-on-surface-variant/60"
              )}>
                {level.desc}
              </p>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            disabled={!selectedLevel}
            className="btn-primary w-full max-w-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 py-3 md:py-3.5"
          >
            Lanjutkan ke Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
