import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface PiContextType {
  progress: number;
  setProgress: (val: number) => void;
}

const PiContext = createContext<PiContextType | null>(null);

export const PiVisualization = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [progress, setProgress] = useState(0);

    return (
      <PiContext.Provider value={{ progress, setProgress }}>
        {children}
      </PiContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Visualizing Pi (π)</h2>
      <p className="text-slate-500 font-light text-sm">Circumference = π × Diameter</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(PiContext);
    if (!context) return null;
    const { progress, setProgress } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Unroll Progress</label>
            <span className="text-xs font-mono font-bold text-math-accent">{(progress * 100).toFixed(0)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.01" value={progress} 
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>
        <button 
          onClick={() => setProgress(progress === 1 ? 0 : 1)}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
        >
          {progress === 1 ? 'Reset Circle' : 'Unroll Circle'}
        </button>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(PiContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { progress } = context;

    const radius = 50;
    const diameter = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const size = 500;
    const centerY = 200;
    const startX = 100;

    // The circle rolls to the right
    const currentX = startX + progress * circumference;
    const rotation = progress * 360;

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Ruler */}
          <g transform={`translate(${startX}, ${centerY + radius + 20})`}>
            <line x1="0" y1="0" x2={circumference + 50} y2="0" stroke="#94a3b8" strokeWidth="1" />
            {/* Diameter markers */}
            {[0, 1, 2, 3, Math.PI].map((val) => (
              <g key={val} transform={`translate(${val * diameter}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="10" stroke="#94a3b8" strokeWidth="1" />
                <text y="25" textAnchor="middle" className="text-[10px] font-mono fill-slate-400">
                  {val === Math.PI ? 'πd' : `${val}d`}
                </text>
              </g>
            ))}
          </g>

          {/* Unrolled Path */}
          <motion.line
            x1={startX}
            y1={centerY + radius}
            x2={currentX}
            y2={centerY + radius}
            stroke={colorTheme}
            strokeWidth="3"
            initial={false}
            animate={{ x2: currentX }}
          />

          {/* Rolling Circle */}
          <motion.g
            initial={false}
            animate={{ x: currentX, rotate: rotation }}
            style={{ originX: `${currentX}px`, originY: `${centerY}px` }}
          >
            {/* The Circle */}
            <circle
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke={colorTheme}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={progress * circumference}
              transform="rotate(-90)"
            />
            {/* Radius Line to show rotation */}
            <line x1="0" y1="0" x2="0" y2={radius} stroke={colorTheme} strokeWidth="2" opacity="0.5" />
            {/* Point on circumference */}
            <circle cx="0" cy={radius} r="4" fill={colorTheme} />
          </motion.g>

          {/* Labels */}
          <text x={startX} y={centerY - radius - 20} className="text-[12px] font-serif italic fill-slate-900">
            Circumference = π × d ≈ 3.14159...
          </text>
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(PiContext);
    if (!context) return null;
    const { progress } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Ratio C/d</span>
          <span className="text-sm font-serif italic text-slate-900">π (Pi)</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
          Pi is the ratio of a circle's circumference to its diameter. No matter the size of the circle, this ratio is always constant.
        </div>
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Unrolled Length</span>
            <span className="text-xs font-mono font-bold text-math-accent">
              {(progress * Math.PI).toFixed(5)} diameters
            </span>
          </div>
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(PiContext);
    if (!context) return null;
    const { progress } = context;

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Geometry Precision</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">PROGRESS</div>
            <div className="text-xs font-mono font-bold text-slate-900">{(progress * 100).toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">VALUE</div>
            <div className="text-xs font-mono font-bold text-slate-900">{(progress * Math.PI).toFixed(6)}</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">The Constant Pi (π)</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Pi (π) is one of the most famous and important constants in mathematics. It is defined as the ratio of a circle's circumference to its diameter.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The Fundamental Ratio</h3>
        <div className="text-2xl font-serif italic text-math-accent text-center py-4">
          π = Circumference / Diameter
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Properties of Pi</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Irrational:</strong> Pi cannot be expressed as a simple fraction. Its decimal representation goes on forever without repeating.</li>
        <li><strong>Transcendental:</strong> Pi is not the root of any non-zero polynomial equation with rational coefficients.</li>
        <li><strong>Constant:</strong> No matter how large or small a circle is, the ratio of its circumference to its diameter is always π.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Historical Approximations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="font-bold text-sm mb-1">Archimedes</div>
          <p className="text-[10px] text-slate-500">Used polygons to show π is between 223/71 and 22/7.</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="font-bold text-sm mb-1">Modern Value</div>
          <p className="text-[10px] text-slate-500">3.14159265358979323846...</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Common Formulas</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Circumference:</strong> C = 2πr (or πd)</li>
        <li><strong>Area of Circle:</strong> A = πr²</li>
        <li><strong>Volume of Sphere:</strong> V = (4/3)πr³</li>
      </ul>
    </div>
  )
};
