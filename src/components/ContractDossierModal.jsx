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
          alt="Signature"
          className="h-12 print:h-9 object-contain mix-blend-multiply"
        />
        <span className="text-xs print:text-[9.5px] font-mono text-slate-500 shrink-0">
          {signature.signedAt}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-end justify-between gap-3 pt-1">
      <span className="text-lg print:text-base italic font-serif text-brand-ink font-semibold">
        {signature.text || fallbackName}
      </span>
      <span className="text-xs print:text-[9.5px] font-mono text-slate-500 shrink-0">
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
    raNumber = `RA-${id?.replace(/[^0-9]/g, '') || '508412'}`,
    vehicle = {},
    plateNo = '2489-HX',
    licDisc = 'LD-99214',
    location = { name: 'Montego Bay Airport (MBJ - Sangster International Airport)', shortName: 'Montego Bay Airport (MBJ)' },
    dropLocation = location,
    pickupDate,
    pickupTime = '10:00 AM',
    returnDate,
    returnTime = '10:00 AM',
    rentalDays = 1,
    toursTotal = 0,
    subtotal = 0,
    deposit = 500,
    mileageOut = 48210,
    mileageIn = 48690,
    fuelLevelOut = 'F',
    fuelLevelIn = 'F',
    tpiAmount = 0,
    cdwAmount = 80,
    cdwAccepted = true,
    discount = 0,
    extraCharges = 0,
    fuelCharges = 0,
    pickupDropFee = 0,
    extraHours = 0,
    salesTax = 0,
    rentalPaymentMethod = 'cash',
    sendViaWhatsApp = true,
    driver = {},
    additionalDriver = {},
    inspection = {},
    contract = {},
    returnAssessment = {}
  } = booking;

  const handlePrint = () => {
    const previousTitle = document.title;
    const suffix = copyType === 'customer' ? 'Customer-Copy' : 'Office-Original';
    document.title = `TakeItEasy-Agreement-${id}-${suffix}`;
    window.print();
    document.title = previousTitle;
  };

  const tyres = inspection.tyres || {
    type: 'Radial Tubeless',
    size: '185/65 R15',
    frontLeft: 'New',
    frontRight: 'New',
    rearLeft: '1/4 Worn',
    rearRight: '1/4 Worn',
    spare: 'New'
  };

  const checklist = inspection.checklist || {
    hubCaps: 'O.K.',
    bodyDamage: inspection.noExistingDamage ? 'None' : 'Yes',
    emblems: 'O.K.',
    trunkMat: 'O.K.',
    tools: 'O.K.',
    backBoard: 'O.K.',
    mats: '4',
    headRests: 'O.K.',
    babySeatCount: '0',
    babySeatCondition: 'N/A'
  };

  const dailyRateVal = vehicle.ratePerDay || Math.round(subtotal / (rentalDays || 1));
  const grandTotalDue = subtotal + toursTotal + extraCharges + fuelCharges + pickupDropFee;
  const balanceDue = Math.max(0, grandTotalDue - subtotal);

  return (
    <div
      id="printable-contract-root"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-brand-ink/45 backdrop-blur-md overflow-y-auto animate-fade-in print:static print:inset-auto print:z-auto print:block print:p-0 print:bg-white print:backdrop-blur-none print:overflow-visible"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Take It Easy Official Rental Agreement and Vehicle Check Sheet"
        className="w-full max-w-4xl bg-white backdrop-blur-2xl border border-slate-200 shadow-2xl rounded-2xl overflow-hidden my-6 print:my-0 print:max-w-none print:w-full print:bg-white print:backdrop-blur-none print:shadow-none print:border-none print:rounded-none print:overflow-visible"
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 print:hidden" />

        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-emerald-700" />
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold block">
                Official Rental Agreement &amp; Check Sheet
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                R.A. No: {raNumber} · ID: {id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-200 p-1 text-xs">
              <button
                type="button"
                onClick={() => setCopyType('customer')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  copyType === 'customer'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Customer Copy
              </button>
              <button
                type="button"
                onClick={() => setCopyType('office')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  copyType === 'office'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Office Original
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
              aria-label="Close document"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Contract & Inspection Check Sheet Body */}
        <div className="max-h-[85vh] overflow-y-auto divide-y divide-slate-300 text-xs sm:text-[13px] print:max-h-none print:overflow-visible print:divide-slate-300 print:text-[10px] print:leading-tight text-slate-900">
          
          {/* Header & Letterhead */}
          <div className="p-5 print:p-3 bg-gradient-to-b from-slate-50 to-white">
            <div className="flex flex-col sm:flex-row print:flex-row sm:items-center print:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/logo.jpg?v=4"
                  alt="Take It Easy Car Rentals & Tours Limited"
                  className="block h-auto max-h-16 sm:max-h-20 print:max-h-12 w-auto rounded-md bg-[#123024] p-1.5 shrink-0"
                />
                <div>
                  <h1 className="text-base sm:text-lg print:text-sm font-extrabold uppercase tracking-wide text-slate-900">
                    Take It Easy Car Rentals &amp; Tours Limited
                  </h1>
                  <p className="text-xs print:text-[9.5px] text-slate-600 font-medium">
                    80c Queen&apos;s Drive, Montego Bay, St. James, Jamaica
                  </p>
                  <p className="text-xs print:text-[9.5px] text-slate-600 font-mono mt-0.5">
                    Tel: (876) 885-2355 / (876) 789-9051 · Emergency: Call 119
                  </p>
                  <p className="text-[11px] print:text-[9px] text-emerald-800 font-semibold mt-0.5">
                    Official Rental Agreement &amp; Vehicle Check Sheet
                  </p>
                </div>
              </div>

              <div className="sm:text-right print:text-right space-y-1 font-mono text-xs print:text-[9.5px]">
                <span className="inline-block px-2.5 py-0.5 rounded border border-slate-300 bg-white font-semibold text-[10px] print:text-[8.5px] uppercase tracking-wider text-slate-800">
                  {copyType === 'customer' ? 'CUSTOMER COPY' : 'OFFICE ORIGINAL (RETAINED)'}
                </span>
                <p className="font-bold text-slate-900">
                  R.A. No: <span className="text-emerald-800">{raNumber}</span>
                </p>
                <p className="text-slate-600">Agreement ID: {id}</p>
                <p className="text-slate-700 font-sans">
                  <strong>Pickup:</strong> {pickupDate} ({pickupTime}) · {location.compactName || location.shortName}
                </p>
                <p className="text-slate-700 font-sans">
                  <strong>Return Due:</strong> {returnDate} ({returnTime}) · {dropLocation.compactName || dropLocation.shortName}
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Renter & Additional Driver Details */}
          <div className="p-4 print:p-2.5 space-y-2">
            <h2 className="text-xs print:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900/20 pb-1 flex items-center justify-between">
              <span>1. Renter &amp; Additional Driver Details</span>
              <span className="text-[10px] print:text-[8.5px] font-normal text-slate-500 font-sans">Mandatory ID Verification</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3">
              {/* Primary Renter */}
              <div className="p-3 print:p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] print:text-[9px] font-mono font-bold uppercase text-slate-500 block">
                  Primary Renter (Account Holder)
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs print:text-[9.5px]">
                  <div>
                    <span className="text-slate-500 block">First &amp; Last Name:</span>
                    <strong className="text-slate-900">{driver.fullName || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth:</span>
                    <span className="font-mono">{driver.dob || '—'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Permanent Home Address (City, State, Zip):</span>
                    <span>{driver.homeAddress || '142 Palm Crest Way, Fort Lauderdale, FL 33301, USA'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Home Phone:</span>
                    <span className="font-mono">{driver.phone || driver.homePhone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address:</span>
                    <span className="font-mono break-all">{driver.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Driver&apos;s License No:</span>
                    <strong className="font-mono">{driver.licenseNumber || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">License Expiry Date:</span>
                    <span className="font-mono">{driver.licenseExpiry || '—'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200 mt-1">
                    <span className="text-slate-500 block">Local Jamaica Address &amp; Local Phone:</span>
                    <span>{driver.localAddress || 'Half Moon Resort, Rose Hall, Montego Bay'} · {driver.localPhone || driver.phone || '(876) 885-2355'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block">Relative Contact (Name, Address, Tel):</span>
                    <span>{driver.relativeName || 'Eleanor Sterling'} · {driver.relativeAddress || 'Montego Bay'} · {driver.relativePhone || '(876) 789-9051'}</span>
                  </div>
                </div>
              </div>

              {/* Additional Driver */}
              <div className="p-3 print:p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] print:text-[9px] font-mono font-bold uppercase text-slate-500 block">
                  Additional Driver
                </span>
                {additionalDriver?.fullName || additionalDriver?.hasDriver ? (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs print:text-[9.5px]">
                    <div>
                      <span className="text-slate-500 block">Full Legal Name:</span>
                      <strong className="text-slate-900">{additionalDriver.fullName || 'Sophia Sterling'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Date of Birth:</span>
                      <span className="font-mono">{additionalDriver.dob || '1990-09-22'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Permanent Address:</span>
                      <span>{additionalDriver.address || driver.homeAddress || 'Same as primary renter'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Contact Phone:</span>
                      <span className="font-mono">{additionalDriver.phone || '+1 (954) 555-0198'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">National ID / Passport No:</span>
                      <span className="font-mono">{additionalDriver.idNumber || 'FL-D8492019'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Driver&apos;s License No:</span>
                      <strong className="font-mono">{additionalDriver.licenseNumber || 'FL-940281-B'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">License Expiry Date:</span>
                      <span className="font-mono">{additionalDriver.licenseExpiry || '2030-05-15'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 font-mono text-xs print:text-[9px]">
                    No Additional Driver Authorized on this Agreement.
                    <p className="text-[10px] text-slate-400 font-sans mt-1">
                      Vehicle may ONLY be operated by the Primary Renter named above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Vehicle & Itemized Billing Breakdown */}
          <div className="p-4 print:p-2.5 space-y-2">
            <h2 className="text-xs print:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900/20 pb-1">
              2. Vehicle Specs &amp; Complete Billing Breakdown (USD)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3">
              {/* Vehicle Specs & Mileage/Fuel */}
              <div className="p-3 print:p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] print:text-[9px] font-mono font-bold uppercase text-slate-500 block">
                  Assigned Vehicle
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs print:text-[9.5px]">
                  <div>
                    <span className="text-slate-500 block">Make &amp; Model:</span>
                    <strong className="text-slate-900">{vehicle.name || 'Mazda Demio'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Year &amp; Color:</span>
                    <span>{vehicle.year || '2016'} · {vehicle.color || 'Red'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Category:</span>
                    <span>{vehicle.categoryLabel || 'Compact Car'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">License Plate / Disc:</span>
                    <strong className="font-mono">{plateNo} · {licDisc}</strong>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <span className="text-slate-500 block">Mileage Out / In:</span>
                    <span className="font-mono font-semibold">{mileageOut?.toLocaleString()} km / {mileageIn ? `${mileageIn.toLocaleString()} km` : '—'}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <span className="text-slate-500 block">Fuel Level Out / In:</span>
                    <span className="font-mono font-semibold">{fuelLevelOut} / {fuelLevelIn || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Complete Billing Breakdown Table */}
              <div className="p-3 print:p-2 rounded-lg bg-slate-50 border border-slate-200">
                <table className="w-full text-xs print:text-[9px] font-mono">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">Rental Duration &amp; Base Rate:</td>
                      <td className="py-0.5 text-right font-semibold">${dailyRateVal}.00 × {rentalDays}d</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">Pick Up / Drop Off Fee:</td>
                      <td className="py-0.5 text-right">${pickupDropFee}.00</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">Extra Hours Charge:</td>
                      <td className="py-0.5 text-right">${extraHours}.00</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">T.P.I. (Third Party Insurance):</td>
                      <td className="py-0.5 text-right">${tpiAmount}.00</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">
                        CDW (Collision Damage Waiver):
                      </td>
                      <td className="py-0.5 text-right">{cdwAccepted ? `+$${cdwAmount}.00` : 'Declined'}</td>
                    </tr>
                    {toursTotal > 0 && (
                      <tr className="border-b border-slate-200">
                        <td className="py-0.5 text-slate-600 font-sans">Tours &amp; Add-ons:</td>
                        <td className="py-0.5 text-right">+${toursTotal}.00</td>
                      </tr>
                    )}
                    {discount > 0 && (
                      <tr className="border-b border-slate-200 text-emerald-700">
                        <td className="py-0.5 font-sans">Promotional Discount:</td>
                        <td className="py-0.5 text-right">-${discount}.00</td>
                      </tr>
                    )}
                    {extraCharges > 0 && (
                      <tr className="border-b border-slate-200">
                        <td className="py-0.5 text-slate-600 font-sans">Extra / Service Charges:</td>
                        <td className="py-0.5 text-right">+${extraCharges}.00</td>
                      </tr>
                    )}
                    {fuelCharges > 0 && (
                      <tr className="border-b border-slate-200">
                        <td className="py-0.5 text-slate-600 font-sans">Fuel Replacement Charge:</td>
                        <td className="py-0.5 text-right">+${fuelCharges}.00</td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-200">
                      <td className="py-0.5 text-slate-600 font-sans">Sales Tax / GOVT. TAX (GCT):</td>
                      <td className="py-0.5 text-right">${salesTax}.00</td>
                    </tr>
                    <tr className="border-t-2 border-slate-300 font-bold text-slate-900">
                      <td className="pt-1 text-slate-800 font-sans">Total Amount Due:</td>
                      <td className="pt-1 text-right">${grandTotalDue}.00 USD</td>
                    </tr>
                    <tr className="text-slate-600">
                      <td className="py-0.5 font-sans">Security Deposit (Card Hold):</td>
                      <td className="py-0.5 text-right">${deposit}.00 (Hold)</td>
                    </tr>
                    <tr className="font-bold text-emerald-800">
                      <td className="py-0.5 font-sans">Remaining Balance Due:</td>
                      <td className="py-0.5 text-right">${balanceDue}.00 ({rentalPaymentMethod.toUpperCase()})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Check Out / Check In Inspection Sheet */}
          <div className="p-4 print:p-2.5 space-y-2">
            <h2 className="text-xs print:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900/20 pb-1 flex items-center justify-between">
              <span>3. Vehicle Inspection Check Sheet (Check-Out &amp; Check-In)</span>
              <span className="font-mono text-[10px] print:text-[8.5px] px-2 py-0.5 rounded border border-slate-300 bg-slate-100">
                {inspection.noExistingDamage ? '✓ NO EXISTING BODY DAMAGE' : `NOTED ZONES: ${inspection.damagedZones?.join(', ') || 'Damage Noted'}`}
              </span>
            </h2>

            {/* Tyres & Spare Tyre Inspection Table */}
            <div className="p-3 print:p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] print:text-[9px] font-mono font-bold uppercase text-slate-500 block">
                Tyres &amp; Spare Tyre Condition (Type: {tyres.type || 'Radial Tubeless'} · Size: {tyres.size || '185/65 R15'})
              </span>
              <div className="grid grid-cols-5 gap-2 text-center text-xs print:text-[8.5px] font-mono">
                <div className="p-1 rounded bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-400">Front Left</span>
                  <strong className="text-slate-800">{tyres.frontLeft || 'New'}</strong>
                </div>
                <div className="p-1 rounded bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-400">Front Right</span>
                  <strong className="text-slate-800">{tyres.frontRight || 'New'}</strong>
                </div>
                <div className="p-1 rounded bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-400">Rear Left</span>
                  <strong className="text-slate-800">{tyres.rearLeft || '1/4 Worn'}</strong>
                </div>
                <div className="p-1 rounded bg-white border border-slate-200">
                  <span className="block text-[10px] text-slate-400">Rear Right</span>
                  <strong className="text-slate-800">{tyres.rearRight || '1/4 Worn'}</strong>
                </div>
                <div className="p-1 rounded bg-emerald-50 border border-emerald-200">
                  <span className="block text-[10px] text-emerald-800 font-bold">Spare Tyre</span>
                  <strong className="text-emerald-900">{tyres.spare || 'New'}</strong>
                </div>
              </div>
            </div>

            {/* Interior & Exterior Accessories Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-2 text-xs print:text-[8.5px] font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Hub Caps (H/Caps):</span>
                <strong>{checklist.hubCaps || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Emblems:</span>
                <strong>{checklist.emblems || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Trunk Mat:</span>
                <strong>{checklist.trunkMat || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Jack &amp; Tools:</span>
                <strong>{checklist.tools || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Back Board:</span>
                <strong>{checklist.backBoard || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Floor Mats:</span>
                <strong>{checklist.mats || '4'} Present</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Head Rests:</span>
                <strong>{checklist.headRests || 'O.K.'}</strong>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-sans">Baby Seat:</span>
                <strong>{checklist.babySeatCount > 0 ? `${checklist.babySeatCount} (${checklist.babySeatCondition})` : 'None'}</strong>
              </div>
            </div>

            {/* Check Sheet Remarks & Dual Video Verification */}
            <div className="p-3 print:p-2 rounded bg-slate-50 border border-slate-200 text-xs print:text-[9px] space-y-1">
              <p>
                <strong>Check Sheet Inspection Remarks:</strong> {inspection.notes || 'No pre-existing damages found during pre-rental inspection.'}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200 text-slate-600 font-mono text-[11px] print:text-[8.5px]">
                <span>
                  Customer 360° Video Recorded: <strong>{inspection.customerVideoRecorded ? 'YES ✓' : 'NO'}</strong>
                </span>
                <span>
                  Agent Pre-Handoff Video Recorded: <strong>{inspection.agentVideoRecorded ? 'YES ✓' : 'NO'}</strong>
                </span>
                <span>
                  Check-In Personal Belongings Removed: <strong>{returnAssessment?.checkedPersonalBelongings ? 'VERIFIED ✓' : 'Pending Check-In'}</strong>
                </span>
              </div>
            </div>

            {/* Post-Rental Return Findings (if inspected) */}
            {returnAssessment?.inspected && (
              <div className="p-3 print:p-2 rounded bg-amber-50/70 border border-amber-300 text-xs print:text-[9px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase font-mono">
                    Post-Rental Return Inspection &amp; Deposit Settlement
                  </span>
                  {returnAssessment.posRef && (
                    <span className="font-mono text-slate-700">POS Ref: {returnAssessment.posRef}</span>
                  )}
                </div>
                <p>
                  <strong>Return Finding:</strong>{' '}
                  {returnAssessment.hasNewDamage
                    ? returnAssessment.damageDescription
                    : 'Vehicle returned in clean condition with no new damages.'}
                  {returnAssessment.isMajorDamage && returnAssessment.professionalName
                    ? ` (Certified Estimator: ${returnAssessment.professionalName})`
                    : ''}
                </p>
                <p className="font-mono tabular-nums text-slate-800">
                  Repair Estimate: ${returnAssessment.estimateCost}.00 USD · Settlement:{' '}
                  {returnAssessment.estimateCost === 0
                    ? `Full $${deposit}.00 Security Deposit Released`
                    : returnAssessment.estimateCost > deposit
                      ? `$${deposit}.00 Deposit Retained + $${returnAssessment.estimateCost - deposit}.00 POS Card Payment`
                      : `$${returnAssessment.estimateCost}.00 Deducted from Deposit ($${deposit - returnAssessment.estimateCost}.00 Refunded)`}
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Exact Contract Terms & Rental Policies */}
          <div className="p-4 print:p-2.5 space-y-2">
            <h2 className="text-xs print:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900/20 pb-1">
              4. Rental Contract Terms &amp; Conditions
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-xs print:text-[8.5px] leading-relaxed print:leading-tight">
              <li>
                <strong className="text-slate-900">Minimum Age &amp; Right to Refuse:</strong> Minimum age is 21 years. Take It Easy Car Rentals &amp; Tours Limited reserves the right to refuse anyone when done in the best interest of the Company or customer.
              </li>
              <li>
                <strong className="text-slate-900">Rate Exclusions:</strong> Rates do not include gasoline, GOVT. TAX, and security deposit (if applicable). The company reserves the right to collect a deposit covering estimated charges and damages.
              </li>
              <li>
                <strong className="text-slate-900">Traffic &amp; Parking Violations:</strong> Renters assume full responsibility for all parking and traffic violations during the rental term.
              </li>
              <li>
                <strong className="text-slate-900">Returns &amp; Drop Charges:</strong> Vehicle must be returned on or before the due date/time to the same location where rented (Montego Bay Airport MBJ or Kingston Airport KIN), or a drop charge may apply.
              </li>
              <li>
                <strong className="text-slate-900">Parts, Repairs &amp; Tyres/Rims Liability:</strong> Parts and repairs charges will not be refunded without an official receipt and prior consent from Take It Easy Car Rentals &amp; Tours Limited. The renter is fully liable for damage to rims and tyres.
              </li>
              <li>
                <strong className="text-slate-900">Insurance &amp; CDW (Collision Damage Waiver):</strong> Third-party liability insurance does not cover damages sustained by the renter or occupants personally. Renter accepts or declines CDW at the daily rate, with renter responsibility for the first $3,500 / $4,500 USD (or specified amount) of collision damage. Negligence or violation of the agreement makes the renter fully liable for all damages even with CDW.
              </li>
              <li>
                <strong className="text-slate-900">Refund Policy &amp; Emergency (Call 119):</strong> NO REFUND — CREDIT NOTE ONLY (Credit note is valid for one (1) year from date of issue). In the case of an accident, call 119 immediately.
              </li>
            </ol>
          </div>

          {/* Section 5: Signatures & Executions */}
          <div className="p-4 print:p-2.5 space-y-2">
            <h2 className="text-xs print:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-900/20 pb-1">
              5. Authorized Signatures &amp; Execution
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] print:text-[8px] font-mono uppercase text-slate-500 block">
                  Renter Check-Sheet Confirmation
                </span>
                <SignatureDisplay
                  signature={inspection.checkSheetSignature}
                  fallbackName={driver.fullName}
                />
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] print:text-[8px] font-mono uppercase text-slate-500 block">
                  Renter Contract Signature
                </span>
                <SignatureDisplay
                  signature={contract?.contractSignature}
                  fallbackName={driver.fullName}
                />
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] print:text-[8px] font-mono uppercase text-slate-500 block">
                  Authorized Company Agent
                </span>
                <SignatureDisplay
                  signature={inspection.staffSignature || { mode: 'type', text: 'Andray Williams', signedAt: 'Authorized' }}
                  fallbackName="Andray Williams"
                />
              </div>
            </div>

            <p className="text-[10px] print:text-[8px] text-slate-500 text-center font-mono pt-1">
              Signed original retained by Take It Easy Car Rentals &amp; Tours Limited · Customer copy delivered via {sendViaWhatsApp ? 'Email & WhatsApp' : 'Email'}.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
