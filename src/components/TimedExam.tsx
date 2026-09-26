import React, { useState, useEffect } from 'react';
import { TestQuestion, MentorTest } from '../types';
import { evaluateStudentSubmission } from '../utils/analytics';
import { runPythonCode } from '../utils/pythonRunner';
import { StudentResultView } from './StudentResultView';
import { getStoredStudent, recordStudentTestScore } from '../services/studentService';
import { subscribeToActiveTest, submitFlaggedQuestion, parseScheduledDateTime, setTestLiveStatus } from '../services/testService';
import {
  Clock,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  Send,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Hourglass,
  Radio,
  Calendar,
  Terminal,
  BookOpen,
  Code2,
  X,
  MessageSquare
} from 'lucide-react';

interface TimedExamProps {
  onGoToStudy: () => void;
  onGoToLab: () => void;
}

export const TimedExam: React.FC<TimedExamProps> = ({ onGoToStudy, onGoToLab }) => {
  // Active test from Firestore / API
  const [activeTest, setActiveTest] = useState<MentorTest | null>(null);
  const [upcomingTest, setUpcomingTest] = useState<MentorTest | null>(null);
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(true);
  const [scheduledCountdown, setScheduledCountdown] = useState<number | null>(null);

  // Scheduled test auto-activation countdown
  useEffect(() => {
    if (activeTest || !upcomingTest || !upcomingTest.date || !upcomingTest.time) {
      setScheduledCountdown(null);
      return;
    }

    const checkScheduledTime = () => {
      const scheduledEpoch = parseScheduledDateTime(upcomingTest.date, upcomingTest.time);
      if (!scheduledEpoch) return;

      const diffSecs = Math.floor((scheduledEpoch - Date.now()) / 1000);
      if (diffSecs <= 0) {
        // Scheduled time has arrived! Auto-activate immediately!
        setTestLiveStatus(upcomingTest.id, true).catch(() => {});
        setActiveTest({ ...upcomingTest, isLive: true, isScheduled: false });
        setUpcomingTest(null);
        setScheduledCountdown(null);
      } else {
        setScheduledCountdown(diffSecs);
      }
    };

    checkScheduledTime();
    const interval = setInterval(checkScheduledTime, 1000);
    return () => clearInterval(interval);
  }, [upcomingTest, activeTest]);

  // Session verification states
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);

  // Student authentication
  const [studentName, setStudentName] = useState<string>('');
  const [studentPin, setStudentPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>('');

  // Test progression
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number>(3600);
  const [codeSubmissions, setCodeSubmissions] = useState<
    Record<string, { code: string; passed: boolean; testOutput?: string }>
  >({});

  // Flag Question modal
  const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
  const [flagFeedback, setFlagFeedback] = useState<string>('');
  const [isSubmittingFlag, setIsSubmittingFlag] = useState<boolean>(false);
  const [flagSuccessMsg, setFlagSuccessMsg] = useState<string | null>(null);

  // Coding challenge state
  const [activeCode, setActiveCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isTestingCode, setIsTestingCode] = useState<boolean>(false);

  // Results
  const [finalEvaluation, setFinalEvaluation] = useState<any>(null);

  // 1. Subscribe to Active Test from Firebase & Server
  useEffect(() => {
    const unsub = subscribeToActiveTest((test) => {
      setActiveTest(test);
      setIsLoadingTest(false);
    });

    // Also check server API for upcoming scheduled tests
    fetch('/api/test/active-test')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeTest) {
          setActiveTest(data.activeTest);
        }
        if (data.upcomingTest) {
          setUpcomingTest(data.upcomingTest);
        }
      })
      .catch((err) => console.warn('Active test check notice:', err))
      .finally(() => setIsLoadingTest(false));

    return () => unsub();
  }, []);

  // 2. Fetch Session Status on mount & poll
  const checkServerSession = async () => {
    try {
      const res = await fetch('/api/test/session-status');
      if (res.ok) {
        const data = await res.json();
        setIsSessionOpen(data.isOpen);
      }
    } catch (e) {
      console.warn('Session check failed', e);
    }
  };

  useEffect(() => {
    checkServerSession();
    const interval = setInterval(() => {
      if (!document.hidden) {
        checkServerSession();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 3. Load stored session if active or prefill logged in student
  useEffect(() => {
    try {
      const stored = getStoredStudent();
      if (stored?.name && !studentName) {
        setStudentName(stored.name);
      }

      const saved = localStorage.getItem('letlearn_py_student_live_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentName && parsed.studentId) {
          setStudentName(parsed.studentName);
          setStudentId(parsed.studentId);
          setAnswers(parsed.answers || {});
          setCodeSubmissions(parsed.codeSubmissions || {});
          setFlaggedQuestions(new Set(parsed.flagged || []));

          const allocatedTime = (activeTest?.durationMinutes || 60) * 60;
          if (parsed.startedAt && !parsed.isSubmitted) {
            const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000);
            const remaining = Math.max(0, allocatedTime - elapsed);
            setTimeRemaining(remaining);
            setIsTestStarted(true);
            if (remaining === 0) {
              handleSubmitTest();
            }
          } else if (parsed.isSubmitted && parsed.finalEvaluation) {
            setIsTestStarted(true);
            setIsSubmitted(true);
            setFinalEvaluation(parsed.finalEvaluation);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTest]);

  const questionsList: TestQuestion[] = activeTest?.questions || [];
  const currentQ: TestQuestion | undefined = questionsList[currentQuestionIndex];

  // Set starter code for coding challenge
  useEffect(() => {
    if (currentQ?.type === 'coding_challenge') {
      const existing = codeSubmissions[currentQ.id]?.code;
      setActiveCode(existing || currentQ.starterCode || '');
      setCodeOutput(codeSubmissions[currentQ.id]?.testOutput || '');
      setCodeError(null);
    }
  }, [currentQuestionIndex, currentQ]);

  // 4. Countdown timer
  useEffect(() => {
    if (!isTestStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isSubmitted]);

  // 5. Live sync heartbeat
  useEffect(() => {
    if (!isTestStarted || isSubmitted || !studentId) return;

    const sendHeartbeat = async () => {
      try {
        const evalSnapshot = evaluateStudentSubmission(answers, codeSubmissions, questionsList);
        await fetch('/api/test/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            name: studentName,
            testId: activeTest?.id,
            timeRemainingSeconds: timeRemaining,
            answers,
            currentScore: evalSnapshot.score,
            totalPossible: evalSnapshot.totalPossible,
            codeSubmissions
          })
        });

        const allocatedTime = (activeTest?.durationMinutes || 60) * 60;
        localStorage.setItem(
          'letlearn_py_student_live_session',
          JSON.stringify({
            studentName,
            studentId,
            testId: activeTest?.id,
            answers,
            codeSubmissions,
            flagged: Array.from(flaggedQuestions),
            startedAt: Date.now() - (allocatedTime - timeRemaining) * 1000,
            isSubmitted: false
          })
        );
      } catch (err) {
        console.warn('Sync notice:', err);
      }
    };

    const interval = setInterval(sendHeartbeat, 4000);
    const timeout = setTimeout(sendHeartbeat, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isTestStarted, isSubmitted, answers, codeSubmissions, timeRemaining, activeTest, questionsList]);

  const handleStartWithPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    if (!studentName.trim()) {
      setPinError('Please enter your full name');
      return;
    }

    if (studentPin.trim() !== '0000') {
      setPinError('Invalid Student Access PIN. Expected: 0000');
      return;
    }

    const allocatedTime = (activeTest?.durationMinutes || 60) * 60;
    const newId = `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setStudentId(newId);
    setIsTestStarted(true);
    setTimeRemaining(allocatedTime);

    // Initial heartbeat
    fetch('/api/test/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: newId,
        name: studentName.trim(),
        testId: activeTest?.id,
        startedAt: Date.now(),
        timeRemainingSeconds: allocatedTime,
        answers: {},
        currentScore: 0,
        totalPossible: questionsList.length || 20,
        codeSubmissions: {}
      })
    }).catch(console.error);

    localStorage.setItem(
      'letlearn_py_student_live_session',
      JSON.stringify({
        studentName: studentName.trim(),
        studentId: newId,
        testId: activeTest?.id,
        startedAt: Date.now(),
        answers: {},
        codeSubmissions: {},
        flagged: [],
        isSubmitted: false
      })
    );
  };

  const handleSelectOption = (key: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  // Open flag modal
  const handleOpenFlagModal = () => {
    setFlagFeedback('');
    setFlagSuccessMsg(null);
    setIsFlagModalOpen(true);
  };

  // Submit flag with student notes
  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ) return;
    setIsSubmittingFlag(true);

    try {
      await submitFlaggedQuestion({
        testId: activeTest?.id || 'test_current',
        testTitle: activeTest?.title || 'Python Assessment',
        questionId: currentQ.id,
        questionTitle: currentQ.title,
        studentName: studentName.trim() || 'Student',
        feedback: flagFeedback.trim() || 'Student flagged this question for mentor review.'
      });

      setFlaggedQuestions((prev) => new Set(prev).add(currentQ.id));
      setFlagSuccessMsg('Report sent to mentor! Thank you for helping keep questions accurate.');
      setTimeout(() => {
        setIsFlagModalOpen(false);
        setFlagSuccessMsg(null);
      }, 1500);
    } catch (err) {
      console.error('Flag error:', err);
    } finally {
      setIsSubmittingFlag(false);
    }
  };

  const handleTestCode = () => {
    if (!currentQ?.testCases) return;
    setIsTestingCode(true);
    setCodeError(null);

    setTimeout(() => {
      const execResult = runPythonCode(activeCode);
      const userOutput = execResult.output.trim();
      let passed = false;
      const expected = currentQ.correctAnswer.trim();

      if (userOutput.includes(expected) || userOutput === expected) {
        passed = true;
      }

      setCodeOutput(userOutput);
      if (execResult.error) {
        setCodeError(execResult.error);
        passed = false;
      }

      setCodeSubmissions((prev) => ({
        ...prev,
        [currentQ.id]: {
          code: activeCode,
          passed,
          testOutput: userOutput
        }
      }));

      setIsTestingCode(false);
    }, 150);
  };

  const handleSubmitTest = async () => {
    const evaluation = evaluateStudentSubmission(answers, codeSubmissions, questionsList);
    setFinalEvaluation(evaluation);
    setIsSubmitted(true);

    try {
      await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          name: studentName,
          testId: activeTest?.id,
          answers,
          score: evaluation.score,
          totalPossible: evaluation.totalPossible,
          percentage: evaluation.percentage,
          topicBreakdown: evaluation.topicBreakdown,
          improvementAreas: evaluation.improvementAreas,
          strengths: evaluation.strengths,
          codeSubmissions
        })
      });
    } catch (err) {
      console.error(err);
    }

    // Record score to student's persistent Firebase profile
    const currentStudent = getStoredStudent();
    if (currentStudent?.id) {
      recordStudentTestScore(currentStudent.id, evaluation.score, evaluation.percentage);
    }

    const allocatedTime = (activeTest?.durationMinutes || 60) * 60;
    localStorage.setItem(
      'letlearn_py_student_live_session',
      JSON.stringify({
        studentName,
        studentId,
        testId: activeTest?.id,
        answers,
        codeSubmissions,
        flagged: Array.from(flaggedQuestions),
        startedAt: Date.now() - (allocatedTime - timeRemaining) * 1000,
        isSubmitted: true,
        finalEvaluation: evaluation
      })
    );
  };

  const handleRetakeTest = () => {
    localStorage.removeItem('letlearn_py_student_live_session');
    setAnswers({});
    setCodeSubmissions({});
    setFlaggedQuestions(new Set());
    setTimeRemaining((activeTest?.durationMinutes || 60) * 60);
    setIsSubmitted(false);
    setIsTestStarted(false);
    setFinalEvaluation(null);
    setCurrentQuestionIndex(0);
    setStudentPin('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Case 1: Session is CLOSED by instructor
  if (!isTestStarted && !isSessionOpen) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="liquid-glass rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-400">
            <Hourglass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Assessment Portal Closed
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your instructor has paused or locked the exam portal. Once the session is re-opened, this screen will unlock automatically.
            </p>
          </div>

          <div className="liquid-glass-card p-4 rounded-2xl text-xs text-slate-400 space-y-1">
            <div className="text-amber-300 font-semibold">Ready for your test?</div>
            <div>Student Access PIN: <code className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">0000</code></div>
          </div>

          <button
            onClick={checkServerSession}
            className="w-full py-2.5 liquid-glass-pill hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition"
          >
            Check Session Again
          </button>
        </div>
      </div>
    );
  }

  // Case 2: No active live test available from mentor
  if (!isTestStarted && !activeTest) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-blue-500/20 border border-amber-400/30 mx-auto flex items-center justify-center text-amber-400 shadow-xl">
            {upcomingTest ? <Calendar className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>

          <div className="space-y-3">
            {upcomingTest ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase">
                  <span>Upcoming Scheduled Assessment</span>
                </div>
                <h1 className="text-2xl font-black text-white">{upcomingTest.title}</h1>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Topic: <strong className="text-white">{upcomingTest.topic}</strong>
                  <br />
                  Scheduled for <strong>{upcomingTest.date}</strong> at <strong>{upcomingTest.time}</strong> • Duration: {upcomingTest.durationMinutes} mins
                </p>

                {scheduledCountdown !== null && scheduledCountdown > 0 && (
                  <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl max-w-sm mx-auto space-y-1 shadow-lg shadow-cyan-950/50">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 font-bold flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>Auto-Launches In:</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-cyan-400 tracking-wider">
                      {Math.floor(scheduledCountdown / 3600) > 0 ? (
                        `${String(Math.floor(scheduledCountdown / 3600)).padStart(2, '0')}:${String(Math.floor((scheduledCountdown % 3600) / 60)).padStart(2, '0')}:${String(scheduledCountdown % 60).padStart(2, '0')}`
                      ) : (
                        `${String(Math.floor(scheduledCountdown / 60)).padStart(2, '0')}:${String(scheduledCountdown % 60).padStart(2, '0')}`
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      The test will automatically unlock the second this timer hits 0.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h1 className="text-2xl font-black text-white">No Active Test Right Now</h1>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your mentor hasn't scheduled or launched a test yet. You can review topics or experiment in the coding lab in the meantime!
                </p>
              </>
            )}
          </div>

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onGoToStudy}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Study Materials</span>
            </button>
            <button
              onClick={onGoToLab}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 text-xs font-bold transition"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Python Practice Lab</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Test is Live -> PIN Entry & Name screen
  if (!isTestStarted) {
    const codingChallengesCount = questionsList.filter((q) => q.type === 'coding_challenge').length;
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-blue-500/20 border border-amber-400/30 mx-auto flex items-center justify-center text-white shadow-lg">
              <Clock className="w-7 h-7 text-amber-300" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {activeTest?.title || 'Python Assessment'}
            </h1>
            <p className="text-xs text-slate-300">
              {activeTest?.durationMinutes || 60}-Minute Timed Exam • {questionsList.length} Questions ({codingChallengesCount} Coding Sessions)
            </p>
          </div>

          <form onSubmit={handleStartWithPin} className="space-y-4">
            {pinError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pinError}</span>
              </div>
            )}

            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chidinma or Tunde"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            {/* Student PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Student PIN
                </label>
                <span className="text-[10px] text-amber-400/80">Default: 0000</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="0000"
                  value={studentPin}
                  onChange={(e) => setStudentPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 font-mono tracking-widest text-center text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[11px] text-slate-500 text-center">
            Your mentor can monitor your progress in real-time as you solve challenges.
          </div>
        </div>
      </div>
    );
  }

  // Case 4: Final Evaluation View
  if (isSubmitted && finalEvaluation) {
    return (
      <StudentResultView
        studentName={studentName}
        evaluation={finalEvaluation}
        questions={questionsList}
        onReviewStudy={onGoToStudy}
        onPracticeLab={onGoToLab}
        onRetake={handleRetakeTest}
      />
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-md mx-auto py-20 text-center text-slate-400">
        Loading test questions...
      </div>
    );
  }

  // Case 5: Active Test In Progress
  const isAnswered = currentQ.type === 'coding_challenge'
    ? Boolean(codeSubmissions[currentQ.id]?.passed)
    : answers[currentQ.id] !== undefined;

  const isFlagged = flaggedQuestions.has(currentQ.id);
  const totalQuestions = questionsList.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Test Banner & Timer Bar */}
      <div className="liquid-glass rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {activeTest?.title || 'Live Assessment'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Student: <strong className="text-white">{studentName}</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            {currentQ.title}
          </h2>
        </div>

        {/* Timer, Flag and Submit Controls */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold ${
            timeRemaining < 300
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-black/40 text-amber-300 border-white/10'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          {/* Student Flag Question Button */}
          <button
            onClick={handleOpenFlagModal}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isFlagged
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'liquid-glass-pill hover:bg-white/[0.08] text-slate-300'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
            <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you ready to submit your test? You will see your detailed breakdown immediately.')) {
                handleSubmitTest();
              }
            }}
            className="flex items-center space-x-1 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Question Workspace */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Question Header & Category */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question {currentQuestionIndex + 1} of {totalQuestions} • {currentQ.topicCategory}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
            currentQ.type === 'coding_challenge'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : currentQ.type === 'snippet_output'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            {currentQ.type === 'coding_challenge'
              ? 'Python Coding Session'
              : currentQ.type === 'snippet_output'
              ? 'Snippet Analysis'
              : 'Multiple Choice'}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-4">
          <p className="text-base sm:text-lg text-slate-100 font-medium whitespace-pre-line leading-relaxed">
            {currentQ.prompt}
          </p>

          {/* Code Snippet for Snippet Output */}
          {currentQ.codeSnippet && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto shadow-inner">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Question Interaction: Options OR Coding Challenge */}
        {currentQ.type === 'coding_challenge' ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 font-mono">
                <Terminal className="w-4 h-4" />
                <span>Interactive Python Code Session</span>
              </div>
              <button
                onClick={handleTestCode}
                disabled={isTestingCode}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTestingCode ? 'Running...' : 'Run Python Code'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={activeCode}
              onChange={(e) => setActiveCode(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl font-mono text-xs text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              placeholder="Write your Python solution here..."
            />

            {/* Test Output Console */}
            <div className="p-3.5 bg-black/60 rounded-xl border border-white/5 space-y-1 font-mono text-xs">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Console Output</div>
              <div className="text-emerald-400 min-h-[1.5rem] whitespace-pre-wrap">
                {codeOutput || <span className="text-slate-600 italic">Click "Run Python Code" to execute test cases</span>}
              </div>
              {codeError && <div className="text-rose-400 mt-1">{codeError}</div>}
              {codeSubmissions[currentQ.id]?.passed && (
                <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Test Case Passed! Target matched expected output.</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Multiple Choice / Snippet Output Options */
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options?.map((opt) => {
              const selected = answers[currentQ.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                    selected
                      ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/5'
                      : 'border-white/10 hover:border-white/20 bg-slate-900/60'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    selected
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-700 text-slate-400'
                  }`}>
                    {opt.key.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-100 font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 liquid-glass-pill hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono text-slate-500">
            {Object.keys(answers).length + Object.keys(codeSubmissions).filter(k => codeSubmissions[k]?.passed).length} of {totalQuestions} answered
          </span>

          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="flex items-center space-x-1.5 px-4 py-2 liquid-glass-pill hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition disabled:opacity-30"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Progress Tray */}
      <div className="liquid-glass rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>Question Navigation Grid</span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span>Answered</span></span>
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span>Flagged</span></span>
            <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" /><span>Unanswered</span></span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questionsList.map((q, idx) => {
            const hasAnswer = q.type === 'coding_challenge'
              ? codeSubmissions[q.id]?.passed
              : answers[q.id] !== undefined;
            const flagged = flaggedQuestions.has(q.id);
            const isCurrent = currentQuestionIndex === idx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center relative ${
                  isCurrent
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : ''
                } ${
                  flagged
                    ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                    : hasAnswer
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Flag Question Dialog Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Flag Question {currentQuestionIndex + 1}</h3>
              </div>
              <button
                onClick={() => setIsFlagModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {flagSuccessMsg ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 space-y-2">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <p>{flagSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFlag} className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Notice an issue with Question {currentQuestionIndex + 1} ({currentQ.title})? Let your mentor know what needs checking.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Your Observation / Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={flagFeedback}
                    onChange={(e) => setFlagFeedback(e.target.value)}
                    placeholder="e.g. Option C says print instead of return, or the prompt wording is ambiguous..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFlagModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFlag}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                  >
                    {isSubmittingFlag ? 'Sending Flag...' : 'Send Flag to Mentor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
