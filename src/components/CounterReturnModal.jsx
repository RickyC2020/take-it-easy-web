import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import SignaturePad from './SignaturePad';

const GAS_LEVELS = ['0', '1/4', '1/2', '3/4', 'Full'];

export default function CounterReturnModal({
  booking,
  onClose,
  onCompleteReturn,
}) {
  const vehicle = booking?.vehicle;
  const mileageOut = booking?.mileageOut || 48210;
  const gasLevelOut = booking?.fuelLevelOut || 'Full';

  // Check-In Form State
  const [mileageIn, setMileageIn] = useState(mileageOut + 480);
  const [gasIndexIn, setGasIndexIn] = useState(4); // Full
  const [extraHours, setExtraHours] = useState(0);
  const [hasNewDamage, setHasNewDamage] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');
  const [damageEstimate, setDamageEstimate] = useState(0);
  const [personalBelongingsChecked, setPersonalBelongingsChecked] = useState(false);
  const [agentSignature, setAgentSignature] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!booking) return null;

  // Gas Comparison Penalty
  const gasIn = GAS_LEVELS[gasIndexIn];
  const gasShortfall = gasLevelOut === 'Full' && gasIn !== 'Full';
  const fuelPenalty = gasShortfall ? (gasIn === '3/4' ? 25 : gasIn === '1/2' ? 50 : 80) : 0;
  const extraHoursCharge = extraHours * 15; // $15/hr
  const totalExtraCharges = fuelPenalty + extraHoursCharge + (hasNewDamage ? damageEstimate : 0);
  const depositHold = booking.deposit || 500;
  const netRefund = Math.max(0, depositHold - totalExtraCharges);
  const excessDue = totalExtraCharges > depositHold ? totalExtraCharges - depositHold : 0;

  const handleFinishReturn = () => {
    if (!personalBelongingsChecked) {
      setErrorMsg('Mandatory: Please verify and toggle "Checked for Personal Belongings" before closing.');
      return;
    }
    if (!agentSignature) {
      setErrorMsg('Rental Agent return signature is required.');
      return;
    }

    setErrorMsg('');
    onCompleteReturn(booking.id, {
      mileageIn,
      gasLevelIn: gasIn,
      extraHours,
      hasNewDamage,
      damageDescription,
      damageEstimate,
      personalBelongingsChecked: true,
      fuelPenalty,
      totalExtraCharges,
      netRefund,
      excessDue,
      closedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  {booking.id}
                </span>
                <h2 className="text-base font-bold text-white">Vehicle Check-In &amp; Return Closeout</h2>
              </div>
              <p className="text-[11px] text-slate-400">
                {vehicle?.name} · Driver: {booking.driver?.fullName || 'Customer'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs">
          {errorMsg && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Odometer & Mileage In */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-4 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              1. Odometer &amp; Distance Audit
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-1">Baseline Mileage Out:</span>
                <span className="font-mono text-sm font-bold text-slate-200">
                  {mileageOut.toLocaleString()} KM
                </span>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Mileage In (Current Reading):</label>
                <input
                  type="number"
                  value={mileageIn}
                  onChange={(e) => setMileageIn(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 font-mono font-bold text-white focus:border-emerald-400 text-sm"
                />
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/10 flex justify-between">
              <span>Total Distance Traveled:</span>
              <span className="text-emerald-300 font-bold">
                {Math.max(0, mileageIn - mileageOut).toLocaleString()} KM (Unlimited Mileage Included)
              </span>
            </div>
          </div>

          {/* 2. Fuel Level In & Penalties */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                2. Gas Level Reconciliation
              </span>
              <span className="text-slate-400 font-mono">Dispatched at: <strong>{gasLevelOut}</strong></span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-300">Gas In Reading:</span>
                <span className="font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  {gasIn} Tank
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={gasIndexIn}
                onChange={(e) => setGasIndexIn(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                {GAS_LEVELS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            {gasShortfall && (
              <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-2.5 text-amber-200 flex items-center justify-between">
                <span>Fuel Refill Shortfall Penalty applied:</span>
                <span className="font-mono font-bold text-amber-300">+${fuelPenalty} USD</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-slate-300">Late Return / Extra Hours ($15/hr):</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={extraHours}
                  onChange={(e) => setExtraHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-16 bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-mono text-center text-xs font-bold"
                />
                <span className="text-slate-400 font-mono text-[11px]">hrs (+${extraHoursCharge} USD)</span>
              </div>
            </div>
          </div>

          {/* 3. New Damage Verification */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                3. Physical Walk-around &amp; New Damage Check
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasNewDamage}
                  onChange={(e) => setHasNewDamage(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500"
                />
                <span className="text-xs font-semibold text-slate-200">Flag New Damage</span>
              </label>
            </div>

            {hasNewDamage && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <textarea
                  rows={2}
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  placeholder="Describe new damage (dents, scratches, rim curb rash, cracked glass)..."
                  className="w-full bg-slate-900 border border-red-500/40 rounded-xl p-2.5 text-xs text-white focus:border-red-400"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Estimated Repair / Parts Cost:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">$</span>
                    <input
                      type="number"
                      value={damageEstimate}
                      onChange={(e) => setDamageEstimate(Number(e.target.value) || 0)}
                      className="w-28 bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1 text-white font-mono text-sm font-bold"
                    />
                    <span className="text-slate-400">USD</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Mandatory Personal Belongings Check */}
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={personalBelongingsChecked}
                onChange={(e) => setPersonalBelongingsChecked(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-400 mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-white text-xs block">
                  Mandatory: Checked for Personal Belongings
                </span>
                <span className="text-slate-300 text-[11px] block">
                  Glovebox, door pockets, trunk, and under seats thoroughly inspected and confirmed cleared before customer departure.
                </span>
              </div>
            </label>
          </div>

          {/* 5. Final Deposit Settlement Summary */}
          <div className="rounded-2xl bg-black/40 border border-white/15 p-4 space-y-2 font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Security Deposit Hold:</span>
              <span className="text-white">${depositHold.toLocaleString()} USD</span>
            </div>
            {totalExtraCharges > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>Deductions (Fuel / Extra / Damage):</span>
                <span>-${totalExtraCharges.toLocaleString()} USD</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/15 flex justify-between text-sm font-bold">
              <span className="text-emerald-300">Net Deposit Refund Release:</span>
              <span className="text-emerald-300 font-bold">${netRefund.toLocaleString()} USD</span>
            </div>
            {excessDue > 0 && (
              <div className="flex justify-between text-red-300 font-bold">
                <span>Excess Balance Payable on POS:</span>
                <span>+${excessDue.toLocaleString()} USD</span>
              </div>
            )}
          </div>

          {/* 6. Signature Verification */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
              Rental Agent Check-In Signature
            </span>
            <SignaturePad
              label="Staff Closeout Verification"
              sublabel="Agent confirms return inspection and vehicle state"
              value={agentSignature}
              onChange={setAgentSignature}
              defaultTypedName="Devon Campbell (Agent #104)"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-slate-300 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFinishReturn}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Close Contract &amp; Release to Available</span>
          </button>
        </div>
      </div>
    </div>
  );
}

