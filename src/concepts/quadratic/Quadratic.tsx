import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface QuadraticContextType {
  a: number;
  b: number;
  c: number;
  setA: (val: number) => void;
  setB: (val: number) => void;
  setC: (val: number) => void;
  vertex: { x: number; y: number };
  roots: number[] | null;
  discriminant: number;
  isAnimating: boolean;
  setIsAnimating: (val: boolean) => void;
}

const QuadraticContext = createContext<QuadraticContextType | null>(null);

export const Quadratic = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [a, setA] = useState(0.5);
    const [b, setB] = useState(0);
    const [c, setC] = useState(-2);
    const [isAnimating, setIsAnimating] = useState(false);

    const vertex = useMemo(() => {
      const x = -b / (2 * a || 1);
      const y = a * x * x + b * x + c;
      return { x, y };
    }, [a, b, c]);

    const discriminant = useMemo(() => b * b - 4 * a * c, [a, b, c]);

    const roots = useMemo(() => {
      if (discriminant < 0) return null;
      if (discriminant === 0) return [-b / (2 * a)];
      const sqrtD = Math.sqrt(discriminant);
      return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
    }, [a, b, c, discriminant]);

    return (
      <QuadraticContext.Provider value={{ a, b, c, setA, setB, setC, vertex, roots, discriminant, isAnimating, setIsAnimating }}>
        {children}
      </QuadraticContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Quadratic Equations</h2>
      <p className="text-slate-500 font-light text-sm">Exploring the parabola: $y = ax^2 + bx + c$</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(QuadraticContext);
    if (!context) return null;
    const { a, b, c, setA, setB, setC, isAnimating, setIsAnimating } = context;

    React.useEffect(() => {
      let interval: any;
      if (isAnimating) {
        let time = 0;
        interval = setInterval(() => {
          time += 0.02;
          setA(Math.sin(time) * 1.5);
          setB(Math.cos(time * 0.7) * 5);
          setC(Math.sin(time * 0.5) * 10);
        }, 16);
      }
      return () => clearInterval(interval);
    }, [isAnimating, setA, setB, setC]);

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex-1 py-3 bg-math-accent text-white rounded-xl font-mono text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {isAnimating ? (
              <>
                <div className="w-2 h-2 bg-white rounded-sm" />
                Pause
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                Play
              </>
            )}
          </button>
          <button 
            onClick={() => {
              setIsAnimating(false);
              setA(0.5);
              setB(0);
              setC(-2);
            }}
            className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient a (Curvature)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{a.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="-3" max="3" step="0.05" value={a} 
            onChange={(e) => {
              setIsAnimating(false);
              const val = parseFloat(e.target.value);
              setA(val === 0 ? 0.01 : val); 
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-mono text-slate-300">
            <span>CONCAVE DOWN</span>
            <span>CONCAVE UP</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient b (Linear)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{b.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-10" max="10" step="0.1" value={b} 
            onChange={(e) => {
              setIsAnimating(false);
              setB(parseFloat(e.target.value));
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient c (Constant)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{c.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-15" max="15" step="0.1" value={c} 
            onChange={(e) => {
              setIsAnimating(false);
              setC(parseFloat(e.target.value));
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(QuadraticContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { a, b, c, vertex, roots } = context;

    const size = 500;
    const scale = 20; // 20 pixels per unit
    const center = size / 2;

    const points = useMemo(() => {
      const p = [];
      // Calculate points for a wider range to ensure it covers the SVG
      for (let x = -20; x <= 20; x += 0.1) {
        const y = a * x * x + b * x + c;
        p.push(`${center + x * scale},${center - y * scale}`);
      }
      return p.join(' ');
    }, [a, b, c, center, scale]);

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Grid */}
          <g stroke="#e2e8f0" strokeWidth="0.5">
            {Array.from({ length: 25 }).map((_, i) => {
              const pos = (i - 12) * scale + center;
              return (
                <React.Fragment key={i}>
                  <line x1={pos} y1="0" x2={pos} y2={size} />
                  <line x1="0" y1={pos} x2={size} y2={pos} />
                </React.Fragment>
              );
            })}
          </g>

          {/* Axes */}
          <line x1="0" y1={center} x2={size} y2={center} stroke="#94a3b8" strokeWidth="2" />
          <line x1={center} y1="0" x2={center} y2={size} stroke="#94a3b8" strokeWidth="2" />

          {/* Axis Labels */}
          <text x={size - 10} y={center - 10} className="text-[12px] font-mono fill-slate-400">X</text>
          <text x={center + 10} y={20} className="text-[12px] font-mono fill-slate-400">Y</text>

          {/* Ticks */}
          {[-10, -5, 5, 10].map(val => (
            <React.Fragment key={val}>
              <line x1={center + val * scale} y1={center - 5} x2={center + val * scale} y2={center + 5} stroke="#94a3b8" strokeWidth="2" />
              <text x={center + val * scale} y={center + 20} textAnchor="middle" className="text-[10px] font-mono fill-slate-400">{val}</text>
              
              <line x1={center - 5} y1={center - val * scale} x2={center + 5} y2={center - val * scale} stroke="#94a3b8" strokeWidth="2" />
              <text x={center - 20} y={center - val * scale} dominantBaseline="middle" textAnchor="end" className="text-[10px] font-mono fill-slate-400">{val}</text>
            </React.Fragment>
          ))}

          {/* Parabola */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={colorTheme}
            strokeWidth="3"
            strokeLinejoin="round"
            initial={false}
            animate={{ stroke: colorTheme }}
          />

          {/* Vertex */}
          <motion.circle
            cx={center + vertex.x * scale}
            cy={center - vertex.y * scale}
            r="6"
            fill={colorTheme}
            initial={false}
            animate={{ cx: center + vertex.x * scale, cy: center - vertex.y * scale }}
          />
          <text 
            x={center + vertex.x * scale + 10} 
            y={center - vertex.y * scale - 10} 
            className="text-[10px] font-mono font-bold fill-slate-900 bg-white/50"
          >
            V({vertex.x.toFixed(1)}, {vertex.y.toFixed(1)})
          </text>

          {/* Roots */}
          {roots?.map((root, i) => (
            <motion.g key={i} initial={false} animate={{ transform: `translateX(${center + root * scale}px) translateY(${center}px)` }}>
              <circle r="4" fill="#ef4444" />
              <text y="15" textAnchor="middle" className="text-[8px] font-mono font-bold fill-red-500">
                x={root.toFixed(2)}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(QuadraticContext);
    if (!context) return null;
    const { a, b, c, discriminant, vertex, roots } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Current Equation</span>
          <div className="text-lg font-serif italic text-slate-900 bg-white p-3 rounded-lg border border-slate-100 text-center">
            y = {a.toFixed(2)}x² {b >= 0 ? '+' : ''} {b.toFixed(2)}x {c >= 0 ? '+' : ''} {c.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-slate-100">
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Discriminant</span>
            <span className={`text-xs font-mono font-bold ${discriminant >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              D = {discriminant.toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-100">
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Vertex</span>
            <span className="text-xs font-mono font-bold text-slate-900">
              ({vertex.x.toFixed(2)}, {vertex.y.toFixed(2)})
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Roots Analysis</span>
          <div className="text-[10px] font-mono text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
            {discriminant > 0 ? (
              <div className="space-y-1">
                <p className="text-green-600 font-bold">Two real roots:</p>
                <p>x₁ = {roots?.[0].toFixed(3)}</p>
                <p>x₂ = {roots?.[1].toFixed(3)}</p>
              </div>
            ) : discriminant === 0 ? (
              <div className="space-y-1">
                <p className="text-blue-600 font-bold">One real root:</p>
                <p>x = {roots?.[0].toFixed(3)}</p>
              </div>
            ) : (
              <p className="text-red-500 font-bold italic">No real roots (Complex solutions)</p>
            )}
          </div>
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(QuadraticContext);
    if (!context) return null;
    const { vertex } = context;

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Vertex Precision</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">X-COORD</div>
            <div className="text-xs font-mono font-bold text-slate-900">{vertex.x.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">Y-COORD</div>
            <div className="text-xs font-mono font-bold text-slate-900">{vertex.y.toFixed(4)}</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">Quadratic Equations</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        A quadratic equation is a second-degree polynomial equation in a single variable x, with a non-zero coefficient for x².
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">Standard Form</h3>
        <div className="text-4xl font-serif italic text-math-accent text-center py-4">
          ax² + bx + c = 0
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">The Parabola</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        The graph of a quadratic function is a curve called a parabola. Its shape and position are determined by the coefficients:
      </p>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Coefficient 'a':</strong> Determines the width and direction. If a &gt; 0, it opens upward; if a &lt; 0, it opens downward.</li>
        <li><strong>Coefficient 'b':</strong> Affects the horizontal position of the vertex.</li>
        <li><strong>Coefficient 'c':</strong> The y-intercept of the graph.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">The Quadratic Formula</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        The solutions (roots) of the equation can be found using:
      </p>
      <div className="bg-slate-900 text-white p-6 rounded-xl font-serif italic text-center text-2xl mb-8">
        x = (-b ± √(b² - 4ac)) / 2a
      </div>

      <h3 className="text-xl font-bold mb-4">The Discriminant (D)</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        The term <strong>b² - 4ac</strong> is called the discriminant. It tells us the nature of the roots:
      </p>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>D &gt; 0:</strong> Two distinct real roots.</li>
        <li><strong>D = 0:</strong> One real root (vertex is on the x-axis).</li>
        <li><strong>D &lt; 0:</strong> No real roots (complex roots).</li>
      </ul>
    </div>
  )
};