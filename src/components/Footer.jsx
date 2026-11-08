import React from 'react';
import { Phone, Mail, User, MessageCircle } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

const CONTACT_PHONES = [
  { label: '876-789-9051', tel: '+18767899051' },
  { label: '876-885-2355', tel: '+18768852355' },
  { label: '876-442-6735', tel: '+18764426735' },
];

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0f221a] text-slate-300 print:hidden mt-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 text-center md:text-left">
          {/* Column 1: Brand & Tagline with Emblem Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-flex items-center justify-center md:justify-start gap-3.5 mb-3 group cursor-pointer"
              aria-label="Take It Easy Home"
            >
              <img
                src="/footer-logo.jpg"
                alt="Take It Easy Car Rentals & Tours Logo"
                className="h-14 sm:h-16 w-auto object-contain rounded-xl bg-[#203030] border border-emerald-800/60 shadow-md p-1 group-hover:border-emerald-500/80 transition-colors shrink-0"
              />
              <div className="text-left">
                <span className="font-black text-lg sm:text-xl text-white tracking-tight block group-hover:text-emerald-300 transition-colors">
                  TAKE IT EASY
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 inline-block mt-0.5">
                  Montego Bay · Kingston
                </span>
              </div>
            </a>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Take It Easy Car Rentals &amp; Tours. Curbside airport handoff at Sangster Intl (MBJ) and Norman Manley (KIN). Island-wide adventures made effortless.
            </p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Director: <strong className="text-white">Andray Williams</strong></span>
            </div>
          </div>

          {/* Column 2: Direct Phone Numbers */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Dispatch &amp; Reservations
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              {CONTACT_PHONES.map((phone) => (
                <div key={phone.tel} className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a
                    href={`tel:${phone.tel}`}
                    className="hover:text-emerald-300 transition-colors font-mono"
                  >
                    {phone.label}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Email & WhatsApp */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Email &amp; Instant WhatsApp
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="mailto:takeiteasycarrentals@gmail.com"
                  className="hover:text-emerald-300 transition-colors"
                >
                  takeiteasycarrentals@gmail.com
                </a>
              </div>
              <div className="pt-1">
                <a
                  href="https://wa.me/18767899051"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium transition-colors border border-emerald-600/50"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>WhatsApp +1 (876) 789-9051</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Links Row */}
        <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center justify-center gap-6 py-6 border-t border-slate-800/80">
          <a
            href="/privacy"
            onClick={(e) => handleLinkClick(e, '/privacy')}
            className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Privacy Policy
          </a>
          <span className="text-slate-700" aria-hidden="true">•</span>
          <a
            href="/terms"
            onClick={(e) => handleLinkClick(e, '/terms')}
            className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Terms of Use
          </a>
          <span className="text-slate-700" aria-hidden="true">•</span>
          <a
            href="/terms#fleet-guidelines"
            onClick={(e) => handleLinkClick(e, '/terms#fleet-guidelines')}
            className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Fleet &amp; Rental Guidelines
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-slate-500 font-mono pt-2">
          © {CURRENT_YEAR} Take It Easy Car Rentals &amp; Tours. All rights reserved. Rates in USD.
        </div>
      </div>
    </footer>
  );
}
