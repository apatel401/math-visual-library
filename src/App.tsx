import React, { useState } from 'react';
import { MathLibrary } from './components/common/MathLibrary';
import { Pythagoras } from './concepts/pythagoras/Pythagoras';
import { UnitCircle } from './concepts/unit-circle/UnitCircle';
import { Quadratic } from './concepts/quadratic/Quadratic';
import { Calculus } from './concepts/calculus/Calculus';
import { NormalDistribution } from './concepts/statistics/NormalDistribution';
import { Sierpinski } from './concepts/fractals/Sierpinski';
import { Projectile } from './concepts/physics/Projectile';
import { PiVisualization } from './concepts/geometry/Pi';
import { Code, Copy, Check, Layers, ArrowLeft, ExternalLink, Github, BookOpen, PlayCircle, FunctionSquare, TrendingUp, BarChart2, Triangle, Wind, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'landing' | 'pythagoras' | 'unit-circle' | 'quadratic' | 'calculus' | 'normal-dist' | 'sierpinski' | 'projectile' | 'pi';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const getConceptName = () => {
    switch (page) {
      case 'pythagoras': return 'Pythagoras';
      case 'unit-circle': return 'UnitCircle';
      case 'quadratic': return 'Quadratic';
      case 'calculus': return 'Calculus';
      case 'normal-dist': return 'NormalDistribution';
      case 'sierpinski': return 'Sierpinski';
      case 'projectile': return 'Projectile';
      case 'pi': return 'PiVisualization';
      default: return '';
    }
  };

  const getThemeColor = () => {
    return '#2563eb';
  };

  const usageCode = `// 1. Install the library
// npm install @math-visual-library

import { MathLibrary, ${getConceptName()} } from '@math-visual-library';

function App() {
  return (
    <MathLibrary.Root colorTheme="${getThemeColor()}">
      <${getConceptName()}.Provider>
        <MathLibrary.Sidebar>
          <${getConceptName()}.Header />
          <${getConceptName()}.Controls />
        </MathLibrary.Sidebar>
        <MathLibrary.Display>
          <${getConceptName()}.Diagram />
        </MathLibrary.Display>
      </${getConceptName()}.Provider>
    </MathLibrary.Root>
  );
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(usageCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderConcept = () => {
    switch (page) {
      case 'pythagoras':
        return (
          <Pythagoras.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <Pythagoras.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <Pythagoras.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <Pythagoras.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<Pythagoras.Theory />}>
              <Pythagoras.Diagram />
              <Pythagoras.PrecisionMonitor />
            </MathLibrary.Display>
          </Pythagoras.Provider>
        );
      case 'unit-circle':
        return (
          <UnitCircle.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <UnitCircle.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <UnitCircle.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <UnitCircle.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<UnitCircle.Theory />}>
              <UnitCircle.Diagram />
              <UnitCircle.PrecisionMonitor />
            </MathLibrary.Display>
          </UnitCircle.Provider>
        );
      case 'quadratic':
        return (
          <Quadratic.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <Quadratic.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <Quadratic.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <Quadratic.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<Quadratic.Theory />}>
              <Quadratic.Diagram />
              <Quadratic.PrecisionMonitor />
            </MathLibrary.Display>
          </Quadratic.Provider>
        );
      case 'calculus':
        return (
          <Calculus.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <Calculus.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <Calculus.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <Calculus.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<Calculus.Theory />}>
              <Calculus.Diagram />
              <Calculus.PrecisionMonitor />
            </MathLibrary.Display>
          </Calculus.Provider>
        );
      case 'normal-dist':
        return (
          <NormalDistribution.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <NormalDistribution.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <NormalDistribution.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <NormalDistribution.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<NormalDistribution.Theory />}>
              <NormalDistribution.Diagram />
              <NormalDistribution.PrecisionMonitor />
            </MathLibrary.Display>
          </NormalDistribution.Provider>
        );
      case 'sierpinski':
        return (
          <Sierpinski.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <Sierpinski.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <Sierpinski.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <Sierpinski.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<Sierpinski.Theory />}>
              <Sierpinski.Diagram />
              <Sierpinski.PrecisionMonitor />
            </MathLibrary.Display>
          </Sierpinski.Provider>
        );
      case 'projectile':
        return (
          <Projectile.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <Projectile.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <Projectile.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <Projectile.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<Projectile.Theory />}>
              <Projectile.Diagram />
              <Projectile.PrecisionMonitor />
            </MathLibrary.Display>
          </Projectile.Provider>
        );
      case 'pi':
        return (
          <PiVisualization.Provider>
            <MathLibrary.Sidebar>
              <div className="pt-12">
                <PiVisualization.Header />
              </div>
              <div className="flex flex-col gap-8 mt-12">
                <PiVisualization.Controls />
                {renderCodeSnippet()}
              </div>
              <div className="mt-auto space-y-6">
                <PiVisualization.MathBreakdown />
                {renderFooter()}
              </div>
            </MathLibrary.Sidebar>
            <MathLibrary.Display theory={<PiVisualization.Theory />}>
              <PiVisualization.Diagram />
              <PiVisualization.PrecisionMonitor />
            </MathLibrary.Display>
          </PiVisualization.Provider>
        );
      default:
        return null;
    }
  };

  const renderCodeSnippet = () => (
    <>
      <button 
        onClick={() => setShowCode(!showCode)}
        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-math-accent transition-colors group"
      >
        <Code className="w-3 h-3 group-hover:scale-110 transition-transform" />
        {showCode ? 'Hide Library Usage' : 'Show Library Usage'}
      </button>

      <AnimatePresence>
        {showCode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative group overflow-hidden"
          >
            <pre className="p-4 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800 shadow-inner">
              {usageCode}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400 transition-all opacity-0 group-hover:opacity-100"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const renderFooter = () => (
    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-math-accent animate-pulse" />
        Live Output
      </div>
      <span>v2.3.0</span>
    </div>
  );

  if (page === 'landing') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-mono font-bold text-lg">Σ</span>
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-slate-900">Math Visual Library</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> GitHub
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-32 px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 mb-8"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Version 2.3.0 Available</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl font-light tracking-tighter italic font-serif text-slate-900 mb-8 leading-[0.9]"
            >
              Interactive Math <br />
              <span className="text-blue-600">Visual Library</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 font-light leading-relaxed mb-12"
            >
              A professional React library for Math Education. Beautiful, interactive, and highly customizable visualizations for complex mathematical concepts.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Get Started
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                View on NPM
              </button>
            </motion.div>
          </div>

          {/* Concept Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {/* Pythagoras Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('pythagoras')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <Layers className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Pythagoras Theorem</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Visualize the relationship between the sides of a right-angled triangle.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Unit Circle Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('unit-circle')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <BookOpen className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">The Unit Circle</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Explore Sine, Cosine, and Tangent through circular motion.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Quadratic Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('quadratic')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <FunctionSquare className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Quadratic Equations</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Understand how coefficients change the shape of a parabola.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Calculus Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('calculus')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Calculus: Derivatives</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Visualize the slope of a tangent line at any point on a curve.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
            {/* Normal Distribution Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('normal-dist')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <BarChart2 className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Normal Distribution</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Understand Mean and Standard Deviation through the Bell Curve.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>


            {/* Sierpinski Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('sierpinski')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <Triangle className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Sierpinski Triangle</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Explore recursion and self-similarity in fractal geometry.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Projectile Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('projectile')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <Wind className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Projectile Motion</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Simulate parabolic trajectories with gravity and velocity.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Pi Card */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all cursor-pointer overflow-hidden relative"
              onClick={() => setPage('pi')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
                  <Circle className="text-white w-5 h-5" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2">Visualizing Pi</h3>
                <p className="text-slate-500 font-light text-sm mb-6 max-w-[280px]">Watch a circle unroll to see the relationship between C and d.</p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Launch Demo <PlayCircle className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-12 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">© 2026 Math Visual Library</span>
            <div className="flex gap-8">
              <a href="#" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back to Landing Button */}
      <button 
        onClick={() => setPage('landing')}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:shadow-lg transition-all group"
      >
        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        Back to Gallery
      </button>

      <MathLibrary.Root colorTheme={getThemeColor()}>
        {renderConcept()}
      </MathLibrary.Root>
    </div>
  );
}
