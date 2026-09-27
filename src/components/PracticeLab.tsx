import React, { useState, useEffect } from 'react';
import { runPythonCode } from '../utils/pythonRunner';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, Sparkles, BookOpen, ListOrdered } from 'lucide-react';

interface PracticeLabProps {
  initialCode?: string;
}

const PRESET_EXAMPLES = [
  {
    name: 'Day 1: Syntax & Core Data Types',
    code: `# Day 1: 30 Days of Python - Syntax & Types
name = "Asabeneh"
year = 2026
skills = ["Python", "Flask", "Pandas", "JavaScript"]
profile = {"creator": name, "challenge": "30 Days of Python"}

print("Hello World from Python 3.12!")
print(f"Author: {name} (Year: {year})")
print(f"Skills ({len(skills)}): {skills}")
print(f"Data types -> name: {type(name)}, year: {type(year)}, skills: {type(skills)}")`
  },
  {
    name: 'Day 4: String Slicing & f-strings',
    code: `# Day 4: Strings, Slicing & Formatting
title = "30 Days of Python Challenge"

# Slicing syntax [start:stop:step]
print("First 7 chars:", title[:7])
print("Reversed string:", title[::-1])

# String methods
words = title.split()
print("Words list:", words)
print("Joined with dashes:", "-".join(words))

# Modern f-string formatting
score = 98.456
print(f"Formatted score: {score:.1f}%")`
  },
  {
    name: 'Day 5: List Methods & Slicing',
    code: `# Day 5: List Methods & Manipulation
fruits = ['banana', 'orange', 'mango', 'lemon']

# Adding elements
fruits.append('apple')
fruits.insert(2, 'strawberry')
print("After append & insert:", fruits)

# Negative indexing
print("Last fruit (index -1):", fruits[-1])
print("Middle slice:", fruits[1:4])

# Sorting & Mutability
fruits.sort()
print("Alphabetically sorted:", fruits)`
  },
  {
    name: 'Day 7: Sets & Unique Elements',
    code: `# Day 7: Sets & Mathematical Set Operations
frontend = {'HTML', 'CSS', 'JavaScript', 'React', 'Python'}
backend = {'Python', 'Node', 'SQL', 'FastAPI', 'Docker'}

print("Union (All Skills):", frontend | backend)
print("Intersection (Shared):", frontend & backend)
print("Difference (Frontend only):", frontend - backend)
print("Symmetric Difference:", frontend ^ backend)`
  },
  {
    name: 'Day 8: Dictionaries & Lookup',
    code: `# Day 8: Dictionaries & Key-Value Mappings
student = {
    'name': 'Grace',
    'track': 'Python Mastery',
    'completed_days': 8,
    'scores': [95, 88, 92]
}

# Safe lookup with .get()
print("Student Name:", student['name'])
print("Student GPA (safe fallback):", student.get('gpa', 'Not graded yet'))

# Adding and modifying keys
student['scores'].append(100)
student['average'] = sum(student['scores']) / len(student['scores'])
print(f"Updated Student: {student['name']} - Avg: {student['average']:.1f}%")`
  },
  {
    name: 'Day 10: Loops, range() & enumerate()',
    code: `# Day 10: Loops, range(), and enumerate()
print("--- Counting Evens with range(0, 12, 2) ---")
for num in range(0, 12, 2):
    print(num, end=" ")
print("\\n")

languages = ["Python", "Rust", "Go", "TypeScript"]
print("--- Enumerate with Index ---")
for idx, lang in enumerate(languages, start=1):
    print(f"  {idx}. {lang}")`
  },
  {
    name: 'Day 11: Functions & *args, **kwargs',
    code: `# Day 11: Functions & Arbitrary Arguments
def calculate_stats(*args):
    """Calculates count, sum, and average of arbitrary numbers."""
    if not args:
        return 0, 0, 0
    total = sum(args)
    avg = total / len(args)
    return len(args), total, round(avg, 2)

count, total, avg = calculate_stats(15, 25, 35, 45, 55, 65)
print(f"Stats -> Count: {count}, Total: {total}, Average: {avg}")`
  },
  {
    name: 'Day 13: List Comprehensions',
    code: `# Day 13: List Comprehensions & Transformations
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Even squares in one line
even_squares = [x**2 for x in numbers if x % 2 == 0]
print("Even numbers squared:", even_squares)

# Flattening a 2D matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [val for row in matrix for val in row]
print("Flattened Matrix:", flat)`
  },
  {
    name: 'Day 14: Higher Order Functions (Map, Filter)',
    code: `# Day 14: Functional Programming (map, filter)
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map(): Triple all numbers
tripled = list(map(lambda x: x * 3, numbers))
print("Tripled with map:", tripled)

# filter(): Numbers divisible by 3
div_by_3 = list(filter(lambda x: x % 3 == 0, numbers))
print("Divisible by 3 with filter:", div_by_3)`
  },
  {
    name: 'Day 21: Classes & Object-Oriented Programming',
    code: `# Day 21: Classes, Inheritance & OOP
class Developer:
    def __init__(self, name, language, experience_years):
        self.name = name
        self.language = language
        self.experience_years = experience_years

    def introduce(self):
        return f"{self.name} writes {self.language} with {self.experience_years} years experience."

dev = Developer("Tunde", "Python 3.12", 3)
print(dev.introduce())`
  }
];

