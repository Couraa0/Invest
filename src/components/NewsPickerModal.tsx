import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Zap, Newspaper } from 'lucide-react';
import { cn } from '../lib/utils';
import type { StockForNews } from './NewsAnalysisModal';

const PERIOD_OPTIONS = [
  { days: 7, label: '7 Hari', desc: 'Berita minggu ini' },
  { days: 30, label: '30 Hari', desc: 'Berita bulan ini' },
  { days: 90, label: '90 Hari', desc: 'Berita 3 bulan' },
] as const;

interface NewsPickerModalProps {
  stock: StockForNews | null;
  onClose: () => void;
  onAnalyze: (days: number) => void;
}

export default function NewsPickerModal({ stock, onClose, onAnalyze }: NewsPickerModalProps) {
  const [selectedDays, setSelectedDays] = useState<7 | 30 | 90>(30);

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!stock) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Analisis Berita AI</h2>
              <p className="text-xs text-slate-500 font-medium">{stock.symbol} · {stock.name}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Pilih Periode Analisis
              </p>
              <div className="grid grid-cols-3 gap-2">
                {PERIOD_OPTIONS.map(opt => (
                  <button
                    key={opt.days}
                    onClick={() => setSelectedDays(opt.days as 7 | 30 | 90)}
                    className={cn(
                      'p-3 rounded-xl border text-center transition-all',
                      selectedDays === opt.days
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary'
                    )}
                  >
                    <p className="text-sm font-bold">{opt.label}</p>
                    <p className={cn('text-[10px] mt-0.5 font-medium', selectedDays === opt.days ? 'text-white/70' : 'text-slate-400')}>
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5"><Zap className="w-3 h-3 text-primary" /> LangGraph Agent — 6 Node Pipeline</p>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { icon: '📡', label: 'Fetch News' },
                  { icon: '🔍', label: 'Data Quality' },
                  { icon: '🗂️', label: 'Filter Articles' },
                  { icon: '🧠', label: 'Analyze Sentiment' },
                  { icon: '📝', label: 'Generate Report' },
                  { icon: '✅', label: 'Evaluate Output' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-500">
                    <span>{s.icon}</span><span>{s.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-400">Estimasi waktu: 45–90 detik · Self-healing loop aktif</p>
            </div>

            <button
              onClick={() => onAnalyze(selectedDays)}
              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm shadow-primary/20"
            >
              <Newspaper className="w-4 h-4" />
              Mulai Analisis
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
