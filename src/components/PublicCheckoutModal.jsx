import React, { useState, useRef, useEffect } from 'react';
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
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfUse from '../pages/TermsOfUse';

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
  { id: 1, shortLabel: 'Customer Info' },
  { id: 2, shortLabel: 'Check Sheet' },
  { id: 3, shortLabel: 'Contract' },
  { id: 4, shortLabel: 'Payment' }
];

export default function PublicCheckoutModal({
  vehicle,
  location,
  dropLocation,
  pickupFee,
  dropFee,
  pickupDateLabel,
  returnDateLabel,
  rentalDays,
  selectedTours = [],
  onToggleTour,
  onClose,
  onBookingConfirmed
}) {
  const modalScrollRef = useRef(null);
  const contractScrollRef = useRef(null);

  const effectiveDropLocation = dropLocation || location;
  const safePickupFee = pickupFee !== undefined ? Number(pickupFee) : (location?.id === 'KIN' ? 120 : 0);
  const safeDropFee = dropFee !== undefined ? Number(dropFee) : (effectiveDropLocation?.id === 'KIN' ? 120 : 0);
  const totalLocationFee = safePickupFee + safeDropFee;

  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null); // 'terms' | 'privacy' | null

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

  // Step 3 State — Digital Rental Agreement Scroll Enforcement & Signature
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [contractTermsAgreed, setContractTermsAgreed] = useState(false);
  const [contractSignature, setContractSignature] = useState(null);
  const [sigFillVersion, setSigFillVersion] = useState(0);

  // Auto-detect if contract container is already fully visible without scrolling
  useEffect(() => {
    if (currentStep === 3 && contractScrollRef.current) {
      const { clientHeight, scrollHeight } = contractScrollRef.current;
      if (scrollHeight <= clientHeight + 8) {
        setHasScrolledToBottom(true);
      }
    }
  }, [currentStep]);

  const handleContractScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 8) {
      setHasScrolledToBottom(true);
    }
  };

  const scrollToContractEnd = () => {
    if (contractScrollRef.current) {
      contractScrollRef.current.scrollTo({
        top: contractScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setHasScrolledToBottom(true);
    }
  };

  const [completedBooking, setCompletedBooking] = useState(null);

  // Guarantee background scroll freeze and immediate focus on mount
  useEffect(() => {
    modalScrollRef.current?.focus({ preventScroll: true });

    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
    };
  }, []);

  const rentalSubtotal = vehicle.ratePerDay * rentalDays;
  const toursSubtotal = selectedTours.reduce(
    (sum, t) => sum + (t.duration?.toLowerCase().includes('daily') ? t.price * rentalDays : t.price),
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
    if (!hasScrolledToBottom) {
      setStepError('Please scroll to the bottom of the rental agreement to review all terms before signing.');
      return false;
    }
    if (!contractTermsAgreed) {
      setStepError('Please acknowledge and accept the rental terms checkbox before proceeding.');
      return false;
    }
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
      className="fixed inset-0 z-[58] print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Customer Reservation Checkout Wizard"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm animate-fade-in touch-none"
        aria-hidden="true"
      />

      {/* Primary Scroll Viewport (occupies entire viewport, overscroll-contain prevents chaining) */}
      <div
        ref={modalScrollRef}
        tabIndex={-1}
        className="relative z-10 w-full h-full overflow-y-auto overscroll-contain focus:outline-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="min-h-full flex flex-col items-center justify-start py-4 px-3 sm:py-8 sm:px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
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
                      className={`min-h-[54px] px-2 sm:px-4 py-2.5 text-left transition-all cursor-pointer flex items-center gap-2 sm:gap-3 relative ${isActive
                        ? 'bg-white text-emerald-900'
                        : isCompleted
                          ? 'bg-emerald-50/50 text-emerald-900 hover:bg-emerald-50'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${isActive
                          ? 'bg-emerald-900 text-white shadow-xs'
                          : isCompleted
                            ? 'bg-emerald-700 text-white'
                            : 'bg-gray-200/80 text-gray-500'
                          }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                      </span>

                      <div className="min-w-0">
                        <span className="hidden sm:block text-xs sm:text-sm font-bold truncate leading-tight">
                          {step.shortLabel}
                        </span>
                        <span className="sm:hidden block text-[11px] font-bold truncate leading-tight">
                          {step.id === 1 ? 'Info' : step.id === 2 ? 'Sheet' : step.shortLabel}
                        </span>
                        {step.subtitle && (
                          <span className="hidden md:block text-[11px] text-gray-500 truncate mt-0.5">
                            {step.subtitle}
                          </span>
                        )}
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
                  <span className="text-gray-500">Pickup Hub</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {location.shortName} {safePickupFee > 0 ? '(+$120 fee)' : ''}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Drop-off Hub</span>
                  <span className="font-semibold text-gray-900 text-right">
                    {effectiveDropLocation.shortName} {safeDropFee > 0 ? '(+$120 fee)' : ''}
                  </span>
                </div>
                {totalLocationFee > 0 && (
                  <div className="flex justify-between gap-2">
                    <span className="text-amber-800 font-medium">Kingston Hub Fee(s)</span>
                    <span className="font-semibold text-amber-900 font-mono">+${totalLocationFee} USD</span>
                  </div>
                )}
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
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 sm:pb-5">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                      Enter Basic Information
                    </h3>
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
                        const isDaily = tour.duration?.toLowerCase().includes('daily');
                        const effectivePrice = isDaily ? tour.price * rentalDays : tour.price;

                        return (
                          <div
                            key={tour.id}
                            className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition-all bg-white ${isAdded
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
                                  {isDaily
                                    ? `/day ($${effectivePrice} total)`
                                    : ' flat'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onToggleTour && onToggleTour(tour)}
                              className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${isAdded
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
                  <div className="border-b border-gray-100 pb-4 sm:pb-5">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                      Verify Vehicle Condition with Agent
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Visual Vehicle Condition Diagram & Standards */}
                    <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-gray-50/70 p-5 space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-emerald-800" />
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide font-mono">
                            What to Check For?
                          </h4>
                        </div>

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
                              Complete a quick <strong>5-minute joint walk-around</strong> of Zones 1–4 and feel free to capture a personal walk-around video on your phone.
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
                    className={`min-h-[56px] rounded-xl border p-4 flex items-start sm:items-center gap-3.5 cursor-pointer transition-all select-none ${checkSheetAgreed
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
                <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200/80 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 sm:pb-5">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5 tracking-tight">
                      Review &amp; Sign Your Rental Contract
                    </h3>
                  </div>

                  {/* High-Visibility Official Rental Agreement Box */}
                  <div className="rounded-2xl border-2 border-emerald-700/80 ring-4 ring-emerald-700/10 bg-white overflow-hidden shadow-md">
                    {/* Official Document Banner Header */}
                    <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-emerald-950 via-[#102b21] to-emerald-900 border-b border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-800/90 border border-emerald-600/60 flex items-center justify-center text-amber-300 shrink-0">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs sm:text-sm tracking-wide block">
                            OFFICIAL DIGITAL RENTAL AGREEMENT
                          </span>

                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasScrolledToBottom ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-xs">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            <span>Agreement fully reviewed</span>
                          </span>
                        ) : (
                          <>

                            <button
                              type="button"
                              onClick={scrollToContractEnd}
                              className="min-h-[30px] px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>Scroll to End ↓</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Scrollable Viewport */}
                    <div
                      ref={contractScrollRef}
                      onScroll={handleContractScroll}
                      className="max-h-64 sm:max-h-80 overflow-y-auto p-5 sm:p-6 space-y-4 text-sm text-slate-700 leading-relaxed bg-slate-50/70"
                    >
                      {/* Summary Banner Card */}
                      <div className="rounded-xl bg-gradient-to-r from-emerald-900 to-[#123024] text-white border border-emerald-700/80 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-emerald-200 block text-xs font-mono uppercase tracking-wider">Primary Renter &amp; Origin</span>
                          <strong className="text-white text-sm">
                            {customerInfo.fullName || 'Guest'} ({customerInfo.country || 'International'})
                          </strong>
                        </div>
                        <div>
                          <span className="text-emerald-200 block text-xs font-mono uppercase tracking-wider">Assigned Vehicle Class</span>
                          <strong className="text-white text-sm">
                            {vehicle.name} · ${vehicle.ratePerDay} USD/day ({rentalDays}{' '}
                            {rentalDays === 1 ? 'day' : 'days'})
                          </strong>
                        </div>
                      </div>

                      {/* Contract clauses */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">1</span>
                          <span>Minimum Age &amp; Driver Eligibility</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          Minimum age is <strong>21 years</strong>. Take It Easy Car Rentals &amp; Tours Limited reserves the right to refuse anyone when done in the best interest of the Company or customer. Unlimited mileage on public roads across Jamaica is included.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">2</span>
                          <span>Rate Exclusions &amp; Security Deposit</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          Rates do not include gasoline, GOVT. TAX, and security deposit (if applicable). The company reserves the right to collect a deposit covering estimated charges and damages (pre-authorization hold of <strong>${depositAmount} USD</strong> placed at booking).
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">3</span>
                          <span>Traffic &amp; Parking Violations</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          Renters assume full legal and financial responsibility for all parking and traffic violations incurred during the rental term.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">4</span>
                          <span>Returns &amp; Drop Charges</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          The vehicle must be returned on or before the scheduled due date/time to the designated return location (<strong>{effectiveDropLocation.shortName}</strong>), or an applicable drop charge may apply.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">5</span>
                          <span>Parts, Repairs &amp; Tyres / Rims Liability</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          Parts and repairs charges will not be refunded without an official receipt and prior consent from Take It Easy Car Rentals &amp; Tours Limited. The renter is fully liable for all damage to rims and tyres.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-800 text-white font-mono text-[11px] font-bold">6</span>
                          <span>Insurance &amp; Collision Damage Waiver (CDW)</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          Third-party liability insurance does not cover damages sustained by the renter or occupants personally. Renter accepts or declines CDW at the daily rate, with renter responsibility for the first $3,500 / $4,500 USD (or specified amount) of collision damage. Negligence or violation of the agreement makes the renter fully liable for all damages even with CDW.
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-rose-200/90 shadow-2xs space-y-1">
                        <h4 className="font-bold text-rose-900 flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-rose-700 text-white font-mono text-[11px] font-bold">7</span>
                          <span>Refund Policy &amp; Emergency (Call 119)</span>
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm pl-7">
                          <strong>NO REFUND — CREDIT NOTE ONLY</strong> (Credit note is valid for one (1) year). In the case of an accident, call <strong>119</strong> immediately.
                        </p>
                      </div>

                      <div className="pt-2 text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono border border-emerald-300">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>End of Agreement Terms — Ready for Signature Below</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Terms Acknowledgment Checkbox (Enforced by Scroll) */}
                  <label
                    htmlFor="contract-terms-ack"
                    className={`min-h-[56px] rounded-xl border-2 p-4 flex items-start sm:items-center gap-3.5 transition-all select-none ${!hasScrolledToBottom
                      ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-500'
                      : contractTermsAgreed
                        ? 'bg-emerald-50/90 border-emerald-700 ring-4 ring-emerald-700/15 shadow-sm cursor-pointer'
                        : 'bg-white border-emerald-600/50 hover:border-emerald-700 hover:bg-emerald-50/30 shadow-xs cursor-pointer'
                      }`}
                  >
                    <input
                      id="contract-terms-ack"
                      type="checkbox"
                      disabled={!hasScrolledToBottom}
                      checked={contractTermsAgreed}
                      onChange={(e) => {
                        if (!hasScrolledToBottom) return;
                        setContractTermsAgreed(e.target.checked);
                        if (stepError) setStepError('');
                      }}
                      className="w-5 h-5 mt-0.5 sm:mt-0 rounded accent-emerald-800 shrink-0 disabled:cursor-not-allowed cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug">
                      I have read and agree to the{' '}
                      <a
                        href="/terms"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewDoc('terms');
                        }}
                        className="text-emerald-800 underline hover:text-emerald-950 font-bold cursor-pointer"
                      >
                        Terms of Use
                      </a>{' '}
                      and{' '}
                      <a
                        href="/privacy"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPreviewDoc('privacy');
                        }}
                        className="text-emerald-800 underline hover:text-emerald-950 font-bold cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                      , including fuel replacement rules and the ${depositAmount} USD card deposit hold conditions.
                    </span>
                  </label>



                  {/* Digital Signature Box (Type Full Name or Draw Signature) */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">

                        {hasScrolledToBottom ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                            <span>✓ Agreement viewed in full</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Scroll to bottom of contract to unlock signature</span>
                          </span>
                        )}
                      </div>

                      {customerInfo.fullName.trim() && !contractSignature && (
                        <button
                          type="button"
                          disabled={!hasScrolledToBottom}
                          onClick={() => {
                            if (!hasScrolledToBottom) return;
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
                          className={`text-xs font-semibold transition-colors ${!hasScrolledToBottom
                            ? 'opacity-50 cursor-not-allowed text-gray-400'
                            : 'text-emerald-800 hover:text-emerald-950 underline cursor-pointer'
                            }`}
                        >
                          Quick-fill &ldquo;{customerInfo.fullName.trim()}&rdquo;
                        </button>
                      )}
                    </div>

                    <SignaturePad
                      key={sigFillVersion}
                      label="Digital Contract Signature"
                      sublabel={
                        !hasScrolledToBottom
                          ? 'Please scroll to the bottom of the agreement above to unlock signature'
                          : 'Type full name to sign, or switch to Draw to sign on screen'
                      }
                      initialMode="type"
                      disabled={!hasScrolledToBottom}
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
                      className={`min-h-[50px] px-7 py-3 rounded-xl font-bold text-base shadow-sm transition-all ${!hasScrolledToBottom
                        ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-700'
                        : 'bg-emerald-900 hover:bg-emerald-800 active:scale-[0.99] text-white cursor-pointer'
                        }`}
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
                  dropLocation={effectiveDropLocation.name}
                  pickupFee={safePickupFee}
                  dropFee={safeDropFee}
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
                        pickupFee: safePickupFee,
                        dropFee: safeDropFee,
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

      {/* Quick Non-Destructive In-Modal Preview for Terms of Use or Privacy Policy */}
      {previewDoc && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200">
            <div className="p-3.5 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50 gap-3 shrink-0">
              <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
                {previewDoc === 'terms' ? 'Terms of Use & Rental Guidelines' : 'Privacy Policy & Data Protection (JDPA 2020)'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <span>Back to Step 3</span>
              </button>
            </div>
            <div className="overflow-y-auto">
              {previewDoc === 'terms' ? (
                <TermsOfUse
                  onNavigateHome={() => setPreviewDoc(null)}
                  backLabel="Back to Step 3 (Rental Agreement)"
                />
              ) : (
                <PrivacyPolicy
                  onNavigateHome={() => setPreviewDoc(null)}
                  backLabel="Back to Step 3 (Rental Agreement)"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
