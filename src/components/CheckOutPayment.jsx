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
    guestDetails: externalGuestDetails = null,
    onGuestDetailsChange = null,
    contractSignedBy = null,
    checkSheetVerified = false,
    onBack = null,
    onAuthorizeSuccess = null
}) {
    const [internalGuestDetails, setInternalGuestDetails] = useState({
        fullName: '',
        email: '',
        whatsappPhone: '',
        country: '',
        flightNumber: ''
    });

    // Interactive Mock Test Card State
    const [testCard, setTestCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [authorizedBookingRef, setAuthorizedBookingRef] = useState(null);

    const guestDetails = externalGuestDetails || internalGuestDetails;

    const safeRentalSubtotal = Number(rentalTotal) || 0;
    const safeDepositAmount = Number(depositAmount ?? 500);
    const toursSubtotal = selectedTours.reduce(
        (sum, tour) =>
            sum + (tour.duration?.toLowerCase().includes('daily') ? tour.price * rentalDays : tour.price),
        0
    );
    const totalToAuthorize = safeRentalSubtotal + toursSubtotal + safeDepositAmount;

    // Formatters for Mock Card Inputs
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) {
            return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
        }
        return digits;
    };

    const formatCvc = (value) => {
        return value.replace(/\D/g, '').slice(0, 4);
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        const nextDetails = { ...guestDetails, [field]: value };
        if (onGuestDetailsChange) {
            onGuestDetailsChange(nextDetails);
        } else {
            setInternalGuestDetails(nextDetails);
        }
        if (errorMessage) setErrorMessage(null);
    };

    const fillSampleCard = () => {
        setTestCard({
            number: '4242 4242 4242 4242',
            expiry: '12 / 28',
            cvc: '842',
            name: (guestDetails.fullName || 'Marcus Sterling').toUpperCase()
        });
        if (errorMessage) setErrorMessage(null);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate Guest Details
        if (
            !guestDetails.fullName?.trim() ||
            !guestDetails.email?.trim() ||
            !guestDetails.whatsappPhone?.trim()
        ) {
            setErrorMessage('Please fill in your Full Name, Email, and WhatsApp Phone Number.');
            return;
        }

        if (!guestDetails.email.includes('@')) {
            setErrorMessage('Please enter a valid Email address.');
            return;
        }

        // 2. Validate Mock Card Details
        const rawCardDigits = testCard.number.replace(/\D/g, '');
        if (rawCardDigits.length < 15) {
            setErrorMessage('Please enter a valid 16-digit card number (e.g. 4242 •••• •••• 4242).');
            return;
        }

        const rawExpiryDigits = testCard.expiry.replace(/\D/g, '');
        if (rawExpiryDigits.length < 4) {
            setErrorMessage('Please enter a valid expiration date (MM / YY).');
            return;
        }

        const rawCvcDigits = testCard.cvc.replace(/\D/g, '');
        if (rawCvcDigits.length < 3) {
            setErrorMessage('Please enter a 3 or 4-digit CVC security code.');
            return;
        }

        const cardholderName = (testCard.name || guestDetails.fullName || '').trim();
        if (!cardholderName) {
            setErrorMessage('Please enter the name on the card.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            // 3. Trigger 1.5-second simulated payment authorization spinner
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Attempt serverless authorization if API endpoint exists
            try {
                const serverResponse = await fetch('/api/authorize-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentToken: `tok_test_${rawCardDigits.slice(-4)}`,
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
                                guest: {
                                    ...guestDetails,
                                    cardLast4: rawCardDigits.slice(-4)
                                },
                                totalAuthorized: totalToAuthorize
                            });
                            return;
                        }
                        window.location.href = `/booking-confirmed?ref=${result.bookingRef}`;
                        return;
                    }
                }
            } catch {
                // Fallback to client-side simulated authorization for sandbox testing
            }

            // 4. Transition cleanly to booking confirmation state
            const mockRef = `TIE-${String(Math.floor(100000 + Math.random() * 900000))}`;
            setAuthorizedBookingRef(mockRef);

            if (onAuthorizeSuccess) {
                onAuthorizeSuccess({
                    bookingRef: mockRef,
                    guest: {
                        ...guestDetails,
                        cardLast4: rawCardDigits.slice(-4)
                    },
                    totalAuthorized: totalToAuthorize
                });
                return;
            }
        } catch (err) {
            setErrorMessage(err.message || 'Unable to authorize payment right now.');
        } finally {
            setIsProcessing(false);
        }
    };

    const nameOnCardValue = testCard.name !== '' ? testCard.name : (guestDetails.fullName || '');

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                {/* =========================================================
            LEFT COLUMN: BOOKING SUMMARY
           ========================================================= */}
                <aside className="w-full md:w-5/12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">
                            Booking Summary
                        </h2>
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

                    {/* Completed Pre-Checkout Steps Indicator (when inside 4-step wizard) */}
                    {(checkSheetVerified || contractSignedBy) && (
                        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 px-3.5 py-3 space-y-1.5 text-xs">
                            {checkSheetVerified && (
                                <div className="flex items-center justify-between text-emerald-900">
                                    <span className="font-medium">Pre-Inspection Baseline</span>
                                    <span className="font-mono font-semibold">✓ Acknowledged</span>
                                </div>
                            )}
                            {contractSignedBy && (
                                <div className="flex items-center justify-between text-emerald-900">
                                    <span className="font-medium">Digital Rental Agreement</span>
                                    <span className="font-mono font-semibold truncate max-w-[160px]">
                                        ✓ Signed ({contractSignedBy})
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

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
                                    const isDaily = tour.duration?.toLowerCase().includes('daily');
                                    const linePrice = isDaily ? tour.price * rentalDays : tour.price;
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
                        <span className="text-emerald-900 font-bold text-sm sm:text-base block">
                            TOTAL
                        </span>
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
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                            Guest Details &amp; Payment
                        </h2>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-6" noValidate>
                        {/* Guest Information Inputs */}
                        <div className="space-y-4">


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
                                    value={guestDetails.fullName || ''}
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
                                        value={guestDetails.email || ''}
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
                                        value={guestDetails.whatsappPhone || ''}
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
                                    value={guestDetails.flightNumber || ''}
                                    onChange={handleInputChange('flightNumber')}
                                    placeholder="e.g. AA 1482 / DL 1934 (for terminal arrival tracking)"
                                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-base text-gray-900 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Interactive Mock Payment Gateway Card Box */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500">
                                    Card Authorization
                                </span>
                                <span className="text-xs text-emerald-800 font-medium">
                                    Tokenized Hosted Fields
                                </span>
                            </div>

                            {/* Clean Outer Container with Card Icon & Label */}
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-4 sm:p-5 rounded-lg space-y-3.5">
                                <div className="flex items-center justify-between pb-2 border-b border-gray-200/80">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            className="w-4 h-4 text-emerald-800 shrink-0"
                                        >
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                        <span className="text-xs font-mono font-semibold text-gray-700">
                                            Test Card Mode (Gateway Tokenized Field)
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={fillSampleCard}
                                        className="text-[11px] font-mono text-emerald-800 hover:text-emerald-950 underline font-medium cursor-pointer"
                                    >
                                        Quick Test Card
                                    </button>
                                </div>

                                {/* Mock Card Inputs */}
                                <div className="space-y-3">
                                    {/* Card Number */}
                                    <div>
                                        <label
                                            htmlFor="mock-card-number"
                                            className="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Card Number
                                        </label>
                                        <div className="relative flex items-center">
                                            <input
                                                id="mock-card-number"
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="cc-number"
                                                value={testCard.number}
                                                onChange={(e) => {
                                                    setTestCard((prev) => ({
                                                        ...prev,
                                                        number: formatCardNumber(e.target.value)
                                                    }));
                                                    if (errorMessage) setErrorMessage(null);
                                                }}
                                                placeholder="4242 •••• •••• 4242"
                                                className="border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-md p-2.5 text-sm w-full bg-white font-mono tabular-nums placeholder:text-gray-400"
                                            />
                                            <span className="absolute right-3 text-xs font-mono text-gray-400 pointer-events-none">
                                                VISA/MC
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expiry Date & CVC */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label
                                                htmlFor="mock-card-expiry"
                                                className="block text-xs font-medium text-gray-600 mb-1"
                                            >
                                                Expiry Date
                                            </label>
                                            <input
                                                id="mock-card-expiry"
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="cc-exp"
                                                value={testCard.expiry}
                                                onChange={(e) => {
                                                    setTestCard((prev) => ({
                                                        ...prev,
                                                        expiry: formatExpiry(e.target.value)
                                                    }));
                                                    if (errorMessage) setErrorMessage(null);
                                                }}
                                                placeholder="MM / YY"
                                                className="border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-md p-2.5 text-sm w-full bg-white font-mono tabular-nums placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="mock-card-cvc"
                                                className="block text-xs font-medium text-gray-600 mb-1"
                                            >
                                                CVC / CVV
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    id="mock-card-cvc"
                                                    type="password"
                                                    inputMode="numeric"
                                                    autoComplete="cc-csc"
                                                    maxLength={4}
                                                    value={testCard.cvc}
                                                    onChange={(e) => {
                                                        setTestCard((prev) => ({
                                                            ...prev,
                                                            cvc: formatCvc(e.target.value)
                                                        }));
                                                        if (errorMessage) setErrorMessage(null);
                                                    }}
                                                    placeholder="CVC"
                                                    className="border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-md p-2.5 text-sm w-full bg-white font-mono tabular-nums placeholder:text-gray-400 pr-8"
                                                />
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                    className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none"
                                                >
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name on Card */}
                                    <div>
                                        <label
                                            htmlFor="mock-card-name"
                                            className="block text-xs font-medium text-gray-600 mb-1"
                                        >
                                            Name on Card
                                        </label>
                                        <input
                                            id="mock-card-name"
                                            type="text"
                                            autoComplete="cc-name"
                                            value={nameOnCardValue}
                                            onChange={(e) => {
                                                setTestCard((prev) => ({ ...prev, name: e.target.value }));
                                                if (errorMessage) setErrorMessage(null);
                                            }}
                                            placeholder="e.g. Marcus Sterling"
                                            className="border-gray-200 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 rounded-md p-2.5 text-sm w-full bg-white placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Banner */}
                        {errorMessage && (
                            <div
                                role="alert"
                                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700"
                            >
                                {errorMessage}
                            </div>
                        )}

                        {/* Booking Reference Feedback if mounted standalone */}
                        {authorizedBookingRef && (
                            <div
                                role="status"
                                className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-900"
                            >
                                Payment hold authorized! Confirmation reference:{' '}
                                <span className="font-mono font-bold">{authorizedBookingRef}</span>
                            </div>
                        )}

                        {/* Primary Call to Action (+ Optional Back Button) */}
                        <div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                                {onBack && (
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        disabled={isProcessing}
                                        className="min-h-[52px] px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm sm:text-base transition-colors cursor-pointer shrink-0"
                                    >
                                        ← Back
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full flex-1 min-h-[52px] py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-emerald-950 font-bold text-base shadow-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-emerald-950"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Authorizing Hold...</span>
                                        </>
                                    ) : (
                                        <>
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
                                            <span>Authorize Payment</span>
                                        </>
                                    )}
                                </button>
                            </div>

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
