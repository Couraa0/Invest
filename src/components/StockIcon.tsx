import { useState } from 'react';
import { cn } from '../lib/utils';

interface StockIconProps {
  symbol: string;
  className?: string;
}

export default function StockIcon({ symbol, className }: StockIconProps) {
  const [imgError, setImgError] = useState(false);

  const cleanSym = symbol.replace('$', '').replace('.JK', '').toUpperCase();

  const getStockBranding = (sym: string) => {
    switch (sym) {
      case 'BBCA':
        return { color: 'bg-[#0047af]', text: 'BCA', textColor: 'text-white' };
      case 'BBRI':
        return { color: 'bg-[#00529c]', text: 'BRI', textColor: 'text-white' };
      case 'BMRI':
        return { color: 'bg-[#003d79]', text: 'MDR', textColor: 'text-[#ffcc00]' };
      case 'TLKM':
        return { color: 'bg-[#ed1c24]', text: 'TLK', textColor: 'text-white' };
      case 'ASII':
        return { color: 'bg-[#00529c]', text: 'AST', textColor: 'text-white' };
      case 'AMRT':
        return { color: 'bg-[#00529c]', text: 'ALFA', textColor: 'text-[#ed1c24]' };
      case 'GOTO':
        return { color: 'bg-[#00c62c]', text: 'GOTO', textColor: 'text-white' };
      case 'ICBP':
        return { color: 'bg-[#003399]', text: 'ICBP', textColor: 'text-white' };
      case 'IHSG':
      case '^JKSE':
        return { color: 'bg-emerald-600', text: 'IDX', textColor: 'text-white' };
      default:
        return { color: 'bg-primary/10', text: sym.substring(0, 3), textColor: 'text-primary' };
    }
  };

  const branding = getStockBranding(cleanSym);
  const logoUrl = `https://assets.stockbit.com/logos/companies/${cleanSym}.png`;

  if (!imgError) {
    return (
      <div className={cn(
        "shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200/80 p-1",
        className || "w-10 h-10"
      )}>
        <img
          src={logoUrl}
          alt={`${cleanSym} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "shrink-0 flex items-center justify-center font-black rounded-xl overflow-hidden shadow-sm border border-slate-200/80",
      branding.color,
      className || "w-10 h-10 text-xs"
    )}>
      <span className={branding.textColor}>{branding.text}</span>
    </div>
  );
}
