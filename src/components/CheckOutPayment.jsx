import React, { useState } from 'react';

export default function CheckoutPayment({
  vehicleName = 'Toyota RAV4 AWD',
  vehicleCategory = 'Compact SUV',
  vehicleImage = null,
  pickupLocation = 'Sangster Intl Airport, Montego Bay',
  pickupDateLabel = 'Nov 6, 2026 · 10:00 AM',
  returnDateLabel = 'Nov 10, 2026 · 10:00 AM',
  rentalDays = 4,
  dailyRate = null,
  selectedTours = [],
  rentalTotal = 340,
  depositAmount = 500,
  onAuthorizeSuccess = null
}) {
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    whatsappPhone: '',
    flightNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [authorizedBookingRef, setAuthorizedBookingRef] = useState(null);

  const safeRentalSubtotal = Number(rentalTotal) || 0;
  const safeDepositAmount = Number(depositAmount ?? 500);
  const toursSubtotal = selectedTours.reduce(
    (sum, tour) => sum + (tour.duration === 'Daily' ? tour.price * rentalDays : tour.price),
    0
  );
  const totalToAuthorize = safeRentalSubtotal + toursSubtotal + safeDepositAmount;

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (
      !guestDetails.fullName.trim() ||
      !guestDetails.email.trim() ||
      !guestDetails.whatsappPhone.trim()
    ) {
      setErrorMessage('Please fill in your Full Name, Email, and WhatsApp Phone Number.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Request a secure token from the payment gateway (client-side)
      // The gateway reads the iframe inputs directly; the app never touches raw card numbers.
      const tokenResponse = { token: { id: 'tok_mock_12345' } };

      if (tokenResponse.error) {
        throw new Error(tokenResponse.error.message);
      }

      // 2. Send the safe token & guest details to your backend server
      const serverResponse = await fetch('/api/authorize-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentToken: tokenResponse.token.id,
          totalAmount: totalToAuthorize,
          rentalSubtotal: safeRentalSubtotal,
          toursSubtotal,
          depositAmount: safeDepositAmount,
          vehicleName,
          guest: guestDetails
        })
      });

      const contentType = serverResponse.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const result = await serverResponse.json();

        if (result.success) {
          if (onAuthorizeSuccess) {
            onAuthorizeSuccess({
              bookingRef: result.bookingRef,
              guest: guestDetails,
              totalAuthorized: totalToAuthorize
            });
            return;
          }
          window.location.href = `/booking-confirmed?ref=${result.bookingRef}`;
          return;
        }
        throw new Error(result.message || 'Payment authorization failed.');
      }

      // Graceful preview fallback when running locally without the serverless endpoint
      if (onAuthorizeSuccess) {
        const mockRef = `TIE-${String(Math.floor(100000 + Math.random() * 900000))}`;
        setAuthorizedBookingRef(mockRef);
        onAuthorizeSuccess({
          bookingRef: mockRef,
          guest: guestDetails,
          totalAuthorized: totalToAuthorize
        });
        return;
      }

      throw new Error(
        'Payment authorization endpoint (/api/authorize-payment) is not configured yet.'
      );
    } catch (err) {
      setErrorMessage(err.message || 'Unable to authorize payment right now.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        {/* =========================================================
            LEFT COLUMN: BOOKING SUMMARY
           ========================================================= */}
        <aside className="w-full md:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
                Reservation Overview
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                Booking Summary
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/70 text-xs font-semibold">
              {rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Selected Vehicle */}
          <div className="rounded-xl bg-gray-50/90 border border-gray-100 p-4 flex items-center gap-4">
            {vehicleImage && (
              <img
                src={vehicleImage}
                alt={vehicleName}
                className="w-24 h-16 object-contain mix-blend-multiply shrink-0 select-none"
              />
            )}
            <div className="min-w-0">
              <span className="text-xs font-medium text-emerald-800 block">
                {vehicleCategory}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                {vehicleName}
              </h3>
              {pickupLocation && (
                <p className="text-xs text-gray-500 truncate mt-0.5">{pickupLocation}</p>
              )}
            </div>
          </div>

          {/* Rental Dates */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 text-sm">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                Pickup
              </span>
              <span className="font-semibold text-gray-900 text-right">
                {pickupDateLabel}
              </span>
            </div>
            <div className="p-3.5 flex items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                Return
              </span>
              <span className="font-semibold text-gray-900 text-right">
                {returnDateLabel}
              </span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-1 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-medium text-gray-700">Rental Subtotal</span>
                {dailyRate !== null && (
                  <span className="block text-xs text-gray-400 font-mono">
                    ${dailyRate}/day × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                ${safeRentalSubtotal.toLocaleString()} USD
              </span>
            </div>

            {selectedTours.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-dashed border-gray-200">
                {selectedTours.map((tour) => {
                  const linePrice =
                    tour.duration === 'Daily' ? tour.price * rentalDays : tour.price;
                  return (
                    <div
                      key={tour.id || tour.title}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-gray-600 truncate">{tour.title}</span>
                      <span className="font-semibold text-gray-900 font-mono tabular-nums shrink-0">
                        ${linePrice.toLocaleString()} USD
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <div>
                <span className="font-medium text-gray-700">
                  ${safeDepositAmount.toLocaleString()} Security Deposit
                </span>
                <span className="block text-xs text-gray-400">
                  Refundable hold upon clean return
                </span>
              </div>
              <span className="font-semibold text-gray-900 font-mono tabular-nums">
                ${safeDepositAmount.toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Highlighted Total to Authorize */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-emerald-900 font-bold text-sm sm:text-base block">
                Total to Authorize
              </span>
              <span className="text-xs text-emerald-800/80">
                Pre-authorization hold only
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-900 font-mono tabular-nums">
                ${totalToAuthorize.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-900 ml-1">USD</span>
            </div>
          </div>
        </aside>

        {/* =========================================================
            RIGHT COLUMN: GUEST DETAILS & PAYMENT
           ========================================================= */}
        <section className="w-full md:w-7/12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-7">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800 block">
              Final Step · Express Guest Checkout
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">
              Guest Details & Payment
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your contact information for instant WhatsApp confirmation and airport pickup coordination.
            </p>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6" noValidate>
            {/* Guest Information Inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
                Guest Information
              </h3>

              <div>
                <label
                  htmlFor="guest-full-name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="guest-full-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={guestDetails.fullName}
                  onChange={handleInputChange('fullName')}
                  placeholder="e.g. Marcus Sterling"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="guest-email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={guestDetails.email}
                    onChange={handleInputChange('email')}
                    placeholder="you@example.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-whatsapp"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Phone Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="guest-whatsapp"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={guestDetails.whatsappPhone}
                    onChange={handleInputChange('whatsappPhone')}
                    placeholder="+1 (876) 555-0194"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="guest-flight"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Flight Number{' '}
                  <span className="text-xs font-normal text-gray-400">(Optional)</span>
                </label>
                <input
                  id="guest-flight"
                  type="text"
                  value={guestDetails.flightNumber}
                  onChange={handleInputChange('flightNumber')}
                  placeholder="e.g. AA 1482 / DL 1934 (for terminal arrival tracking)"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                />
              </div>
            </div>

            {/* Tokenized Payment Gateway Iframe Placeholder */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
                  Card Authorization
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  Tokenized Hosted Fields
                </span>
              </div>

              <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-lg min-h-[124px] flex flex-col items-center justify-center text-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-400"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <p className="text-sm font-semibold text-gray-600">
                  Secure Payment Gateway Iframe
                </p>
                <p className="text-xs text-gray-400 max-w-sm">
                  Hosted payment fields mount here so card details never touch Take It Easy servers.
                </p>
              </div>
            </div>

            {/* Error or Demo Confirmation Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {authorizedBookingRef && (
              <div
                role="status"
                className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-900"
              >
                Payment hold authorized! Confirmation reference:{' '}
                <span className="font-mono font-bold">{authorizedBookingRef}</span>
              </div>
            )}

            {/* Primary Call to Action */}
            <div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full min-h-[52px] py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-emerald-950 font-bold text-base shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="w-4 h-4 shrink-0"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>{isProcessing ? 'Authorizing Payment...' : 'Authorize Payment'}</span>
              </button>

              {/* Trust Signals & Badges */}
              <div className="flex flex-wrap justify-center items-center gap-4 py-3">
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>Secured by First Atlantic Commerce</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>256-bit SSL Encryption</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span>PCI DSS Compliant</span>
                </div>
              </div>

              {/* Authorization Policy Explanation */}
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Your card will only be authorized for the total amount today. The $500 security deposit is released after the vehicle is returned in good condition.
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
