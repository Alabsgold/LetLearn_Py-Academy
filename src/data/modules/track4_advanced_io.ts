import { StudyModule } from '../../types';

export const TRACK4_ADVANCED_IO: StudyModule[] = [
  // Day 15
  {
    id: 'day_15_python_error_types',
    sectionId: 'day-15-python-error-types',
    dayNumber: 15,
    track: 'Python Mastery & I/O',
    category: 'Error Handling',
    title: 'Day 15: Python Error Types & Debugging',
    summary: 'Diagnose and understand Python error types: SyntaxError, NameError, IndexError, ModuleNotFoundError, AttributeError, KeyError, TypeError, ValueError, and ZeroDivisionError.',
    estimatedTime: '35 mins',
    beginnerNote: 'Errors are not failures; they are helpful diagnostic messages from Python pinpointing the exact line and reason why execution halted. Reading tracebacks is a programmer superpower.',
    keyPoints: [
      'SyntaxError: Invalid Python grammar (missing colon, unclosed quote, mismatched parentheses).',
      'NameError: Accessing a variable or function that has not been defined or assigned yet.',
      'IndexError: Attempting to access an index outside the boundaries of a sequence.',
      'ModuleNotFoundError: Trying to import a module that is not installed or spelled incorrectly.',
      'AttributeError: Calling a method or attribute that does not exist on that object type (e.g. [1, 2].upper()).',
      'KeyError: Accessing a dictionary key that does not exist.',
      'TypeError: Performing an operation on an inappropriate type (e.g. "age: " + 25).',
      'ValueError: A function receives an argument of right type but inappropriate value (e.g. int("cat")).',
      'ZeroDivisionError: Dividing any number by zero (e.g. 10 / 0).'
    ],
    codeExample: `# Day 15: Diagnosing Python Error Types
# 1. TypeError: Trying to add str and int
try:
    result = "Total: " + 100
except TypeError as e:
    print("Caught TypeError:", e)

# 2. IndexError: Out of range
items = [10, 20]
try:
    print(items[5])
except IndexError as e:
    print("Caught IndexError:", e)

# 3. KeyError: Missing dictionary key
user = {'name': 'Tunde'}
try:
    print(user['email'])
except KeyError as e:
    print("Caught KeyError for key:", e)

# 4. ValueError: Invalid literal for int()
try:
    number = int("NotANumber")
except ValueError as e:
    print("Caught ValueError:", e)

# 5. ZeroDivisionError
try:
    answer = 42 / 0
except ZeroDivisionError as e:
    print("Caught ZeroDivisionError:", e)`,
    testGotcha: 'SyntaxError happens before code runs (at compile time) and cannot be caught with a standard try-except block in the same file!',
    exercises: {
      level1: [
        'Open the Python interactive shell and deliberately trigger: SyntaxError, NameError, IndexError, ModuleNotFoundError, AttributeError, KeyError, TypeError, ImportError, ValueError, ZeroDivisionError.',
        'Document why each error occurred and what code fix resolves it.'
      ]
    },
    exerciseStarterCode: `# Day 15 Exercise: Reproducing and Fixing Common Errors
# Fix 1: TypeError
# Broken: "Age is " + 25
fixed_type = "Age is " + str(25)
print(fixed_type)

# Fix 2: KeyError
user = {'username': 'coder123'}
# Broken: user['role']
fixed_key = user.get('role', 'standard_user')
print("Role:", fixed_key)
`,
    quickQuiz: {
      question: 'Which error is raised when executing: int("3.14")?',
      options: ['TypeError', 'ValueError', 'SyntaxError', 'FloatError'],
      correctIndex: 1,
      explanation: 'int() expects a valid integer string representation (like "3"). "3.14" has a decimal point, raising ValueError: invalid literal for int() with base 10.'
    }
  },

  // Day 16
  {
    id: 'day_16_datetime',
    sectionId: 'day-16-datetime',
    dayNumber: 16,
    track: 'Python Mastery & I/O',
    category: 'Standard Library',
    title: 'Day 16: Python Datetime & Timestamps',
    summary: 'Handle dates, times, timestamps, and intervals using the standard library datetime, date, time, strftime, and timedelta.',
    estimatedTime: '40 mins',
    beginnerNote: 'Time is notoriously tricky with leap years and timezones. Python\'s datetime module takes care of the complex math so you can format and calculate intervals accurately.',
    keyPoints: [
      'datetime.now(): returns the current date and time with year, month, day, hour, minute, second, microsecond.',
      'strftime (String Format Time): formats datetime objects into custom text strings (e.g. %Y-%m-%d %H:%M:%S).',
      'strptime (String Parse Time): parses raw date strings back into datetime objects.',
      'timedelta: calculates differences between two points in time (e.g. new_year - today).',
      'timestamp(): converts datetime into POSIX seconds elapsed since January 1, 1970.'
    ],
    codeExample: `# Day 16: Python Datetime
from datetime import datetime, date, timedelta

# 1. Getting current date and time
now = datetime.now()
print(f"Current Date & Time: {now}")
print(f"Year: {now.year}, Month: {now.month}, Day: {now.day}")

# 2. Formatting Date with strftime()
# %d: day, %m: month, %Y: full year, %H: hour, %M: min, %S: sec
formatted_now = now.strftime("%A, %d %B %Y - %I:%M %p")
print("Human-readable format:", formatted_now)

# 3. Parsing Date string with strptime()
date_string = "26 September, 2026"
parsed_date = datetime.strptime(date_string, "%d %B, %Y")
print("Parsed date object:", parsed_date)

# 4. Time difference using timedelta
target_date = datetime(2027, 1, 1)
time_remaining = target_date - now
print(f"Days until New Year 2027: {time_remaining.days} days")

# 5. Adding time (e.g. 30 days from now)
thirty_days_later = now + timedelta(days=30)
print(f"Date in 30 days: {thirty_days_later.strftime('%Y-%m-%d')}")`,
    testGotcha: 'Remember: strftime formats datetime TO string ("format"). strptime parses string TO datetime ("parse").',
    exercises: {
      level1: [
        'Get the current day, month, year, hour, minute and timestamp from datetime module.',
        'Format the current date using this format: "%m/%d/%Y, %H:%M:%S".',
        'Today is 5 December, 2019. Change this time string to time.'
      ],
      level2: [
        'Calculate the time difference between now and new year.',
        'Calculate the time difference between 1 January 1970 and now.',
        'Think, what can you use the datetime module for? (e.g. time stamping activities, tracking streaks).'
      ]
    },
    exerciseStarterCode: `# Day 16 Exercise: Countdown to New Year
from datetime import datetime

current = datetime.now()
print("Formatted Date:", current.strftime("%B %d, %Y - %H:%M:%S"))

new_year = datetime(current.year + 1, 1, 1)
diff = new_year - current
print(f"Time until next New Year: {diff.days} days and {diff.seconds // 3600} hours")
`,
    quickQuiz: {
      question: 'Which method converts a formatted date string into a datetime object?',
      options: ['datetime.strftime()', 'datetime.strptime()', 'datetime.parse()', 'datetime.from_string()'],
      correctIndex: 1,
      explanation: 'datetime.strptime() (string parse time) parses string data according to a format string.'
    }
  },

  // Day 17
  {
    id: 'day_17_exception_handling',
    sectionId: 'day-17-exception-handling',
    dayNumber: 17,
    track: 'Python Mastery & I/O',
    category: 'Error Handling',
    title: 'Day 17: Exception Handling & Unpacking',
    summary: 'Build crash-resilient programs: try, except, else, finally blocks, raising custom exceptions, and advanced unpacking (* and **).',
    estimatedTime: '45 mins',
    beginnerNote: 'Exception handling is an airbag for your code. When unexpected conditions occur (like missing files or bad network calls), your code catches the impact gracefully without crashing.',
    keyPoints: [
      'try: contains code that might trigger an exception.',
      'except ExceptionType as err: catches and handles specific error types gracefully.',
      'else: runs only if the try block succeeded without any errors.',
      'finally: executes unconditionally whether an error occurred or not (perfect for closing files/sockets).',
      'raise: deliberately throws an exception when invalid states occur.',
      'Unpacking with *: [1, *[2, 3], 4] -> [1, 2, 3, 4].',
      'Unpacking with **: {**dict1, **dict2} merges dictionaries.'
    ],
    codeExample: `# Day 17: Exception Handling & Unpacking
def divide_numbers(numerator, denominator):
    try:
        val1 = float(numerator)
        val2 = float(denominator)
        result = val1 / val2
    except ValueError:
        return "Error: Both arguments must be numeric values."
    except ZeroDivisionError:
        return "Error: Cannot divide by zero."
    else:
        # Runs only if NO exception occurred
        return f"Result: {result:.2f}"
    finally:
        # Runs ALWAYS
        pass

print(divide_numbers(10, 2))       # Result: 5.00
print(divide_numbers(10, 0))       # Error: Cannot divide by zero.
print(divide_numbers("ten", 2))    # Error: Both arguments must be numeric values.

# Advanced Unpacking (* and **)
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined_list = [*list1, *list2, 7, 8]
print("\\nMerged list:", combined_list)

user_basic = {'name': 'Grace', 'role': 'Developer'}
user_meta = {'city': 'Lagos', 'active': True}
merged_user = {**user_basic, **user_meta, 'role': 'Lead Developer'}
print("Merged user dictionary:", merged_user)`,
    testGotcha: 'Never use a bare "except:" without specifying exception types in production! It intercepts keyboard interrupts (Ctrl+C) and system exit signals.',
    exercises: {
      level1: [
        'Write a function that asks for an integer and prints its square, handling ValueError gracefully in a loop until valid input is given.',
        'Unpack the first five countries and store the remaining countries in a list scandic_countries: names = ["Finland", "Sweden", "Norway", "Denmark", "Iceland", "Estonia", "Russia"].'
      ]
    },
    exerciseStarterCode: `# Day 17 Exercise: Safe Converter & Unpacking
names = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland', 'Estonia', 'Russia']
nordic1, nordic2, nordic3, nordic4, nordic5, *es_countries = names

print("First five:", [nordic1, nordic2, nordic3, nordic4, nordic5])
print("Remaining countries:", es_countries)
`,
    quickQuiz: {
      question: 'When does the "else" block execute in a try-except-else-finally structure?',
      options: ['When an exception occurs', 'Only if NO exception occurred in try', 'Always, right before finally', 'Never'],
      correctIndex: 1,
      explanation: 'The else block in a try-except construct executes ONLY if the try block completes successfully without raising any exceptions.'
    }
  },

  // Day 18
  {
    id: 'day_18_regular_expressions',
    sectionId: 'day-18-regular-expressions',
    dayNumber: 18,
    track: 'Python Mastery & I/O',
    category: 'Text Processing',
    title: 'Day 18: Regular Expressions (Regex)',
    summary: 'Search, validate, and manipulate text patterns using Python\'s re module: match, search, findall, sub, split, and pattern syntax.',
    estimatedTime: '55 mins',
    beginnerNote: 'Regular Expressions are pattern recipes for text. For example, "\\d+" matches one or more digits, and "^[a-zA-Z0-9]+@[a-z]+\\.[a-z]+" validates email addresses.',
    keyPoints: [
      'Import standard module: import re.',
      're.match(): checks for a pattern match only at the beginning of the string.',
      're.search(): searches for the first occurrence anywhere in the string.',
      're.findall(): returns a list of all matching substrings.',
      're.sub(): replaces occurrences of a pattern with a replacement string.',
      're.split(): splits string by regex pattern.',
      'Key meta-characters: ^ (start), $ (end), . (any character), \\d (digit), \\w (alphanumeric), \\s (whitespace), + (1 or more), * (0 or more), ? (0 or 1).'
    ],
    codeExample: `# Day 18: Regular Expressions in Python
import re

text = "Python was created by Guido van Rossum and released in 1991. Python 3.12 is fast."

# 1. findall(): Find all years/numbers in text
numbers = re.findall(r'\\d+', text)
print("Found numbers:", numbers)  # ['1991', '3', '12']

# 2. Case-insensitive search
match = re.search(r'python', text, re.IGNORECASE)
if match:
    print(f"Found '{match.group()}' at index {match.start()}-{match.end()}")

# 3. sub(): Clean text by replacing patterns
dirty_text = "%I $am@% a %tea@cher%, &and& I lo%#ve %tea@ching%;."
clean_text = re.sub(r'[%$@&#;]', '', dirty_text)
print("Cleaned text:", clean_text)

# 4. Validating an email address pattern
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email))

print("Is 'dev@letlearn.org' valid:", is_valid_email("dev@letlearn.org"))
print("Is 'invalid-email' valid:", is_valid_email("invalid-email"))`,
    testGotcha: 'Always prefix regex pattern strings with r (raw string), like r"\\d+", to prevent Python from misinterpreting escape backslashes!',
    exercises: {
      level1: [
        'What is the most frequent word in the paragraph: "Love is the best thing in this world. Some found their love and some are still looking for their love." Count occurrences using re and collections.Counter.',
        'Extract all the numbers from this text: "The position of a particle on the horizontal x-axis is -12, -4, -3 and -1 in the negative direction, 0 at origin, 4 and 8 in the positive direction."'
      ],
      level2: [
        'Write a function called is_valid_variable which checks if a variable name is a valid Python identifier using regex (e.g. first_name -> True, 1first_name -> False).',
        'Clean the sentence "%I $am@% a %tea@cher%, &and& I lo%#ve %tea@ching%." and find the three most frequent words.'
      ]
    },
    exerciseStarterCode: `# Day 18 Exercise: Regex Word Counter & Validator
import re
from collections import Counter

paragraph = "Love is the best thing in this world. Some found their love and some are still looking for their love."
words = re.findall(r'\\w+', paragraph.lower())
counts = Counter(words)
print("Top 3 words:", counts.most_common(3))

def is_valid_variable(name):
    return bool(re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', name))

print("is_valid_variable('my_var'):", is_valid_variable('my_var'))
print("is_valid_variable('2nd_var'):", is_valid_variable('2nd_var'))
`,
    quickQuiz: {
      question: 'Which regex meta-character matches "one or more" occurrences of the preceding character?',
      options: ['*', '+', '?', '^'],
      correctIndex: 1,
      explanation: '+ matches 1 or more occurrences. * matches 0 or more, and ? matches 0 or 1.'
    }
  },

  // Day 19
  {
    id: 'day_19_file_handling',
    sectionId: 'day-19-file-handling',
    dayNumber: 19,
    track: 'Python Mastery & I/O',
    category: 'File Handling',
    title: 'Day 19: File Handling (TXT, JSON, CSV)',
    summary: 'Read and write persistent files: open() modes (\'r\', \'w\', \'a\'), the with context manager, JSON serialization, and CSV processing.',
    estimatedTime: '50 mins',
    beginnerNote: 'File handling lets your Python programs save data permanently to the disk and read it back later, allowing data to survive across application restarts.',
    keyPoints: [
      'Always use "with open(filepath, mode) as f:" - it automatically closes the file even if exceptions occur.',
      'File modes: "r" (read-only), "w" (write/overwrite), "a" (append to end), "r+" (read and write).',
      'Reading methods: f.read() (entire content), f.readline() (single line), f.readlines() (list of lines).',
      'JSON Handling: import json; json.dump(data, f) writes to file, json.load(f) reads from file, json.dumps() converts to string.',
      'CSV Handling: import csv; csv.reader(f) and csv.writer(f).'
    ],
    codeExample: `# Day 19: File Handling & JSON
import json

# 1. Writing to a text file
sample_text = "Python File Handling\\nDay 19 of 30 Days of Python\\n"
with open('notes.txt', 'w', encoding='utf-8') as f:
    f.write(sample_text)

# 2. Appending to a file
with open('notes.txt', 'a', encoding='utf-8') as f:
    f.write("Appended: Let's master Python!\\n")

# 3. Reading from a file
with open('notes.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    print("Read from file:")
    for line in lines:
        print(f"  > {line.strip()}")

# 4. JSON Serialization
student_record = {
    'name': 'Emmanuel',
    'completed_days': 19,
    'skills': ['Python', 'SQL', 'Git']
}

# Convert dict to JSON string
json_str = json.dumps(student_record, indent=2)
print("\\nSerialized JSON:\\n", json_str)

# Parse JSON string back to dict
parsed_record = json.loads(json_str)
print("Parsed student name:", parsed_record['name'])`,
    testGotcha: 'Mode "w" completely ERASES the file before writing! If you want to add to existing content without deleting it, use mode "a" (append).',
    exercises: {
      level1: [
        'Write a function which count_lines_and_words in a text file.',
        'Read a JSON file containing countries data and find the 10 most populated countries.'
      ],
      level2: [
        'Extract all incoming email addresses from an email log file using regex and write them to a new clean txt file.',
        'Find the 10 most frequent words in a text file.'
      ]
    },
    exerciseStarterCode: `# Day 19 Exercise: JSON & File Stats
import json

data = [
    {"country": "China", "population": 1402112000},
    {"country": "India", "population": 1380004385},
    {"country": "USA", "population": 329484123},
    {"country": "Indonesia", "population": 273523615},
    {"country": "Pakistan", "population": 220892340}
]

# Sort by population descending
top_countries = sorted(data, key=lambda x: x['population'], reverse=True)
print("Top populated countries:")
for idx, c in enumerate(top_countries, 1):
    print(f"  {idx}. {c['country']}: {c['population']:,}")
`,
    quickQuiz: {
      question: 'Which statement accurately describes the "with open(...)" pattern in Python?',
      options: [
        'It speeds up execution by running on another thread',
        'It automatically closes the file when exiting the block',
        'It prevents the file from ever being deleted',
        'It encrypts the file on disk'
      ],
      correctIndex: 1,
      explanation: 'The with statement implements a context manager that guarantees the file stream is cleanly closed, even if errors occur inside the block.'
    }
  },

  // Day 20
  {
    id: 'day_20_pip_packages',
    sectionId: 'day-20-pip-packages',
    dayNumber: 20,
    track: 'Python Mastery & I/O',
    category: 'Package Management',
    title: 'Day 20: Python Package Manager (PIP) & Web Requests',
    summary: 'Supercharge Python with open-source packages: pip install, package discovery on PyPI, and interacting with HTTP APIs using requests.',
    estimatedTime: '45 mins',
    beginnerNote: 'PIP is Python\'s app store for developers. Millions of engineers have published libraries for web development, AI, data science, and games. With one command, you can use their work.',
    keyPoints: [
      'PIP stands for Preferred Installer Program: standard package management system used to install packages from PyPI (Python Package Index).',
      'Common commands: pip install package_name, pip uninstall package_name, pip list, pip freeze > requirements.txt.',
      'The requests library: the gold-standard package for making HTTP requests (GET, POST, PUT, DELETE).',
      'Response methods: response.status_code (e.g. 200), response.text, response.json() (parses JSON response directly).',
      'Virtual environments: isolate project dependencies so different projects don\'t conflict.'
    ],
    codeExample: `# Day 20: PIP & Consuming Web APIs
# pip install requests (run in terminal)
import json

# Simulating an API consumption structure with standard library / requests
sample_api_response = """[
  {"name": "Python", "version": "3.12", "creator": "Guido van Rossum"},
  {"name": "TypeScript", "version": "5.4", "creator": "Anders Hejlsberg"},
  {"name": "Rust", "version": "1.76", "creator": "Graydon Hoare"}
]"""

data = json.loads(sample_api_response)
print(f"Loaded {len(data)} language packages from API:")
for lang in data:
    print(f"  • {lang['name']} (v{lang['version']}) created by {lang['creator']}")

# Common requests pattern:
# import requests
# url = 'https://api.github.com/users/Asabeneh'
# response = requests.get(url)
# if response.status_code == 200:
#     profile = response.json()
#     print(profile['name'], profile['public_repos'])`,
    testGotcha: 'Always check response.status_code == 200 before parsing response.json() when calling external web APIs to handle downtime safely!',
    exercises: {
      level1: [
        'Read the cats API (https://api.thecatapi.com/v1/breeds) and find the average weight of cat in metric units.',
        'Read the countries API (https://restcountries.com/v3.1/all) and find the 10 largest countries by area.'
      ]
    },
    exerciseStarterCode: `# Day 20 Exercise: Parsing API Data
api_data = [
    {"country": "Russia", "area": 17098242},
    {"country": "Canada", "area": 9984670},
    {"country": "USA", "area": 9833517},
    {"country": "China", "area": 9596961},
    {"country": "Brazil", "area": 8515767}
]

largest = sorted(api_data, key=lambda x: x['area'], reverse=True)
print("Largest countries by area (sq km):")
for idx, c in enumerate(largest, 1):
    print(f"  {idx}. {c['country']}: {c['area']:,} sq km")
`,
    quickQuiz: {
      question: 'Which pip command outputs all installed packages and versions in a format suitable for requirements.txt?',
      options: ['pip list --all', 'pip freeze', 'pip export', 'pip save'],
      correctIndex: 1,
      explanation: 'pip freeze outputs installed packages in exact version format (e.g. requests==2.31.0), which is saved into requirements.txt.'
    }
  }
];
