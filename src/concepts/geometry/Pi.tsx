import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface PiContextType {
  progress: number;
  setProgress: (val: number) => void;
  isAnimating: boolean;
  setIsAnimating: (val: boolean) => void;
}

const PiContext = createContext<PiContextType | null>(null);

export const PiVisualization = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [progress, setProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    return (
      <PiContext.Provider value={{ progress, setProgress, isAnimating, setIsAnimating }}>
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
    const { progress, setProgress, isAnimating, setIsAnimating } = context;

    React.useEffect(() => {
      let interval: any;
      if (isAnimating) {
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 1) {
              setIsAnimating(false);
              return 1;
            }
            return Math.min(prev + 0.005, 1);
          });
        }, 16);
      }
      return () => clearInterval(interval);
    }, [isAnimating, setIsAnimating, setProgress]);

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (progress >= 1) setProgress(0);
              setIsAnimating(!isAnimating);
            }}
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
                {progress >= 1 ? 'Restart' : 'Unroll'}
              </>
            )}
          </button>
          <button 
            onClick={() => {
              setIsAnimating(false);
              setProgress(0);
            }}
            className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Manual Progress</label>
            <span className="text-xs font-mono font-bold text-math-accent">{(progress * 100).toFixed(1)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.001" value={progress} 
            onChange={(e) => {
              setIsAnimating(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(PiContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { progress } = context;

    const radius = 60;
    const diameter = radius * 2;
    const circumference = 2 * Math.PI * radius;
    const size = 600;
    const centerY = size / 2;
    const startX = 80;
    const groundY = centerY + radius;

    // The circle rolls to the right
    const currentX = startX + progress * circumference;
    const rotation = progress * 360;

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-3xl overflow-visible">
          {/* Grid Background */}
          <g stroke="#f1f5f9" strokeWidth="1">
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2={size} />
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2={size} y2={i * 50} />
            ))}
          </g>

          {/* Ruler / Ground */}
          <g transform={`translate(${startX}, ${groundY})`}>
            <line x1="0" y1="0" x2={circumference + 100} y2="0" stroke="#94a3b8" strokeWidth="2" />
            {/* Diameter markers */}
            {[0, 1, 2, 3, Math.PI].map((val) => (
              <g key={val} transform={`translate(${val * diameter}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="15" stroke="#94a3b8" strokeWidth="2" />
                <text y="30" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-400">
                  {val === Math.PI ? 'πd' : `${val}d`}
                </text>
                {val === Math.PI && (
                  <text y="45" textAnchor="middle" className="text-[10px] font-mono fill-math-accent">
                    ≈ 3.14159...
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Unrolled Path (The line on the ground) */}
          <motion.line
            x1={startX}
            y1={groundY}
            x2={currentX}
            y2={groundY}
            stroke={colorTheme}
            strokeWidth="4"
            strokeLinecap="round"
            initial={false}
            animate={{ x2: currentX }}
            transition={{ type: "tween", ease: "linear", duration: 0.02 }}
          />

          {/* Rolling Circle Group */}
          <motion.g
            initial={false}
            animate={{ x: currentX, y: centerY }}
            transition={{ type: "tween", ease: "linear", duration: 0.02 }}
          >
            {/* The Unrolling Part of the Circle (Remaining Perimeter) */}
            {/* Moved outside rotation group to stay aligned with the ground contact point */}
            <motion.circle
              cx="0"
              cy="0"
              r={radius}
              fill="none"
              stroke={colorTheme}
              strokeWidth="4"
              strokeDasharray={`${(1 - progress) * circumference} ${circumference}`}
              strokeDashoffset={0}
              transform="rotate(90)"
              style={{ strokeLinecap: 'round' }}
              initial={false}
              animate={{ strokeDasharray: `${(1 - progress) * circumference} ${circumference}` }}
              transition={{ type: "tween", ease: "linear", duration: 0.02 }}
            />

            {/* Rotation Group (Spokes and Markers) */}
            <motion.g
              animate={{ rotate: rotation }}
              transition={{ type: "tween", ease: "linear", duration: 0.02 }}
            >
              {/* The Circle Perimeter (Ghost) */}
              <circle
                cx="0"
                cy="0"
                r={radius}
                fill="white"
                fillOpacity="0.1"
                stroke="#e2e8f0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              
              {/* Spokes for visual rotation */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={radius * Math.cos((i * Math.PI) / 4)}
                  y2={radius * Math.sin((i * Math.PI) / 4)}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  opacity="0.3"
                />
              ))}

              {/* Radius Line to the original contact point */}
              <line x1="0" y1="0" x2="0" y2={radius} stroke={colorTheme} strokeWidth="2" strokeDasharray="2 2" />
              
              {/* Center Point */}
              <circle cx="0" cy="0" r="3" fill="#94a3b8" />
              
              {/* Original Contact Point on Circle (P) */}
              <circle cx="0" cy={radius} r="5" fill={colorTheme} stroke="white" strokeWidth="2" />
            </motion.g>

            {/* Label following the circle */}
            <text y={-radius - 15} textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">
              d = {diameter}
            </text>
          </motion.g>

          {/* Pi Label */}
          <text x={startX + circumference / 2} y={centerY - radius - 50} textAnchor="middle" className="text-[16px] font-serif italic fill-slate-900">
            Circumference = π × d
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
