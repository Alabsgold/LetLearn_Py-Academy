import { StudyModule } from '../../types';

export const TRACK5_OOP_DATA_WEB: StudyModule[] = [
  // Day 21
  {
    id: 'day_21_classes_objects',
    sectionId: 'day-21-classes-objects',
    dayNumber: 21,
    track: 'OOP, Data & Web',
    category: 'Object Oriented Programming',
    title: 'Day 21: Classes & Object-Oriented Programming (OOP)',
    summary: 'Master Object-Oriented Programming: classes, objects, constructor (__init__), self, instance methods, inheritance, and super().',
    estimatedTime: '60 mins',
    beginnerNote: 'A Class is an architectural blueprint (like the blueprint for a car). An Object is a real, tangible car constructed using that blueprint. It has attributes (color, speed) and methods (drive, brake).',
    keyPoints: [
      'Class definition: class Person:. By convention, class names use PascalCase.',
      'Constructor __init__(self, ...): special method automatically called when a new instance is created.',
      'The "self" parameter: references the specific instance of the class being operated on.',
      'Instance methods: functions inside the class that take "self" as their first argument.',
      'Inheritance: class Student(Person): inherits all attributes and methods of Person.',
      'super().__init__(...): calls the parent class constructor to initialize inherited attributes.'
    ],
    codeExample: `# Day 21: Classes & Inheritance in Python
class Person:
    def __init__(self, firstname, lastname, age, country):
        self.firstname = firstname
        self.lastname = lastname
        self.age = age
        self.country = country
        self.skills = []

    def person_info(self):
        return f"{self.firstname} {self.lastname} is {self.age} years old from {self.country}."

    def add_skill(self, skill):
        self.skills.append(skill)
        return f"Added skill: {skill}"

# Inheritance: Student inherits from Person
class Student(Person):
    def __init__(self, firstname, lastname, age, country, student_id):
        # Call parent constructor
        super().__init__(firstname, lastname, age, country)
        self.student_id = student_id
        self.completed_days = 0

    # Method Overriding / Extension
    def person_info(self):
        base_info = super().person_info()
        return f"{base_info} [ID: {self.student_id}, Completed: {self.completed_days}/30 days]"

# Creating instances (Objects)
student1 = Student("Tunde", "Ade", 22, "Nigeria", "ST-2026-01")
student1.add_skill("Python")
student1.add_skill("FastAPI")
student1.completed_days = 21

print(student1.person_info())
print("Skills:", student1.skills)`,
    testGotcha: 'Always remember to put "self" as the first parameter of any instance method! Forgetting self causes a TypeError: takes 0 positional arguments but 1 was given.',
    exercises: {
      level1: [
        'Create a PersonAccount class. It has firstname, lastname, incomes, expenses properties and it has total_income, total_expense, account_info, add_income, add_expense and account_balance methods.',
        'Incomes is a set of incomes and its description. Expenses is also a set of expenses and its description.'
      ],
      level2: [
        'Create a Statistics class that takes a list of sample numbers and calculates: count, sum, min, max, range, mean, median, mode, and standard deviation.'
      ]
    },
    exerciseStarterCode: `# Day 21 Exercise: Statistics Class
class Statistics:
    def __init__(self, data):
        self.data = sorted(data)

    def count(self):
        return len(self.data)

    def sum(self):
        return sum(self.data)

    def min(self):
        return self.data[0]

    def max(self):
        return self.data[-1]

    def mean(self):
        return sum(self.data) / len(self.data)

ages = [31, 26, 34, 37, 27, 26, 32, 32, 26, 27, 27, 24, 32, 33, 27, 25, 26, 38, 37, 31, 34, 24, 33, 29, 26]
stats = Statistics(ages)
print("Count:", stats.count())
print("Mean:", stats.mean())
print("Min:", stats.min(), "Max:", stats.max())
`,
    quickQuiz: {
      question: 'What is the purpose of the super() function inside a subclass constructor in Python?',
      options: [
        'It terminates the subclass constructor',
        'It calls the parent (superclass) constructor or methods',
        'It creates a global singleton',
        'It overrides all parent attributes'
      ],
      correctIndex: 1,
      explanation: 'super() gives you access to methods from the parent class, allowing you to invoke the parent __init__ and inherit its attributes cleanly.'
    }
  },

  // Day 22
  {
    id: 'day_22_web_scraping',
    sectionId: 'day-22-web-scraping',
    dayNumber: 22,
    track: 'OOP, Data & Web',
    category: 'Web Scraping',
    title: 'Day 22: Web Scraping & BeautifulSoup',
    summary: 'Extract structured data from the web: HTML DOM structure, BeautifulSoup4 parsing, CSS selectors, and data extraction.',
    estimatedTime: '50 mins',
    beginnerNote: 'Web scraping allows your program to browse the internet automatically, extract tabular data, articles, or prices from HTML websites, and convert them into clean Python lists and dictionaries.',
    keyPoints: [
      'HTML structure: tags (<p>, <div>, <table>), attributes (class, id, href), and nested DOM nodes.',
      'BeautifulSoup: popular library for pulling data out of HTML and XML files: from bs4 import BeautifulSoup.',
      'Finding elements: soup.find("h1") (first match), soup.find_all("a") (all matching tags).',
      'Filtering by class or id: soup.find_all("div", class_="card") or soup.find(id="main-header").',
      'Extracting text & attributes: tag.text.strip(), tag["href"], tag["src"].',
      'Polite scraping: respect robots.txt and add headers (User-Agent).'
    ],
    codeExample: `# Day 22: Web Scraping with BeautifulSoup (Simulation)
# from bs4 import BeautifulSoup
# import requests

sample_html = """
<!DOCTYPE html>
<html>
  <body>
    <h1>Top Python Frameworks</h1>
    <ul id="frameworks">
      <li class="item" data-stars="70k"><a href="https://flask.palletsprojects.com">Flask</a> - Microframework</li>
      <li class="item" data-stars="75k"><a href="https://fastapi.tiangolo.com">FastAPI</a> - High Performance API</li>
      <li class="item" data-stars="78k"><a href="https://djangoproject.com">Django</a> - Batteries Included</li>
    </ul>
  </body>
</html>
"""

# Parsing HTML using standard string parsing or BeautifulSoup:
print("Scraping Simulation:")
lines = [line.strip() for line in sample_html.split("\\n") if '<li class="item"' in line]
for line in lines:
    name = line.split('>')[2].split('<')[0]
    link = line.split('href="')[1].split('"')[0]
    print(f"  • {name} -> URL: {link}")`,
    testGotcha: 'When searching by CSS class in BeautifulSoup, use class_="className" with an underscore because "class" is a reserved Python keyword!',
    exercises: {
      level1: [
        'Scrape the Presidents of the United States table from Wikipedia and save the data as a clean JSON file.',
        'Extract all titles, dates, and read times from a programming blog.'
      ]
    },
    exerciseStarterCode: `# Day 22 Exercise: HTML Parsing Pattern
html_data = """
<div class="repo"><h3 class="name">30-Days-Of-Python</h3><span class="stars">35000</span></div>
<div class="repo"><h3 class="name">30-Days-Of-JavaScript</h3><span class="stars">42000</span></div>
"""
print("Extracted Data Ready for Processing.")
`,
    quickQuiz: {
      question: 'Why do we write soup.find_all("div", class_="container") with an underscore after "class"?',
      options: [
        'It is an HTML5 requirement',
        '"class" is a reserved keyword in Python',
        'It targets sub-classes only',
        'It is a BeautifulSoup typo'
      ],
      correctIndex: 1,
      explanation: 'In Python, "class" is a reserved keyword used to define classes. BeautifulSoup uses "class_" as the parameter name to avoid syntax collisions.'
    }
  },

  // Day 23
  {
    id: 'day_23_virtual_environments',
    sectionId: 'day-23-virtual-environments',
    dayNumber: 23,
    track: 'OOP, Data & Web',
    category: 'Environment & Tooling',
    title: 'Day 23: Virtual Environments & Project Packaging',
    summary: 'Isolate dependencies cleanly: python -m venv, environment activation across OSs, requirements.txt, and production deployment hygiene.',
    estimatedTime: '30 mins',
    beginnerNote: 'A virtual environment is a self-contained sandbox directory containing a specific Python version and set of packages for one project, preventing conflicts between projects.',
    keyPoints: [
      'Creating venv: python -m venv .venv (creates a local folder with Python binaries).',
      'Activating on Windows: .venv\\Scripts\\activate. Activating on macOS/Linux: source .venv/bin/activate.',
      'Deactivating: simply run deactivate in your shell.',
      'requirements.txt: lists exact dependencies. Generate with: pip freeze > requirements.txt.',
      'Installing from requirements.txt: pip install -r requirements.txt.',
      'Always add .venv/ to your .gitignore so you never commit huge binary libraries to GitHub!'
    ],
    codeExample: `# Day 23: Virtual Environment Lifecycle
# 1. Create a virtual environment:
#    python -m venv .venv
#
# 2. Activate it:
#    source .venv/bin/activate  (Mac / Linux)
#    .venv\\Scripts\\activate      (Windows PowerShell)
#
# 3. Install packages safely inside the sandbox:
#    pip install fastapi uvicorn
#
# 4. Save your dependencies:
#    pip freeze > requirements.txt

sample_requirements = """
fastapi==0.110.0
uvicorn==0.28.0
pydantic==2.6.4
requests==2.31.0
"""
print("Sample requirements.txt:")
print(sample_requirements.strip())`,
    testGotcha: 'Never commit your .venv or env directory to Git! Always add .venv to your .gitignore and commit requirements.txt instead.',
    exercises: {
      level1: [
        'Create a virtual environment called my_env on your machine or server.',
        'Activate the environment and install flask and requests.',
        'Export the installed dependencies to a requirements.txt file.'
      ]
    },
    exerciseStarterCode: `# Day 23 Exercise: Verifying Environment Isolation
import sys
print(f"Current Python Executable: {sys.executable}")
print(f"Python Version: {sys.version.split()[0]}")
`,
    quickQuiz: {
      question: 'Which file should be committed to Git to record project dependencies?',
      options: ['.venv/', 'requirements.txt', 'site-packages/', 'pip.log'],
      correctIndex: 1,
      explanation: 'requirements.txt contains lightweight package specifications and should be committed, while .venv/ contains heavy machine-specific binaries and must be ignored.'
    }
  },

  // Day 24
  {
    id: 'day_24_statistics_numpy',
    sectionId: 'day-24-statistics-numpy',
    dayNumber: 24,
    track: 'OOP, Data & Web',
    category: 'Data Science',
    title: 'Day 24: Statistics & NumPy Fundamentals',
    summary: 'Analyze data numerically: measures of central tendency, variance, standard deviation, and NumPy multi-dimensional array operations.',
    estimatedTime: '55 mins',
    beginnerNote: 'NumPy (Numerical Python) is the foundation of modern data science and AI. Its arrays are written in C, making mathematical operations up to 50 times faster than standard Python lists.',
    keyPoints: [
      'Import convention: import numpy as np.',
      'ndarray: homogeneous multi-dimensional array object with fixed memory size and lightning-fast vectorized math.',
      'Creating arrays: np.array([1, 2, 3]), np.zeros((3, 3)), np.ones((2, 4)), np.arange(0, 10, 2).',
      'Statistics: np.mean(), np.median(), np.std() (standard deviation), np.var() (variance), np.percentile().',
      'Vectorized arithmetic: arr * 2 multiplies every item instantly without writing slow for loops!',
      'Matrix shapes and reshaping: arr.shape, arr.reshape(rows, cols).'
    ],
    codeExample: `# Day 24: Statistics & Vectorized Math
import math

# Pure Python Statistical Calculations (compatible in any sandbox)
data = [12, 15, 18, 20, 22, 25, 28, 30, 35, 40]

n = len(data)
mean = sum(data) / n
variance = sum((x - mean) ** 2 for x in data) / n
std_dev = math.sqrt(variance)

sorted_data = sorted(data)
mid = n // 2
median = (sorted_data[mid - 1] + sorted_data[mid]) / 2 if n % 2 == 0 else sorted_data[mid]

print("--- Statistical Analysis ---")
print(f"Dataset: {data}")
print(f"Count (N): {n}")
print(f"Mean (Average): {mean:.2f}")
print(f"Median: {median:.2f}")
print(f"Variance: {variance:.2f}")
print(f"Standard Deviation (σ): {std_dev:.2f}")

# Simulating NumPy Vectorization:
scaled = [round(x * 1.5, 1) for x in data]
print(f"Vectorized 1.5x Scaling: {scaled}")`,
    testGotcha: 'Standard Python lists do not support element-wise math: [1, 2] * 2 duplicates the list to [1, 2, 1, 2]! NumPy arrays multiply elements: np.array([1, 2]) * 2 -> [2, 4].',
    exercises: {
      level1: [
        'Calculate the mean, median, mode, range, variance, and standard deviation of this dataset: [24, 16, 30, 35, 42, 21, 18, 30, 25].',
        'Create a function that calculates the interquartile range (IQR = Q3 - Q1).'
      ]
    },
    exerciseStarterCode: `# Day 24 Exercise: Full Statistical Calculator
scores = [85, 90, 78, 92, 88, 76, 95, 89, 84, 91]
mean_score = sum(scores) / len(scores)
var = sum((s - mean_score)**2 for s in scores) / len(scores)
std = var ** 0.5
print(f"Scores Mean: {mean_score:.1f}, Standard Dev: {std:.2f}")
`,
    quickQuiz: {
      question: 'What is the output of [10, 20] * 2 in pure Python?',
      options: ['[20, 40]', '[10, 20, 10, 20]', 'TypeError', '[100, 400]'],
      correctIndex: 1,
      explanation: 'Multiplying a Python list by an integer replicates its elements. To perform element-wise arithmetic, use NumPy.'
    }
  },

  // Day 25
  {
    id: 'day_25_pandas',
    sectionId: 'day-25-pandas',
    dayNumber: 25,
    track: 'OOP, Data & Web',
    category: 'Data Science',
    title: 'Day 25: Pandas DataFrames & Data Exploration',
    summary: 'Master tabular data analysis: Pandas Series, DataFrames, reading CSV files, selecting columns, filtering rows, and summary statistics.',
    estimatedTime: '60 mins',
    beginnerNote: 'Pandas is like Excel on steroids inside Python. It lets you load millions of rows of data, filter, slice, clean, group, and calculate answers in milliseconds.',
    keyPoints: [
      'Import convention: import pandas as pd.',
      'Series: 1D labeled array (like a single spreadsheet column).',
      'DataFrame: 2D tabular data structure with labeled rows and columns (like a full spreadsheet table).',
      'Reading files: pd.read_csv("data.csv"), pd.read_json("data.json").',
      'Data inspection: df.head(5), df.tail(5), df.info(), df.describe(), df.shape.',
      'Filtering: high_earners = df[df["salary"] > 80000].',
      'Aggregation: df.groupby("department")["salary"].mean().'
    ],
    codeExample: `# Day 25: Pandas Table Representation
# Simulating a Pandas DataFrame in clean Python:
students_table = [
    {'Name': 'Grace', 'Track': 'Python', 'Score': 94, 'Status': 'Passed'},
    {'Name': 'Tunde', 'Track': 'Python', 'Score': 88, 'Status': 'Passed'},
    {'Name': 'Amina', 'Track': 'Data Science', 'Score': 96, 'Status': 'Passed'},
    {'Name': 'David', 'Track': 'Web Dev', 'Score': 68, 'Status': 'Review'},
    {'Name': 'Sarah', 'Track': 'Python', 'Score': 91, 'Status': 'Passed'}
]

print("--- DataFrame Representation (5 rows x 4 columns) ---")
print(f"{'Name':<10} {'Track':<14} {'Score':<8} {'Status':<10}")
print("-" * 44)
for row in students_table:
    print(f"{row['Name']:<10} {row['Track']:<14} {row['Score']:<8} {row['Status']:<10}")

# Filtering: Track == 'Python' and Score >= 90
top_python = [s for s in students_table if s['Track'] == 'Python' and s['Score'] >= 90]
avg_score = sum(s['Score'] for s in students_table) / len(students_table)

print(f"\\nAverage Cohort Score: {avg_score:.1f}%")
print(f"Top Python Students ({len(top_python)}): {[s['Name'] for s in top_python]}")`,
    testGotcha: 'When filtering DataFrames with multiple conditions, use the bitwise operators & (AND) and | (OR) wrapped in parentheses: df[(df["a"] > 5) & (df["b"] < 10)].',
    exercises: {
      level1: [
        'Create a DataFrame from a dictionary of student exam records.',
        'Explore the data: print the first 3 rows, print the shape, print the summary statistics.',
        'Filter and extract only students who achieved a score of 85 or above.'
      ]
    },
    exerciseStarterCode: `# Day 25 Exercise: DataFrame Filtering
records = [
    {"student": "Kofi", "grade": 88, "country": "Ghana"},
    {"student": "Fatima", "grade": 92, "country": "Nigeria"},
    {"student": "John", "grade": 79, "country": "Kenya"},
    {"student": "Elena", "grade": 95, "country": "Finland"}
]

high_achievers = [r for r in records if r['grade'] >= 90]
print("High achievers (>= 90):", high_achievers)
`,
    quickQuiz: {
      question: 'Which method gives a statistical summary (mean, std, min, max, quartiles) of numeric DataFrame columns in Pandas?',
      options: ['df.summary()', 'df.describe()', 'df.stats()', 'df.info()'],
      correctIndex: 1,
      explanation: 'df.describe() calculates summary statistics for all numeric columns including count, mean, standard deviation, min, 25%, 50%, 75%, and max.'
    }
  },

  // Day 26
  {
    id: 'day_26_python_web_flask',
    sectionId: 'day-26-python-web-flask',
    dayNumber: 26,
    track: 'OOP, Data & Web',
    category: 'Web Development',
    title: 'Day 26: Python Web with Flask',
    summary: 'Build web applications: Flask microframework, routing (@app.route), dynamic URL parameters, rendering templates, and returning JSON APIs.',
    estimatedTime: '55 mins',
    beginnerNote: 'Flask is a lightweight Python web framework. It listens for incoming HTTP requests from web browsers and mobile phones, executes your Python functions, and sends back HTML or JSON responses.',
    keyPoints: [
      'Basic app: from flask import Flask; app = Flask(__name__).',
      'Defining routes: @app.route("/") decorated above a view function.',
      'Dynamic URL parameters: @app.route("/user/<username>") captures parameters from the URL path.',
      'HTTP Methods: @app.route("/api/items", methods=["GET", "POST"]).',
      'Returning JSON: from flask import jsonify; return jsonify({"success": True, "data": []}).',
      'Running server: app.run(debug=True, port=5000).'
    ],
    codeExample: `# Day 26: Python Web Server with Flask
# from flask import Flask, jsonify, request
# app = Flask(__name__)

# Complete Flask Application Blueprint:
routes_demonstration = """
from flask import Flask, jsonify, request

app = Flask(__name__)

# Route 1: Home page
@app.route('/')
def home():
    return "<h1>Welcome to 30 Days of Python Web Server!</h1>"

# Route 2: Dynamic URL parameter
@app.route('/student/<name>')
def student_detail(name):
    return jsonify({
        "student": name,
        "enrolled": True,
        "track": "Full-Stack Python"
    })

# Route 3: REST API endpoint
@app.route('/api/v1/modules', methods=['GET'])
def get_modules():
    return jsonify({
        "total_days": 30,
        "current_day": 26,
        "topic": "Python Web with Flask"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
"""

print("Flask Architecture Blueprint:")
print(routes_demonstration.strip())`,
    testGotcha: 'Never run Flask with debug=True in a public production environment! Debug mode exposes an interactive execution console that can be a security vulnerability.',
    exercises: {
      level1: [
        'Create a simple Flask application that serves a greeting at route "/" and about page at route "/about".',
        'Create a dynamic route "/api/greet/<name>" that returns a JSON message: {"message": "Hello, <name>!".'
      ]
    },
    exerciseStarterCode: `# Day 26 Exercise: Mocking a Web API Route
def mock_api_route(path, params):
    if path == "/api/status":
        return {"status": "ok", "uptime_hours": 124, "env": "production"}
    elif path.startswith("/api/student/"):
        name = path.replace("/api/student/", "")
        return {"student": name, "status": "active"}
    return {"error": "404 Not Found"}

print(mock_api_route("/api/student/Tunde", {}))
`,
    quickQuiz: {
      question: 'Which decorator registers a URL route with a Python view function in Flask?',
      options: ['@app.url()', '@app.route()', '@app.endpoint()', '@app.path()'],
      correctIndex: 1,
      explanation: '@app.route("/path") is the standard decorator used to bind a URL pattern to a Python handler function in Flask.'
    }
  },

  // Day 27
  {
    id: 'day_27_databases',
    sectionId: 'day-27-databases',
    dayNumber: 27,
    track: 'OOP, Data & Web',
    category: 'Databases',
    title: 'Day 27: Python with Databases (SQL & NoSQL)',
    summary: 'Persist application data at scale: SQL relational databases, NoSQL document stores (MongoDB), PyMongo, and Firestore CRUD operations.',
    estimatedTime: '55 mins',
    beginnerNote: 'Databases are industrial-strength storage engines. Unlike plain text files, databases handle concurrent users, indexing, transactions, and millions of queries per second safely.',
    keyPoints: [
      'SQL (Relational): Structured tables with fixed schemas, primary keys, and foreign keys (PostgreSQL, SQLite, MySQL).',
      'NoSQL (Document): JSON-like flexible documents organized into collections (MongoDB, Firestore).',
      'CRUD Operations: Create (insert), Read (find/query), Update (modify), and Delete (remove).',
      'PyMongo connection: client = pymongo.MongoClient("connection_string"); db = client["my_db"].',
      'Firestore connection: from firebase_admin import firestore; db = firestore.client().',
      'Security: never concatenate user inputs directly into database queries; always use parameterized queries to prevent injection attacks.'
    ],
    codeExample: `# Day 27: Database CRUD Patterns
# Document Database Model (e.g. MongoDB / Firestore)

# 1. Document Creation (Create)
new_student_doc = {
    "student_id": "std_2026_09",
    "name": "Amina Bello",
    "track": "Python Full-Stack",
    "completed_days": 27,
    "streak": 27,
    "is_active": True
}

# 2. Reading Documents (Read)
def query_active_students(collection, min_days=20):
    return [doc for doc in collection if doc.get('completed_days', 0) >= min_days and doc.get('is_active')]

# 3. Updating Documents (Update)
def update_student_streak(doc, new_streak):
    doc['streak'] = new_streak
    doc['completed_days'] += 1
    return doc

# 4. Deleting Documents (Delete)
sample_collection = [new_student_doc]
print("Initial Database Collection:", sample_collection)

updated = update_student_streak(new_student_doc, 28)
print("After Streak Update:", updated['streak'])`,
    testGotcha: 'Never store sensitive database passwords directly in your code repository! Always load database connection strings from environment variables.',
    exercises: {
      level1: [
        'Write out the four CRUD operations and their equivalent methods in MongoDB / Firestore.',
        'Design a database schema for an online learning management system tracking students, tests, and module progress.'
      ]
    },
    exerciseStarterCode: `# Day 27 Exercise: In-Memory Database Simulator
db = {}

def insert_student(student_id, data):
    db[student_id] = {**data, "id": student_id}
    return db[student_id]

def get_student(student_id):
    return db.get(student_id, None)

insert_student("s1", {"name": "Grace", "score": 98})
print("Retrieved student:", get_student("s1"))
`,
    quickQuiz: {
      question: 'What does the acronym CRUD stand for in database systems?',
      options: [
        'Compile, Run, Update, Debug',
        'Create, Read, Update, Delete',
        'Copy, Read, Unpack, Distribute',
        'Check, Route, Undo, Deploy'
      ],
      correctIndex: 1,
      explanation: 'CRUD represents the four fundamental operations of persistent data storage: Create, Read, Update, and Delete.'
    }
  },

  // Day 28
  {
    id: 'day_28_api_development',
    sectionId: 'day-28-api-development',
    dayNumber: 28,
    track: 'OOP, Data & Web',
    category: 'API Development',
    title: 'Day 28: RESTful API Development & HTTP Architecture',
    summary: 'Design industry-standard web APIs: REST principles, HTTP verbs (GET, POST, PUT, DELETE), status codes (200, 201, 400, 404, 500), and JSON payloads.',
    estimatedTime: '50 mins',
    beginnerNote: 'An API (Application Programming Interface) is a standardized digital menu. A frontend client (mobile app or browser) places an order using HTTP requests, and the Python backend delivers the requested data as JSON.',
    keyPoints: [
      'HTTP Methods: GET (fetch data), POST (create new record), PUT (update entire record), PATCH (partial update), DELETE (remove record).',
      'HTTP Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error).',
      'JSON Content-Type: Headers must include "Content-Type: application/json".',
      'Statelessness: Each request from client to server must contain all necessary authentication and context.',
      'REST URI convention: Nouns instead of verbs (e.g. GET /api/v1/students, POST /api/v1/students).'
    ],
    codeExample: `# Day 28: RESTful API Endpoint Design
# Standard RESTful API Resource Table:
# GET    /api/v1/students       -> Returns list of all students (200 OK)
# POST   /api/v1/students       -> Creates a new student (201 Created)
# GET    /api/v1/students/{id}  -> Returns details of one student (200 OK / 404)
# PUT    /api/v1/students/{id}  -> Updates student details (200 OK / 400)
# DELETE /api/v1/students/{id}  -> Deletes student record (200 OK / 204)

import json

def handle_rest_request(method, path, body=None):
    if method == "GET" and path == "/api/v1/modules":
        return 200, {"success": True, "total": 30}
    elif method == "POST" and path == "/api/v1/submit-test":
        if not body or "score" not in body:
            return 400, {"error": "Missing 'score' in payload"}
        return 201, {"success": True, "record_id": "sub_10928"}
    return 404, {"error": "Endpoint not found"}

code, res = handle_rest_request("POST", "/api/v1/submit-test", {"score": 95})
print(f"Status Code: {code}")
print("Response Payload:", json.dumps(res, indent=2))`,
    testGotcha: 'Always return the correct HTTP status code! Do not return 200 OK with an error message payload like {"status": "error"}. Return 400, 401, or 404 appropriately.',
    exercises: {
      level1: [
        'Design a complete RESTful API specification for a Todo application with all five HTTP verbs, status codes, and JSON response shapes.',
        'Explain the difference between idempotent methods (GET, PUT, DELETE) and non-idempotent methods (POST).'
      ]
    },
    exerciseStarterCode: `# Day 28 Exercise: REST Status Code Helper
def get_http_status_message(code):
    statuses = {
        200: "OK - Request succeeded",
        201: "Created - Resource created",
        400: "Bad Request - Invalid payload",
        401: "Unauthorized - Authentication required",
        404: "Not Found - Resource does not exist",
        500: "Internal Server Error"
    }
    return statuses.get(code, "Unknown Status")

print("201:", get_http_status_message(201))
print("404:", get_http_status_message(404))
`,
    quickQuiz: {
      question: 'Which HTTP status code should be returned after a new database record is successfully created via a POST request?',
      options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
      correctIndex: 1,
      explanation: 'HTTP status code 201 Created is the specific REST standard indicating that the request has succeeded and led to the creation of a new resource.'
    }
  },

  // Day 29
  {
    id: 'day_29_fullstack_project_architecture',
    sectionId: 'day-29-fullstack-project-architecture',
    dayNumber: 29,
    track: 'OOP, Data & Web',
    category: 'Software Architecture',
    title: 'Day 29: Production Project Architecture & Testing',
    summary: 'Organize production-ready Python applications: clean architecture, modular folder structure, automated testing with pytest, and environment secrets.',
    estimatedTime: '60 mins',
    beginnerNote: 'Real-world software engineering isn\'t just about writing code that runs—it\'s about structuring code so that an entire team can maintain, test, and scale it safely for years.',
    keyPoints: [
      'Separation of Concerns: divide project into layers (Routers/Views, Services/Business Logic, Models/Database, Utilities).',
      'Clean Directory Structure: src/, tests/, docs/, .env.example, requirements.txt, README.md.',
      'Automated testing with pytest: write test functions prefixed with test_ (e.g. test_addition()).',
      'Config & Environment variables: use python-dotenv or os.environ to keep API keys and secrets safe.',
      'Docstrings & Type Hints: def calculate_grade(score: float) -> str: enhances code clarity and auto-completion.'
    ],
    codeExample: `# Day 29: Production Python Architecture & Testing
# Directory Blueprint:
# ├── app/
# │   ├── __init__.py
# │   ├── config.py         <- Environment variables & settings
# │   ├── models.py         <- Database entities
# │   ├── routes/           <- API controllers & endpoints
# │   └── services/         <- Core business logic & algorithms
# ├── tests/
# │   ├── test_routes.py
# │   └── test_services.py
# ├── requirements.txt
# └── .env.example

# Type hints and docstrings:
def calculate_progress_percentage(completed_days: int, total_days: int = 30) -> float:
    """Calculates curriculum progress as a rounded percentage."""
    if total_days <= 0:
        raise ValueError("Total days must be positive")
    return round((completed_days / total_days) * 100, 1)

# Pytest test function example:
def test_progress_calculation():
    assert calculate_progress_percentage(15, 30) == 50.0
    assert calculate_progress_percentage(30, 30) == 100.0
    print("All architecture unit tests passed!")

test_progress_calculation()`,
    testGotcha: 'Never hardcode sensitive production credentials or API keys directly in source code. Always use environment variables and include a clean .env.example.',
    exercises: {
      level1: [
        'Write three pytest unit tests for a shopping cart calculation function.',
        'Create a configuration loader class that reads environment variables with fallback defaults.'
      ]
    },
    exerciseStarterCode: `# Day 29 Exercise: Unit Testing Pattern
def calculate_final_grade(scores):
    if not scores:
        return 0
    return sum(scores) / len(scores)

# Unit test checks:
assert calculate_final_grade([100, 80]) == 90.0
assert calculate_final_grade([]) == 0
print("Unit tests verified successfully.")
`,
    quickQuiz: {
      question: 'Which tool is the standard, modern test runner for Python applications?',
      options: ['npm test', 'pytest', 'pycheck', 'testrunner'],
      correctIndex: 1,
      explanation: 'pytest is the industry-standard testing framework for Python, featuring simple assert statements, powerful fixtures, and rich plugins.'
    }
  },

  // Day 30
  {
    id: 'day_30_conclusions_capstone',
    sectionId: 'day-30-conclusions-capstone',
    dayNumber: 30,
    track: 'OOP, Data & Web',
    category: 'Capstone & Review',
    title: 'Day 30: Conclusions, Capstone Projects & Mastery',
    summary: 'Celebrate completing 30 Days of Python! Review foundational to advanced milestones, complete capstone challenges, and map your path forward.',
    estimatedTime: '60 mins',
    beginnerNote: 'Congratulations! You have traveled from printing "Hello World" to building Object-Oriented systems, APIs, Web Servers, and Data Analysis pipelines. You now have the foundational toolkit of a Python engineer.',
    keyPoints: [
      'Comprehensive Review: Variables, Data Structures (Lists, Tuples, Sets, Dicts), Loops, Functions, Modules, Regex, OOP, and APIs.',
      'Capstone Project 1: Build a Full-Stack Python Student Portal with authentication and real-time grading.',
      'Capstone Project 2: Build a Web Scraper & Data Analytics Dashboard using BeautifulSoup and Pandas.',
      'Capstone Project 3: Build a REST API with Flask/FastAPI connected to a cloud database.',
      'Continuous Learning: Contribute to open source, solve LeetCode/HackerRank challenges, and build production projects.'
    ],
    codeExample: `# Day 30: Capstone Milestones Summary
curriculum_milestones = [
    {"Track": "1. Python Foundations", "Days": "1 - 5", "Core": "Syntax, Variables, Operators, Strings, Lists"},
    {"Track": "2. Core Data Structures", "Days": "6 - 8", "Core": "Tuples, Sets, Dictionaries, Mutability"},
    {"Track": "3. Control Flow & Functions", "Days": "9 - 14", "Core": "Conditionals, Loops, Functions, Comprehensions, Decorators"},
    {"Track": "4. Python Mastery & I/O", "Days": "15 - 20", "Core": "Error Types, Datetime, Exceptions, Regex, Files, PIP"},
    {"Track": "5. OOP, Data & Web", "Days": "21 - 30", "Core": "Classes, Scraping, Virtual Envs, Statistics, Pandas, Flask, APIs"}
]

print("=" * 60)
print("  LETLEARN_PY • 30 DAYS OF PYTHON CURRICULUM COMPLETE!  ")
print("=" * 60)
for milestone in curriculum_milestones:
    print(f"✓ {milestone['Track']:<30} (Days {milestone['Days']}): {milestone['Core']}")
print("=" * 60)
print("Ready for official certification assessment & live test!")`,
    testGotcha: 'The best way to solidify programming mastery is by building real projects. Don\'t get trapped in "tutorial purgatory"—start building!',
    exercises: {
      level1: [
        'Review all 30 days and list the three concepts you found most powerful.',
        'Build a command-line Python Quiz Game that asks 10 questions and scores the player.'
      ],
      level2: [
        'Build your Capstone Project: an API, Web Scraper, or Data Analytics tool and publish your code to GitHub.'
      ]
    },
    exerciseStarterCode: `# Day 30 Capstone: Graduation Celebration Script
graduate_name = "Python Developer"
print(f"Congratulations, {graduate_name}!")
print("You have successfully mastered the 30 Days of Python curriculum.")
print("Take today's official assessment test to record your score!")
`,
    quickQuiz: {
      question: 'Which of the following is the most effective way to retain programming skills after finishing a 30-day curriculum?',
      options: [
        'Stop writing code for a few months',
        'Build real-world personal projects and solve problems',
        'Memorize syntax without running it',
        'Read tutorials without typing'
      ],
      correctIndex: 1,
      explanation: 'Building real personal projects and writing code hands-on is the single most effective way to cement programming knowledge.'
    }
  }
];
