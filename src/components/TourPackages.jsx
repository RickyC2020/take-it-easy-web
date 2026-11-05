import React from 'react';
import { Clock, MapPin, Plus, Check } from 'lucide-react';

const TOUR_PACKAGES = [
  {
    id: 'dunns-river',
    title: "Dunn's River Falls Excursion",
    duration: 'Half-Day',
    price: 85,
    image: '/tours/dunns-river.jpg',
    imageAlt: "Terraced limestone waterfalls cascading through tropical forest at Dunn's River Falls",
    locationLabel: 'Ocho Rios · Scenic Coast',
    description:
      'Climb the world-famous terraced limestone waterfalls and cool off in natural lagoons with guided round-trip coastal transport.'
  },
  {
    id: 'negril-ricks',
    title: "Negril Sunset & Rick's Cafe",
    duration: 'Full-Day',
    price: 120,
    image: '/tours/negril-ricks.jpg',
    imageAlt: "Cliffside terrace overlooking turquoise Caribbean waters at sunset at Rick's Cafe in Negril",
    locationLabel: 'Seven Mile Beach & West End',
    description:
      "Unwind along Negril's white-sand shoreline before watching cliff divers and a golden Caribbean sunset from iconic Rick's Cafe."
  },
  {
    id: 'chauffeur-service',
    title: 'Chauffeur Service',
    duration: 'Daily',
    price: 150,
    image: '/tours/chauffeur.jpg',
    imageAlt: 'Private chauffeur in a tailored suit opening the passenger door of a black sedan',
    locationLabel: 'Island-Wide Private Driver',
    description:
      'Relax in the passenger seat while a licensed, island-savvy local driver handles airport pickup, navigation, and custom stops.'
  }
];

export default function TourPackages({ selectedTourIds = [], onToggleTour }) {
  return (
    <section
      aria-labelledby="tour-packages-heading"
      className="mt-14 pt-10 border-t border-brand-ink/10 print:hidden"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-palm">
            Tours &amp; Chauffeur Add-Ons
          </span>
          <h2
            id="tour-packages-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-ink mt-1"
          >
            Enhance Your Trip.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
            Add guided Jamaican experiences or a dedicated private driver directly to your rental
            booking.
          </p>
        </div>

        {selectedTourIds.length > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-pill text-xs sm:text-sm font-mono font-medium text-brand-palm self-start sm:self-auto">
            <Check className="w-4 h-4 shrink-0" />
            <span>
              {selectedTourIds.length} add-on{selectedTourIds.length > 1 ? 's' : ''} attached to
              booking
            </span>
          </div>
        )}
      </div>

      {/* Responsive Tour Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TOUR_PACKAGES.map((tour) => {
          const isSelected = selectedTourIds.includes(tour.id);

          return (
            <article
              key={tour.id}
              className={`group rounded-2xl bg-emerald-900/95 backdrop-blur-xl border transition-all flex flex-col overflow-hidden shadow-[0_14px_34px_rgba(6,46,34,0.20),inset_0_1px_0_rgba(255,255,255,0.16)] ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/55'
                  : 'border-emerald-700/70 hover:border-amber-400/60'
              }`}
            >
              {/* Top Tour Photograph */}
              <div className="relative h-52 border-b border-white/12 overflow-hidden bg-emerald-950">
                <img
                  src={tour.image}
                  alt={tour.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                />

                {/* Subtle contrast scrim for badges & smooth blend into emerald card */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-black/35"
                  aria-hidden="true"
                />

                {/* Location Badge */}
                <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/35 border border-white/20 backdrop-blur-md text-[11px] font-mono text-white">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{tour.locationLabel}</span>
                </span>

                {/* Duration Tag */}
                <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 border border-white/25 backdrop-blur-md text-xs font-mono font-medium text-white">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{tour.duration}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-800/90 border border-emerald-600/60 text-xs font-mono font-medium text-emerald-100">
                    {tour.duration}
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {tour.title}
                </h3>

                <p className="text-sm sm:text-base text-emerald-100/90 mt-2 leading-relaxed flex-1">
                  {tour.description}
                </p>

                {/* Price & Add to Booking CTA */}
                <div className="mt-6 pt-4 border-t border-white/12 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight font-mono tabular-nums text-amber-400">
                        ${tour.price}
                      </span>
                      <span className="text-xs font-mono uppercase text-emerald-200/80">
                        USD
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-emerald-200/80 block mt-0.5">
                      {tour.duration === 'Daily' ? 'per rental day' : 'flat excursion rate'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleTour && onToggleTour(tour)}
                    className={`min-h-[46px] px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold inline-flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-[0_6px_18px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] ${
                      isSelected
                        ? 'bg-amber-300 hover:bg-amber-200 text-emerald-950 ring-2 ring-white/50'
                        : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-emerald-950'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Added to Booking</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>Add to Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
