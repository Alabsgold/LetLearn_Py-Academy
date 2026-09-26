import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EvaluationResult } from '../utils/analytics';
import { TEST_QUESTIONS } from '../data/testQuestions';
import { TestQuestion } from '../types';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Terminal,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  ChevronDown
} from 'lucide-react';

interface StudentResultViewProps {
  studentName: string;
  evaluation: EvaluationResult;
  questions?: TestQuestion[];
  onReviewStudy: () => void;
  onPracticeLab: () => void;
  onRetake: () => void;
}

export const StudentResultView: React.FC<StudentResultViewProps> = ({
  studentName,
  evaluation,
  questions,
  onReviewStudy,
  onPracticeLab,
  onRetake
}) => {
  const activeQuestions = questions && questions.length > 0 ? questions : TEST_QUESTIONS;
  useEffect(() => {
    // Fire celebratory confetti if student scored >= 60%
    if (evaluation.percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [evaluation.percentage]);

  const getGrade = (pct: number) => {
    if (pct >= 90) return { letter: 'A+', label: 'Outstanding Python Mastery!', color: 'text-amber-400' };
    if (pct >= 80) return { letter: 'A', label: 'Excellent Comprehension', color: 'text-emerald-400' };
    if (pct >= 70) return { letter: 'B', label: 'Good Effort - Solid Progress', color: 'text-blue-400' };
    if (pct >= 50) return { letter: 'C', label: 'Pass - Revision Needed', color: 'text-orange-400' };
    return { letter: 'D', label: 'Further Study Recommended', color: 'text-rose-400' };
  };

  const gradeInfo = getGrade(evaluation.percentage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Result Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Assessment Result • LetLearn_Py</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Congratulations, {studentName}!
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            You have completed today's 1-Hour Python List & Functions Assessment. Here is your comprehensive evaluation.
          </p>
        </div>

        {/* Score Card Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto relative z-10">
          <div className="liquid-glass-card p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Final Score
            </span>
            <span className="text-3xl font-black text-white font-mono">
              {evaluation.score} <span className="text-slate-500 text-lg">/ {evaluation.totalPossible}</span>
            </span>
          </div>

          <div className="liquid-glass-card p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Percentage
            </span>
            <span className={`text-3xl font-black font-mono ${gradeInfo.color}`}>
              {evaluation.percentage}%
            </span>
          </div>

          <div className="liquid-glass-card p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cohort Grade
            </span>
            <span className={`text-3xl font-black font-mono ${gradeInfo.color}`}>
              {gradeInfo.letter}
            </span>
          </div>
        </div>

        <p className={`text-sm font-semibold relative z-10 ${gradeInfo.color}`}>
          {gradeInfo.label}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 relative z-10">
          <button
            onClick={onReviewStudy}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Study Notes</span>
          </button>
          <button
            onClick={onPracticeLab}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-amber-300 font-semibold text-xs transition"
          >
            <Terminal className="w-4 h-4" />
            <span>Practice in Lab</span>
          </button>
          <button
            onClick={onRetake}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-slate-300 font-semibold text-xs transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* Analytics Breakdown: Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Improvement Areas */}
        <div className="liquid-glass rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <h3>Targeted Areas to Improve</h3>
          </div>
          <p className="text-xs text-slate-400">
            Based on your test responses, here are specific concepts to review:
          </p>

          <ul className="space-y-2.5">
            {evaluation.improvementAreas.map((area: string, idx: number) => (
              <li
                key={idx}
                className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-xs text-rose-200/90 flex items-start space-x-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topic Mastery Progress Bars */}
        <div className="liquid-glass rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <h3>Topic Performance Breakdown</h3>
          </div>
          <p className="text-xs text-slate-400">
            Your accuracy across each core module of the agenda:
          </p>

          <div className="space-y-3">
            {Object.entries(evaluation.topicBreakdown).map(([category, stats]: [string, any]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{category}</span>
                  <span className="font-mono text-slate-400">
                    {stats.correct}/{stats.total} ({stats.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.percentage >= 80
                        ? 'bg-emerald-500'
                        : stats.percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive Question Review & Pedagogical Explanations */}
      <div className="liquid-glass rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Detailed Question Review & Explanations</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review every answer with full teacher explanations.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeQuestions.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {activeQuestions.map((q, idx) => {
            const result = evaluation.questionResults[q.id];
            const isCorrect = result?.correct;

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition ${
                  isCorrect
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-rose-950/20 border-rose-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Question {idx + 1} • {q.topic}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{q.title}</h4>
                      <p className="text-xs text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                        {q.prompt}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isCorrect
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {isCorrect ? '+1 Mark' : '0 Mark'}
                  </span>
                </div>

                {q.codeSnippet && (
                  <pre className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto">
                    {q.codeSnippet}
                  </pre>
                )}

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Your Submission:</span>
                    <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {String(result?.studentAnswer || '(No answer provided)')}
                    </span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase block mb-0.5">Correct Answer:</span>
                    <span className="text-emerald-400 font-bold">
                      {String(q.correctAnswer)}
                    </span>
                  </div>
                </div>

                {/* Teacher Explanation */}
                <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400 text-[11px] block uppercase tracking-wider">
                    Teacher's Explanation:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
