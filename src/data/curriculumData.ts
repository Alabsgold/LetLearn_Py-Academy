import { StudyModule } from '../types';

export const CURRICULUM_MODULES: StudyModule[] = [
  // 1. Definition and Creating a List
  {
    id: 'list_definition_creation',
    sectionId: 'creating-lists',
    category: 'Lists in Python',
    title: '1. Python Lists: Definition & Creation',
    summary: 'A Python list is an ordered collection of items enclosed in square brackets and separated by commas.',
    beginnerNote: 'Think of a list like a shopping basket or pencil case: you can put items inside, take them out, rearrange them, or hold items of completely different kinds in one place.',
    keyPoints: [
      'Name of list: The variable identifier chosen to store the list in memory (e.g., myList).',
      'Assignment operator (=): Used to assign the list values to the variable name.',
      'Square brackets []: Lists in Python MUST always be enclosed in squared brackets [ ].',
      'Separated by commas (,): Each element inside the list must be separated with a comma.',
      'Empty list: An initialized list containing zero items, represented as myList = [].',
      'Numerical list: myList2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] storing integers.',
      'Heterogeneous list: myList3 = [1, "string", 9.10] storing integer, string, and float together.'
    ],
    codeExample: `# Agenda Examples: Creating lists in Python
# 1. Empty list example
myList = []

# 2. List of integers
mylist2 = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 3. List storing multiple data types (Heterogeneous)
myList3 = [1, "string", 9.10]

print("myList (empty):", myList)
print("mylist2:", mylist2)
print("myList3:", myList3)
print("Length of mylist2:", len(mylist2))`,
    testGotcha: 'Do not use curved parentheses ( ) or curly braces { } when creating a list. Lists strictly require square brackets [ ]!',
    diagram: {
      type: 'indexing',
      data: {
        title: 'List Anatomy',
        parts: [
          { label: 'Name of list', val: 'myList' },
          { label: 'Assignment operator', val: '=' },
          { label: 'Squared brackets & elements', val: '[ 1, "string", 9.10 ]' }
        ]
      }
    },
    quickQuiz: {
      question: 'Which of the following correctly creates an empty list in Python?',
      options: ['myList = ()', 'myList = []', 'myList = {}', 'myList = [empty]'],
      correctIndex: 1,
      explanation: 'Square brackets [] create an empty list. Parentheses () create a tuple and curly braces {} create a dictionary/set.'
    }
  },

  // 2. Features of a List
  {
    id: 'list_features',
    sectionId: 'list-features',
    category: 'Lists in Python',
    title: '2. Features of Python Lists',
    summary: 'Lists have three distinguishing core superpowers: duplicate items, in-place mutability, and heterogeneous typing.',
    beginnerNote: 'Unlike some other data structures (like Sets which erase duplicates, or Strings which cannot be modified in-place), Python lists are flexible and give you full control.',
    keyPoints: [
      'Feature 1: A list can have duplicate items. Elements with identical values can appear multiple times: myList4 = [1, 1, 2, 2].',
      'Feature 2: Items in a list are mutable (changeable). You can alter, reassign, or replace any element directly.',
      'Feature 3: A list can store items of various types. Numbers, words (strings), decimals (floats), booleans, and even other lists can live together in harmony.',
      'Positive Indexing (0, 1, 2...): Starts from 0 at the very first element.',
      'Negative Indexing (-1, -2, -3...): Starts from -1 at the very end of the list and counts backwards towards the beginning.'
    ],
    codeExample: `# Agenda Examples: List Features & Duplicate Items
# 1. A list can have duplicate items
myList4 = [1, 1, 2, 2]
print("myList4 with duplicates:", myList4)

# 2. Demonstrating indexing: [1, 2, 3]
# Index:          0  1  2
# Negative Index:-3 -2 -1
sample = [1, 2, 3]
print("First item (index 0):", sample[0])      # 1
print("Last item (index -1):", sample[-1])     # 3
print("Second to last (-2):", sample[-2])      # 2

# 3. Mutability: changing an item
sample[0] = 99
print("After mutability change:", sample)      # [99, 2, 3]`,
    testGotcha: 'Remember that the last item of any list is always at index -1, second to last is -2, and third to last is -3!',
    diagram: {
      type: 'indexing',
      data: {
        title: 'Positive vs Negative Indexing Tracker',
        items: [1, 2, 3],
        pos: [0, 1, 2],
        neg: [-3, -2, -1]
      }
    },
    quickQuiz: {
      question: 'What is the value of [10, 20, 30][-1] in Python?',
      options: ['10', '20', '30', 'IndexError'],
      correctIndex: 2,
      explanation: 'Negative indexing starts from the end of the list. Index -1 refers to the very last item, which is 30.'
    }
  },

  // 3. Types of Lists: 1D vs Multi-Dimensional
  {
    id: 'types_of_lists',
    sectionId: 'types-of-lists',
    category: 'Lists in Python',
    title: '3. Types of Lists (1D & Multi-Dimensional Lists)',
    summary: 'Lists can be single-level (1-Dimensional) or nested inside other lists (Multi-Dimensional).',
    beginnerNote: 'A multi-dimensional list is like a filing cabinet: inside the main drawer (the outer list), you have individual folders (the inner sub-lists).',
    keyPoints: [
      '1-Dimensional List (1D list): A flat, single-tier list. Example: myList = [1, 2, 3, 4] with indices 0, 1, 2, 3.',
      'Multi-Dimensional List: A list containing another list as one or more of its elements.',
      'Nested Example from Agenda: myList = [1, 2, 3, [1, 2]]. Here, the outer list has 4 elements: indices 0, 1, 2, and 3.',
      'Accessing the sub-list: myList[3] gives the inner list [1, 2].',
      'Accessing items inside the nested list: Use chained square brackets: myList[3][0] is 1, and myList[3][1] is 2.',
      'Negative Indexing on Multi-D: myList[-1] accesses the nested list [1, 2], and myList[-1][0] accesses 1.'
    ],
    codeExample: `# Agenda Example: 1D and Multi-Dimensional lists
# 1D List
one_d = [1, 2, 3, 4]
print("1D List:", one_d)

# Multi-dimensional list (nested list at index 3)
# Indices:    0  1  2     3
#                      0  1
myList = [1, 2, 3, [1, 2]]

print("Outer list item at index 0:", myList[0])       # 1
print("Outer list item at index 3 (sub-list):", myList[3]) # [1, 2]
print("First item inside sub-list (myList[3][0]):", myList[3][0]) # 1
print("Second item inside sub-list (myList[3][1]):", myList[3][1]) # 2
print("Using negative index (myList[-1][1]):", myList[-1][1])     # 2`,
    testGotcha: 'myList = [1, 2, 3, [1, 2]] has len(myList) == 4, NOT 5! The nested list [1, 2] counts as ONE single item at index 3.',
    diagram: {
      type: 'multid',
      data: {
        outer: [1, 2, 3, '[1, 2]'],
        outerIdx: [0, 1, 2, 3],
        inner: [1, 2],
        innerIdx: [0, 1]
      }
    },
    quickQuiz: {
      question: 'Given myList = [1, 2, 3, [1, 2]], what does len(myList) return?',
      options: ['5', '4', '2', 'Error'],
      correctIndex: 1,
      explanation: 'The list has 4 elements: 1 (index 0), 2 (index 1), 3 (index 2), and the nested list [1, 2] (index 3).'
    }
  },

  // 4. List Methods: append(), insert(), extend()
  {
    id: 'list_methods_treated',
    sectionId: 'list-methods',
    category: 'List Methods',
    title: '4. List Methods: append(), insert() & extend()',
    summary: 'Dynamic built-in methods used to expand lists and add new items.',
    beginnerNote: 'Remember: append adds to the tail end; insert squeezes an item into a chosen position; extend unpacks another list and pours all its contents into yours.',
    keyPoints: [
      'append() Method: Used to add an item to the end of a list. Crucial Rule: append() only holds ONE argument (one value). Example: fruit = ["Banana", "apple"] -> fruit.append("orange").',
      'insert() Method: Used to add items to a specific position in a list. Holds index and value arguments: list.insert(index, item). Example: numbers = [10, 20, 40] -> numbers.insert(2, 30).',
      'extend() Method: Used to add ALL the items in one list to another list. Only holds one argument (an iterable list). It unrolls the elements.',
      'Crucial Contrast: list.append([A, B]) creates [..., [A, B]] (a nested list), while list.extend([A, B]) creates [..., A, B] (flat elements).'
    ],
    codeExample: `# Agenda Examples: append, insert, and extend

# 1. append() - adds to end, takes exactly 1 argument
fruit = ["Banana", "apple"]
fruit.append("orange")
print("After append('orange'):", fruit)
# Result: ['Banana', 'apple', 'orange']

# 2. insert() - adds to specific position (index, item)
numbers = [10, 20, 40]
numbers.insert(2, 30)  # Inserts 30 at index 2
print("After insert(2, 30):", numbers)
# Result: [10, 20, 30, 40]

# 3. extend() - merges all items from another list
cohort_a = ["Tunde", "Chidinma"]
cohort_b = ["Femi", "Zainab"]
cohort_a.extend(cohort_b)
print("After extend():", cohort_a)
# Result: ['Tunde', 'Chidinma', 'Femi', 'Zainab']`,
    testGotcha: 'All three methods (append, insert, extend) modify the list IN PLACE and return None! Never write fruit = fruit.append("orange") or fruit will become None!',
    quickQuiz: {
      question: 'How many arguments does list.append() accept?',
      options: ['Zero arguments', 'Strictly one argument', 'Two arguments', 'Unlimited arguments'],
      correctIndex: 1,
      explanation: 'append() takes strictly one argument and attaches it to the end of the list.'
    }
  },

  // 5. Input Method & Typecasting
  {
    id: 'input_method_typecasting',
    sectionId: 'input-typecasting',
    category: 'Input & Data Handling',
    title: '5. The Input Method & Typecasting',
    summary: 'Understanding how Python collects user data and converting raw strings to numerical types.',
    beginnerNote: 'Whenever a user types something in input(), Python wraps it in quotation marks as a string. If you want math, you must typecast it into numbers first!',
    keyPoints: [
      'Input Method: Used to take input from a user in real-time.',
      'The Core Rule: User input is ALWAYS converted to a string data type (str), even if the user types numbers like 42.',
      'The Problem: "10" + "10" produces "1010" (string concatenation) instead of the numerical addition 20.',
      'Typecasting: Methods needed to convert a string of numerical value to an integer (int) or other types of data (float, bool).',
      'Common Typecasting Functions: int("50") -> 50, float("9.8") -> 9.8, str(100) -> "100".'
    ],
    codeExample: `# Understanding input() and typecasting
# Simulating: user_age = input("Enter your age: ")
user_input_str = "18"  # input() always returns a string

print("Raw input value:", user_input_str)
print("Raw input type:", type(user_input_str)) # <class 'str'>

# Typecasting to integer:
age = int(user_input_str)
print("Typecasted value:", age)
print("Typecasted type:", type(age))           # <class 'int'>
print("Age in 5 years:", age + 5)             # 23 (proper math)`,
    testGotcha: 'If a user inputs non-digit text like "hello" and you run int("hello"), Python will raise a ValueError: invalid literal for int().',
    diagram: {
      type: 'flow',
      data: {
        steps: [
          'User types 25',
          'input() -> "25" (string)',
          'int("25") -> 25 (integer)',
          'Ready for math (+, -, *, /)'
        ]
      }
    },
    quickQuiz: {
      question: 'What is the return data type of the input() method in Python?',
      options: ['Integer', 'Float', 'String', 'List'],
      correctIndex: 2,
      explanation: 'User input from input() is always returned as a string (str).'
    }
  },

  // 6. For Loops Concept
  {
    id: 'for_loops_concept',
    sectionId: 'for-loops',
    category: 'Loops & Iteration',
    title: '6. For Loops: Repetition & Iteration',
    summary: 'A for loop repeats a specific block of code a certain number of times across an iterable collection.',
    beginnerNote: 'Think of a for loop like an inspection conveyor belt: it picks up each element in the list one at a time, runs your code on it, and moves to the next.',
    keyPoints: [
      'Basic Concept: Like a conditional method that repeats code systematically.',
      'Definition: A for loop is a type of loop that repeats a specific code a certain number of times over a sequence (such as a list or string).',
      'Syntax: for item in list_name: followed by an indented code block.',
      'Loop Variable: Temporarily stores the current item of the list during each repetition cycle.'
    ],
    codeExample: `# Agenda Example: For loop iterating over a list
fruits = ["Banana", "apple", "orange"]

print("Starting loop:")
for fruit in fruits:
    print("I love eating", fruit)

print("Loop finished!")`,
    testGotcha: 'Python relies on indentation! The statements inside the for loop MUST be indented (usually 4 spaces).'
  },

  // 7. Inputting a List using Loops and split()
  {
    id: 'input_list_loops_split',
    sectionId: 'input-loops-split',
    category: 'Loops & Iteration',
    title: '7. Inputting a List using Loops & split() Method',
    summary: 'Overcoming the input() string limitation by combining split() and for loops to create lists of numbers.',
    beginnerNote: 'When taking multiple numbers at once (e.g. "10 20 30"), use .split() to chop them into pieces, then loop through and turn each piece into an integer!',
    keyPoints: [
      'Problem from the input method: It collects user input as strings. E.g. number = input("Enter your List of numbers: ").',
      'Revising the split() method: split() separates a string into a list of substrings based on whitespace (or specified separator).',
      'Example of split(): "10 20 30".split() produces ["10", "20", "30"]. Notice these are still strings!',
      'Inputting a list using for loops & typecasting: Loop through the split substrings, convert each using int(), and append() to a new integer list.'
    ],
    codeExample: `# Agenda Flow: Taking a list using split() and for loops
# Simulated input: number = input("Enter your List of numbers: ")
raw_user_input = "10 20 30 40 50"

# Step 1: split() separates the string into a list of substrings
string_list = raw_user_input.split()
print("After split():", string_list)  # ['10', '20', '30', '40', '50']

# Step 2: Use for loop and append() with int() typecasting
num_list = []
for item in string_list:
    num_list.append(int(item))

print("Final Integer List:", num_list) # [10, 20, 30, 40, 50]
print("Sum of numbers:", sum(num_list))  # 150`,
    testGotcha: 'If you do not typecast with int(item), trying to calculate sum(string_list) will cause a TypeError: unsupported operand type(s) for +: int and str!',
    quickQuiz: {
      question: 'What does "1 2 3".split() produce in Python?',
      options: ['[1, 2, 3]', "['1', '2', '3']", '("1", "2", "3")', '123'],
      correctIndex: 1,
      explanation: 'split() returns a list of strings, so each number is initially a substring enclosed in quotes.'
    }
  },

  // 8. Changing List Items: Single & Multiple (Slicing)
  {
    id: 'changing_list_items',
    sectionId: 'changing-items',
    category: 'Manipulating Lists',
    title: '8. Changing List Items: Indexing & Slicing Operator',
    summary: 'Modifying elements in-place: update a single item by index, or swap whole ranges using the slicing operator.',
    beginnerNote: 'Changing list items is like erasing a word on a whiteboard and writing a new one in its place without needing a new whiteboard.',
    keyPoints: [
      'Changing an Item in a list: Refer directly to the index of the item: myList[index] = new_value.',
      'Changing Multiple Items in a list: Use the Slicing Operator [start:end].',
      'In place of a single value, pass a range of values: myList[1:3] = [new_item1, new_item2].',
      'The End Index is Non-Inclusive: In myList[1:3], only index 1 and index 2 are targeted. Index 3 is NOT modified.',
      'Inserting new items: Slices can expand or contract the list length dynamically.'
    ],
    codeExample: `# Agenda Examples: Changing single and multiple items

# 1. Changing an item in a list (refer to index)
myList = [10, 20, 30, 40, 50]
myList[0] = 99  # Change item at index 0
print("After changing single item:", myList)
# [99, 20, 30, 40, 50]

# 2. Changing Multiple Items using Slicing Operator
# Replace indices 1 and 2 (items 20 and 30) with [200, 300]
myList[1:3] = [200, 300]
print("After slicing replacement myList[1:3] = [200, 300]:", myList)
# [99, 200, 300, 400, 50]

# 3. Replacing a slice with different number of items
letters = ['a', 'b', 'c', 'd']
letters[1:3] = ['X', 'Y', 'Z'] # replaces 2 items with 3 items!
print("After expanding slice:", letters)
# ['a', 'X', 'Y', 'Z', 'd']`,
    testGotcha: 'In myList[start:end], the item at the end index is excluded. So [1:4] targets items 1, 2, and 3 only.',
    quickQuiz: {
      question: 'In nums = [1, 2, 3, 4, 5], what elements does nums[1:3] refer to?',
      options: ['[1, 2, 3]', '[2, 3]', '[2, 3, 4]', '[3, 4]'],
      correctIndex: 1,
      explanation: 'nums[1:3] starts at index 1 (value 2) up to, but not including, index 3 (value 4). So it yields [2, 3].'
    }
  },

  // 9. Removing Items from a List
  {
    id: 'removing_items_from_list',
    sectionId: 'removing-items',
    category: 'Manipulating Lists',
    title: '9. Removing Items: remove(), pop(), del & clear()',
    summary: 'Four distinct techniques to remove elements depending on whether you know the value or the index.',
    beginnerNote: 'Know which tool to pick: remove() uses the name/value; pop() uses the index position; del deletes by index or slice; clear() wipes the board clean.',
    keyPoints: [
      'remove(value): Removes an item by matching VALUE. Deletes the first occurrence found. Returns None.',
      'pop(index): Removes an item by INDEX and returns that removed value. If no index is given, it pops the last item (-1).',
      'del keyword: Statement used to delete an item or slice by index: del myList[0] or del myList[1:3].',
      'clear() method: Empties the entire list completely, leaving it as [].'
    ],
    codeExample: `# Agenda Examples: 4 ways to remove items

items = ["apple", "banana", "cherry", "banana", "date"]

# 1. remove() - by value (removes first 'banana')
items.remove("banana")
print("After remove('banana'):", items)

# 2. pop(index) - by index, and returns the removed item
popped_item = items.pop(1)
print("Popped item at index 1:", popped_item) # 'cherry'
print("After pop(1):", items)

# 3. del keyword - deletes by index
del items[0]
print("After del items[0]:", items)

# 4. clear() - clears the entire list
items.clear()
print("After clear():", items) # []`,
    testGotcha: 'remove() takes a VALUE and returns None. pop() takes an INDEX and RETURNS the removed value. If value is not in the list, remove() raises ValueError!',
    quickQuiz: {
      question: 'Which method removes an item by index AND returns the removed item?',
      options: ['remove()', 'pop()', 'del', 'clear()'],
      correctIndex: 1,
      explanation: 'pop(index) removes the element at the specified index and returns it to your program.'
    }
  },

  // 10. List Comprehension
  {
    id: 'list_comprehension_intro',
    sectionId: 'list-comprehension',
    category: 'Advanced List Techniques',
    title: '10. Introduction to List Comprehension',
    summary: 'A shorter, elegant syntax to create a new list from an existing iterable in a single line.',
    beginnerNote: 'List comprehension is like a Python shortcut recipe: instead of setting up an empty list, writing a for loop, and calling append(), you write it all inside one pair of brackets [ ]!',
    keyPoints: [
      'Concept: Provides a shorter syntax while creating a new list from an existing list.',
      'Syntax of List comprehension:',
      'List = [expression for variable in iterable if condition == True]',
      'The "if condition == True" is OPTIONAL. You can omit it if you want to process every item.',
      'Expression: What you want to store in the new list (e.g. x**2 or int(x)).',
      'Variable: The loop variable that temporarily holds each item.',
      'Iterable: The existing list, range, or split string to loop over.',
      'Condition (OPTIONAL): A filter to only include items when condition evaluates to True.'
    ],
    codeExample: `# Agenda Examples: List Comprehension

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Example 1: Without optional condition (square every number)
squares = [x ** 2 for x in numbers]
print("All Squares:", squares)

# Example 2: With OPTIONAL condition (only even numbers)
# Syntax: [expression for variable in iterable if condition == True]
even_squares = [x ** 2 for x in numbers if x % 2 == 0]
print("Even Squares only:", even_squares)

# Example 3: Shorthand for parsing user input in 1 line!
raw_string = "10 20 30 40"
int_list = [int(item) for item in raw_string.split()]
print("Parsed with comprehension:", int_list)`,
    testGotcha: 'In list comprehension, the expression to compute comes at the VERY FRONT, followed by the for loop, and lastly the optional if condition.',
    diagram: {
      type: 'comprehension',
      data: {
        formula: '[ expression  for variable in iterable  if condition ]',
        parts: [
          { name: '1. Expression', desc: 'What gets put in the new list (e.g. x**2)' },
          { name: '2. For variable in iterable', desc: 'The loop through the existing list' },
          { name: '3. Optional if condition', desc: 'Filter criteria (e.g. if x % 2 == 0)' }
        ]
      }
    },
    quickQuiz: {
      question: 'In the syntax [expr for var in iterable if condition], which part is OPTIONAL?',
      options: ['The expr', 'The for var', 'The iterable', 'The if condition'],
      correctIndex: 3,
      explanation: 'The if condition is optional; if omitted, the expression is applied to all elements.'
    }
  },

  // 11. Module Dictionaries Preview
  {
    id: 'module_dictionaries_preview',
    sectionId: 'dictionaries-preview',
    category: 'Dictionaries Preview',
    title: '11. Module Preview: Dictionaries in Python',
    summary: 'A first look at key-value mappings enclosed in curly braces {}.',
    beginnerNote: 'While lists use numbered positions (0, 1, 2...), dictionaries use descriptive words (keys) like "name" or "score" to look up values.',
    keyPoints: [
      'Concept: Stores data values in key: value pairs.',
      'Curly Braces {}: Dictionaries are created using curly brackets {}.',
      'Keys: Must be unique and immutable (strings or numbers).',
      'Values: Can be of any data type, including lists or other dictionaries.',
      'Accessing Values: Refer to the key name inside square brackets: dict["key_name"] or dict.get("key_name").'
    ],
    codeExample: `# Agenda Preview: Python Dictionaries
# Key: Value mapping
student = {
    "name": "Tunde",
    "cohort": "LetLearn_Py",
    "score": 95
}

print("Student Dictionary:", student)
print("Accessing key 'name':", student["name"])
print("Keys in dictionary:", list(student.keys()))
print("Values in dictionary:", list(student.values()))`,
    testGotcha: 'Accessing a key that does not exist with dict["missing"] raises a KeyError! In future sessions, we will learn dict.get().'
  }
];
