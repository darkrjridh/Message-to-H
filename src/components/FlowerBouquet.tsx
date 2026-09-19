import { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface FlowerBouquetProps {
  onReplay?: () => void;
  autoStart?: boolean;
}

export default function FlowerBouquet({ onReplay, autoStart = true }: FlowerBouquetProps) {
  const [phase, setPhase] = useState<'drawing' | 'bloomed'>('drawing');
  const [textVisible, setTextVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const bouquetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoStart) return;

    setPhase('drawing');
    setTextVisible(false);

    // After drawing outlines, trigger color blooming
    const bloomTimer = setTimeout(() => {
      setPhase('bloomed');
    }, 2800);

    // Reveal the handwritten "here's a little gift"
    const textTimer = setTimeout(() => {
      setTextVisible(true);
      // Spawn gentle floating sparkles
      const newSparkles = Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 15 + Math.random() * 70,
        size: Math.random() * 8 + 4,
      }));
      setSparkles(newSparkles);
    }, 3800);

    return () => {
      clearTimeout(bloomTimer);
      clearTimeout(textTimer);
    };
  }, [autoStart]);

  const handleRestart = () => {
    setPhase('drawing');
    setTextVisible(false);
    setTimeout(() => setPhase('bloomed'), 2800);
    setTimeout(() => setTextVisible(true), 3800);
  };

  const handleBouquetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const burst = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() * 16 - 8),
      y: y + (Math.random() * 16 - 8),
      size: Math.random() * 10 + 6,
    }));

    setSparkles((prev) => [...prev.slice(-10), ...burst]);
  };

  return (
    <div
      ref={bouquetRef}
      id="flower-bouquet-container"
      className="w-full flex flex-col items-center justify-center pt-8 pb-4 relative select-none"
    >
      {/* Soft background aura for the bouquet */}
      <div
        className={`absolute w-72 h-72 rounded-full pointer-events-none transition-all duration-1000 ${
          phase === 'bloomed' ? 'opacity-70 scale-105' : 'opacity-25 scale-90'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(251, 113, 133, 0.18) 0%, rgba(192, 132, 252, 0.12) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Floating interactive sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none animate-ping text-pink-300/80"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
          }}
        >
          ✦
        </div>
      ))}

      {/* The Hand-Drawn Animated Flower Bouquet SVG */}
      <div
        onClick={handleBouquetClick}
        className="relative cursor-pointer group transform hover:scale-[1.02] transition-transform duration-300"
        title="Click to scatter petals & sparkles"
      >
        <svg
          viewBox="0 0 400 480"
          className="w-[280px] sm:w-[330px] md:w-[370px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for Blooming Fills */}
            <linearGradient id="kraftWrap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c28e5d" />
              <stop offset="100%" stopColor="#8d5b30" />
            </linearGradient>

            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            <radialGradient id="roseGradCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="70%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>

            <radialGradient id="roseGradLeft" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="75%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>

            <radialGradient id="roseGradRight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="75%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </radialGradient>

            <radialGradient id="flowerWhite" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="80%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#facc15" />
            </radialGradient>

            <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#86efac" />
            </linearGradient>

            <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
          </defs>

          {/* ========================================================
              LAYER 1: STEMS & BOUQUET BASE (Draws first: 0s - 1.2s)
             ======================================================== */}
          <g id="stems-and-ties">
            {/* Stems extending below the paper wrap */}
            <path
              d="M185 390 L180 435"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              className="path-draw stem-line"
              style={{ animationDelay: '0.1s' }}
            />
            <path
              d="M195 390 L195 442"
              stroke="#15803d"
              strokeWidth="4"
              strokeLinecap="round"
              className="path-draw stem-line"
              style={{ animationDelay: '0.2s' }}
            />
            <path
              d="M205 390 L212 436"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              className="path-draw stem-line"
              style={{ animationDelay: '0.3s' }}
            />
            <path
              d="M175 390 L168 428"
              stroke="#166534"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="path-draw stem-line"
              style={{ animationDelay: '0.15s' }}
            />
            <path
              d="M218 390 L226 430"
              stroke="#15803d"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="path-draw stem-line"
              style={{ animationDelay: '0.25s' }}
            />

            {/* Bouquet Wrapping Paper Body */}
            <path
              d="M135 270 L180 395 C190 400 205 400 215 395 L265 270 C240 280 160 280 135 270 Z"
              fill={phase === 'bloomed' ? 'url(#kraftWrap)' : 'none'}
              stroke="#f6d8ae"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className={`path-draw transition-all duration-1000 ${
                phase === 'bloomed' ? 'opacity-90' : 'opacity-60'
              }`}
              style={{ animationDelay: '0.4s' }}
            />

            {/* Fold detail on wrapping paper */}
            <path
              d="M145 285 Q195 330 255 285"
              stroke="#ebd5b3"
              strokeWidth="1.8"
              strokeDasharray="4 3"
              className="path-draw"
              style={{ animationDelay: '0.7s' }}
            />

            {/* Tied Ribbon Bow */}
            <path
              d="M165 375 C180 365 185 365 195 372 C205 365 210 365 225 375 C215 385 195 385 195 375 C195 385 175 385 165 375 Z"
              fill={phase === 'bloomed' ? 'url(#ribbonGrad)' : 'none'}
              stroke="#fb7185"
              strokeWidth="2"
              className="path-draw"
              style={{ animationDelay: '0.9s' }}
            />
            {/* Ribbon Tails */}
            <path
              d="M190 380 Q175 405 170 422"
              stroke="#fb7185"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '1.0s' }}
            />
            <path
              d="M200 380 Q215 405 222 420"
              stroke="#fb7185"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '1.1s' }}
            />
          </g>

          {/* ========================================================
              LAYER 2: FOLIAGE & LEAVES (Draws: 1.0s - 2.2s)
             ======================================================== */}
          <g id="foliage-layer">
            {/* Left eucalyptus branch */}
            <path
              d="M160 260 Q105 230 75 190"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '1.0s' }}
            />
            <ellipse
              cx="95"
              cy="215"
              rx="12"
              ry="8"
              transform="rotate(-30 95 215)"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.8"
              className="path-draw"
              style={{ animationDelay: '1.2s' }}
            />
            <ellipse
              cx="78"
              cy="192"
              rx="11"
              ry="7"
              transform="rotate(-40 78 192)"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.8"
              className="path-draw"
              style={{ animationDelay: '1.3s' }}
            />

            {/* Right eucalyptus branch */}
            <path
              d="M235 260 Q290 225 325 185"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '1.1s' }}
            />
            <ellipse
              cx="300"
              cy="210"
              rx="12"
              ry="8"
              transform="rotate(30 300 210)"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.8"
              className="path-draw"
              style={{ animationDelay: '1.3s' }}
            />
            <ellipse
              cx="322"
              cy="188"
              rx="11"
              ry="7"
              transform="rotate(40 322 188)"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.8"
              className="path-draw"
              style={{ animationDelay: '1.4s' }}
            />

            {/* Top delicate leaves */}
            <path
              d="M140 180 Q120 120 135 80 Q155 120 140 180 Z"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.5"
              className="path-draw"
              style={{ animationDelay: '1.4s' }}
            />
            <path
              d="M255 180 Q275 120 260 80 Q240 120 255 180 Z"
              fill={phase === 'bloomed' ? 'url(#leafGrad)' : 'none'}
              stroke="#86efac"
              strokeWidth="1.5"
              className="path-draw"
              style={{ animationDelay: '1.5s' }}
            />

            {/* Baby's breath sprigs (little white dots) */}
            <g
              className={`transition-opacity duration-1000 ${
                phase === 'bloomed' ? 'opacity-90' : 'opacity-40'
              }`}
            >
              <circle cx="100" cy="150" r="3.5" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="115" cy="138" r="3" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="90" cy="135" r="4" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="295" cy="145" r="3.5" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="310" cy="135" r="3" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="285" cy="130" r="4" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="195" cy="70" r="3.5" fill="#f8fafc" stroke="#e2e8f0" />
              <circle cx="205" cy="62" r="3" fill="#f8fafc" stroke="#e2e8f0" />
            </g>
          </g>

          {/* ========================================================
              LAYER 3: THE FLOWERS (Draws: 1.8s - 3.2s)
             ======================================================== */}

          {/* 1. TOP CENTER DAISY / BLOSSOM */}
          <g id="top-blossom">
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <ellipse
                key={idx}
                cx="198"
                cy="110"
                rx="8"
                ry="18"
                transform={`rotate(${angle} 198 110)`}
                fill={phase === 'bloomed' ? '#fff1f2' : 'none'}
                stroke="#fda4af"
                strokeWidth="1.5"
                className="path-draw"
                style={{ animationDelay: `${1.8 + idx * 0.08}s` }}
              />
            ))}
            {/* Center pistil */}
            <circle
              cx="198"
              cy="110"
              r="9"
              fill={phase === 'bloomed' ? 'url(#flowerWhite)' : 'none'}
              stroke="#eab308"
              strokeWidth="2"
              className="path-draw"
              style={{ animationDelay: '2.4s' }}
            />
          </g>

          {/* 2. LEFT WARM PEACH / CORAL ROSE */}
          <g id="left-peach-rose">
            <path
              d="M110 220 C100 190 120 170 145 175 C165 180 170 200 165 225 C155 245 125 245 110 220 Z"
              fill={phase === 'bloomed' ? 'url(#roseGradLeft)' : 'none'}
              stroke="#fb923c"
              strokeWidth="2"
              className="path-draw"
              style={{ animationDelay: '2.0s' }}
            />
            {/* Inner spiral petals */}
            <path
              d="M125 210 Q140 195 152 208 Q145 225 130 220"
              stroke="#fed7aa"
              strokeWidth="2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.3s' }}
            />
            <path
              d="M135 200 Q145 190 148 202"
              stroke="#fff7ed"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.5s' }}
            />
          </g>

          {/* 3. RIGHT SOFT LAVENDER ROSE */}
          <g id="right-lavender-rose">
            <path
              d="M235 220 C225 195 245 175 270 180 C290 185 295 205 288 230 C275 250 248 245 235 220 Z"
              fill={phase === 'bloomed' ? 'url(#roseGradRight)' : 'none'}
              stroke="#c084fc"
              strokeWidth="2"
              className="path-draw"
              style={{ animationDelay: '2.1s' }}
            />
            {/* Inner petals */}
            <path
              d="M250 210 Q265 195 278 210 Q270 228 255 222"
              stroke="#e9d5ff"
              strokeWidth="2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.4s' }}
            />
            <path
              d="M260 200 Q270 192 274 204"
              stroke="#faf5ff"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.6s' }}
            />
          </g>

          {/* 4. MAIN GLORIOUS CENTER ROSE (THE SHOWPIECE) */}
          <g id="center-main-rose">
            {/* Outer large petals */}
            <path
              d="M160 215 C150 170 180 150 200 150 C220 150 248 170 238 215 C230 250 170 250 160 215 Z"
              fill={phase === 'bloomed' ? 'url(#roseGradCenter)' : 'none'}
              stroke="#f43f5e"
              strokeWidth="2.5"
              className="path-draw"
              style={{ animationDelay: '2.2s' }}
            />
            {/* Mid layered petals */}
            <path
              d="M172 205 C168 180 190 168 200 168 C212 168 230 180 226 205 C222 225 178 225 172 205 Z"
              fill={phase === 'bloomed' ? 'rgba(251, 113, 133, 0.4)' : 'none'}
              stroke="#fda4af"
              strokeWidth="2"
              className="path-draw"
              style={{ animationDelay: '2.5s' }}
            />
            {/* Inner tightly curled rose heart */}
            <path
              d="M185 198 Q200 185 212 198 Q202 212 188 205"
              stroke="#ffe4e6"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.7s' }}
            />
            <path
              d="M192 192 Q200 186 206 193"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              className="path-draw"
              style={{ animationDelay: '2.9s' }}
            />
          </g>

          {/* 5. GENTLE ACCENT BUDS & TULIPS */}
          <g id="accent-buds">
            {/* Small yellow tulip bud top right */}
            <path
              d="M235 130 C228 115 240 102 248 102 C256 102 268 115 260 130 Z"
              fill={phase === 'bloomed' ? '#fef08a' : 'none'}
              stroke="#eab308"
              strokeWidth="1.5"
              className="path-draw"
              style={{ animationDelay: '2.6s' }}
            />
            {/* Small pink tulip bud top left */}
            <path
              d="M140 130 C132 115 144 102 152 102 C160 102 172 115 165 130 Z"
              fill={phase === 'bloomed' ? '#fbcfe8' : 'none'}
              stroke="#ec4899"
              strokeWidth="1.5"
              className="path-draw"
              style={{ animationDelay: '2.7s' }}
            />
          </g>
        </svg>

        {/* Floating animated drawing pencil / stylus spark indicator while drawing */}
        {phase === 'drawing' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-xs text-rose-300 font-mono animate-pulse bg-slate-950/80 px-2.5 py-1 rounded-full border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>drawing bouquet...</span>
          </div>
        )}
      </div>

      {/* ========================================================
          THE REQUESTED TEXT UNDERNEATH:
          "here’s a little gift"
         ======================================================== */}
      <div
        id="bouquet-caption"
        className={`mt-4 text-center transition-all duration-1000 ${
          textVisible
            ? 'opacity-100 translate-y-0 filter-none'
            : 'opacity-0 translate-y-6 blur-md'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-rose-400 text-sm animate-bounce">✦</span>
          <p className="font-['Caveat',cursive] text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-indigo-200 drop-shadow-[0_2px_12px_rgba(244,63,94,0.45)]">
            here’s a little gift
          </p>
          <span className="text-rose-400 text-sm animate-bounce delay-150">✦</span>
        </div>

        {/* Action button to re-watch or replay */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors duration-200"
            title="Redraw the bouquet"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Draw bouquet again</span>
          </button>
          {onReplay && (
            <button
              onClick={onReplay}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors duration-200"
              title="Re-read the letter from the beginning"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Read from start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
