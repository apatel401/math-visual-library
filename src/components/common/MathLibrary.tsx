import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, BookOpen, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface MathLibraryContextType {
  colorTheme: string;
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
  isTheoryVisible: boolean;
  setIsTheoryVisible: (visible: boolean) => void;
}

const MathLibraryContext = createContext<MathLibraryContextType | null>(null);

export const useMathTheme = () => {
  const context = useContext(MathLibraryContext);
  if (!context) throw new Error("MathLibrary components must be used within MathLibrary.Root");
  return context;
};

const sidebarSpring = { type: "spring", stiffness: 400, damping: 40, mass: 1 };

export const MathLibrary = {
  Root: ({ children, colorTheme = "#2563eb" }: { children: React.ReactNode, colorTheme?: string }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isTheoryVisible, setIsTheoryVisible] = useState(false);
    const style = { "--math-accent": colorTheme } as React.CSSProperties;

    return (
      <MathLibraryContext.Provider value={{ colorTheme, isSidebarVisible, setIsSidebarVisible, isTheoryVisible, setIsTheoryVisible }}>
        <div style={style} className="flex h-screen w-full overflow-hidden bg-white text-slate-900">
          {children}
        </div>
      </MathLibraryContext.Provider>
    );
  },

  Sidebar: ({ children }: { children: React.ReactNode }) => {
    const { isSidebarVisible, setIsSidebarVisible } = useMathTheme();
    
    return (
      <motion.div 
        initial={false}
        animate={{ 
          x: isSidebarVisible ? 0 : -384,
        }}
        transition={sidebarSpring}
        className="fixed inset-y-0 left-0 w-96 z-40"
      >
        {/* Main Sidebar Content with Scroll */}
        <div className="h-full w-full bg-white border-r border-slate-200 shadow-2xl overflow-y-auto custom-scrollbar p-8 flex flex-col gap-12">
          <div className="flex-1 flex flex-col gap-12">
            {children}
          </div>
        </div>
        
        {/* Toggle Button - Positioned outside the scroll area to prevent clipping */}
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="absolute top-24 -right-8 z-50 w-8 h-16 bg-white border border-slate-200 border-l-0 rounded-r-2xl shadow-[6px_0_15px_rgba(0,0,0,0.08)] flex items-center justify-center text-slate-400 hover:text-math-accent transition-all hover:scale-105 group"
          title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          <motion.div
            animate={{ rotate: isSidebarVisible ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </motion.div>
        </button>
      </motion.div>
    );
  },

  Display: ({ children, theory }: { children: React.ReactNode, theory?: React.ReactNode }) => {
    const { isSidebarVisible, isTheoryVisible, setIsTheoryVisible } = useMathTheme();

    return (
      <motion.div 
        initial={false}
        animate={{ 
          paddingLeft: isSidebarVisible ? '384px' : '0px' 
        }}
        transition={sidebarSpring}
        className="flex-1 relative flex flex-col overflow-hidden bg-slate-50/50"
      >
        {/* Top Controls - Theory Toggle */}
        <div className="absolute top-6 right-6 z-30">
          {theory && (
            <button 
              onClick={() => setIsTheoryVisible(!isTheoryVisible)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-math-accent group"
            >
              {isTheoryVisible ? (
                <>
                  <ImageIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  View Diagram
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  View Theory
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {isTheoryVisible ? (
              <motion.div 
                key="theory"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full h-full max-w-4xl mx-auto p-12 overflow-y-auto custom-scrollbar"
              >
                <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-sm min-h-full">
                  {theory}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="diagram"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full h-full flex items-center justify-center p-8"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
};
