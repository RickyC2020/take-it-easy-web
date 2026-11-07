import React, { useEffect } from 'react';
import { X, ShieldCheck, Fuel, Car, Award, HelpCircle, PhoneCall, CheckCircle2 } from 'lucide-react';

export default function RentalInfoModal({ isOpen, onClose }) {
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
      aria-labelledby="rental-info-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#122b22] text-white flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 id="rental-info-modal-title" className="text-xl font-bold tracking-tight text-white">
                Rental Information &amp; Policies
              </h2>
              <p className="text-xs text-emerald-200/80">
                Take It Easy Car Rentals &amp; Tours · Montego Bay &amp; Kingston
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close rental information"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-700 text-sm">
          {/* Item 1: Age & License */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Driver Requirements (21+ Years)</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Primary drivers must be at least <strong>21 years of age</strong> and hold a valid, unexpired national or international driver&apos;s license for at least <strong>two (2) years</strong>. No extra young-driver surcharge for ages 21–24.
              </p>
            </div>
          </div>

          {/* Item 2: Security Deposit */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Security Deposit Pre-Authorization</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                A standard refundable security deposit pre-authorization of <strong>$500.00 USD</strong> is placed on a major credit card (Visa, MasterCard, Amex) at pickup. The hold is promptly released upon clean vehicle return and check-sheet signoff.
              </p>
            </div>
          </div>

          {/* Item 3: Fuel Policy */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Full-to-Full Fuel Policy (8/8)</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Vehicles are provided with a full tank (8/8) of fuel and must be returned with a full tank. An on-site gas station refueling receipt within 10 km of the return hub is appreciated. Refueling fee applies if returned below handoff level.
              </p>
            </div>
          </div>

          {/* Item 4: Driving in Jamaica */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Driving on the Left in Jamaica</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                In Jamaica, traffic drives on the <strong>left-hand side</strong> of the road. Seatbelts are mandatory for all passengers. All vehicles are strictly prohibited from unpaved off-road riverbeds, commercial rideshare, and smoking/vaping.
              </p>
            </div>
          </div>

          {/* Item 5: Airport Curbside & 24/7 Support */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Curbside Airport Delivery &amp; 24/7 Roadside Assistance</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Enjoy seamless meet-and-greet curbside handoff at <strong>Sangster Intl Airport (MBJ)</strong> and <strong>Norman Manley Intl (KIN)</strong>. 24/7 island-wide roadside support is included with every rental.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Have questions? Call or WhatsApp our dispatch 24/7.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
          >
            Got It, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
