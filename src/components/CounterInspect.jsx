import React, { useState } from 'react';
import {
  Gauge,
  Disc,
  Layers,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Car,
  ShieldCheck,
} from 'lucide-react';
import SignaturePad from './SignaturePad';

const GAS_LEVELS = ['0', '1/4', '1/2', '3/4', 'Full'];
const TYRE_CONDITIONS = ['New', '1/4 Worn', '1/2 Worn', '3/4 Worn', 'Smooth'];
const DAMAGE_ZONES = [
  { id: 'front-bumper', label: 'Front Bumper & Grille', section: 'Front' },
  { id: 'hood', label: 'Engine Hood', section: 'Front' },
  { id: 'windshield', label: 'Front Windshield Glass', section: 'Front' },
  { id: 'left-front', label: 'Left Front Fender', section: 'Left' },
  { id: 'left-doors', label: 'Left Passenger Doors', section: 'Left' },
  { id: 'left-rear', label: 'Left Rear Quarter Panel', section: 'Left' },
  { id: 'rear-bumper', label: 'Rear Bumper & Trunk Lid', section: 'Rear' },
  { id: 'right-rear', label: 'Right Rear Quarter Panel', section: 'Right' },
  { id: 'right-doors', label: 'Right Passenger Doors', section: 'Right' },
  { id: 'right-front', label: 'Right Front Fender', section: 'Right' },
  { id: 'roof', label: 'Roof Top', section: 'Top' }
];

