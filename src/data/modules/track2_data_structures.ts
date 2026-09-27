import { StudyModule } from '../../types';

export const TRACK2_DATA_STRUCTURES: StudyModule[] = [
  // Day 6
  {
    id: 'day_06_tuples',
    sectionId: 'day-06-tuples',
    dayNumber: 6,
    track: 'Core Data Structures',
    category: 'Data Structures',
    title: 'Day 6: Tuples & Immutability',
    summary: 'Explore ordered immutable sequences in round parentheses (). Learn tuple slicing, unpacking, and list conversion.',
    estimatedTime: '35 mins',
    beginnerNote: 'A tuple is like a permanent snapshot or contract. Once created, you cannot add, remove, or modify items. Use tuples when data should never be accidentally changed.',
    keyPoints: [
      'Tuples are defined using parentheses () or comma-separated items: coordinates = (10, 20).',
      'Single-item tuple syntax requires a trailing comma: single = ("apple",). Without comma, ("apple") is just a string!',
      'Tuples support positive & negative indexing and slicing: tuple[start:stop:step].',
      'Tuples are immutable: attempting tuple[0] = 5 raises a TypeError.',
      'To modify a tuple, convert to list with list(my_tuple), edit, and convert back with tuple(my_list).',
      'Joining tuples: use the + operator to concatenate multiple tuples into a new one.'
    ],
    codeExample: `# Day 6: Tuples in Python
fruits = ('banana', 'orange', 'mango', 'lemon')

# 1. Indexing & Slicing
print("First fruit:", fruits[0])
print("Last fruit:", fruits[-1])
print("Slice of middle fruits:", fruits[1:3])

# 2. Checking membership
print("'mango' in fruits:", 'mango' in fruits)

# 3. Tuple immutability & modification workaround
try:
    fruits[0] = 'apple'  # Raises TypeError!
except TypeError as e:
    print("Caught expected immutability error:", e)

# Workaround: convert to list, edit, convert back
fruits_list = list(fruits)
fruits_list[0] = 'apple'
fruits = tuple(fruits_list)
print("Updated tuple:", fruits)

# 4. Unpacking tuples
nordic_countries = ('Denmark', 'Finland', 'Iceland', 'Norway', 'Sweden')
denmark, finland, *rest = nordic_countries
print(f"Denmark: {denmark}, Finland: {finland}, Others: {rest}")`,
    testGotcha: 'Remember the trailing comma! single_tuple = ("item",) is a tuple. single_tuple = ("item") is just a string.',
    exercises: {
      level1: [
        'Create an empty tuple. Create a tuple containing names of your sisters and brothers.',
        'Join brothers and sisters tuples and assign it to siblings.',
        'How many siblings do you have? Modify the siblings tuple and add the name of your father and mother.'
      ],
      level2: [
        'Unpack siblings and parents from family_members.',
        'Create fruits, vegetables and animal products tuples. Join the three tuples and assign it to food_stuff_tp.',
        'Slice out the middle item or items from the food_stuff_tp tuple.',
        'Slice out the first three items and the last three items from food_staff_tp list.'
      ]
    },
    exerciseStarterCode: `# Day 6 Exercise: Tuples & Slicing
fruits = ('banana', 'orange', 'mango', 'lemon')
vegetables = ('Tomato', 'Potato', 'Cabbage', 'Onion', 'Carrot')
animal_products = ('milk', 'meat', 'butter', 'cheese')

food_stuff_tp = fruits + vegetables + animal_products
print("Food stuff tuple length:", len(food_stuff_tp))

# Convert to list and find middle items
food_stuff_lt = list(food_stuff_tp)
mid = len(food_stuff_lt) // 2
middle_items = food_stuff_lt[mid-1:mid+1] if len(food_stuff_lt) % 2 == 0 else [food_stuff_lt[mid]]
print("Middle items:", middle_items)
`,
    quickQuiz: {
      question: 'What is the type of my_var = ("Python") in Python?',
      options: ['tuple', 'str', 'list', 'SyntaxError'],
      correctIndex: 1,
      explanation: 'Without a trailing comma, parentheses ("Python") are treated as grouping for a string, so its type is str. To make it a tuple, write ("Python",).'
    }
  },

  // Day 7
  {
    id: 'day_07_sets',
    sectionId: 'day-07-sets',
    dayNumber: 7,
    track: 'Core Data Structures',
    category: 'Data Structures',
    title: 'Day 7: Sets & Set Operations',
    summary: 'Master unordered collections of unique elements. Perform mathematical union, intersection, difference, and symmetric difference.',
    estimatedTime: '40 mins',
    beginnerNote: 'A Set is like a bag of unique items. It automatically eliminates all duplicates and doesn\'t care about order. Great for membership checks and finding overlaps.',
    keyPoints: [
      'Sets are created with curly braces {1, 2, 3} or set([1, 2, 3]). Empty set must be set() because {} creates an empty dict!',
      'Sets are unordered and unindexed: items cannot be accessed via set[0].',
      'Adding items: set.add(item) adds one element; set.update([a, b]) adds multiple.',
      'Removing items: set.remove(item) removes item or raises KeyError; set.discard(item) removes item without raising error if missing.',
      'Union (A | B or A.union(B)): combines elements from both sets.',
      'Intersection (A & B or A.intersection(B)): returns only items present in both sets.',
      'Difference (A - B or A.difference(B)): items in A but not in B.',
      'Symmetric difference (A ^ B): items in A or B, but NOT in both.'
    ],
    codeExample: `# Day 7: Sets & Mathematical Operations
frontend = {'HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'}
backend = {'Python', 'Node', 'TypeScript', 'SQL', 'Django'}

# 1. Automatic duplicate removal
numbers = [1, 2, 2, 3, 4, 4, 4, 5]
unique_numbers = set(numbers)
print("Unique numbers set:", unique_numbers)

# 2. Union: all unique skills
all_skills = frontend.union(backend)
print("All skills (Union):", all_skills)

# 3. Intersection: common skills
shared_skills = frontend.intersection(backend)
print("Shared skills (Intersection):", shared_skills)  # {'TypeScript'}

# 4. Difference: frontend only
frontend_only = frontend.difference(backend)
print("Frontend only (Difference):", frontend_only)

# 5. Symmetric Difference: skills in either, but not both
unique_to_each = frontend.symmetric_difference(backend)
print("Symmetric Difference:", unique_to_each)`,
    testGotcha: 'Writing empty_set = {} creates an empty DICTIONARY, not a set! To create an empty set, always write empty_set = set().',
    exercises: {
      level1: [
        'Find the length of the set it_companies = {"Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"}.',
        'Add "Twitter" to it_companies using .add().',
        'Insert multiple IT companies at once into it_companies using .update().',
        'Remove one of the companies from the set. What is the difference between remove and discard?'
      ],
      level2: [
        'Join A and B (Union): A = {19, 22, 24, 20, 25, 26}, B = {19, 22, 20, 25, 26, 24, 28, 27}.',
        'Find A intersection B.',
        'Is A subset of B? Is B superset of A?',
        'What is the symmetric difference between A and B?'
      ],
      level3: [
        'I am a teacher and I love to inspire and teach people. How many unique words have been used in the sentence? Use split and set to find out.'
      ]
    },
    exerciseStarterCode: `# Day 7 Exercise: Unique Words in Sentence
sentence = "I am a teacher and I love to inspire and teach people"
words = sentence.split()
unique_words = set(words)
print("Total words count:", len(words))
print("Unique words count:", len(unique_words))
print("Unique words:", unique_words)
`,
    quickQuiz: {
      question: 'Which method removes an element from a set WITHOUT raising a KeyError if the element does not exist?',
      options: ['set.remove()', 'set.discard()', 'set.pop()', 'set.delete()'],
      correctIndex: 1,
      explanation: 'set.discard() quietly ignores missing elements without throwing an error, while set.remove() raises a KeyError.'
    }
  },

  // Day 8
  {
    id: 'day_08_dictionaries',
    sectionId: 'day-08-dictionaries',
    dayNumber: 8,
    track: 'Core Data Structures',
    category: 'Data Structures',
    title: 'Day 8: Dictionaries & Key-Value Mappings',
    summary: 'Master associative data structures: key-value pairs, nested dictionaries, .get(), .keys(), .values(), and dictionary mutations.',
    estimatedTime: '45 mins',
    beginnerNote: 'A Dictionary is like an address book or real-world dictionary: you look up a "Word" (Key) to retrieve its "Definition" (Value). Extremely fast O(1) lookup.',
    keyPoints: [
      'Dictionaries are defined using curly braces with key: value pairs: user = {"name": "Tunde", "age": 25}.',
      'Keys must be immutable types (strings, numbers, tuples). Values can be any data type including lists and nested dictionaries.',
      'Safe key access: user.get("phone", "Not Provided") returns default fallback instead of raising KeyError.',
      'Adding/Modifying items: user["email"] = "tunde@example.com".',
      'Inspecting dict: .keys() returns all keys, .values() returns all values, .items() returns (key, value) tuple pairs.',
      'Deleting items: user.pop("key") removes and returns value; del user["key"] deletes key; user.clear() empties dict.'
    ],
    codeExample: `# Day 8: Dictionaries in Python
person = {
    'first_name': 'Asabeneh',
    'last_name': 'Yetayeh',
    'age': 250,
    'country': 'Finland',
    'is_married': False,
    'skills': ['JavaScript', 'React', 'Node', 'MongoDB', 'Python'],
    'address': {
        'street': 'Space street',
        'zipcode': '02210'
    }
}

# 1. Accessing values safely with .get()
print("First Name:", person['first_name'])
print("Phone (safe):", person.get('phone', 'No phone on record'))

# 2. Modifying and Adding values
person['age'] = 251
person['skills'].append('FastAPI')
person['city'] = 'Helsinki'
print("Updated skills:", person['skills'])

# 3. Iterating keys and values with .items()
print("\\n--- Person Summary ---")
for key, value in person.items():
    if key != 'address':
        print(f"  {key}: {value}")

# 4. Checking key existence
print("Has 'skills' key:", 'skills' in person)`,
    testGotcha: 'Using dict["missing_key"] throws a KeyError! Always prefer dict.get("missing_key", default) for safe retrieval in production.',
    exercises: {
      level1: [
        'Create an empty dictionary called dog.',
        'Add name, color, breed, legs, age to the dog dictionary.',
        'Create a student dictionary and add first_name, last_name, gender, age, marital status, skills, country, city and address as keys.'
      ],
      level2: [
        'Get the length of the student dictionary.',
        'Get the value of skills and check the data type (it should be a list).',
        'Modify the skills values by adding one or two skills.',
        'Get the dictionary keys as a list using .keys() and values as a list using .values().',
        'Change the dictionary to a list of tuples using .items() method.',
        'Delete one of the items in the dictionary.'
      ]
    },
    exerciseStarterCode: `# Day 8 Exercise: Student Dictionary
student = {
    'first_name': 'Zainab',
    'last_name': 'Ali',
    'age': 22,
    'country': 'Kenya',
    'skills': ['Python', 'SQL', 'Git']
}

student['skills'].extend(['Pandas', 'Flask'])
print("Total keys in student:", len(student))
print("Skills list:", student['skills'])
print("All keys:", list(student.keys()))
print("All items:", list(student.items()))
`,
    quickQuiz: {
      question: 'What happens when calling my_dict["country"] if "country" is not present in my_dict?',
      options: ['Returns None', 'Returns False', 'Raises a KeyError', 'Creates the key with value None'],
      correctIndex: 2,
      explanation: 'Bracket access dict[key] raises a KeyError if the key is missing. Use dict.get(key) to return None or a custom default instead.'
    }
  }
];
