import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export interface StudentTestSession {
  id: string;
  name: string;
  testId?: string;
  testTitle?: string;
  startedAt: number;
  lastActiveAt: number;
  submittedAt: number | null;
  timeRemainingSeconds: number;
  status: 'in_progress' | 'submitted' | 'timed_out';
  answers: Record<string, any>;
  score: number;
  totalPossible: number;
  percentage: number;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  improvementAreas: string[];
  strengths: string[];
  codeSubmissions?: Record<string, { code: string; passed: boolean; testOutput?: string }>;
}

export interface MentorTestRecord {
  id: string;
  title: string;
  topic: string;
  extraInstructions?: string;
  date: string;
  time: string;
  durationMinutes: number;
  isScheduled: boolean;
  isLive: boolean;
  questionsCount: number;
  questions: any[];
  createdAt: string;
  updatedAt: string;
}

export interface FlaggedQuestionRecord {
  id: string;
  testId?: string;
  testTitle?: string;
  questionId: string;
  questionTitle: string;
  studentName: string;
  feedback: string;
  status: 'pending' | 'resolved';
  flaggedAt: string;
}

// In-memory stores
export const testSessions: Map<string, StudentTestSession> = new Map();
export const mentorTests: Map<string, MentorTestRecord> = new Map();
export const flaggedQuestions: Map<string, FlaggedQuestionRecord> = new Map();

// Session control state
export const sessionState = {
  isOpen: true,
  activeTestId: null as string | null,
  allowedStudentPin: process.env.STUDENT_PIN || '0000',
  instructorPin: process.env.MENTOR_PIN || '2480'
};

// Helper: parse date and time into timestamp
export function parseScheduledDateTime(dateStr?: string, timeStr?: string): number | null {
  if (!dateStr || !timeStr) return null;
  try {
    const cleanTime = timeStr.trim();
    let hours = 0;
    let minutes = 0;

    if (cleanTime.toLowerCase().includes('pm') || cleanTime.toLowerCase().includes('am')) {
      const isPM = cleanTime.toLowerCase().includes('pm');
      const timeWithoutAmPm = cleanTime.replace(/(am|pm)/i, '').trim();
      const parts = timeWithoutAmPm.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1] || '0', 10);
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    } else {
      const parts = cleanTime.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1] || '0', 10);
    }

    const dateParts = dateStr.split('-');
    if (dateParts.length < 3) return null;
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return d.getTime();
  } catch (e) {
    return null;
  }
}

// Helper: automatically check scheduled tests and activate them when the scheduled time arrives
export function checkAndActivateScheduledTests(): MentorTestRecord | null {
  const now = Date.now();
  let newlyActivated: MentorTestRecord | null = null;

  for (const [id, test] of mentorTests.entries()) {
    if (test.isScheduled && !test.isLive && test.date && test.time) {
      const scheduledEpoch = parseScheduledDateTime(test.date, test.time);
      if (scheduledEpoch && now >= scheduledEpoch) {
        test.isLive = true;
        test.isScheduled = false;
        test.updatedAt = new Date().toISOString();
        sessionState.activeTestId = id;
        newlyActivated = test;

        // Deactivate other tests
        for (const [otherId, otherTest] of mentorTests.entries()) {
          if (otherId !== id && otherTest.isLive) {
            otherTest.isLive = false;
          }
        }
        break;
      }
    }
  }

  return newlyActivated;
}

// Run periodic check every 3 seconds on the server
setInterval(() => {
  try {
    checkAndActivateScheduledTests();
  } catch (e) {}
}, 3000);

const app = express();
app.use(express.json({ limit: '5mb' }));

const apiRouter = express.Router();

// Helper to get active test (with auto-activation check)
function getActiveMentorTest(): MentorTestRecord | null {
  checkAndActivateScheduledTests();

  if (sessionState.activeTestId && mentorTests.has(sessionState.activeTestId)) {
    const t = mentorTests.get(sessionState.activeTestId)!;
    if (t.isLive) return t;
  }
  // Check if any test is flagged isLive
  for (const t of mentorTests.values()) {
    if (t.isLive) return t;
  }
  return null;
}

// 1. Session Status
apiRouter.get('/session-status', (_req: Request, res: Response) => {
  const activeTest = getActiveMentorTest();
  res.json({
    success: true,
    isOpen: sessionState.isOpen,
    title: activeTest ? activeTest.title : 'Python Assessment Portal',
    activeTest: activeTest ? {
      id: activeTest.id,
      title: activeTest.title,
      topic: activeTest.topic,
      durationMinutes: activeTest.durationMinutes,
      questionsCount: activeTest.questionsCount,
      date: activeTest.date,
      time: activeTest.time,
      isLive: activeTest.isLive
    } : null,
    openedAt: Date.now(),
    activeCount: Array.from(testSessions.values()).filter(s => s.status === 'in_progress').length,
    totalCount: testSessions.size
  });
});

