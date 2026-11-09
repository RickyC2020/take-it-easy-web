import React, { useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  CreditCard,
  Car,
  Clock,
  PhoneCall,
  Scale,
  Calendar
} from 'lucide-react';

export default function TermsOfUse({ onNavigateHome, backLabel = 'Back to Home' }) {
  useEffect(() => {
    if (window.location.hash === '#fleet-guidelines') {
      const el = document.getElementById('fleet-guidelines');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onNavigateHome) {
      onNavigateHome();
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-[#F6F9F7] text-slate-800 antialiased selection:bg-[#2B6E3F] selection:text-white">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleHomeClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Jamaican Law Compliant
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Title Header Card */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span>Rental Agreement &amp; Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Terms of Use &amp; Rental Guidelines
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Please read these Terms of Use carefully. By reserving a vehicle or signing our digital rental agreement,
            you agree to be bound by all terms, policies, and statutory obligations under the laws of Jamaica.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Effective Date: November 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              Governing Law: Supreme Court &amp; Parish Courts of Jamaica
            </span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          {/* 1. Driver Eligibility & Age Requirements */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>1. Driver Eligibility &amp; License Requirements</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Minimum Age:</strong> The minimum age to rent is <strong>twenty-one (21) years</strong>. Take It Easy Car Rentals &amp; Tours Limited reserves the right to refuse anyone when done in the best interest of the Company or customer.
              </li>
              <li>
                <strong>License Validity:</strong> Drivers must hold a valid, unexpired national or international physical driver&apos;s license.
              </li>
              <li>
                <strong>Physical Verification:</strong> The primary renter must present their original physical driver&apos;s license and matching ID at the airport handoff counter prior to key release.
              </li>
              <li>
                <strong>Authorized Drivers:</strong> Only drivers explicitly named and validated on the digital rental contract are legally permitted to operate the vehicle.
              </li>
            </ul>
          </section>

          {/* 2. Rates, Exclusions & Security Deposit */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>2. Rates, Exclusions &amp; Security Deposit</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Rate Exclusions:</strong> Rates do not include gasoline, GOVT. TAX (GCT), and security deposit (if applicable).
              </li>
              <li>
                <strong>Security Deposit:</strong> Take It Easy Car Rentals &amp; Tours Limited reserves the right to collect a deposit covering estimated charges and damages.
              </li>
              <li>
                <strong>Hold Release:</strong> The deposit pre-authorization is promptly released upon vehicle return in agreed condition with full fuel.
              </li>
            </ul>
          </section>

          {/* 3. Refund Policy (Strictly Credit Note Only) */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>3. Refund Policy</span>
            </h2>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
              <p className="font-extrabold text-sm sm:text-base text-rose-900">
                NO REFUND — CREDIT NOTE ONLY
              </p>
              <p className="text-xs sm:text-sm text-rose-800">
                Credit notes issued are valid for one (1) year from the date of issue and can be applied toward any future rental with Take It Easy Car Rentals &amp; Tours Limited.
              </p>
            </div>
          </section>

          {/* 4. Traffic, Parking, Returns & Maintenance Liability */}
          <section id="fleet-guidelines" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Car className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>4. Traffic Violations, Returns &amp; Maintenance Liability</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2.5">
              <li>
                <strong>Traffic &amp; Parking Violations:</strong> Renters assume full legal and financial responsibility for all parking and traffic violations during the rental term.
              </li>
              <li>
                <strong>Returns &amp; Drop Charges:</strong> Vehicle must be returned on or before the due date and time to the same location where rented (Montego Bay Airport MBJ or Kingston Airport KIN), or an additional drop charge may apply.
              </li>
              <li>
                <strong>Parts, Repairs &amp; Tyres/Rims:</strong> Parts and repairs charges will not be refunded without an official receipt and prior consent from Take It Easy Car Rentals &amp; Tours Limited. The renter is fully liable for damage to rims and tyres.
              </li>
              <li>
                <strong>Drive on the Left:</strong> In Jamaica, all vehicular traffic travels on the left side of the road. Seatbelts are mandatory for all occupants.
              </li>
            </ul>
          </section>

          {/* 5. Insurance & CDW (Collision Damage Waiver) */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>5. Insurance &amp; Collision Damage Waiver (CDW)</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Third-Party Liability:</strong> Third-party liability insurance does not cover damages sustained by the renter or vehicle occupants personally.
              </li>
              <li>
                <strong>Collision Damage Waiver (CDW):</strong> Renter accepts or declines CDW at the daily rate, with renter responsibility for the first $3,500 / $4,500 USD (or specified amount) of collision damage.
              </li>
              <li>
                <strong>Negligence:</strong> Negligence or violation of the rental agreement makes the renter fully liable for all damages even with CDW.
              </li>
            </ul>
          </section>

          {/* 6. Accident & Breakdown Reporting Protocols */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>6. Accident &amp; Emergency Protocols</span>
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-950 font-bold text-sm">
              EMERGENCY NOTICE: In the case of an accident, call 119 immediately.
            </div>
            <p>
              In the event of an accident, mechanical issue, puncture, or vehicle damage:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Ensure Safety &amp; Call 119:</strong> In the case of an accident or emergency, call <strong>119</strong> immediately. Pull over to a safe area and confirm all occupants are secure.
              </li>
              <li>
                <strong>Call Take It Easy Dispatch:</strong> Contact Take It Easy dispatch immediately via our 24/7 lines at <a href="tel:+18768852355" className="font-bold underline text-emerald-700">(876) 885-2355</a> or <a href="tel:+18767899051" className="font-bold underline text-emerald-700">(876) 789-9051</a>.
              </li>
              <li>
                <strong>Police Notification:</strong> Under Jamaican law, any motor vehicle collision involving another party, property damage, or bodily injury must be reported to the Jamaica Constabulary Force (JCF). Obtain the investigating officer&apos;s name and police incident report number.
              </li>
              <li>
                <strong>Do Not Admit Liability:</strong> Collect third-party driver name, vehicle registration plate number, and insurance details.
              </li>
            </ol>
          </section>

          {/* 7. Governing Law */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>7. Governing Law &amp; Company Details</span>
            </h2>
            <p>
              This Agreement shall be governed by and construed in accordance with the <strong>laws of Jamaica</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong>Official Entity:</strong> Take It Easy Car Rentals &amp; Tours Limited<br />
              <strong>Registered Office:</strong> 80c Queen&apos;s Drive, Montego Bay, St. James, Jamaica<br />
              <strong>Director:</strong> Andray Williams<br />
              <strong>Telephone:</strong> (876) 885-2355 / (876) 789-9051<br />
              <strong>Email:</strong> takeiteasycarrentals@gmail.com
            </p>
          </section>

          {/* Bottom Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white">
            <div>
              <p className="font-bold text-white text-base">Questions regarding our rental terms?</p>
              <p className="text-xs text-slate-300 mt-1">
                Take It Easy Car Rentals &amp; Tours Limited • 80c Queen&apos;s Drive, Montego Bay, Jamaica
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Email: <a href="mailto:takeiteasycarrentals@gmail.com" className="text-amber-400 underline">takeiteasycarrentals@gmail.com</a> • Tel: <a href="tel:+18768852355" className="text-amber-400 underline">(876) 885-2355</a> · <a href="tel:+18767899051" className="text-amber-400 underline">(876) 789-9051</a>
              </p>
              <p className="text-xs text-amber-300 font-mono mt-1">
                Emergency: In the case of an accident, call 119.
              </p>
            </div>
            <button
              type="button"
              onClick={handleHomeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-md shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel.includes('Home') ? 'Back to Home' : backLabel}</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
