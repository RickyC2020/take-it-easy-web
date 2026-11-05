import React from 'react';
import { MessageCircle } from 'lucide-react';

const DEFAULT_WHATSAPP_URL =
  'https://wa.me/18764426735?text=Hi%20Take%20It%20Easy%20Car%20Rentals%20%26%20Tours%2C%20I%20need%20help%20with%20a%20rental%20booking.';

export default function WhatsAppWidget({ href = DEFAULT_WHATSAPP_URL }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Take It Easy support on WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 min-h-[54px] min-w-[54px] px-4 sm:px-5 py-3.5 rounded-full bg-emerald-900 hover:bg-emerald-800 active:scale-[0.98] text-white border border-emerald-600/70 shadow-[0_12px_32px_rgba(6,46,34,0.38),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl inline-flex items-center justify-center gap-2.5 transition-all print:hidden group"
    >
      <span className="relative flex items-center justify-center">
        <MessageCircle className="w-6 h-6 text-amber-400 transition-transform duration-200 group-hover:scale-110 shrink-0" />
        <span
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900"
          aria-hidden="true"
        />
      </span>
      <span className="text-sm sm:text-base font-semibold tracking-tight pr-0.5">
        WhatsApp Support
      </span>
    </a>
  );
}

