import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  Fuel,
  ShieldCheck,
  Clock,
  Sparkles,
  Plus,
  Car,
  FileCheck2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { TOUR_PACKAGES } from '../data/tourPackages';
import SignaturePad from './SignaturePad';
import CheckoutPayment from './CheckOutPayment';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Jamaica',
  'Cayman Islands',
  'Bahamas',
  'Trinidad & Tobago',
  'Barbados',
  'Germany',
  'France',
  'Other'
];

const WIZARD_STEPS = [
  { id: 1, shortLabel: 'Customer Info', subtitle: 'Guest & Arrival Details' },
  { id: 2, shortLabel: 'Check Sheet', subtitle: 'Pre-Inspection Baseline' },
  { id: 3, shortLabel: 'Contract', subtitle: 'Digital Rental Agreement' },
  { id: 4, shortLabel: 'Payment', subtitle: 'Authorize Reservation' }
];

export default function PublicCheckoutModal({
  vehicle,
  location,
  pickupDateLabel,
  returnDateLabel,
  rentalDays,
  selectedTours = [],
  onToggleTour,
  onClose,
  onBookingConfirmed
}) {
  const modalScrollRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');

  // Step 1 State — Customer Info (persisted across all Back/Next transitions)
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
    country: 'United States',
    flightNumber: ''
  });

  // Step 2 State — Customer Pre-Inspection Baseline Acknowledgment
  const [checkSheetAgreed, setCheckSheetAgreed] = useState(false);

  // Step 3 State — Digital Rental Agreement Signature
  const [contractSignature, setContractSignature] = useState(null);
  const [sigFillVersion, setSigFillVersion] = useState(0);

  // Post-Step 4 State — Completed Authorization Confirmation
  const [completedBooking, setCompletedBooking] = useState(null);

  const rentalSubtotal = vehicle.ratePerDay * rentalDays;
  const toursSubtotal = selectedTours.reduce(
    (sum, t) => sum + (t.duration === 'Daily' ? t.price * rentalDays : t.price),
    0
  );
  const depositAmount = vehicle.deposit ?? 500;

  const selectedTourIds = selectedTours.map((t) => t.id);

  const scrollModalTop = () => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCustomerField = (field) => (e) => {
    const val = e.target.value;
    setCustomerInfo((prev) => ({ ...prev, [field]: val }));
    if (stepError) setStepError('');
  };

  const isStep1Valid = () => {
    if (!customerInfo.fullName.trim()) {
      setStepError('Please enter your Full Name.');
      return false;
    }
    const emailTrimmed = customerInfo.email.trim();
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setStepError('Please enter a valid Email address for your booking confirmation.');
      return false;
    }
    if (!customerInfo.whatsappPhone.trim()) {
      setStepError('Please enter your WhatsApp Phone Number so our airport team can reach you.');
      return false;
    }
    if (!customerInfo.country.trim()) {
      setStepError('Please select your Country of Residence.');
      return false;
    }
    return true;
  };

  const isStep2Valid = () => {
    if (!checkSheetAgreed) {
      setStepError(
        'Please acknowledge the vehicle condition verification check before continuing.'
      );
      return false;
    }
    return true;
  };

  const isStep3Valid = () => {
    const hasSig = Boolean(
      contractSignature && (contractSignature.text?.trim() || contractSignature.dataUrl)
    );
    if (!hasSig) {
      setStepError('Please sign the Digital Rental Agreement (type your full name or draw) to proceed.');
      return false;
    }
    return true;
  };

  const goToStep = (targetStep) => {
    if (completedBooking) return;
    setStepError('');

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      scrollModalTop();
      return;
    }

    if (targetStep === currentStep) return;

    // Validate sequential progression
    if (targetStep >= 2 && !isStep1Valid()) return;
    if (targetStep >= 3 && !isStep2Valid()) return;
    if (targetStep >= 4 && !isStep3Valid()) return;

    setCurrentStep(targetStep);
    scrollModalTop();
  };

  const signedDisplayName =
    contractSignature?.mode === 'type'
      ? contractSignature.text
      : customerInfo.fullName || 'Signed Digitally';

  return (
    <div
      ref={modalScrollRef}
      className="fixed inset-0 z-[58] overflow-y-auto print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Reservation Checkout Wizard"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-start py-4 px-3 sm:py-8 sm:px-6">
        <div className="w-full max-w-5xl space-y-4">
          {/* =========================================================
              MODAL HEADER + 4-STEP CUSTOMER WIZARD STEPPER
             ========================================================= */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-9 rounded-lg bg-gray-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                    Online Guest Reservation
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {vehicle.name} ({vehicle.year}) · {pickupDateLabel.split('·')[0].trim()} –{' '}
                    {returnDateLabel.split('·')[0].trim()}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close checkout modal"
                className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4-Step Wizard Stepper */}
            {!completedBooking && (
              <nav
                aria-label="Checkout progress"
                className="grid grid-cols-4 divide-x divide-gray-100 bg-gray-50/70"
              >
                {WIZARD_STEPS.map((step) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => goToStep(step.id)}
                      aria-current={isActive ? 'step' : undefined}
                      className={`min-h-[54px] px-2 sm:px-4 py-2.5 text-left transition-all cursor-pointer flex items-center gap-2 sm:gap-3 relative ${
                        isActive
                          ? 'bg-white text-emerald-900'
                          : isCompleted
                            ? 'bg-emerald-50/50 text-emerald-900 hover:bg-emerald-50'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-emerald-900 text-white shadow-xs'
                            : isCompleted
                              ? 'bg-emerald-700 text-white'
                              : 'bg-gray-200/80 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                      </span>

                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold truncate leading-tight">
                          {step.shortLabel}
                        </span>
                        <span className="hidden md:block text-[11px] text-gray-500 truncate mt-0.5">
                          {step.subtitle}
                        </span>
                      </div>

                      {isActive && (
                        <span
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-900"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Validation Error Banner (Steps 1-3) */}
          {stepError && !completedBooking && currentStep < 4 && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2.5 text-sm font-medium text-red-700 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{stepError}</span>
            </div>
          )}

          {/* =========================================================
              POST-AUTHORIZATION CONFIRMATION SCREEN
             ========================================================= */}
          {completedBooking ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-mono font-semibold">
                  Booking Reference: {completedBooking.bookingRef}
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  Your Vehicle Reservation Is Confirmed!
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We have pre-authorized{' '}
                  <strong className="text-emerald-900">
                    ${completedBooking.totalAuthorized.toLocaleString()} USD
                  </strong>{' '}
                  and sent your digital agreement &amp; airport pickup instructions to{' '}
                  <strong className="text-gray-900">{completedBooking.guest.email}</strong> and
                  WhatsApp (<strong className="text-gray-900">{completedBooking.guest.whatsappPhone}</strong>).
                </p>
              </div>

              <div className="max-w-md mx-auto rounded-xl bg-gray-50 border border-gray-100 p-4 text-left text-sm space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-semibold text-gray-900">{vehicle.name}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-semibold text-gray-900">{pickupDateLabel}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold text-gray-900 text-right">{location.shortName}</span>
                </div>
                <div className="flex justify-between gap-2 pt-2 border-t border-gray-200">
                  <span className="text-emerald-900 font-semibold">Pre-Authorized Hold</span>
                  <span className="font-mono font-bold text-emerald-900">
                    ${completedBooking.totalAuthorized.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] px-8 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-base transition-colors cursor-pointer"
              >
                Done · Return to Fleet
              </button>
            </div>
          ) : (
            <>
              {/* =========================================================
                  STEP 1: CUSTOMER INFO & TOUR PACKAGE ADD-ONS
                 ========================================================= */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                        Step 1 of 4 · Customer Info
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                        Tell Us About Your Arrival
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We use your WhatsApp and flight details to stage your {vehicle.name} right on time.
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 border border-emerald-200/70 px-4 py-2.5 text-left sm:text-right shrink-0">
                      <span className="text-[11px] font-mono uppercase text-emerald-800 block">
                        Est. Rental + Add-Ons
                      </span>
                      <span className="text-lg font-black font-mono text-emerald-900 tabular-nums">
                        ${(rentalSubtotal + toursSubtotal).toLocaleString()} USD
                      </span>
                      <span className="block text-[11px] text-emerald-800/80">
                        + ${depositAmount} refundable deposit
                      </span>
                    </div>
                  </div>

                  {/* Customer Info Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="step1-full-name"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="step1-full-name"
                        type="text"
                        autoComplete="name"
                        value={customerInfo.fullName}
                        onChange={handleCustomerField('fullName')}
                        placeholder="e.g. Marcus Sterling"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="step1-email"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="step1-email"
                        type="email"
                        autoComplete="email"
                        value={customerInfo.email}
                        onChange={handleCustomerField('email')}
                        placeholder="you@example.com"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="step1-whatsapp"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        WhatsApp Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="step1-whatsapp"
                        type="tel"
                        autoComplete="tel"
                        value={customerInfo.whatsappPhone}
                        onChange={handleCustomerField('whatsappPhone')}
                        placeholder="+1 (876) 555-0194"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="step1-country"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Country of Residence <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="step1-country"
                        value={customerInfo.country}
                        onChange={handleCustomerField('country')}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors cursor-pointer"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="step1-flight"
                        className="block text-sm font-medium text-gray-700 mb-1.5"
                      >
                        Flight / Arrival Number{' '}
                        <span className="text-xs font-normal text-gray-400">(Optional)</span>
                      </label>
                      <input
                        id="step1-flight"
                        type="text"
                        value={customerInfo.flightNumber}
                        onChange={handleCustomerField('flightNumber')}
                        placeholder="e.g. AA 1482 / DL 1934"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tour Package Add-Ons Summary / Toggle */}
                  <div className="rounded-xl bg-gray-50/90 border border-gray-200/80 p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <h4 className="text-sm sm:text-base font-bold text-gray-900">
                          Enhance Your Trip · Optional Tour &amp; Chauffeur Add-Ons
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        {selectedTours.length === 0
                          ? 'None selected'
                          : `${selectedTours.length} selected (+$${toursSubtotal} USD)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {TOUR_PACKAGES.map((tour) => {
                        const isAdded = selectedTourIds.includes(tour.id);
                        const effectivePrice =
                          tour.duration === 'Daily' ? tour.price * rentalDays : tour.price;

                        return (
                          <div
                            key={tour.id}
                            className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition-all bg-white ${
                              isAdded
                                ? 'border-emerald-700 ring-2 ring-emerald-700/15'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={tour.image}
                                alt={tour.title}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 select-none"
                              />
                              <div className="min-w-0">
                                <span className="text-[11px] font-mono text-emerald-800 font-semibold block">
                                  {tour.duration}
                                </span>
                                <p className="text-sm font-bold text-gray-900 leading-snug">
                                  {tour.title}
                                </p>
                                <p className="text-xs font-mono font-semibold text-gray-600 mt-0.5">
                                  ${tour.price} USD
                                  {tour.duration === 'Daily'
                                    ? `/day ($${effectivePrice} total)`
                                    : ' flat'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onToggleTour && onToggleTour(tour)}
                              className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-900 text-white hover:bg-emerald-800'
                                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border border-amber-400/60'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                  <span>Added to Booking</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 stroke-[2.5]" />
                                  <span>Add to Booking</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 1 Footer CTA */}
                  <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="w-full sm:w-auto min-h-[50px] px-7 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-sm transition-all cursor-pointer"
                    >
                      Continue to Check Sheet →
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================
                  STEP 2: CHECK SHEET (CUSTOMER PRE-INSPECTION BASELINE)
                 ========================================================= */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-gray-100 pb-5">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                      Step 2 of 4 · Customer Pre-Inspection Baseline
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                      Vehicle Condition &amp; Pickup Walk-Around Standards
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Review what is guaranteed before your keys are handed over—no surprises on return.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Visual Vehicle Condition Diagram & Standards */}
                    <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-gray-50/70 p-5 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-emerald-800" />
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide font-mono">
                            4-Zone Condition Standard
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold">
                          Pre-Checked Ready
                        </span>
                      </div>

                      {/* Clean Visual Top-Down Inspection Diagram */}
                      <div className="rounded-xl bg-white border border-gray-200 p-4 flex flex-col sm:flex-row items-center gap-4">
                        <svg
                          viewBox="0 0 180 100"
                          aria-hidden="true"
                          className="w-40 h-24 shrink-0 text-emerald-900"
                        >
                          {/* Car body silhouette */}
                          <rect
                            x="22"
                            y="18"
                            width="136"
                            height="64"
                            rx="22"
                            fill="#ecfdf5"
                            stroke="#065f46"
                            strokeWidth="2.2"
                          />
                          {/* Cabin glass */}
                          <rect
                            x="50"
                            y="26"
                            width="80"
                            height="48"
                            rx="10"
                            fill="#ffffff"
                            stroke="#047857"
                            strokeWidth="1.6"
                          />
                          {/* Wheels */}
                          <rect x="38" y="11" width="24" height="7" rx="3" fill="#064e3b" />
                          <rect x="118" y="11" width="24" height="7" rx="3" fill="#064e3b" />
                          <rect x="38" y="82" width="24" height="7" rx="3" fill="#064e3b" />
                          <rect x="118" y="82" width="24" height="7" rx="3" fill="#064e3b" />
                          {/* 4 Inspection Zone Markers */}
                          <circle cx="26" cy="50" r="7" fill="#f59e0b" />
                          <text x="26" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#052e16">
                            1
                          </text>
                          <circle cx="90" cy="18" r="7" fill="#f59e0b" />
                          <text x="90" y="21" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#052e16">
                            2
                          </text>
                          <circle cx="90" cy="82" r="7" fill="#f59e0b" />
                          <text x="90" y="85" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#052e16">
                            3
                          </text>
                          <circle cx="154" cy="50" r="7" fill="#f59e0b" />
                          <text x="154" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#052e16">
                            4
                          </text>
                        </svg>

                        <div className="grid grid-cols-2 gap-2.5 w-full text-xs">
                          <div className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
                            <span className="font-mono font-bold text-emerald-900 block">
                              1 · Front &amp; Glass
                            </span>
                            <span className="text-gray-600">Bumper, lamps &amp; chip-free windshield</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
                            <span className="font-mono font-bold text-emerald-900 block">
                              2 · Right Side
                            </span>
                            <span className="text-gray-600">Driver doors, mirror &amp; alloy rims</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
                            <span className="font-mono font-bold text-emerald-900 block">
                              3 · Left Side
                            </span>
                            <span className="text-gray-600">Passenger panels &amp; tire tread depth</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
                            <span className="font-mono font-bold text-emerald-900 block">
                              4 · Rear &amp; Trunk
                            </span>
                            <span className="text-gray-600">Tailgate, spare tire &amp; emergency kit</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="flex items-start gap-2.5 rounded-xl bg-white border border-gray-100 p-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">Zero Unlogged Blemishes</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Any minor pre-existing mark is recorded upfront so you are never billed for it.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 rounded-xl bg-white border border-gray-100 p-3">
                          <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">Sanitized &amp; A/C Tested</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Cabin detailed, ice-cold A/C verified, and safety road kit stored in trunk.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 8/8 Full Fuel Guarantee + 5-Minute Sangster Intl Walk-Around */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* 8/8 Full Fuel Guarantee */}
                      <div className="rounded-xl bg-emerald-50/85 border border-emerald-200 p-5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base">
                            <Fuel className="w-5 h-5 text-emerald-800 shrink-0" />
                            <span>8/8 Full Fuel Guarantee</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-900 text-white font-mono text-xs font-bold">
                            8/8 FULL
                          </span>
                        </div>

                        {/* Visual 8-Bar Gauge */}
                        <div className="grid grid-cols-8 gap-1.5 pt-1" aria-label="8 out of 8 fuel bars full">
                          {Array.from({ length: 8 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="h-3 rounded-sm bg-emerald-700 shadow-2xs"
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[11px] font-mono text-emerald-900/80">
                          <span>E</span>
                          <span>1/2</span>
                          <span>8/8 FULL</span>
                        </div>

                        <p className="text-xs sm:text-sm text-emerald-950/85 leading-relaxed">
                          Your {vehicle.name} is handed over with a verified <strong>8/8 full tank</strong>.
                          Return it at <strong>8/8</strong> to pay zero refueling fees.
                        </p>
                      </div>

                      {/* 5-Minute Physical Walk-Around Instructions */}
                      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
                        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>5-Minute Walk-Around at Sangster Intl Pickup</span>
                        </div>

                        <ol className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                          <li className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              1
                            </span>
                            <span>
                              Meet your Take It Easy agent outside arrivals at{' '}
                              <strong className="text-gray-900">Sangster Intl</strong> (or your selected pickup point).
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              2
                            </span>
                            <span>
                              Complete a quick <strong>5-minute joint walk-around</strong> of Zones 1–4 and feel free to capture a personal walk-around clip on your phone.
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              3
                            </span>
                            <span>
                              Confirm the <strong>8/8 fuel gauge</strong> on the check sheet and hit the road immediately.
                            </span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Customer Acknowledgment Checkbox */}
                  <label
                    htmlFor="customer-checksheet-ack"
                    className={`min-h-[56px] rounded-xl border p-4 flex items-start sm:items-center gap-3.5 cursor-pointer transition-all select-none ${
                      checkSheetAgreed
                        ? 'bg-emerald-50/90 border-emerald-700 ring-2 ring-emerald-700/15'
                        : 'bg-gray-50 border-gray-200 hover:border-emerald-700/50'
                    }`}
                  >
                    <input
                      id="customer-checksheet-ack"
                      type="checkbox"
                      checked={checkSheetAgreed}
                      onChange={(e) => {
                        setCheckSheetAgreed(e.target.checked);
                        if (stepError) setStepError('');
                      }}
                      className="w-5 h-5 mt-0.5 sm:mt-0 rounded accent-emerald-800 shrink-0 cursor-pointer"
                    />
                    <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                      I agree to verify vehicle condition with the Take It Easy agent during physical handoff.
                    </span>
                  </label>

                  {/* Step 2 Navigation Footer */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="min-h-[50px] px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="min-h-[50px] px-7 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-sm transition-all cursor-pointer"
                    >
                      Continue to Contract Review →
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================
                  STEP 3: CONTRACT (STANDALONE DIGITAL RENTAL AGREEMENT)
                 ========================================================= */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
                    <div>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                        Step 3 of 4 · Digital Rental Agreement
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                        Review &amp; Sign Your Rental Contract
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Please review the key rental terms below and sign digitally before proceeding to payment.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700 self-start sm:self-auto">
                      <FileCheck2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>Renter: {customerInfo.fullName || 'Guest'}</span>
                    </div>
                  </div>

                  {/* Scrollable Rental Agreement Terms */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden">
                    <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200 flex items-center justify-between text-xs font-mono text-gray-600">
                      <span>TAKE IT EASY CAR RENTALS &amp; TOURS — RENTAL TERMS SUMMARY</span>
                      <span>Scroll to read</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-5 space-y-4 text-sm text-gray-700 leading-relaxed bg-white">
                      <div className="rounded-lg bg-emerald-50/60 border border-emerald-200/70 p-3.5 text-xs sm:text-sm text-emerald-950 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-500 block text-xs">Renter &amp; Residence</span>
                          <strong>
                            {customerInfo.fullName} ({customerInfo.country})
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Assigned Vehicle Class</span>
                          <strong>
                            {vehicle.name} · ${vehicle.ratePerDay} USD/day ({rentalDays}{' '}
                            {rentalDays === 1 ? 'day' : 'days'})
                          </strong>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">
                          1. Unlimited Island Mileage &amp; Permitted Use
                        </h4>
                        <p className="mt-1 text-gray-600">
                          Your rental includes <strong>unlimited mileage</strong> on paved public roads across Jamaica.
                          Vehicles may only be operated by licensed drivers named on the agreement (valid physical driver&apos;s
                          license presented at handoff). Off-road driving, beach/sand driving, or commercial sub-hire is prohibited.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">
                          2. Insurance Coverage &amp; Collision Excess
                        </h4>
                        <p className="mt-1 text-gray-600">
                          Standard statutory third-party motor liability coverage is included in your daily rate. The renter
                          remains responsible for new exterior, glass, tire, rim, or undercarriage damage occurring during the
                          rental period up to the applicable vehicle collision excess, as verified against the pickup Check Sheet.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">
                          3. Fuel Replacement Policy (8/8 Full-to-Full)
                        </h4>
                        <p className="mt-1 text-gray-600">
                          Every Take It Easy vehicle is released with a verified <strong>8/8 full tank</strong>. If the vehicle
                          is returned below 8/8, fuel replacement is charged at current local pump rates plus a{' '}
                          <strong>$15 USD</strong> refueling service fee.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">
                          4. ${depositAmount} USD Card Security Deposit Hold Terms
                        </h4>
                        <p className="mt-1 text-gray-600">
                          A mandatory <strong>${depositAmount} USD security deposit pre-authorization hold</strong> is placed
                          on your payment card at checkout alongside your rental charges. Funds are held—not permanently
                          captured—and the full ${depositAmount} USD security deposit is automatically released upon timely
                          return of the vehicle in clean, undamaged condition with an 8/8 full tank.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">
                          5. Return Schedule &amp; Grace Period
                        </h4>
                        <p className="mt-1 text-gray-600">
                          Scheduled return is <strong>{returnDateLabel}</strong> at{' '}
                          <strong>{location.shortName}</strong>. A 59-minute airport traffic grace period is provided; late
                          returns beyond 1 hour without prior WhatsApp notice may incur an additional pro-rated or daily charge.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature Box (Type Full Name or Draw Signature) */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        Digital Renter Signature <span className="text-red-500">*</span>
                      </span>
                      {customerInfo.fullName.trim() && !contractSignature && (
                        <button
                          type="button"
                          onClick={() => {
                            setContractSignature({
                              mode: 'type',
                              dataUrl: null,
                              text: customerInfo.fullName.trim(),
                              signedAt: new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            });
                            setSigFillVersion((v) => v + 1);
                            if (stepError) setStepError('');
                          }}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                        >
                          Quick-fill &ldquo;{customerInfo.fullName.trim()}&rdquo;
                        </button>
                      )}
                    </div>

                    <SignaturePad
                      key={sigFillVersion}
                      label="Digital Contract Signature"
                      sublabel="Type full name to sign, or switch to Draw to sign on screen"
                      initialMode="type"
                      value={contractSignature}
                      onChange={(sig) => {
                        setContractSignature(sig);
                        if (sig && stepError) setStepError('');
                      }}
                    />
                  </div>

                  {/* Step 3 Navigation Footer */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="min-h-[50px] px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="min-h-[50px] px-7 py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-base shadow-sm transition-all cursor-pointer"
                    >
                      Agree &amp; Proceed to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================
                  STEP 4: PAYMENT AUTHORIZATION (CheckoutPayment Component)
                 ========================================================= */}
              {currentStep === 4 && (
                <CheckoutPayment
                  vehicleName={`${vehicle.name} (${vehicle.year})`}
                  vehicleCategory={vehicle.categoryLabel}
                  vehicleImage={vehicle.image}
                  pickupLocation={location.name}
                  pickupDateLabel={pickupDateLabel}
                  returnDateLabel={returnDateLabel}
                  rentalDays={rentalDays}
                  dailyRate={vehicle.ratePerDay}
                  selectedTours={selectedTours}
                  rentalTotal={rentalSubtotal}
                  depositAmount={depositAmount}
                  guestDetails={customerInfo}
                  onGuestDetailsChange={setCustomerInfo}
                  checkSheetVerified={checkSheetAgreed}
                  contractSignedBy={signedDisplayName}
                  onBack={() => goToStep(3)}
                  onAuthorizeSuccess={(payload) => {
                    setCompletedBooking(payload);
                    scrollModalTop();
                    if (onBookingConfirmed) {
                      onBookingConfirmed({
                        ...payload,
                        customerInfo,
                        contractSignature,
                        checkSheetAgreed,
                        rentalSubtotal,
                        toursSubtotal,
                        depositAmount
                      });
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
