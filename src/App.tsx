import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from './types';
import { Navbar } from './components/Navbar';
import { StudyMaterials } from './components/StudyMaterials';
import { PracticeLab } from './components/PracticeLab';
import { TimedExam } from './components/TimedExam';
import { InstructorDashboard } from './components/InstructorDashboard';
import { OS26Loader } from './components/OS26Loader';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [showWelcomeHUD, setShowWelcomeHUD] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('study');
  const [labCode, setLabCode] = useState<string | undefined>(undefined);
  const [activeTestCount, setActiveTestCount] = useState<number>(0);
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);

  const handleLoaderComplete = () => {
    setIsLoading(false);
    setIsEntering(true);
    setShowWelcomeHUD(true);
    setTimeout(() => setIsEntering(false), 900);
    setTimeout(() => setShowWelcomeHUD(false), 3800);
  };

  // Check URL query parameters for direct link (e.g. ?view=test or ?view=mentor)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    if (viewParam && ['study', 'practice', 'test', 'mentor'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, []);

  // Consolidated low-overhead polling for test session and active student count (runs only when tab is visible)
  useEffect(() => {
    const checkLiveSession = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch('/api/test/session-status');
        if (res.ok) {
          const data = await res.json();
          if (data.activeCount !== undefined) {
            setActiveTestCount(data.activeCount);
          }
          if (data.isOpen !== undefined) {
            setIsSessionOpen(data.isOpen);
          }
        }
      } catch (e) {
        // ignore in background
      }
    };

    checkLiveSession();
    const interval = setInterval(checkLiveSession, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenInLab = (code: string) => {
    setLabCode(code);
    setCurrentView('practice');
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* 1. OS26 Initial Liquid Glass Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <OS26Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* 2. Quantum Aperture Bloom & Warp Entrance Effect right after loader */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            key="quantum-entrance-burst"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Central Flash Bloom Expansion */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-[380px] h-[380px] rounded-full bg-gradient-to-r from-amber-400/35 via-blue-500/30 to-emerald-400/20 pointer-events-none"
            />

            {/* Cyber Laser Streak Horizon Scanline */}
            <motion.div
              initial={{ opacity: 0.8, scaleX: 0 }}
              animate={{ opacity: [0.8, 1, 0], scaleX: [0, 1.8, 2.5] }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_16px_#F59E0B] pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Futuristic OS26 Lab Access Welcome HUD Banner */}
      <AnimatePresence>
        {showWelcomeHUD && (
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="fixed top-16 sm:top-20 inset-x-0 mx-auto w-fit max-w-[92vw] z-50 pointer-events-auto cursor-pointer"
            onClick={() => setShowWelcomeHUD(false)}
          >
            <div className="liquid-glass rounded-2xl px-4 py-2.5 shadow-2xl flex items-center space-x-3 border border-amber-400/30 bg-[#070c1a]/90">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-blue-500 flex items-center justify-center font-mono font-black text-[11px] text-slate-950 shrink-0 shadow-md shadow-amber-500/30">
                Py
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white tracking-tight">
                    LetLearn_Py Coding Lab Ready
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Python 3.12 Runtime Synchronized • 12 Modules & 18 Challenges Active
                </span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono pl-1 border-l border-white/10 hidden sm:inline">
                Tap to dismiss
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Zero-Overhead Static Atmospheric Glow Layer (Zero per-frame GPU computation) */}
      <div className="fixed inset-0 ambient-glow-layer pointer-events-none z-0" />

      {/* 5. Top Floating Glass Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeTestCount={activeTestCount}
        isSessionOpen={isSessionOpen}
        onOpenLabBriefing={() => setIsLoading(true)}
      />

      {/* 6. Main Content Area with Optimized Fast Transitions */}
      {/* pb-28 on mobile guarantees content is never clipped by the bottom dock */}
      <main className="flex-1 relative z-10 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'study' && (
              <StudyMaterials
                onOpenInLab={handleOpenInLab}
                onStartTest={() => setCurrentView('test')}
                onOpenLabBriefing={() => setIsLoading(true)}
              />
            )}

            {currentView === 'practice' && (
              <PracticeLab initialCode={labCode} />
            )}

            {currentView === 'test' && (
              <TimedExam
                onGoToStudy={() => setCurrentView('study')}
                onGoToLab={() => setCurrentView('practice')}
              />
            )}

            {currentView === 'mentor' && (
              <InstructorDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Minimalist Desktop Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/40 backdrop-blur-xl py-5 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center">
              Py
            </div>
            <span className="font-semibold text-slate-300 text-xs">LetLearn_Py Cohort</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            Minimalist Python Learning & Assessment • Student PIN: <code className="text-amber-300/80 font-mono">0000</code>
          </p>

          <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
            <button onClick={() => setCurrentView('study')} className="hover:text-amber-400 transition">
              Notes
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('practice')} className="hover:text-amber-400 transition">
              Lab
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('test')} className="hover:text-amber-400 transition">
              Test
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('mentor')} className="hover:text-amber-400 transition">
              Mentor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
