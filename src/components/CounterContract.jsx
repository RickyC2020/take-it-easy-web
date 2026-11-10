import React, { useState } from 'react';
import {
  Printer,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  User,
} from 'lucide-react';

export default function CounterContract({
  reservation,
  onUpdateReservation,
  onProceedToInspection,
  onPrintContract,
  onBackToDashboard,
}) {
  const vehicle = reservation?.vehicle;
  const driver = reservation?.driver || {};
  const additionalDriver = reservation?.additionalDriver || {};

  // Local editable billing state
  const [rentalDays, setRentalDays] = useState(reservation?.rentalDays || 1);
  const [dailyRate, setDailyRate] = useState(
    reservation?.vehicleSubtotal
      ? Math.round(reservation.vehicleSubtotal / (reservation?.rentalDays || 1))
      : (vehicle?.ratePerDay || 60)
  );
  const [cdwAccepted, setCdwAccepted] = useState(reservation?.cdwAccepted !== false);
  const [pickupDropFee, setPickupDropFee] = useState(reservation?.pickupDropFee || 0);
  const [discount, setDiscount] = useState(reservation?.discount || 0);
  const [extraCharges, setExtraCharges] = useState(reservation?.extraCharges || 0);
  const [depositAmount, setDepositAmount] = useState(reservation?.deposit || 500);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#0a1412] text-white p-6 flex flex-col items-center justify-center space-y-4">
        <p className="text-base text-slate-300">Reservation record not found.</p>
        <button
          type="button"
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
        >
          Return to Counter Dashboard
        </button>
      </div>
    );
  }

  // Derived calculations
  const vehicleSubtotal = dailyRate * rentalDays;
  const cdwAmount = cdwAccepted ? rentalDays * 20 : 0;
  const taxableBase = Math.max(0, vehicleSubtotal + cdwAmount + pickupDropFee + extraCharges - discount);
  const salesTax = Math.round(taxableBase * 0.15); // 15% GCT
  const totalAmountDue = taxableBase + salesTax;

  const handleSaveAndProceed = () => {
    if (onUpdateReservation) {
      onUpdateReservation(reservation.id, {
        rentalDays,
        dailyRate,
        cdwAccepted,
        cdwAmount,
        pickupDropFee,
        discount,
        extraCharges,
        salesTax,
        subtotal: totalAmountDue,
        deposit: depositAmount,
      });
    }
    onProceedToInspection(reservation.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1412] via-[#0f2420] to-[#08100e] text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded">
                  {reservation.id}
                </span>
                <h1 className="text-sm sm:text-base font-bold text-white">
                  Rental Agreement &amp; Contract Billing
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Form · Take It Easy Car Rentals &amp; Tours Limited
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintContract(reservation)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-xs font-semibold text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Agreement</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndProceed}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
            >
              <span>Launch Inspection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Official Contract Header Notice */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>MANDATORY COMPANY POLICY &amp; EMERGENCY TERMS</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>NO REFUND — CREDIT NOTE ONLY</strong> (Credit note valid for 1 year). Renter must be at least <strong>21 years</strong> of age. In case of an accident or emergency, call <strong>119</strong> immediately. Renter assumes full liability for all tyre, rim, and parking/traffic damages.
            </p>
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">
            Montego Bay Hub
          </span>
        </div>

        {/* 2-Column Grid: Customer Information & Billing Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Customer & Vehicle Contract Dossier */}
          <div className="lg:col-span-7 space-y-6">
            {/* Assigned Vehicle Summary Card */}
            <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                  Vehicle Contract Handoff
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  RA No: {reservation.raNumber || `RA-2026-${reservation.id?.replace(/\D/g, '') || '08412'}`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={vehicle?.image}
                    alt={vehicle?.name}
                    className="max-h-12 w-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white">{vehicle?.name}</h3>
                  <p className="text-xs text-slate-400">{vehicle?.color} · {vehicle?.categoryLabel}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-300">
                    <span>Plate: {reservation.plateNo || '2489-HX'}</span>
                    <span>·</span>
                    <span>Lic Disc: {reservation.licDisc || 'LD-99214'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Pickup Hub</span>
                  <span className="text-white font-semibold">{reservation.location?.name || 'Montego Bay Airport (MBJ)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Return Hub</span>
                  <span className="text-white font-semibold">{reservation.dropLocation?.name || reservation.location?.name || 'Montego Bay Airport (MBJ)'}</span>
                </div>
              </div>
            </div>

            {/* Primary Renter Details */}
            <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>1. Primary Renter Identification</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">ID Verified</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={driver.fullName || driver.name || 'Marcus Sterling'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Date of Birth</label>
                  <input
                    type="text"
                    defaultValue={driver.dob || '1988-06-14'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={driver.email || 'guest@example.com'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">WhatsApp / Phone</label>
                  <input
                    type="text"
                    defaultValue={driver.phone || '+1 (876) 555-0199'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Home Address (City, State, Zip, Country)</label>
                  <input
                    type="text"
                    defaultValue={driver.address || '742 Evergreen Terrace, Miami, FL 33101, USA'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Local Jamaica Address / Hotel</label>
                  <input
                    type="text"
                    defaultValue={driver.localAddress || 'Half Moon Resort, Rose Hall, Montego Bay'}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Driver's License No. &amp; Expiry</label>
                  <input
                    type="text"
                    defaultValue={`${driver.licenseNumber || 'DL-994821'} (Exp: ${driver.licenseExpiry || '2028-11-20'})`}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Driver (Physical Form Requirement) */}
            <div className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <User className="w-4 h-4 text-amber-400" />
                <span>2. Additional Authorized Driver (Optional)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="None or Enter Full Name"
                    defaultValue={additionalDriver.fullName || ''}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">License No. &amp; Expiry</label>
                  <input
                    type="text"
                    placeholder="License Number"
                    defaultValue={additionalDriver.licenseNumber || ''}
                    className="w-full bg-slate-950/60 border border-white/15 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Editable Billing Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/20 p-5 space-y-5 sticky top-20 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Billing Breakdown</h3>
                  <span className="text-[11px] text-slate-400">Currency: USD ($)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  Card / Cash
                </span>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 text-xs">
                {/* Rate & Days */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Daily Rate ($)
                    </label>
                    <input
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Total Days
                    </label>
                    <input
                      type="number"
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Subtotal preview line */}
                <div className="flex justify-between text-slate-300 pt-1">
                  <span>Vehicle Rental Subtotal:</span>
                  <span className="font-mono font-semibold text-white">${vehicleSubtotal.toLocaleString()} USD</span>
                </div>

                {/* Hub Transfer Fee */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">
                      Pick-up / Drop-off Fee ($)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">KIN: $120 / MBJ: $0</span>
                  </div>
                  <input
                    type="number"
                    value={pickupDropFee}
                    onChange={(e) => setPickupDropFee(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-400"
                  />
                </div>

                {/* CDW Waiver Option */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-white block">CDW (Collision Damage Waiver)</span>
                    <span className="text-[11px] text-slate-400 block">$20.00 USD / day</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cdwAccepted}
                      onChange={(e) => setCdwAccepted(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                    />
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {cdwAccepted ? `+$${cdwAmount}` : 'Declined'}
                    </span>
                  </label>
                </div>

                {/* Extra Charges & Discount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Extra Charges ($)
                    </label>
                    <input
                      type="number"
                      value={extraCharges}
                      onChange={(e) => setExtraCharges(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* GCT Sales Tax */}
                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span>G.C.T. Sales Tax (15%):</span>
                  <span className="font-mono font-semibold text-white">+${salesTax.toLocaleString()} USD</span>
                </div>

                {/* Deposit */}
                <div className="flex justify-between items-center text-slate-300">
                  <div>
                    <span>Security Deposit (Hold):</span>
                    <span className="text-[10px] text-slate-500 block">Pre-auth on credit card</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value) || 0)}
                      className="w-20 bg-slate-900 border border-white/15 rounded-lg px-2 py-0.5 text-right font-mono font-bold text-amber-300 text-xs focus:border-emerald-400"
                    />
                    <span className="text-slate-400 font-mono text-[11px]">USD</span>
                  </div>
                </div>

                {/* Highlighted Total */}
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-bold block">
                      TOTAL DUE
                    </span>
                    <span className="text-[10px] text-slate-400">Exclusive of refundable hold</span>
                  </div>
                  <span className="text-2xl font-mono font-black text-white">
                    ${totalAmountDue.toLocaleString()} <span className="text-xs text-emerald-400">USD</span>
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleSaveAndProceed}
                className="w-full min-h-[46px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                <span>Save Billing &amp; Launch Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

