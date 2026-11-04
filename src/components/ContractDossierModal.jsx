import React, { useState } from 'react';
import { X, Printer, FileCheck2 } from 'lucide-react';

function SignatureDisplay({ signature, fallbackName }) {
  if (!signature) {
    return <span className="text-xs font-mono text-slate-400">Not signed</span>;
  }
  if (signature.mode === 'draw' && signature.dataUrl) {
    return (
      <div className="flex items-end justify-between gap-3 pt-1">
        <img
          src={signature.dataUrl}
          alt="Renter signature"
          className="h-12 print:h-10 object-contain mix-blend-multiply"
        />
        <span className="text-xs print:text-[10px] font-mono text-slate-500 shrink-0">
          {signature.signedAt}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-end justify-between gap-3 pt-1">
      <span className="text-xl print:text-lg italic font-serif text-brand-ink">
        {signature.text || fallbackName}
      </span>
      <span className="text-xs print:text-[10px] font-mono text-slate-500 shrink-0">
        {signature.signedAt}
      </span>
    </div>
  );
}

export default function ContractDossierModal({ booking, onClose }) {
  const [copyType, setCopyType] = useState('customer'); // 'customer' | 'office'

  if (!booking) return null;

  const {
    id,
    vehicle,
    location,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    rentalDays,
    subtotal,
    deposit,
    rentalPaymentMethod,
    cardLast4,
    cardHolder,
    sendViaWhatsApp,
    driver,
    inspection,
    contract,
    returnAssessment
  } = booking;

  const handlePrint = () => {
    const previousTitle = document.title;
    const suffix = copyType === 'customer' ? 'Customer-Copy' : 'Office-Original';
    document.title = `TakeItEasy-Agreement-${id}-${suffix}`;
    window.print();
    document.title = previousTitle;
  };

  return (
    <div
      id="printable-contract-root"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-ink/38 backdrop-blur-md overflow-y-auto animate-fade-in print:static print:inset-auto print:z-auto print:block print:p-0 print:bg-white print:backdrop-blur-none print:overflow-visible"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Official Rental Agreement and Vehicle Check Sheet"
        className="w-full max-w-4xl bg-white/88 backdrop-blur-2xl border border-white/85 shadow-[0_24px_64px_rgba(16,32,34,0.22)] rounded-2xl overflow-hidden my-8 print:my-0 print:max-w-none print:w-full print:bg-white print:backdrop-blur-none print:shadow-none print:border print:border-slate-300 print:rounded-none print:overflow-visible"
      >
        {/* Screen-Only Brand Accent & Top Control Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-palm via-brand-teal to-brand-amber print:hidden" />

        <div className="px-6 py-4 border-b border-brand-ink/10 bg-white/55 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-brand-palm" />
            <span className="text-sm font-mono uppercase tracking-wider text-brand-ink font-semibold">
              Official Agreement &amp; Check Sheet · {id}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Customer Copy vs Office Original Switcher */}
            <div className="inline-flex rounded-xl glass-pill p-1 text-sm">
              <button
                type="button"
                onClick={() => setCopyType('customer')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  copyType === 'customer'
                    ? 'glass-cta text-white'
                    : 'text-slate-600 hover:text-brand-ink'
                }`}
              >
                Customer Copy
              </button>
              <button
                type="button"
                onClick={() => setCopyType('office')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  copyType === 'office'
                    ? 'glass-cta text-white'
                    : 'text-slate-600 hover:text-brand-ink'
                }`}
              >
                Office Original
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl glass-cta text-sm font-medium text-white inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl glass-pill text-slate-600 hover:text-brand-ink cursor-pointer"
              aria-label="Close document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Agreement & Check Sheet */}
        <div className="max-h-[80vh] overflow-y-auto divide-y divide-brand-border text-sm print:max-h-none print:overflow-visible print:divide-slate-300 print:text-[11.5px] print:leading-snug text-brand-ink">
          {/* Letterhead */}
          <div className="p-6 print:px-5 print:py-3.5 flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center gap-3.5">
              <img
                src="/logo.jpg?v=4"
                alt="Take It Easy Car Rentals & Tours"
                className="block h-auto max-h-16 sm:max-h-18 print:max-h-14 w-auto rounded-md bg-brand-header px-2.5 py-2 shrink-0 select-none self-start sm:self-auto"
              />
              <div>
                <p className="text-xs print:text-[11px] font-bold uppercase tracking-wider text-brand-ink">
                  Rental Agreement &amp; Vehicle Check Sheet
                </p>
                <p className="text-xs print:text-[10.5px] text-slate-500 mt-0.5">
                  {location.name}
                </p>
              </div>
            </div>

            <div className="sm:text-right print:text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded border border-slate-300 bg-slate-50 font-mono text-xs print:text-[10px] font-semibold uppercase text-brand-ink">
                {copyType === 'customer' ? 'CUSTOMER COPY' : 'OFFICE SIGNED ORIGINAL'}
              </span>
              <p className="font-mono font-semibold text-sm print:text-xs text-brand-ink tabular-nums">
                Agreement #: {id}
              </p>
              <p className="font-mono text-xs print:text-[10.5px] text-slate-600 tabular-nums">
                {pickupDate} ({pickupTime}) → {returnDate} ({returnTime}) · {rentalDays}d
              </p>
            </div>
          </div>

          {/* 1. Renter Information & 2. Vehicle & Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 divide-y md:divide-y-0 print:divide-y-0 md:divide-x print:divide-x divide-brand-border print:divide-slate-300">
            {/* 1. Renter Details */}
            <div className="p-5 print:px-5 print:py-3 space-y-2 print:space-y-1.5">
              <h2 className="text-xs print:text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                1. Renter Information
              </h2>
              <dl className="space-y-1.5 print:space-y-1">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Full Name:</dt>
                  <dd className="font-semibold text-right">{driver.fullName}</dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Date of Birth:</dt>
                  <dd>{driver.dob}</dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Driver’s License:</dt>
                  <dd className="text-right">
                    {driver.licenseNumber} (Exp: {driver.licenseExpiry})
                  </dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Contact Phone:</dt>
                  <dd>{driver.phone || '—'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 shrink-0">Email:</dt>
                  <dd className="text-right break-all">{driver.email}</dd>
                </div>
              </dl>
            </div>

            {/* 2. Vehicle & Charges */}
            <div className="p-5 print:px-5 print:py-3 space-y-2 print:space-y-1.5">
              <h2 className="text-xs print:text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                2. Vehicle &amp; Charges (USD)
              </h2>
              <dl className="space-y-1.5 print:space-y-1">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Vehicle:</dt>
                  <dd className="font-semibold text-right">
                    {vehicle.name} ({vehicle.categoryLabel})
                  </dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Daily Rate:</dt>
                  <dd>
                    ${vehicle.ratePerDay}.00 × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Rental Total:</dt>
                  <dd className="font-semibold">
                    ${subtotal}.00 ({rentalPaymentMethod.toUpperCase()})
                  </dd>
                </div>
                <div className="flex justify-between gap-3 font-mono tabular-nums">
                  <dt className="font-sans text-slate-500">Security Deposit:</dt>
                  <dd className="font-semibold">${deposit}.00 (Card Only · •••• {cardLast4})</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Cardholder:</dt>
                  <dd className="font-mono text-right">{cardHolder}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 3. Designated Vehicle Check Sheet */}
          <div className="p-5 print:px-5 print:py-3 space-y-2.5 print:space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs print:text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                3. Vehicle Condition Check Sheet (Outgoing)
              </h2>
              <span className="font-mono text-xs print:text-[10px] px-2 py-0.5 rounded border border-slate-300 bg-slate-50 font-semibold">
                {inspection.noExistingDamage
                  ? 'NO EXISTING DAMAGE'
                  : `NOTED ZONES: ${inspection.damagedZones.join(', ').toUpperCase()}`}
              </span>
            </div>

            <div className="p-3 print:p-2.5 rounded border border-brand-border print:border-slate-300 bg-brand-canvas/40 print:bg-white space-y-1.5 print:space-y-1">
              <p>
                <span className="font-semibold">Condition Notes:</span> {inspection.notes}
              </p>
              <p className="text-xs print:text-[10.5px] font-mono text-slate-600">
                Pre-Handoff Videos Recorded — Customer:{' '}
                <strong className="text-brand-ink">
                  {inspection.customerVideoRecorded ? 'Yes ✓' : 'No'}
                </strong>{' '}
                · Agent:{' '}
                <strong className="text-brand-ink">
                  {inspection.agentVideoRecorded ? 'Yes ✓' : 'No'}
                </strong>
              </p>
            </div>

            {/* Only include Return Inspection summary if the vehicle has actually been inspected upon return */}
            {returnAssessment?.inspected && (
              <div className="p-3 print:p-2.5 rounded border border-brand-border print:border-slate-300 bg-slate-50/70 print:bg-white space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs print:text-[10.5px] font-mono uppercase font-semibold text-slate-600">
                    Return Check Sheet &amp; Deposit Settlement
                  </span>
                  {returnAssessment.posRef && (
                    <span className="font-mono text-xs print:text-[10px] text-slate-600">
                      Ref: {returnAssessment.posRef}
                    </span>
                  )}
                </div>
                <p>
                  <span className="font-semibold">Return Finding:</span>{' '}
                  {returnAssessment.hasNewDamage
                    ? returnAssessment.damageDescription
                    : 'No new damage upon return.'}
                  {returnAssessment.isMajorDamage && returnAssessment.hasNewDamage
                    ? ` (Estimator: ${returnAssessment.professionalName})`
                    : ''}
                </p>
                <p className="font-mono text-xs print:text-[10.5px] tabular-nums">
                  Damage Estimate: <strong>${returnAssessment.estimateCost}.00 USD</strong> ·{' '}
                  {returnAssessment.settled
                    ? returnAssessment.estimateCost === 0
                      ? `Full $${deposit}.00 Deposit Released`
                      : returnAssessment.estimateCost > deposit
                        ? `$${deposit}.00 Deposit + $${returnAssessment.estimateCost - deposit}.00 POS Card Charge`
                        : `$${returnAssessment.estimateCost}.00 Charged to Deposit ($${deposit - returnAssessment.estimateCost}.00 Refunded)`
                    : 'Pending Settlement'}
                </p>
              </div>
            )}
          </div>

          {/* 4. Essential Rental Terms & Insurance Disclosure */}
          <div className="p-5 print:px-5 print:py-3 space-y-2 print:space-y-1.5">
            <h2 className="text-xs print:text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              4. Terms of Agreement &amp; Insurance Policy
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 print:space-y-1 text-slate-700 leading-relaxed print:leading-snug">
              <li>
                <strong className="text-brand-ink">Damage &amp; Accident Liability:</strong> The
                Renter is fully responsible for covering all collision, loss, or physical damages
                sustained by the rental vehicle during the rental period.
              </li>
              <li>
                <strong className="text-brand-ink">Third-Party Insurance Only:</strong> Company
                insurance covers third-party vehicles/property only in an accident and{' '}
                <strong className="text-brand-ink underline">
                  does NOT cover the rental vehicle
                </strong>
                .
              </li>
              <li>
                <strong className="text-brand-ink">Card Deposit &amp; POS Authorization:</strong>{' '}
                Cash is never accepted for the ${deposit}.00 USD security deposit. Renter authorizes
                charges to card •••• {cardLast4} to cover verified return damages, including POS
                charges for balances exceeding the initial ${deposit}.00 deposit.
              </li>
            </ol>
          </div>

          {/* 5. Signatures */}
          <div className="p-5 print:px-5 print:py-3.5 space-y-3 print:space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3">
              <div className="p-3 print:p-2.5 rounded border border-brand-border print:border-slate-300 bg-white">
                <span className="text-xs print:text-[10px] font-mono uppercase text-slate-500 block">
                  Check Sheet Confirmation Signature (Renter)
                </span>
                <SignatureDisplay
                  signature={inspection.checkSheetSignature}
                  fallbackName={driver.fullName}
                />
              </div>

              <div className="p-3 print:p-2.5 rounded border border-brand-border print:border-slate-300 bg-white">
                <span className="text-xs print:text-[10px] font-mono uppercase text-slate-500 block">
                  Rental Agreement Signature (Renter)
                </span>
                <SignatureDisplay
                  signature={contract?.contractSignature}
                  fallbackName={driver.fullName}
                />
              </div>
            </div>

            <p className="text-xs print:text-[10px] text-slate-500 text-center font-mono">
              Signed original retained by Take It Easy Car Rental · Customer copy delivered via{' '}
              {sendViaWhatsApp ? 'Email & WhatsApp' : 'Email'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