export default function CounterInspect({
  reservation,
  onCompleteCheckOut,
  onBackToContract,
}) {
  const vehicle = reservation?.vehicle;

  // Form State
  const [mileageOut, setMileageOut] = useState(reservation?.mileageOut || 48210);
  const [gasLevelIndex, setGasLevelIndex] = useState(4); // 'Full'
  const [tyres, setTyres] = useState({
    frontLeft: 'New',
    frontRight: 'New',
    rearLeft: '1/4 Worn',
    rearRight: '1/4 Worn',
    spare: 'New'
  });

  const [accessories, setAccessories] = useState({
    hubcaps: 'O.K.',
    trunkMat: 'O.K.',
    tools: 'O.K.',
    backBoard: 'O.K.',
    matsCount: 4,
    headRests: 'O.K.',
    babySeatCount: 0,
    babySeatCondition: 'N/A'
  });

  const [damagedZones, setDamagedZones] = useState([]);
  const [damageNotes, setDamageNotes] = useState('Vehicle in clean baseline condition prior to handoff.');
  const [agentSignature, setAgentSignature] = useState(null);
  const [renterSignature, setRenterSignature] = useState(null);
  const [formError, setFormError] = useState('');

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#0a1412] text-white p-6 flex flex-col items-center justify-center">
        <p className="text-base text-slate-300">Reservation record not found.</p>
        <button
          type="button"
          onClick={onBackToContract}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
        >
          Return to Counter
        </button>
      </div>
    );
  }

  const toggleZone = (zoneId) => {
    setDamagedZones((prev) =>
      prev.includes(zoneId) ? prev.filter((z) => z !== zoneId) : [...prev, zoneId]
    );
  };

  const handleFinish = () => {
    if (!agentSignature) {
      setFormError('Rental Agent must sign the Check-Out Inspection before releasing.');
      return;
    }
    if (!renterSignature) {
      setFormError('Customer Renter must sign the Check-Out Inspection acknowledgment.');
      return;
    }

    setFormError('');
    onCompleteCheckOut(reservation.id, {
      mileageOut,
      gasLevelOut: GAS_LEVELS[gasLevelIndex],
      tyres,
      accessories,
      damagedZones,
      damageNotes,
      agentSignature,
      renterSignature,
      inspectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1412] via-[#0f2420] to-[#08100e] text-white pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToContract}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition cursor-pointer"
              title="Back to Contract"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded">
                  {reservation.id}
                </span>
                <h1 className="text-sm sm:text-base font-bold text-white">
                  Check-Out Inspection Sheet
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Official Vehicle Condition &amp; Inventory Handoff
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Check-Out</span>
          </button>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {formError && (
          <div className="rounded-xl bg-red-500/20 border border-red-500/40 p-3 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* 1. Vehicle & Odometer / Gas Section */}
        <section className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>1. Vehicle Dispatch Baseline (Mileage &amp; Fuel)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-300 font-semibold">
              Plate: {reservation.plateNo || '2489-HX'} · {vehicle?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Mileage Out */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                Mileage Out (Odometer Reading)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={mileageOut}
                  onChange={(e) => setMileageOut(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950/70 border border-white/15 rounded-xl px-3.5 py-2.5 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  KM
                </span>
              </div>
            </div>

            {/* Fuel Level Out Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">
                  Gas Level Out
                </label>
                <span className="font-mono text-sm font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded">
                  {GAS_LEVELS[gasLevelIndex]} Tank
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={gasLevelIndex}
                onChange={(e) => setGasLevelIndex(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                {GAS_LEVELS.map((lvl) => (
                  <span key={lvl}>{lvl}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Tyres & Spare Tyre Condition */}
        <section className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Disc className="w-4 h-4 text-emerald-400" />
              <span>2. Tyres &amp; Spare Tyre Physical Condition</span>
            </h2>
            <span className="text-[10px] text-amber-300 font-mono">Full Renter Liability</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {[
              { id: 'frontLeft', label: 'Front Left' },
              { id: 'frontRight', label: 'Front Right' },
              { id: 'rearLeft', label: 'Rear Left' },
              { id: 'rearRight', label: 'Rear Right' },
              { id: 'spare', label: 'Spare Tyre' }
            ].map((wheel) => (
              <div key={wheel.id} className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
                <span className="font-mono font-bold text-slate-300 block">{wheel.label}</span>
                <select
                  value={tyres[wheel.id]}
                  onChange={(e) => setTyres({ ...tyres, [wheel.id]: e.target.value })}
                  className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {TYRE_CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Accessory Checklist */}
        <section className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3. Accessories &amp; Interior Inventory Checklist</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {/* Hubcaps */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Hubcaps</span>
              <select
                value={accessories.hubcaps}
                onChange={(e) => setAccessories({ ...accessories, hubcaps: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="O.K.">O.K.</option>
                <option value="Missing">Missing</option>
              </select>
            </div>

            {/* Trunk Mat */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Trunk Mat</span>
              <select
                value={accessories.trunkMat}
                onChange={(e) => setAccessories({ ...accessories, trunkMat: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="O.K.">O.K.</option>
                <option value="Missing">Missing</option>
              </select>
            </div>

            {/* Tools */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Jack &amp; Tools</span>
              <select
                value={accessories.tools}
                onChange={(e) => setAccessories({ ...accessories, tools: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="O.K.">O.K.</option>
                <option value="Missing">Missing</option>
              </select>
            </div>

            {/* Back Board */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Back Board</span>
              <select
                value={accessories.backBoard}
                onChange={(e) => setAccessories({ ...accessories, backBoard: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="O.K.">O.K.</option>
                <option value="Missing">Missing</option>
              </select>
            </div>

            {/* Floor Mats */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Floor Mats</span>
              <select
                value={accessories.matsCount}
                onChange={(e) => setAccessories({ ...accessories, matsCount: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="4">4 Mats</option>
                <option value="3">3 Mats</option>
                <option value="2">2 Mats</option>
                <option value="1">1 Mat</option>
                <option value="0">None</option>
              </select>
            </div>

            {/* Head Rests */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="font-mono text-slate-400 uppercase text-[10px] block">Head Rests</span>
              <select
                value={accessories.headRests}
                onChange={(e) => setAccessories({ ...accessories, headRests: e.target.value })}
                className="w-full bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white font-semibold"
              >
                <option value="O.K.">O.K. (All Present)</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>
        </section>

        {/* 4. Body Damage Diagram & Interactive Logger */}
        <section className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>4. Exterior Body Damage Note Logger ("Front &amp; Right" / "Left &amp; Rear")</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {damagedZones.length === 0 ? '✓ No Existing Damage' : `${damagedZones.length} Zone(s) Noted`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {DAMAGE_ZONES.map((zone) => {
              const isNoted = damagedZones.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => toggleZone(zone.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                    isNoted
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                      : 'bg-slate-950/50 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <span className="truncate">{zone.label}</span>
                  {isNoted ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono">OK</span>
                  )}
                </button>
              );
            })}
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Damage &amp; Walk-around Remarks
            </label>
            <textarea
              rows={2}
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="Record any minor scratches, dents, or pre-existing blemishes..."
              className="w-full bg-slate-950/70 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </section>

        {/* 5. Dual Digital Signature Pads */}
        <section className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-5 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5. Inspection Verification &amp; Dual Digital Signatures</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agent Signature */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Rental Agent Check-Out Verification
              </span>
              <SignaturePad
                label="Rental Agent Signature"
                sublabel="Counter agent confirms vehicle condition & fuel level"
                value={agentSignature}
                onChange={setAgentSignature}
                defaultTypedName="Devon Campbell (Agent #104)"
              />
            </div>

            {/* Customer Renter Signature */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Primary Renter Acknowledgment
              </span>
              <SignaturePad
                label="Primary Renter Signature"
                sublabel="Customer agrees with recorded baseline inspection"
                value={renterSignature}
                onChange={setRenterSignature}
                defaultTypedName={reservation.driver?.fullName || 'Marcus Sterling'}
              />
            </div>
          </div>
        </section>

        {/* Submit Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToContract}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs text-slate-300 font-semibold cursor-pointer"
          >
            ← Back to Contract Billing
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Check-Out &amp; Release Vehicle</span>
          </button>
        </div>
      </main>
    </div>
  );
}

