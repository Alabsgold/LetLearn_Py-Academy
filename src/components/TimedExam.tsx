import React, { useState, useEffect } from 'react';
import { TEST_QUESTIONS } from '../data/testQuestions';
import { TestQuestion } from '../types';
import { evaluateStudentSubmission } from '../utils/analytics';
import { runPythonCode } from '../utils/pythonRunner';
import { StudentResultView } from './StudentResultView';
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
  Radio
} from 'lucide-react';

interface TimedExamProps {
  onGoToStudy: () => void;
  onGoToLab: () => void;
}

const TOTAL_TIME_SECONDS = 3600; // 1 hour

export const TimedExam: React.FC<TimedExamProps> = ({ onGoToStudy, onGoToLab }) => {
  // Session verification states
  const [isSessionOpen, setIsSessionOpen] = useState<boolean>(true);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);

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
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME_SECONDS);
  const [codeSubmissions, setCodeSubmissions] = useState<
    Record<string, { code: string; passed: boolean; testOutput?: string }>
  >({});

  // Coding challenge state
  const [activeCode, setActiveCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isTestingCode, setIsTestingCode] = useState<boolean>(false);

  // Results
  const [finalEvaluation, setFinalEvaluation] = useState<any>(null);

  // 1. Fetch Session Status on mount & poll
  const checkServerSession = async () => {
    try {
      const res = await fetch('/api/test/session-status');
      if (res.ok) {
        const data = await res.json();
        setIsSessionOpen(data.isOpen);
      }
    } catch (e) {
      console.warn('Session check failed', e);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    checkServerSession();
    const interval = setInterval(checkServerSession, 4000);
    return () => clearInterval(interval);
  }, []);

  // 2. Load stored session if active
  useEffect(() => {
    try {
      const saved = localStorage.getItem('letlearn_py_student_live_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentName && parsed.studentId) {
          setStudentName(parsed.studentName);
          setStudentId(parsed.studentId);
          setAnswers(parsed.answers || {});
          setCodeSubmissions(parsed.codeSubmissions || {});
          setFlaggedQuestions(new Set(parsed.flagged || []));

          if (parsed.startedAt && !parsed.isSubmitted) {
            const elapsed = Math.floor((Date.now() - parsed.startedAt) / 1000);
            const remaining = Math.max(0, TOTAL_TIME_SECONDS - elapsed);
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
  }, []);

  const currentQ: TestQuestion = TEST_QUESTIONS[currentQuestionIndex];

  // Set starter code for coding challenge
  useEffect(() => {
    if (currentQ?.type === 'coding_challenge') {
      const existing = codeSubmissions[currentQ.id]?.code;
      setActiveCode(existing || currentQ.starterCode || '');
      setCodeOutput(codeSubmissions[currentQ.id]?.testOutput || '');
      setCodeError(null);
    }
  }, [currentQuestionIndex]);

  // 3. Countdown timer
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

  // 4. Live sync heartbeat
  useEffect(() => {
    if (!isTestStarted || isSubmitted || !studentId) return;

    const sendHeartbeat = async () => {
      try {
        const evalSnapshot = evaluateStudentSubmission(answers, codeSubmissions);
        await fetch('/api/test/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            name: studentName,
            timeRemainingSeconds: timeRemaining,
            answers,
            currentScore: evalSnapshot.score,
            totalPossible: evalSnapshot.totalPossible,
            codeSubmissions
          })
        });

        localStorage.setItem(
          'letlearn_py_student_live_session',
          JSON.stringify({
            studentName,
            studentId,
            answers,
            codeSubmissions,
            flagged: Array.from(flaggedQuestions),
            startedAt: Date.now() - (TOTAL_TIME_SECONDS - timeRemaining) * 1000,
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
  }, [isTestStarted, isSubmitted, answers, codeSubmissions, timeRemaining]);

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

    const newId = `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setStudentId(newId);
    setIsTestStarted(true);
    setTimeRemaining(TOTAL_TIME_SECONDS);

    // Initial heartbeat
    fetch('/api/test/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: newId,
        name: studentName.trim(),
        startedAt: Date.now(),
        timeRemainingSeconds: TOTAL_TIME_SECONDS,
        answers: {},
        currentScore: 0,
        totalPossible: TEST_QUESTIONS.length,
        codeSubmissions: {}
      })
    }).catch(console.error);

    localStorage.setItem(
      'letlearn_py_student_live_session',
      JSON.stringify({
        studentName: studentName.trim(),
        studentId: newId,
        startedAt: Date.now(),
        answers: {},
        codeSubmissions: {},
        flagged: [],
        isSubmitted: false
      })
    );
  };

  const handleSelectOption = (key: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) next.delete(currentQ.id);
      else next.add(currentQ.id);
      return next;
    });
  };

  const handleTestCode = () => {
    if (!currentQ.testCases) return;
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
    const evaluation = evaluateStudentSubmission(answers, codeSubmissions);
    setFinalEvaluation(evaluation);
    setIsSubmitted(true);

    try {
      await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          name: studentName,
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

    localStorage.setItem(
      'letlearn_py_student_live_session',
      JSON.stringify({
        studentName,
        studentId,
        answers,
        codeSubmissions,
        flagged: Array.from(flaggedQuestions),
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
    setTimeRemaining(TOTAL_TIME_SECONDS);
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
              Assessment Session Closed
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your instructor has not opened today's test session yet. Once the session is opened, this screen will unlock automatically.
            </p>
          </div>

          <div className="liquid-glass-card p-4 rounded-2xl text-xs text-slate-400 space-y-1">
            <div className="text-amber-300 font-semibold">Ready for your test?</div>
            <div>Student Access PIN will be: <code className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">0000</code></div>
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

  // Case 2: Session is OPEN -> PIN Entry & Name screen
  if (!isTestStarted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-amber-500/20 border border-white/10 mx-auto flex items-center justify-center text-white shadow-lg">
              <Clock className="w-7 h-7 text-amber-300" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Today's Assessment
            </h1>
            <p className="text-xs text-slate-400">
              1-Hour Timed Python Lists & Core Functions Test
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
                  placeholder="e.g. Chidinma Okeke or Tunde"
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
                <span className="text-[10px] text-amber-300/80 font-mono">Use PIN: 0000</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  maxLength={4}
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Start 1-Hour Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500">
            Cohort Assessment • Live sync to mentor active
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Post-Test Results
  if (isSubmitted && finalEvaluation) {
    return (
      <StudentResultView
        studentName={studentName}
        evaluation={finalEvaluation}
        onReviewStudy={onGoToStudy}
        onPracticeLab={onGoToLab}
        onRetake={handleRetakeTest}
      />
    );
  }

  // Case 4: Active Exam
  const answeredCount = Object.keys(answers).length + Object.keys(codeSubmissions).filter(k => codeSubmissions[k].passed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Sticky Liquid Glass Top Bar */}
      <div className="liquid-glass rounded-2xl p-3 sm:p-3.5 shadow-xl flex items-center justify-between sticky top-16 sm:top-20 z-30 gap-2">
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-bold text-xs shrink-0">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="text-xs font-bold text-white truncate max-w-[100px] sm:max-w-none">{studentName}</span>
              <span className="flex items-center text-[10px] text-emerald-400 shrink-0">
                <Radio className="w-2.5 h-2.5 mr-1 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Q{currentQuestionIndex + 1} of {TEST_QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* 1-Hour Countdown & Submit */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs font-bold liquid-glass-pill ${
            timeRemaining <= 300 ? 'text-rose-400 border-rose-500/50 animate-pulse' : 'text-emerald-400 border-emerald-500/30'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Submit your test answers now to the mentor?')) {
                handleSubmitTest();
              }
            }}
            className="px-3 sm:px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-1 min-h-[36px]"
          >
            <Send className="w-3 h-3" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Question Selector Palette Drawer */}
      <div className="liquid-glass rounded-2xl p-3 sm:p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Question Palette</span>
          <span className="font-mono text-amber-300">{answeredCount} of {TEST_QUESTIONS.length} Answered</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-1.5">
          {TEST_QUESTIONS.map((q, idx) => {
            const hasAns = q.type === 'coding_challenge'
              ? Boolean(codeSubmissions[q.id]?.passed)
              : answers[q.id] !== undefined;
            const isFlagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentQuestionIndex;

            let cls = 'bg-slate-900/60 text-slate-400 border-white/[0.08] hover:bg-white/[0.08]';
            if (hasAns) cls = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
            if (isFlagged) cls = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
            if (isCurrent) cls = 'ring-2 ring-blue-500 bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30';

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-8 sm:h-7 text-xs font-mono rounded-lg border transition active:scale-95 flex items-center justify-center ${cls}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
            {currentQ.topicCategory}
          </span>

          <button
            onClick={handleToggleFlag}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs border transition ${
              flaggedQuestions.has(currentQ.id)
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="text-[11px]">{flaggedQuestions.has(currentQ.id) ? 'Flagged' : 'Flag'}</span>
          </button>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">{currentQ.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {currentQ.prompt}
          </p>
        </div>

        {/* Code Snippet Box */}
        {currentQ.codeSnippet && (
          <div className="rounded-2xl overflow-hidden bg-black/50 border border-white/10 p-3.5 text-xs font-mono text-slate-200">
            <pre className="overflow-x-auto leading-relaxed">{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options */}
        {currentQ.options && (
          <div className="space-y-2 pt-1">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'liquid-glass-card hover:bg-white/[0.04] text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[11px] uppercase shrink-0 mt-0.5 border ${
                    isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/40 text-slate-400 border-white/10'
                  }`}>
                    {opt.key}
                  </div>
                  <span className="text-xs font-mono leading-relaxed">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Coding Challenge Box */}
        {currentQ.type === 'coding_challenge' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Write Python solution:</span>
              <button
                onClick={() => {
                  setActiveCode(currentQ.starterCode || '');
                  setCodeOutput('');
                  setCodeError(null);
                }}
                className="hover:text-amber-400 flex items-center space-x-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Code</span>
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <div className="px-4 py-2 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400">solution.py</span>
                <button
                  onClick={handleTestCode}
                  disabled={isTestingCode}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isTestingCode ? 'Running...' : 'Run & Test'}</span>
                </button>
              </div>

              <textarea
                value={activeCode}
                onChange={(e) => setActiveCode(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {codeSubmissions[currentQ.id] && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                codeSubmissions[currentQ.id].passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="font-bold flex items-center space-x-1.5">
                  {codeSubmissions[currentQ.id].passed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Code passed the test case!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>Test not passed yet. Output: {codeOutput}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-1 px-3 py-2 liquid-glass-pill text-xs font-semibold text-slate-300 hover:text-white transition disabled:opacity-40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentQuestionIndex < TEST_QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(TEST_QUESTIONS.length - 1, prev + 1))}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Submit test answers?')) {
                  handleSubmitTest();
                }
              }}
              className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Assessment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
