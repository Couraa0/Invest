import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/utils';

interface InvestorLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LevelOption = {
  id: 'Pemula' | 'Menengah' | 'Berpengalaman';
  title: string;
  description: string;
};

const levels: LevelOption[] = [
  {
    id: 'Pemula',
    title: 'Pemula',
    description: 'Saya belum pernah berinvestasi dan ingin belajar dari nol.',
  },
  {
    id: 'Menengah',
    title: 'Menengah',
    description: 'Saya mengerti konsep dasar dan sudah memiliki beberapa aset.',
  },
  {
    id: 'Berpengalaman',
    title: 'Berpengalaman',
    description: 'Saya aktif melakukan transaksi dan memahami analisis teknikal/fundamental.',
  },
];

export default function InvestorLevelModal({ isOpen, onClose }: InvestorLevelModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<'Pemula' | 'Menengah' | 'Berpengalaman'>('Menengah');
  const { setInvestorLevel } = useUser();
  const navigate = useNavigate();

  const handleContinue = () => {
    setInvestorLevel(selectedLevel);
    onClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50">
              <span className="text-lg font-black text-primary tracking-tighter">InvestAI</span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {/* Info Box */}
              <div className="bg-[#f3f9ff] rounded-2xl p-4 mb-8 flex items-center gap-4 border border-blue-50/50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <p className="text-[13px] text-[#4a5568] leading-relaxed font-semibold">
                  Jawaban Anda membantu kami menyesuaikan pengalaman belajar dan rekomendasi investasi.
                </p>
              </div>

              {/* Title Area */}
              <div className="mb-8">
                <h2 className="text-2xl font-black text-primary mb-1 tracking-tight">Pengalaman Investasi</h2>
                <p className="text-sm text-on-surface-variant font-medium">Seberapa jauh Anda mengenal pasar modal?</p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-10">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 group",
                      selectedLevel === level.id
                        ? "border-primary bg-primary/[0.01] shadow-md shadow-primary/5"
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                      selectedLevel === level.id
                        ? "border-primary bg-white"
                        : "border-slate-200 group-hover:border-slate-300"
                    )}>
                      {selectedLevel === level.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className={cn(
                        "font-black text-sm mb-0.5 transition-colors",
                        selectedLevel === level.id ? "text-primary" : "text-slate-700"
                      )}>
                        {level.title}
                      </h4>
                      <p className="text-[12px] text-on-surface-variant font-medium leading-relaxed">
                        {level.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleContinue}
                  className="bg-primary text-white px-8 py-3.5 rounded-xl text-base font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  Selanjutnya <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
