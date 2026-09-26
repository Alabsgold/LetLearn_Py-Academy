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
  const [currentView, setCurrentView] = useState<AppView>('study');
  const [labCode, setLabCode] = useState<string | undefined>(undefined);
  const [activeTestCount, setActiveTestCount] = useState<number>(0);

  // Check URL query parameters for direct link (e.g. ?view=test or ?view=mentor)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    if (viewParam && ['study', 'practice', 'test', 'mentor'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, []);

  // Poll for active students taking test to show badge in navbar
  useEffect(() => {
    const checkLiveCount = async () => {
      try {
        const res = await fetch('/api/test/session-status');
        if (res.ok) {
          const data = await res.json();
          if (data.activeCount !== undefined) {
            setActiveTestCount(data.activeCount);
          }
        }
      } catch (e) {
        // ignore in background
      }
    };

    checkLiveCount();
    const interval = setInterval(checkLiveCount, 4000);
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
          <OS26Loader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* 2. OS26 Liquid Glass Dynamic Background Physics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating Orb 1: Cobalt Blue */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -45, 35, 0],
            scale: [1, 1.2, 0.95, 1],
            opacity: [0.18, 0.32, 0.22, 0.18]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[-5%] left-[8%] w-[520px] h-[520px] rounded-full bg-blue-600/25 blur-[140px]"
        />

        {/* Floating Orb 2: Python Amber Gold */}
        <motion.div
          animate={{
            x: [0, -45, 35, 0],
            y: [0, 50, -30, 0],
            scale: [1, 1.15, 0.9, 1],
            opacity: [0.14, 0.26, 0.18, 0.14]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
          className="absolute top-[30%] right-[6%] w-[480px] h-[480px] rounded-full bg-amber-500/20 blur-[150px]"
        />

        {/* Floating Orb 3: Deep Indigo Glow */}
        <motion.div
          animate={{
            x: [0, 35, -45, 0],
            y: [0, -35, 45, 0],
            scale: [0.95, 1.25, 1, 0.95],
            opacity: [0.12, 0.24, 0.15, 0.12]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3
          }}
          className="absolute bottom-[5%] left-[22%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[160px]"
        />
      </div>

      {/* 3. Top Floating Glass Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeTestCount={activeTestCount}
      />

      {/* 4. Main Content Area with OS26 View Transitions */}
      {/* pb-28 on mobile guarantees content is never clipped by the bottom dock */}
      <main className="flex-1 relative z-10 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'study' && (
              <StudyMaterials
                onOpenInLab={handleOpenInLab}
                onStartTest={() => setCurrentView('test')}
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
