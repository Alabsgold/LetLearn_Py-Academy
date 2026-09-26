export type AppView = 'study' | 'practice' | 'test' | 'mentor';

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
  topicCategory: 'Creation & Types' | 'Indexing & Slicing' | 'List Methods' | 'Input & Loops' | 'List Comprehension & Dictionaries';
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
