import React from 'react';
import { MapPin, Calendar, Clock, Car, ChevronDown, ArrowRight } from 'lucide-react';

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
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-[#152528]">
          {/* =========================================================
              HERO BANNER ARTWORK
              - Native 1024x317 ultra-panoramic widescreen aspect ratio
              - "A Yah Suh Nice!" script + Pearl-white Mazda CX-5
             ========================================================= */}
          <div className="relative aspect-[1024/317] w-full select-none overflow-hidden">
            <img
              src="/hero-banner.jpg?v=5"
              alt="Take It Easy Car Rentals - A Yah Suh Nice! Pearl white Mazda CX-5 driving on Jamaica's coastal highway beside the turquoise sea"
              className="w-full h-full object-cover"
            />

            {/* Subtle right-side gradient overlay on desktop for contrast */}
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/55 pointer-events-none" />

            {/* Semantic accessible headline for screen readers & SEO */}
            <h1 className="sr-only">
              Take It Easy Car Rentals &amp; Tours — A Yah Suh Nice!
            </h1>

            {/* =========================================================
                DESKTOP OVERLAY: GLASSMORPHIC SEARCH CARD (RIGHT SIDE)
               ========================================================= */}
            <div className="hidden lg:flex absolute inset-y-0 right-0 z-10 items-center justify-end p-4 xl:p-6 w-full max-w-[480px] xl:max-w-[520px]">
              <div className="w-full">
                {/* Near-Transparent Glassmorphic Card */}
                <div
                  id="hero-search-card"
                  className="rounded-2xl bg-slate-950/40 backdrop-blur-md border border-white/25 p-3.5 xl:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] text-white transition-all"
                >
                  {/* Card Eyebrow */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
                        Reserve Your Ride
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 border border-amber-400/40">
                      {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  {/* 2x2 Search Inputs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* 1. Pickup Location */}
                    <div className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-colors">
                      <label
                        htmlFor="hero-desktop-location"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-emerald-300 mb-0.5 font-semibold"
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
                    <div className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-colors">
                      <label
                        htmlFor="hero-desktop-category"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-amber-300 mb-0.5 font-semibold"
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
                    <div className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-colors">
                      <label
                        htmlFor="hero-desktop-pickup-date"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-emerald-300 mb-0.5 font-semibold"
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
                    <div className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-colors">
                      <label
                        htmlFor="hero-desktop-return-date"
                        className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-amber-300 mb-0.5 font-semibold"
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

                {/* Primary Action Button: Below the card */}
                <button
                  type="button"
                  onClick={onBookCar}
                  className="w-full mt-2.5 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:from-emerald-500 hover:to-amber-400 active:scale-[0.98] text-white font-extrabold text-sm tracking-wide shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/25"
                >
                  <Car className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Book a Car Now</span>
                  <ArrowRight className="w-4 h-4 text-white/90 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              MOBILE / TABLET (< lg): GLASSMORPHIC SEARCH CARD
             ========================================================= */}
          <div className="lg:hidden p-4 sm:p-5 bg-gradient-to-b from-[#192b2d] to-[#122224] border-t border-white/10">
            <div className="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/20 p-4 shadow-xl text-white">
              {/* Card Eyebrow */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Find Your Rental Vehicle
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-300 border border-amber-400/35">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </div>

              {/* 2-Column Responsive Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 1. Pickup Location */}
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/15">
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
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/15">
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
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/15">
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
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/15">
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

            {/* Mobile Action Button below card */}
            <button
              type="button"
              onClick={onBookCar}
              className="w-full mt-3 min-h-[48px] px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 active:scale-[0.98] text-white font-extrabold text-base tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <Car className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Book a Car Now</span>
              <ArrowRight className="w-4 h-4 text-white/90 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