// 2. Verify PIN
apiRouter.post('/verify-pin', (req: Request, res: Response) => {
  const { pin, role } = req.body;
  if (role === 'instructor') {
    if (pin && String(pin).trim() === String(sessionState.instructorPin).trim()) {
      return res.json({
        success: true,
        authorized: true,
        role: 'instructor',
        token: `mentor-token-${Date.now()}`
      });
    }
    return res.status(403).json({ success: false, authorized: false, error: 'Access Denied: Incorrect PIN' });
  } else {
    if (pin && String(pin).trim() === String(sessionState.allowedStudentPin).trim()) {
      return res.json({ success: true, authorized: true, role: 'student', isOpen: sessionState.isOpen });
    }
    return res.status(403).json({ success: false, authorized: false, error: 'Invalid Student PIN' });
  }
});

// 3. Toggle session
apiRouter.post('/toggle-session', (req: Request, res: Response) => {
  const { pin, isOpen } = req.body;
  if (!pin || String(pin).trim() !== String(sessionState.instructorPin).trim()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  sessionState.isOpen = Boolean(isOpen);
  res.json({
    success: true,
    isOpen: sessionState.isOpen,
    message: sessionState.isOpen ? 'Test session is now OPEN.' : 'Test session is now CLOSED.'
  });
});

// 4. Get active test
apiRouter.get('/active-test', (_req: Request, res: Response) => {
  const activeTest = getActiveMentorTest();
  if (!activeTest) {
    // Find next upcoming scheduled test if any
    let upcomingTest: MentorTestRecord | null = null;
    for (const t of mentorTests.values()) {
      if (t.isScheduled && !t.isLive) {
        upcomingTest = t;
        break;
      }
    }
    return res.json({
      success: true,
      hasActiveTest: false,
      activeTest: null,
      upcomingTest: upcomingTest || null
    });
  }
  res.json({
    success: true,
    hasActiveTest: true,
    activeTest
  });
});

// 5. Get all mentor tests
apiRouter.get('/tests', (_req: Request, res: Response) => {
  const list = Array.from(mentorTests.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  res.json({ success: true, tests: list });
});

// 6. Create / Save mentor test
apiRouter.post('/tests', (req: Request, res: Response) => {
  const test: MentorTestRecord = req.body;
  if (!test || !test.title) {
    return res.status(400).json({ error: 'Missing test title or body' });
  }
  const cleanId = test.id || `test_${Date.now()}`;
  test.id = cleanId;
  test.updatedAt = new Date().toISOString();
  test.createdAt = test.createdAt || new Date().toISOString();

  if (test.isLive) {
    // Deactivate others
    for (const [id, t] of mentorTests.entries()) {
      if (id !== cleanId) {
        t.isLive = false;
      }
    }
    sessionState.activeTestId = cleanId;
  }

  mentorTests.set(cleanId, test);
  res.json({ success: true, test });
});

// 7. Update mentor test
apiRouter.put('/tests/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = mentorTests.get(id);
  const updated: MentorTestRecord = {
    ...(existing || {}),
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  if (updated.isLive) {
    for (const [otherId, t] of mentorTests.entries()) {
      if (otherId !== id) {
        t.isLive = false;
      }
    }
    sessionState.activeTestId = id;
  }

  mentorTests.set(id, updated);
  res.json({ success: true, test: updated });
});

// 8. Delete test
apiRouter.delete('/tests/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  mentorTests.delete(id);
  if (sessionState.activeTestId === id) {
    sessionState.activeTestId = null;
  }
  res.json({ success: true, message: 'Test deleted successfully' });
});

// 9. Set test live status
apiRouter.post('/tests/:id/set-live', (req: Request, res: Response) => {
  const { id } = req.params;
  const { isLive } = req.body;
  const test = mentorTests.get(id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }

  test.isLive = Boolean(isLive);
  test.updatedAt = new Date().toISOString();

  if (test.isLive) {
    for (const [otherId, t] of mentorTests.entries()) {
      if (otherId !== id) {
        t.isLive = false;
      }
    }
    sessionState.activeTestId = id;
  } else if (sessionState.activeTestId === id) {
    sessionState.activeTestId = null;
  }

  res.json({ success: true, test });
});

// 10. Generate AI Test using Gemini 3.8 Flash (Server-Side)
apiRouter.post('/generate-ai-test', async (req: Request, res: Response) => {
  const {
    topic,
    extraInstructions,
    questionCount = 20,
    testName,
    durationMinutes = 60
  } = req.body;

  const validCount = [5, 10, 15, 20].includes(Number(questionCount))
    ? Number(questionCount)
    : 20;

  // Exact coding session breakdown:
  // For 20 questions: 17 multiple choice / code snippet questions + 3 coding sessions
  // For 15 questions: 12 multiple choice / code snippet questions + 3 coding sessions
  // For 10 questions: 7 multiple choice / code snippet questions + 3 coding sessions
  // For 5 questions: 2 multiple choice / code snippet questions + 3 coding sessions
  let codingCount = 3;
  if (validCount === 5) {
    codingCount = 2; // 2 coding + 3 conceptual for a 5-question quick quiz
  }
  const mcCount = validCount - codingCount;

  const prompt = `You are an expert Python computer science instructor designing an official assessment test for students learning Python programming.

Topic: ${topic || 'Python Lists, Indexing, Slicing, and Mutability'}
Additional Mentor Focus / Instructions: ${extraInstructions || 'Comprehensive conceptual and practical assessment with real code snippets.'}
Total Questions Required: exactly ${validCount} questions.
Breakdown:
- Exactly ${mcCount} questions must be a mix of 'multiple_choice' and 'snippet_output' (where students analyze Python code).
- Exactly ${codingCount} questions MUST be 'coding_challenge' (interactive coding sessions where students write Python code to solve tasks, and test cases verify expected output).

Return a valid JSON array of objects conforming to this TypeScript definition:
interface TestQuestion {
  id: string; // e.g. "q_1", "q_2", ... "c_1", "c_2", "c_3"
  type: 'multiple_choice' | 'snippet_output' | 'coding_challenge';
  topic: string; // Specific subtopic (e.g. "Negative Indexing", "List Slicing Step", "List Mutability")
  topicCategory: string; // Category group name
  title: string; // Concise question title
  prompt: string; // Clear question prompt or challenge description
  codeSnippet?: string; // (For 'snippet_output') The Python code to analyze
  options?: Array<{ key: 'a' | 'b' | 'c' | 'd'; label: string }>; // (For 'multiple_choice' & 'snippet_output' only: exactly 4 choices)
  correctAnswer: string; // The correct key ('a', 'b', 'c', or 'd') for MC, or expected console output string for coding_challenge
  explanation: string; // Concise, clear educational explanation of the answer
  improvementTip: string; // Actionable tip for students who get this wrong
  starterCode?: string; // (For 'coding_challenge' only) Python template code with helpful comments for the student
  testCases?: Array<{ expected: string; description: string }>; // (For 'coding_challenge' only) Expected string output from print()
}

Guidelines:
1. Make all questions high quality, unambiguous, and technically accurate Python 3.
2. For multiple choice and snippet output questions, provide exactly 4 distinct options with keys 'a', 'b', 'c', 'd'.
3. For coding challenges, the student code must produce output with print() matching the 'expected' string in testCases. Include starterCode that is clean and ready to edit.
4. Output ONLY valid raw JSON with NO markdown wrappers like \`\`\`json.`;

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4
        }
      });

      const responseText = response.text?.trim() || '';
      let cleanJson = responseText;
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```json\n?|^```\n?/, '').replace(/\n?```$/, '');
      }

      const generatedQuestions = JSON.parse(cleanJson);
      if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
        return res.json({
          success: true,
          questions: generatedQuestions,
          source: 'gemini-3.8-flash',
          questionCount: generatedQuestions.length,
          codingSessionsCount: generatedQuestions.filter(q => q.type === 'coding_challenge').length
        });
      }
    } catch (apiError: any) {
      console.warn('Gemini API call warning, falling back to dynamic generator:', apiError?.message);
    }
  }

  // Graceful high-quality dynamic synthesizer fallback (ensures mentor is never blocked)
  const syntheticQuestions = generateSyntheticTestQuestions(topic, validCount, codingCount);
  return res.json({
    success: true,
    questions: syntheticQuestions,
    source: 'synthesizer',
    questionCount: syntheticQuestions.length,
    codingSessionsCount: codingCount,
    notice: apiKey ? 'Generated with fallback synthesizer' : 'Generated with dynamic assessment engine'
  });
});

// Helper to synthesize Python questions when API key is offline
function generateSyntheticTestQuestions(topic: string, count: number, codingCount: number) {
  const cleanTopic = topic || 'Python Lists & Methods';
  const questions: any[] = [];
  const mcCount = count - codingCount;

  // Multiple choice & snippet question bank customized to topic
  const baseMCBank = [
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Definition & Syntax`,
      topicCategory: 'Syntax & Types',
      title: 'Valid Python Syntax',
      prompt: `Which of the following demonstrates valid syntax when working with ${cleanTopic} in Python?`,
      options: [
        { key: 'a', label: 'items = {10, 20, 30}' },
        { key: 'b', label: 'items = [10, 20, 30]' },
        { key: 'c', label: 'items = (10, 20, 30)' },
        { key: 'd', label: 'items = <10, 20, 30>' }
      ],
      correctAnswer: 'b',
      explanation: 'In Python, lists are indexed sequences enclosed in square brackets []. Parentheses represent tuples and curly braces represent sets/dictionaries.',
      improvementTip: 'Review: Always use square brackets [] to define a Python list.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Indexing`,
      topicCategory: 'Indexing & Access',
      title: 'Negative Index Retrieval',
      prompt: 'What is the output of the following code snippet?',
      codeSnippet: `data = [15, 25, 35, 45, 55]\nprint(data[-2])`,
      options: [
        { key: 'a', label: '35' },
        { key: 'b', label: '45' },
        { key: 'c', label: '55' },
        { key: 'd', label: 'IndexError' }
      ],
      correctAnswer: 'b',
      explanation: 'Negative indexing in Python counts backwards from the end: data[-1] is 55, and data[-2] is 45.',
      improvementTip: 'Negative indices begin with -1 at the rightmost item.'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Mutability`,
      topicCategory: 'Mutability & Memory',
      title: 'In-Place Modification',
      prompt: 'What does it mean that Python lists are mutable objects?',
      options: [
        { key: 'a', label: 'Their values can be modified in-place without creating a new object in memory.' },
        { key: 'b', label: 'They cannot be resized after initial allocation.' },
        { key: 'c', label: 'They only accept immutable data types like integers.' },
        { key: 'd', label: 'Any modification automatically creates a tuple.' }
      ],
      correctAnswer: 'a',
      explanation: 'Mutability means the sequence contents can be modified, appended, or deleted in place without changing the object reference ID.',
      improvementTip: 'Lists are mutable; tuples and strings are immutable.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Slicing Step`,
      topicCategory: 'Indexing & Slicing',
      title: 'Extended Slicing with Step',
      prompt: 'What is the printed output of this slicing operation?',
      codeSnippet: `numbers = [0, 1, 2, 3, 4, 5, 6, 7]\nprint(numbers[1:6:2])`,
      options: [
        { key: 'a', label: '[1, 3, 5]' },
        { key: 'b', label: '[1, 2, 3, 4, 5]' },
        { key: 'c', label: '[0, 2, 4]' },
        { key: 'd', label: '[1, 4, 6]' }
      ],
      correctAnswer: 'a',
      explanation: 'Slicing syntax [start:stop:step] starts at index 1 (value 1), steps by 2, and stops before index 6 (value 5). Result: [1, 3, 5].',
      improvementTip: 'Remember the slice stop index is exclusive.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Append vs Extend`,
      topicCategory: 'Methods',
      title: 'List Extension vs Append',
      prompt: 'What is the output after executing this code?',
      codeSnippet: `lst = [1, 2]\nlst.append([3, 4])\nprint(len(lst))`,
      options: [
        { key: 'a', label: '4' },
        { key: 'b', label: '3' },
        { key: 'c', label: '2' },
        { key: 'd', label: 'TypeError' }
      ],
      correctAnswer: 'b',
      explanation: '.append() inserts its argument as a single element. [3, 4] becomes the 3rd element at index 2, so len(lst) is 3.',
      improvementTip: 'Use .extend() to unpack items into the list; .append() adds the object as a single item.'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Pop Method`,
      topicCategory: 'Methods',
      title: 'Default Argument of pop()',
      prompt: 'When calling list.pop() with no arguments, which item is removed and returned?',
      options: [
        { key: 'a', label: 'The first item (index 0)' },
        { key: 'b', label: 'The last item (index -1)' },
        { key: 'c', label: 'A random item' },
        { key: 'd', label: 'All items are cleared' }
      ],
      correctAnswer: 'b',
      explanation: 'By default, list.pop() removes and returns the last element in O(1) time complexity.',
      improvementTip: 'pop() removes the last element unless an explicit index is passed.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - List Comprehension`,
      topicCategory: 'Comprehensions',
      title: 'Conditional List Comprehension',
      prompt: 'What does this list comprehension evaluate to?',
      codeSnippet: `nums = [1, 2, 3, 4, 5]\nres = [x * 2 for x in nums if x % 2 != 0]\nprint(res)`,
      options: [
        { key: 'a', label: '[2, 6, 10]' },
        { key: 'b', label: '[4, 8]' },
        { key: 'c', label: '[1, 3, 5]' },
        { key: 'd', label: '[2, 4, 6, 8, 10]' }
      ],
      correctAnswer: 'a',
      explanation: 'The condition if x % 2 != 0 filters for odd numbers [1, 3, 5]. Multiplying each by 2 yields [2, 6, 10].',
      improvementTip: 'Comprehension syntax: [expression for item in iterable if condition].'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Reversal Slicing`,
      topicCategory: 'Indexing & Slicing',
      title: 'Negative Step Slicing',
      prompt: 'What does the slice [::-1] produce on a list?',
      codeSnippet: `chars = ['a', 'b', 'c', 'd']\nprint(chars[::-1])`,
      options: [
        { key: 'a', label: "['d', 'c', 'b', 'a']" },
        { key: 'b', label: "['a', 'b', 'c', 'd']" },
        { key: 'c', label: "['d']" },
        { key: 'd', label: 'IndexError' }
      ],
      correctAnswer: 'a',
      explanation: 'A step of -1 steps backwards from the end through the beginning, reversing the list.',
      improvementTip: 'lst[::-1] is an idiomatic Python method to reverse a sequence.'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Shallow vs Deep Copy`,
      topicCategory: 'Memory & References',
      title: 'List Aliasing and Copying',
      prompt: 'Given a = [1, 2] and b = a. What happens if we run b.append(3)?',
      options: [
        { key: 'a', label: 'Only list b changes to [1, 2, 3]; list a remains [1, 2].' },
        { key: 'b', label: 'Both a and b reference the same list, so print(a) will show [1, 2, 3].' },
        { key: 'c', label: 'Python throws a TypeError on assignment.' },
        { key: 'd', label: 'List b becomes a tuple.' }
      ],
      correctAnswer: 'b',
      explanation: 'b = a creates an alias pointing to the identical memory address. To copy, use a.copy() or a[:].',
      improvementTip: 'Variables in Python hold object references; use .copy() to create an independent duplicate.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Index Method`,
      topicCategory: 'Methods',
      title: 'Finding Item Index',
      prompt: 'What happens when list.index(val) is executed on a value that does not exist in the list?',
      codeSnippet: `vals = [10, 20, 30]\n# If we search for 99: vals.index(99)`,
      options: [
        { key: 'a', label: 'It returns -1' },
        { key: 'b', label: 'It returns None' },
        { key: 'c', label: 'It raises a ValueError' },
        { key: 'd', label: 'It appends 99 to the list' }
      ],
      correctAnswer: 'c',
      explanation: 'Unlike JavaScript indexOf which returns -1, Python raises a ValueError if the item is absent.',
      improvementTip: 'Check if item in lst before calling lst.index(item) to avoid ValueError.'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Sort vs Sorted`,
      topicCategory: 'Methods & Built-ins',
      title: 'In-Place Sort vs sorted() Function',
      prompt: 'What is the return value of myList.sort()?',
      options: [
        { key: 'a', label: 'The sorted list' },
        { key: 'b', label: 'None' },
        { key: 'c', label: 'Boolean True' },
        { key: 'd', label: 'An integer count of swaps' }
      ],
      correctAnswer: 'b',
      explanation: '.sort() sorts the list in-place and returns None. sorted(myList) returns a new sorted list.',
      improvementTip: 'Never do x = myList.sort() because x will be assigned None.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Nested Lists`,
      topicCategory: 'Dimensions & Nesting',
      title: 'Nested Matrix Access',
      prompt: 'What is the output of the following nested list query?',
      codeSnippet: `grid = [\n  [1, 2, 3],\n  [4, 5, 6],\n  [7, 8, 9]\n]\nprint(grid[1][2])`,
      options: [
        { key: 'a', label: '4' },
        { key: 'b', label: '5' },
        { key: 'c', label: '6' },
        { key: 'd', label: '8' }
      ],
      correctAnswer: 'c',
      explanation: 'grid[1] accesses the second row [4, 5, 6]. Index [2] of that inner list gives the element 6.',
      improvementTip: 'Row-first indexing: matrix[row_index][col_index].'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Membership Testing`,
      topicCategory: 'Operators & Search',
      title: 'in Keyword Operator',
      prompt: 'Which operator efficiently checks whether an element exists inside a Python list?',
      options: [
        { key: 'a', label: 'contains' },
        { key: 'b', label: 'in' },
        { key: 'c', label: 'has' },
        { key: 'd', label: 'exists' }
      ],
      correctAnswer: 'b',
      explanation: 'The in operator (e.g. if item in myList:) checks membership in sequential O(n) time.',
      improvementTip: 'Use if x in lst: to guard before accessing.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Insert Method`,
      topicCategory: 'Methods',
      title: 'List insert(index, item)',
      prompt: 'What will the list look like after the insert operation?',
      codeSnippet: `fruits = ['apple', 'orange']\nfruits.insert(1, 'banana')\nprint(fruits)`,
      options: [
        { key: 'a', label: "['apple', 'banana', 'orange']" },
        { key: 'b', label: "['banana', 'apple', 'orange']" },
        { key: 'c', label: "['apple', 'orange', 'banana']" },
        { key: 'd', label: "['apple', 'banana']" }
      ],
      correctAnswer: 'a',
      explanation: '.insert(1, item) places the new item at index 1, shifting subsequent elements to the right.',
      improvementTip: '.insert(index, element) adds an element without overwriting existing items.'
    },
    {
      type: 'multiple_choice',
      topic: `${cleanTopic} - Clear vs Del`,
      topicCategory: 'Deletion & Clearing',
      title: 'Emptying a List',
      prompt: 'Which method empties all elements from an existing list in-place?',
      options: [
        { key: 'a', label: 'myList.clear()' },
        { key: 'b', label: 'myList.delete()' },
        { key: 'c', label: 'myList.empty()' },
        { key: 'd', label: 'myList.reset()' }
      ],
      correctAnswer: 'a',
      explanation: 'myList.clear() removes all items from the list, leaving an empty list [].',
      improvementTip: 'clear() empties the list while preserving the same object reference.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Count Method`,
      topicCategory: 'Methods',
      title: 'Counting Occurrences',
      prompt: 'What is the output of the .count() method below?',
      codeSnippet: `letters = ['p', 'y', 't', 'h', 'o', 'n', 'p', 'y']\nprint(letters.count('y'))`,
      options: [
        { key: 'a', label: '1' },
        { key: 'b', label: '2' },
        { key: 'c', label: '3' },
        { key: 'd', label: '0' }
      ],
      correctAnswer: 'b',
      explanation: "The element 'y' appears twice in the list, so .count('y') returns 2.",
      improvementTip: 'list.count(x) counts exact value matches.'
    },
    {
      type: 'snippet_output',
      topic: `${cleanTopic} - Slicing Replacement`,
      topicCategory: 'Mutability',
      title: 'Batch Slice Assignment',
      prompt: 'What does this slice assignment code print?',
      codeSnippet: `nums = [10, 20, 30, 40]\nnums[1:3] = [99, 100]\nprint(nums)`,
      options: [
        { key: 'a', label: '[10, 99, 100, 40]' },
        { key: 'b', label: '[99, 100, 30, 40]' },
        { key: 'c', label: '[10, 20, 99, 100]' },
        { key: 'd', label: 'TypeError' }
      ],
      correctAnswer: 'a',
      explanation: 'The slice nums[1:3] (elements 20 and 30) is replaced in-place by [99, 100].',
      improvementTip: 'Slice assignment replaces multiple elements simultaneously.'
    }
  ];

  // Pick mcCount items
  for (let i = 0; i < mcCount; i++) {
    const template = baseMCBank[i % baseMCBank.length];
    questions.push({
      ...template,
      id: `q_${i + 1}`,
      title: `Question ${i + 1}: ${template.title}`
    });
  }

  // 3 Coding Sessions
  const codingChallenges = [
    {
      type: 'coding_challenge',
      topic: `${cleanTopic} - Nested List Target Extraction`,
      topicCategory: 'Coding Challenge - Indexing',
      title: `Coding Challenge 1: Multi-Dimensional Extraction`,
      prompt: `Extract the number 42 from inside the nested structure and print it.\nmyList = [5, [10, 20, [30, 42, 50]], 90]`,
      starterCode: `# Extract and print the number 42 from myList:\nmyList = [5, [10, 20, [30, 42, 50]], 90]\n\n# Your code below:\nprint(myList[1][2][1])\n`,
      correctAnswer: '42',
      explanation: 'The nested sub-list is at index 1. Its inner sub-list is at index 2, and 42 is at index 1 within that.',
      improvementTip: 'Step inwards bracket by bracket: myList[outer][inner][deepest].',
      testCases: [
        {
          expected: '42',
          description: 'Extract and print 42 from myList[1][2][1]'
        }
      ]
    },
    {
      type: 'coding_challenge',
      topic: `${cleanTopic} - List Comprehension Filter`,
      topicCategory: 'Coding Challenge - Comprehensions',
      title: `Coding Challenge 2: Filter and Transform with List Comprehension`,
      prompt: `Given numbers = [1, 2, 3, 4, 5, 6, 7, 8], write a list comprehension to square only the even numbers and print the resulting list.`,
      starterCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8]\n\n# Write a list comprehension that squares only the even numbers:\nresult = [n**2 for n in numbers if n % 2 == 0]\n\nprint(result)\n`,
      correctAnswer: '[4, 16, 36, 64]',
      explanation: 'The even numbers are 2, 4, 6, 8. Their squares are 4, 16, 36, 64.',
      improvementTip: 'Remember syntax: [x**2 for x in numbers if x % 2 == 0].',
      testCases: [
        {
          expected: '[4, 16, 36, 64]',
          description: 'Square even numbers from 1..8'
        }
      ]
    },
    {
      type: 'coding_challenge',
      topic: `${cleanTopic} - String Parsing and Appending`,
      topicCategory: 'Coding Challenge - String to List',
      title: `Coding Challenge 3: Parsing Data and Modifying List`,
      prompt: `Given a raw space-separated string data = "5 15 25 35":\n1. Split the string into a list of integers.\n2. Append the number 50 to the end.\n3. Print the final list.`,
      starterCode: `raw = "5 15 25 35"\n\n# 1. Parse into integers\n# 2. Append 50\n# 3. Print the list\nitems = [int(x) for x in raw.split()]\nitems.append(50)\nprint(items)\n`,
      correctAnswer: '[5, 15, 25, 35, 50]',
      explanation: 'raw.split() creates string tokens. [int(x) for x in ...] converts them to integers, and .append(50) adds 50.',
      improvementTip: 'Combine split(), list comprehension typecasting, and .append().',
      testCases: [
        {
          expected: '[5, 15, 25, 35, 50]',
          description: 'Parse raw string to ints and append 50'
        }
      ]
    }
  ];

  for (let c = 0; c < codingCount; c++) {
    const ch = codingChallenges[c % codingChallenges.length];
    questions.push({
      ...ch,
      id: `c_${c + 1}`,
      title: `Coding Session ${c + 1}: ${ch.title}`
    });
  }

  return questions;
}

