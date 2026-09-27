import React, { useState, useEffect } from 'react';
import { CURRICULUM_MODULES, LEARNING_TRACKS } from '../data/curriculumData';
import { StudyModule, MentorTest } from '../types';
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
  TableProperties,
  Clock,
  Calendar,
  Compass,
  GraduationCap,
  Target,
  ExternalLink,
  Flame,
  CheckSquare
} from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { getStoredStudent, syncStudentModules } from '../services/studentService';
import { formatDurationLabel, subscribeToActiveTest } from '../services/testService';

interface StudyMaterialsProps {
  onOpenInLab: (code: string) => void;
  onStartTest: () => void;
  onOpenLabBriefing?: () => void;
  activeTest?: MentorTest | null;
}

export const StudyMaterials: React.FC<StudyMaterialsProps> = ({
  onOpenInLab,
  onStartTest,
  onOpenLabBriefing,
  activeTest: propActiveTest
}) => {
  const [internalActiveTest, setInternalActiveTest] = useState<MentorTest | null>(propActiveTest || null);

  useEffect(() => {
    if (propActiveTest !== undefined) {
      setInternalActiveTest(propActiveTest);
      return;
    }
    const unsub = subscribeToActiveTest((test) => {
      setInternalActiveTest(test);
    });
    return () => unsub();
  }, [propActiveTest]);

  const currentActiveTest = propActiveTest !== undefined ? propActiveTest : internalActiveTest;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [activeSectionId, setActiveSectionId] = useState<string>(CURRICULUM_MODULES[0]?.sectionId || 'day-01-introduction');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tab state per day card: 'tutorial' | 'exercises'
  const [cardTabs, setCardTabs] = useState<Record<string, 'tutorial' | 'exercises'>>({});

  // In-line code runner output state per module
  const [runningOutputs, setRunningOutputs] = useState<Record<string, { output: string; error?: string }>>({});
  const [isRunningSnippet, setIsRunningSnippet] = useState<string | null>(null);

  // Student progress: completed modules stored in localStorage & Firebase
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
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(modId)) {
        next.delete(modId);
      } else {
        next.add(modId);
      }
      const list = Array.from(next);
      localStorage.setItem('letlearn_py_completed_topics', JSON.stringify(list));

      // Sync to Firebase in real-time
      const currentStudent = getStoredStudent();
      if (currentStudent?.id) {
        syncStudentModules(currentStudent.id, list);
      }

      return next;
    });
  };

  const handleMarkAllCompleted = () => {
    const allIds = CURRICULUM_MODULES.map((m) => m.id);
    setCompletedModules(new Set(allIds));
    localStorage.setItem('letlearn_py_completed_topics', JSON.stringify(allIds));

    const currentStudent = getStoredStudent();
    if (currentStudent?.id) {
      syncStudentModules(currentStudent.id, allIds);
    }
  };

  const handleResetProgress = () => {
    setCompletedModules(new Set());
    localStorage.removeItem('letlearn_py_completed_topics');

    const currentStudent = getStoredStudent();
    if (currentStudent?.id) {
      syncStudentModules(currentStudent.id, []);
    }
  };

  // Filter modules by Track and Search query
  const filteredModules = CURRICULUM_MODULES.filter((mod) => {
    const matchesTrack = selectedTrackId === 'all' || mod.track === selectedTrackId;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesTrack;

    const matchesSearch =
      mod.title.toLowerCase().includes(term) ||
      mod.summary.toLowerCase().includes(term) ||
      (mod.dayNumber && `day ${mod.dayNumber}`.includes(term)) ||
      mod.keyPoints.some((kp) => kp.toLowerCase().includes(term)) ||
      mod.codeExample.toLowerCase().includes(term);

    return matchesTrack && matchesSearch;
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
      setRunningOutputs((prev) => ({
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
    setQuizStates((prev) => ({
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

  const setCardActiveTab = (modId: string, tab: 'tutorial' | 'exercises') => {
    setCardTabs((prev) => ({ ...prev, [modId]: tab }));
  };

  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const completedPct = Math.round((completedModules.size / CURRICULUM_MODULES.length) * 100);

  // Quick stats by track
  const currentTrackObj = LEARNING_TRACKS.find((t) => t.id === selectedTrackId) || LEARNING_TRACKS[0];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. Premier Learning Platform Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl liquid-glass p-5 sm:p-8 shadow-2xl border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LetLearn_Py • Official 30 Days of Python Curriculum</span>
              </span>
              <span className="text-xs text-slate-400">
                Source: Asabeneh/30-Days-Of-Python
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              30 Days of Python Learning Platform
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              A comprehensive, industry-grade Python 3 curriculum. Travel step-by-step from fundamental syntax to Core Data Structures, Object-Oriented Programming, Regular Expressions, Data Analysis with NumPy & Pandas, and building Web APIs with Flask.
            </p>

            {/* Study Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Curriculum Mastery:</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {completedModules.size} of {CURRICULUM_MODULES.length} Days Mastered ({completedPct}%)
                </span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/[0.08]">
                <div
                  className="bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completedPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0">
            {currentActiveTest ? (
              <button
                onClick={onStartTest}
                className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition active:scale-95 min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  Take Today's Test {formatDurationLabel(currentActiveTest.durationMinutes) ? `(${formatDurationLabel(currentActiveTest.durationMinutes)})` : ''}
                </span>
              </button>
            ) : (
              <button
                onClick={onStartTest}
                title="No test currently active for today. Click to check test status or lobby."
                className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-slate-300 font-semibold text-xs sm:text-sm transition min-h-[44px] border border-white/10"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>No Test Today</span>
              </button>
            )}

            <button
              onClick={() => onOpenInLab('# Write and practice any Python code\nprint("Welcome to 30 Days of Python Playground!")\nnumbers = [x**2 for x in range(1, 11) if x % 2 == 0]\nprint("Even squares:", numbers)')}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-amber-300 font-semibold text-xs sm:text-sm transition min-h-[44px] border border-white/10"
            >
              <Terminal className="w-4 h-4" />
              <span>Open Python Lab</span>
            </button>

            {onOpenLabBriefing && (
              <button
                onClick={onOpenLabBriefing}
                className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl liquid-glass-pill hover:bg-white/[0.08] text-blue-300 font-semibold text-xs sm:text-sm transition min-h-[44px] border border-white/10"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Lab Entry Tips</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient lighting effect */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Visual Progress Ring Tracker */}
      <ProgressRing
        completedCount={completedModules.size}
        totalCount={CURRICULUM_MODULES.length}
        onMarkAll={handleMarkAllCompleted}
        onReset={handleResetProgress}
      />

      {/* 3. Five-Track Curriculum Learning Path Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Learning Tracks & Milestones</h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Select a track to focus your daily study
          </span>
        </div>

        {/* Track Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/[0.08]">
          {LEARNING_TRACKS.map((track) => {
            const isSelected = selectedTrackId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl text-left transition-all relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white shadow-md border border-white/20'
                    : 'hover:bg-white/[0.05] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-amber-300">
                  {track.daysRange}
                </span>
                <span className="text-xs font-bold truncate w-full mt-0.5">
                  {track.shortName}
                </span>
                <span className="text-[10px] opacity-75 font-mono">
                  {track.dayCount} Lessons
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main 2-Column Layout: Sidebar Table of Contents + Main Study Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Sidebar: 30-Day Index Navigator (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="liquid-glass rounded-3xl p-4 shadow-xl space-y-3 border border-white/10">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <span>30-Day Index ({filteredModules.length})</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {completedModules.size}/30 Done
                </span>
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(!mobileTocOpen)}
                  className="lg:hidden text-xs text-amber-400 font-semibold px-2 py-1 rounded bg-amber-400/10 border border-amber-400/20"
                >
                  {mobileTocOpen ? 'Hide Index' : 'Show Index'}
                </button>
              </div>
            </div>

            {/* Quick Search */}
            <div className={`space-y-2 ${mobileTocOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics, syntax, or Day #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 liquid-glass-input rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Day-by-Day Navigation Links */}
              <div className="space-y-1 max-h-[440px] lg:max-h-[520px] overflow-y-auto pr-1">
                {filteredModules.map((mod) => {
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
                        <span className="w-6 h-5 rounded-md bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-mono text-slate-400 shrink-0 font-bold">
                          D{mod.dayNumber ? String(mod.dayNumber).padStart(2, '0') : ''}
                        </span>
                        <span className="truncate font-medium">
                          {mod.title.replace(/^Day\s*\d+:\s*/i, '')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModuleCompletion(mod.id);
                        }}
                        title={isCompleted ? 'Marked as completed' : 'Click to mark as completed'}
                        className={`p-1 rounded transition shrink-0 ml-1 ${
                          isCompleted ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${isCompleted ? 'fill-emerald-950 text-emerald-400' : ''}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content: Comprehensive 30-Day Tutorials (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {filteredModules.length === 0 ? (
            <div className="text-center py-16 liquid-glass rounded-3xl p-8 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                No study topics matched "{searchTerm}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTrackId('all');
                }}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset search & show all 30 days
              </button>
            </div>
          ) : (
            filteredModules.map((module) => {
              const isCompleted = completedModules.has(module.id);
              const inlineRes = runningOutputs[module.id];
              const quizState = quizStates[module.id];
              const activeTab = cardTabs[module.id] || 'tutorial';

              return (
                <article
                  key={module.id}
                  id={module.sectionId}
                  className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 transition scroll-mt-24 border border-white/10"
                >
                  {/* Card Header: Day Badge, Track, Time Estimate, and Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {module.dayNumber && (
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                            DAY {String(module.dayNumber).padStart(2, '0')}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          {module.track || module.category}
                        </span>
                        {module.estimatedTime && (
                          <>
                            <span className="text-slate-600" aria-hidden="true">·</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{module.estimatedTime}</span>
                            </span>
                          </>
                        )}
                        {isCompleted && (
                          <span className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {module.title}
                      </h2>
                    </div>

                    {/* Completion & Lab Buttons */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => toggleModuleCompletion(module.id)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'liquid-glass-pill text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
                      </button>

                      <button
                        onClick={() => onOpenInLab(module.exerciseStarterCode || module.codeExample)}
                        title="Send code to interactive Python Lab"
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Open Lab</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Section Switcher: Tutorial & Code vs Graded Exercises */}
                  <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-xl w-fit">
                    <button
                      onClick={() => setCardActiveTab(module.id, 'tutorial')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                        activeTab === 'tutorial'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Tutorial & Code</span>
                    </button>

                    <button
                      onClick={() => setCardActiveTab(module.id, 'exercises')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                        activeTab === 'exercises'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      <span>Graded Exercises</span>
                      {module.exercises && (
                        <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.2 rounded-full">
                          {(module.exercises.level1?.length || 0) + (module.exercises.level2?.length || 0)}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* TAB 1: TUTORIAL & CODE CONTENT */}
                  {activeTab === 'tutorial' ? (
                    <div className="space-y-5">
                      {/* Plain English Mental Model */}
                      {module.beginnerNote && (
                        <div className="flex items-start space-x-3 bg-blue-500/10 border border-blue-500/20 p-3.5 rounded-2xl text-blue-200/90 text-xs leading-relaxed">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-blue-300 font-bold block mb-0.5">
                              Plain English Mental Model:
                            </strong>
                            <span>{module.beginnerNote}</span>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <p className="text-sm text-slate-300 leading-relaxed font-normal">
                        {module.summary}
                      </p>

                      {/* Key Concepts List */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Core Takeaways & Rules</span>
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
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="font-semibold">Executable Python Snippet:</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCopyCode(module.codeExample, module.id)}
                              className="hover:text-white flex items-center space-x-1 text-[11px] p-1 text-slate-400"
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
                              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition active:scale-95 disabled:opacity-50 min-h-[30px] cursor-pointer"
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
                              <span>Python 3.12 Engine</span>
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
                        <div className="flex items-start space-x-3 bg-amber-950/20 border border-amber-700/40 p-3.5 rounded-2xl text-amber-200 text-xs leading-relaxed">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-300 font-bold">Common Exam Trap & Gotcha: </strong>
                            <span>{module.testGotcha}</span>
                          </div>
                        </div>
                      )}

                      {/* Interactive Quick Knowledge Check Quizlet */}
                      {module.quickQuiz && (
                        <div className="bg-slate-950/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
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
                                  className={`p-2.5 rounded-xl border text-xs text-left transition font-mono ${btnStyle} cursor-pointer`}
                                >
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizState?.answered && (
                            <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                              <strong
                                className={
                                  quizState.selectedIdx === module.quickQuiz.correctIndex
                                    ? 'text-emerald-400 font-bold'
                                    : 'text-amber-400 font-bold'
                                }
                              >
                                {quizState.selectedIdx === module.quickQuiz.correctIndex
                                  ? '✓ Correct! '
                                  : 'Explanation: '}
                              </strong>
                              {module.quickQuiz.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* TAB 2: GRADED EXERCISES */
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-amber-400" />
                            <span>Day {module.dayNumber} Practice Exercises</span>
                          </h3>
                          <p className="text-xs text-slate-300">
                            Solve these practical challenges to solidify your understanding.
                          </p>
                        </div>

                        {module.exerciseStarterCode && (
                          <button
                            onClick={() => onOpenInLab(module.exerciseStarterCode!)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-95 shrink-0 cursor-pointer"
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Solve in Python Lab →</span>
                          </button>
                        )}
                      </div>

                      {/* Level 1 Exercises */}
                      {module.exercises?.level1 && module.exercises.level1.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              LEVEL 1: FOUNDATION
                            </span>
                            <span className="text-xs text-slate-400">Core concepts & quick checks</span>
                          </div>
                          <ul className="grid grid-cols-1 gap-2">
                            {module.exercises.level1.map((ex, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans"
                              >
                                <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                                  {i + 1}
                                </span>
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Level 2 Exercises */}
                      {module.exercises?.level2 && module.exercises.level2.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              LEVEL 2: INTERMEDIATE
                            </span>
                            <span className="text-xs text-slate-400">Algorithms & data manipulation</span>
                          </div>
                          <ul className="grid grid-cols-1 gap-2">
                            {module.exercises.level2.map((ex, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans"
                              >
                                <span className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                                  {i + 1}
                                </span>
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Level 3 Exercises */}
                      {module.exercises?.level3 && module.exercises.level3.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              LEVEL 3: ADVANCED / CAPSTONE
                            </span>
                            <span className="text-xs text-slate-400">Complex real-world challenges</span>
                          </div>
                          <ul className="grid grid-cols-1 gap-2">
                            {module.exercises.level3.map((ex, i) => (
                              <li
                                key={i}
                                className="flex items-start space-x-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed font-sans"
                              >
                                <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                                  {i + 1}
                                </span>
                                <span>{ex}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
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
