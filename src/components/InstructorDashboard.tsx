import React, { useState, useEffect } from 'react';
import { StudentSession } from '../types';
import { downloadCohortCsv } from '../utils/analytics';
import { StudentDetailModal } from './StudentDetailModal';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Users,
  Download,
  Share2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Radio,
  FileSpreadsheet,
  AlertCircle,
  Check,
  Power,
  PowerOff,
  ChevronRight
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  // Authorization state: checked against server
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('letlearn_py_mentor_auth') === 'authorized';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState<boolean>(false);

  // Session Control state
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);
  const [isTogglingSession, setIsTogglingSession] = useState<boolean>(false);

  // Student Data
  const [students, setStudents] = useState<StudentSession[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSession | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Check session status and students
  const fetchDashboardData = async () => {
    try {
      // 1. Session status
      const statusRes = await fetch('/api/test/session-status');
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setIsSessionOpen(sData.isOpen);
      }

      // 2. Students list with instructor PIN header
      if (isAuthorized) {
        const savedPin = sessionStorage.getItem('letlearn_py_mentor_pin') || '';
        const res = await fetch(`/api/test/students?pin=${encodeURIComponent(savedPin)}`, {
          headers: {
            'x-instructor-pin': savedPin
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.students) {
            setStudents(data.students);
            setLastRefreshed(new Date());
          }
        } else if (res.status === 403) {
          // Invalidate session if PIN is no longer accepted
          handleLock();
        }
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setIsCheckingPin(true);

    try {
      const res = await fetch('/api/test/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim(), role: 'instructor' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authorized) {
          setIsAuthorized(true);
          sessionStorage.setItem('letlearn_py_mentor_auth', 'authorized');
          sessionStorage.setItem('letlearn_py_mentor_pin', pinInput.trim());
          setPinError(null);
          setPinInput('');
          return;
        }
      }
      setPinError('Access Denied: Incorrect PIN. Please try again.');
    } catch (err) {
      setPinError('Network error verifying PIN. Please try again.');
    } finally {
      setIsCheckingPin(false);
    }
  };

  const handleLock = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('letlearn_py_mentor_auth');
    sessionStorage.removeItem('letlearn_py_mentor_pin');
    setPinInput('');
  };

  const handleToggleSession = async () => {
    setIsTogglingSession(true);
    const savedPin = sessionStorage.getItem('letlearn_py_mentor_pin') || '';
    try {
      const nextState = !isSessionOpen;
      const res = await fetch('/api/test/toggle-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: savedPin,
          isOpen: nextState
        })
      });
      if (res.ok) {
        const data = await res.json();
        setIsSessionOpen(data.isOpen);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTogglingSession(false);
    }
  };

  const handleExportCsv = () => {
    try {
      downloadCohortCsv(students);
    } catch (e) {
      window.open('/api/test/export-csv', '_blank');
    }
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=test`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleResetSession = async () => {
    if (!window.confirm('Reset all live student test data for a completely clean start?')) {
      return;
    }
    const savedPin = sessionStorage.getItem('letlearn_py_mentor_pin') || '';
    try {
      await fetch('/api/test/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: savedPin })
      });
      setStudents([]);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  // Case 1: Locked Screen
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Instructor Domain
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locked domain reserved for the mentor. Enter your instructor authorization PIN to manage tests and view live scores.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block text-left">
                Instructor PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 font-mono tracking-widest text-center text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{isCheckingPin ? 'Verifying...' : 'Unlock Command Center'}</span>
            </button>
          </form>

          <div className="text-[11px] text-slate-500">
            Protected Area • Authorized Cohort Lead Access Only
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const totalStudents = students.length;
  const activeNow = students.filter(s => s.status === 'in_progress').length;
  const submittedCount = students.filter(s => s.status === 'submitted').length;
  const avgScore = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.score, 0) / totalStudents)
    : 0;
  const avgPct = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.percentage, 0) / totalStudents)
    : 0;

  // Case 2: Authorized Command Center
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Session Management Strip */}
      <div className="liquid-glass rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Mentor Command Center
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Live Monitor</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Today's Assessment Session
          </h1>
          <p className="text-xs text-slate-400">
            Control test access, monitor student answers in real-time, and export results.
          </p>
        </div>

        {/* Top Controls: Session Toggle & Lock */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Session Open / Close Toggle Button */}
          <button
            onClick={handleToggleSession}
            disabled={isTogglingSession}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
              isSessionOpen
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSessionOpen ? (
              <>
                <PowerOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Close Session</span>
              </>
            ) : (
              <>
                <Power className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Session</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareLink}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Test Link'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={students.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 liquid-glass-pill hover:bg-white/[0.08] text-emerald-300 text-xs font-semibold rounded-xl transition disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLock}
            title="Lock mentor screen"
            className="p-2 liquid-glass-pill text-slate-400 hover:text-white rounded-xl transition"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Session State Banner */}
      <div className={`liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border ${
        isSessionOpen ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-rose-500/30 bg-rose-950/20'
      }`}>
        <div className="flex items-center space-x-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${isSessionOpen ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
          <div>
            <span className="font-bold text-white text-xs">
              Status: {isSessionOpen ? 'Session is OPEN' : 'Session is CLOSED'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isSessionOpen
                ? 'Students can take the test with link & PIN 0000.'
                : 'Students are currently locked out from starting the test.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span>Student Entry PIN: <strong className="text-amber-300">0000</strong></span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 inline" />
            <span>Mentor Verified</span>
          </span>
        </div>
      </div>

      {/* Overview Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Students in Test</span>
          <div className="text-2xl font-black text-white font-mono">{activeNow}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">{totalStudents} Total Enrolled</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Completed</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{submittedCount}</div>
          <span className="text-[10px] text-slate-400 font-mono">
            {totalStudents ? Math.round((submittedCount / totalStudents) * 100) : 0}% done
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Class Average</span>
          <div className="text-2xl font-black text-amber-300 font-mono">{avgScore} / 18</div>
          <span className="text-[10px] text-slate-400 font-mono">{avgPct}% Accuracy</span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Synced</span>
          <div className="text-sm font-bold text-white font-mono mt-1">2.5s Sync</div>
          <span className="text-[10px] text-slate-500 font-mono">
            {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Live Cohort Student List */}
      <div className="liquid-glass rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white">Live Student Scores & Progress</h2>
            <p className="text-xs text-slate-400">
              Real-time feed of students taking today's test.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetSession}
              title="Reset test session data"
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition"
            >
              Reset Session
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-16 liquid-glass-card rounded-2xl space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Ready for Today's Cohort</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              No students have started yet. Send the test link and PIN (<code className="text-amber-300 font-mono">0000</code>) to your students to begin.
            </p>
            <button
              onClick={handleShareLink}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition"
            >
              {copiedLink ? 'Link Copied!' : 'Copy Student Test Link'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {students.map((student) => {
              const isSubmitted = student.status === 'submitted';
              const answeredCount = Object.keys(student.answers || {}).length;

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="liquid-glass-card p-4 rounded-2xl hover:border-white/20 transition cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-xs">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                          {student.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {isSubmitted ? 'Completed' : 'Taking Test Live'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSubmitted
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {isSubmitted ? 'Submitted' : 'Live'}
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Score</span>
                      <span className="font-bold text-white text-base">
                        {student.score} <span className="text-slate-500 text-xs">/ {student.totalPossible}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Accuracy</span>
                      <span className="font-bold text-amber-300 text-base">{student.percentage}%</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span>{answeredCount} / {student.totalPossible}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (answeredCount / student.totalPossible) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.05]">
                    <span>{isSubmitted ? 'Finished' : `${Math.floor(student.timeRemainingSeconds / 60)}m left`}</span>
                    <span className="text-blue-400 font-semibold group-hover:underline flex items-center space-x-0.5">
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Inspector */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};
