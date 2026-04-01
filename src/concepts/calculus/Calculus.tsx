import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface CalculusContextType {
  x0: number;
  setX0: (val: number) => void;
  f: (x: number) => number;
  df: (x: number) => number;
  tangentLine: { m: number; b: number };
  isAnimating: boolean;
  setIsAnimating: (val: boolean) => void;
}

const CalculusContext = createContext<CalculusContextType | null>(null);

export const Calculus = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [x0, setX0] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const f = (x: number) => Math.sin(x);
    const df = (x: number) => Math.cos(x);

    const tangentLine = useMemo(() => {
      const m = df(x0);
      const b = f(x0) - m * x0;
      return { m, b };
    }, [x0]);

    return (
      <CalculusContext.Provider value={{ x0, setX0, f, df, tangentLine, isAnimating, setIsAnimating }}>
        {children}
      </CalculusContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Calculus: The Derivative</h2>
      <p className="text-slate-500 font-light text-sm">Visualizing the slope of a tangent line: $f'(x)$</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(CalculusContext);
    if (!context) return null;
    const { x0, setX0, isAnimating, setIsAnimating } = context;

    React.useEffect(() => {
      let interval: any;
      if (isAnimating) {
        interval = setInterval(() => {
          setX0((prev) => {
            let next = prev + 0.02;
            if (next > 6.28) next = -6.28;
            return next;
          });
        }, 16);
      }
      return () => clearInterval(interval);
    }, [isAnimating, setX0]);

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
              setX0(0);
            }}
            className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Point Position (x₀)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{x0.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="-6.28" max="6.28" step="0.01" value={x0} 
            onChange={(e) => {
              setIsAnimating(false);
              setX0(parseFloat(e.target.value));
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(CalculusContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { x0, f, df, tangentLine } = context;

    const size = 500;
    const scale = 50; // 50 pixels per unit
    const center = size / 2;

    const points = useMemo(() => {
      const p = [];
      for (let x = -10; x <= 10; x += 0.1) {
        const y = f(x);
        p.push(`${center + x * scale},${center - y * scale}`);
      }
      return p.join(' ');
    }, [center, scale]);

    const tangentPoints = useMemo(() => {
      const xStart = x0 - 2.5;
      const xEnd = x0 + 2.5;
      const yStart = tangentLine.m * xStart + tangentLine.b;
      const yEnd = tangentLine.m * xEnd + tangentLine.b;
      return {
        x1: center + xStart * scale,
        y1: center - yStart * scale,
        x2: center + xEnd * scale,
        y2: center - yEnd * scale
      };
    }, [x0, tangentLine, center, scale]);

    const springConfig = { type: "spring", stiffness: 300, damping: 30 };

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Grid */}
          <g stroke="#e2e8f0" strokeWidth="0.5">
            {Array.from({ length: 21 }).map((_, i) => {
              const pos = (i - 10) * scale + center;
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
          {[-6, -4, -2, 2, 4, 6].map(val => (
            <React.Fragment key={val}>
              <line x1={center + val * scale} y1={center - 5} x2={center + val * scale} y2={center + 5} stroke="#94a3b8" strokeWidth="2" />
              <text x={center + val * scale} y={center + 20} textAnchor="middle" className="text-[10px] font-mono fill-slate-400">{val}</text>
              
              <line x1={center - 5} y1={center - val * scale} x2={center + 5} y2={center - val * scale} stroke="#94a3b8" strokeWidth="2" />
              <text x={center - 20} y={center - val * scale} dominantBaseline="middle" textAnchor="end" className="text-[10px] font-mono fill-slate-400">{val}</text>
            </React.Fragment>
          ))}

          {/* Function Curve */}
          <polyline
            points={points}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Projection Line to X-axis */}
          <motion.line
            x1={center + x0 * scale}
            y1={center}
            x2={center + x0 * scale}
            y2={center - f(x0) * scale}
            stroke="#94a3b8"
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={false}
            animate={{ x1: center + x0 * scale, x2: center + x0 * scale, y2: center - f(x0) * scale }}
            transition={springConfig}
          />

          {/* Tangent Line */}
          <motion.line
            x1={tangentPoints.x1}
            y1={tangentPoints.y1}
            x2={tangentPoints.x2}
            y2={tangentPoints.y2}
            stroke={colorTheme}
            strokeWidth="3"
            initial={false}
            animate={{ x1: tangentPoints.x1, y1: tangentPoints.y1, x2: tangentPoints.x2, y2: tangentPoints.y2 }}
            transition={springConfig}
          />

          {/* Point of Tangency */}
          <motion.circle
            cx={center + x0 * scale}
            cy={center - f(x0) * scale}
            r="6"
            fill={colorTheme}
            initial={false}
            animate={{ cx: center + x0 * scale, cy: center - f(x0) * scale }}
            transition={springConfig}
          />

          {/* Point Label */}
          <motion.g
            initial={false}
            animate={{ x: center + x0 * scale + 10, y: center - f(x0) * scale - 10 }}
            transition={springConfig}
          >
            <rect width="80" height="20" rx="4" fill="white" fillOpacity="0.8" stroke="#e2e8f0" strokeWidth="0.5" />
            <text x="5" y="14" className="text-[10px] font-mono font-bold fill-slate-900">
              P({x0.toFixed(1)}, {f(x0).toFixed(1)})
            </text>
          </motion.g>
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(CalculusContext);
    if (!context) return null;
    const { x0, f, df, tangentLine } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Function f(x)</span>
          <span className="text-sm font-serif italic text-slate-900">sin(x)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Derivative f'(x)</span>
          <span className="text-sm font-serif italic text-slate-900">cos(x)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Slope at x₀</span>
          <span className="text-xs font-mono font-bold text-math-accent">
            m = {df(x0).toFixed(4)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tangent Equation</span>
          <span className="text-[10px] font-mono font-bold text-slate-600">
            y = {tangentLine.m.toFixed(2)}x {tangentLine.b >= 0 ? '+' : ''} {tangentLine.b.toFixed(2)}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
          {df(x0) > 0 ? 'The function is currently increasing at this point.' : df(x0) < 0 ? 'The function is currently decreasing at this point.' : 'This is a critical point (local maximum or minimum).'}
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(CalculusContext);
    if (!context) return null;
    const { x0, f, df } = context;

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Calculus Precision</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">POSITION</div>
            <div className="text-xs font-mono font-bold text-slate-900">{x0.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">SLOPE</div>
            <div className="text-xs font-mono font-bold text-slate-900">{df(x0).toFixed(4)}</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">Calculus: The Derivative</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The derivative of a function of a real variable measures the sensitivity to change of the function value with respect to a change in its argument.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The Definition</h3>
        <div className="text-4xl font-serif italic text-math-accent text-center py-4">
          f'(x) = lim<sub>h→0</sub> (f(x+h) - f(x)) / h
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Geometric Interpretation</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        Geometrically, the derivative at a point is the slope of the tangent line to the graph of the function at that point.
      </p>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Tangent Line:</strong> A line that "just touches" the curve at a point.</li>
        <li><strong>Slope:</strong> The rate at which the function is increasing or decreasing.</li>
        <li><strong>Critical Points:</strong> Points where the derivative is zero (horizontal tangent).</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Common Derivatives</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm mb-2">Power Rule</h4>
          <p className="text-xs text-slate-500">d/dx [xⁿ] = nxⁿ⁻¹</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h4 className="font-bold text-sm mb-2">Trig Functions</h4>
          <p className="text-xs text-slate-500">d/dx [sin(x)] = cos(x)</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Applications</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        Derivatives are used in physics to find velocity and acceleration, in economics to find marginal cost and revenue, and in engineering to optimize designs.
      </p>
    </div>
  )
};