// 11. Student Flags a Question
apiRouter.post('/flag-question', (req: Request, res: Response) => {
  const { testId, testTitle, questionId, questionTitle, studentName, feedback } = req.body;
  if (!questionId || !studentName) {
    return res.status(400).json({ error: 'Missing questionId or studentName' });
  }

  const id = `flag_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const record: FlaggedQuestionRecord = {
    id,
    testId,
    testTitle,
    questionId,
    questionTitle: questionTitle || 'Flagged Question',
    studentName: studentName.trim(),
    feedback: feedback || 'Student flagged this question for mentor review.',
    status: 'pending',
    flaggedAt: new Date().toISOString()
  };

  flaggedQuestions.set(id, record);
  res.json({ success: true, record });
});

// 12. Get Flagged Questions for Mentor
apiRouter.get('/flagged-questions', (_req: Request, res: Response) => {
  const list = Array.from(flaggedQuestions.values()).sort(
    (a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime()
  );
  res.json({ success: true, flags: list });
});

// 13. Resolve Flag
apiRouter.post('/resolve-flag', (req: Request, res: Response) => {
  const { flagId } = req.body;
  const flag = flaggedQuestions.get(flagId);
  if (flag) {
    flag.status = 'resolved';
  }
  res.json({ success: true, message: 'Flag marked as resolved.' });
});

// 14. Get all active and submitted test sessions
apiRouter.get('/students', (req: Request, res: Response) => {
  const authPin = req.headers['x-instructor-pin'] || req.query.pin;
  if (authPin && String(authPin).trim() !== String(sessionState.instructorPin).trim()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const list = Array.from(testSessions.values()).map(s => {
    const isOnline = (Date.now() - s.lastActiveAt) < 25000 && s.status === 'in_progress';
    return {
      ...s,
      isOnline
    };
  });
  res.json({
    success: true,
    isOpen: sessionState.isOpen,
    students: list,
    serverTime: Date.now()
  });
});

// 15. Student heartbeat / live progress sync
apiRouter.post('/heartbeat', (req: Request, res: Response) => {
  const {
    studentId,
    name,
    testId,
    startedAt,
    timeRemainingSeconds,
    answers,
    currentScore,
    totalPossible,
    codeSubmissions
  } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ error: 'Missing studentId or name' });
  }

  let session = testSessions.get(studentId);
  if (!session && !sessionState.isOpen) {
    return res.status(403).json({ error: 'The test session is currently closed by the instructor.' });
  }

  const activeTest = getActiveMentorTest();

  if (!session) {
    session = {
      id: studentId,
      name: name.trim(),
      testId: testId || activeTest?.id,
      testTitle: activeTest?.title || 'Python Assessment',
      startedAt: startedAt || Date.now(),
      lastActiveAt: Date.now(),
      submittedAt: null,
      timeRemainingSeconds: timeRemainingSeconds || (activeTest ? activeTest.durationMinutes * 60 : 3600),
      status: 'in_progress',
      answers: answers || {},
      score: currentScore || 0,
      totalPossible: totalPossible || (activeTest ? activeTest.questionsCount : 20),
      percentage: totalPossible ? Math.round(((currentScore || 0) / totalPossible) * 100) : 0,
      topicBreakdown: {},
      improvementAreas: [],
      strengths: [],
      codeSubmissions: codeSubmissions || {}
    };
  } else {
    session.name = name.trim();
    session.lastActiveAt = Date.now();
    session.timeRemainingSeconds = timeRemainingSeconds;
    session.answers = answers || session.answers;
    session.codeSubmissions = codeSubmissions || session.codeSubmissions;
    session.score = currentScore ?? session.score;
    session.totalPossible = totalPossible || session.totalPossible;
    session.percentage = session.totalPossible ? Math.round((session.score / session.totalPossible) * 100) : 0;
  }

  testSessions.set(studentId, session);
  res.json({ success: true, student: session });
});

// 16. Student final test submission
apiRouter.post('/submit', (req: Request, res: Response) => {
  const {
    studentId,
    name,
    testId,
    startedAt,
    answers,
    score,
    totalPossible,
    percentage,
    topicBreakdown,
    improvementAreas,
    strengths,
    codeSubmissions
  } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ error: 'Missing studentId or name' });
  }

  const activeTest = getActiveMentorTest();

  const session: StudentTestSession = {
    id: studentId,
    name: name.trim(),
    testId: testId || activeTest?.id,
    testTitle: activeTest?.title || 'Python Assessment',
    startedAt: startedAt || Date.now() - 3600000,
    lastActiveAt: Date.now(),
    submittedAt: Date.now(),
    timeRemainingSeconds: 0,
    status: 'submitted',
    answers: answers || {},
    score: score || 0,
    totalPossible: totalPossible || (activeTest ? activeTest.questionsCount : 20),
    percentage: percentage || (totalPossible ? Math.round((score / totalPossible) * 100) : 0),
    topicBreakdown: topicBreakdown || {},
    improvementAreas: improvementAreas || [],
    strengths: strengths || [],
    codeSubmissions: codeSubmissions || {}
  };

  testSessions.set(studentId, session);
  res.json({ success: true, session });
});

// 17. Reset test data
apiRouter.post('/reset', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin || String(pin).trim() !== String(sessionState.instructorPin).trim()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  testSessions.clear();
  mentorTests.clear();
  flaggedQuestions.clear();
  sessionState.activeTestId = null;
  res.json({ success: true, message: 'All test sessions, mentor tests, and flags have been reset.' });
});

// 18. Export Results as CSV
apiRouter.get('/export-csv', (_req: Request, res: Response) => {
  const students = Array.from(testSessions.values());
  const headers = [
    'Student Name',
    'Test Name',
    'Status',
    'Score',
    'Max Score',
    'Percentage (%)',
    'Time Taken (mins)',
    'Questions Answered',
    'Strengths',
    'Improvement Areas',
    'Submission Date / Time'
  ];

  const escapeCsv = (str: string) => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = students.map(s => {
    const answeredCount = Object.keys(s.answers || {}).length;
    const timeTakenMinutes = s.submittedAt 
      ? Math.max(1, Math.round((s.submittedAt - s.startedAt) / 60000))
      : Math.round((Date.now() - s.startedAt) / 60000);
    
    const submitTime = s.submittedAt 
      ? new Date(s.submittedAt).toLocaleString()
      : 'In Progress';

    const strengthsStr = (s.strengths || []).join('; ') || 'None recorded yet';
    const improveStr = (s.improvementAreas || []).join('; ') || 'All topics mastered!';

    return [
      escapeCsv(s.name),
      escapeCsv(s.testTitle || 'Python Assessment'),
      escapeCsv(s.status === 'submitted' ? 'Completed' : 'In Progress'),
      s.score,
      s.totalPossible,
      `${s.percentage}%`,
      timeTakenMinutes,
      `${answeredCount}/${s.totalPossible}`,
      escapeCsv(strengthsStr),
      escapeCsv(improveStr),
      escapeCsv(submitTime)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="LetLearn_Py_Cohort_Test_Results.csv"');
  res.status(200).send(csvContent);
});

// Mount router under multiple paths for local dev & Vercel serverless compatibility
app.use('/api/test', apiRouter);
app.use('/test', apiRouter);
app.use('/api', apiRouter);

export default app;
