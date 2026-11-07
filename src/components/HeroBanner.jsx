import React from 'react';
import { Compass, ShieldCheck, Infinity as InfinityIcon } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section aria-label="Hero Banner" className="py-3 sm:py-4 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-xl overflow-hidden bg-transparent">
          
          {/* =========================================================
              HERO BANNER ARTWORK
              - User-provided panoramic artwork with:
                * "A Yah Suh Nice!"
                * Pearl-white Mazda CX-5 driving on the left lane
                * Native 1024x317 ultra-panoramic widescreen aspect ratio
             ========================================================= */}
          <div className="relative aspect-[1024/317] w-full select-none overflow-hidden">
            <img
              src="/hero-banner.jpg?v=4"
              alt="Take It Easy Car Rentals - A Yah Suh Nice! Pearl white Mazda CX-5 driving on Jamaica's coastal highway beside the turquoise sea"
              className="w-full h-full object-cover"
            />

            {/* Semantic accessible headline for screen readers & SEO */}
            <h1 className="sr-only">
              Take It Easy Car Rentals &amp; Tours — A Yah Suh Nice!
            </h1>

            {/* Desktop Frosted Glass Cards (Floats naturally over the asphalt road curve without obscuring the vehicle on the left or text on the right) */}
            <div className="hidden sm:flex absolute bottom-2.5 right-4 md:bottom-3 md:right-6 lg:bottom-4 lg:right-8 items-center gap-2 md:gap-2.5 lg:gap-3 z-10">
              
              {/* Card 1: Island-Wide Support */}
              <div className="bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-1.5 md:p-2 lg:p-2.5 flex items-center gap-2 lg:gap-2.5 shadow-lg min-w-[125px] md:min-w-[145px] shrink-0 transition-colors">
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-white/30 flex items-center justify-center text-white text-xs shrink-0 bg-white/5">
                  <Compass className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-white leading-tight">
                    Island-Wide Support
                  </p>
                  <p className="text-[8px] md:text-[9px] lg:text-[10px] text-white/75 font-normal leading-tight mt-0.5">
                    24/7 peace of mind
                  </p>
                </div>
              </div>

              {/* Card 2: Free Cancellation */}
              <div className="bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-1.5 md:p-2 lg:p-2.5 flex items-center gap-2 lg:gap-2.5 shadow-lg min-w-[125px] md:min-w-[145px] shrink-0 transition-colors">
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-white/30 flex items-center justify-center text-white text-xs shrink-0 bg-white/5">
                  <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-white leading-tight">
                    Free Cancellation
                  </p>
                  <p className="text-[8px] md:text-[9px] lg:text-[10px] text-white/75 font-normal leading-tight mt-0.5">
                    Flexible plans &amp; cancel
                  </p>
                </div>
              </div>

              {/* Card 3: Unlimited Mileage */}
              <div className="bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-1.5 md:p-2 lg:p-2.5 flex items-center gap-2 lg:gap-2.5 shadow-lg min-w-[125px] md:min-w-[145px] shrink-0 transition-colors">
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-white/30 flex items-center justify-center text-white text-xs shrink-0 bg-white/5">
                  <InfinityIcon className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-white leading-tight">
                    Unlimited Mileage
                  </p>
                  <p className="text-[8px] md:text-[9px] lg:text-[10px] text-white/75 font-normal leading-tight mt-0.5">
                    Explore without limits
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile Feature Cards (Docked cleanly below the artwork on narrow screens to prevent text overlap) */}
          <div className="sm:hidden px-3 py-2.5 bg-[#091a14]">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              
              <div className="bg-white/10 border border-white/15 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shrink-0">
                <Compass className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                  Island-Wide Support
                </span>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                  Free Cancellation
                </span>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shrink-0">
                <InfinityIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">
                  Unlimited Mileage
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
