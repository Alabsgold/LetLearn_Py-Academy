export interface LabTip {
  id: string;
  category: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
    glow: string;
  };
  title: string;
  rule: string;
  code: string;
  explanation: string;
  didYouKnow: string;
}

export const LAB_TIPS: LabTip[] = [
  {
    id: 'slicing-reverse',
    category: 'SLICING MAGIC',
    badgeColor: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    },
    title: 'Fast Reverse Without Mutating',
    rule: 'Use [::-1] to create a reversed copy instead of modifying the source.',
    code: `# Create a reversed copy (original intact)
scores = [10, 20, 30, 40]
reversed_scores = scores[::-1]  # [40, 30, 20, 10]

# Note: scores.reverse() modifies in-place and returns None!`,
    explanation: 'List slicing [start:stop:step] with a step of -1 steps backwards through the list. It builds a brand-new list without altering the original list.',
    didYouKnow: 'Calling `scores.reverse()` returns `None`, not the list. Assigning `x = scores.reverse()` will make x equal to None!'
  },
  {
    id: 'mutability-alias',
    category: 'MUTABILITY GOTCHA',
    badgeColor: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20'
    },
    title: 'Assignment vs. Copying Lists',
    rule: 'list_b = list_a creates an alias pointing to the same memory address!',
    code: `a = [1, 2, 3]
b = a          # Reference alias! Same memory address
b.append(99)
print(a)       # Prints [1, 2, 3, 99]!

# To create a true independent copy:
safe_copy = a.copy()  # or a[:]`,
    explanation: 'Variables in Python hold references to objects. When you assign `b = a`, both variable labels point to the same underlying list in heap memory.',
    didYouKnow: 'You can check if two variables point to the exact same memory object using the `is` keyword: `a is b` returns True!'
  },
  {
    id: 'append-vs-extend',
    category: 'METHODS DEEP-DIVE',
    badgeColor: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'shadow-blue-500/20'
    },
    title: '.append() vs .extend()',
    rule: '.append() adds the object as a single element; .extend() iterates through it.',
    code: `base = [1, 2]
base.append([3, 4])
# Result: [1, 2, [3, 4]] -> Nested! Length is 3

items = [1, 2]
items.extend([3, 4])
# Result: [1, 2, 3, 4] -> Flat! Length is 4`,
    explanation: 'Use `.append(x)` when you want to add a single item (even if that item is another list). Use `.extend(iterable)` when you want to merge elements from another collection.',
    didYouKnow: 'The `+` operator on lists (`a + b`) creates a brand-new list, whereas `a.extend(b)` mutates `a` in place with lower memory overhead.'
  },
  {
    id: 'pop-vs-remove',
    category: 'REMOVAL TACTICS',
    badgeColor: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      glow: 'shadow-rose-500/20'
    },
    title: '.pop() vs .remove()',
    rule: '.pop(index) removes by position and returns it; .remove(value) searches by value.',
    code: `queue = ['Alpha', 'Beta', 'Gamma']
removed_item = queue.pop(0)    # Returns 'Alpha'
# queue is now ['Beta', 'Gamma']

queue.remove('Gamma')          # Removes first matching value
# Returns None! Raises ValueError if 'Gamma' not found`,
    explanation: '`.pop()` defaults to index -1 (the end of the list), which runs in O(1) constant time. `.pop(0)` or `.remove(val)` requires shifting subsequent items, running in O(n) time.',
    didYouKnow: 'Because `.pop()` returns the deleted item, you can use Python lists directly as LIFO Stacks with `stack.append(x)` and `stack.pop()`!'
  },
  {
    id: 'negative-indexing',
    category: 'INDEXING WISDOM',
    badgeColor: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'shadow-purple-500/20'
    },
    title: 'Negative Indexing Shortcuts',
    rule: 'Avoid len(items) - 1 by using clean negative offsets.',
    code: `colors = ['red', 'green', 'blue', 'gold']

last_color = colors[-1]    # 'gold'
second_last = colors[-2]   # 'blue'

# Safe last 3 items:
recent = colors[-3:]       # ['green', 'blue', 'gold']`,
    explanation: 'Python wraps indices around from the end: -1 is the final element, -2 is second from the end, all the way to -len(items) which is the first element.',
    didYouKnow: 'Negative indices work across lists, tuples, strings, and slices in Python!'
  },
  {
    id: 'list-comprehensions',
    category: 'PERFORMANCE PRO',
    badgeColor: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20'
    },
    title: 'High-Speed List Comprehensions',
    rule: 'List comprehensions run in optimized C-bytecode loops up to 35% faster than for-loops.',
    code: `numbers = [1, 2, 3, 4, 5, 6]

# Fast, readable filtering & transformation:
evens_squared = [x**2 for x in numbers if x % 2 == 0]
# Result: [4, 16, 36]`,
    explanation: 'Instead of creating an empty list and calling `.append()` inside a loop, Python list comprehensions run via a specialized C-level bytecode instruction (`LIST_APPEND`).',
    didYouKnow: 'List comprehensions can even handle nested loops: `[(x, y) for x in [1, 2] for y in ["a", "b"]]` generates Cartesian coordinate pairs!'
  },
  {
    id: 'sort-vs-sorted',
    category: 'ORDERING PROTOCOL',
    badgeColor: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-400',
      border: 'border-teal-500/30',
      glow: 'shadow-teal-500/20'
    },
    title: '.sort() vs sorted()',
    rule: '.sort() alters the original in-place; sorted() returns a fresh sorted copy.',
    code: `data = [42, 12, 88, 3]

# In-place sorting (mutates data, returns None)
data.sort(reverse=True)      # data is now [88, 42, 12, 3]

# Immutable sorting (preserves source data)
names = ['Zoe', 'Alex', 'Dev']
ordered = sorted(names)      # ordered: ['Alex', 'Dev', 'Zoe']`,
    explanation: 'Both functions use Timsort (an adaptive merge-sort algorithm with O(n log n) worst-case time). Use `sorted()` when you must preserve original data order.',
    didYouKnow: 'You can pass custom sort rules using key functions: `names.sort(key=len)` sorts strings by their character length!'
  },
  {
    id: 'slice-bounds-safety',
    category: 'DEFENSIVE CODING',
    badgeColor: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20'
    },
    title: 'Slicing Never Throws IndexError',
    rule: 'Direct indexing out-of-range crashes; slicing out-of-range handles it safely.',
    code: `letters = ['A', 'B', 'C']

# letters[10] -> CRASH! IndexError: list index out of range

# But slicing is graceful and forgiving:
safe_slice = letters[1:100]  # Returns ['B', 'C']
empty_slice = letters[50:60] # Returns []`,
    explanation: 'Python slicing automatically clips indices to the bounds [0, len(list)]. If the slice range is entirely beyond the list, it returns an empty list without raising an exception.',
    didYouKnow: 'To safely peek at the first element of an unknown list without checking `if my_list:` first, you can use `(my_list[:1] or [default])[0]`.'
  },
  {
    id: 'input-to-list',
    category: 'LAB ESSENTIAL',
    badgeColor: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-indigo-500/20'
    },
    title: 'Parsing Space-Separated Inputs',
    rule: 'Use .split() combined with map(int, ...) for fast competitive input parsing.',
    code: `# User enters: "10 20 30 40 50"
raw_input = "10 20 30 40 50"

# Method 1: List comprehension
numbers = [int(n) for n in raw_input.split()]

# Method 2: High speed map()
values = list(map(int, raw_input.split()))
# Result: [10, 20, 30, 40, 50]`,
    explanation: '`.split()` with no arguments splits on any consecutive whitespace (spaces, tabs, newlines). Mapping `int` parses each substring into an integer in one concise statement.',
    didYouKnow: '`.split()` without parameters also strips leading and trailing whitespace automatically!'
  },
  {
    id: 'swap-unpacking',
    category: 'PYTHONIC IDIOM',
    badgeColor: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    },
    title: 'Zero-Temp Variable Swapping',
    rule: 'Swap list elements in one clean line via tuple unpacking.',
    code: `items = ['First', 'Second', 'Third']

# In other languages: temp = items[0]; items[0] = items[1]...
# In Python:
items[0], items[1] = items[1], items[0]

print(items) # ['Second', 'First', 'Third']`,
    explanation: 'The right-hand side is evaluated first as an anonymous tuple `(items[1], items[0])` before assignment to the left-hand targets occurs.',
    didYouKnow: 'This tuple unpacking magic works for any number of variables simultaneously: `a, b, c = b, c, a` rotates three values in a single cycle!'
  },
  {
    id: 'asterisk-unpacking',
    category: 'SYNTAX SUPERPOWER',
    badgeColor: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      glow: 'shadow-sky-500/20'
    },
    title: 'Extended Iterable Unpacking (*)',
    rule: 'Use the star operator * to capture remaining elements into a sub-list.',
    code: `record = ['LetLearn_Py', 2026, 95, 88, 92, 'Passed']

brand, year, *grades, status = record

print(brand)   # 'LetLearn_Py'
print(grades)  # [95, 88, 92] (captured as a list!)
print(status)  # 'Passed'`,
    explanation: 'The asterisk `*` can appear once anywhere in an assignment pattern, greedily soaking up all middle or trailing elements into a list.',
    didYouKnow: 'You can also use `*` to unpack lists inside new lists: `combined = [*list1, *list2, 99]` replaces `list1 + list2 + [99]`.'
  },
  {
    id: 'deduplicate-ordered',
    category: 'ALGORITHM TIP',
    badgeColor: {
      bg: 'bg-fuchsia-500/10',
      text: 'text-fuchsia-400',
      border: 'border-fuchsia-500/30',
      glow: 'shadow-fuchsia-500/20'
    },
    title: 'Deduplicate While Preserving Order',
    rule: 'list(set(x)) scrambles order; dict.fromkeys(x) preserves original order!',
    code: `items = ['apple', 'banana', 'apple', 'cherry', 'banana']

# Wrong if order matters:
# list(set(items)) -> ['cherry', 'apple', 'banana'] (arbitrary!)

# Correct & O(n) fast:
unique_items = list(dict.fromkeys(items))
# Result: ['apple', 'banana', 'cherry']`,
    explanation: 'Since Python 3.7, dictionaries are guaranteed to maintain insertion order. `dict.fromkeys()` builds a hash map keeping only first appearances, running in O(n) linear time.',
    didYouKnow: 'Building a set is fast, but sets use a hash table without order preservation. `dict.fromkeys()` gives you set-like speed with list-like ordering.'
  }
];

export const LAB_BOOT_LOGS = [
  { progress: 0, text: 'Calibrating LetLearn_Py OS26 sandbox core...', icon: 'cpu' },
  { progress: 18, text: 'Mounting Python 3.12 dynamic list memory pointers...', icon: 'terminal' },
  { progress: 38, text: 'Loading curriculum modules, methods & lab playground...', icon: 'book' },
  { progress: 58, text: 'Syncing timed assessment engine & PIN handshake...', icon: 'lock' },
  { progress: 78, text: 'Connecting live telemetry with instructor mentor desk...', icon: 'radio' },
  { progress: 92, text: 'Verifying syntax engine & code test runner...', icon: 'check' },
  { progress: 100, text: 'LetLearn_Py Lab Ready. Access granted.', icon: 'sparkles' },
];
