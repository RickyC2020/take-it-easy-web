import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, RotateCcw, Check } from 'lucide-react';

export default function SignaturePad({
  label = 'Customer Signature',
  sublabel = 'Draw signature with mouse/trackpad or switch to Type',
  value,
  onChange,
  defaultTypedName = ''
}) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('draw'); // 'draw' | 'type'
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedText, setTypedText] = useState(defaultTypedName);

  // Setup high-DPI canvas when in draw mode
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
  }, [mode]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e) => {
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
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
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
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTypedText('');
    onChange(null);
  };

  const handleTypedChange = (text) => {
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
    <div className="border border-brand-border rounded-lg bg-white overflow-hidden">
      {/* Header Toolbar */}
      <div className="px-4 py-3 border-b border-brand-border bg-brand-canvas/80 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-brand-ink font-semibold">
              {label}
            </span>
            {isSigned && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-palm bg-brand-palm-soft border border-brand-palm/25 px-2 py-0.5 rounded">
                <Check className="w-3.5 h-3.5" />
                Signed {value.signedAt}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">{sublabel}</p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="inline-flex rounded-lg border border-brand-border bg-white p-0.5">
            <button
              type="button"
              onClick={() => switchMode('draw')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                mode === 'draw'
                  ? 'bg-brand-palm text-white'
                  : 'text-slate-600 hover:text-brand-ink'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Draw</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('type')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                mode === 'type'
                  ? 'bg-brand-palm text-white'
                  : 'text-slate-600 hover:text-brand-ink'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Type</span>
            </button>
          </div>

          {isSigned && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-lg border border-brand-border bg-white text-slate-600 hover:text-brand-ink cursor-pointer"
              title="Clear signature"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Signature Surface */}
      {mode === 'draw' ? (
        <div className="relative bg-white">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full h-32 touch-none cursor-crosshair block"
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
            value={typedText}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder="Type full legal name to sign..."
            className="w-full px-3.5 py-2.5 rounded-md border border-brand-border text-sm sm:text-base text-brand-ink focus:border-brand-palm focus:outline-none"
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
