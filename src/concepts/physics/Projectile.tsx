import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface PhysicsContextType {
  angle: number;
  velocity: number;
  setAngle: (val: number) => void;
  setVelocity: (val: number) => void;
}

const PhysicsContext = createContext<PhysicsContextType | null>(null);

export const Projectile = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [angle, setAngle] = useState(45);
    const [velocity, setVelocity] = useState(50);

    return (
      <PhysicsContext.Provider value={{ angle, velocity, setAngle, setVelocity }}>
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
    const { angle, velocity, setAngle, setVelocity } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Launch Angle (θ)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{angle}°</span>
          </div>
          <input 
            type="range" min="0" max="90" step="1" value={angle} 
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Initial Velocity (v₀)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{velocity} m/s</span>
          </div>
          <input 
            type="range" min="10" max="100" step="1" value={velocity} 
            onChange={(e) => setVelocity(parseInt(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(PhysicsContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { angle, velocity } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const tTotal = (2 * vy) / g;
    const range = vx * tTotal;
    const hMax = (vy * vy) / (2 * g);

    const size = 400;
    const scale = size / 100; // 100m = full width
    const points = useMemo(() => {
      const p = [];
      for (let t = 0; t <= tTotal; t += 0.05) {
        const x = vx * t;
        const y = vy * t - 0.5 * g * t * t;
        p.push(`${x * scale},${size - 50 - y * scale}`);
      }
      return p.join(' ');
    }, [vx, vy, tTotal, scale, size]);

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Ground */}
          <line x1="0" y1={size - 50} x2={size} y2={size - 50} stroke="#94a3b8" strokeWidth="2" />

          {/* Path */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={colorTheme}
            strokeWidth="3"
            strokeDasharray="4 4"
            initial={false}
            animate={{ stroke: colorTheme }}
          />

          {/* Max Height Marker */}
          <motion.line
            x1={(range / 2) * scale}
            y1={size - 50}
            x2={(range / 2) * scale}
            y2={size - 50 - hMax * scale}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={false}
            animate={{ x1: (range / 2) * scale, x2: (range / 2) * scale, y2: size - 50 - hMax * scale }}
          />
          <motion.text
            x={(range / 2) * scale + 5}
            y={size - 50 - hMax * scale - 5}
            className="text-[10px] font-mono font-bold fill-red-500"
            animate={{ x: (range / 2) * scale + 5, y: size - 50 - hMax * scale - 5 }}
          >
            H_max: {hMax.toFixed(1)}m
          </motion.text>

          {/* Range Marker */}
          <motion.circle
            cx={range * scale}
            cy={size - 50}
            r="4"
            fill="#ef4444"
            animate={{ cx: range * scale }}
          />
          <motion.text
            x={range * scale - 20}
            y={size - 30}
            className="text-[10px] font-mono font-bold fill-red-500"
            animate={{ x: range * scale - 20 }}
          >
            Range: {range.toFixed(1)}m
          </motion.text>
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(PhysicsContext);
    if (!context) return null;
    const { angle, velocity } = context;

    const g = 9.81;
    const rad = (angle * Math.PI) / 180;
    const vy = velocity * Math.sin(rad);
    const tTotal = (2 * vy) / g;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Time of Flight</span>
          <span className="text-sm font-serif italic text-slate-900">{tTotal.toFixed(2)}s</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
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
