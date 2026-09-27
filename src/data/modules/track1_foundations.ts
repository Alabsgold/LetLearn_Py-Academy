import { StudyModule } from '../../types';

export const TRACK1_FOUNDATIONS: StudyModule[] = [
  // Day 1
  {
    id: 'day_01_introduction',
    sectionId: 'day-01-introduction',
    dayNumber: 1,
    track: 'Python Foundations',
    category: 'Foundations',
    title: 'Day 1: Introduction to Python & Basic Syntax',
    summary: 'Master Python 3 environment, execution flow, comments, arithmetic evaluation, and the foundational data types.',
    estimatedTime: '30 mins',
    beginnerNote: 'Python is a high-level, human-readable programming language. Think of the Python interpreter like a friendly assistant executing your line-by-line instructions.',
    keyPoints: [
      'Comments in Python start with the hash symbol (#) and are completely ignored by the interpreter.',
      'Core primitive types: Integer (e.g. 10, -5), Float (e.g. 3.14, -0.5), Complex (e.g. 1 + 2j), String ("text"), and Boolean (True, False).',
      'Complex collection types: List ([1, 2]), Tuple ((1, 2)), Set ({1, 2}), and Dictionary ({"key": "value"}).',
      'The type() built-in function inspects and returns the exact data type of any object.',
      'Indentation matters in Python! Consistent spaces (4 spaces standard) define code blocks.'
    ],
    codeExample: `# Day 1: Introduction to Python
# 1. Printing text to standard output
print("Hello, 30 Days of Python!")

# 2. Arithmetic calculations
print(3 + 2)    # Addition: 5
print(3 - 2)    # Subtraction: 1
print(3 * 2)    # Multiplication: 6
print(3 / 2)    # Division: 1.5
print(3 ** 2)   # Exponential: 9
print(3 % 2)    # Modulus (remainder): 1
print(3 // 2)   # Floor division: 1

# 3. Checking Data Types with type()
print(type(10))                  # <class 'int'>
print(type(3.14))                # <class 'float'>
print(type(1 + 3j))              # <class 'complex'>
print(type("Asabeneh"))          # <class 'str'>
print(type([1, 2, 3]))           # <class 'list'>
print(type({'name': 'Tunde'}))   # <class 'dict'>
print(type({9.8, 3.14, 2.7}))    # <class 'set'>
print(type((9.8, 3.14, 2.7)))    # <class 'tuple'>`,
    testGotcha: 'Floor division (//) truncates decimal points down to the nearest integer, whereas normal division (/) always yields a float!',
    exercises: {
      level1: [
        'Open your Python shell or the Python Lab, check your Python version, and print "Day 1 Challenge Complete".',
        'Perform the operations: 15 + 4, 15 - 4, 15 * 4, 15 / 4, 15 % 4, 15 // 4, and 15 ** 4.',
        'Write your name, country, and favorite programming language, each printed on a separate line.'
      ],
      level2: [
        'Check the data types of the following data: 10, 9.8, 3.14, 4 - 4j, ["Asabeneh", "Python", "Finland"], "Your Name", and {"country": "Nigeria"}.',
        'Explain the fundamental difference between integer division (//) and floating-point division (/) with a code example.'
      ],
      level3: [
        'Calculate the Euclidean distance between point (2, 3) and point (10, 8) using Python arithmetic operators: distance = ((x2 - x1)**2 + (y2 - y1)**2)**0.5.'
      ]
    },
    exerciseStarterCode: `# Day 1 Exercise Starter: Euclidean Distance & Data Types
# 1. Calculate distance between (2, 3) and (10, 8):
x1, y1 = 2, 3
x2, y2 = 10, 8
distance = ((x2 - x1)**2 + (y2 - y1)**2) ** 0.5
print(f"Euclidean distance: {distance:.2f}")

# 2. Check types
data = [10, 9.8, "Python", True, [1, 2], {"lang": "Python"}]
for item in data:
    print(f"Value: {item} -> Type: {type(item)}")
`,
    quickQuiz: {
      question: 'What is the output of type(10 // 3) in Python 3?',
      options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'number'>"],
      correctIndex: 1,
      explanation: 'Floor division (//) discards the fractional part and returns an integer (<class \'int\'>).'
    }
  },

  // Day 2
  {
    id: 'day_02_variables_builtin',
    sectionId: 'day-02-variables-builtin',
    dayNumber: 2,
    track: 'Python Foundations',
    category: 'Foundations',
    title: 'Day 2: Variables & Built-in Functions',
    summary: 'Understand variables, naming conventions, type casting, and essential built-ins like print(), len(), and input().',
    estimatedTime: '35 mins',
    beginnerNote: 'Variables are labeled containers holding values in computer memory. You assign data with the single equal sign (=).',
    keyPoints: [
      'Variable naming rule: must start with a letter or underscore, cannot begin with a number, and is case-sensitive.',
      'Use snake_case for Python variable names (e.g., first_name, user_age, total_score).',
      'Common built-in functions: print(), len(), type(), input(), int(), float(), str(), min(), max(), sum().',
      'Type casting: converting data from one type to another (e.g. str(100) -> "100", int("25") -> 25).',
      'Multiple variable assignment in a single line: first_name, country, age = "Tunde", "Nigeria", 24.'
    ],
    codeExample: `# Day 2: Variables & Built-in Functions
first_name = 'Asabeneh'
last_name = 'Yetayeh'
country = 'Finland'
city = 'Helsinki'
age = 250
is_married = False
skills = ['HTML', 'CSS', 'JS', 'React', 'Python']

# Multiple variable declaration in one line
first, last, role = 'Ada', 'Lovelace', 'Mathematician'

# Using built-in functions
print('First name length:', len(first_name))
print('Age type:', type(age))

# Type casting
num_str = '10'
num_int = int(num_str)
print('Typecasted int:', num_int, type(num_int))

# Math built-ins
numbers = [10, 40, 25, 90, 5]
print('Min:', min(numbers))
print('Max:', max(numbers))
print('Sum:', sum(numbers))`,
    testGotcha: 'The input() function always captures user input as a string! Always wrap it with int() or float() if you need numeric values.',
    exercises: {
      level1: [
        'Declare variables: first_name, last_name, full_name, country, city, age, year, is_married, is_true, is_light_on.',
        'Declare multiple variables on one line.',
        'Check the data type of all your variables using the type() built-in function.',
        'Find the length of your first_name using len() and compare it with your last_name length.'
      ],
      level2: [
        'Declare 5 as num_one and 4 as num_two. Add, subtract, multiply, and divide num_one and num_two.',
        'Calculate the area of a circle with radius = 30 meters (area = pi * r ** 2). Use 3.14159 for pi.',
        'Take radius as input from user, cast to float, and calculate the circumference.'
      ]
    },
    exerciseStarterCode: `# Day 2 Exercise: Circle Area & User Input
import math

radius = 30
area_of_circle = math.pi * (radius ** 2)
circum_of_circle = 2 * math.pi * radius

print(f"Radius: {radius}m")
print(f"Area: {area_of_circle:.2f} sq.m")
print(f"Circumference: {circum_of_circle:.2f} m")
`,
    quickQuiz: {
      question: 'What is the type of variable x after: x = input("Enter your age: ")?',
      options: ['int', 'float', 'str', 'Depends on what the user types'],
      correctIndex: 2,
      explanation: 'input() always returns a string (str), regardless of whether the user inputs numbers or letters.'
    }
  },

  // Day 3
  {
    id: 'day_03_operators',
    sectionId: 'day-03-operators',
    dayNumber: 3,
    track: 'Python Foundations',
    category: 'Foundations',
    title: 'Day 3: Operators & Boolean Logic',
    summary: 'Master arithmetic, comparison, logical, assignment, and identity/membership operators.',
    estimatedTime: '40 mins',
    beginnerNote: 'Operators are mathematical and logical symbols that manipulate operands. Think of comparison operators as questions: "Is 5 > 3?" returns True or False.',
    keyPoints: [
      'Arithmetic: +, -, *, /, % (remainder), // (floor quotient), ** (power).',
      'Comparison: == (equal), != (not equal), > (greater), < (less), >= (greater or equal), <= (less or equal).',
      'Logical operators: and (both True), or (at least one True), not (inverts boolean).',
      'Assignment shortcuts: +=, -=, *=, /=, //=, **=, %=.',
      'Membership operators: "in" and "not in" check presence inside sequences (strings, lists, tuples, sets).'
    ],
    codeExample: `# Day 3: Operators & Logic
a, b = 7, 3

# Arithmetic
print(f"{a} + {b} = {a + b}")
print(f"{a} // {b} = {a // b} (floor division)")
print(f"{a} % {b} = {a % b} (modulus)")

# Comparison
print("7 == 3:", a == b)      # False
print("7 != 3:", a != b)      # True
print("7 > 3:", a > b)        # True

# Logical
print("True and False:", True and False)  # False
print("True or False:", True or False)    # True
print("not True:", not True)              # False

# Membership
print("'py' in 'python':", 'py' in 'python')         # True
print("'z' not in 'python':", 'z' not in 'python')   # True`,
    testGotcha: 'Do not confuse the assignment operator (=) with the equality comparison operator (==)! Single equal assigns; double equals compares.',
    exercises: {
      level1: [
        'Declare your age as an integer variable. Declare your height as a float variable.',
        'Calculate the slope, x-intercept and y-intercept of y = 2x - 2.',
        'Check if the length of "python" is not equal to the length of "dragon".',
        'Use "and" operator to check if "on" is found in both "python" and "dragon".'
      ],
      level2: [
        'Write a Python script that prompts the user to enter hours and rate per hour to calculate pay: weekly_earning = hours * rate.',
        'Write a script that prompts the user to enter number of years and calculates how many seconds a person can live (assume 365 days per year).'
      ]
    },
    exerciseStarterCode: `# Day 3 Exercise: Salary & Time Calculations
hours = 40
rate_per_hour = 28.5
weekly_earning = hours * rate_per_hour
print(f"Hours: {hours}, Rate: USD {rate_per_hour}/hr -> Weekly: USD {weekly_earning:.2f}")

# Check 'on' in both words
word1, word2 = 'python', 'dragon'
has_on_both = ('on' in word1) and ('on' in word2)
print(f"'on' in both '{word1}' and '{word2}': {has_on_both}")
`,
    quickQuiz: {
      question: 'What is the evaluation of: not (5 > 2 and 3 < 1)?',
      options: ['True', 'False', 'None', 'SyntaxError'],
      correctIndex: 0,
      explanation: '5 > 2 is True, 3 < 1 is False. True and False is False. not False is True.'
    }
  },

  // Day 4
  {
    id: 'day_04_strings',
    sectionId: 'day-04-strings',
    dayNumber: 4,
    track: 'Python Foundations',
    category: 'Foundations',
    title: 'Day 4: Strings, Formatting & Methods',
    summary: 'Master string concatenation, escape sequences, slicing, f-strings, and string methods like split, join, and replace.',
    estimatedTime: '45 mins',
    beginnerNote: 'Strings are immutable ordered sequences of characters enclosed in quotes. Once created, individual characters cannot be changed in place.',
    keyPoints: [
      'Multi-line strings are created using triple quotes (\'\'\' or """).',
      'Escape characters: \\n for new line, \\t for tab indentation, \\\\ for backslash.',
      'String formatting: Modern f-strings (f"Hello {name}, score: {score:.2f}") are idiomatic and fast.',
      'Slicing syntax: string[start:stop:step] extracts substrings cleanly.',
      'String reversal idiom: reversed_str = text[::-1].',
      'Vital string methods: .split(), .join(), .strip(), .lower(), .upper(), .replace(), .find(), .startswith(), .endswith().'
    ],
    codeExample: `# Day 4: Strings & Methods
language = 'Python'

# 1. Indexing & Slicing
first_letter = language[0]        # 'P'
last_letter = language[-1]        # 'n'
sub = language[0:4]               # 'Pyth'
step_slice = language[0:6:2]      # 'Pto'
reversed_lang = language[::-1]    # 'nohtyP'

# 2. String Formatting (f-string)
first_name, score = 'Grace', 98.765
print(f"Student: {first_name}, Score: {score:.1f}%")

# 3. Essential String Methods
challenge = 'thirty days of python'
print(challenge.capitalize())     # 'Thirty days of python'
print(challenge.title())          # 'Thirty Days Of Python'
print(challenge.upper())          # 'THIRTY DAYS OF PYTHON'

sentence = 'Facebook, Google, Microsoft, Apple, IBM, Oracle, Amazon'
companies = sentence.split(', ')
print("Companies list:", companies)

joined = " | ".join(companies[:3])
print("Joined:", joined)`,
    testGotcha: 'Strings are immutable! Calling sentence.replace("a", "o") does NOT change sentence itself; it returns a brand new string.',
    exercises: {
      level1: [
        'Concatenate the string "Thirty", "Days", "Of", "Python" into a single string: "Thirty Days Of Python".',
        'Declare a variable named company and assign it an initial value "Coding For All".',
        'Print the length of the company string using len() method.',
        'Change all the characters of company to capital letters using upper().',
        'Cut (slice) out the first word of "Coding For All".'
      ],
      level2: [
        'Use index or find method to locate the first occurrence of "F" in "Coding For All".',
        'Use replace method to replace "Coding" in "Coding For All" with "Python".',
        'Split the string "Coding For All" using space as the separator.'
      ],
      level3: [
        'Slice out the phrase "because because because" in the sentence: "You cannot end a sentence with because because because is a conjunction".'
      ]
    },
    exerciseStarterCode: `# Day 4 Exercise: String Processing
phrase = "Coding For All"
print("Uppercase:", phrase.upper())
print("Replaced:", phrase.replace("Coding", "Python"))
print("Words list:", phrase.split(" "))
print("First letter:", phrase[0])
print("Last letter:", phrase[-1])
print("Reversed:", phrase[::-1])
`,
    quickQuiz: {
      question: 'What does "Python"[::-1] evaluate to?',
      options: ['"Python"', '"nohtyP"', '"P"', 'IndexError'],
      correctIndex: 1,
      explanation: 'The slice [::-1] steps backwards from the end of the string to the beginning, reversing it.'
    }
  },

  // Day 5
  {
    id: 'day_05_lists',
    sectionId: 'day-05-lists',
    dayNumber: 5,
    track: 'Python Foundations',
    category: 'Foundations',
    title: 'Day 5: Lists & List Operations',
    summary: 'Master lists: indexing, slicing, mutability, unpacking, and list methods (append, insert, pop, remove, sort).',
    estimatedTime: '50 mins',
    beginnerNote: 'Lists are mutable ordered collections in square brackets []. You can add, delete, sort, and modify items at will.',
    keyPoints: [
      'Lists preserve insertion order and allow duplicate elements: [1, 2, 2, 3].',
      'Lists are mutable: items can be reassigned directly in place via indexing: list[0] = "new".',
      'Adding elements: .append(item) adds to end; .insert(index, item) inserts at specified position; .extend(iterable) appends all items.',
      'Removing elements: .pop(index) removes and returns element; .remove(value) deletes first occurrence; .clear() empties list.',
      'Sorting: list.sort() sorts in place and returns None; sorted(list) returns a brand new sorted list.',
      'List slicing: list[start:stop:step] returns a shallow copy of that range.'
    ],
    codeExample: `# Day 5: Lists & Methods
fruits = ['banana', 'orange', 'mango', 'lemon']

# 1. Modifying items (Mutability)
fruits[0] = 'avocado'
print("Modified fruits:", fruits)

# 2. Adding elements
fruits.append('apple')
fruits.insert(2, 'strawberry')
print("After append & insert:", fruits)

# 3. Removing elements
popped_item = fruits.pop()      # Removes and returns last item ('apple')
fruits.remove('mango')          # Removes 'mango'
print("Popped:", popped_item)
print("After removals:", fruits)

# 4. Sorting & Reversal
numbers = [4, 1, 9, 2, 8, 3]
numbers.sort()
print("Sorted in-place:", numbers)
numbers.reverse()
print("Reversed:", numbers)

# 5. List unpacking
first, *middle, last = [10, 20, 30, 40, 50]
print("First:", first, "Middle:", middle, "Last:", last)`,
    testGotcha: 'my_list.sort() returns None! If you write x = my_list.sort(), x will be None. Always use x = sorted(my_list) if you want a new variable.',
    exercises: {
      level1: [
        'Declare an empty list. Declare a list with more than 5 items.',
        'Find the length of your list.',
        'Get the first item, the middle item, and the last item of the list.',
        'Declare a list called mixed_data_types: put your name, age, height, marital status, and address.'
      ],
      level2: [
        'Declare a list variable named it_companies: ["Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"].',
        'Add a new company to it_companies using .append().',
        'Insert an IT company in the middle of the companies list using .insert().',
        'Change one of the it_companies names to uppercase (IBM excluded!).',
        'Sort the list using .sort() method and reverse the list in descending order.'
      ],
      level3: [
        'Given the list of 10 students ages: [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]. Sort the list and find the min and max age. Find the median age.'
      ]
    },
    exerciseStarterCode: `# Day 5 Exercise: List Manipulation
ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]
ages.sort()
min_age = ages[0]
max_age = ages[-1]
median_age = (ages[len(ages)//2 - 1] + ages[len(ages)//2]) / 2 if len(ages) % 2 == 0 else ages[len(ages)//2]

print(f"Sorted ages: {ages}")
print(f"Min: {min_age}, Max: {max_age}, Median: {median_age}")
`,
    quickQuiz: {
      question: 'What is the return value of myList.append("item")?',
      options: ['The new length of the list', 'The modified list', 'None', 'Boolean True'],
      correctIndex: 2,
      explanation: 'In Python, .append() modifies the list in place and returns None.'
    }
  }
];
