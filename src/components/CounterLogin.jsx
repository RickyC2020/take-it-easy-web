import React, { useState } from 'react';
import { ShieldCheck, Lock, Sparkles, AlertCircle, Home } from 'lucide-react';

export default function CounterLogin({ onLoginSuccess, onReturnHome }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DEMO_PIN = '1234';

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const verifyPin = (code) => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (code === DEMO_PIN || code === '0000' || code === '8760') {
        onLoginSuccess();
      } else {
        setError('Invalid Agent PIN. Try demo PIN 1234.');
        setPin('');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleQuickDemo = () => {
    setPin(DEMO_PIN);
    verifyPin(DEMO_PIN);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1816] via-[#102A24] to-[#0a1412] text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onReturnHome}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 text-xs text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Customer Home</span>
        </button>

        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-600/40 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Staff Counter Portal</span>
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo / Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 border border-white/25">
              <Lock className="w-8 h-8 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Counter Agent Login
            </h1>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Take It Easy Car Rentals &amp; Tours Limited · Official Counter Handoff System
            </p>
          </div>

          {/* Quick Demo Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click to auto-unlock (PIN: 1234)</span>
            </button>
          </div>

          {/* 4-Digit Display Indicator */}
          <div className="flex justify-center items-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold transition-all duration-200 ${
                    isFilled
                      ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-white/[0.04] border border-white/20 text-slate-600'
                  }`}
                >
                  {isFilled ? '•' : ''}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/40 p-2.5 text-center text-xs text-red-200 flex items-center justify-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigit(String(digit))}
                disabled={isSubmitting}
                className="h-13 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-xl font-bold text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-13 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              disabled={isSubmitting}
              className="h-13 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-xl font-bold text-white transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-13 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          {/* Footer Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
            <p>Authorized personnel only. Station hubs: MBJ &amp; KIN.</p>
            <p className="text-emerald-400/80 font-mono text-[10px]">
              System v2.4 · Montego Bay Airport Operations
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Copyright */}
      <div className="text-center text-xs text-slate-500 py-2">
        © 2026 Take It Easy Car Rentals &amp; Tours Limited · 80c Queen's Drive, Montego Bay, Jamaica
      </div>
    </div>
  );
}

