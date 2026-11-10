import React from 'react';
import { LayoutGrid, CalendarDays, PlusCircle, RotateCcw, Globe } from 'lucide-react';

export default function CounterBottomNav({
  activeTab,
  onSelectTab,
  onNewContract,
  onOpenReturns,
  onNavigatePublic,
  dispatchCount = 0,
}) {
  return (
    <nav
      aria-label="Staff Counter Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/15 px-2 py-2 print:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
        {/* Tab 1: Fleet */}
        <button
          type="button"
          onClick={() => onSelectTab('fleet')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${
            activeTab === 'fleet'
              ? 'text-emerald-400 bg-emerald-500/15 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Fleet</span>
        </button>

        {/* Tab 2: Dispatch */}
        <button
          type="button"
          onClick={() => onSelectTab('dispatch')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer relative ${
            activeTab === 'dispatch'
              ? 'text-emerald-400 bg-emerald-500/15 font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarDays className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Dispatch</span>
          {dispatchCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-mono font-bold text-[9px] flex items-center justify-center shadow-xs">
              {dispatchCount}
            </span>
          )}
        </button>

        {/* Action: New Contract */}
        <button
          type="button"
          onClick={onNewContract}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-amber-400 hover:text-amber-300 transition cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span className="text-[10px] font-semibold tracking-tight">New Rental</span>
        </button>

        {/* Action: Returns */}
        <button
          type="button"
          onClick={onOpenReturns}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-cyan-400 hover:text-cyan-300 transition cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-tight">Returns</span>
        </button>

        {/* Public Website */}
        <button
          type="button"
          onClick={onNavigatePublic}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
        >
          <Globe className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Public Site</span>
        </button>
      </div>
    </nav>
  );
}

