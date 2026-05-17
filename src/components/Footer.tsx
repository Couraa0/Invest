import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform overflow-hidden">
                <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
              </div>
              <span className="text-base font-bold text-primary">InvestAI</span>
            </Link>
            <p className="text-sm text-on-surface-variant/60 leading-relaxed max-w-sm mb-6">
              Membangun masa depan finansial Indonesia melalui edukasi dan teknologi kecerdasan buatan kelas dunia.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-primary hover:text-white text-on-surface-variant flex items-center justify-center transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {[
            { title: 'Produk', links: [
                { label: 'AI Signals', path: '/login' },
                { label: 'Academy', path: '/login' },
                { label: 'Paper Trading', path: '/login' },
                { label: 'Mentorship', path: '/login' }
            ]},
            { title: 'Perusahaan', links: [
                { label: 'Tentang Kami', path: '/about' },
                { label: 'Karir', path: '/careers' },
                { label: 'Kontak', path: '/contact' }
            ]},
            { title: 'Legal', links: [
                { label: 'Kebijakan Privasi', path: '/privacy' },
                { label: 'Edukasi Risiko', path: '/risk' },
                { label: 'Syarat & Ketentuan', path: '/terms' }
            ]},
          ].map((col, i) => (
            <div key={i} className="md:col-span-2">
              <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">{col.title}</h5>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-on-surface-variant/60 hover:text-primary transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant/40">
          <p>© 2026 InvestAI Indonesia. Platform Edukasi Simulasi Saham.</p>
          <div className="flex gap-5">
            <Link to="/risk" className="hover:text-primary transition-colors">Edukasi Risiko</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
