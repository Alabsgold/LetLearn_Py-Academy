import React, { useState, useEffect } from 'react';
import { StudentSession, StudentProfile, MentorTest, FlaggedQuestion, TestQuestion } from '../types';
import { downloadCohortCsv } from '../utils/analytics';
import { StudentDetailModal } from './StudentDetailModal';
import { TestCreationModal } from './TestCreationModal';
import { QuestionEditorModal } from './QuestionEditorModal';
import { subscribeToAllStudents } from '../services/studentService';
import {
  subscribeToAllTests,
  subscribeToFlaggedQuestions,
  saveMentorTest,
  deleteMentorTest,
  setTestLiveStatus,
  resolveFlaggedQuestion,
  updateMentorTest
} from '../services/testService';
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
  ChevronRight,
  Flame,
  Sparkles,
  Search,
  Plus,
  Play,
  Calendar,
  AlertTriangle,
  Edit3,
  Trash2,
  HelpCircle,
  Flag,
  Terminal,
  BookOpen
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  // Authorization state: checked against server
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('letlearn_py_mentor_auth') === 'authorized';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCheckingPin, setIsCheckingPin] = useState<boolean>(false);

  // Tab State: 'tests' | 'registered' | 'flags' | 'live'
  const [activeTab, setActiveTab] = useState<'tests' | 'registered' | 'flags' | 'live'>('tests');
  const [registeredStudents, setRegisteredStudents] = useState<StudentProfile[]>([]);
  const [studentSearch, setStudentSearch] = useState<string>('');

  // Tests & Flagged Questions from Firebase & Server
  const [mentorTestsList, setMentorTestsList] = useState<MentorTest[]>([]);
  const [flaggedQuestionsList, setFlaggedQuestionsList] = useState<FlaggedQuestion[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingTest, setEditingTest] = useState<MentorTest | null>(null);

  // Question editing for single question / flagged item
  const [selectedQuestionForEdit, setSelectedQuestionForEdit] = useState<{
    testId: string;
    question: TestQuestion;
    flag?: FlaggedQuestion | null;
  } | null>(null);

  // Session Control state
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);
  const [isTogglingSession, setIsTogglingSession] = useState<boolean>(false);

  // Student Data
  const [students, setStudents] = useState<StudentSession[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentSession | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // 1. Listen to Firebase registered students in real-time
  useEffect(() => {
    if (!isAuthorized) return;
    const unsubStudents = subscribeToAllStudents((list) => {
      setRegisteredStudents(list);
    });
    const unsubTests = subscribeToAllTests((tests) => {
      setMentorTestsList(tests);
    });
    const unsubFlags = subscribeToFlaggedQuestions((flags) => {
      setFlaggedQuestionsList(flags);
    });

    return () => {
      unsubStudents();
      unsubTests();
      unsubFlags();
    };
  }, [isAuthorized]);

  // 2. Check session status and students
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
    try {
      const savedPin = sessionStorage.getItem('letlearn_py_mentor_pin') || '';
      const res = await fetch('/api/test/toggle-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: savedPin, isOpen: !isSessionOpen })
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

  const handleResetSession = async () => {
    if (!window.confirm('Are you sure you want to reset all active and submitted test sessions?')) {
      return;
    }

    try {
      const savedPin = sessionStorage.getItem('letlearn_py_mentor_pin') || '';
      const res = await fetch('/api/test/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: savedPin })
      });

      if (res.ok) {
        setStudents([]);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/?tab=test`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCsv = () => {
    downloadCohortCsv(students);
  };

  // Toggle Test Live status
  const handleToggleTestLive = async (test: MentorTest) => {
    try {
      await setTestLiveStatus(test.id, !test.isLive);
    } catch (e) {
      console.error('Error toggling test live:', e);
    }
  };

  // Delete Test
  const handleDeleteTest = async (testId: string) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      await deleteMentorTest(testId);
    } catch (e) {
      console.error('Error deleting test:', e);
    }
  };

  // Fix / Cross-Check flagged question
  const handleOpenFlaggedQuestion = (flag: FlaggedQuestion) => {
    // Find the test containing this question
    let foundTest: MentorTest | null = null;
    let foundQ: TestQuestion | null = null;

    for (const t of mentorTestsList) {
      const match = t.questions?.find((q) => q.id === flag.questionId);
      if (match) {
        foundTest = t;
        foundQ = match;
        break;
      }
    }

    if (foundTest && foundQ) {
      setSelectedQuestionForEdit({
        testId: foundTest.id,
        question: foundQ,
        flag
      });
    } else {
      // If question was in current active or fallback, construct dummy question to edit
      const fallbackQ: TestQuestion = {
        id: flag.questionId,
        type: 'multiple_choice',
        topic: 'General Python',
        topicCategory: 'Review',
        title: flag.questionTitle,
        prompt: flag.questionTitle,
        correctAnswer: 'a',
        explanation: '',
        improvementTip: ''
      };
      setSelectedQuestionForEdit({
        testId: flag.testId || (mentorTestsList[0]?.id || 'test_default'),
        question: fallbackQ,
        flag
      });
    }
  };

  // Save single question update (and resolve flag if applicable)
  const handleSaveQuestionUpdate = async (updatedQ: TestQuestion) => {
    if (!selectedQuestionForEdit) return;
    const targetTest = mentorTestsList.find((t) => t.id === selectedQuestionForEdit.testId);
    if (targetTest) {
      const updatedQuestions = targetTest.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
      await updateMentorTest({
        ...targetTest,
        questions: updatedQuestions
      });
    }

    if (selectedQuestionForEdit.flag) {
      await resolveFlaggedQuestion(selectedQuestionForEdit.flag.id);
    }
    setSelectedQuestionForEdit(null);
  };

  // Pending flags count
  const pendingFlagsCount = flaggedQuestionsList.filter((f) => f.status === 'pending').length;

  // Case 1: Unauthorized PIN Gate
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-white">Mentor Command Center</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your Instructor PIN to create tests with Gemini AI, schedule assessments, and monitor live students.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
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
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 font-mono tracking-widest text-center text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCheckingPin}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>{isCheckingPin ? 'Verifying...' : 'Unlock Mentor Portal'}</span>
            </button>
          </form>

          <div className="text-[11px] text-slate-500">
            Protected Area • Authorized Mentor Access Only
          </div>
        </div>
      </div>
    );
  }

  // Active Live Test (if any)
  const activeLiveTest = mentorTestsList.find((t) => t.isLive);
  const totalStudents = students.length;
  const activeNow = students.filter((s) => s.status === 'in_progress').length;
  const submittedCount = students.filter((s) => s.status === 'submitted').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Strip */}
      <div className="liquid-glass rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Mentor Command Center
            </span>
            {activeLiveTest && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>Live Test: {activeLiveTest.title}</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Assessments & Cohort Studio
          </h1>
          <p className="text-xs text-slate-400">
            Create lightweight Python tests with Gemini AI, set durations and schedules, and cross-check flagged questions.
          </p>
        </div>

        {/* Top Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Create Test with Gemini AI Button */}
          <button
            onClick={() => {
              setEditingTest(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Create Test with AI</span>
          </button>

          {/* Session Toggle */}
          <button
            onClick={handleToggleSession}
            disabled={isTogglingSession}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
              isSessionOpen
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSessionOpen ? (
              <>
                <PowerOff className="w-3.5 h-3.5 text-rose-400" />
                <span>Lock Portal</span>
              </>
            ) : (
              <>
                <Power className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Portal</span>
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
            className="flex items-center space-x-1.5 px-3 py-2 liquid-glass-pill hover:bg-white/[0.08] text-emerald-300 text-xs font-semibold rounded-xl transition disabled:opacity-40"
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

      {/* Flagged Questions Alert Banner if pending */}
      {pendingFlagsCount > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white block font-bold">
                {pendingFlagsCount} Question{pendingFlagsCount > 1 ? 's' : ''} Flagged by Students
              </strong>
              <span>Students reported questions that may require mentor verification or corrections.</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('flags')}
            className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition shrink-0"
          >
            Review & Correct Questions
          </button>
        </div>
      )}

      {/* Overview Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Created Tests</span>
          <div className="text-2xl font-black text-amber-300 font-mono">{mentorTestsList.length}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">
            {activeLiveTest ? '1 Test Live Now' : 'No Test Live (Idle)'}
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Registered Students</span>
          <div className="text-2xl font-black text-white font-mono">{registeredStudents.length}</div>
          <span className="text-[10px] text-slate-400 font-mono">
            Top Streak: {registeredStudents.length > 0 ? Math.max(...registeredStudents.map((s) => s.streak || 0)) : 0}d 🔥
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Flagged Questions</span>
          <div className={`text-2xl font-black font-mono ${pendingFlagsCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {pendingFlagsCount}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {pendingFlagsCount > 0 ? 'Action Needed' : 'All Clear ✓'}
          </span>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Submissions</span>
          <div className="text-2xl font-black text-blue-400 font-mono">{submittedCount}</div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {activeNow} Active in Exam
          </span>
        </div>
      </div>

      {/* Cohort Tabs Navigation */}
      <div className="liquid-glass rounded-3xl p-6 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'tests'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Tests Bank & AI Generator ({mentorTestsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flags')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'flags'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-rose-400" />
              <span>Flagged Questions ({pendingFlagsCount})</span>
              {pendingFlagsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('registered')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'registered'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students Progress ({registeredStudents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeTab === 'live'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Live Test Monitor ({students.length})</span>
            </button>
          </div>

          {activeTab === 'registered' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="pl-8 pr-3 py-1 liquid-glass-input rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 w-44"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Tests Bank & AI Generator */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Mentor Assessment Tests</h3>
                <p className="text-xs text-slate-400">
                  Every test is recorded in Firebase Firestore. You can activate any test for students or schedule future tests.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingTest(null);
                  setIsCreateModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Test with AI</span>
              </button>
            </div>

            {mentorTestsList.length === 0 ? (
              <div className="text-center py-16 liquid-glass-card rounded-2xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-bold text-white">No Mentor Tests Created Yet</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Create lightweight Python tests customized with Gemini AI. Set duration, date, scheduling, and choose 5, 10, 15, or 20 questions with 3 coding sessions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingTest(null);
                    setIsCreateModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  Create Your First Test with Gemini AI
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorTestsList.map((test) => {
                  const codingCount = (test.questions || []).filter((q) => q.type === 'coding_challenge').length;
                  return (
                    <div
                      key={test.id}
                      className={`liquid-glass-card p-5 rounded-2xl border transition space-y-4 ${
                        test.isLive
                          ? 'border-emerald-500/50 bg-emerald-950/15 shadow-xl shadow-emerald-950/30'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{test.title}</h4>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                test.isLive
                                  ? 'bg-emerald-500 text-slate-950 animate-pulse'
                                  : test.isScheduled
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {test.isLive ? '● Live Now' : test.isScheduled ? 'Scheduled' : 'Draft / Stored'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{test.topic}</p>
                        </div>
                      </div>

                      {/* Test Specs Summary */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-500 block text-[9px]">Questions</span>
                          <span className="text-white font-bold">{test.questions?.length || test.questionsCount || 20} Qs</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">Coding Tasks</span>
                          <span className="text-cyan-400 font-bold">{codingCount} Challenges</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[9px]">Duration</span>
                          <span className="text-amber-300 font-bold">{test.durationMinutes} mins</span>
                        </div>
                      </div>

                      {/* Date & Scheduling Info */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{test.date} at {test.time}</span>
                        </span>
                        <span>Recorded in Cloud ✓</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                        <button
                          type="button"
                          onClick={() => handleToggleTestLive(test)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            test.isLive
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          }`}
                        >
                          {test.isLive ? (
                            <>
                              <PowerOff className="w-3.5 h-3.5 text-rose-400" />
                              <span>Take Offline</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Make Live Now</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTest(test);
                              setIsCreateModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Cross-Check & Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTest(test.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                            title="Delete Test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Flagged Questions by Students */}
        {activeTab === 'flags' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">Student Flagged Questions Review</h3>
              <p className="text-xs text-slate-400">
                When students flag questions during exams, they appear here. Mentors can cross-check and edit the questions directly to fix errors in real-time.
              </p>
            </div>

            {flaggedQuestionsList.length === 0 ? (
              <div className="text-center py-16 liquid-glass-card rounded-2xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Flagged Questions</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Students have not flagged any questions. All assessment questions are verified.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedQuestionsList.map((flag) => {
                  const isResolved = flag.status === 'resolved';
                  return (
                    <div
                      key={flag.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        isResolved
                          ? 'border-slate-800 bg-slate-950/40 opacity-70'
                          : 'border-amber-500/40 bg-amber-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {flag.questionTitle || `Question ${flag.questionId}`}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                isResolved
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {isResolved ? 'Resolved ✓' : 'Flagged by Student'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">
                            Reported by: <strong className="text-amber-300">{flag.studentName}</strong> • {new Date(flag.flaggedAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!isResolved && (
                            <button
                              onClick={() => handleOpenFlaggedQuestion(flag)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Cross-Check & Correct</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 text-xs text-amber-200 font-mono">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold mb-0.5">
                          Student's Feedback:
                        </span>
                        "{flag.feedback}"
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Registered Students */}
        {activeTab === 'registered' && (
          <div>
            {registeredStudents.length === 0 ? (
              <div className="text-center py-16 liquid-glass-card rounded-2xl space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Students Registered Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Students will appear here as soon as they sign in with their name and start studying or taking tests.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {registeredStudents
                  .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
                  .map((student) => {
                    const completedCount = (student.completedModules || []).length;
                    const pct = Math.round((completedCount / 12) * 100);

                    return (
                      <div
                        key={student.id}
                        className="liquid-glass-card p-4 rounded-2xl border border-white/10 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400/20 to-blue-500/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-300 text-xs">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white">{student.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {student.id.substring(0, 14)}...
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>{student.streak || 1}d Streak</span>
                          </div>
                        </div>

                        {/* Metrics Bar */}
                        <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-slate-400">Curriculum Progress:</span>
                            <span className="text-amber-300 font-bold">{completedCount} / 12 ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1 border-t border-white/[0.05]">
                            <span>Tests Taken: <strong className="text-white">{student.totalTestsTaken || 0}</strong></span>
                            <span>Highest: <strong className="text-emerald-400">{student.highestScore ? `${Math.round(student.highestScore)}%` : '—'}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-mono">
                          <span className="flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>{student.pin ? 'Protected by PIN' : 'No PIN'}</span>
                          </span>
                          <span>Active: {student.lastActiveDate || 'Today'}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Live Test Attempts */}
        {activeTab === 'live' && (
          <div>
            {students.length === 0 ? (
              <div className="text-center py-16 liquid-glass-card rounded-2xl space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">Ready for Today's Cohort</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  No students are currently taking the test. Send the test link and PIN (<code className="text-amber-300 font-mono">0000</code>) to your students to begin.
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

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSubmitted
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
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

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Progress</span>
                          <span>{answeredCount} / {student.totalPossible}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (answeredCount / student.totalPossible) * 100)}%`
                            }}
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
        )}
      </div>

      {/* Student Details Inspector Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Create / Edit Test Modal */}
      {isCreateModalOpen && (
        <TestCreationModal
          initialTest={editingTest}
          onSaveTest={async (saved) => {
            await saveMentorTest(saved);
          }}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTest(null);
          }}
        />
      )}

      {/* Single Question Editor Modal for Cross-Checking & Flag Resolution */}
      {selectedQuestionForEdit && (
        <QuestionEditorModal
          question={selectedQuestionForEdit.question}
          flag={selectedQuestionForEdit.flag}
          onSave={handleSaveQuestionUpdate}
          onClose={() => setSelectedQuestionForEdit(null)}
        />
      )}
    </div>
  );
};
