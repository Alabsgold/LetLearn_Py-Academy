export type AppView = 'study' | 'practice' | 'test' | 'student' | 'mentor';

export interface StudyModule {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  summary: string;
  beginnerNote?: string;
  keyPoints: string[];
  codeExample: string;
  testGotcha?: string;
  diagram?: {
    type: 'indexing' | 'mutability' | 'multid' | 'comprehension' | 'flow';
    data: any;
  };
  quickQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type QuestionType = 'multiple_choice' | 'snippet_output' | 'coding_challenge';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  topic: string;
  topicCategory: 'Creation & Types' | 'Indexing & Slicing' | 'List Methods' | 'Input & Loops' | 'List Comprehension & Dictionaries' | string;
  title: string;
  prompt: string;
  codeSnippet?: string;
  options?: {
    key: string;
    label: string;
  }[];
  correctAnswer: string; // key of option or expected return/output
  explanation: string;
  improvementTip: string;
  // For coding challenges
  starterCode?: string;
  testCases?: {
    input?: any;
    expected: string;
    description: string;
  }[];
}

export interface MentorTest {
  id: string;
  title: string;
  topic: string;
  extraInstructions?: string;
  date: string;
  time: string;
  durationMinutes: number;
  isScheduled: boolean;
  isLive: boolean;
  questionsCount: 5 | 10 | 15 | 20 | number;
  questions: TestQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface FlaggedQuestion {
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

export interface StudentProfile {
  id: string;
  name: string;
  pin?: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedModules: string[];
  totalTestsTaken: number;
  highestScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSession {
  id: string;
  name: string;
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
  isOnline?: boolean;
}

export interface PythonExecutionResult {
  output: string;
  error?: string;
  resultValue?: any;
}
