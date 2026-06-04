import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Target, TrendingUp, BarChart2, PiggyBank, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  onClose: () => void;
}

type TabType = 'pnl' | 'mm' | 'avg' | 'val' | 'comp';

export default function CalculatorModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('pnl');

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'pnl', label: 'Profit & Loss', icon: Calculator },
    { id: 'mm', label: 'Position Sizing', icon: Target },
    { id: 'avg', label: 'Average Down', icon: TrendingUp },
    { id: 'val', label: 'Rasio Valuasi', icon: BarChart2 },
    { id: 'comp', label: 'Compounding', icon: PiggyBank },
  ];

  return (
    <motion.div
      key="calc-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white md:rounded-2xl w-full md:border md:border-slate-100 flex flex-col min-h-[calc(100vh-160px)] md:shadow-sm overflow-hidden"
    >
        {/* Header */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-100 shrink-0 gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Kalkulator Saham</h2>
              <p className="text-xs text-on-surface-variant/60 font-medium">Pilih kalkulator sesuai dengan kebutuhan analisis Anda</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Sidebar / Tabs */}
          <div className="lg:w-64 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 shrink-0 p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto flex-wrap lg:flex-nowrap">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-semibold transition-all shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal text-left',
                  activeTab === t.id
                    ? 'bg-white text-primary shadow-sm border border-slate-200/60'
                    : 'text-on-surface-variant/60 hover:bg-slate-200/50 hover:text-on-surface-variant bg-slate-200/20 lg:bg-transparent'
                )}
              >
                <t.icon className={cn('w-4 h-4', activeTab === t.id ? 'text-primary' : 'text-on-surface-variant/40')} />
                <span className="flex-1">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Calculator Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
            <AnimatePresence mode="wait">
              {activeTab === 'pnl' && <CalcPnL key="pnl" />}
              {activeTab === 'mm' && <CalcMM key="mm" />}
              {activeTab === 'avg' && <CalcAvg key="avg" />}
              {activeTab === 'val' && <CalcVal key="val" />}
              {activeTab === 'comp' && <CalcComp key="comp" />}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
  );
}

// ─── Number Formatter ────────────────────────────────────────────────────────

const formatNum = (num: number) => new Intl.NumberFormat('id-ID').format(num);

// ─── 1. Profit & Loss Calculator ─────────────────────────────────────────────

