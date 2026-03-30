import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface CalculusContextType {
  x0: number;
  setX0: (val: number) => void;
  f: (x: number) => number;
  df: (x: number) => number;
  tangentLine: { m: number; b: number };
}

const CalculusContext = createContext<CalculusContextType | null>(null);

export const Calculus = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [x0, setX0] = useState(0);

    const f = (x: number) => Math.sin(x);
    const df = (x: number) => Math.cos(x);

    const tangentLine = useMemo(() => {
      const m = df(x0);
      const b = f(x0) - m * x0;
      return { m, b };
    }, [x0]);

    return (
      <CalculusContext.Provider value={{ x0, setX0, f, df, tangentLine }}>
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
    const { x0, setX0 } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Point Position (x₀)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{x0.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="-6.28" max="6.28" step="0.01" value={x0} 
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
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

    const size = 400;
    const scale = 40; // 40 pixels per unit
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
      const xStart = x0 - 2;
      const xEnd = x0 + 2;
      const yStart = tangentLine.m * xStart + tangentLine.b;
      const yEnd = tangentLine.m * xEnd + tangentLine.b;
      return {
        x1: center + xStart * scale,
        y1: center - yStart * scale,
        x2: center + xEnd * scale,
        y2: center - yEnd * scale
      };
    }, [x0, tangentLine, center, scale]);

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Grid */}
          <g stroke="#e2e8f0" strokeWidth="0.5">
            {Array.from({ length: 21 }).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i * scale} y1="0" x2={i * scale} y2={size} />
                <line x1="0" y1={i * scale} x2={size} y2={i * scale} />
              </React.Fragment>
            ))}
          </g>

          {/* Axes */}
          <line x1="0" y1={center} x2={size} y2={center} stroke="#94a3b8" strokeWidth="2" />
          <line x1={center} y1="0" x2={center} y2={size} stroke="#94a3b8" strokeWidth="2" />

          {/* Function Curve */}
          <polyline
            points={points}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="4 4"
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
          />

          {/* Point of Tangency */}
          <motion.circle
            cx={center + x0 * scale}
            cy={center - f(x0) * scale}
            r="6"
            fill={colorTheme}
            initial={false}
            animate={{ cx: center + x0 * scale, cy: center - f(x0) * scale }}
          />
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(CalculusContext);
    if (!context) return null;
    const { x0, f, df } = context;

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
            {df(x0).toFixed(4)}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
          {df(x0) > 0 ? 'Slope is positive (Increasing).' : df(x0) < 0 ? 'Slope is negative (Decreasing).' : 'Slope is zero (Critical Point).'}
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
