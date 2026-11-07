import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  Building,
  Mail,
  Scale,
  Calendar
} from 'lucide-react';

export default function PrivacyPolicy({ onNavigateHome, backLabel = 'Back to Home' }) {
  useEffect(() => {
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
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              JDPA 2020 Compliant
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Title Header Card */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Statutory Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Take It Easy Car Rentals &amp; Tours (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is fully committed
            to safeguarding your privacy in compliance with the <strong>Jamaica Data Protection Act, 2020 (JDPA)</strong>,
            international card processing safety standards (PCI-DSS), and international best practices for vehicle hire.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Effective Date: November 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Jurisdiction: Jamaica (OIC Registered)
            </span>
          </div>
        </div>

        {/* Section 1: Data Controller */}
        <div className="space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Building className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>1. Data Controller Identification</span>
            </h2>
            <p>
              Under the Jamaica Data Protection Act (JDPA 2020), your Data Controller is:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-mono text-slate-800 space-y-1">
              <p className="font-bold text-slate-900">Take It Easy Car Rentals &amp; Tours</p>
              <p className="text-xs text-slate-600 font-sans">Director: Andray Williams</p>
              <p>Airport Commercial Corridor, Sangster International Airport (MBJ)</p>
              <p>Montego Bay, St. James, Jamaica W.I.</p>
              <p>Contact Email: <a href="mailto:takeiteasycarrentals@gmail.com" className="text-emerald-700 underline font-semibold">takeiteasycarrentals@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+18767899051" className="text-emerald-700 underline font-semibold">876-789-9051</a> · <a href="tel:+18768852355" className="text-emerald-700 underline font-semibold">876-885-2355</a> · <a href="tel:+18764426735" className="text-emerald-700 underline font-semibold">876-442-6735</a></p>
            </div>
          </section>

          {/* Section 2: Categories of Data Collected */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>2. Categories of Personal Data Collected</span>
            </h2>
            <p>
              To process vehicle reservations, conduct digital counter check-in, and fulfill Jamaican motor vehicle statutory obligations, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identity &amp; Contact Details:</strong> Full legal name, email address, WhatsApp/mobile telephone number, physical home address, country of residence, and date of birth.
              </li>
              <li>
                <strong>Driver Qualification Credentials:</strong> Physical driver&apos;s license photographs (front and back), issuing state or country, license number, and expiration date (mandatory requirement under Jamaican road traffic regulations).
              </li>
              <li>
                <strong>Arrival &amp; Flight Logistics:</strong> Airline name, flight number, and estimated arrival time into Sangster Intl Airport (MBJ) or Norman Manley Intl Airport (KIN), used strictly to coordinate on-time curbside pickup and gate terminal meet-and-greet.
              </li>
              <li>
                <strong>Payment &amp; Security Authorizations:</strong> Tokenized cardholder authorization credentials, billing address, card brand, and masked transaction IDs. <em>We process card holds through PCI-DSS Level 1 certified gateways; our application servers never store raw credit card numbers or security CVV codes.</em>
              </li>
              <li>
                <strong>Vehicle Inspection &amp; Condition Baseline:</strong> Pre-rental and post-return 360-degree digital inspection photographs, fuel tank gauge readings (8/8 full guarantee), and odometer readings taken during the physical vehicle handoff.
              </li>
            </ul>
          </section>

          {/* Section 3: Legal Basis & Purpose */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>3. Legal Basis &amp; Purpose of Processing (JDPA 2020)</span>
            </h2>
            <p>
              In accordance with Section 21 of the Jamaica Data Protection Act, we only process personal information where a valid legal ground exists:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-sm">Contractual Necessity</h3>
                <p className="text-xs text-emerald-900 mt-1">
                  Executing and managing your vehicle rental contract, verifying driver eligibility, providing airport handoff, and releasing security deposits.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-sm">Statutory Legal Obligation</h3>
                <p className="text-xs text-emerald-900 mt-1">
                  Compliance with the Jamaican Road Traffic Act, vehicle insurance underwriting requirements, and mandatory tax accounting under the Revenue Administration Act.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-sm">24/7 Island-Wide Support</h3>
                <p className="text-xs text-emerald-900 mt-1">
                  Dispatching roadside assistance, emergency recovery, flight delay re-scheduling, and operational WhatsApp reservation updates.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-sm">Asset Protection &amp; Safety</h3>
                <p className="text-xs text-emerald-900 mt-1">
                  Preventing fraudulent bookings, investigating unreturned fleet assets, and verifying physical vehicle handoff condition reports.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Third-Party Sharing */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>4. Third-Party Sharing &amp; Data Transfers</span>
            </h2>
            <p>
              We do not sell, rent, or trade your personal information. Data is shared exclusively with certified partners under strict confidentiality agreements:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Payment Processors:</strong> PCI-DSS certified payment service providers (including First Atlantic Commerce / authorized banking partners) to execute pre-authorizations and process payments.
              </li>
              <li>
                <strong>Fleet Insurance Underwriters:</strong> Licensed motor vehicle insurers in Jamaica to validate third-party liability coverage and handle legitimate collision damage reports.
              </li>
              <li>
                <strong>Cloud &amp; Security Infrastructure:</strong> Secure, SOC2-certified cloud database and hosting providers utilizing TLS 1.3 encryption in transit and AES-256 encryption at rest.
              </li>
              <li>
                <strong>Statutory Authorities:</strong> The Jamaica Constabulary Force (JCF), Island Traffic Authority, or courts of law strictly when required under a lawful warrant, statutory subpoena, or for reporting hit-and-run traffic collisions.
              </li>
            </ul>
          </section>

          {/* Section 5: Data Retention & Security */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>5. Data Retention &amp; Security Standards</span>
            </h2>
            <p>
              We implement comprehensive organizational and technical security measures to safeguard your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Encryption:</strong> All digital communications, driver license uploads, and payment tokens are protected using 256-bit SSL/TLS encryption.
              </li>
              <li>
                <strong>Retention Schedule:</strong> Executed rental agreements and invoice records are retained for seven (7) years to satisfy Jamaican statutory tax and limitation laws. Vehicle walk-around photos and driver license snapshots are archived securely and purged 90 days after security deposit release, unless an open insurance claim or citation dispute is active.
              </li>
              <li>
                <strong>Access Controls:</strong> Only authorized Take It Easy staff with role-based authentication and non-disclosure obligations have access to guest identification files.
              </li>
            </ul>
          </section>

          {/* Section 6: Renter Statutory Rights */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>6. Your Statutory Rights Under the JDPA (2020)</span>
            </h2>
            <p>
              As a data subject under Jamaican law, you are entitled to exercise the following rights free of charge:
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 text-sm">Right of Access &amp; Portability</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Request a complete copy of the personal information we hold regarding your vehicle rentals and transactions.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 text-sm">Right to Rectification</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Promptly rectify any inaccurate, outdated, or incomplete personal data records.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 text-sm">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;)</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Request deletion of your data once vehicle hire obligations, toll clearances, and statutory limitation periods conclude.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 text-sm">Right to Lodge a Complaint</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  If you believe your personal data has been handled inconsistently with the JDPA, you have the right to lodge a complaint directly with the <strong>Office of the Information Commissioner (OIC)</strong> of Jamaica.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Contact Information */}
          <section className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-900 shadow-md space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <span>7. Privacy Officer &amp; Regulator Contact</span>
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              To exercise your statutory privacy rights, update your driver profile, or submit privacy inquiries, please contact our Data Protection Officer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <p className="font-bold text-amber-300">Take It Easy DPO Office</p>
                <p className="text-xs text-emerald-200 mt-0.5">Director: Andray Williams</p>
                <p className="text-emerald-100 mt-1">
                  Email: <a href="mailto:takeiteasycarrentals@gmail.com" className="underline hover:text-white">takeiteasycarrentals@gmail.com</a>
                </p>
                <p className="text-emerald-100">
                  Tel / WhatsApp: <a href="tel:+18767899051" className="underline hover:text-white">876-789-9051</a> · <a href="tel:+18768852355" className="underline hover:text-white">876-885-2355</a> · <a href="tel:+18764426735" className="underline hover:text-white">876-442-6735</a>
                </p>
                <p className="text-emerald-200/80 text-[11px] mt-1">Sangster International Airport, Montego Bay</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60">
                <p className="font-bold text-emerald-300">Office of the Information Commissioner (Jamaica)</p>
                <p className="text-emerald-100 mt-1">Website: www.oic.gov.jm</p>
                <p className="text-emerald-100">Email: info@oic.gov.jm</p>
                <p className="text-emerald-200/80 text-[11px] mt-1">Kingston, Jamaica W.I.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handleHomeClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backLabel.includes('Home') ? 'Return to Take It Easy Home' : backLabel}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
