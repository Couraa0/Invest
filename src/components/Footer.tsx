import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-10 px-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.svg" alt="Logo" className="w-5.5 h-5.5 brightness-0 invert" />
              </div>
              <span className="text-xl font-extrabold text-primary tracking-tight font-display">
                Invest<span className="text-emerald-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm font-medium">
              Membangun masa depan finansial investor saham Indonesia melalui teknologi AI prediktif, data real-time yfinance, dan platform simulasi bebas risiko.
            </p>

            <div className="pt-2 flex items-center gap-2">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((soc, i) => {
                const IconComp = soc.icon;
                return (
                  <a
                    key={i}
                    href={soc.href}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200"
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'Produk Platform',
              links: [
                { label: 'AI Stock Signals', path: '/signals' },
                { label: 'Stock Academy', path: '/academy' },
                { label: 'Paper Trading', path: '/simulator' },
                { label: '1-on-1 Mentorship', path: '/mentorship' }
              ]
            },
            {
              title: 'Perusahaan',
              links: [
                { label: 'Tentang Kami', path: '/about' },
                { label: 'Karir & Lowongan', path: '/careers' },
                { label: 'Hubungi Kami', path: '/contact' }
              ]
            },
            {
              title: 'Informasi Legal',
              links: [
                { label: 'Kebijakan Privasi', path: '/privacy' },
                { label: 'Edukasi Risiko', path: '/risk' },
                { label: 'Syarat & Ketentuan', path: '/terms' }
              ]
            },
          ].map((col, i) => (
            <div key={i} className="md:col-span-2">
              <h5 className="text-xs font-mono font-extrabold text-primary uppercase tracking-wider mb-4">
                {col.title}
              </h5>
              <ul className="space-y-3 font-medium text-sm">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-slate-600 hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 InvestAI Indonesia. Platform Analisis & Edukasi Saham BEI (IDX).</p>
          <div className="flex gap-6 font-semibold">
            <Link to="/risk" className="hover:text-primary transition-colors">Edukasi Risiko</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
