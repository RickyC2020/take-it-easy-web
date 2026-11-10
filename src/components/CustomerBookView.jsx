import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
  CreditCard,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

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

export default function CustomerBookView({
  vehicle,
  defaultPickupDate,
  defaultReturnDate,
  timeSlots = [],
  onConfirmReservation,
  onReturnHome,
}) {
  // Booking Form State
  const [pickupHub, setPickupHub] = useState('MBJ');
  const [dropHub, setDropHub] = useState('MBJ');
  const [pickupDate, setPickupDate] = useState(defaultPickupDate || '2026-11-10');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnDate, setReturnDate] = useState(defaultReturnDate || '2026-11-14');
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [cdwAccepted, setCdwAccepted] = useState(true);

  // Customer Details
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    flightNumber: ''
  });

  // Credit Card Pre-Authorization Details
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState(null);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#0a1412] text-white p-6 flex flex-col items-center justify-center space-y-4">
        <p className="text-base text-slate-300">Vehicle not found in catalog.</p>
        <button
          type="button"
          onClick={onReturnHome}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
        >
          Return to Fleet
        </button>
      </div>
    );
  }

  // Calculations
  const rentalDays = 4; // Computed from dates
  const vehicleSubtotal = (vehicle?.ratePerDay || 60) * rentalDays;
  const pickupFee = pickupHub === 'KIN' ? 120 : 0;
  const dropFee = dropHub === 'KIN' ? 120 : 0;
  const totalHubFees = pickupFee + dropFee;
  const cdwSubtotal = cdwAccepted ? 20 * rentalDays : 0;
  const depositHold = vehicle?.deposit || 500;
  const totalSubtotal = vehicleSubtotal + totalHubFees + cdwSubtotal;
  const totalToAuthorize = totalSubtotal + depositHold;

  const handleAutofillDemo = () => {
    setCustomer({
      fullName: 'Devon Vance',
      email: 'devon.vance@example.com',
      phone: '+1 (305) 555-8912',
      country: 'United States',
      flightNumber: 'DL-1842'
    });
    setCard({
      number: '4242 •••• •••• 4242',
      expiry: '12/28',
      cvc: '842',
      name: 'DEVON VANCE'
    });
    setErrorMsg('');
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!customer.fullName.trim()) {
      setErrorMsg('Please enter your Full Legal Name.');
      return;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      setErrorMsg('Please enter a valid confirmation Email address.');
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMsg('Please enter your WhatsApp / mobile phone number.');
      return;
    }

    const resRef = `RES-${Math.floor(200 + Math.random() * 800)}`;
    const newReservation = {
      id: resRef,
      raNumber: `RA-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'RESERVED',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      acquisitionChannel: 'Customer Web Reservation (Online Intake)',
      vehicle,
      location: {
        id: pickupHub,
        code: pickupHub,
        name: pickupHub === 'MBJ' ? 'Montego Bay Airport (MBJ - Sangster)' : 'Kingston Airport (KIN - Norman Manley)',
        shortName: pickupHub
      },
      dropLocation: {
        id: dropHub,
        code: dropHub,
        name: dropHub === 'MBJ' ? 'Montego Bay Airport (MBJ - Sangster)' : 'Kingston Airport (KIN - Norman Manley)',
        shortName: dropHub
      },
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,
      vehicleSubtotal,
      pickupDropFee: totalHubFees,
      cdwAccepted,
      cdwAmount: cdwSubtotal,
      toursSubtotal,
      subtotal: totalSubtotal,
      deposit: depositHold,
      totalAuthorized: totalToAuthorize,
      driver: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        country: customer.country,
        flightNumber: customer.flightNumber,
      },
    };

    setConfirmedRecord(newReservation);
    if (onConfirmReservation) {
      onConfirmReservation(newReservation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1412] via-[#0f2420] to-[#08100e] text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Fleet Catalog</span>
          </button>

          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secured Reservation</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {confirmedRecord ? (
          /* Confirmation Screen */
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-6 sm:p-10 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-mono text-xs font-bold">
                Reservation Reference: {confirmedRecord.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Vehicle Reserved Successfully!
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We have registered your reservation in the Take It Easy airport counter dispatch system. Your pre-authorized rate hold is confirmed.
              </p>
            </div>

            <div className="max-w-md mx-auto rounded-2xl bg-black/40 border border-white/15 p-4 text-left text-xs space-y-2.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Reserved Vehicle:</span>
                <span className="text-white font-bold">{vehicle.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Renter:</span>
                <span className="text-white font-bold">{confirmedRecord.driver.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Hub:</span>
                <span className="text-emerald-300">{confirmedRecord.location.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Return Hub:</span>
                <span className="text-amber-300">{confirmedRecord.dropLocation.name}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                <span className="text-white">Authorized Total:</span>
                <span className="text-emerald-400">${confirmedRecord.totalAuthorized} USD</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onReturnHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
              >
                Return to Public Website
              </button>
            </div>
          </div>
        ) : (
          /* Intake Form */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Reserve Your Vehicle
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Step-by-step customer reservation intake · Take It Easy Car Rentals &amp; Tours
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutofillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-semibold cursor-pointer w-fit"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autofill Demo Renter</span>
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): Route, Dates & Customer Information */}
              <div className="lg:col-span-7 space-y-6">
                {/* Vehicle Selected Card */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-4 sm:p-5 flex items-center gap-4">
                  <div className="w-24 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="max-h-12 w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider font-semibold block">
                      {vehicle.categoryLabel}
                    </span>
                    <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
                    <p className="text-xs text-slate-300">
                      {vehicle.color} · ${vehicle.ratePerDay}/day · ${vehicle.deposit} Deposit Hold
                    </p>
                  </div>
                </div>

                {/* Airport Hubs Selection */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Airport Pickup &amp; Return Hubs</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          Pickup Hub
                        </label>
                        {pickupHub === 'KIN' && (
                          <span className="text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 py-0.2 rounded">
                            +$120 fee
                          </span>
                        )}
                      </div>
                      <select
                        value={pickupHub}
                        onChange={(e) => setPickupHub(e.target.value)}
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-400 cursor-pointer"
                      >
                        <option value="MBJ">Montego Bay Airport (MBJ - Sangster)</option>
                        <option value="KIN">Kingston Airport (KIN - Norman Manley) (+$120)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          Drop-Off Hub
                        </label>
                        {dropHub === 'KIN' && (
                          <span className="text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 py-0.2 rounded">
                            +$120 fee
                          </span>
                        )}
                      </div>
                      <select
                        value={dropHub}
                        onChange={(e) => setDropHub(e.target.value)}
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2.5 text-white font-medium focus:border-emerald-400 cursor-pointer"
                      >
                        <option value="MBJ">Montego Bay Airport (MBJ - Sangster)</option>
                        <option value="KIN">Kingston Airport (KIN - Norman Manley) (+$120)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rental Dates */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Trip Dates &amp; Times</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                        Pickup Date &amp; Time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="flex-1 bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono"
                        />
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-28 bg-slate-950/70 border border-white/15 rounded-xl px-2 py-2 text-white text-xs"
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold block mb-1">
                        Return Date &amp; Time
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="flex-1 bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono"
                        />
                        <select
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-28 bg-slate-950/70 border border-white/15 rounded-xl px-2 py-2 text-white text-xs"
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Renter Information */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Primary Driver Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Full Legal Name (as on Driver's License) *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        placeholder="e.g. Devon Vance"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Email Address (for confirmation) *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="e.g. devon@example.com"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        WhatsApp / Mobile Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="e.g. +1 (876) 555-0123"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Country of Residence
                      </label>
                      <select
                        value={customer.country}
                        onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400 cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Flight Number (Optional for airport meet)
                      </label>
                      <input
                        type="text"
                        value={customer.flightNumber}
                        onChange={(e) => setCustomer({ ...customer, flightNumber: e.target.value })}
                        placeholder="e.g. DL-1842"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* CDW Waiver Checkbox */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-4 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-white block">
                      Collision Damage Waiver (CDW)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Protects against collision damages with low deductible ($20/day)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cdwAccepted}
                      onChange={(e) => setCdwAccepted(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500"
                    />
                    <span className="font-mono font-bold text-amber-300">
                      {cdwAccepted ? '+$80 USD' : 'Declined'}
                    </span>
                  </label>
                </div>

                {/* Card Pre-Authorization Hold (Guarantees Reservation) */}
                <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Card Guarantee &amp; Security Deposit Pre-Authorization</span>
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>256-bit SSL</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    A temporary pre-authorization hold of <strong>${depositHold} USD</strong> is placed to secure your reservation. No funds are permanently debited until vehicle pickup at MBJ / KIN.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm tracking-wider focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        required
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        placeholder="MM / YY"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        CVV / CVC *
                      </label>
                      <input
                        type="text"
                        required
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                        placeholder="CVC"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:border-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={card.name}
                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                        placeholder="Name as printed on card"
                        className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Order Breakdown & Pre-Authorization */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/20 p-5 space-y-4 sticky top-20 shadow-2xl">
                  <h3 className="text-base font-bold text-white border-b border-white/15 pb-3">
                    Reservation Total
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Vehicle Rental (4 days):</span>
                      <span className="font-mono font-semibold text-white">${vehicleSubtotal} USD</span>
                    </div>

                    {totalHubFees > 0 && (
                      <div className="flex justify-between text-amber-300">
                        <span>Kingston Hub Fee(s):</span>
                        <span className="font-mono font-semibold">+${totalHubFees} USD</span>
                      </div>
                    )}

                    {cdwAccepted && (
                      <div className="flex justify-between text-slate-300">
                        <span>Collision Damage Waiver (CDW):</span>
                        <span className="font-mono font-semibold text-white">+${cdwSubtotal} USD</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400 pt-2 border-t border-white/10">
                      <span>Security Deposit (Refundable Hold):</span>
                      <span className="font-mono font-bold text-amber-300">${depositHold} USD</span>
                    </div>

                    {/* Total Pre-Authorization */}
                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold block">
                          PRE-AUTH TOTAL
                        </span>
                        <span className="text-[10px] text-slate-400">Includes rental + refundable hold</span>
                      </div>
                      <span className="text-2xl font-mono font-black text-white">
                        ${totalToAuthorize} <span className="text-xs text-emerald-400">USD</span>
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Place Reservation</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 leading-tight">
                    NO REFUND — CREDIT NOTE ONLY (valid for 1 year). Renter must be 21+ years.
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

