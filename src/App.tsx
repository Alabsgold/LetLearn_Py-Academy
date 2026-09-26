import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import { Navbar } from './components/Navbar';
import { StudyMaterials } from './components/StudyMaterials';
import { PracticeLab } from './components/PracticeLab';
import { TimedExam } from './components/TimedExam';
import { InstructorDashboard } from './components/InstructorDashboard';

export default function App() {
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
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* OS26 Liquid Glass Ambient Background Illumination */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft fluid glowing gradient orbs */}
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[25%] right-[10%] w-[450px] h-[450px] rounded-full bg-amber-500/[0.07] blur-[140px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/[0.08] blur-[150px]" />
      </div>

      {/* Top Floating Glass Navigation */}
      <div className="relative z-40">
        <Navbar
          currentView={currentView}
          onViewChange={(view) => setCurrentView(view)}
          activeTestCount={activeTestCount}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-16">
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
      </main>

      {/* Minimalist OS26 Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/40 backdrop-blur-xl py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center">
              Py
            </div>
            <span className="font-semibold text-slate-300 text-xs">LetLearn_Py Cohort Hub</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            Minimalist Python Learning & Assessment • Student PIN: <code className="text-slate-400 font-mono">0000</code>
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
              Mentor Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
