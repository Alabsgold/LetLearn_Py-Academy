import React from 'react';
import { StudentSession } from '../types';
import { TEST_QUESTIONS } from '../data/testQuestions';
import {
  X,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Code2,
  Award
} from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentSession;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const answeredCount = Object.keys(student.answers || {}).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="liquid-glass rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-bold text-blue-300 shrink-0 text-sm">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{student.name}</h3>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    student.status === 'submitted'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {student.status === 'submitted' ? 'Submitted' : 'Taking Test Live'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Score: <strong className="text-amber-300 font-mono">{student.score} / {student.totalPossible}</strong> ({student.percentage}%) • Answered: {answeredCount}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white liquid-glass-pill rounded-xl transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Improvement Areas */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Identified Improvement Areas</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(student.improvementAreas || []).length > 0 ? (
                  student.improvementAreas.map((area, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No specific weak areas detected yet.</li>
                )}
              </ul>
            </div>

            {/* Strengths */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Mastered Topics & Strengths</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(student.strengths || []).length > 0 ? (
                  student.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Evaluating strengths...</li>
                )}
              </ul>
            </div>
          </div>

          {/* Detailed Question by Question Inspection */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              Detailed Question Responses ({TEST_QUESTIONS.length} Questions)
            </h4>

            <div className="space-y-2">
              {TEST_QUESTIONS.map((q, idx) => {
                let isCorrect = false;
                let studentAns: any = student.answers?.[q.id];

                if (q.type === 'coding_challenge') {
                  const codeSub = student.codeSubmissions?.[q.id];
                  isCorrect = Boolean(codeSub?.passed);
                  studentAns = codeSub?.code || '(No code run yet)';
                } else {
                  isCorrect = studentAns !== undefined && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                }

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-900/40'
                        : studentAns
                        ? 'bg-rose-950/20 border-rose-900/40'
                        : 'bg-slate-950/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : studentAns ? (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                            -
                          </div>
                        )}
                        <span className="font-bold text-white">Q{idx + 1}: {q.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {q.topicCategory}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Student Input:</span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          {String(studentAns || 'Unanswered')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Correct Key:</span>
                        <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
