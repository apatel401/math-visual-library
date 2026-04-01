import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface PhysicsContextType {
  angle: number;
  velocity: number;
  setAngle: (val: number) => void;
  setVelocity: (val: number) => void;
  isAnimating: boolean;
  setIsAnimating: (val: boolean) => void;
  currentTime: number;
  setCurrentTime: (val: number) => void;
}

const PhysicsContext = createContext<PhysicsContextType | null>(null);

export const Projectile = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    return (
      <PhysicsContext.Provider value={{ 
        angle, velocity, setAngle, setVelocity, 
        isAnimating, setIsAnimating, currentTime, setCurrentTime 
      }}>
        {children}
      </PhysicsContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Projectile Motion</h2>
      <p className="text-slate-500 font-light text-sm">Physics: Launch Angle & Initial Velocity</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(PhysicsContext);
    if (!context) return null;
    const { angle, velocity, setAngle, setVelocity, isAnimating, setIsAnimating, currentTime, setCurrentTime } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vy = velocity * Math.sin(rad);
    const tTotal = (2 * vy) / g;

    React.useEffect(() => {
      let interval: any;
      if (isAnimating) {
        interval = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= tTotal) {
              setIsAnimating(false);
              return tTotal;
            }
            return Math.min(prev + 0.02, tTotal);
          });
        }, 20);
      }
      return () => clearInterval(interval);
    }, [isAnimating, tTotal, setIsAnimating, setCurrentTime]);

    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (currentTime >= tTotal) setCurrentTime(0);
              setIsAnimating(!isAnimating);
            }}
            className="flex-1 py-3 bg-math-accent text-white rounded-xl font-mono text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isAnimating ? (
              <>
                <div className="w-2 h-2 bg-white rounded-sm" />
                Pause
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                {currentTime >= tTotal ? 'Restart' : 'Launch'}
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsAnimating(false);
              setCurrentTime(0);
            }}
            className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Launch Angle (θ)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{angle}°</span>
          </div>
          <input 
            type="range" min="0" max="90" step="1" value={angle} 
            onChange={(e) => {
              setAngle(parseInt(e.target.value));
              setCurrentTime(0);
              setIsAnimating(false);
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Initial Velocity (v₀)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{velocity} m/s</span>
          </div>
          <input 
            type="range" min="10" max="100" step="1" value={velocity} 
            onChange={(e) => {
              setVelocity(parseInt(e.target.value));
              setCurrentTime(0);
              setIsAnimating(false);
            }}
            className="w-full accent-math-accent cursor-pointer"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(PhysicsContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { angle, velocity, currentTime } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tTotal = (2 * vy) / g;
    const range = vx * tTotal;
    const hMax = (vy * vy) / (2 * g);

    const size = 500;
    const padding = 60;
    const innerSize = size - padding * 2;
    
    // Scale based on max possible range and height
    // Max range at 45 deg, 100 m/s is ~1019m
    // Max height at 90 deg, 100 m/s is ~510m
    const maxPossibleRange = 1020; 
    const scale = innerSize / maxPossibleRange;

    const points = useMemo(() => {
      const p = [];
      for (let t = 0; t <= tTotal; t += 0.05) {
        const x = vx * t;
        const y = vy * t - 0.5 * g * t * t;
        p.push(`${padding + x * scale},${size - padding - y * scale}`);
      }
      return p.join(' ');
    }, [vx, vy, tTotal, scale, size]);

    const animatedPoints = useMemo(() => {
      const p = [];
      for (let t = 0; t <= currentTime; t += 0.02) {
        const x = vx * t;
        const y = vy * t - 0.5 * g * t * t;
        p.push(`${padding + x * scale},${size - padding - y * scale}`);
      }
      return p.join(' ');
    }, [vx, vy, currentTime, scale, size]);

    const ballPos = {
      x: padding + vx * currentTime * scale,
      y: size - padding - (vy * currentTime - 0.5 * g * currentTime * currentTime) * scale
    };

    const springConfig = { type: "spring", stiffness: 200, damping: 25 };

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Grid */}
          <g stroke="#e2e8f0" strokeWidth="0.5">
            {Array.from({ length: 11 }).map((_, i) => {
              const pos = i * (innerSize / 10) + padding;
              return (
                <React.Fragment key={i}>
                  <line x1={pos} y1={padding} x2={pos} y2={size - padding} />
                  <line x1={padding} y1={pos} x2={size - padding} y2={pos} />
                </React.Fragment>
              );
            })}
          </g>

          {/* Ground */}
          <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke="#94a3b8" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke="#94a3b8" strokeWidth="2" />

          {/* Axis Labels */}
          <text x={size - padding + 10} y={size - padding + 5} className="text-[12px] font-mono fill-slate-400">X (m)</text>
          <text x={padding - 10} y={padding - 15} textAnchor="end" className="text-[12px] font-mono fill-slate-400">Y (m)</text>

          {/* Trajectory Path (Dashed) */}
          <polyline
            points={points}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animated Path (Solid) */}
          <polyline
            points={animatedPoints}
            fill="none"
            stroke={colorTheme}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Projectile Ball */}
          <motion.circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="6"
            fill={colorTheme}
            stroke="white"
            strokeWidth="2"
            initial={false}
            animate={{ cx: ballPos.x, cy: ballPos.y }}
            transition={{ type: "tween", ease: "linear", duration: 0.02 }}
          />

          {/* Max Height Marker Group */}
          <motion.g
            initial={false}
            animate={{ x: padding + (range / 2) * scale }}
            transition={springConfig}
          >
            <motion.line
              x1={0}
              y1={size - padding}
              x2={0}
              y2={size - padding - hMax * scale}
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2 2"
              animate={{ y2: size - padding - hMax * scale }}
              transition={springConfig}
            />
            <motion.text
              x={5}
              y={size - padding - hMax * scale - 5}
              className="text-[10px] font-mono font-bold fill-red-500"
              animate={{ y: size - padding - hMax * scale - 5 }}
              transition={springConfig}
            >
              H_max: {hMax.toFixed(1)}m
            </motion.text>
          </motion.g>

          {/* Range Marker Group */}
          <motion.g
            initial={false}
            animate={{ x: padding + range * scale }}
            transition={springConfig}
          >
            <circle
              cx={0}
              cy={size - padding}
              r="4"
              fill="#ef4444"
            />
            <text
              x={0}
              y={size - padding + 20}
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-red-500"
            >
              Range: {range.toFixed(1)}m
            </text>
          </motion.g>

          {/* Velocity Vector at launch */}
          <g transform={`translate(${padding}, ${size - padding}) rotate(${-angle})`}>
            <line x1="0" y1="0" x2={velocity * 0.5} y2="0" stroke={colorTheme} strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
            <polygon points={`${velocity * 0.5},0 ${velocity * 0.5 - 5},-3 ${velocity * 0.5 - 5},3`} fill={colorTheme} opacity="0.5" />
          </g>
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(PhysicsContext);
    if (!context) return null;
    const { angle, velocity, currentTime } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tTotal = (2 * vy) / g;
    
    const currentX = vx * currentTime;
    const currentY = Math.max(0, vy * currentTime - 0.5 * g * currentTime * currentTime);

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-slate-100">
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Time of Flight</span>
            <span className="text-xs font-mono font-bold text-slate-900">{tTotal.toFixed(2)}s</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-100">
            <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Current Time</span>
            <span className="text-xs font-mono font-bold text-math-accent">{currentTime.toFixed(2)}s</span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Live Position</span>
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-white rounded-lg border border-slate-100">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">X-POS</span>
              <span className="text-xs font-mono font-bold text-slate-900">{currentX.toFixed(1)}m</span>
            </div>
            <div className="flex-1 p-3 bg-white rounded-lg border border-slate-100">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 block mb-1">Y-POS</span>
              <span className="text-xs font-mono font-bold text-slate-900">{currentY.toFixed(1)}m</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
          The path of a projectile is a parabola. The horizontal motion is constant velocity, while the vertical motion is constant acceleration due to gravity ($g \approx 9.81 m/s^2$).
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(PhysicsContext);
    if (!context) return null;
    const { angle, velocity } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Physics Vectors</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">V_X</div>
            <div className="text-xs font-mono font-bold text-slate-900">{vx.toFixed(2)} m/s</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">V_Y</div>
            <div className="text-xs font-mono font-bold text-slate-900">{vy.toFixed(2)} m/s</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">Projectile Motion</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        Projectile motion is a form of motion experienced by an object or particle (a projectile) that is projected near the Earth's surface and moves along a curved path under the action of gravity only.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">Key Equations</h3>
        <div className="space-y-4 text-center">
          <div className="text-xl font-serif italic text-math-accent">
            x(t) = v₀ cos(θ) t
          </div>
          <div className="text-xl font-serif italic text-math-accent">
            y(t) = v₀ sin(θ) t - ½gt²
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Core Concepts</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Independence of Motion:</strong> The horizontal and vertical components of motion are independent of each other.</li>
        <li><strong>Horizontal Motion:</strong> Constant velocity (assuming no air resistance).</li>
        <li><strong>Vertical Motion:</strong> Constant acceleration due to gravity ($g \approx 9.81 m/s^2$).</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Important Quantities</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Range (R):</strong> The total horizontal distance traveled. Max range is achieved at 45° (without air resistance).</li>
        <li><strong>Max Height (H):</strong> The peak vertical displacement.</li>
        <li><strong>Time of Flight (T):</strong> The total time the projectile is in the air.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">The Parabolic Path</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        Because the vertical position is a quadratic function of time and the horizontal position is a linear function of time, the resulting path ($y$ as a function of $x$) is always a parabola.
      </p>
    </div>
  )
};
