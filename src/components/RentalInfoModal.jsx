import React, { useEffect } from 'react';
import { X, ShieldCheck, Fuel, Car, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

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
                Official Rental Policies &amp; Terms
              </h2>
              <p className="text-xs text-emerald-200/80">
                Take It Easy Car Rentals &amp; Tours Limited · 80c Queen&apos;s Drive, Montego Bay
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-700 text-sm">
          {/* Emergency Alert Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-950 flex items-center justify-between gap-3">
            <span className="font-bold text-xs sm:text-sm">
              Emergency Contact: In the case of an accident, call <strong>119</strong>.
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-900 shrink-0">
              Tel: (876) 885-2355 / (876) 789-9051
            </span>
          </div>

          {/* Item 1: Minimum Age */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Minimum Age Requirement (21 Years)</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                The minimum age to rent is <strong>21 years</strong>. The Company reserves the right to refuse anyone when done in the best interest of the Company or customer.
              </p>
            </div>
          </div>

          {/* Item 2: Rate Exclusions & Security Deposit */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rate Exclusions &amp; Security Deposit</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Rates do not include gasoline, GOVT. TAX (GCT), and security deposit (if applicable). Take It Easy Car Rentals &amp; Tours Limited reserves the right to collect a deposit covering estimated charges and damages.
              </p>
            </div>
          </div>

          {/* Item 3: Traffic & Parking Violations */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Traffic &amp; Parking Violations</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Renters assume full legal and financial responsibility for all parking and traffic violations incurred during the rental term.
              </p>
            </div>
          </div>

          {/* Item 4: Returns & Drop Charges */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Returns &amp; Drop Charges</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                The vehicle must be returned on or before the due date/time to the same location where rented (Montego Bay Airport MBJ or Kingston Airport KIN), or a drop charge may apply.
              </p>
            </div>
          </div>

          {/* Item 5: Parts, Repairs & Tyres/Rims */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Parts, Repairs &amp; Tyres / Rims Liability</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Parts and repair charges will not be refunded without an official receipt and prior consent from Take It Easy Car Rentals &amp; Tours Limited. Renter is fully liable for damage to rims and tyres.
              </p>
            </div>
          </div>

          {/* Item 6: Insurance & CDW */}
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Insurance &amp; Collision Damage Waiver (CDW)</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">
                Third-party liability insurance does not cover damages sustained by the renter or occupants personally. The renter accepts or declines CDW at the daily rate, with renter responsibility for the first $3,500 / $4,500 USD (or specified amount) of collision damage. Negligence or violation of the agreement makes the renter fully liable for all damages even with CDW.
              </p>
            </div>
          </div>

          {/* Item 7: Refund Policy */}
          <div className="flex gap-4 p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 font-bold text-xs">
              NO
            </div>
            <div>
              <h3 className="font-bold text-rose-900 text-base">Refund Policy</h3>
              <p className="text-rose-800 font-semibold mt-1">
                NO REFUND — CREDIT NOTE ONLY.
              </p>
              <p className="text-slate-600 text-xs mt-0.5">
                Credit note is valid for one (1) year from date of issue.
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

