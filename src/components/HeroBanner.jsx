import React from 'react';

export default function HeroBanner() {
  return (
    <section aria-label="Hero Banner" className="py-3 sm:py-4 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-xl overflow-hidden bg-transparent">
          {/* =========================================================
              HERO BANNER ARTWORK
              - Pure panoramic artwork with:
                * "A Yah Suh Nice!"
                * Pearl-white Mazda CX-5 driving along the Jamaican coast
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
          </div>
        </div>
      </div>
    </section>
  );
}
