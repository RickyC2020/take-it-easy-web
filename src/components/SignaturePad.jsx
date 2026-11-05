import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, RotateCcw, Check } from 'lucide-react';

export default function SignaturePad({
  label = 'Customer Signature',
  sublabel = 'Draw signature with mouse/trackpad or switch to Type',
  value,
  onChange,
  defaultTypedName = '',
  initialMode = 'draw',
  disabled = false
}) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState(() => value?.mode || initialMode); // 'draw' | 'type'
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedText, setTypedText] = useState(() => value?.text || defaultTypedName);

  // Setup high-DPI canvas when in draw mode (and restore existing drawn image if remounted)
  useEffect(() => {
    if (mode !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#162629';

    if (value?.mode === 'draw' && value?.dataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = value.dataUrl;
    }
  }, [mode, value?.mode, value?.dataUrl]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const handlePointerMove = (e) => {
    if (disabled || !isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (disabled || !isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange({
        mode: 'draw',
        dataUrl,
        text: '',
        signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const handleClear = () => {
    if (disabled) return;
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTypedText('');
    onChange(null);
  };

  const handleTypedChange = (text) => {
    if (disabled) return;
    setTypedText(text);
    if (!text.trim()) {
      onChange(null);
      return;
    }
    onChange({
      mode: 'type',
      dataUrl: null,
      text: text.trim(),
      signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const switchMode = (nextMode) => {
    if (disabled) return;
    setMode(nextMode);
    if (nextMode === 'type' && (typedText || defaultTypedName)) {
      const nameToUse = typedText || defaultTypedName;
      setTypedText(nameToUse);
      if (nameToUse.trim()) {
        onChange({
          mode: 'type',
          dataUrl: null,
          text: nameToUse.trim(),
          signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } else if (nextMode === 'draw') {
      onChange(null);
    }
  };

  const isSigned = Boolean(value && (value.dataUrl || value.text));

  return (
    <div
      className={`glass-surface rounded-xl overflow-hidden transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed select-none' : ''
      }`}
    >
      {/* Header Toolbar */}
      <div className="px-4 py-3 border-b border-brand-ink/10 bg-white/45 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand-ink font-semibold">
              {label}
            </span>
            {isSigned && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-palm bg-brand-palm-soft/80 border border-brand-palm/25 px-2 py-0.5 rounded-md">
                <Check className="w-3.5 h-3.5" />
                Signed {value.signedAt}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">{sublabel}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="inline-flex rounded-xl glass-pill p-0.5">
            <button
              type="button"
              disabled={disabled}
              onClick={() => switchMode('draw')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
                disabled
                  ? 'cursor-not-allowed text-slate-400'
                  : mode === 'draw'
                    ? 'glass-cta text-white cursor-pointer'
                    : 'text-slate-600 hover:text-brand-ink cursor-pointer'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Draw</span>
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => switchMode('type')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
                disabled
                  ? 'cursor-not-allowed text-slate-400'
                  : mode === 'type'
                    ? 'glass-cta text-white cursor-pointer'
                    : 'text-slate-600 hover:text-brand-ink cursor-pointer'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Type</span>
            </button>
          </div>

          {isSigned && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl glass-pill text-slate-600 hover:text-brand-ink cursor-pointer"
              title="Clear signature"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Signature Surface */}
      {mode === 'draw' ? (
        <div className="relative bg-white/80">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`w-full h-32 touch-none block ${
              disabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-crosshair'
            }`}
          />
          {/* Baseline & X mark */}
          <div className="pointer-events-none absolute inset-x-4 bottom-4 border-b border-dashed border-slate-300 flex items-end justify-between pb-1">
            <span className="text-sm font-mono text-slate-400 select-none">×</span>
            {!isSigned && (
              <span className="text-xs font-mono text-slate-400 select-none">
                Sign on line
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-white space-y-2.5">
          <input
            type="text"
            disabled={disabled}
            value={typedText}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder={
              disabled
                ? 'Scroll to bottom of contract to unlock...'
                : 'Type full legal name to sign...'
            }
            className={`w-full px-3.5 py-2.5 rounded-md border border-brand-border text-sm sm:text-base text-brand-ink focus:border-brand-palm focus:outline-none ${
              disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''
            }`}
          />
          <div className="h-16 px-4 rounded-md bg-brand-canvas border border-dashed border-brand-border flex items-center justify-between">
            <span className="text-sm font-mono text-slate-400">×</span>
            <span className="text-2xl italic font-serif text-brand-ink tracking-wide truncate px-2">
              {typedText || 'Signature Preview'}
            </span>
            <span className="text-xs font-mono text-slate-500">E-SIGN</span>
          </div>
        </div>
      )}
    </div>
  );
}
