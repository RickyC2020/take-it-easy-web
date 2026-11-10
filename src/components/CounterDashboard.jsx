import React, { useState, useEffect } from 'react';
import {
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Search,
  ArrowRight,
  Plane,
  RotateCcw,
  LogOut,
  ExternalLink,
  PlusCircle,
  Calendar,
  Phone,
  Wrench
} from 'lucide-react';

export default function CounterDashboard({
  fleet = [],
  fleetStatus = {},
  reservations = [],
  onSelectVehicleForContract,
  onOpenContractForRes,
  onOpenInspectionForRes,
  onOpenReturnForRes,
  onQuickClearInspection,
  onLogout,
  onNavigatePublic,
  onNewWalkIn,
  activeTab = 'fleet',
  setActiveTab,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [hubFilter, setHubFilter] = useState('ALL'); // 'ALL' | 'MBJ' | 'KIN'
  const [jamaicaTime, setJamaicaTime] = useState('');

  // Live Jamaica Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Jamaica',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setJamaicaTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute status metrics
  const availableCount = fleet.filter((v) => (fleetStatus[v.id]?.status || 'AVAILABLE') === 'AVAILABLE').length;
  const rentedCount = fleet.filter((v) => fleetStatus[v.id]?.status === 'RENTED').length;
  const reservedCount = fleet.filter((v) => fleetStatus[v.id]?.status === 'RESERVED').length;
  const inspectionCount = fleet.filter((v) => fleetStatus[v.id]?.status === 'IN_INSPECTION').length;

  // Dispatch items (Today's arrivals & scheduled returns)
  const dispatchList = reservations.filter((r) => {
    if (r.status === 'COMPLETED' || r.status === 'CANCELLED') return false;
    if (hubFilter !== 'ALL') {
      const hubCode = r.location?.code || r.location?.id;
      if (hubCode !== hubFilter) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (r.driver?.fullName || '').toLowerCase().includes(q);
      const matchRef = (r.id || '').toLowerCase().includes(q);
      const matchVehicle = (r.vehicle?.name || '').toLowerCase().includes(q);
      return matchName || matchRef || matchVehicle;
    }
    return true;
  });

  // Filtered fleet list
  const filteredFleet = fleet.filter((vehicle) => {
    const currentStatus = fleetStatus[vehicle.id]?.status || 'AVAILABLE';
    if (statusFilter !== 'ALL' && currentStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = vehicle.name.toLowerCase().includes(q);
      const matchPlate = (fleetStatus[vehicle.id]?.plateNo || '').toLowerCase().includes(q);
      const matchColor = vehicle.color.toLowerCase().includes(q);
      const matchCat = vehicle.categoryLabel.toLowerCase().includes(q);
      return matchName || matchPlate || matchColor || matchCat;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AVAILABLE
          </span>
        );
      case 'RENTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            RENTED (ON ROAD)
          </span>
        );
      case 'RESERVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            RESERVED
          </span>
        );
      case 'IN_INSPECTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/35">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            INSPECTION / BAY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-500/35">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1412] via-[#0f2420] to-[#08100e] text-white pb-24 lg:pb-12">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Hub Info */}
          <div className="flex items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-md">
                TIE
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    Take It Easy Car Rentals
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    STAFF CONSOLE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Counter Operations · MBJ &amp; KIN Airport Hubs
                </p>
              </div>
            </div>

            {/* Mobile Switch to Public button */}
            <button
              type="button"
              onClick={onNavigatePublic}
              className="md:hidden p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300"
              title="Return to Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Jamaica Clock & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Live Jamaica Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono tabular-nums text-white font-semibold">
                {jamaicaTime || 'Jamaica Time'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">EST / JAM</span>
            </div>

            {/* Quick New Rental Action */}
            <button
              type="button"
              onClick={onNewWalkIn}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.2]" />
              <span>Walk-In Rental</span>
            </button>

            {/* Public Site Button */}
            <button
              type="button"
              onClick={onNavigatePublic}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-white/80 hover:text-white transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs text-red-300 transition cursor-pointer"
              title="Lock Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* KPI Operations Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold block">
                Available Fleet
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 block">
                {availableCount}
              </span>
              <span className="text-[11px] text-slate-400">Ready for pickup</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-sky-400 font-semibold block">
                Out on Road
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 block">
                {rentedCount}
              </span>
              <span className="text-[11px] text-slate-400">Active contracts</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Car className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-semibold block">
                Upcoming Dispatch
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 block">
                {reservedCount}
              </span>
              <span className="text-[11px] text-slate-400">Online reservations</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold block">
                Inspection / Bay
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 block">
                {inspectionCount}
              </span>
              <span className="text-[11px] text-slate-400">Turnaround check</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Primary View Switcher Tabs: Fleet & Operations vs Daily Dispatch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900/70 border border-white/15 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('fleet')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'fleet'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Active Fleet &amp; Operations</span>
              <span className="px-1.5 py-0.2 rounded-md font-mono text-[11px] bg-slate-950/30">
                {fleet.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dispatch')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
                activeTab === 'dispatch'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Daily Dispatch</span>
              {reservedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-md font-mono text-[11px] bg-amber-400 text-slate-950 font-bold">
                  {reservedCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'fleet' ? 'Search vehicle, plate, color...' : 'Search renter, flight, ref...'}
              className="w-full bg-slate-900/60 border border-white/15 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>

        {/* =========================================================
            TAB 1: ACTIVE FLEET & OPERATIONS
           ========================================================= */}
        {activeTab === 'fleet' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['ALL', 'AVAILABLE', 'RESERVED', 'RENTED', 'IN_INSPECTION'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-mono uppercase tracking-wider font-semibold transition cursor-pointer shrink-0 ${
                    statusFilter === st
                      ? 'bg-white text-slate-950 shadow-md'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                  }`}
                >
                  {st === 'ALL' ? 'All Vehicles' : st.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Fleet Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFleet.map((vehicle) => {
                const info = fleetStatus[vehicle.id] || {
                  status: 'AVAILABLE',
                  plateNo: '2489-HX',
                  mileage: 48200,
                  fuelLevel: 'F',
                };
                const matchingRes = reservations.find(
                  (r) => (r.vehicle?.id === vehicle.id || info.currentReservationId === r.id) && r.status !== 'COMPLETED'
                );

                return (
                  <div
                    key={vehicle.id}
                    className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 overflow-hidden flex flex-col justify-between hover:border-white/30 transition shadow-lg"
                  >
                    {/* Header */}
                    <div className="p-4 pb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            {vehicle.categoryLabel}
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                            Plate: {info.plateNo || '2489-HX'}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-snug">
                          {vehicle.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {vehicle.color} · ${vehicle.ratePerDay}/day
                        </p>
                      </div>

                      {getStatusBadge(info.status)}
                    </div>

                    {/* Image Cutout Preview Stage */}
                    <div className="relative mx-4 my-2 h-32 rounded-xl bg-white/90 p-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="max-h-28 w-full object-contain mix-blend-multiply select-none"
                      />
                    </div>

                    {/* Specs & Status Metrics */}
                    <div className="px-4 py-2 text-xs border-y border-white/10 bg-black/20 grid grid-cols-3 divide-x divide-white/10 text-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Mileage</span>
                        <span className="font-mono font-bold text-slate-200">
                          {(info.mileage || 48210).toLocaleString()} km
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Gas</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {info.fuelLevel || 'Full'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Deposit</span>
                        <span className="font-mono font-bold text-amber-300">
                          ${vehicle.deposit || 500}
                        </span>
                      </div>
                    </div>

                    {/* Current Operation Status Note */}
                    <div className="p-4 pt-3 space-y-3">
                      {info.status === 'RENTED' && matchingRes && (
                        <div className="rounded-xl bg-sky-500/10 border border-sky-500/30 p-2.5 text-xs space-y-1">
                          <div className="flex items-center justify-between text-sky-300 font-semibold">
                            <span>Rented by {matchingRes.driver?.fullName || 'Customer'}</span>
                            <span className="font-mono">{matchingRes.id}</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            Due: {matchingRes.returnDate} · {matchingRes.returnTime} ({matchingRes.dropLocation?.shortName || 'MBJ'})
                          </p>
                        </div>
                      )}

                      {info.status === 'RESERVED' && matchingRes && (
                        <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 p-2.5 text-xs space-y-1">
                          <div className="flex items-center justify-between text-purple-300 font-semibold">
                            <span>Reserved: {matchingRes.driver?.fullName || 'Customer'}</span>
                            <span className="font-mono">{matchingRes.id}</span>
                          </div>
                          <p className="text-slate-400 text-[11px]">
                            Pickup: {matchingRes.pickupDate} · {matchingRes.pickupTime} ({matchingRes.location?.shortName || 'MBJ'})
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center gap-2">
                        {info.status === 'AVAILABLE' && (
                          <button
                            type="button"
                            onClick={() => onSelectVehicleForContract(vehicle)}
                            className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Walk-In Check Out</span>
                          </button>
                        )}

                        {info.status === 'RESERVED' && matchingRes && (
                          <button
                            type="button"
                            onClick={() => onOpenContractForRes(matchingRes.id)}
                            className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Review &amp; Check Out</span>
                          </button>
                        )}

                        {info.status === 'RENTED' && matchingRes && (
                          <button
                            type="button"
                            onClick={() => onOpenReturnForRes(matchingRes.id)}
                            className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Check In / Return</span>
                          </button>
                        )}

                        {info.status === 'IN_INSPECTION' && (
                          <button
                            type="button"
                            onClick={() => onQuickClearInspection(vehicle.id)}
                            className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Clear to Available</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: DAILY DISPATCH (MBJ & KIN Airport Arrivals & Returns)
           ========================================================= */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Hub Filter Strip */}
            <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 uppercase font-mono tracking-wider font-semibold">Airport Hub:</span>
                {['ALL', 'MBJ', 'KIN'].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => setHubFilter(hub)}
                    className={`px-3 py-1.5 rounded-xl font-mono uppercase tracking-wider font-semibold transition cursor-pointer ${
                      hubFilter === hub
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                    }`}
                  >
                    {hub === 'ALL' ? 'All Hubs' : hub === 'MBJ' ? 'Montego Bay (MBJ)' : 'Kingston (KIN)'}
                  </button>
                ))}
              </div>

              <span className="text-slate-400 font-mono text-xs">
                {dispatchList.length} scheduled reservation(s)
              </span>
            </div>

            {/* Dispatch List */}
            {dispatchList.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/40 border border-white/10 p-8 text-center space-y-3">
                <Plane className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-base font-semibold text-white">No scheduled dispatches matching filter</p>
                <p className="text-xs text-slate-400">All customer arrivals for this hub are currently cleared.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dispatchList.map((res) => {
                  const isReserved = res.status === 'RESERVED';
                  const isRented = res.status === 'RENTED';

                  return (
                    <div
                      key={res.id}
                      className="rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/15 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-white/30 transition shadow-lg"
                    >
                      {/* Left: Client & Flight Information */}
                      <div className="space-y-2 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono font-bold text-amber-300 text-sm bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-md">
                            {res.id}
                          </span>
                          {getStatusBadge(res.status)}
                          <span className="text-xs font-mono text-slate-400">
                            Booked: {res.createdAt || 'Today'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <h4 className="text-base sm:text-lg font-bold text-white truncate">
                            {res.driver?.fullName || 'Valued Customer'}
                          </h4>
                          {res.driver?.phone && (
                            <span className="text-xs text-emerald-300 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {res.driver.phone}
                            </span>
                          )}
                        </div>

                        {/* Hub Route & Dates */}
                        <div className="flex items-center gap-3 text-xs text-slate-300 font-mono flex-wrap">
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <MapPin className="w-3.5 h-3.5" />
                            Pickup: {res.location?.shortName || 'MBJ'} · {res.pickupDate} ({res.pickupTime})
                          </span>
                          <span>→</span>
                          <span className="text-amber-300 font-semibold">
                            Return: {res.dropLocation?.shortName || res.location?.shortName || 'MBJ'} · {res.returnDate}
                          </span>
                          {res.driver?.flightNumber && (
                            <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono">
                              Flight: {res.driver.flightNumber}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Vehicle Badge */}
                      <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-white/10 shrink-0">
                        <img
                          src={res.vehicle?.image}
                          alt={res.vehicle?.name}
                          className="w-16 h-10 object-contain mix-blend-multiply bg-white rounded-lg p-1 shrink-0"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">{res.vehicle?.name}</span>
                          <span className="text-slate-400">{res.vehicle?.color} · {res.rentalDays} days</span>
                          <span className="font-mono text-emerald-400 block font-semibold">
                            ${res.subtotal || (res.vehicle?.ratePerDay * res.rentalDays)} USD Total
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isReserved && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenContractForRes(res.id)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Start Contract &amp; Check-Out</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenInspectionForRes(res.id)}
                              className="px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-semibold text-xs transition cursor-pointer"
                              title="Direct Inspection Form"
                            >
                              Inspect
                            </button>
                          </>
                        )}

                        {isRented && (
                          <button
                            type="button"
                            onClick={() => onOpenReturnForRes(res.id)}
                            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Check In Vehicle</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

