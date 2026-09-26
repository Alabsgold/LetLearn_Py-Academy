import React, { useState } from 'react';
import { MentorTest, TestQuestion } from '../types';
import { QuestionEditorModal } from './QuestionEditorModal';
import {
  Sparkles,
  Calendar,
  Clock,
  Code2,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
  Edit3,
  Trash2,
  Plus,
  Play,
  Save,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers
} from 'lucide-react';

interface TestCreationModalProps {
  onSaveTest: (test: MentorTest) => Promise<void>;
  onClose: () => void;
  initialTest?: MentorTest | null;
}

export const TestCreationModal: React.FC<TestCreationModalProps> = ({
  onSaveTest,
  onClose,
  initialTest
}) => {
  // Wizard steps: 'configure' -> 'review'
  const [step, setStep] = useState<'configure' | 'review'>('configure');

  // Form Fields
  const [testTitle, setTestTitle] = useState<string>(
    initialTest?.title || 'Python Lists & Methods Assessment'
  );
  const [topic, setTopic] = useState<string>(
    initialTest?.topic || 'Python Lists, Indexing, Slicing, and Mutability'
  );
  const [extraInstructions, setExtraInstructions] = useState<string>(
    initialTest?.extraInstructions ||
      'Focus on negative index slicing, append vs extend, and nested list structures.'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const [testDate, setTestDate] = useState<string>(initialTest?.date || todayStr);
  const [testTime, setTestTime] = useState<string>(initialTest?.time || '10:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialTest?.durationMinutes || 60
  );
  const [isScheduled, setIsScheduled] = useState<boolean>(
    initialTest?.isScheduled ?? false
  );
  const [isLive, setIsLive] = useState<boolean>(initialTest?.isLive ?? true);
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15 | 20>(
    (initialTest?.questionsCount as any) || 20
  );

  // Questions State
  const [questions, setQuestions] = useState<TestQuestion[]>(
    initialTest?.questions || []
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{
    q: TestQuestion;
    index: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Topic suggestion chips
  const suggestedTopics = [
    'Python Lists, Indexing & Slicing',
    'List Methods (append, pop, sort, extend)',
    'List Mutability, Aliasing & Memory',
    'List Comprehensions & Conditional Filtering',
    'Nested Multi-Dimensional Lists',
    'Python Dictionaries, Keys & Values',
    'Functions, Scope & Return Values'
  ];

  // AI Generation Trigger
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const res = await fetch('/api/test/generate-ai-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          extraInstructions,
          questionCount,
          testName: testTitle,
          durationMinutes
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setStep('review');
      } else {
        throw new Error('Invalid questions received');
      }
    } catch (err: any) {
      console.error('AI Generation error:', err);
      setAiError(err.message || 'Failed to generate test. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Update a single question from editor modal
  const handleSaveQuestionEdit = async (updated: TestQuestion) => {
    if (editingQuestion !== null) {
      const updatedList = [...questions];
      updatedList[editingQuestion.index] = updated;
      setQuestions(updatedList);
      setEditingQuestion(null);
    }
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    const next = questions.filter((_, i) => i !== index);
    setQuestions(next);
  };

  // Add a blank question
  const handleAddQuestion = () => {
    const newQ: TestQuestion = {
      id: `q_custom_${Date.now()}`,
      type: 'multiple_choice',
      topic: topic || 'Custom Topic',
      topicCategory: 'Custom',
      title: `Question ${questions.length + 1}: Custom Question`,
      prompt: 'Enter question prompt here...',
      options: [
        { key: 'a', label: 'Option A' },
        { key: 'b', label: 'Option B' },
        { key: 'c', label: 'Option C' },
        { key: 'd', label: 'Option D' }
      ],
      correctAnswer: 'a',
      explanation: 'Explanation for correct answer',
      improvementTip: 'Tip for review'
    };
    setQuestions([...questions, newQ]);
    setEditingQuestion({ q: newQ, index: questions.length });
  };

  // Save the entire test
  const handleFinalSave = async (makeLive: boolean) => {
    if (questions.length === 0) {
      setAiError('Please generate or add test questions before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const testRecord: MentorTest = {
        id: initialTest?.id || `test_${Date.now()}`,
        title: testTitle.trim() || 'Python Assessment',
        topic: topic.trim() || 'General Python',
        extraInstructions: extraInstructions.trim(),
        date: testDate,
        time: testTime,
        durationMinutes,
        isScheduled: !makeLive && isScheduled,
        isLive: makeLive,
        questionsCount: questions.length,
        questions,
        createdAt: initialTest?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveTest(testRecord);
      onClose();
    } catch (err: any) {
      console.error('Save test error:', err);
      setAiError(err.message || 'Failed to save test.');
    } finally {
      setIsSaving(false);
    }
  };

  const codingCount = questions.filter((q) => q.type === 'coding_challenge').length;
  const mcCount = questions.length - codingCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{initialTest ? 'Edit Assessment Test' : 'Create Assessment Test with Gemini AI'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Mentor Studio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lightweight, AI-crafted Python tests with real-time editing & 3 coding challenge sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Step toggle if questions exist */}
            {questions.length > 0 && (
              <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
                <button
                  onClick={() => setStep('configure')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    step === 'configure'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1. Settings
                </button>
                <button
                  onClick={() => setStep('review')}
                  className={`px-3 py-1 rounded-md transition font-medium ${
                    step === 'review'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2. Cross-Check ({questions.length})
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {aiError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {step === 'configure' ? (
            <div className="space-y-6">
              {/* Test Name & Topic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Test Name / Title
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="e.g. Python Lists & Loops Mastery Exam"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Topic of the Test
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Python Lists, Indexing, Slicing"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">
                  Quick Topic Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        topic === t
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Extra Focus / Subtopics (What Gemini AI should include)
                </label>
                <textarea
                  rows={3}
                  value={extraInstructions}
                  onChange={(e) => setExtraInstructions(e.target.value)}
                  placeholder="e.g. Include questions on negative indices, append vs extend, list comprehension with modulo filtering, and deep copy vs shallow copy."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Schedule, Date & Time, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Date of Test</span>
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    value={testTime}
                    onChange={(e) => setTestTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDurationMinutes(mins)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                          durationMinutes === mins
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Number of Questions Selector: 5, 10, 15, 20 with coding session guarantees */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Number of Questions Breakdown
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      count: 5,
                      label: '5 Questions',
                      desc: '3 Concept + 2 Coding Sessions',
                      badge: 'Quick Quiz'
                    },
                    {
                      count: 10,
                      label: '10 Questions',
                      desc: '7 Concept + 3 Coding Sessions',
                      badge: 'Topic Check'
                    },
                    {
                      count: 15,
                      label: '15 Questions',
                      desc: '12 Concept + 3 Coding Sessions',
                      badge: 'Standard'
                    },
                    {
                      count: 20,
                      label: '20 Questions',
                      desc: '17 Concept + 3 Coding Sessions',
                      badge: 'Comprehensive'
                    }
                  ].map((option) => (
                    <button
                      key={option.count}
                      type="button"
                      onClick={() => setQuestionCount(option.count as any)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        questionCount === option.count
                          ? 'border-amber-400 bg-amber-500/15 text-white shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-sm text-slate-100">
                          {option.label}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold ${
                            questionCount === option.count
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {option.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-300/90 font-medium">
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule vs Live Immediately Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold text-white">
                    Schedule Test for Future Date & Time?
                  </span>
                  <p className="text-xs text-slate-400">
                    If scheduled, students will see a countdown on the Test page until launch time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsScheduled(false);
                      setIsLive(true);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      !isScheduled && isLive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    Make Live Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsScheduled(true);
                      setIsLive(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      isScheduled
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    Schedule for {testDate}
                  </button>
                </div>
              </div>

              {/* Generate AI Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition disabled:opacity-60 cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Gemini AI is crafting your {questionCount} questions & 3 coding sessions...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>Generate {questionCount} Test Questions with Gemini AI</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  Gemini AI will read your topic and instructions, create questions with 3 coding sessions, and allow full mentor review and edits.
                </p>
              </div>
            </div>
          ) : (
            /* Review & Cross-Checking Step */
            <div className="space-y-5">
              {/* Review Header Banner */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{testTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      {questions.length} Questions Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Topic: {topic} • Duration: {durationMinutes} mins • {codingCount} Coding Sessions included
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('configure')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
                  >
                    Edit Settings
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isCoding = q.type === 'coding_challenge';
                  const isSnippet = q.type === 'snippet_output';
                  return (
                    <div
                      key={q.id || idx}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold font-mono text-slate-300 flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{q.title || `Question ${idx + 1}`}</h4>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                                  isCoding
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                    : isSnippet
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {isCoding ? 'Coding Session' : isSnippet ? 'Code Snippet' : 'Multiple Choice'}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">{q.topic}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingQuestion({ q, index: idx })}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Cross-Check & Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Prompt */}
                      <p className="text-xs text-slate-300 pl-8 whitespace-pre-line">{q.prompt}</p>

                      {/* Code Snippet preview */}
                      {q.codeSnippet && (
                        <div className="ml-8 p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-xs text-amber-300">
                          <pre>{q.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Options or Coding Test Case Summary */}
                      {q.options && q.options.length > 0 && (
                        <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt) => {
                            const isCorrect = q.correctAnswer?.toLowerCase() === opt.key?.toLowerCase();
                            return (
                              <div
                                key={opt.key}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                                }`}
                              >
                                <span className="font-mono text-[10px] uppercase text-slate-400 font-bold">
                                  {opt.key})
                                </span>
                                <span>{opt.label}</span>
                                {isCorrect && (
                                  <span className="ml-auto text-[9px] uppercase font-bold text-emerald-400">
                                    ✓ Correct
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Coding challenge preview */}
                      {isCoding && (
                        <div className="ml-8 p-2.5 bg-cyan-950/30 rounded-lg border border-cyan-800/40 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-cyan-300">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <span>Expected Output: <strong className="font-mono text-emerald-400">{q.correctAnswer}</strong></span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {q.testCases?.[0]?.description || 'Automated Python Evaluation'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {step === 'review' && (
              <span>
                Verified: {questions.length} Questions ({codingCount} Coding Sessions, {mcCount} Multiple Choice)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            {step === 'review' && (
              <>
                <button
                  type="button"
                  onClick={() => handleFinalSave(false)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition"
                >
                  Save as Scheduled / Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSave(true)}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Publish & Make Live Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Single Question Editor Modal for Cross-Checking */}
      {editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion.q}
          onSave={handleSaveQuestionEdit}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
};
