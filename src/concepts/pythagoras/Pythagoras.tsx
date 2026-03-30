import React, { useState, useMemo, createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { Info, Calculator, Ruler } from 'lucide-react';

// --- Pythagoras Context ---

interface PythagorasContextType {
  a: number;
  b: number;
  c: number;
  angle: number;
  scale: number;
  setA: (val: number) => void;
  setB: (val: number) => void;
}

const PythagorasContext = createContext<PythagorasContextType | null>(null);

const usePythagoras = () => {
  const context = useContext(PythagorasContext);
  if (!context) throw new Error("Pythagoras components must be used within Pythagoras.Provider");
  return context;
};

const fastTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.5
};

// --- Pythagoras Components ---

export const Pythagoras = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [a, setA] = useState(15);
    const [b, setB] = useState(15);
    const scale = 12;

    const c = useMemo(() => Math.sqrt(a * a + b * b), [a, b]);
    const angle = useMemo(() => Math.atan2(b, a) * (180 / Math.PI), [a, b]);

    return (
      <PythagorasContext.Provider value={{ a, b, c, angle, scale, setA, setB }}>
        {children}
      </PythagorasContext.Provider>
    );
  },

  Header: () => (
    <header>
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-math-accent" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Scientific Instrument</span>
      </div>
      <h1 className="text-4xl font-light tracking-tighter italic font-serif text-slate-900">
        a² + b² = c²
      </h1>
    </header>
  ),

  Controls: () => {
    const { a, b, setA, setB } = usePythagoras();
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="font-mono text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="text-math-accent font-bold italic text-lg">a</span> side length
            </label>
            <span className="font-mono text-xl text-slate-900 font-medium">{a.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="5" max="30" step="1" value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="font-mono text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="text-math-accent font-bold italic text-lg">b</span> side length
            </label>
            <span className="font-mono text-xl text-slate-900 font-medium">{b.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="5" max="30" step="1" value={b} 
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    );
  },

  MathBreakdown: () => {
    const { a, b, c } = usePythagoras();
    return (
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Calculation Breakdown</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">c = √(a² + b²)</span>
            <span className="text-math-accent font-bold">≈ {c.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="text-[11px] text-slate-400 leading-relaxed">
            {a.toFixed(2)}² + {b.toFixed(2)}² = {(a*a).toFixed(2)} + {(b*b).toFixed(2)} = {(a*a + b*b).toFixed(2)}
          </div>
        </div>
      </div>
    );
  },

  Diagram: () => {
    const { a, b, c, angle, scale } = usePythagoras();
    const centerX = 300;
    const centerY = 350;

    return (
      <svg viewBox="0 0 800 800" className="w-full h-full max-w-[800px] drop-shadow-[0_0_50px_rgba(0,0,0,0.05)]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Square on side A */}
          <motion.rect
            animate={{ width: a * scale, height: a * scale, x: 0, y: 0 }}
            transition={fastTransition}
            fill="color-mix(in srgb, var(--math-accent) 5%, transparent)"
            stroke="color-mix(in srgb, var(--math-accent) 20%, transparent)"
            strokeWidth="1" strokeDasharray="4 4"
          />
          <motion.text
            animate={{ x: (a * scale) / 2, y: (a * scale) / 2 }}
            transition={fastTransition}
            textAnchor="middle" dominantBaseline="middle"
            className="fill-math-accent/20 font-mono text-xs uppercase tracking-widest"
          >
            a²
          </motion.text>

          {/* Square on side B */}
          <motion.rect
            animate={{ width: b * scale, height: b * scale, x: -b * scale, y: -b * scale }}
            transition={fastTransition}
            fill="color-mix(in srgb, var(--math-accent) 5%, transparent)"
            stroke="color-mix(in srgb, var(--math-accent) 20%, transparent)"
            strokeWidth="1" strokeDasharray="4 4"
          />
          <motion.text
            animate={{ x: -(b * scale) / 2, y: -(b * scale) / 2 }}
            transition={fastTransition}
            textAnchor="middle" dominantBaseline="middle"
            className="fill-math-accent/20 font-mono text-xs uppercase tracking-widest"
          >
            b²
          </motion.text>

          {/* Square on side C (Hypotenuse) */}
          <motion.g
            animate={{ x: 0, y: -b * scale, rotate: angle }}
            transition={fastTransition}
            style={{ originX: 0, originY: 1 }}
          >
            <motion.rect
              animate={{ width: c * scale, height: c * scale, x: 0, y: -c * scale }}
              transition={fastTransition}
              fill="color-mix(in srgb, var(--math-accent) 8%, transparent)"
              stroke="color-mix(in srgb, var(--math-accent) 30%, transparent)"
              strokeWidth="1" strokeDasharray="4 4"
            />
            <motion.text
              animate={{ x: (c * scale) / 2, y: -(c * scale) / 2 }}
              transition={fastTransition}
              textAnchor="middle" dominantBaseline="middle"
              className="fill-math-accent/30 font-mono text-xs uppercase tracking-widest"
              style={{ rotate: -angle }}
            >
              c²
            </motion.text>
          </motion.g>

          {/* The Triangle */}
          <motion.path
            animate={{ d: `M 0 0 L ${a * scale} 0 L 0 ${-b * scale} Z` }}
            transition={fastTransition}
            fill="color-mix(in srgb, var(--math-accent) 10%, transparent)"
            stroke="var(--math-accent)"
            strokeWidth="3" strokeLinejoin="round"
          />

          {/* Labels */}
          <motion.text
            animate={{ x: (a * scale) / 2, y: 25 }} transition={fastTransition}
            textAnchor="middle" className="fill-math-accent font-mono text-sm font-bold italic"
          >
            a
          </motion.text>
          <motion.text
            animate={{ x: -20, y: (-b * scale) / 2 }} transition={fastTransition}
            textAnchor="middle" className="fill-math-accent font-mono text-sm font-bold italic"
          >
            b
          </motion.text>
          <motion.text
            animate={{ x: (a * scale) / 2 + 15, y: (-b * scale) / 2 - 15 }} transition={fastTransition}
            textAnchor="middle" className="fill-math-accent font-mono text-sm font-bold italic"
          >
            c
          </motion.text>

          <rect x="0" y="-10" width="10" height="10" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </g>
      </svg>
    );
  },

  PrecisionMonitor: () => {
    const { c } = usePythagoras();
    return (
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
        <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
          <Ruler className="w-4 h-4 text-math-accent" />
          <span className="font-mono text-[11px] tracking-widest text-slate-500">HYPOTENUSE PRECISION</span>
          <span className="font-mono text-sm text-slate-900 font-bold">{c.toFixed(4)}</span>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">The Pythagorean Theorem</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The Pythagorean theorem, also known as Pythagoras' theorem, is a fundamental relation in Euclidean geometry among the three sides of a right triangle.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The Formula</h3>
        <div className="text-4xl font-serif italic text-math-accent text-center py-4">
          a² + b² = c²
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Key Concepts</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Right Triangle:</strong> A triangle with one angle exactly equal to 90 degrees.</li>
        <li><strong>Legs (a, b):</strong> The two sides that form the right angle.</li>
        <li><strong>Hypotenuse (c):</strong> The longest side, opposite the right angle.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Historical Context</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        While named after the Greek philosopher Pythagoras (c. 570 – c. 495 BC), the relationship was known to Babylonian mathematicians 1,000 years earlier. It is one of the most proven theorems in all of mathematics, with hundreds of distinct proofs existing today.
      </p>

      <h3 className="text-xl font-bold mb-4">Real-World Applications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm mb-2">Navigation</h4>
          <p className="text-xs text-slate-500">Calculating the shortest distance between two points on a map.</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm mb-2">Architecture</h4>
          <p className="text-xs text-slate-500">Ensuring buildings are square and structurally sound.</p>
        </div>
      </div>
    </div>
  )
};
