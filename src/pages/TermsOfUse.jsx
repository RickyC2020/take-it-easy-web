import React, { useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  CreditCard,
  Car,
  Fuel,
  Clock,
  PhoneCall,
  Scale,
  Calendar,
  AlertTriangle
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
                <strong>Minimum Age:</strong> The primary renter and any authorized additional drivers must be at least <strong>twenty-one (21) years of age</strong> at the time of vehicle collection.
              </li>
              <li>
                <strong>License Validity:</strong> Drivers must hold a valid, unexpired national or international physical driver&apos;s license issued for at least <strong>two (2) full consecutive years</strong>. Digital copies, temporary permits, or learner&apos;s licenses are not accepted.
              </li>
              <li>
                <strong>Physical Verification:</strong> The primary renter must present their original physical driver&apos;s license and matching passport at the airport handoff counter prior to key release.
              </li>
              <li>
                <strong>Authorized Drivers:</strong> Only drivers explicitly named and validated on the digital rental contract are legally insured and permitted to operate the vehicle. Allowing an unauthorized person to drive immediately voids all insurance protections.
              </li>
            </ul>
          </section>

          {/* 2. Security Deposit Pre-Authorization */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>2. Security Deposit Pre-Authorization Hold ($500 USD)</span>
            </h2>
            <p>
              To ensure transparency and protect our fleet assets:
            </p>
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-sm space-y-1">
              <p className="font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>$500 USD Pre-Authorization Hold at Checkout</span>
              </p>
              <p className="text-xs text-amber-900 leading-relaxed">
                A temporary $500 USD security deposit hold is authorized on your payment card at checkout alongside your daily rental charges. Funds are held—not captured—and are automatically released upon vehicle return in good condition.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Payment Method:</strong> Must be a valid Visa, Mastercard, or American Express issued in the primary renter&apos;s name. Prepaid cards or cash security deposits are strictly prohibited.
              </li>
              <li>
                <strong>Release Timeline:</strong> Upon vehicle return, fuel verification, and completion of the return check-sheet, Take It Easy releases the authorization immediately. Depending on your issuing bank, released funds reappear in your account within 3 to 7 business days.
              </li>
            </ul>
          </section>

          {/* 3. 48-Hour Free Cancellation Policy */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>3. 48-Hour Free Cancellation &amp; Refund Policy</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-sm">48+ Hours Notice (100% Refund)</h3>
                <p className="text-xs text-emerald-900 mt-1">
                  Cancel anytime up to 48 hours prior to your scheduled pickup time for a full 100% refund with zero cancellation fees.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-950 text-sm">Within 48 Hours / No-Show</h3>
                <p className="text-xs text-slate-700 mt-1">
                  Cancellations made within 48 hours of pickup or failure to collect (no-show) incur a 1-day rental fee; all remaining balances and deposit authorizations are released immediately.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              *Flight Delays: If your flight is delayed or rescheduled by the airline, notify our WhatsApp dispatch immediately. We hold your vehicle reservation without penalty.
            </p>
          </section>

          {/* 4. Permitted Road Use & Prohibited Activities */}
          <section id="fleet-guidelines" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Car className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>4. Permitted Road Use &amp; Driving in Jamaica</span>
            </h2>
            <div className="p-4 rounded-xl bg-emerald-900 text-white space-y-1">
              <p className="font-bold text-amber-300 text-sm">CRITICAL: DRIVE ON THE LEFT</p>
              <p className="text-xs text-emerald-100">
                In Jamaica, traffic flows on the <strong>LEFT side of the road</strong>. All fleet vehicles are right-hand drive. The primary renter agrees to obey all speed limits and road signs enacted under the Road Traffic Act of Jamaica.
              </p>
            </div>

            <p className="font-bold text-slate-900 pt-1">Permitted Roads:</p>
            <p>
              Vehicles may be operated on all paved public roads, national highways (including the North Coast Highway / A1, A2, A3, and Highway 2000 tollways) across the island of Jamaica.
            </p>

            <p className="font-bold text-slate-900 pt-1">Strictly Prohibited Uses:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-red-900">
                <strong>Off-Road &amp; Unpaved Tracks:</strong> Driving on unpaved logging trails, beaches, sand dunes, riverbeds, or flooded terrain is strictly prohibited and immediately voids all insurance.
              </li>
              <li className="text-red-900">
                <strong>No Smoking / No Vaping:</strong> All fleet vehicles are 100% smoke-free and vape-free. Any trace of tobacco, cannabis, or vape residue triggers a mandatory <strong>$250 USD interior ozone detailing penalty fee</strong>.
              </li>
              <li className="text-red-900">
                <strong>Commercial Sub-Hire:</strong> Operating the vehicle for paid rideshare (Uber/taxi), courier transport, or sub-leasing to third parties is strictly prohibited.
              </li>
              <li className="text-red-900">
                <strong>Racing &amp; Reckless Driving:</strong> Speed testing, racing, driver training, or towing another vehicle/trailer is prohibited.
              </li>
            </ul>
          </section>

          {/* 5. Inspection Check-Sheet & Fuel Return */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Fuel className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>5. Digital Inspection Check-Sheet &amp; Fuel Policy</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Digital Baseline Walk-Around:</strong> At pickup, you will conduct a 5-minute physical walk-around with our agent, documenting any pre-existing cosmetic baseline via our digital check-sheet.
              </li>
              <li>
                <strong>Full 8/8 Fuel Guarantee:</strong> Vehicles are delivered with a full 8/8 tank of fuel. The vehicle must be returned with 8/8 fuel (unless you selected a pre-paid fuel package). Missing fuel is billed at prevailing local pump rates plus a $25 USD refueling service charge.
              </li>
              <li>
                <strong>Return Condition:</strong> Vehicles should be returned in standard clean condition. Extreme interior mud, salt water, stained upholstery, or pet hair requires specialist cleaning billed at cost ($150 USD minimum).
              </li>
            </ul>
          </section>

          {/* 6. Accident & Breakdown Reporting Protocols */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>6. Accident &amp; Emergency Breakdown Protocols</span>
            </h2>
            <p>
              In the event of an accident, mechanical issue, puncture, or vehicle damage:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Ensure Safety:</strong> Pull over to a safe area, activate hazard lights, and confirm all occupants are secure.
              </li>
              <li>
                <strong>Call 24/7 Island-Wide Support:</strong> Contact Take It Easy dispatch immediately via our 24/7 hotline or WhatsApp at <strong>+1 (876) 555-EASY</strong>.
              </li>
              <li>
                <strong>Police Notification:</strong> Under Jamaican law, any motor vehicle collision involving another party, property damage, or bodily injury must be reported to the <strong>Jamaica Constabulary Force (JCF)</strong> within twenty-four (24) hours. Obtain the investigating officer&apos;s name and police incident report number.
              </li>
              <li>
                <strong>Do Not Admit Liability:</strong> Collect third-party driver name, registration plate number, and insurer info. Do not sign third-party settlements without our authorized fleet team.
              </li>
            </ol>
          </section>

          {/* 7. Governing Law */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>7. Governing Law &amp; Jurisdiction</span>
            </h2>
            <p>
              This Agreement and any dispute or claim arising out of or in connection with it shall be governed by and
              construed in accordance with the <strong>laws of Jamaica</strong>.
            </p>
            <p>
              The parties irrevocably submit to the exclusive jurisdiction of the <strong>Parish Court of Saint James (Montego Bay)</strong>,
              the <strong>Parish Court of Kingston</strong>, and the <strong>Supreme Court of Judicature of Jamaica</strong>.
            </p>
          </section>

          {/* Bottom Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white">
            <div>
              <p className="font-bold text-white text-base">Questions regarding our rental terms?</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Our Montego Bay airport counter team is available 24/7 via WhatsApp or telephone.
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