export const PracticeLab: React.FC<PracticeLabProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(
    initialCode || PRESET_EXAMPLES[0].code
  );
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      handleRunCode(initialCode);
    } else {
      handleRunCode(code);
    }
  }, [initialCode]);

  const handleRunCode = (sourceCode: string = code) => {
    setIsRunning(true);
    setError(null);
    setTimeout(() => {
      const result = runPythonCode(sourceCode);
      setOutput(result.output);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
      }
      setIsRunning(false);
    }, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setCode(PRESET_EXAMPLES[0].code);
    handleRunCode(PRESET_EXAMPLES[0].code);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 liquid-glass p-5 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">LetLearn_Py Interactive Lab</h1>
          </div>
          <p className="text-xs text-slate-400">
            Write, test, and experiment with Python lists, slicing, loops, split, and comprehensions in a live sandbox.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 hidden md:inline">Load Preset:</span>
          <select
            onChange={(e) => {
              const selected = PRESET_EXAMPLES.find(ex => ex.name === e.target.value);
              if (selected) {
                setCode(selected.code);
                handleRunCode(selected.code);
              }
            }}
            className="px-3 py-2 liquid-glass-input rounded-xl text-xs text-amber-300 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {PRESET_EXAMPLES.map((ex, idx) => (
              <option key={idx} value={ex.name} className="bg-slate-900 text-white">
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 liquid-glass rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono font-semibold text-slate-300 ml-2">main.py</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                title="Copy code"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition text-xs flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset code"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={() => handleRunCode()}
                disabled={isRunning}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
            </div>
          </div>

          {/* Textarea Code Input */}
          <div className="relative flex-1 min-h-[260px] sm:min-h-[380px] p-3 sm:p-4 bg-black/40">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your Python code here..."
              spellCheck={false}
              className="w-full h-full min-h-[260px] sm:min-h-[380px] bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30"
            />
          </div>

          <div className="px-4 py-2 bg-black/50 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Python 3.12 Engine • Sandbox Active</span>
            <span>Ctrl + Enter / Click Run</span>
          </div>
        </div>

        {/* Right: Terminal Output & List Visualizer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Terminal Console */}
          <div className="liquid-glass rounded-3xl flex flex-col overflow-hidden shadow-2xl flex-1 min-h-[260px]">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Terminal Output</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">stdout</span>
            </div>

            <div className="p-4 bg-black/40 flex-1 font-mono text-xs overflow-y-auto leading-relaxed">
              {error ? (
                <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl whitespace-pre-wrap">
                  {error}
                </div>
              ) : output ? (
                <div className="text-emerald-300/90 whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="text-slate-500 italic">
                  Click 'Run Code' to see console output...
                </div>
              )}
            </div>
          </div>

          {/* Quick Cheatsheet helper */}
          <div className="liquid-glass-card rounded-3xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Agenda Quick-Syntax Reminders</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300 font-mono">
              <div className="bg-black/40 p-2 rounded-xl border border-white/[0.06]">
                <span className="text-amber-400">myList = []</span>
                <span className="text-slate-400 text-[11px] block">Create an empty list</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-white/[0.06]">
                <span className="text-amber-400">myList.append(item)</span>
                <span className="text-slate-400 text-[11px] block">Add 1 item to the end (in-place)</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-white/[0.06]">
                <span className="text-amber-400">myList.insert(index, item)</span>
                <span className="text-slate-400 text-[11px] block">Add item at specific index</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl border border-white/[0.06]">
                <span className="text-amber-400">[int(x) for x in raw.split()]</span>
                <span className="text-slate-400 text-[11px] block">Parse string into integer list</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
