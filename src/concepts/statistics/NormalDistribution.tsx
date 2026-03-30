import React, { createContext, useContext, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useMathTheme } from '../../components/common/MathLibrary';

interface StatisticsContextType {
  mean: number;
  sd: number;
  setMean: (val: number) => void;
  setSd: (val: number) => void;
}

const StatisticsContext = createContext<StatisticsContextType | null>(null);

export const NormalDistribution = {
  Provider: ({ children }: { children: React.ReactNode }) => {
    const [mean, setMean] = useState(0);
    const [sd, setSd] = useState(1);

    return (
      <StatisticsContext.Provider value={{ mean, sd, setMean, setSd }}>
        {children}
      </StatisticsContext.Provider>
    );
  },

  Header: () => (
    <div>
      <h2 className="text-4xl font-serif italic mb-2">Normal Distribution</h2>
      <p className="text-slate-500 font-light text-sm">The Bell Curve: $\mu$ and $\sigma$</p>
    </div>
  ),

  Controls: () => {
    const context = useContext(StatisticsContext);
    if (!context) return null;
    const { mean, sd, setMean, setSd } = context;

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Mean (μ)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{mean.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="-5" max="5" step="0.1" value={mean} 
            onChange={(e) => setMean(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Std Dev (σ)</label>
            <span className="text-xs font-mono font-bold text-math-accent">{sd.toFixed(1)}</span>
          </div>
          <input 
            type="range" min="0.5" max="3" step="0.1" value={sd} 
            onChange={(e) => setSd(parseFloat(e.target.value))}
            className="w-full accent-math-accent"
          />
        </div>
      </div>
    );
  },

  Diagram: () => {
    const context = useContext(StatisticsContext);
    const { colorTheme } = useMathTheme();
    if (!context) return null;
    const { mean, sd } = context;

    const size = 400;
    const scaleX = 40;
    const scaleY = 200;
    const center = size / 2;

    const normalPdf = (x: number, m: number, s: number) => {
      return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));
    };

    const points = useMemo(() => {
      const p = [];
      for (let x = -10; x <= 10; x += 0.1) {
        const y = normalPdf(x, mean, sd);
        p.push(`${center + x * scaleX},${size - 50 - y * scaleY}`);
      }
      return p.join(' ');
    }, [mean, sd, center, size]);

    const shadedArea = useMemo(() => {
      const p = [];
      for (let x = mean - sd; x <= mean + sd; x += 0.1) {
        const y = normalPdf(x, mean, sd);
        p.push(`${center + x * scaleX},${size - 50 - y * scaleY}`);
      }
      // Close the path
      p.push(`${center + (mean + sd) * scaleX},${size - 50}`);
      p.push(`${center + (mean - sd) * scaleX},${size - 50}`);
      return p.join(' ');
    }, [mean, sd, center, size]);

    return (
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-2xl overflow-visible">
          {/* Grid */}
          <g stroke="#e2e8f0" strokeWidth="0.5">
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={i} x1={i * scaleX} y1="0" x2={i * scaleX} y2={size} />
            ))}
          </g>

          {/* X-Axis */}
          <line x1="0" y1={size - 50} x2={size} y2={size - 50} stroke="#94a3b8" strokeWidth="2" />

          {/* 68% Shaded Area */}
          <motion.polygon
            points={shadedArea}
            fill={colorTheme}
            fillOpacity="0.1"
            initial={false}
            animate={{ fill: colorTheme }}
          />

          {/* Curve */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={colorTheme}
            strokeWidth="3"
            strokeLinejoin="round"
            initial={false}
            animate={{ stroke: colorTheme }}
          />

          {/* Mean Line */}
          <motion.line
            x1={center + mean * scaleX}
            y1={size - 50}
            x2={center + mean * scaleX}
            y2={size - 50 - normalPdf(mean, mean, sd) * scaleY}
            stroke={colorTheme}
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={false}
            animate={{ x1: center + mean * scaleX, x2: center + mean * scaleX, y2: size - 50 - normalPdf(mean, mean, sd) * scaleY }}
          />
        </svg>
      </div>
    );
  },

  MathBreakdown: () => {
    const context = useContext(StatisticsContext);
    if (!context) return null;
    const { mean, sd } = context;

    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Empirical Rule</span>
          <span className="text-sm font-serif italic text-slate-900">~68% of data</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 leading-relaxed">
          The shaded area represents one standard deviation from the mean ($ \mu \pm \sigma $). In a normal distribution, this contains approximately 68.2% of all observations.
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Peak Height</span>
          <span className="text-xs font-mono font-bold text-math-accent">
            {(1 / (sd * Math.sqrt(2 * Math.PI))).toFixed(3)}
          </span>
        </div>
      </div>
    );
  },

  PrecisionMonitor: () => {
    const context = useContext(StatisticsContext);
    if (!context) return null;
    const { mean, sd } = context;

    return (
      <div className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 shadow-xl pointer-events-none">
        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-400 mb-2">Distribution Stats</div>
        <div className="flex gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400">MEAN</div>
            <div className="text-xs font-mono font-bold text-slate-900">{mean.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-400">STD DEV</div>
            <div className="text-xs font-mono font-bold text-slate-900">{sd.toFixed(4)}</div>
          </div>
        </div>
      </div>
    );
  },

  Theory: () => (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-serif italic mb-6">The Normal Distribution</h2>
      <p className="text-lg text-slate-600 leading-relaxed mb-8">
        The normal distribution, also known as the Gaussian distribution, is a probability distribution that is symmetric about the mean, showing that data near the mean are more frequent in occurrence than data far from the mean.
      </p>
      
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8">
        <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">The PDF Formula</h3>
        <div className="text-2xl font-serif italic text-math-accent text-center py-4">
          f(x) = (1 / (σ√(2π))) * e<sup>-1/2((x-μ)/σ)²</sup>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Key Parameters</h3>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>Mean (μ):</strong> The center of the distribution. It determines the location of the peak.</li>
        <li><strong>Standard Deviation (σ):</strong> Measures the spread of the distribution. A larger σ results in a flatter, wider curve.</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">The Empirical Rule (68-95-99.7)</h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        In a normal distribution:
      </p>
      <ul className="space-y-4 text-slate-600 mb-8">
        <li><strong>68.2%</strong> of data falls within 1 standard deviation (μ ± 1σ).</li>
        <li><strong>95.4%</strong> of data falls within 2 standard deviations (μ ± 2σ).</li>
        <li><strong>99.7%</strong> of data falls within 3 standard deviations (μ ± 3σ).</li>
      </ul>

      <h3 className="text-xl font-bold mb-4">Real-World Examples</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
          <div className="font-bold text-sm mb-1">Height</div>
          <p className="text-[10px] text-slate-500">Human height follows a near-perfect normal curve.</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
          <div className="font-bold text-sm mb-1">Test Scores</div>
          <p className="text-[10px] text-slate-500">Standardized tests are often designed to be normally distributed.</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
          <div className="font-bold text-sm mb-1">Errors</div>
          <p className="text-[10px] text-slate-500">Measurement errors in scientific experiments.</p>
        </div>
      </div>
    </div>
  )
};
