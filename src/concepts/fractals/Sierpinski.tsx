import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface FractalContextType {
  depth: number;
  setDepth: (val: number) => void;
}

const FractalContext = createContext<FractalContextType | null>(null);

export const Sierpinski = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [depth, setDepth] = useState(3);

    return (
      <FractalContext.Provider value={{ depth, setDepth }}>
        {children}
      </FractalContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Sierpinski Triangle</h2>
      <p className="text-slate-500 font-light text-sm">Fractal Recursion & Self-Similarity</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(FractalContext);
    if (!context) return null;
    const { depth, setDepth } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Recursion Depth</label>
            <span className="text-xs font-mono font-bold text-math-accent">{depth}</span>
          </div>
          <input 
            type="range" min="0" max="7" step="1" value={depth} 
            onChange={(e) => setDepth(parseInt(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(FractalContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { depth } = context;

    const size = 400;
    const h = (Math.sqrt(3) / 2) * size;
    const p1 = { x: size / 2, y: 0 };
    const p2 = { x: 0, y: h };
    const p3 = { x: size, y: h };

    const generateTriangles = (p1: any, p2: any, p3: any, d: number): any[] => {
      if (d === 0) {
        return [`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`];
      }
      const m12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const m23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
      const m31 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };

      return [
        ...generateTriangles(p1, m12, m31, d - 1),
        ...generateTriangles(m12, p2, m23, d - 1),
        ...generateTriangles(m31, m23, p3, d - 1),
      ];
    };

    const triangles = useMemo(() => generateTriangles(p1, p2, p3, depth), [depth, p1, p2, p3]);

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${h}`} className="w-full h-full max-w-2xl overflow-visible">
          {triangles.map((points, i) => (
            <motion.polygon
              key={i}
              points={points}
              fill={colorTheme}
              fillOpacity={0.8}
              stroke="white"
              strokeWidth={depth > 5 ? 0.2 : 0.5}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, fill: colorTheme }}
              transition={{ delay: i * 0.001 }}
            />
          ))}
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(FractalContext);
    if (!context) return null;
    const { depth } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Total Triangles</span>
          <span className="text-sm font-serif italic text-slate-900">{Math.pow(3, depth)}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
          At each level of recursion, every triangle is subdivided into three smaller ones. The Sierpinski triangle is a fractal with a Hausdorff dimension of approximately 1.585.
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(FractalContext);
    if (!context) return null;
    const { depth } = context;

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Fractal Stats</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">DEPTH</div>
            <div className="text-xs font-mono font-bold text-slate-900">{depth}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">AREA RATIO</div>
            <div className="text-xs font-mono font-bold text-slate-900">{(Math.pow(0.75, depth) * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">The Sierpinski Triangle</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The Sierpinski triangle, also called the Sierpinski gasket or Sierpinski sieve, is a fractal and attractive fixed set with the overall shape of an equilateral triangle, subdivided recursively into smaller equilateral triangles.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The Construction</h3>
        <p className="text-slate-600 leading-relaxed">
          1. Start with an equilateral triangle.<br />
          2. Subdivide it into four smaller congruent equilateral triangles and remove the central one.<br />
          3. Repeat step 2 with each of the remaining smaller triangles ad infinitum.
        </p>
      </div>

      <h3 className="text-xl font-bold mb-4">Mathematical Properties</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Self-Similarity:</strong> Any part of the fractal, when magnified, looks exactly like the whole.</li>
        <li><strong>Hausdorff Dimension:</strong> Approximately 1.585. This means it's more than a 1D line but less than a 2D plane.</li>
        <li><strong>Area:</strong> As the number of iterations goes to infinity, the area of the Sierpinski triangle goes to zero.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Chaos Game</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        The Sierpinski triangle can also be generated using a "chaos game": pick a random point inside the triangle, and repeatedly move half the distance toward one of the three vertices chosen at random.
      </p>

      <h3 className="text-xl font-bold mb-4">Pascal's Triangle</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        Interestingly, if you take Pascal's triangle and color all the even numbers white and the odd numbers black, the resulting pattern is a Sierpinski triangle.
      </p>
    </div>
  )
};
