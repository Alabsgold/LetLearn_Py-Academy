import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../types';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  KeyRound, 
  Award, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { clearStoredStudent, syncStudentModules } from '../services/studentService';

interface StudentDashboardProps {
  student: StudentProfile | null;
  onOpenAuth: () => void;
  onGoToStudy: () => void;
  onGoToTest: () => void;
  onGoToLab: () => void;
  onStudentUpdated: (student: StudentProfile) => void;
  onLogout?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onOpenAuth,
  onGoToStudy,
  onGoToTest,
  onGoToLab,
  onStudentUpdated,
  onLogout
}) => {
  const [completedSet, setCompletedSet] = useState<Set<string>>(() => {
    return new Set(student?.completedModules || []);
  });

  useEffect(() => {
    if (student?.completedModules) {
      setCompletedSet(new Set(student.completedModules));
    }
  }, [student]);

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
          <Flame className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to LetLearn_Py Cohort
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Sign in with your name and optional unique PIN to track your daily learning streak, save your progress, and view test results.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition cursor-pointer"
        >
          Sign In or Register Profile
        </button>
      </div>
    );
  }

  const totalModules = CURRICULUM_MODULES.length;
  const completedCount = completedSet.size;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const handleToggleModule = async (modId: string) => {
    const next = new Set(completedSet);
    if (next.has(modId)) {
      next.delete(modId);
    } else {
      next.add(modId);
    }
    setCompletedSet(next);

    const list = Array.from(next);
    await syncStudentModules(student.id, list);
    onStudentUpdated({
      ...student,
      completedModules: list
    });
  };

  const handleLogout = () => {
    clearStoredStudent();
    localStorage.removeItem('letlearn_py_device_role');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. Profile & Daily Streak Hero Header */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-white/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Student Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-500 flex items-center justify-center font-mono font-black text-xl text-slate-950 shadow-xl shadow-amber-500/25 shrink-0">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{student.pin ? 'PIN Protected' : 'No PIN Set'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Student ID: <code className="text-slate-300">{student.id}</code>
              </p>
            </div>
          </div>

          {/* Daily Streak Highlight Box */}
          <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-500/15 to-blue-500/15 border border-amber-500/30 rounded-2xl p-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Flame className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                  {student.streak || 1}
                </span>
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Day Streak
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Active today • Log in daily to build your streak!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-400 hover:text-white border border-white/10 transition"
              title="Sign out of student account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Completed Topics */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Modules Reviewed</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {completedCount} <span className="text-xs text-slate-400">/ {totalModules}</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-mono font-medium">
            {progressPercent}% Complete
          </p>
        </div>

        {/* Metric 2: Tests Taken */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tests Attempted</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {student.totalTestsTaken || 0}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            1-Hour Assessed Tests
          </p>
        </div>

        {/* Metric 3: Highest Score */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Highest Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {student.highestScore ? `${Math.round(student.highestScore)}%` : '—'}
          </div>
          <p className="text-[10px] text-amber-300 font-mono">
            {student.highestScore >= 70 ? 'Passing Standard' : 'Keep practicing'}
          </p>
        </div>

        {/* Metric 4: Daily Streak */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
            {student.streak || 1} 🔥
          </div>
          <p className="text-[10px] text-emerald-400 font-mono">
            Streak Active Today
          </p>
        </div>
      </div>

      {/* 3. Action Shortcuts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={onGoToStudy}
          className="flex items-center justify-between p-4 rounded-2xl liquid-glass hover:bg-white/[0.08] transition text-left border border-white/10 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Continue Study Materials
              </h3>
              <p className="text-xs text-slate-400">
                Review list methods, indexing, and code
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </button>

        <button
          onClick={onGoToLab}
          className="flex items-center justify-between p-4 rounded-2xl liquid-glass hover:bg-white/[0.08] transition text-left border border-white/10 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                Practice in Python Lab
              </h3>
              <p className="text-xs text-slate-400">
                Write & run Python code directly
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </button>

        <button
          onClick={onGoToTest}
          className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 transition text-left border border-white/20 group text-white shadow-xl shadow-blue-500/20"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Take Today's Test (1h)
              </h3>
              <p className="text-xs text-blue-100">
                18 questions • Real-time grading
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* 4. Curriculum Modules Checklist (Real-Time Synchronized to Firebase) */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Your Curriculum Checklist (Firebase Cloud Synced)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Check off modules as you master them. Mentors can see your progress live!
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">
            {completedCount} of {totalModules} Completed ({progressPercent}%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CURRICULUM_MODULES.map((mod, index) => {
            const isDone = completedSet.has(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => handleToggleModule(mod.id)}
                className={`flex items-start justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-amber-400/90 font-mono">
                      {mod.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold leading-snug">
                    {mod.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'border border-white/20 text-transparent'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? 'text-slate-950' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
