import React from 'react';
import { Phone, Mail, MapPin, User, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

const CONTACT_PHONES = [
  { label: '876-789-9051', tel: '+18767899051' },
  { label: '876-885-2355', tel: '+18768852355' },
  { label: '876-442-6735', tel: '+18764426735' },
];

export default function ContactSection() {
  return (
    <section
      id="contact-section"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 mt-14 pt-10 border-t border-brand-ink/10 print:hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-palm flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>We&apos;re Here to Help</span>
            </span>
            <h2
              id="contact-heading"
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-ink mt-1"
            >
              Contact Take It Easy Car Rentals &amp; Tours
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl">
              Connect with our airport counter dispatch or our leadership team for custom bookings, flight delays, roadside assistance, or private island tour arrangements.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>24/7 Island-Wide Dispatch</span>
          </div>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Direct Phone Lines */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Call or WhatsApp</h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct mobile dispatch lines in Jamaica:
              </p>
              <div className="mt-4 space-y-2">
                {CONTACT_PHONES.map((phone) => (
                  <a
                    key={phone.tel}
                    href={`tel:${phone.tel}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 font-semibold text-sm text-slate-800 transition-colors"
                  >
                    <span>{phone.label}</span>
                    <span className="text-xs text-emerald-700 font-mono">Call / WA →</span>
                  </a>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 font-mono">
              Available 24 hours a day, 7 days a week.
            </p>
          </div>

          {/* Card 2: Email & Management */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Official Email</h3>
              <p className="text-xs text-slate-500 mt-1">
                Send contract queries, flight itineraries, or tour quotes:
              </p>
              <div className="mt-4">
                <a
                  href="mailto:takeiteasycarrentals@gmail.com"
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 font-semibold text-sm text-emerald-800 transition-colors break-all"
                >
                  takeiteasycarrentals@gmail.com
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Director: <strong className="text-slate-900">Andray Williams</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Licensed Jamaican Vehicle Rental Fleet</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 font-mono">
              Response typically within 1 hour.
            </p>
          </div>

          {/* Card 3: Curbside Hubs & WhatsApp Action */}
          <div className="p-6 rounded-2xl bg-[#122b22] text-white border border-emerald-900 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-amber-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Airport Curbside Hubs</h3>
              <p className="text-xs text-emerald-200/80 mt-1">
                Curbside gate drop-off and pickup across Jamaica:
              </p>
              <div className="mt-4 space-y-2 text-xs text-emerald-100">
                <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                  <p className="font-bold text-amber-300">Montego Bay (MBJ)</p>
                  <p className="text-emerald-200/90 text-[11px] mt-0.5">
                    Sangster International Airport Terminal Handoff
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                  <p className="font-bold text-emerald-300">Kingston (KIN)</p>
                  <p className="text-emerald-200/90 text-[11px] mt-0.5">
                    Norman Manley International Airport Curbside
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-800">
              <a
                href="https://wa.me/18767899051"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Now via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
