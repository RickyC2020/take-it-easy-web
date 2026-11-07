import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, User, MessageCircle, Clock } from 'lucide-react';

const CONTACT_PHONES = [
  { label: '876-789-9051', tel: '+18767899051' },
  { label: '876-885-2355', tel: '+18768852355' },
  { label: '876-442-6735', tel: '+18764426735' },
];

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#122b22] text-white flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-amber-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 id="contact-modal-title" className="text-xl font-bold tracking-tight text-white">
                Contact Take It Easy
              </h2>
              <p className="text-xs text-emerald-200/80">
                Car Rentals &amp; Curated Jamaican Tours
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close contact dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-700">
          {/* Company & Director Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Take It Easy Car Rentals &amp; Tours
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Director: <strong>Andray Williams</strong></span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5" />
              24/7 Island Support
            </span>
          </div>

          {/* Call & WhatsApp Numbers */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Call or WhatsApp (Direct Lines)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {CONTACT_PHONES.map((phone) => (
                <a
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-emerald-600/30 bg-emerald-50/60 hover:bg-emerald-100 hover:border-emerald-600 text-emerald-950 font-semibold text-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{phone.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Official Email Inquiries
            </label>
            <a
              href="mailto:takeiteasycarrentals@gmail.com"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500/50 transition-all text-slate-900 font-medium text-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-emerald-900 group-hover:underline">takeiteasycarrentals@gmail.com</span>
            </a>
          </div>

          {/* Airport Delivery Hubs */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-sm">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Airport &amp; Resort Curbside Handoff</p>
              <p className="text-amber-800 text-xs mt-0.5">
                Montego Bay (Sangster Intl - MBJ) · Kingston (Norman Manley Intl - KIN) · Curbside dispatch island-wide.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <a
            href="https://wa.me/18767899051"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp (+1 876-789-9051)</span>
          </a>
        </div>
      </div>
    </div>
  );
}

