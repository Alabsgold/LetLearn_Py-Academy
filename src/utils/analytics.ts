import { TEST_QUESTIONS } from '../data/testQuestions';
import { TestQuestion } from '../types';

export interface EvaluationResult {
  score: number;
  totalPossible: number;
  percentage: number;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  improvementAreas: string[];
  strengths: string[];
  questionResults: Record<string, { correct: boolean; studentAnswer: any; expectedAnswer: string; tip: string }>;
}

export function evaluateStudentSubmission(
  answers: Record<string, any>,
  codeSubmissions?: Record<string, { code: string; passed: boolean; testOutput?: string }>,
  questions?: TestQuestion[]
): EvaluationResult {
  const activeQuestions = questions && questions.length > 0 ? questions : TEST_QUESTIONS;
  let score = 0;
  const totalPossible = activeQuestions.length;
  const questionResults: Record<string, any> = {};

  const topicTotals: Record<string, { correct: number; total: number }> = {};

  const improvementAreasMap: Map<string, string> = new Map();
  const strengthsMap: Map<string, string> = new Map();

  for (const q of activeQuestions) {
    const category = q.topicCategory || 'General Assessment';
    if (!topicTotals[category]) {
      topicTotals[category] = { correct: 0, total: 0 };
    }
    topicTotals[category].total += 1;

    let isCorrect = false;

    if (q.type === 'coding_challenge') {
      const codeSub = codeSubmissions?.[q.id];
      if (codeSub && codeSub.passed) {
        isCorrect = true;
      }
    } else {
      const studentAns = answers[q.id];
      if (studentAns !== undefined && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      score += 1;
      topicTotals[category].correct += 1;
      strengthsMap.set(q.topic, `Mastered ${q.topic}`);
    } else {
      improvementAreasMap.set(q.topic, q.improvementTip);
    }

    questionResults[q.id] = {
      correct: isCorrect,
      studentAnswer: q.type === 'coding_challenge' ? codeSubmissions?.[q.id]?.code : answers[q.id],
      expectedAnswer: q.correctAnswer,
      tip: q.improvementTip
    };
  }

  const topicBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};
  for (const [cat, data] of Object.entries(topicTotals)) {
    topicBreakdown[cat] = {
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    };
  }

  const percentage = Math.round((score / totalPossible) * 100);

  // Pick top 3-4 improvement areas
  const improvementAreas = Array.from(improvementAreasMap.values()).slice(0, 4);
  if (improvementAreas.length === 0) {
    improvementAreas.push('Outstanding performance! Ready for advanced Python topics & Dictionaries!');
  }

  // Pick top 3 strengths
  const strengths = Array.from(strengthsMap.values()).slice(0, 4);
  if (strengths.length === 0) {
    strengths.push('Beginning foundational review');
  }

  return {
    score,
    totalPossible,
    percentage,
    topicBreakdown,
    improvementAreas,
    strengths,
    questionResults
  };
}

export function downloadCohortCsv(students: any[]) {
  const headers = [
    'Student Name',
    'Status',
    'Score',
    'Max Score',
    'Percentage (%)',
    'Time Taken (mins)',
    'Questions Answered',
    'Strengths',
    'Areas for Improvement',
    'Submitted At'
  ];

  const escapeField = (val: any) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = students.map(s => {
    const answeredCount = Object.keys(s.answers || {}).length;
    const timeTaken = s.submittedAt 
      ? Math.max(1, Math.round((s.submittedAt - s.startedAt) / 60000))
      : Math.round((Date.now() - s.startedAt) / 60000);

    const submitDate = s.submittedAt ? new Date(s.submittedAt).toLocaleString() : 'In Progress';
    const strengths = (s.strengths || []).join('; ') || 'N/A';
    const improve = (s.improvementAreas || []).join('; ') || 'None (Excellent)';

    return [
      escapeField(s.name),
      escapeField(s.status === 'submitted' ? 'Submitted' : 'In Progress'),
      s.score,
      s.totalPossible || 18,
      `${s.percentage}%`,
      timeTaken,
      `${answeredCount}/${s.totalPossible || 18}`,
      escapeField(strengths),
      escapeField(improve),
      escapeField(submitDate)
    ].join(',');
  });

  const csvString = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LetLearn_Py_Cohort_Results_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
