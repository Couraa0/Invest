import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, TrendingUp, Zap, ArrowRight, Brain, Check, X, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';

export type InvestorLevel = 'Pemula' | 'Menengah' | 'Berpengalaman';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onComplete?: (level: InvestorLevel) => void;
  isDismissable?: boolean;
}

const levelOptions = [
  {
    id: 'Pemula' as InvestorLevel,
    title: 'Pemula',
    subtitle: 'Investor Pemula',
    riskTag: 'Konservatif · Aman & Terukur',
    desc: 'Saya baru memulai dan ingin mempelajari dasar-dasar pasar modal & cara berinvestasi secara terukur.',
    icon: Shield,
    accentColor: 'emerald',
    cardBorder: 'hover:border-emerald-500/50',
    selectedBg: 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-emerald-500/25',
    iconBg: 'bg-emerald-50 text-emerald-600',
    features: [
      'Pengenalan dasar saham & mekanisme IHSG',
      'Manajemen risiko dasar & diversifikasi modal',
      'Panduan AI Mentor dengan penjelasan ramah pemula'
    ]
  },
  {
    id: 'Menengah' as InvestorLevel,
    title: 'Menengah',
    subtitle: 'Investor Menengah',
    riskTag: 'Moderat · Bertumbuh',
    desc: 'Saya sudah paham dasar pasar modal dan ingin menguasai analisis teknikal, laporan keuangan & swing trading.',
    icon: TrendingUp,
    accentColor: 'blue',
    cardBorder: 'hover:border-blue-500/50',
    selectedBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/25',
    iconBg: 'bg-blue-50 text-blue-600',
    features: [
      'Analisis rasio keuangan & laporan emiten BEI',
      'Indikator teknikal (MACD, RSI, Moving Averages)',
      'Strategi Swing Trading & Position Trading'
    ]
  },
  {
    id: 'Berpengalaman' as InvestorLevel,
    title: 'Berpengalaman',
    subtitle: 'Investor Berpengalaman',
    riskTag: 'Agresif · Dinamis',
    desc: 'Saya trader/investor aktif yang memerlukan analisis makroekonomi, valuasi DCF lanjutan & rebalancing portofolio.',
    icon: Zap,
    accentColor: 'purple',
    cardBorder: 'hover:border-purple-500/50',
    selectedBg: 'bg-gradient-to-br from-purple-600 to-violet-800 text-white shadow-purple-500/25',
    iconBg: 'bg-purple-50 text-purple-600',
    features: [
      'Valuasi intrinsik DCF (Discounted Cash Flow)',
      'Multi-timeframe analysis & rotasi sektoral makro',
      'Manajemen portofolio tingkat lanjut & Sharpe Ratio'
    ]
  }
];

export default function QuestionnaireModal({
  isOpen,
  onClose,
  onComplete,
  isDismissable = true
}: QuestionnaireModalProps) {
  const { investorLevel, completeOnboarding } = useUser();
  const [selectedLevel, setSelectedLevel] = useState<InvestorLevel>(investorLevel || 'Pemula');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding(selectedLevel);
      if (onComplete) onComplete(selectedLevel);
      if (onClose) onClose();
    } catch (err) {
      console.error('Failed to submit level questionnaire:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { if (isDismissable && onClose) onClose(); }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary via-[#002B85] to-slate-900 px-6 sm:px-8 py-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Brain className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 fill-emerald-300" /> Sinkronisasi AI & Academy
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Pilih Tingkat Pemahaman Anda
                  </h2>
                </div>
              </div>

              {isDismissable && onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="relative z-10 text-slate-300 text-xs sm:text-sm font-medium mt-3 leading-relaxed">
              Tingkat pemahaman ini akan menyelaraskan rekomendasi AI, modul <strong className="text-white">Academy</strong>, serta indikator strategi pada <strong className="text-white">Dashboard</strong> Anda.
            </p>
          </div>

          {/* Body Options */}
          <div className="p-6 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {levelOptions.map((opt) => {
                const isSelected = selectedLevel === opt.id;
                const Icon = opt.icon;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedLevel(opt.id)}
                    className={cn(
                      "flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group cursor-pointer",
                      isSelected
                        ? `${opt.selectedBg} shadow-lg border-transparent scale-[1.02]`
                        : `bg-slate-50/70 border-slate-200/90 hover:bg-white ${opt.cardBorder} hover:shadow-md text-slate-800`
                    )}
                  >
                    {/* Top Row: Icon + Checkmark */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          isSelected ? "bg-white/20 text-white" : opt.iconBg
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                            <Check className="w-4 h-4 text-white stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base mb-0.5">{opt.subtitle}</h3>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider block mb-2",
                        isSelected ? "text-white/80" : "text-slate-500"
                      )}>
                        {opt.riskTag}
                      </span>

                      <p className={cn(
                        "text-xs leading-relaxed mb-4",
                        isSelected ? "text-white/90" : "text-slate-600"
                      )}>
                        {opt.desc}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className={cn(
                      "pt-3 border-t text-[11px] space-y-1.5",
                      isSelected ? "border-white/20 text-white/90" : "border-slate-200/80 text-slate-500"
                    )}>
                      {opt.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <Check className={cn(
                            "w-3.5 h-3.5 shrink-0 mt-0.5",
                            isSelected ? "text-emerald-300" : "text-emerald-600"
                          )} />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Anda dapat mengubah tingkat pemahaman kapan saja melalui Dashboard atau Academy.
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan & Sinkronkan <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
