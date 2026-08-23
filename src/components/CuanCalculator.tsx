import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CuanCalculator() {
  const navigate = useNavigate();
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(2000000); // 2 Juta IDR default
  const [years, setYears] = useState<number>(5); // 5 Tahun default
  const [targetYield, setTargetYield] = useState<number>(20); // 20% CAGR default

  const months = years * 12;
  const totalPrincipal = monthlyDeposit * months;

  // AI Stock Portfolio compound interest calculation
  const monthlyRateAI = targetYield / 100 / 12;
  const aiTotalWealth = Math.round(
    monthlyDeposit * ((Math.pow(1 + monthlyRateAI, months) - 1) / monthlyRateAI) * (1 + monthlyRateAI)
  );

  // Traditional Savings (~2.5% p.a.)
  const monthlyRateBank = 0.025 / 12;
  const bankTotalWealth = Math.round(
    monthlyDeposit * ((Math.pow(1 + monthlyRateBank, months) - 1) / monthlyRateBank) * (1 + monthlyRateBank)
  );

  const totalGainAI = aiTotalWealth - totalPrincipal;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,35,111,0.07)] relative overflow-hidden text-slate-900">
      {/* Background glow effects */}
      <div className="absolute -top-20 -left-20 w-64 h-64 sm:w-80 sm:h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left: Controls */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
              <Calculator className="w-3.5 h-3.5" /> Simulasi Pertumbuhan Saham Indonesia
            </div>
            <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
              Kalkulator Potensi <span className="text-emerald-600">Cuan Saham Anda</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed font-medium">
              Lihat perbedaan pertumbuhan kekayaan Anda saat menggunakan strategi saham IDX teroptimasi AI dibanding tabungan biasa.
            </p>
          </div>

          {/* Slider 1: Monthly Deposit */}
          <div className="space-y-2.5 sm:space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold flex-wrap gap-1">
              <span className="text-slate-700">Setoran Rutin Bulanan</span>
              <span className="text-emerald-700 font-mono text-sm sm:text-base font-bold">
                {formatRupiah(monthlyDeposit)}
              </span>
            </div>
            <input
              type="range"
              min={200000}
              max={20000000}
              step={100000}
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-x"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
              <span>Rp 200 Rb</span>
              <span>Rp 10 Juta</span>
              <span>Rp 20 Juta</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div className="space-y-2.5 sm:space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold flex-wrap gap-1">
              <span className="text-slate-700">Jangka Waktu Investasi</span>
              <span className="text-primary font-mono text-sm sm:text-base font-bold">{years} Tahun</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary touch-pan-x"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
              <span>1 Tahun</span>
              <span>5 Tahun</span>
              <span>10 Tahun</span>
              <span>15 Tahun</span>
            </div>
          </div>

          {/* Slider 3: Target Yield */}
          <div className="space-y-2.5 sm:space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold flex-wrap gap-1">
              <span className="text-slate-700">Target Imbal Hasil (CAGR)</span>
              <span className="text-teal-700 font-mono text-sm sm:text-base font-bold">+{targetYield}% / thn</span>
            </div>
            <input
              type="range"
              min={8}
              max={35}
              step={1}
              value={targetYield}
              onChange={(e) => setTargetYield(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600 touch-pan-x"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono font-medium">
              <span>8% (Konservatif)</span>
              <span>20% (AI)</span>
              <span>35% (Aggressive)</span>
            </div>
          </div>
        </div>

        {/* Right: Results Card (Mobile-friendly responsive sizes) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-primary via-[#002B85] to-primary p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-primary/20 shadow-2xl space-y-5 sm:space-y-6 flex flex-col justify-between text-white">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-300">
              Estimasi Portofolio Akhir ({years} Thn)
            </span>
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight mt-1">
              {formatRupiah(aiTotalWealth)}
            </div>

            <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              <TrendingUp className="w-4 h-4" /> Keuntungan: +{formatRupiah(totalGainAI)}
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 border-y border-white/10 py-3.5 sm:py-4">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Total Modal Disetor:</span>
              <span className="text-white font-mono font-semibold">{formatRupiah(totalPrincipal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Jika Di Simpan Di Bank (2.5%):</span>
              <span className="text-rose-300 font-mono font-semibold">{formatRupiah(bankTotalWealth)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold pt-2 border-t border-white/10">
              <span className="text-emerald-300">Selisih Ekstra Cuan AI:</span>
              <span className="text-emerald-300 font-mono text-xs sm:text-sm">+{formatRupiah(aiTotalWealth - bankTotalWealth)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] sm:text-[11px] text-white/70 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Perhitungan berdasarkan algoritma majemuk (compound interest).
            </p>
            <button
              onClick={() => navigate('/signals')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
            >
              Mulai Portofolio AI Sekarang <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