function CalcPnL() {
  const [buyPrice, setBuyPrice] = useState<number | ''>('');
  const [sellPrice, setSellPrice] = useState<number | ''>('');
  const [lots, setLots] = useState<number | ''>('');
  const [buyFee, setBuyFee] = useState<number>(0.15);
  const [sellFee, setSellFee] = useState<number>(0.25);

  const buy = Number(buyPrice) || 0;
  const sell = Number(sellPrice) || 0;
  const shares = (Number(lots) || 0) * 100;

  const grossBuy = buy * shares;
  const grossSell = sell * shares;
  
  const feeBuyRp = grossBuy * (buyFee / 100);
  const feeSellRp = grossSell * (sellFee / 100);
  
  const netBuy = grossBuy + feeBuyRp;
  const netSell = grossSell - feeSellRp;
  
  const netProfit = netSell - netBuy;
  const returnPct = netBuy > 0 ? (netProfit / netBuy) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2"><Calculator className="w-5 h-5"/> Profit & Loss</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input label="Harga Beli (Rp)" value={buyPrice} onChange={setBuyPrice} type="number" />
          <Input label="Harga Jual (Rp)" value={sellPrice} onChange={setSellPrice} type="number" />
          <Input label="Jumlah Lot" value={lots} onChange={setLots} type="number" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fee Beli (%)" value={buyFee} onChange={setBuyFee} type="number" step="0.01" />
            <Input label="Fee Jual (%)" value={sellFee} onChange={setSellFee} type="number" step="0.01" />
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Hasil Perhitungan</h4>
          <ResultRow label="Total Beli (Kotor)" value={`Rp ${formatNum(grossBuy)}`} />
          <ResultRow label="Total Jual (Kotor)" value={`Rp ${formatNum(grossSell)}`} />
          <ResultRow label="Fee Beli + Jual" value={`Rp ${formatNum(feeBuyRp + feeSellRp)}`} className="text-error" />
          <div className="pt-4 border-t border-slate-200">
            <ResultRow label="Net Profit / Loss" value={`Rp ${formatNum(netProfit)}`} className={netProfit >= 0 ? 'text-secondary font-bold text-lg' : 'text-error font-bold text-lg'} />
            <ResultRow label="Return Bersih" value={`${netProfit >= 0 ? '+' : ''}${returnPct.toFixed(2)}%`} className={netProfit >= 0 ? 'text-secondary font-bold' : 'text-error font-bold'} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 2. Position Sizing Calculator ───────────────────────────────────────────

function CalcMM() {
  const [capital, setCapital] = useState<number | ''>('');
  const [riskPct, setRiskPct] = useState<number | ''>(2);
  const [buyPrice, setBuyPrice] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  const cap = Number(capital) || 0;
  const rPct = Number(riskPct) || 0;
  const buy = Number(buyPrice) || 0;
  const sl = Number(stopLoss) || 0;

  const riskRp = cap * (rPct / 100);
  const riskPerShare = buy - sl;
  
  let maxShares = 0;
  if (riskPerShare > 0) {
    maxShares = Math.floor(riskRp / riskPerShare);
  }
  const maxLots = Math.floor(maxShares / 100);
  const positionSize = maxLots * 100 * buy;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2"><Target className="w-5 h-5"/> Position Sizing (Money Management)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input label="Total Modal (Rp)" value={capital} onChange={setCapital} type="number" />
          <Input label="Risiko per Trade (%)" value={riskPct} onChange={setRiskPct} type="number" step="0.1" />
          <Input label="Harga Beli (Rp)" value={buyPrice} onChange={setBuyPrice} type="number" />
          <Input label="Harga Stop Loss (Rp)" value={stopLoss} onChange={setStopLoss} type="number" />
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Sizing yang Disarankan</h4>
          <ResultRow label="Risiko Maksimal" value={`Rp ${formatNum(riskRp)}`} className="text-error" />
          <ResultRow label="Jarak Stop Loss" value={`Rp ${formatNum(riskPerShare)} per lbr`} />
          <div className="pt-4 border-t border-slate-200">
            <ResultRow label="Maks. Pembelian" value={`${formatNum(maxLots)} Lot`} className="text-primary font-bold text-xl" />
            <ResultRow label="Modal Terpakai" value={`Rp ${formatNum(positionSize)}`} className="font-semibold" />
            <ResultRow label="Porsi Modal" value={`${cap > 0 ? ((positionSize/cap)*100).toFixed(1) : 0}%`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 3. Average Down Calculator ──────────────────────────────────────────────

function CalcAvg() {
  const [buy1, setBuy1] = useState<number | ''>('');
  const [lot1, setLot1] = useState<number | ''>('');
  const [buy2, setBuy2] = useState<number | ''>('');
  const [lot2, setLot2] = useState<number | ''>('');

  const p1 = Number(buy1) || 0;
  const l1 = Number(lot1) || 0;
  const p2 = Number(buy2) || 0;
  const l2 = Number(lot2) || 0;

  const totalLots = l1 + l2;
  const totalShares = totalLots * 100;
  const totalVal = (p1 * l1 * 100) + (p2 * l2 * 100);
  const avgPrice = totalShares > 0 ? totalVal / totalShares : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Average Down</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-3 border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Pembelian Ke-1 (Saat ini)</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Harga (Rp)" value={buy1} onChange={setBuy1} type="number" />
              <Input label="Lot" value={lot1} onChange={setLot1} type="number" />
            </div>
          </div>
          <div className="p-3 border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase">Pembelian Ke-2 (Average)</p>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Harga (Rp)" value={buy2} onChange={setBuy2} type="number" />
              <Input label="Lot" value={lot2} onChange={setLot2} type="number" />
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Hasil Rata-rata</h4>
          <ResultRow label="Total Lot" value={`${formatNum(totalLots)} Lot`} />
          <ResultRow label="Total Modal" value={`Rp ${formatNum(totalVal)}`} />
          <div className="pt-4 border-t border-slate-200">
            <ResultRow label="Harga Rata-rata" value={`Rp ${formatNum(avgPrice)}`} className="text-primary font-bold text-xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 4. Valuation Calculator ─────────────────────────────────────────────────

function CalcVal() {
  const [price, setPrice] = useState<number | ''>('');
  const [shares, setShares] = useState<number | ''>('');
  const [netIncome, setNetIncome] = useState<number | ''>('');
  const [equity, setEquity] = useState<number | ''>('');

  const p = Number(price) || 0;
  const s = Number(shares) || 0; // in billions? let's assume actual number, so users input 1000000000
  const ni = Number(netIncome) || 0;
  const eq = Number(equity) || 0;

  const eps = s > 0 ? ni / s : 0;
  const bvps = s > 0 ? eq / s : 0;
  const per = eps > 0 ? p / eps : 0;
  const pbv = bvps > 0 ? p / bvps : 0;
  const roe = eq > 0 ? (ni / eq) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2"><BarChart2 className="w-5 h-5"/> Rasio Valuasi & Fundamental</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input label="Harga Saham Saat Ini (Rp)" value={price} onChange={setPrice} type="number" />
          <Input label="Jumlah Saham Beredar (Lembar)" value={shares} onChange={setShares} type="number" />
          <Input label="Total Laba Bersih (Rp)" value={netIncome} onChange={setNetIncome} type="number" />
          <Input label="Total Ekuitas (Rp)" value={equity} onChange={setEquity} type="number" />
          <p className="text-[10px] text-slate-400 leading-tight">Gunakan satuan yang sama untuk Laba Bersih, Ekuitas, dan Saham Beredar (misal: dalam jutaan atau angka penuh).</p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Metrik Fundamental</h4>
          <ResultRow label="EPS (Earning Per Share)" value={`Rp ${formatNum(eps)}`} />
          <ResultRow label="BVPS (Book Value Per Share)" value={`Rp ${formatNum(bvps)}`} />
          <div className="pt-4 border-t border-slate-200">
            <ResultRow label="PER (Price Earning Ratio)" value={`${formatNum(per)}x`} className="font-bold" />
            <ResultRow label="PBV (Price to Book Value)" value={`${formatNum(pbv)}x`} className="font-bold" />
            <ResultRow label="ROE (Return on Equity)" value={`${formatNum(roe)}%`} className="font-bold text-secondary" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 5. Compounding Calculator ───────────────────────────────────────────────

function CalcComp() {
  const [start, setStart] = useState<number | ''>('');
  const [monthly, setMonthly] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>(10);
  const [years, setYears] = useState<number | ''>(10);

  const p = Number(start) || 0;
  const pmt = Number(monthly) || 0;
  const r = (Number(rate) || 0) / 100;
  const t = Number(years) || 0;
  const n = 12; // monthly compounding

  // FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)] * (1+r/n) <- assuming start of month
  let fv = 0;
  if (r > 0) {
    fv = p * Math.pow(1 + r/n, n*t) + pmt * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
  } else {
    fv = p + pmt * 12 * t;
  }

  const totalInvested = p + (pmt * 12 * t);
  const totalReturn = fv - totalInvested;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h3 className="text-base font-bold text-primary mb-5 flex items-center gap-2"><PiggyBank className="w-5 h-5"/> Compounding & Jangka Panjang</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Input label="Modal Awal (Rp)" value={start} onChange={setStart} type="number" />
          <Input label="Tambahan per Bulan (Rp)" value={monthly} onChange={setMonthly} type="number" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Asumsi Return (% per thn)" value={rate} onChange={setRate} type="number" step="0.1" />
            <Input label="Jangka Waktu (Tahun)" value={years} onChange={setYears} type="number" />
          </div>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Proyeksi Masa Depan</h4>
          <ResultRow label="Total Modal Disetor" value={`Rp ${formatNum(totalInvested)}`} />
          <ResultRow label="Total Bunga/Return" value={`Rp ${formatNum(totalReturn)}`} className="text-secondary" />
          <div className="pt-4 border-t border-slate-200">
            <ResultRow label="Estimasi Nilai Akhir" value={`Rp ${formatNum(fv)}`} className="text-primary font-bold text-xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

function Input({ label, value, onChange, type = "text", step }: { label: string; value: any; onChange: (v: any) => void; type?: string; step?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        placeholder="0"
      />
    </div>
  );
}

function ResultRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className={cn('text-sm font-semibold text-slate-900 text-right', className)}>{value}</span>
    </div>
  );
}
