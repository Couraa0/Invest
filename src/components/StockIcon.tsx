import { useState } from 'react';
import { cn } from '../lib/utils';

interface StockIconProps {
  symbol: string;
  className?: string;
}

export default function StockIcon({ symbol, className }: StockIconProps) {
  const [imgError, setImgError] = useState(false);

  const getStockBranding = (sym: string) => {
    switch (sym.toUpperCase()) {
      case 'BBCA':
        return { color: 'bg-[#0047af]', text: 'BCA', textColor: 'text-white' };
      case 'TLKM':
        return { color: 'bg-[#ed1c24]', text: 'T', textColor: 'text-white' };
      case 'ASII':
        return { color: 'bg-[#00529c]', text: 'A', textColor: 'text-white' };
      case 'BMRI':
        return { color: 'bg-[#ffcc00]', text: 'M', textColor: 'text-[#003d79]' };
      case 'GOTO':
        return { color: 'bg-[#00c62c]', text: 'G', textColor: 'text-white' };
      case 'UNVR':
        return { color: 'bg-[#1a3668]', text: 'U', textColor: 'text-white' };
      case 'ADRO':
        return { color: 'bg-[#1b4332]', text: 'A', textColor: 'text-white' };
      case 'ANTM':
        return { color: 'bg-[#f7931e]', text: 'A', textColor: 'text-white' };
      default:
        return { color: 'bg-slate-100', text: sym.substring(0, 1), textColor: 'text-primary' };
    }
  };

  const branding = getStockBranding(symbol);
  const logoUrl = `https://assets.stockbit.com/logos/companies/${symbol.toUpperCase()}.png`;

  if (!imgError) {
    return (
      <div className={cn(
        "shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 p-1",
        className || "w-12 h-12"
      )}>
        <img
          src={logoUrl}
          alt={`${symbol} logo`}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "shrink-0 flex items-center justify-center font-black rounded-xl overflow-hidden shadow-sm border border-black/5",
      branding.color,
      className || "w-12 h-12 text-sm"
    )}>
      <span className={branding.textColor}>{branding.text}</span>
    </div>
  );
}
