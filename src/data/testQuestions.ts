import { TestQuestion } from '../types';

export const TEST_QUESTIONS: TestQuestion[] = [
  // 1. List Creation & Features
  {
    id: 'q1',
    type: 'multiple_choice',
    topic: 'List Creation & Syntax',
    topicCategory: 'Creation & Types',
    title: 'Question 1: List Creation & Syntax',
    prompt: 'Which of the following is the valid syntax to create an empty list in Python?',
    options: [
      { key: 'a', label: 'myList = ()' },
      { key: 'b', label: 'myList = []' },
      { key: 'c', label: 'myList = {}' },
      { key: 'd', label: 'myList = empty()' }
    ],
    correctAnswer: 'b',
    explanation: 'In Python, lists are created using square brackets []. Parentheses () create a tuple, and curly braces {} create an empty dictionary or set.',
    improvementTip: 'Review: Always use square brackets [] for lists and assignment operator = for naming.'
  },
  {
    id: 'q2',
    type: 'multiple_choice',
    topic: 'List Features & Data Types',
    topicCategory: 'Creation & Types',
    title: 'Question 2: Heterogeneous Types & Duplicates',
    prompt: 'Given: myList = [1, "string", 9.10, 1]. Which statement is TRUE about this list?',
    options: [
      { key: 'a', label: 'It causes a TypeError because all elements in a list must be of the same type.' },
      { key: 'b', label: 'Duplicate items like 1 are automatically removed.' },
      { key: 'c', label: 'It is completely valid: Python lists store items of various types and permit duplicates.' },
      { key: 'd', label: 'Lists cannot store floating-point numbers.' }
    ],
    correctAnswer: 'c',
    explanation: 'Python lists are heterogeneous (can hold integers, strings, floats together) and preserve duplicate elements in order.',
    improvementTip: 'Review: Lists allow mixed data types and duplicates, unlike sets.'
  },
  {
    id: 'q3',
    type: 'multiple_choice',
    topic: 'Mutability of Lists',
    topicCategory: 'Creation & Types',
    title: 'Question 3: List Mutability',
    prompt: 'What does it mean that Python lists are "mutable"?',
    options: [
      { key: 'a', label: 'Their elements can be changed, replaced, or added in-place after creation.' },
      { key: 'b', label: 'Their values are permanently locked and cannot be edited.' },
      { key: 'c', label: 'They can only be changed by rebooting the Python interpreter.' },
      { key: 'd', label: 'They can only hold integers.' }
    ],
    correctAnswer: 'a',
    explanation: 'Mutable means changeable. You can modify, reassign, or delete items within the list directly in memory without creating a new list.',
    improvementTip: 'Review: Mutability means elements can be changed via index assignment or methods.'
  },

  // 2. Indexing & Dimensions
  {
    id: 'q4',
    type: 'snippet_output',
    topic: 'Positive and Negative Indexing',
    topicCategory: 'Indexing & Slicing',
    title: 'Question 4: Negative Indexing',
    prompt: 'What is the output of the following code snippet?',
    codeSnippet: `myList = [10, 20, 30, 40, 50]
print(myList[-2])`,
    options: [
      { key: 'a', label: '20' },
      { key: 'b', label: '30' },
      { key: 'c', label: '40' },
      { key: 'd', label: 'IndexError: negative index is illegal' }
    ],
    correctAnswer: 'c',
    explanation: 'Negative indexing counts backwards from the end. myList[-1] is 50, and myList[-2] is 40.',
    improvementTip: 'Review: Negative indices count from the right (-1 is the last item, -2 is second to last).'
  },
  {
    id: 'q5',
    type: 'snippet_output',
    topic: 'Multi-Dimensional (Nested) Lists',
    topicCategory: 'Indexing & Slicing',
    title: 'Question 5: Multi-Dimensional List Indexing',
    prompt: 'Given the multi-dimensional list below, what does myList[3][1] return?',
    codeSnippet: `myList = [1, 2, 3, [10, 20]]
print(myList[3][1])`,
    options: [
      { key: 'a', label: '10' },
      { key: 'b', label: '20' },
      { key: 'c', label: '2' },
      { key: 'd', label: 'IndexError' }
    ],
    correctAnswer: 'b',
    explanation: 'myList[3] accesses the inner nested list [10, 20]. Then [1] accesses index 1 of that inner list, which is 20.',
    improvementTip: 'Review: Multi-dimensional lists require chained brackets: myList[outer_index][inner_index].'
  },
  {
    id: 'q6',
    type: 'snippet_output',
    topic: 'Slicing Operator & Multi-item Modification',
    topicCategory: 'Indexing & Slicing',
    title: 'Question 6: Changing Multiple Items with Slicing',
    prompt: 'What will be printed after executing the following lines?',
    codeSnippet: `nums = [1, 2, 3, 4, 5]
nums[1:3] = [20, 30]
print(nums)`,
    options: [
      { key: 'a', label: '[1, 20, 30, 4, 5]' },
      { key: 'b', label: '[1, 20, 30, 3, 4, 5]' },
      { key: 'c', label: '[20, 30, 4, 5]' },
      { key: 'd', label: '[1, 2, 20, 30, 5]' }
    ],
    correctAnswer: 'a',
    explanation: 'The slice nums[1:3] targets indices 1 and 2 (values 2 and 3). They are replaced in-place by [20, 30], leaving [1, 20, 30, 4, 5].',
    improvementTip: 'Review: Slicing start:end targets elements from start up to end-1.'
  },

  // 3. List Methods
  {
    id: 'q7',
    type: 'multiple_choice',
    topic: 'append() Method Constraints',
    topicCategory: 'List Methods',
    title: 'Question 7: append() Arguments',
    prompt: 'How many arguments does the list append() method accept, and where does it insert the item?',
    options: [
      { key: 'a', label: 'Two arguments: index and value, inserted at the specified position' },
      { key: 'b', label: 'Unlimited arguments, added anywhere randomly' },
      { key: 'c', label: 'One argument, inserted at the beginning of the list' },
      { key: 'd', label: 'Strictly one argument, added to the very end of the list' }
    ],
    correctAnswer: 'd',
    explanation: 'append() takes exactly one argument and appends it to the end of the list. To insert at a specific position, you must use insert().',
    improvementTip: 'Review: append(item) takes 1 argument at the end; insert(index, item) takes 2 arguments.'
  },
  {
    id: 'q8',
    type: 'snippet_output',
    topic: 'append() vs extend()',
    topicCategory: 'List Methods',
    title: 'Question 8: append() vs extend() Behavior',
    prompt: 'What is the resulting length of list1 after running this code?',
    codeSnippet: `list1 = [1, 2]
list1.append([3, 4])
print(len(list1))`,
    options: [
      { key: 'a', label: '4' },
      { key: 'b', label: '3' },
      { key: 'c', label: '2' },
      { key: 'd', label: 'TypeError' }
    ],
    correctAnswer: 'b',
    explanation: 'append([3, 4]) adds the entire list [3, 4] as a single nested element at index 2. Result is [1, 2, [3, 4]], which has length 3. To get length 4, extend([3, 4]) would be used.',
    improvementTip: 'Review: append(list) creates a nested list; extend(list) flattens and unpacks each element.'
  },
  {
    id: 'q9',
    type: 'snippet_output',
    topic: 'insert() Method',
    topicCategory: 'List Methods',
    title: 'Question 9: insert() Positioning',
    prompt: 'What will be printed after inserting 25 into numbers?',
    codeSnippet: `numbers = [10, 20, 40]
numbers.insert(2, 30)
print(numbers)`,
    options: [
      { key: 'a', label: '[10, 30, 20, 40]' },
      { key: 'b', label: '[10, 20, 40, 30]' },
      { key: 'c', label: '[10, 20, 30, 40]' },
      { key: 'd', label: '[30, 10, 20, 40]' }
    ],
    correctAnswer: 'c',
    explanation: 'insert(2, 30) inserts 30 at index 2. The item previously at index 2 (40) is shifted to index 3.',
    improvementTip: 'Review: insert(index, value) places value right before the existing item at index.'
  },
  {
    id: 'q10',
    type: 'multiple_choice',
    topic: 'Removing Items: pop() vs remove()',
    topicCategory: 'List Methods',
    title: 'Question 10: Difference between pop() and remove()',
    prompt: 'What is the primary difference between pop() and remove() in Python lists?',
    options: [
      { key: 'a', label: 'pop() takes an index and returns the removed item; remove() searches by value and returns None.' },
      { key: 'b', label: 'pop() deletes the entire list; remove() only removes numbers.' },
      { key: 'c', label: 'There is no difference; they are exact aliases.' },
      { key: 'd', label: 'remove() returns the removed element, but pop() does not.' }
    ],
    correctAnswer: 'a',
    explanation: 'myList.pop(index) removes and returns the element at that index. myList.remove(val) looks for the first occurrence of val and returns None.',
    improvementTip: 'Review: pop(index) removes by position and returns the value; remove(val) removes by matching value.'
  },

  // 4. Input & Loops
  {
    id: 'q11',
    type: 'multiple_choice',
    topic: 'Input Method & Typecasting',
    topicCategory: 'Input & Loops',
    title: 'Question 11: The input() Return Type Problem',
    prompt: 'Why does calculating sum = input("Enter a: ") + input("Enter b: ") fail to do arithmetic addition when the user enters 5 and 5?',
    options: [
      { key: 'a', label: 'Because Python does not support the + operator on variables.' },
      { key: 'b', label: 'Because input() always returns an integer instead of a float.' },
      { key: 'c', label: 'Because input() ALWAYS returns a string; so "5" + "5" evaluates to "55" (string concatenation).' },
      { key: 'd', label: 'Because the user did not use quotation marks.' }
    ],
    correctAnswer: 'c',
    explanation: 'input() always returns a string. Without typecasting (e.g. int(input())), the + operator performs string concatenation.',
    improvementTip: 'Review: Always wrap input with int() or float() when taking numerical inputs.'
  },
  {
    id: 'q12',
    type: 'snippet_output',
    topic: 'The split() Method',
    topicCategory: 'Input & Loops',
    title: 'Question 12: split() Behavior',
    prompt: 'What does "Apple Banana Orange".split() return?',
    codeSnippet: `text = "Apple Banana Orange"
result = text.split()
print(result)`,
    options: [
      { key: 'a', label: '("Apple", "Banana", "Orange")' },
      { key: 'b', label: '["Apple", "Banana", "Orange"]' },
      { key: 'c', label: 'AppleBananaOrange' },
      { key: 'd', label: '{"Apple", "Banana", "Orange"}' }
    ],
    correctAnswer: 'b',
    explanation: 'split() divides a string by whitespace and returns a list of substrings.',
    improvementTip: 'Review: split() converts a string into a list of words/substrings separated by spaces.'
  },
  {
    id: 'q13',
    type: 'snippet_output',
    topic: 'Taking Input List with for Loops',
    topicCategory: 'Input & Loops',
    title: 'Question 13: Loop with Typecasting',
    prompt: 'What will be the final value of nums after running this code?',
    codeSnippet: `raw = "2 4 6".split()
nums = []
for item in raw:
    nums.append(int(item) * 2)
print(nums)`,
    options: [
      { key: 'a', label: '[4, 8, 12]' },
      { key: 'b', label: '["22", "44", "66"]' },
      { key: 'c', label: '[2, 4, 6]' },
      { key: 'd', label: 'Error: Cannot multiply string by 2' }
    ],
    correctAnswer: 'a',
    explanation: 'Each item ("2", "4", "6") is typecast to an integer (2, 4, 6), multiplied by 2 (4, 8, 12), and appended to nums.',
    improvementTip: 'Review: for loops combined with append(int(x)) allows converting string tokens to numbers.'
  },

  // 5. List Comprehension & Dictionaries
  {
    id: 'q14',
    type: 'snippet_output',
    topic: 'List Comprehension Syntax',
    topicCategory: 'List Comprehension & Dictionaries',
    title: 'Question 14: List Comprehension with Condition',
    prompt: 'What is the output of the following list comprehension?',
    codeSnippet: `numbers = [1, 2, 3, 4, 5, 6]
result = [x * 10 for x in numbers if x % 2 == 0]
print(result)`,
    options: [
      { key: 'a', label: '[10, 30, 50]' },
      { key: 'b', label: '[20, 40, 60]' },
      { key: 'c', label: '[10, 20, 30, 40, 50, 60]' },
      { key: 'd', label: '[2, 4, 6]' }
    ],
    correctAnswer: 'b',
    explanation: 'The if x % 2 == 0 filter keeps only the even numbers (2, 4, 6). The expression x * 10 then produces [20, 40, 60].',
    improvementTip: 'Review: Syntax is [expression for item in iterable if condition].'
  },
  {
    id: 'q15',
    type: 'multiple_choice',
    topic: 'Dictionaries in Python Preview',
    topicCategory: 'List Comprehension & Dictionaries',
    title: 'Question 15: Python Dictionaries Syntax',
    prompt: 'How are Python Dictionaries defined, and how do they store information?',
    options: [
      { key: 'a', label: 'Using square brackets [] with 0-based indices' },
      { key: 'b', label: 'Using parentheses () with read-only elements' },
      { key: 'c', label: 'Using angle brackets <> with comma separated values' },
      { key: 'd', label: 'Using curly braces {} with key-value pairs (key: value)' }
    ],
    correctAnswer: 'd',
    explanation: 'Dictionaries in Python are written with curly braces {} and store mappings as key: value pairs.',
    improvementTip: 'Review: Dictionaries use curly braces {} and key: value pairs.'
  },

  // 6. Interactive Coding Challenges (Checked via Test Cases)
  {
    id: 'c1',
    type: 'coding_challenge',
    topic: 'Nested List Extraction',
    topicCategory: 'Indexing & Slicing',
    title: 'Coding Task 1: Multi-Dimensional List Extraction',
    prompt: `You are given a multi-dimensional list:
myList = [1, 2, 3, [10, 20, 30]]

Write a single print statement or assign a variable target that extracts the number 20 from inside the nested list.`,
    starterCode: `# Extract the value 20 from myList and print it
myList = [1, 2, 3, [10, 20, 30]]

# Your code below:
print(myList[3][1])
`,
    correctAnswer: '20',
    explanation: 'The nested sub-list [10, 20, 30] is at index 3 of myList. The element 20 is at index 1 of that inner sub-list. Hence, myList[3][1] yields 20.',
    improvementTip: 'Remember: In nested lists, the first bracket chooses the outer element, and the second chooses the inner element.',
    testCases: [
      {
        expected: '20',
        description: 'Access inner element 20 using myList[3][1]'
      }
    ]
  },
  {
    id: 'c2',
    type: 'coding_challenge',
    topic: 'List Comprehension Filter',
    topicCategory: 'List Comprehension & Dictionaries',
    title: 'Coding Task 2: Square Even Numbers with List Comprehension',
    prompt: `Using List Comprehension, create a new list named 'evens_squared' that contains the squares (x**2) of only the even numbers from the given list 'numbers'.
Print 'evens_squared'.`,
    starterCode: `numbers = [1, 2, 3, 4, 5, 6]

# Write a list comprehension to square even numbers:
evens_squared = [x**2 for x in numbers if x % 2 == 0]

print(evens_squared)
`,
    correctAnswer: '[4, 16, 36]',
    explanation: 'The even numbers are 2, 4, 6. Their squares are 4, 16, 36. List comprehension syntax: [x**2 for x in numbers if x % 2 == 0].',
    improvementTip: 'List comprehensions follow: [expr for item in list if condition].',
    testCases: [
      {
        expected: '[4, 16, 36]',
        description: 'Squares of even numbers [2, 4, 6] -> [4, 16, 36]'
      }
    ]
  },
  {
    id: 'c3',
    type: 'coding_challenge',
    topic: 'String Input Parsing & Append',
    topicCategory: 'Input & Loops',
    title: 'Coding Task 3: Parse Input String & Append Method',
    prompt: `You are given a raw string 'raw_data = "10 20 30 40"'.
1. Split it into individual items.
2. Convert each item into an integer.
3. Use the .append() method to add the integer 50 to the end of the list.
4. Print the final list.`,
    starterCode: `raw_data = "10 20 30 40"

# 1. Split and convert to list of ints
# 2. Append 50
# 3. Print the resulting list

num_list = [int(x) for x in raw_data.split()]
num_list.append(50)
print(num_list)
`,
    correctAnswer: '[10, 20, 30, 40, 50]',
    explanation: 'raw_data.split() produces ["10", "20", "30", "40"]. Converting each to int produces [10, 20, 30, 40]. Calling num_list.append(50) results in [10, 20, 30, 40, 50].',
    improvementTip: 'Combine split() to break strings into substrings, int() to typecast, and append(50) to add to the end.',
    testCases: [
      {
        expected: '[10, 20, 30, 40, 50]',
        description: 'Parse raw_data, convert to integers, append 50 -> [10, 20, 30, 40, 50]'
      }
    ]
  }
];
