import React, { useState, useEffect } from 'react';
import { runPythonCode } from '../utils/pythonRunner';
import { Play, RotateCcw, Copy, Check, Terminal as TerminalIcon, Sparkles, BookOpen, ListOrdered } from 'lucide-react';

interface PracticeLabProps {
  initialCode?: string;
}

const PRESET_EXAMPLES = [
  {
    name: '1. Creating & Heterogeneous Lists',
    code: `# Creating different kinds of lists
emptyList = []
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
myList3 = [1, "string", 9.10]
duplicates = [1, 1, 2, 2]

print("Empty List:", emptyList)
print("Numbers count:", len(numbers))
print("Mixed List:", myList3)
print("Duplicates allowed:", duplicates)`
  },
  {
    name: '2. Positive & Negative Indexing',
    code: `# Indexing in Python
fruits = ["Apple", "Banana", "Cherry", "Date"]

print("First item (index 0):", fruits[0])
print("Last item (index -1):", fruits[-1])
print("Second to last (index -2):", fruits[-2])`
  },
  {
    name: '3. Multi-Dimensional (Nested) Lists',
    code: `# Multi-dimensional list
myList = [1, 2, 3, [10, 20]]

print("Full List:", myList)
print("Element at index 3 (nested list):", myList[3])
print("Accessing inner element 10 (myList[3][0]):", myList[3][0])
print("Accessing inner element 20 (myList[3][1]):", myList[3][1])`
  },
  {
    name: '4. append() vs extend() vs insert()',
    code: `# Comparing append, extend, and insert
listA = [1, 2]
listA.append([3, 4])
print("After append([3, 4]):", listA)
print("Length of listA:", len(listA))

listB = [1, 2]
listB.extend([3, 4])
print("After extend([3, 4]):", listB)
print("Length of listB:", len(listB))

numbers = [10, 20, 40]
numbers.insert(2, 30)
print("After numbers.insert(2, 30):", numbers)`
  },
  {
    name: '5. Changing Items & Slicing Operator',
    code: `# In-place modification and slicing
myList = [10, 20, 30, 40, 50]

# Change single item
myList[0] = 99
print("After myList[0] = 99:", myList)

# Change multiple items with slicing [start:end]
myList[1:3] = [200, 300]
print("After myList[1:3] = [200, 300]:", myList)`
  },
  {
    name: '6. pop(), remove(), del & clear()',
    code: `# Removing items from lists
scores = [100, 85, 90, 85, 70]

# remove() deletes first occurrence by value
scores.remove(85)
print("After scores.remove(85):", scores)

# pop() removes by index and returns the item
popped_item = scores.pop(1)
print("Popped item at index 1:", popped_item)
print("After pop(1):", scores)

# clear() empties the list
scores.clear()
print("After clear():", scores)`
  },
  {
    name: '7. Parsing Input with split() & Loop',
    code: `# Simulating user input string parsing
raw_input = "5 10 15 20 25"

# split() produces a list of substrings
str_tokens = raw_input.split()
print("Split string tokens:", str_tokens)

# Loop and typecast each substring to integer
int_list = []
for tok in str_tokens:
    int_list.append(int(tok))

print("Final Integer List:", int_list)
print("Total sum:", sum(int_list))`
  },
  {
    name: '8. List Comprehension Power',
    code: `# List Comprehensions: [expression for var in iterable if condition]
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Squares of all numbers
squares = [x**2 for x in numbers]
print("All Squares:", squares)

# Squares of ONLY even numbers
evens_squared = [x**2 for x in numbers if x % 2 == 0]
print("Evens Squared:", evens_squared)

# Parse input string in one line!
line = "100 200 500"
parsed = [int(x) for x in line.split()]
print("One-liner input parsed:", parsed)`
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
          <div className="relative flex-1 min-h-[380px] p-4 bg-black/40">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your Python code here..."
              spellCheck={false}
              className="w-full h-full min-h-[380px] bg-transparent text-slate-100 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-amber-500/30"
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
