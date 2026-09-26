import React, { useState } from 'react';
import { TestQuestion, FlaggedQuestion } from '../types';
import { X, Save, AlertTriangle, Check, Code2, HelpCircle } from 'lucide-react';

interface QuestionEditorModalProps {
  question: TestQuestion;
  flag?: FlaggedQuestion | null;
  onSave: (updated: TestQuestion) => Promise<void>;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  flag,
  onSave,
  onClose
}) => {
  const [edited, setEdited] = useState<TestQuestion>({ ...question });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleOptionChange = (idx: number, label: string) => {
    if (!edited.options) return;
    const newOptions = [...edited.options];
    newOptions[idx] = { ...newOptions[idx], label };
    setEdited({ ...edited, options: newOptions });
  };

  const handleCorrectAnswerChange = (val: string) => {
    setEdited({ ...edited, correctAnswer: val });
  };

  const handleTestCaseChange = (idx: number, field: 'expected' | 'description', value: string) => {
    if (!edited.testCases) return;
    const newCases = [...edited.testCases];
    newCases[idx] = { ...newCases[idx], [field]: value };
    setEdited({ ...edited, testCases: newCases });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(edited);
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Failed to save question edits:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cross-Check & Edit Question</h2>
              <p className="text-xs text-slate-400">
                {edited.type === 'coding_challenge'
                  ? 'Python Coding Session Challenge'
                  : edited.type === 'snippet_output'
                  ? 'Code Snippet Output Analysis'
                  : 'Multiple Choice Concept Question'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If opened from a flagged question report */}
        {flag && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-sm text-amber-300">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Student Flag Report from {flag.studentName}:</span>
            </div>
            <p className="text-xs text-amber-200/90 pl-6 italic">"{flag.feedback}"</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Question Title
            </label>
            <input
              type="text"
              value={edited.title}
              onChange={(e) => setEdited({ ...edited, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Topic & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subtopic
              </label>
              <input
                type="text"
                value={edited.topic}
                onChange={(e) => setEdited({ ...edited, topic: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Topic Category
              </label>
              <input
                type="text"
                value={edited.topicCategory}
                onChange={(e) => setEdited({ ...edited, topicCategory: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Question Prompt / Description
            </label>
            <textarea
              rows={3}
              value={edited.prompt}
              onChange={(e) => setEdited({ ...edited, prompt: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Code Snippet if applicable */}
          {(edited.type === 'snippet_output' || edited.codeSnippet) && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Python Code Snippet
              </label>
              <textarea
                rows={3}
                value={edited.codeSnippet || ''}
                onChange={(e) => setEdited({ ...edited, codeSnippet: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Multiple Choice Options */}
          {edited.options && edited.options.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Options & Correct Answer Selection
              </label>
              <div className="space-y-2">
                {edited.options.map((opt, idx) => {
                  const isChecked = edited.correctAnswer.toLowerCase() === opt.key.toLowerCase();
                  return (
                    <div
                      key={opt.key}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition ${
                        isChecked
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-slate-800 bg-slate-950/60'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`opt_${opt.key}`}
                        name="correctAnswerRadio"
                        checked={isChecked}
                        onChange={() => handleCorrectAnswerChange(opt.key)}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase w-4">
                        {opt.key})
                      </span>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-2 py-1 bg-transparent border-0 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-400 rounded"
                      />
                      {isChecked && (
                        <span className="text-[10px] font-bold text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-500/20">
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Coding Challenge Starter Code & Test Cases */}
          {edited.type === 'coding_challenge' && (
            <div className="space-y-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Coding Session Parameters</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Starter Python Code Template
                </label>
                <textarea
                  rows={4}
                  value={edited.starterCode || ''}
                  onChange={(e) => setEdited({ ...edited, starterCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Expected Console Output
                  </label>
                  <input
                    type="text"
                    value={edited.correctAnswer}
                    onChange={(e) => setEdited({ ...edited, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-400"
                    placeholder="e.g. 42 or [1, 2, 3]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Test Case Description
                  </label>
                  <input
                    type="text"
                    value={edited.testCases?.[0]?.description || ''}
                    onChange={(e) => handleTestCaseChange(0, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Extracts 42 from inner list"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Explanation & Tip */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Explanation for Students
              </label>
              <textarea
                rows={2}
                value={edited.explanation}
                onChange={(e) => setEdited({ ...edited, explanation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Improvement Tip (Shown on Review)
              </label>
              <input
                type="text"
                value={edited.improvementTip}
                onChange={(e) => setEdited({ ...edited, improvementTip: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving Changes...</span>
              ) : savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Question Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
