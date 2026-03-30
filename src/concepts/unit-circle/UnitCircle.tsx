import React, { useState, useMemo, createContext, useContext } from 'react';
import { motion } from 'motion/react';
import { Info, Compass, Ruler } from 'lucide-react';

// --- Unit Circle Context ---

interface UnitCircleContextType {
  angle: number;
  setAngle: (val: number) => void;
  radians: number;
  cos: number;
  sin: number;
  tan: number;
  scale: number;
}

const UnitCircleContext = createContext<UnitCircleContextType | null>(null);

const useUnitCircle = () => {
  const context = useContext(UnitCircleContext);
  if (!context) throw new Error("UnitCircle components must be used within UnitCircle.Provider");
  return context;
};

const fastTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.5
};

// --- Unit Circle Components ---

export const UnitCircle = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [angle, setAngle] = useState(45);
    const scale = 150; // Radius of the unit circle in pixels

    const radians = useMemo(() => angle * (Math.PI / 180), [angle]);
    const cos = useMemo(() => Math.cos(radians), [radians]);
    const sin = useMemo(() => Math.sin(radians), [radians]);
    const tan = useMemo(() => {
      // Handle tan(90) and tan(270)
      if (Math.abs(cos) < 0.0001) return Infinity;
      return sin / cos;
    }, [sin, cos]);

    return (
      <UnitCircleContext.Provider value={{ angle, setAngle, radians, cos, sin, tan, scale }}>
        {children}
      </UnitCircleContext.Provider>
    );
  },

  Header: () => (
    <header>
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-5 h-5 text-math-accent" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Trigonometric Unit</span>
      </div>
      <h1 className="text-4xl font-light tracking-tighter italic font-serif text-slate-900">
        The Unit Circle
      </h1>
    </header>
  ),

  Controls: () => {
    const { angle, setAngle } = useUnitCircle();
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="font-mono text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="text-math-accent font-bold italic text-lg">θ</span> angle (degrees)
            </label>
            <span className="font-mono text-xl text-slate-900 font-medium">{Math.round(angle)}°</span>
          </div>
          <input 
            type="range" min="0" max="360" step="1" value={angle} 
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    );
  },

  MathBreakdown: () => {
    const { cos, sin, tan, angle } = useUnitCircle();
    return (
      <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Trigonometric Values</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">cos({Math.round(angle)}°)</span>
            <span className="text-math-accent font-bold">{cos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">sin({Math.round(angle)}°)</span>
            <span className="text-math-accent font-bold">{sin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">tan({Math.round(angle)}°)</span>
            <span className="text-math-accent font-bold">
              {Math.abs(tan) === Infinity ? '∞' : tan.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  },

  Diagram: () => {
    const { cos, sin, scale, angle, setAngle } = useUnitCircle();
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const centerX = 400;
    const centerY = 400;

    // Use a ref to store the current dragging state for the window listeners
    const isDraggingRef = React.useRef(false);

    const handleInteraction = React.useCallback((clientX: number, clientY: number) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      
      // Calculate coordinates relative to the center of the SVG
      const x = clientX - (rect.left + rect.width / 2);
      const y = clientY - (rect.top + rect.height / 2);
      
      let newAngle = Math.atan2(-y, x) * (180 / Math.PI);
      if (newAngle < 0) newAngle += 360;
      
      // Use high precision for the state to ensure smooth movement
      setAngle(newAngle);
    }, [setAngle]);

    React.useEffect(() => {
      const onWindowMouseMove = (e: MouseEvent) => {
        if (isDraggingRef.current) {
          handleInteraction(e.clientX, e.clientY);
        }
      };

      const onWindowMouseUp = () => {
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          setIsDragging(false);
        }
      };

      const onWindowTouchMove = (e: TouchEvent) => {
        if (isDraggingRef.current) {
          handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
        }
      };

      window.addEventListener('mousemove', onWindowMouseMove);
      window.addEventListener('mouseup', onWindowMouseUp);
      window.addEventListener('touchmove', onWindowTouchMove, { passive: false });
      window.addEventListener('touchend', onWindowMouseUp);

      return () => {
        window.removeEventListener('mousemove', onWindowMouseMove);
        window.removeEventListener('mouseup', onWindowMouseUp);
        window.removeEventListener('touchmove', onWindowTouchMove);
        window.removeEventListener('touchend', onWindowMouseUp);
      };
    }, [handleInteraction]);

    const startDragging = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      handleInteraction(clientX, clientY);
    };

    // Use a faster transition when dragging for "instant" feedback
    const activeTransition = isDragging ? { type: "just" } : fastTransition;

    return (
      <svg 
        ref={svgRef}
        viewBox="0 0 800 800" 
        className={`w-full h-full max-w-[800px] drop-shadow-[0_0_50px_rgba(0,0,0,0.05)] select-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x={centerX} y={centerY}>
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Axes - Made more visible */}
          <line x1="-350" y1="0" x2="350" y2="0" stroke="rgba(15, 23, 42, 0.3)" strokeWidth="2" />
          <line x1="0" y1="-350" x2="0" y2="350" stroke="rgba(15, 23, 42, 0.3)" strokeWidth="2" />
          
          {/* Axis Labels */}
          <text x="360" y="5" className="fill-slate-400 font-mono text-[10px] font-bold">X</text>
          <text x="5" y="-360" className="fill-slate-400 font-mono text-[10px] font-bold">Y</text>

          {/* Scale Ticks (1, -1) */}
          <line x1={scale} y1="-5" x2={scale} y2="5" stroke="rgba(15, 23, 42, 0.5)" strokeWidth="2" />
          <line x1={-scale} y1="-5" x2={-scale} y2="5" stroke="rgba(15, 23, 42, 0.5)" strokeWidth="2" />
          <line x1="-5" y1={scale} x2="5" y2={scale} stroke="rgba(15, 23, 42, 0.5)" strokeWidth="2" />
          <line x1="-5" y1={-scale} x2="5" y2={-scale} stroke="rgba(15, 23, 42, 0.5)" strokeWidth="2" />

          <text x={scale} y="20" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">1</text>
          <text x={-scale} y="20" textAnchor="middle" className="fill-slate-400 font-mono text-[10px]">-1</text>
          <text x="15" y={-scale} className="fill-slate-400 font-mono text-[10px]">1</text>
          <text x="15" y={scale} className="fill-slate-400 font-mono text-[10px]">-1</text>
          
          {/* Unit Circle */}
          <circle cx="0" cy="0" r={scale} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeDasharray="8 4" />
          
          {/* Shadows / Projections */}
          {/* Cosine shadow on X axis */}
          <motion.line
            animate={{ x1: 0, y1: 0, x2: cos * scale, y2: 0 }}
            transition={activeTransition}
            stroke="var(--math-accent)" strokeWidth="4" strokeLinecap="round"
            className="opacity-20"
          />
          
          {/* Sine shadow on Y axis */}
          <motion.line
            animate={{ x1: 0, y1: 0, x2: 0, y2: -sin * scale }}
            transition={activeTransition}
            stroke="var(--math-accent)" strokeWidth="4" strokeLinecap="round"
            className="opacity-20"
          />

          {/* Dotted projection lines */}
          <motion.line
            animate={{ x1: cos * scale, y1: 0, x2: cos * scale, y2: -sin * scale }}
            transition={activeTransition}
            stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeDasharray="4 4"
          />
          <motion.line
            animate={{ x1: 0, y1: -sin * scale, x2: cos * scale, y2: -sin * scale }}
            transition={activeTransition}
            stroke="rgba(0,0,0,0.2)" strokeWidth="1" strokeDasharray="4 4"
          />

          {/* Main Radius Line */}
          <motion.line
            animate={{ x1: 0, y1: 0, x2: cos * scale, y2: -sin * scale }}
            transition={activeTransition}
            stroke="var(--math-accent)" strokeWidth="3" strokeLinecap="round"
          />

          {/* Point on Circle */}
          <motion.circle
            animate={{ cx: cos * scale, cy: -sin * scale }}
            transition={activeTransition}
            r="12" fill="var(--math-accent)" stroke="white" strokeWidth="3"
            className="shadow-xl cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => startDragging(e.clientX, e.clientY)}
            onTouchStart={(e) => startDragging(e.touches[0].clientX, e.touches[0].clientY)}
          />

          {/* Labels */}
          <motion.g animate={{ x: (cos * scale) / 2, y: 20 }} transition={activeTransition}>
             <text textAnchor="middle" className="fill-math-accent font-mono text-[10px] font-bold uppercase tracking-tighter">cos {Math.round(angle)}°</text>
          </motion.g>
          
          <motion.g animate={{ x: -35, y: (-sin * scale) / 2 }} transition={activeTransition}>
             <text textAnchor="middle" className="fill-math-accent font-mono text-[10px] font-bold uppercase tracking-tighter" style={{ writingMode: 'vertical-rl' }}>sin {Math.round(angle)}°</text>
          </motion.g>

          <motion.g animate={{ x: cos * scale + 15, y: -sin * scale - 15 }} transition={activeTransition}>
             <text className="fill-slate-400 font-mono text-[10px]">({cos.toFixed(2)}, {sin.toFixed(2)})</text>
          </motion.g>
        </g>
      </svg>
    );
  },

  PrecisionMonitor: () => {
    const { cos, sin } = useUnitCircle();
    return (
      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2">
        <div className="px-4 py-2 bg-white/80 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1 min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="w-4 h-4 text-math-accent" />
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">Coordinate Precision</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-slate-400">X (cos)</span>
            <span className="font-mono text-xs text-slate-900 font-bold">{cos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-slate-400">Y (sin)</span>
            <span className="font-mono text-xs text-slate-900 font-bold">{sin.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">The Unit Circle</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The unit circle is a circle with a radius of one, centered at the origin (0,0) in the Cartesian coordinate system. It is a fundamental tool in trigonometry.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The Equation</h3>
        <div className="text-4xl font-serif italic text-math-accent text-center py-4">
          x² + y² = 1
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Trigonometric Functions</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        On the unit circle, the coordinates of any point (x, y) at an angle θ are defined by:
      </p>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Cosine (cos θ):</strong> The x-coordinate of the point.</li>
        <li><strong>Sine (sin θ):</strong> The y-coordinate of the point.</li>
        <li><strong>Tangent (tan θ):</strong> The ratio of y to x (sin θ / cos θ).</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Radians vs. Degrees</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        While we often use degrees (0° to 360°), mathematicians prefer radians. A full circle is 2π radians.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-100 rounded-xl text-center">
          <div className="text-xs font-mono text-slate-400">90°</div>
          <div className="font-bold text-math-accent">π/2</div>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl text-center">
          <div className="text-xs font-mono text-slate-400">180°</div>
          <div className="font-bold text-math-accent">π</div>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl text-center">
          <div className="text-xs font-mono text-slate-400">270°</div>
          <div className="font-bold text-math-accent">3π/2</div>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl text-center">
          <div className="text-xs font-mono text-slate-400">360°</div>
          <div className="font-bold text-math-accent">2π</div>
        </div>
      </div>
    </div>
  )
};
