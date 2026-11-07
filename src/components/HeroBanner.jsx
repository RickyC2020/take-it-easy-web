import React from 'react';
import { MapPin, Calendar, Clock, Car, ChevronDown } from 'lucide-react';

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
              - Native 1024x374 widescreen aspect ratio (Full Resolution)
              - "A Yah Suh Nice!" script + Pearl-white Mazda CX-5 (TIE plate)
             ========================================================= */}
          <div className="relative aspect-[1024/374] min-h-[240px] sm:min-h-[280px] lg:min-h-[374px] xl:min-h-0 w-full select-none overflow-hidden">
            <img
              src="/hero-banner.jpg?v=9"
              alt="Take It Easy Car Rentals - A Yah Suh Nice! Pearl white Mazda CX-5 with TIE plate driving on Jamaica's coastal highway beside the turquoise sea"
              className="w-full h-full object-cover"
            />

            {/* Semantic accessible headline for screen readers & SEO */}
            <h1 className="sr-only">
              Take It Easy Car Rentals &amp; Tours — A Yah Suh Nice!
            </h1>

            {/* =========================================================
                DESKTOP OVERLAY: GLASSMORPHIC SEARCH CARD (SPANS BANNER HEIGHT)
               ========================================================= */}
            <div className="hidden lg:flex absolute inset-y-0 right-0 z-10 w-full max-w-[460px] xl:max-w-[500px] p-2.5 xl:p-3.5">
              {/* Ultra-Transparent Glassmorphic Card Spanning Full Height */}
              <div
                id="hero-search-card"
                className="w-full h-full rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] backdrop-blur-xs border border-white/20 p-3.5 xl:p-4.5 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] text-white flex flex-col justify-between transition-all"
              >
                {/* Top Section: Eyebrow + 2x2 Search Inputs Grid */}
                <div className="space-y-2.5 xl:space-y-3.5">
                  {/* Card Eyebrow */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs xl:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow-md truncate">
                      GET INSTANT QUOTES | NO HIDDEN FEES
                    </span>
                    <span className="text-[11px] xl:text-xs font-mono font-bold px-2.5 py-0.5 xl:px-3 xl:py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 backdrop-blur-md shadow-xs tracking-wide shrink-0">
                      {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  {/* 2x2 Search Inputs Grid */}
                  <div className="grid grid-cols-2 gap-2 xl:gap-2.5 text-xs">
                    {/* 1. Pickup Location */}
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors">
                      <label
                        htmlFor="hero-desktop-location"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-emerald-300 mb-0.5 font-semibold drop-shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pickup Hub</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="hero-desktop-location"
                          value={locationId}
                          onChange={(e) => setLocationId?.(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-4 text-xs xl:text-sm font-semibold text-white focus:outline-none cursor-pointer truncate"
                        >
                          {locations.map((loc) => (
                            <option key={loc.id} value={loc.id} className="bg-[#1b2b2b] text-white">
                              {loc.shortName || loc.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                      </div>
                    </div>

                    {/* 2. Car Category */}
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors">
                      <label
                        htmlFor="hero-desktop-category"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-amber-300 mb-0.5 font-semibold drop-shadow-xs"
                      >
                        <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Vehicle Class</span>
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="hero-desktop-category"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory?.(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-4 text-xs xl:text-sm font-semibold text-white focus:outline-none cursor-pointer truncate"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#1b2b2b] text-white">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-300 pointer-events-none absolute right-0 shrink-0" />
                      </div>
                    </div>

                    {/* 3. Pickup Date & Time */}
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors">
                      <label
                        htmlFor="hero-desktop-pickup-date"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-emerald-300 mb-0.5 font-semibold drop-shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pickup Date</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="hero-desktop-pickup-date"
                          type="date"
                          value={pickupDate}
                          min={minPickupDate}
                          onChange={(e) => onPickupDateChange?.(e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-transparent text-xs font-semibold text-white tabular-nums focus:outline-none cursor-pointer"
                        />
                        <span className="h-3.5 w-px bg-white/20 shrink-0" />
                        <select
                          aria-label="Pickup Time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime?.(e.target.value)}
                          className="bg-transparent text-[11px] font-mono text-slate-200 focus:outline-none cursor-pointer shrink-0"
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
                    <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors">
                      <label
                        htmlFor="hero-desktop-return-date"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-amber-300 mb-0.5 font-semibold drop-shadow-xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Return Date</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="hero-desktop-return-date"
                          type="date"
                          value={returnDate}
                          min={minReturnDate}
                          onChange={(e) => onReturnDateChange?.(e.target.value)}
                          style={{ colorScheme: 'dark' }}
                          className="w-full bg-transparent text-xs font-semibold text-white tabular-nums focus:outline-none cursor-pointer"
                        />
                        <span className="h-3.5 w-px bg-white/20 shrink-0" />
                        <select
                          aria-label="Return Time"
                          value={returnTime}
                          onChange={(e) => setReturnTime?.(e.target.value)}
                          className="bg-transparent text-[11px] font-mono text-slate-200 focus:outline-none cursor-pointer shrink-0"
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

                {/* Primary Action Button: Integrated at bottom of full-height card */}
                <button
                  type="button"
                  onClick={onBookCar}
                  className="w-full min-h-[44px] xl:min-h-[48px] px-4 py-2.5 rounded-xl bg-black/[0.06] hover:bg-black/[0.12] backdrop-blur-xs border border-white/25 hover:border-white/40 active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center transition-all cursor-pointer mt-2"
                >
                  <span>SEARCH</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              MOBILE / TABLET (< lg): GLASSMORPHIC SEARCH CARD
             ========================================================= */}
          <div className="lg:hidden p-4 sm:p-5 bg-gradient-to-b from-[#192b2d] to-[#122224]">
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xs border border-white/15 p-4 shadow-xl text-white">
              {/* Card Eyebrow */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow-md truncate">
                  GET INSTANT QUOTES | NO HIDDEN FEES
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 backdrop-blur-md shadow-xs tracking-wide shrink-0">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </div>

              {/* 2-Column Responsive Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 1. Pickup Location */}
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <label
                    htmlFor="hero-mobile-location"
                    className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-emerald-300 mb-1 font-semibold"
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pickup Location</span>
                  </label>
                  <div className="relative flex items-center min-h-[40px]">
                    <select
                      id="hero-mobile-location"
                      value={locationId}
                      onChange={(e) => setLocationId?.(e.target.value)}
                      className="w-full min-h-[40px] appearance-none bg-transparent pr-6 text-sm font-semibold text-white focus:outline-none cursor-pointer"
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
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <label
                    htmlFor="hero-mobile-category"
                    className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-amber-300 mb-1 font-semibold"
                  >
                    <Car className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Car Category</span>
                  </label>
                  <div className="relative flex items-center min-h-[40px]">
                    <select
                      id="hero-mobile-category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory?.(e.target.value)}
                      className="w-full min-h-[40px] appearance-none bg-transparent pr-6 text-sm font-semibold text-white focus:outline-none cursor-pointer"
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
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <label
                    htmlFor="hero-mobile-pickup-date"
                    className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-emerald-300 mb-1 font-semibold"
                  >
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pickup Date &amp; Time</span>
                  </label>
                  <div className="flex items-center gap-2 min-h-[40px]">
                    <input
                      id="hero-mobile-pickup-date"
                      type="date"
                      value={pickupDate}
                      min={minPickupDate}
                      onChange={(e) => onPickupDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[40px] w-full bg-transparent text-sm font-semibold text-white tabular-nums focus:outline-none cursor-pointer"
                    />
                    <span className="h-4 w-px bg-white/20 shrink-0" />
                    <select
                      aria-label="Mobile Pickup Time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime?.(e.target.value)}
                      className="min-h-[40px] bg-transparent text-xs font-mono text-slate-200 focus:outline-none cursor-pointer shrink-0"
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
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <label
                    htmlFor="hero-mobile-return-date"
                    className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-amber-300 mb-1 font-semibold"
                  >
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Return Date &amp; Time</span>
                  </label>
                  <div className="flex items-center gap-2 min-h-[40px]">
                    <input
                      id="hero-mobile-return-date"
                      type="date"
                      value={returnDate}
                      min={minReturnDate}
                      onChange={(e) => onReturnDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[40px] w-full bg-transparent text-sm font-semibold text-white tabular-nums focus:outline-none cursor-pointer"
                    />
                    <span className="h-4 w-px bg-white/20 shrink-0" />
                    <select
                      aria-label="Mobile Return Time"
                      value={returnTime}
                      onChange={(e) => setReturnTime?.(e.target.value)}
                      className="min-h-[40px] bg-transparent text-xs font-mono text-slate-200 focus:outline-none cursor-pointer shrink-0"
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

            {/* Mobile Action Button below card: Transparent glass look */}
            <button
              type="button"
              onClick={onBookCar}
              className="w-full mt-3 min-h-[48px] px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-xs border border-white/20 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-lg flex items-center justify-center cursor-pointer transition-all"
            >
              <span>SEARCH</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
