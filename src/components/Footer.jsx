import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

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
    <footer className="bg-[#10231c] text-slate-300 print:hidden mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="font-black text-lg text-white tracking-tight">
                TAKE IT EASY
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
                Montego Bay · Kingston
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Island-wide car rentals and curated Jamaican tour excursions. Sangster International Airport curbside handoff.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            <span>© {CURRENT_YEAR} Take It Easy Car Rental Ltd. All rates in USD.</span>
          </div>
        </div>

        {/* Legal Links Row */}
        <div className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center justify-center gap-6 py-6 border-t border-slate-800/60">
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
      </div>
    </footer>
  );
}
