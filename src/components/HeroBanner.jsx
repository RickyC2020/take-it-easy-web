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
              - Native 1024x374 widescreen aspect ratio (Full Image Visible, Zero Crop)
              - "A Yah Suh Nice!" script + Pearl-white Mazda CX-5 (TIE plate)
             ========================================================= */}
          <div className="relative aspect-[1024/374] w-full select-none overflow-hidden">
            <img
              src="/hero-banner.jpg?v=10"
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
            <div className="hidden lg:flex absolute inset-y-0 right-0 z-10 w-full max-w-[430px] xl:max-w-[480px] 2xl:max-w-[500px] p-2 xl:p-3">
              {/* Ultra-Transparent Glassmorphic Card Spanning Full Height */}
              <div
                id="hero-search-card"
                className="w-full h-full rounded-2xl bg-black/[0.04] hover:bg-black/[0.08] backdrop-blur-xs border border-white/20 p-3 xl:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] text-white flex flex-col justify-between transition-all"
              >
                {/* 1. Noticeable Heading */}
                <div className="flex items-center justify-between gap-2.5 border-b border-white/15 pb-2 xl:pb-2.5">
                  <h2 className="text-xs xl:text-sm font-black tracking-wider uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-tight truncate">
                    GET INSTANT QUOTES <span className="text-emerald-300 font-bold">|</span> NO HIDDEN FEES
                  </h2>
                  <span className="text-[10px] xl:text-xs font-mono font-bold px-2 py-0.5 xl:px-2.5 xl:py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 backdrop-blur-md shadow-xs tracking-wide shrink-0">
                    {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>

                {/* 2. Middle Grid: Expands to Fill Available Card Space */}
                <div className="grid grid-cols-2 gap-2 xl:gap-3 flex-1 my-2.5 xl:my-3">
                  {/* 1. Pickup Location */}
                  <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors flex flex-col justify-center">
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
                  <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors flex flex-col justify-center">
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
                  <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <label
                        htmlFor="hero-desktop-pickup-date"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-emerald-300 font-bold drop-shadow-xs truncate"
                      >
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pickup Date</span>
                      </label>
                      <div className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-2 py-0.5 rounded-md shrink-0">
                        <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                        <select
                          aria-label="Pickup Time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime?.(e.target.value)}
                          className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="relative flex items-center min-w-0">
                      <input
                        id="hero-desktop-pickup-date"
                        type="date"
                        value={pickupDate}
                        min={minPickupDate}
                        onChange={(e) => onPickupDateChange?.(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                        className="w-full min-w-0 bg-transparent text-sm xl:text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 4. Return Date & Time */}
                  <div className="p-2.5 xl:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/15 transition-colors flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <label
                        htmlFor="hero-desktop-return-date"
                        className="flex items-center gap-1.5 font-mono text-xs xl:text-[13px] uppercase tracking-wider text-amber-300 font-bold drop-shadow-xs truncate"
                      >
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Return Date</span>
                      </label>
                      <div className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-2 py-0.5 rounded-md shrink-0">
                        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                        <select
                          aria-label="Return Time"
                          value={returnTime}
                          onChange={(e) => setReturnTime?.(e.target.value)}
                          className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                        >
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="relative flex items-center min-w-0">
                      <input
                        id="hero-desktop-return-date"
                        type="date"
                        value={returnDate}
                        min={minReturnDate}
                        onChange={(e) => onReturnDateChange?.(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                        className="w-full min-w-0 bg-transparent text-sm xl:text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Button: Prominent & Stretched */}
                <button
                  type="button"
                  onClick={onBookCar}
                  className="w-full min-h-[40px] xl:min-h-[46px] px-4 py-2.5 rounded-xl bg-black/[0.06] hover:bg-black/[0.14] backdrop-blur-xs border border-white/25 hover:border-white/40 active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center transition-all cursor-pointer"
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
              {/* Noticeable Heading */}
              <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-2.5 mb-3.5">
                <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-white drop-shadow-md truncate">
                  GET INSTANT QUOTES <span className="text-emerald-300 font-bold">|</span> NO HIDDEN FEES
                </h2>
                <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/35 backdrop-blur-md shadow-xs tracking-wide shrink-0">
                  {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
                </span>
              </div>

              {/* 2-Column Responsive Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {/* 1. Pickup Location */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
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
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
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
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label
                      htmlFor="hero-mobile-pickup-date"
                      className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-emerald-300 font-bold truncate"
                    >
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Pickup Date</span>
                    </label>
                    <div className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-2 py-0.5 rounded-md shrink-0">
                      <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <select
                        aria-label="Mobile Pickup Time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime?.(e.target.value)}
                        className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative flex items-center min-w-0 min-h-[42px]">
                    <input
                      id="hero-mobile-pickup-date"
                      type="date"
                      value={pickupDate}
                      min={minPickupDate}
                      onChange={(e) => onPickupDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[42px] w-full min-w-0 bg-transparent text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Return Date & Time */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <label
                      htmlFor="hero-mobile-return-date"
                      className="flex items-center gap-1.5 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-amber-300 font-bold truncate"
                    >
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Return Date</span>
                    </label>
                    <div className="flex items-center gap-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-2 py-0.5 rounded-md shrink-0">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <select
                        aria-label="Mobile Return Time"
                        value={returnTime}
                        onChange={(e) => setReturnTime?.(e.target.value)}
                        className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot} className="bg-[#1b2b2b] text-white">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="relative flex items-center min-w-0 min-h-[42px]">
                    <input
                      id="hero-mobile-return-date"
                      type="date"
                      value={returnDate}
                      min={minReturnDate}
                      onChange={(e) => onReturnDateChange?.(e.target.value)}
                      style={{ colorScheme: 'dark' }}
                      className="min-h-[42px] w-full min-w-0 bg-transparent text-base font-bold text-white tabular-nums focus:outline-none cursor-pointer"
                    />
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
