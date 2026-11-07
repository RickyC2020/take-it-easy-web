import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Lock,
  ChevronDown,
  Wrench,
  FileCheck2,
  Phone,
  MessageCircle,
  Car,
  Compass,
  Info,
  CalendarCheck2,
  Mail,
} from 'lucide-react';

export default function Navbar({
  onNavigateFleet,
  onNavigateTours,
  onOpenRentalInfo,
  onOpenMyBooking,
  onOpenContact,
  onOpenReturnPOS,
  onOpenContracts,
  reservationsCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setStaffDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setStaffDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavAction = (action) => {
    setMobileMenuOpen(false);
    setStaffDropdownOpen(false);
    if (typeof action === 'function') {
      action();
    }
  };

  const scrollToFleet = () => {
    const el = document.getElementById('fleet-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateFleet) {
      onNavigateFleet();
    }
  };

  const scrollToTours = () => {
    const el = document.getElementById('tour-packages-heading') || document.querySelector('[aria-labelledby="tour-packages-heading"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigateTours) {
      onNavigateTours();
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenContact) {
      onOpenContact();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-header/95 backdrop-blur-md border-b border-white/10 shadow-[0_6px_24px_rgba(16,32,34,0.16)] print:hidden transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 md:h-24 gap-4">
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center min-w-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="block cursor-pointer"
              aria-label="Take It Easy Car Rentals & Tours Home"
            >
              <img
                src="/logo.jpg?v=4"
                alt="Take It Easy Car Rentals & Tours"
                className="block h-auto max-h-14 sm:max-h-16 md:max-h-16 lg:max-h-20 w-auto max-w-full select-none"
              />
            </a>
          </div>

          {/* 2. Center: Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              type="button"
              onClick={() => handleNavAction(scrollToFleet)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Our Fleet</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(scrollToTours)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Island Tours</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(onOpenRentalInfo)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-emerald-300" />
              <span>Rental Info</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(onOpenMyBooking)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CalendarCheck2 className="w-4 h-4 text-emerald-300" />
              <span>My Booking</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(scrollToContact)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white/90 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Contact</span>
            </button>
          </nav>

          {/* 3. Right-Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Staff Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setStaffDropdownOpen((prev) => !prev)}
                aria-expanded={staffDropdownOpen}
                aria-haspopup="true"
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/35 text-white/90 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                <span>Staff</span>
                {reservationsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    staffDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Content */}
              {staffDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f241d] border border-white/15 shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-3.5 py-1.5 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Staff Counter Portal</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavAction(onOpenReturnPOS)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/[0.08] text-white/90 hover:text-white text-sm flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-[#66C7BF]" />
                      <span>Return &amp; POS</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavAction(onOpenContracts)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/[0.08] text-white/90 hover:text-white text-sm flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck2 className="w-4 h-4 text-[#6BC47D]" />
                      <span>Contracts</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md font-mono text-xs tabular-nums bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
                      {reservationsCount}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 4. Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="p-2.5 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d211a] px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-fadeIn">
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleNavAction(scrollToFleet)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.08] text-white font-medium text-base flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Car className="w-5 h-5 text-emerald-400" />
              <span>Our Fleet</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(scrollToTours)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.08] text-white font-medium text-base flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Island Tours</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(onOpenRentalInfo)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.08] text-white font-medium text-base flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Info className="w-5 h-5 text-emerald-300" />
              <span>Rental Info</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(onOpenMyBooking)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.08] text-white font-medium text-base flex items-center gap-3 transition-colors cursor-pointer"
            >
              <CalendarCheck2 className="w-5 h-5 text-emerald-300" />
              <span>My Booking</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavAction(scrollToContact)}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.08] text-white font-medium text-base flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Mail className="w-5 h-5 text-amber-300" />
              <span>Contact</span>
            </button>
          </div>

          {/* Divider: Staff Portal */}
          <div className="pt-3 border-t border-white/10">
            <div className="px-4 py-1 text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff Portal</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleNavAction(onOpenReturnPOS)}
                className="px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Wrench className="w-4 h-4 text-[#66C7BF]" />
                <span>Return &amp; POS</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavAction(onOpenContracts)}
                className="px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FileCheck2 className="w-4 h-4 text-[#6BC47D]" />
                <span>Contracts ({reservationsCount})</span>
              </button>
            </div>
          </div>

          {/* Bottom Direct Quick Actions */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <a
              href="https://wa.me/18767899051"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct (+1 876-789-9051)</span>
            </a>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <a
                href="tel:+18767899051"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 text-xs font-mono flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>789-9051</span>
              </a>
              <a
                href="tel:+18768852355"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 text-xs font-mono flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>885-2355</span>
              </a>
              <a
                href="tel:+18764426735"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/90 text-xs font-mono flex items-center justify-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>442-6735</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

