import { StudyModule } from '../../types';

export const TRACK3_CONTROL_FUNCTIONS: StudyModule[] = [
  // Day 9
  {
    id: 'day_09_conditionals',
    sectionId: 'day-09-conditionals',
    dayNumber: 9,
    track: 'Control Flow & Functions',
    category: 'Control Flow',
    title: 'Day 9: Conditionals & Decision Making',
    summary: 'Master control flow: if, elif, else, nested conditions, logical comparisons, and shorthand ternary expressions.',
    estimatedTime: '35 mins',
    beginnerNote: 'Conditionals are traffic junctions in your code. Depending on whether a condition is True or False, your program chooses which branch to travel down.',
    keyPoints: [
      'Syntax: if condition: code_block elif other_condition: code_block else: fallback_code.',
      'Indentation is mandatory: lines belonging to the condition must be indented 4 spaces.',
      'Shorthand Ternary: value_if_true if condition else value_if_false.',
      'Logical operators in conditions: combining with "and", "or", and "not".',
      'Truthy & Falsy values: Empty lists [], empty strings "", 0, and None evaluate to False in conditions.'
    ],
    codeExample: `# Day 9: Conditionals in Python
score = 85

# 1. Standard if-elif-else chain
if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
elif score >= 60:
    grade = 'D'
else:
    grade = 'F'

print(f"Score: {score} -> Grade: {grade}")

# 2. Shorthand Ternary Operator
age = 20
status = "Adult" if age >= 18 else "Minor"
print(f"Age {age}: {status}")

# 3. Truthy / Falsy check
cart = ['Laptop', 'Mouse']
if cart:
    print(f"Cart has {len(cart)} items ready for checkout.")
else:
    print("Cart is empty.")`,
    testGotcha: 'In an if-elif-else ladder, as soon as ONE condition evaluates to True, Python executes its block and SKIPS all remaining elif and else branches!',
    exercises: {
      level1: [
        'Get user input using input("Enter your age: "). If user is 18 or older, give feedback: "You are old enough to learn to drive". If under 18, give feedback to wait for the missing amount of years.',
        'Compare the values of my_age and your_age using if-else. Who is older? Print the difference in years.'
      ],
      level2: [
        'Write a code which gives grades to students according to their scores: 80-100: A, 70-79: B, 60-69: C, 50-59: D, 0-49: F.',
        'Check if the season is Autumn, Winter, Spring or Summer based on user entered month.'
      ],
      level3: [
        'If a fruit already exists in the list fruits = ["banana", "orange", "mango", "lemon"], print "That fruit already exists in the list". If not, add the fruit to the list and print the modified list.'
      ]
    },
    exerciseStarterCode: `# Day 9 Exercise: Grading & Seasons
score = 78
if 80 <= score <= 100:
    grade = 'A'
elif 70 <= score < 80:
    grade = 'B'
elif 60 <= score < 70:
    grade = 'C'
else:
    grade = 'F'
print(f"Score: {score} -> Grade: {grade}")

month = "October"
if month in ["September", "October", "November"]:
    season = "Autumn"
elif month in ["December", "January", "February"]:
    season = "Winter"
elif month in ["March", "April", "May"]:
    season = "Spring"
else:
    season = "Summer"
print(f"Month: {month} -> Season: {season}")
`,
    quickQuiz: {
      question: 'What is the value of result after: result = "Pass" if 65 >= 70 else "Review"?',
      options: ['"Pass"', '"Review"', 'None', 'SyntaxError'],
      correctIndex: 1,
      explanation: '65 >= 70 is False, so the ternary operator picks the else expression ("Review").'
    }
  },

  // Day 10
  {
    id: 'day_10_loops',
    sectionId: 'day-10-loops',
    dayNumber: 10,
    track: 'Control Flow & Functions',
    category: 'Control Flow',
    title: 'Day 10: Loops (While, For, Range, Enumerate)',
    summary: 'Master iteration: while loops, for loops, loop control (break, continue, pass), range() generator, and enumerate().',
    estimatedTime: '45 mins',
    beginnerNote: 'Loops automate repetition. Instead of writing 100 print statements, a loop repeats code while a condition is True or over each item in a collection.',
    keyPoints: [
      'while loop: repeats execution as long as its condition remains True. Be sure to increment your counter to avoid infinite loops!',
      'for loop: iterates through each element in an iterable (list, string, dictionary, range).',
      'break: immediately terminates the enclosing loop.',
      'continue: skips the remainder of the current iteration and jumps to the next iteration.',
      'range(start, stop, step): generates an arithmetic sequence of numbers (stop is exclusive).',
      'enumerate(iterable): gives you both index and value simultaneously: for idx, item in enumerate(items).'
    ],
    codeExample: `# Day 10: Loops in Python
# 1. While loop
count = 0
while count < 3:
    print(f"While count: {count}")
    count += 1

# 2. For loop with range()
print("\\nCounting by twos:")
for i in range(0, 10, 2):
    print(i, end=" ")
print()

# 3. For loop over collection with enumerate
languages = ['Python', 'Rust', 'Go', 'TypeScript']
print("\\nEnumerate languages:")
for idx, lang in enumerate(languages, start=1):
    print(f"  {idx}. {lang}")

# 4. Break and Continue
print("\\nEvens only under 10 (skipping 4):")
for n in range(10):
    if n == 4:
        continue  # skip 4
    if n % 2 == 0:
        print(n, end=" ")
print()`,
    testGotcha: 'In range(0, 10), the number 10 is NEVER generated! Range stops at stop - 1, producing 0 through 9.',
    exercises: {
      level1: [
        'Iterate 0 to 10 using for loop, do the same using while loop.',
        'Iterate 10 to 0 using for loop, do the same using while loop.',
        'Write a loop that makes seven calls to print(), so we get on the output a triangle with #.'
      ],
      level2: [
        'Use for loop to iterate from 0 to 100 and print the sum of all numbers: "The sum of all numbers is 5050".',
        'Use for loop to iterate from 0 to 100 and print the sum of all evens and the sum of all odds.'
      ],
      level3: [
        'Iterate through the list of countries: ["Finland", "Nigeria", "Ghana", "Iceland", "Sweden", "Norway"] and extract all countries containing the word "land".'
      ]
    },
    exerciseStarterCode: `# Day 10 Exercise: Triangle & Sum of Numbers
# 1. Triangle pattern
for i in range(1, 8):
    print("#" * i)

# 2. Sum of all numbers 0 to 100
total_sum = sum(range(101))
evens_sum = sum(i for i in range(101) if i % 2 == 0)
odds_sum = sum(i for i in range(101) if i % 2 != 0)
print(f"Total: {total_sum}, Evens: {evens_sum}, Odds: {odds_sum}")
`,
    quickQuiz: {
      question: 'How many times will print("Hi") run in: for i in range(1, 5): print("Hi")?',
      options: ['5 times', '4 times', '1 time', 'Infinite'],
      correctIndex: 1,
      explanation: 'range(1, 5) generates values [1, 2, 3, 4], which has exactly 4 numbers, so the loop executes 4 times.'
    }
  },

  // Day 11
  {
    id: 'day_11_functions',
    sectionId: 'day-11-functions',
    dayNumber: 11,
    track: 'Control Flow & Functions',
    category: 'Functions',
    title: 'Day 11: Functions & Parameter Mastery',
    summary: 'Write reusable code blocks: parameters, return values, default arguments, *args (variable positionals), and **kwargs (variable keywords).',
    estimatedTime: '50 mins',
    beginnerNote: 'A function is a reusable machine. You pass raw materials (parameters) into it, it processes them, and outputs a manufactured result (return value).',
    keyPoints: [
      'Functions are declared with "def function_name(parameters):".',
      'Return statement: ends function execution and hands the result back to the caller. Without return, a function returns None.',
      'Default parameters: def greet(name="Student"): allows calling without an argument.',
      '*args allows accepting an arbitrary number of positional arguments as a tuple.',
      '**kwargs allows accepting an arbitrary number of keyword arguments as a dictionary.',
      'Scope: variables declared inside a function are local to that function.'
    ],
    codeExample: `# Day 11: Functions in Python
# 1. Function with default parameters
def calculate_weight(mass, gravity=9.81):
    """Calculates weight in Newtons: w = m * g"""
    return round(mass * gravity, 2)

print("Weight on Earth (default g):", calculate_weight(75), "N")
print("Weight on Moon (g=1.62):", calculate_weight(75, 1.62), "N")

# 2. Arbitrary positional arguments (*args)
def sum_all_numbers(*args):
    total = sum(args)
    return total

print("Sum 3 numbers:", sum_all_numbers(2, 3, 5))
print("Sum 6 numbers:", sum_all_numbers(10, 20, 30, 40, 50, 60))

# 3. Arbitrary keyword arguments (**kwargs)
def print_student_profile(**kwargs):
    print("--- Student Profile ---")
    for key, value in kwargs.items():
        print(f"  {key.title()}: {value}")

print_student_profile(name="Zainab", track="Python", level="Advanced", streak=14)`,
    testGotcha: 'Parameters with default values MUST always be placed AFTER parameters without defaults in the function definition header!',
    exercises: {
      level1: [
        'Declare a function add_two_numbers. It takes two parameters and it returns a sum.',
        'Area of a circle is calculated as follows: area = pi * r * r. Write a function that calculates area_of_circle.',
        'Write a function called add_all_nums which takes arbitrary number of arguments (*args) and sums all the arguments.'
      ],
      level2: [
        'Temperature in °C can be converted to °F using this formula: °F = (°C * 9/5) + 32. Write a function which converts °C to °F, convert_celsius_to_fahrenheit.',
        'Write a function check_season, it takes a month parameter and returns the season: Autumn, Winter, Spring or Summer.'
      ],
      level3: [
        'Declare a function named is_prime, which checks if a number is prime.',
        'Write a function which checks if all items are unique in the list.'
      ]
    },
    exerciseStarterCode: `# Day 11 Exercise: Prime Checker & Unique Items
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

def all_unique(items):
    return len(items) == len(set(items))

print("Is 17 prime:", is_prime(17))
print("Is 24 prime:", is_prime(24))
print("Are [1, 2, 3, 4] unique:", all_unique([1, 2, 3, 4]))
print("Are [1, 2, 2, 3] unique:", all_unique([1, 2, 2, 3]))
`,
    quickQuiz: {
      question: 'What does a Python function return if it does not contain an explicit return statement?',
      options: ['0', 'False', 'None', 'SyntaxError'],
      correctIndex: 2,
      explanation: 'In Python, any function that finishes without executing an explicit return statement automatically returns None.'
    }
  },

  // Day 12
  {
    id: 'day_12_modules',
    sectionId: 'day-12-modules',
    dayNumber: 12,
    track: 'Control Flow & Functions',
    category: 'Modules',
    title: 'Day 12: Modules & Standard Library',
    summary: 'Organize code into reusable packages: built-in standard library (math, random, os, sys, datetime) and custom module imports.',
    estimatedTime: '40 mins',
    beginnerNote: 'A module is simply a Python file (.py) containing functions, classes, and variables that you can import into another file to avoid reinventing the wheel.',
    keyPoints: [
      'Importing syntax: import math, from math import sqrt, pi, or import math as m.',
      'Math module: math.pi, math.sqrt(), math.ceil(), math.floor(), math.pow().',
      'Random module: random.random() (0..1), random.randint(min, max), random.choice(list), random.shuffle(list).',
      'String module: string.ascii_letters, string.digits, string.punctuation.',
      'Sys & OS modules: sys.version, sys.argv, os.getcwd(), os.listdir().',
      'Creating your own module: save functions in my_module.py and import my_module.'
    ],
    codeExample: `# Day 12: Modules & Standard Library
import math
import random
import string

# 1. Math module
print("Value of PI:", math.pi)
print("Square root of 144:", math.sqrt(144))
print("Floor 4.9:", math.floor(4.9))

# 2. Random module
print("Random integer 1..100:", random.randint(1, 100))
fruits = ['Apple', 'Banana', 'Mango', 'Peach']
print("Random choice from fruits:", random.choice(fruits))

# 3. Generating a random 6-character alphanumeric ID
def generate_user_id():
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(6))

print("Generated User ID:", generate_user_id())`,
    testGotcha: 'Avoid writing "from module import *" in production! It clutters your namespace and makes it difficult to trace where functions originated.',
    exercises: {
      level1: [
        'Write a function which generates a random_user_id() consisting of 6 alphanumeric characters.',
        'Modify the function so it accepts a parameter length: user_id_gen_by_user(length).',
        'Write a function named rgb_color_gen that generates rgb colors (e.g. "rgb(125, 244, 255)").'
      ],
      level2: [
        'Write a function list_of_hexa_colors which returns any number of hexadecimal colors in an array.',
        'Write a function generate_colors which can generate any number of hexa or rgb colors based on type argument.'
      ]
    },
    exerciseStarterCode: `# Day 12 Exercise: Color & ID Generators
import random

def rgb_color_gen():
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    return f"rgb({r}, {g}, {b})"

print("Generated RGB:", rgb_color_gen())
`,
    quickQuiz: {
      question: 'Which random function generates an integer inclusive of both endpoints a and b?',
      options: ['random.random(a, b)', 'random.randint(a, b)', 'random.range(a, b)', 'random.choice(a, b)'],
      correctIndex: 1,
      explanation: 'random.randint(a, b) returns a random integer N such that a <= N <= b (inclusive of both endpoints).'
    }
  },

  // Day 13
  {
    id: 'day_13_list_comprehensions',
    sectionId: 'day-13-list-comprehensions',
    dayNumber: 13,
    track: 'Control Flow & Functions',
    category: 'Advanced Python',
    title: 'Day 13: List Comprehensions & Lambda',
    summary: 'Write concise, elegant, idiomatic Python: compact list creation, filtering conditions, and anonymous lambda functions.',
    estimatedTime: '45 mins',
    beginnerNote: 'List comprehension is Python\'s shorthand for transforming or filtering lists in a single elegant line instead of writing a multi-line for loop with .append().',
    keyPoints: [
      'Syntax: [expression for item in iterable if condition].',
      'Filtering: [x for x in numbers if x % 2 == 0] captures only even numbers.',
      'Transforming: [x ** 2 for x in numbers] calculates squares.',
      'Flattening 2D lists: [item for row in matrix for item in row].',
      'Lambda functions: anonymous one-line functions defined with lambda: square = lambda x: x ** 2.'
    ],
    codeExample: `# Day 13: List Comprehension & Lambda
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 1. List Comprehension: Squares of even numbers
even_squares = [x ** 2 for x in numbers if x % 2 == 0]
print("Squares of evens:", even_squares)

# 2. String transformation
names = ['asabeneh', 'david', 'grace', 'tunde']
uppercase_names = [name.upper() for name in names]
print("Uppercase names:", uppercase_names)

# 3. Flattening a 2D Matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
print("Flattened matrix:", flattened)

# 4. Lambda function
multiply = lambda a, b: a * b
print("Lambda multiply(6, 7):", multiply(6, 7))`,
    testGotcha: 'Do not overload list comprehensions with too many nested loops and conditions; prioritize readability over cramming complex logic into one line!',
    exercises: {
      level1: [
        'Filter only negative and zero in the list using list comprehension: numbers = [-4, -3, -2, -1, 0, 2, 4, 6].',
        'Flatten the following list of lists of lists to a one-dimensional list: list_of_lists = [[[1, 2, 3]], [[4, 5, 6]], [[7, 8, 9]]].',
        'Using list comprehension create the following list of tuples: [(0, 1, 0, 0, 0, 0, 0), (1, 1, 1, 1, 1, 1, 1), (2, 1, 2, 4, 8, 16, 32)...].'
      ],
      level2: [
        'Change the following list of lists to a list of concatenated strings: countries = [[("Finland", "Helsinki")], [("Sweden", "Stockholm")], [("Norway", "Oslo")]]. Output: [["FINLAND", "HELSINKI"], ...].'
      ]
    },
    exerciseStarterCode: `# Day 13 Exercise: List Comprehension Filtering
numbers = [-4, -3, -2, -1, 0, 2, 4, 6]
negative_and_zero = [n for n in numbers if n <= 0]
print("Negative and zero:", negative_and_zero)

matrix_3d = [[[1, 2, 3]], [[4, 5, 6]], [[7, 8, 9]]]
flattened = [num for sub1 in matrix_3d for sub2 in sub1 for num in sub2]
print("Flattened 3D:", flattened)
`,
    quickQuiz: {
      question: 'What is the result of [x for x in range(5) if x % 2 != 0]?',
      options: ['[0, 2, 4]', '[1, 3]', '[1, 3, 5]', '[2, 4]'],
      correctIndex: 1,
      explanation: 'range(5) produces [0, 1, 2, 3, 4]. The condition x % 2 != 0 filters for odd numbers, yielding [1, 3].'
    }
  },

  // Day 14
  {
    id: 'day_14_higher_order_functions',
    sectionId: 'day-14-higher-order-functions',
    dayNumber: 14,
    track: 'Control Flow & Functions',
    category: 'Advanced Python',
    title: 'Day 14: Higher Order Functions, Closures & Decorators',
    summary: 'Master functional programming concepts: map(), filter(), reduce(), closures, and function decorators (@decorator).',
    estimatedTime: '55 mins',
    beginnerNote: 'A Higher-Order Function is a function that can take other functions as arguments, or return a function as its output. Functions in Python are first-class citizens!',
    keyPoints: [
      'map(function, iterable): applies the function to every item in the iterable.',
      'filter(function, iterable): tests every item with a boolean function, keeping only True matches.',
      'reduce(function, iterable): from functools, progressively combines elements into a single accumulated result.',
      'Closure: an inner function that remembers and has access to variables in its outer enclosing scope even after the outer function finishes.',
      'Decorator (@): a design pattern that extends or modifies the behavior of a function without directly changing its code.'
    ],
    codeExample: `# Day 14: Higher Order Functions & Decorators
from functools import reduce

numbers = [1, 2, 3, 4, 5]

# 1. map(): Double each number
doubled = list(map(lambda x: x * 2, numbers))
print("Doubled with map:", doubled)

# 2. filter(): Only numbers greater than 2
greater_than_two = list(filter(lambda x: x > 2, numbers))
print("Filtered > 2:", greater_than_two)

# 3. reduce(): Calculate product of all numbers
product = reduce(lambda acc, x: acc * x, numbers)
print("Product with reduce:", product)

# 4. Decorator Pattern
def uppercase_decorator(function):
    def wrapper():
        result = function()
        return result.upper()
    return wrapper

@uppercase_decorator
def get_greeting():
    return "welcome to 30 days of python"

print("Decorated greeting:", get_greeting())`,
    testGotcha: 'map() and filter() in Python 3 return lazy iterators! Remember to convert them with list(map(...)) if you need to print or index their values.',
    exercises: {
      level1: [
        'Explain the difference between map, filter, and reduce with your own words.',
        'Use map to create a new list by changing each country to uppercase: countries = ["Estonia", "Finland", "Sweden", "Denmark", "Norway", "Iceland"].',
        'Use filter to filter out countries containing "land".',
        'Use filter to filter out countries having exactly six characters.'
      ],
      level2: [
        'Use reduce to sum all the numbers in the numbers list.',
        'Use reduce to concatenate all countries to produce this sentence: "Estonia, Finland, Sweden, Denmark, Norway, and Iceland are north European countries".'
      ]
    },
    exerciseStarterCode: `# Day 14 Exercise: Map, Filter, Reduce
from functools import reduce

countries = ["Estonia", "Finland", "Sweden", "Denmark", "Norway", "Iceland"]
uppercase_countries = list(map(lambda c: c.upper(), countries))
land_countries = list(filter(lambda c: "land" in c.lower(), countries))

print("Uppercase:", uppercase_countries)
print("Contains 'land':", land_countries)
`,
    quickQuiz: {
      question: 'Which module must you import in Python 3 to use the reduce() function?',
      options: ['math', 'itertools', 'functools', 'collections'],
      correctIndex: 2,
      explanation: 'In Python 3, reduce() was moved from built-ins to the standard library module "functools".'
    }
  }
];
