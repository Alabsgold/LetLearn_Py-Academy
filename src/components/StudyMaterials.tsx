import React, { useState, useEffect } from 'react';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { StudyModule } from '../types';
import { runPythonCode } from '../utils/pythonRunner';
import {
  Search,
  Code2,
  AlertTriangle,
  Check,
  BookOpen,
  Layers,
  Terminal,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  BookmarkCheck,
  ListOrdered,
  ArrowRight,
  Lightbulb,
  TableProperties
} from 'lucide-react';

interface StudyMaterialsProps {
  onOpenInLab: (code: string) => void;
  onStartTest: () => void;
}

export const StudyMaterials: React.FC<StudyMaterialsProps> = ({ onOpenInLab, onStartTest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSectionId, setActiveSectionId] = useState<string>(CURRICULUM_MODULES[0].sectionId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-line code runner output state per module
  const [runningOutputs, setRunningOutputs] = useState<Record<string, { output: string; error?: string }>>({});
  const [isRunningSnippet, setIsRunningSnippet] = useState<string | null>(null);

  // Student progress: completed modules stored in localStorage
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  // Quick Quiz selection state per module: { [moduleId]: { selectedIdx: number, answered: boolean } }
  const [quizStates, setQuizStates] = useState<Record<string, { selectedIdx: number; answered: boolean }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('letlearn_py_completed_topics');
      if (saved) {
        setCompletedModules(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }, []);

  const toggleModuleCompletion = (modId: string) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      localStorage.setItem('letlearn_py_completed_topics', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const categories = [
    'All',
    'Lists in Python',
    'List Methods',
    'Input & Data Handling',
    'Loops & Iteration',
    'Manipulating Lists',
    'Advanced List Techniques',
    'Dictionaries Preview'
  ];

  const filteredModules = CURRICULUM_MODULES.filter(mod => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.keyPoints.some(kp => kp.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mod.codeExample.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Run snippet right inside the study card
  const handleRunInlineSnippet = (code: string, modId: string) => {
    setIsRunningSnippet(modId);
    setTimeout(() => {
      const res = runPythonCode(code);
      setRunningOutputs(prev => ({
        ...prev,
        [modId]: {
          output: res.output,
          error: res.error
        }
      }));
      setIsRunningSnippet(null);
    }, 150);
  };

  const handleQuizAnswer = (modId: string, optIdx: number) => {
    setQuizStates(prev => ({
      ...prev,
      [modId]: {
        selectedIdx: optIdx,
        answered: true
      }
    }));
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const completedPct = Math.round((completedModules.size / CURRICULUM_MODULES.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Welcome & Orientation Hero */}
      <div className="relative overflow-hidden rounded-3xl liquid-glass p-5 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LetLearn_Py • Official Study Guide</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Python Lists & Core Foundations
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Carefully organized study materials for our cohort. Covers list creation, mutability, positive & negative indexing, built-in methods (<code className="text-amber-300 font-mono text-xs">append</code>, <code className="text-amber-300 font-mono text-xs">insert</code>, <code className="text-amber-300 font-mono text-xs">extend</code>), user <code className="text-amber-300 font-mono text-xs">input()</code> typecasting, <code className="text-amber-300 font-mono text-xs">split()</code> with <code className="text-amber-300 font-mono text-xs">for</code> loops, slicing, removing items, and list comprehensions.
            </p>

            {/* Study Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Your Study Progress:</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {completedModules.size} of {CURRICULUM_MODULES.length} reviewed ({completedPct}%)
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-white/[0.08]">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completedPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={onStartTest}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition active:scale-95 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Take Today's Test (1h)</span>
            </button>
            <button
              onClick={() => onOpenInLab('# Write and practice any Python code\nmyList = [1, "string", 9.10]\nprint("Initial list:", myList)')}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-amber-300 font-semibold text-xs sm:text-sm transition min-h-[44px]"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Python Lab</span>
            </button>
          </div>
        </div>

        {/* Ambient lighting effect */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Visual Reference Cards: Indexing and Methods CheatSheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card 1: Visual Indexing & Negative Indexing */}
        <div className="liquid-glass rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Visual Blueprint: Positive vs Negative Indexing</h2>
          </div>
          <p className="text-xs text-slate-300">
            In Python, positive indexing starts at <code className="text-emerald-400 font-mono">0</code> on the left. Negative indexing starts at <code className="text-blue-400 font-mono">-1</code> at the very end and counts backwards:
          </p>

          <div className="bg-black/40 border border-white/[0.08] rounded-2xl p-4 overflow-x-auto space-y-2">
            {/* Positive index */}
            <div className="flex items-center space-x-2 min-w-[340px]">
              <span className="w-24 text-[10px] font-mono font-bold text-emerald-400 uppercase">Positive Index:</span>
              <div className="grid grid-cols-4 gap-2 flex-1 font-mono text-xs">
                {['0', '1', '2', '3'].map(i => (
                  <div key={i} className="text-center bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 py-1 rounded-lg font-bold">
                    {i}
                  </div>
                ))}
              </div>
            </div>

            {/* Elements */}
            <div className="flex items-center space-x-2 min-w-[340px]">
              <span className="w-24 text-[10px] font-mono font-bold text-amber-300 uppercase">List Items:</span>
              <div className="grid grid-cols-4 gap-2 flex-1 font-mono text-xs">
                {['"apple"', '100', '9.10', '[1, 2]'].map((val, i) => (
                  <div key={i} className="text-center liquid-glass-card text-white py-2 rounded-lg font-bold shadow-sm">
                    {val}
                  </div>
                ))}
              </div>
            </div>

            {/* Negative index */}
            <div className="flex items-center space-x-2 min-w-[340px]">
              <span className="w-24 text-[10px] font-mono font-bold text-blue-400 uppercase">Negative Index:</span>
              <div className="grid grid-cols-4 gap-2 flex-1 font-mono text-xs">
                {['-4', '-3', '-2', '-1'].map(i => (
                  <div key={i} className="text-center bg-blue-500/10 text-blue-300 border border-blue-500/20 py-1 rounded-lg font-bold">
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Essential List Methods Comparison Table */}
        <div className="liquid-glass rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <TableProperties className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Methods Quick-Lookup: Arguments & Behavior</h2>
          </div>
          <p className="text-xs text-slate-300">
            Keep these strict argument rules in mind for test questions and coding exercises:
          </p>

          <div className="bg-black/40 border border-white/[0.08] rounded-2xl overflow-x-auto text-xs">
            <div className="min-w-[360px]">
              <div className="grid grid-cols-3 bg-white/[0.02] p-2 font-mono text-[11px] font-bold text-slate-400 border-b border-white/[0.06]">
                <span>Method</span>
                <span>Arguments</span>
                <span>Effect & Placement</span>
              </div>
              <div className="divide-y divide-white/[0.04] font-mono text-[11px]">
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span className="text-amber-400 font-bold">append(x)</span>
                  <span>Strictly 1 arg</span>
                  <span className="text-slate-400">Adds item to the end</span>
                </div>
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span className="text-amber-400 font-bold">insert(idx, x)</span>
                  <span>2 args (index, val)</span>
                  <span className="text-slate-400">Inserts at position</span>
                </div>
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span className="text-amber-400 font-bold">extend(list)</span>
                  <span>1 arg (iterable)</span>
                  <span className="text-slate-400">Appends all items</span>
                </div>
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span className="text-amber-400 font-bold">pop(idx?)</span>
                  <span>0 or 1 index arg</span>
                  <span className="text-emerald-400">Removes & RETURNS</span>
                </div>
                <div className="grid grid-cols-3 p-2 text-slate-200">
                  <span className="text-amber-400 font-bold">remove(val)</span>
                  <span>1 value arg</span>
                  <span className="text-slate-400">Removes by value</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Sidebar Table of Contents + Main Study Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Sidebar: Navigation & Topic Tracker (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="liquid-glass rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <span>Topics ({CURRICULUM_MODULES.length})</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {completedModules.size} Done
                </span>
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="lg:hidden text-xs text-amber-400 font-semibold px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20"
                >
                  {mobileTocOpen ? 'Hide Topics' : 'Show Topics'}
                </button>
              </div>
            </div>

            {/* Quick Search & Category Filter */}
            <div className={`space-y-2 ${mobileTocOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics or methods..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 liquid-glass-input rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-xs text-amber-300 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {categories.map(c => (
                  <option key={c} value={c} className="bg-slate-900 text-white">Category: {c}</option>
                ))}
              </select>

              {/* Topic Navigation Links */}
              <div className="space-y-1 max-h-[380px] lg:max-h-[460px] overflow-y-auto pr-1">
                {filteredModules.map((mod, idx) => {
                  const isCompleted = completedModules.has(mod.id);
                  const isActive = activeSectionId === mod.sectionId;

                  return (
                    <div
                      key={mod.id}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer group ${
                        isActive
                          ? 'liquid-glass-pill border-amber-400/30 text-amber-300 font-semibold'
                          : 'hover:bg-white/[0.04] text-slate-300'
                      }`}
                      onClick={() => {
                        scrollToSection(mod.sectionId);
                        setMobileTocOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-5 h-5 rounded-md bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate font-medium">{mod.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModuleCompletion(mod.id);
                        }}
                        title={isCompleted ? 'Marked as reviewed' : 'Click to mark as reviewed'}
                        className={`p-1 rounded transition shrink-0 ml-1 ${
                          isCompleted ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-emerald-950 text-emerald-400' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content: Comprehensive Topic Modules (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {filteredModules.length === 0 ? (
            <div className="text-center py-16 liquid-glass rounded-3xl p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                No study topics matched "{searchTerm}".
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset search & categories
              </button>
            </div>
          ) : (
            filteredModules.map((module) => {
              const isCompleted = completedModules.has(module.id);
              const inlineRes = runningOutputs[module.id];
              const quizState = quizStates[module.id];

              return (
                <article
                  key={module.id}
                  id={module.sectionId}
                  className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition scroll-mt-24"
                >
                  {/* Topic Header & Category Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          {module.category}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>Reviewed</span>
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-black text-white mt-1.5">
                        {module.title}
                      </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleModuleCompletion(module.id)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'liquid-glass-pill text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
                      </button>

                      <button
                        onClick={() => onOpenInLab(module.codeExample)}
                        title="Send code to interactive Python Lab"
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Lab</span>
                      </button>
                    </div>
                  </div>

                  {/* Beginner Note / Plain English Analogy */}
                  {module.beginnerNote && (
                    <div className="flex items-start space-x-3 bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-2xl text-blue-200/90 text-xs leading-relaxed">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-blue-300 font-bold block mb-0.5">Plain English Explanation:</strong>
                        <span>{module.beginnerNote}</span>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {module.summary}
                  </p>

                  {/* Key Takeaways & Agenda Points */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Key Rules & Agenda Concepts</span>
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 text-xs">
                      {module.keyPoints.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2.5 bg-slate-950/70 border border-slate-800/90 p-3 rounded-xl text-slate-200 leading-relaxed font-sans"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Code Snippet with Live Inline Terminal Runner */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold">Code Example:</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyCode(module.codeExample, module.id)}
                          className="hover:text-white flex items-center space-x-1 text-[11px] p-1"
                        >
                          {copiedId === module.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>

                        <button
                          onClick={() => handleRunInlineSnippet(module.codeExample, module.id)}
                          disabled={isRunningSnippet === module.id}
                          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition active:scale-95 disabled:opacity-50 min-h-[30px]"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isRunningSnippet === module.id ? 'Running...' : 'Run Code'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Code Container */}
                    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 text-xs font-mono p-4 text-slate-200 shadow-inner">
                      <pre className="overflow-x-auto leading-relaxed whitespace-pre font-mono">
                        {module.codeExample}
                      </pre>
                    </div>

                    {/* In-card Execution Output Terminal */}
                    {inlineRes && (
                      <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 font-mono text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                            <Terminal className="w-3 h-3" />
                            <span>Output Result</span>
                          </span>
                          <span>Python 3.12 Emulator</span>
                        </div>
                        {inlineRes.error ? (
                          <div className="text-rose-400 whitespace-pre-wrap">{inlineRes.error}</div>
                        ) : (
                          <div className="text-emerald-300 whitespace-pre-wrap">{inlineRes.output}</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Test Trap / Gotcha Alert Box */}
                  {module.testGotcha && (
                    <div className="flex items-start space-x-3 bg-amber-950/20 border border-amber-700/40 p-4 rounded-2xl text-amber-200 text-xs leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 font-bold">Common Exam Trap & Gotcha: </strong>
                        <span>{module.testGotcha}</span>
                      </div>
                    </div>
                  )}

                  {/* Interactive Quick Knowledge Check Quizlet */}
                  {module.quickQuiz && (
                    <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                        <HelpCircle className="w-4 h-4" />
                        <span>Quick Knowledge Check</span>
                      </div>
                      <p className="text-xs text-white font-medium">
                        {module.quickQuiz.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {module.quickQuiz.options.map((opt, optIdx) => {
                          const isSelected = quizState?.selectedIdx === optIdx;
                          const isCorrect = optIdx === module.quickQuiz?.correctIndex;
                          const answered = quizState?.answered;

                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';
                          if (answered) {
                            if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-bold';
                            else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-300';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(module.id, optIdx)}
                              className={`p-2.5 rounded-xl border text-xs text-left transition font-mono ${btnStyle}`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizState?.answered && (
                        <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                          <strong className={quizState.selectedIdx === module.quickQuiz.correctIndex ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {quizState.selectedIdx === module.quickQuiz.correctIndex ? '✓ Correct! ' : 'Explanation: '}
                          </strong>
                          {module.quickQuiz.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
