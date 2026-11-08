import React from 'react';
import { MapPin, Calendar, Clock, Car, ChevronDown } from 'lucide-react';

function formatTripDate(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) {
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${month} ${d}, ${y}`;
    }
  }
  return dateStr;
}

export default function HeroBanner({
  locationId,
  setLocationId,
  pickupDate,
  pickupTime,
  setPickupTime,
  returnDate,
  returnTime,
  setReturnTime,
  rentalDays = 1,
  selectedCategory,
  setSelectedCategory,
  locations = [],
  timeSlots = [],
  categories = [],
  minPickupDate,
  minReturnDate,
  onPickupDateChange,
  onReturnDateChange,
  onBookCar,
}) {
  return (
    <section aria-label="Hero Banner and Rental Search" className="py-2 sm:py-3 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Banner container - border removed */}
        <div className="relative rounded-xl overflow-hidden bg-transparent">
          {/* =========================================================
              HERO BANNER ARTWORK
              - Native 1024x433 widescreen aspect ratio (Full Image Visible, Zero Crop)
              - "The keys to your next adventure" + Pearl-white Mazda CX-5 (TIE plate)
             ========================================================= */}
          <div className="relative aspect-[1024/433] w-full select-none overflow-hidden">
            <img
              src="/hero-banner.jpg?v=12"
              alt="Take It Easy Car Rentals - The keys to your next adventure. Pearl white Mazda CX-5 with TIE plate driving along the Jamaican coast"
              className="w-full h-full object-cover"
            />

            {/* Semantic accessible headline for screen readers & SEO */}
            <h1 className="sr-only">
              Take It Easy Car Rentals &amp; Tours — The keys to your next adventure
            </h1>

            {/* =========================================================
                DESKTOP OVERLAY: GLASSMORPHIC SEARCH CARD (RIGHT SIDE)
               ========================================================= */}
            <div className="hidden lg:flex absolute inset-y-0 right-0 z-10 items-center justify-end p-3.5 xl:p-6 w-full max-w-[540px] xl:max-w-[600px] 2xl:max-w-[640px]">
              <div className="w-full">
                {/* Ultra-Transparent Glassmorphic Card (Natural Height, Vertically Centered) */}
                <div
                  id="hero-search-card"
                  className="rounded-2xl bg-black/[0.05] hover:bg-black/[0.08] backdrop-blur-xs border border-white/40 hover:border-white/55 p-3.5 xl:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] text-white transition-all"
                >
                  {/* 1. Noticeable Heading: A Little Less Transparent (Section Only) */}
                  <div className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/35 shadow-inner mb-2.5 xl:mb-3">
                    <h2 className="text-xs xl:text-sm font-black tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight text-center">
                      GET INSTANT QUOTES <span className="text-emerald-300 font-bold">|</span> NO HIDDEN FEES
                    </h2>
                  </div>

                  {/* 2. Middle Grid: 2x2 Search Inputs */}
                  <div className="grid grid-cols-2 gap-2 xl:gap-2.5">
                    {/* 1. Pickup Location */}
                    <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/35 hover:border-white/55 transition-all flex flex-col justify-center">
                      <label
                        htmlFor="hero-desktop-location"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-emerald-300 mb-1 font-bold drop-shadow-xs"
                      >
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pickup Hub</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="hero-desktop-location"
                          value={locationId}
                          onChange={(e) => setLocationId?.(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-5 text-sm xl:text-base font-bold text-white focus:outline-none cursor-pointer truncate"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id} className="bg-[#1b2b2b] text-white">
                              {loc.shortName || loc.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                      </div>
                    </div>

                    {/* 2. Car Category */}
                    <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/35 hover:border-white/55 transition-all flex flex-col justify-center">
                      <label
                        htmlFor="hero-desktop-category"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-amber-300 mb-1 font-bold drop-shadow-xs"
                      >
                        <Car className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Vehicle Class</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="hero-desktop-category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory?.(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-5 text-sm xl:text-base font-bold text-white focus:outline-none cursor-pointer truncate"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#1b2b2b] text-white">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                      </div>
                    </div>

                    {/* 3. Pickup Date & Time */}
                    <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/35 hover:border-white/55 transition-all flex flex-col justify-center">
                      <label
                        htmlFor="hero-desktop-pickup-date"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-emerald-300 mb-1 font-bold drop-shadow-xs"
                      >
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pickup Date &amp; Time</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="hero-desktop-pickup-date"
                          type="date"
                          value={pickupDate}
                          min={minPickupDate}
                          onChange={(e) => onPickupDateChange?.(e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-transparent text-sm xl:text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer min-w-0"
                        />
                        <span className="h-4 w-px bg-white/25 shrink-0" />
                        <select
                          aria-label="Pickup Time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime?.(e.target.value)}
                          className="bg-transparent text-xs xl:text-sm font-mono font-bold text-white focus:outline-none cursor-pointer shrink-0"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 4. Return Date & Time */}
                    <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/35 hover:border-white/55 transition-all flex flex-col justify-center">
                      <label
                        htmlFor="hero-desktop-return-date"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-amber-300 mb-1 font-bold drop-shadow-xs"
                      >
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Return Date &amp; Time</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="hero-desktop-return-date"
                          type="date"
                          value={returnDate}
                          min={minReturnDate}
                          onChange={(e) => onReturnDateChange?.(e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-transparent text-sm xl:text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer min-w-0"
                        />
                        <span className="h-4 w-px bg-white/25 shrink-0" />
                        <select
                          aria-label="Return Time"
                          value={returnTime}
                          onChange={(e) => setReturnTime?.(e.target.value)}
                          className="bg-transparent text-xs xl:text-sm font-mono font-bold text-white focus:outline-none cursor-pointer shrink-0"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Row: Trip Summary Card (Left) + Search Button (Right) on the Same Line */}
                <div className="flex items-center gap-2 xl:gap-2.5 mt-2.5">
                  {/* Trip Summary Card */}
                  <div className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-black/35 hover:bg-black/45 backdrop-blur-xs border border-white/35 shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center text-center">
                    <span className="text-xs xl:text-[13px] font-bold text-white tracking-wide truncate">
                      <span className="text-amber-300 font-extrabold">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span> from {formatTripDate(pickupDate)} to {formatTripDate(returnDate)}
                    </span>
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={onBookCar}
                    className="shrink-0 min-h-[44px] px-6 xl:px-8 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xs border border-white/40 hover:border-white/60 active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span>SEARCH</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              MOBILE / TABLET (< lg): GLASSMORPHIC SEARCH CARD
             ========================================================= */}
          <div className="lg:hidden p-4 sm:p-5 bg-gradient-to-b from-[#192b2d] to-[#122224]">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xs border border-white/35 p-4 shadow-xl text-white">
              {/* Noticeable Heading: A Little Less Transparent (Section Only) */}
              <div className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/35 shadow-inner mb-3">
                <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white drop-shadow-md text-center">
                  GET INSTANT QUOTES <span className="text-emerald-300 font-bold">|</span> NO HIDDEN FEES
                </h2>
              </div>

              {/* 2-Column Responsive Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 1. Pickup Location */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/30 hover:border-white/45 transition-colors">
                  <label
                    htmlFor="hero-mobile-location"
                    className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-emerald-300 mb-1 font-bold"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pickup Location</span>
                  </label>
                  <div className="relative flex items-center min-h-[42px]">
                    <select
                      id="hero-mobile-location"
                      value={locationId}
                      onChange={(e) => setLocationId?.(e.target.value)}
                      className="w-full min-h-[42px] appearance-none bg-transparent pr-6 text-base font-bold text-white focus:outline-none cursor-pointer"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-[#1b2b2b] text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                  </div>
                </div>

                {/* 2. Car Category */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/30 hover:border-white/45 transition-colors">
                  <label
                    htmlFor="hero-mobile-category"
                    className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-amber-300 mb-1 font-bold"
                  >
                    <Car className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Car Category</span>
                  </label>
                  <div className="relative flex items-center min-h-[42px]">
                    <select
                      id="hero-mobile-category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory?.(e.target.value)}
                      className="w-full min-h-[42px] appearance-none bg-transparent pr-6 text-base font-bold text-white focus:outline-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#1b2b2b] text-white">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                  </div>
                </div>

                {/* 3. Pickup Date & Time */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/30 hover:border-white/45 transition-colors">
                  <label
                    htmlFor="hero-mobile-pickup-date"
                    className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-emerald-300 mb-1 font-bold"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pickup Date &amp; Time</span>
                  </label>
                  <div className="flex items-center gap-2 min-h-[42px]">
                    <input
                      id="hero-mobile-pickup-date"
                      type="date"
                      value={pickupDate}
                      min={minPickupDate}
                      onChange={(e) => onPickupDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[42px] w-full bg-transparent text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer min-w-0"
                    />
                    <span className="h-4 w-px bg-white/20 shrink-0" />
                    <select
                      aria-label="Mobile Pickup Time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime?.(e.target.value)}
                      className="min-h-[42px] bg-transparent text-sm font-mono font-bold text-white focus:outline-none cursor-pointer shrink-0"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Return Date & Time */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/30 hover:border-white/45 transition-colors">
                  <label
                    htmlFor="hero-mobile-return-date"
                    className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-amber-300 mb-1 font-bold"
                  >
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Return Date &amp; Time</span>
                  </label>
                  <div className="flex items-center gap-2 min-h-[42px]">
                    <input
                      id="hero-mobile-return-date"
                      type="date"
                      value={returnDate}
                      min={minReturnDate}
                      onChange={(e) => onReturnDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[42px] w-full bg-transparent text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer min-w-0"
                    />
                    <span className="h-4 w-px bg-white/20 shrink-0" />
                    <select
                      aria-label="Mobile Return Time"
                      value={returnTime}
                      onChange={(e) => setReturnTime?.(e.target.value)}
                      className="min-h-[42px] bg-transparent text-sm font-mono font-bold text-white focus:outline-none cursor-pointer shrink-0"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Action Row: Trip Summary Card (Left) + Search Button (Right) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
              <div className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-black/35 border border-white/35 backdrop-blur-xs flex items-center justify-center text-center">
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  <span className="text-amber-300 font-extrabold">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span> from {formatTripDate(pickupDate)} to {formatTripDate(returnDate)}
                </span>
              </div>
              <button
                type="button"
                onClick={onBookCar}
                className="sm:shrink-0 min-h-[44px] px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-xs border border-white/40 hover:border-white/60 active:scale-[0.98] text-white font-extrabold text-sm tracking-wider uppercase shadow-lg flex items-center justify-center cursor-pointer transition-all"
              >
                <span>SEARCH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
