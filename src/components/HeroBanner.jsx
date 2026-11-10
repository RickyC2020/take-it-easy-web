import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

function formatPillDate(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = String(d).padStart(2, '0');
      return `${month} ${day}, ${y}`;
    }
  }
  return dateStr;
}

export default function HeroBanner({
  locationId,
  setLocationId,
  dropLocationId,
  setDropLocationId,
  pickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  returnTime,
  setReturnTime,
  timeSlots = [],
  minPickupDate,
  minReturnDate,
  onPickupDateChange,
  onReturnDateChange,
  onBookCar,
}) {
  return (
    <section aria-label="Hero Banner and Rental Search" className="py-2 sm:py-3 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner container */}
        <div className="relative rounded-xl overflow-hidden bg-transparent">
          {/* =========================================================
              HERO BANNER ARTWORK
              - Native 1024x384 widescreen aspect ratio (Full Image Visible, Zero Crop)
              - Soul Red Mazda CX-5 on the Jamaican coastal road overlooking the Caribbean Sea
             ========================================================= */}
          <div className="relative aspect-[1024/384] w-full select-none overflow-hidden rounded-xl">
            <img
              src="/hero-banner.jpg?v=16"
              alt="Take It Easy Car Rentals & Tours - Soul Red Mazda CX-5 on the Jamaican coastal road overlooking the Caribbean Sea"
              className="w-full h-full object-cover"
            />

            {/* Semantic accessible headline for screen readers & SEO */}
            <h1 className="sr-only">
              Take It Easy Car Rentals &amp; Tours — The keys to your next adventure
            </h1>

            {/* =========================================================
                DESKTOP OVERLAY: SLIM FLOATING "FROSTED GLASS HORIZON PILL"
                - Positioned in the top right sky area, well clear of the car
                - Compact width so it never overlaps the vehicle on the left
                - Drop-off Hub menu replaces vehicle class
                - 5 compact columns with hairline dividers
               ========================================================= */}
            <div
              id="hero-search-card"
              className="hidden lg:flex items-center absolute top-4 xl:top-6 right-4 xl:right-6 z-20 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/35 shadow-2xl px-4 xl:px-5 py-2 xl:py-2.5 text-white gap-2 xl:gap-3 transition-all hover:bg-slate-900/60"
            >
              {/* Column 1: Pickup Hub */}
              <div className="relative flex flex-col justify-center min-w-[105px] xl:min-w-[125px] max-w-[135px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                    PICKUP HUB
                  </span>
                  {locationId === 'KIN' && (
                    <span className="text-[8px] xl:text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 rounded border border-amber-400/40">
                      +$120
                    </span>
                  )}
                </div>
                <div className="relative flex items-center mt-0.5">
                  <select
                    id="hero-desktop-location"
                    value={locationId}
                    onChange={(e) => setLocationId?.(e.target.value)}
                    className="w-full appearance-none bg-transparent pr-4 text-xs xl:text-sm font-medium text-white focus:outline-none cursor-pointer truncate"
                  >
                    <option value="MBJ" className="bg-slate-900 text-white">
                      Montego Bay (MBJ)
                    </option>
                    <option value="KIN" className="bg-slate-900 text-white">
                      Kingston (KIN) {locationId !== 'KIN' ? '(+$120 fee)' : ''}
                    </option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/80 pointer-events-none absolute right-0 shrink-0" />
                </div>
              </div>

              {/* Hairline Divider 1 */}
              <div className="h-8 w-[1px] bg-white/20 shrink-0" aria-hidden="true" />

              {/* Column 2: Drop-off Hub */}
              <div className="relative flex flex-col justify-center min-w-[105px] xl:min-w-[125px] max-w-[135px]">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] xl:text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                    DROP-OFF HUB
                  </span>
                  {dropLocationId === 'KIN' && (
                    <span className="text-[8px] xl:text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 rounded border border-amber-400/40">
                      +$120
                    </span>
                  )}
                </div>
                <div className="relative flex items-center mt-0.5">
                  <select
                    id="hero-desktop-drop-location"
                    value={dropLocationId}
                    onChange={(e) => setDropLocationId?.(e.target.value)}
                    className="w-full appearance-none bg-transparent pr-4 text-xs xl:text-sm font-medium text-white focus:outline-none cursor-pointer truncate"
                  >
                    <option value="MBJ" className="bg-slate-900 text-white">
                      Montego Bay (MBJ)
                    </option>
                    <option value="KIN" className="bg-slate-900 text-white">
                      Kingston (KIN) {dropLocationId !== 'KIN' ? '(+$120 fee)' : ''}
                    </option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-white/80 pointer-events-none absolute right-0 shrink-0" />
                </div>
              </div>

              {/* Hairline Divider 2 */}
              <div className="h-8 w-[1px] bg-white/20 shrink-0" aria-hidden="true" />

              {/* Column 3: Pickup Date & Time */}
              <div className="relative flex flex-col justify-center min-w-[85px] xl:min-w-[95px]">
                <span className="text-[9px] xl:text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                  PICKUP
                </span>
                <div className="mt-0.5 flex flex-col">
                  <label htmlFor="hero-desktop-pickup-date" className="relative cursor-pointer">
                    <span className="text-xs xl:text-sm font-semibold text-white leading-tight hover:text-amber-200 transition-colors whitespace-nowrap">
                      {formatPillDate(pickupDate)}
                    </span>
                    <input
                      type="date"
                      id="hero-desktop-pickup-date"
                      value={pickupDate}
                      min={minPickupDate}
                      onChange={onPickupDateChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <div className="relative inline-flex items-center">
                    <select
                      id="hero-desktop-pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime?.(e.target.value)}
                      className="appearance-none bg-transparent text-[11px] xl:text-xs text-white/90 leading-tight pr-3 focus:outline-none cursor-pointer hover:text-white"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time} className="bg-slate-900 text-white">
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-2.5 h-2.5 text-white/70 pointer-events-none absolute right-0" />
                  </div>
                </div>
              </div>

              {/* Hairline Divider 3 */}
              <div className="h-8 w-[1px] bg-white/20 shrink-0" aria-hidden="true" />

              {/* Column 4: Return Date & Time */}
              <div className="relative flex flex-col justify-center min-w-[85px] xl:min-w-[95px]">
                <span className="text-[9px] xl:text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                  RETURN
                </span>
                <div className="mt-0.5 flex flex-col">
                  <label htmlFor="hero-desktop-return-date" className="relative cursor-pointer">
                    <span className="text-xs xl:text-sm font-semibold text-white leading-tight hover:text-amber-200 transition-colors whitespace-nowrap">
                      {formatPillDate(returnDate)}
                    </span>
                    <input
                      type="date"
                      id="hero-desktop-return-date"
                      value={returnDate}
                      min={minReturnDate}
                      onChange={onReturnDateChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <div className="relative inline-flex items-center">
                    <select
                      id="hero-desktop-return-time"
                      value={returnTime}
                      onChange={(e) => setReturnTime?.(e.target.value)}
                      className="appearance-none bg-transparent text-[11px] xl:text-xs text-white/90 leading-tight pr-3 focus:outline-none cursor-pointer hover:text-white"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time} className="bg-slate-900 text-white">
                          {time}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-2.5 h-2.5 text-white/70 pointer-events-none absolute right-0" />
                  </div>
                </div>
              </div>

              {/* Column 5: Search CTA Button */}
              <button
                type="button"
                onClick={onBookCar}
                aria-label="Search available vehicles"
                className="rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-4 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm flex items-center gap-1.5 transition shadow-md shrink-0 cursor-pointer active:scale-95 ml-0.5"
              >
                <Search className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* =========================================================
              MOBILE / TABLET (< lg): RESPONSIVE FULL-WIDTH ROUNDED-2XL PILL
             ========================================================= */}
          <div id="mobile-search-card" className="lg:hidden mt-3 sm:mt-4 scroll-mt-6">
            <div
              id="hero-search-card-mobile"
              className="rounded-2xl bg-slate-900/65 backdrop-blur-md border border-white/35 shadow-2xl p-4 sm:p-5 text-white"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 1. Pickup Hub */}
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/20">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                      PICKUP HUB
                    </span>
                    {locationId === 'KIN' && (
                      <span className="text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 py-0.2 rounded border border-amber-400/40">
                        +$120 fee
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <select
                      id="hero-mobile-location"
                      value={locationId}
                      onChange={(e) => setLocationId?.(e.target.value)}
                      className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-white focus:outline-none cursor-pointer"
                    >
                      <option value="MBJ" className="bg-slate-900 text-white">
                        Montego Bay (MBJ)
                      </option>
                      <option value="KIN" className="bg-slate-900 text-white">
                        Kingston (KIN) {locationId !== 'KIN' ? '(+$120 fee)' : ''}
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-0 shrink-0" />
                  </div>
                </div>

                {/* 2. Drop-off Hub */}
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/20">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-white/75 font-semibold">
                      DROP-OFF HUB
                    </span>
                    {dropLocationId === 'KIN' && (
                      <span className="text-[9px] text-amber-300 font-mono font-bold bg-amber-500/25 px-1 py-0.2 rounded border border-amber-400/40">
                        +$120 fee
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <select
                      id="hero-mobile-drop-location"
                      value={dropLocationId}
                      onChange={(e) => setDropLocationId?.(e.target.value)}
                      className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-white focus:outline-none cursor-pointer"
                    >
                      <option value="MBJ" className="bg-slate-900 text-white">
                        Montego Bay (MBJ)
                      </option>
                      <option value="KIN" className="bg-slate-900 text-white">
                        Kingston (KIN) {dropLocationId !== 'KIN' ? '(+$120 fee)' : ''}
                      </option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-0 shrink-0" />
                  </div>
                </div>

                {/* 3. Pickup Date & Time */}
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/20">
                  <span className="text-[10px] uppercase tracking-wider text-white/75 font-semibold block mb-0.5">
                    PICKUP
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="hero-mobile-pickup-date" className="relative cursor-pointer flex-1">
                      <span className="text-sm font-semibold text-white leading-tight">
                        {formatPillDate(pickupDate)}
                      </span>
                      <input
                        type="date"
                        id="hero-mobile-pickup-date"
                        value={pickupDate}
                        min={minPickupDate}
                        onChange={onPickupDateChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                    <div className="relative inline-flex items-center">
                      <select
                        id="hero-mobile-pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime?.(e.target.value)}
                        className="appearance-none bg-transparent text-xs text-white/90 leading-tight pr-3 focus:outline-none cursor-pointer"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time} className="bg-slate-900 text-white">
                            {time}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-2.5 h-2.5 text-white/70 pointer-events-none absolute right-0" />
                    </div>
                  </div>
                </div>

                {/* 4. Return Date & Time */}
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/20">
                  <span className="text-[10px] uppercase tracking-wider text-white/75 font-semibold block mb-0.5">
                    RETURN
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="hero-mobile-return-date" className="relative cursor-pointer flex-1">
                      <span className="text-sm font-semibold text-white leading-tight">
                        {formatPillDate(returnDate)}
                      </span>
                      <input
                        type="date"
                        id="hero-mobile-return-date"
                        value={returnDate}
                        min={minReturnDate}
                        onChange={onReturnDateChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                    <div className="relative inline-flex items-center">
                      <select
                        id="hero-mobile-return-time"
                        value={returnTime}
                        onChange={(e) => setReturnTime?.(e.target.value)}
                        className="appearance-none bg-transparent text-xs text-white/90 leading-tight pr-3 focus:outline-none cursor-pointer"
                      >
                        {timeSlots.map((time) => (
                          <option key={time} value={time} className="bg-slate-900 text-white">
                            {time}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-2.5 h-2.5 text-white/70 pointer-events-none absolute right-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Search Button */}
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={onBookCar}
                  aria-label="Search available vehicles"
                  className="w-full rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-6 py-3 flex items-center justify-center gap-2 transition shadow-md cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
