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
}

const QuadraticContext = createContext<QuadraticContextType | null>(null);

export const Quadratic = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);

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
      <QuadraticContext.Provider value={{ a, b, c, setA, setB, setC, vertex, roots, discriminant }}>
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
    const { a, b, c, setA, setB, setC } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient a (Width/Flip)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{a.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-5" max="5" step="0.1" value={a} 
            onChange={(e) => setA(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient b (Horizontal Shift)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{b.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-10" max="10" step="0.1" value={b} 
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Coefficient c (Vertical Shift)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{c.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-10" max="10" step="0.1" value={c} 
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
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

    const size = 400;
    const scale = 20; // 20 pixels per unit
    const center = size / 2;

    const points = useMemo(() => {
      const p = [];
      for (let x = -10; x <= 10; x += 0.1) {
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
            className="text-[10px] font-mono font-bold fill-slate-400"
          >
            Vertex ({vertex.x.toFixed(1)}, {vertex.y.toFixed(1)})
          </text>

          {/* Roots */}
          {roots?.map((root, i) => (
            <motion.circle
              key={i}
              cx={center + root * scale}
              cy={center}
              r="4"
              fill="#ef4444"
              initial={false}
              animate={{ cx: center + root * scale }}
            />
          ))}
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(QuadraticContext);
    if (!context) return null;
    const { a, b, c, discriminant } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Equation</span>
          <span className="text-sm font-serif italic text-slate-900">
            y = {a.toFixed(1)}x² + {b.toFixed(1)}x + {c.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Discriminant (D)</span>
          <span className={`text-xs font-mono font-bold ${discriminant >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {discriminant.toFixed(2)}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
          {discriminant > 0 ? 'Two real roots exist.' : discriminant === 0 ? 'One real root exists.' : 'No real roots (complex).'}
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
