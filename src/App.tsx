import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, StudentProfile, MentorTest } from './types';
import { Navbar } from './components/Navbar';
import { StudyMaterials } from './components/StudyMaterials';
import { PracticeLab } from './components/PracticeLab';
import { TimedExam } from './components/TimedExam';
import { InstructorDashboard } from './components/InstructorDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentAuthModal } from './components/StudentAuthModal';
import { WelcomeGateModal } from './components/WelcomeGateModal';
import { LabTipsModal } from './components/LabTipsModal';
import { OS26Loader } from './components/OS26Loader';
import { getStoredStudent, clearStoredStudent } from './services/studentService';
import { subscribeToActiveTest } from './services/testService';

export default function App() {
  // 1. Initial Loader: Only runs ONCE per session to eliminate reloading delays across tabs
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !sessionStorage.getItem('letlearn_py_intro_seen');
  });
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [showWelcomeHUD, setShowWelcomeHUD] = useState<boolean>(false);

  // 2. Navigation & Views
  const [currentView, setCurrentView] = useState<AppView>('study');
  const [labCode, setLabCode] = useState<string | undefined>(undefined);
  const [activeTestCount, setActiveTestCount] = useState<number>(0);
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);
  const [activeTest, setActiveTest] = useState<MentorTest | null>(null);

  // 3. Student auth state loaded from persistent local storage & synced to Firebase
  const [student, setStudent] = useState<StudentProfile | null>(() => getStoredStudent());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLabTipsModalOpen, setIsLabTipsModalOpen] = useState<boolean>(false);

  // 4. Per-Device Role Management ('student' | 'mentor' | null)
  const [deviceRole, setDeviceRole] = useState<'student' | 'mentor' | null>(() => {
    const savedRole = localStorage.getItem('letlearn_py_device_role') as 'student' | 'mentor' | null;
    if (savedRole) return savedRole;
    if (getStoredStudent()) return 'student';
    if (sessionStorage.getItem('letlearn_py_mentor_auth') === 'authorized') return 'mentor';
    return null;
  });

  // 5. Welcome Gate Modal state (shown on first visit per device if not yet registered/authorized)
  const [isWelcomeGateOpen, setIsWelcomeGateOpen] = useState<boolean>(() => {
    const hasStudent = Boolean(getStoredStudent());
    const isMentor = sessionStorage.getItem('letlearn_py_mentor_auth') === 'authorized';
    return !hasStudent && !isMentor;
  });

  const handleLoaderComplete = () => {
    sessionStorage.setItem('letlearn_py_intro_seen', 'true');
    setIsLoading(false);
    setIsEntering(true);
    setShowWelcomeHUD(true);
    setTimeout(() => setIsEntering(false), 800);
    setTimeout(() => setShowWelcomeHUD(false), 3500);

    // If device is not configured with student or mentor, open welcome gate
    if (!student && deviceRole !== 'mentor') {
      setIsWelcomeGateOpen(true);
    }
  };

  // Check URL query parameters for direct links (e.g. ?view=test, ?view=mentor, ?role=mentor)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    const roleParam = params.get('role');

    if (roleParam === 'mentor' || viewParam === 'mentor') {
      setDeviceRole('mentor');
      setCurrentView('mentor');
      setIsWelcomeGateOpen(false);
    } else if (viewParam && ['study', 'practice', 'test', 'student'].includes(viewParam)) {
      setCurrentView(viewParam);
    }
  }, []);

  // Live session status check
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

  // Real-time listener for active test from Firestore
  useEffect(() => {
    const unsub = subscribeToActiveTest((test) => {
      setActiveTest(test);
    });
    return () => unsub();
  }, []);

  const handleOpenInLab = (code: string) => {
    setLabCode(code);
    setCurrentView('practice');
  };

  // Student logs out: instant, smooth reset without window.location.reload()
  const handleStudentLogout = () => {
    clearStoredStudent();
    localStorage.removeItem('letlearn_py_device_role');
    setStudent(null);
    setDeviceRole(null);
    setIsWelcomeGateOpen(true);
    setCurrentView('study');
  };

  // Mentor switches to student view
  const handleSwitchToStudent = () => {
    setDeviceRole('student');
    setCurrentView('study');
  };

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* 1. OS26 Initial Liquid Glass Loading Screen (Only runs ONCE per session) */}
      <AnimatePresence>
        {isLoading && (
          <OS26Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      {/* 2. Quantum Aperture Bloom & Warp Entrance Effect */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            key="quantum-entrance-burst"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-[380px] h-[380px] rounded-full bg-gradient-to-r from-amber-400/35 via-blue-500/30 to-emerald-400/20 pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0.8, scaleX: 0 }}
              animate={{ opacity: [0.8, 1, 0], scaleX: [0, 1.8, 2.5] }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_16px_#F59E0B] pointer-events-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Welcome HUD Banner */}
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
                  Python 3.12 Runtime Synchronized • 12 Modules & Assessment Engine Active
                </span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono pl-1 border-l border-white/10 hidden sm:inline">
                Tap to dismiss
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Ambient Glow Background */}
      <div className="fixed inset-0 ambient-glow-layer pointer-events-none z-0" />

      {/* 5. Top Navigation Bar (Role-filtered: Students only see their tabs; Mentors see Mentor Portal) */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeTestCount={activeTestCount}
        isSessionOpen={isSessionOpen}
        activeTest={activeTest}
        student={student}
        deviceRole={deviceRole}
        onOpenStudentAuth={() => setIsAuthModalOpen(true)}
        onOpenLabBriefing={() => setIsLabTipsModalOpen(true)}
        onLogoutStudent={handleStudentLogout}
        onSwitchToStudent={handleSwitchToStudent}
      />

      {/* 6. Main Content Area: Instant in-memory transitions with NO full-page reloading */}
      <main className="flex-1 relative z-10 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'study' && (
              <StudyMaterials
                onOpenInLab={handleOpenInLab}
                onStartTest={() => setCurrentView('test')}
                onOpenLabBriefing={() => setIsLabTipsModalOpen(true)}
                activeTest={activeTest}
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

            {currentView === 'student' && (
              <StudentDashboard
                student={student}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onGoToStudy={() => setCurrentView('study')}
                onGoToTest={() => setCurrentView('test')}
                onGoToLab={() => setCurrentView('practice')}
                onStudentUpdated={(updated) => setStudent(updated)}
                onLogout={handleStudentLogout}
                activeTest={activeTest}
              />
            )}

            {currentView === 'mentor' && (
              <InstructorDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* First-Time Welcome Gate Modal (One-time per device or after logout, with tiny mentor dot at bottom) */}
      <WelcomeGateModal
        isOpen={isWelcomeGateOpen && !isLoading}
        onStudentSuccess={(registeredStudent) => {
          setStudent(registeredStudent);
          setDeviceRole('student');
          setIsWelcomeGateOpen(false);
        }}
        onMentorSuccess={() => {
          setDeviceRole('mentor');
          setCurrentView('mentor');
          setIsWelcomeGateOpen(false);
        }}
      />

      {/* Student Profile Quick Edit Modal */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedStudent) => {
          setStudent(loggedStudent);
          setDeviceRole('student');
          setCurrentView('student');
        }}
      />

      {/* Lightweight Lab Tips Modal (Opens instantaneously with ZERO page reload) */}
      <LabTipsModal
        isOpen={isLabTipsModalOpen}
        onClose={() => setIsLabTipsModalOpen(false)}
        onOpenInLab={handleOpenInLab}
      />

      {/* 5. Minimalist Desktop & Mobile Footer with Discreet Mentor Dot */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/60 backdrop-blur-xl py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center">
              Py
            </div>
            <span className="font-semibold text-slate-300 text-xs">LetLearn_Py Cohort</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            Minimalist Python 3 Learning & Assessment • Student PIN: <code className="text-amber-300/80 font-mono">0000</code>
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
            {deviceRole !== 'mentor' && (
              <>
                <span>•</span>
                <button onClick={() => setCurrentView('student')} className="hover:text-amber-400 transition">
                  Dashboard
                </button>
              </>
            )}

            {/* Discreet tiny mentor dot at bottom right (as requested by user) */}
            <span>•</span>
            <button
              onClick={() => {
                setDeviceRole('mentor');
                setCurrentView('mentor');
              }}
              className="group p-1 text-slate-600 hover:text-amber-400 transition"
              title="Instructor Access"
              aria-label="Instructor Access"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
