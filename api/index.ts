import express, { Request, Response } from 'express';

export interface StudentTestSession {
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
}

// In-memory store for live student test sessions
export const testSessions: Map<string, StudentTestSession> = new Map();

// Session control state: Mentor PIN and Student PIN configurable via env vars
export const sessionState = {
  isOpen: true,
  title: "Today's Assessment: Python Lists, Functions & Foundations",
  openedAt: Date.now(),
  allowedStudentPin: process.env.STUDENT_PIN || '0000',
  instructorPin: process.env.MENTOR_PIN || '2480'
};

const app = express();
app.use(express.json({ limit: '1mb' }));

// Helper router to handle both /api/test/... and /test/... seamlessly
const apiRouter = express.Router();

// Check session status
apiRouter.get('/session-status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    isOpen: sessionState.isOpen,
    title: sessionState.title,
    openedAt: sessionState.openedAt,
    activeCount: Array.from(testSessions.values()).filter(s => s.status === 'in_progress').length,
    totalCount: testSessions.size
  });
});

// Verify PIN
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

// Instructor toggles session
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

// Get all active and submitted test sessions
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

// Student heartbeat / live progress sync
apiRouter.post('/heartbeat', (req: Request, res: Response) => {
  const {
    studentId,
    name,
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

  if (!session) {
    session = {
      id: studentId,
      name: name.trim(),
      startedAt: startedAt || Date.now(),
      lastActiveAt: Date.now(),
      submittedAt: null,
      timeRemainingSeconds: timeRemainingSeconds || 3600,
      status: 'in_progress',
      answers: answers || {},
      score: currentScore || 0,
      totalPossible: totalPossible || 18,
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

// Student final test submission
apiRouter.post('/submit', (req: Request, res: Response) => {
  const {
    studentId,
    name,
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

  const session: StudentTestSession = {
    id: studentId,
    name: name.trim(),
    startedAt: startedAt || Date.now() - 3600000,
    lastActiveAt: Date.now(),
    submittedAt: Date.now(),
    timeRemainingSeconds: 0,
    status: 'submitted',
    answers: answers || {},
    score: score || 0,
    totalPossible: totalPossible || 18,
    percentage: percentage || (totalPossible ? Math.round((score / totalPossible) * 100) : 0),
    topicBreakdown: topicBreakdown || {},
    improvementAreas: improvementAreas || [],
    strengths: strengths || [],
    codeSubmissions: codeSubmissions || {}
  };

  testSessions.set(studentId, session);
  res.json({ success: true, session });
});

// Reset test data
apiRouter.post('/reset', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin || String(pin).trim() !== String(sessionState.instructorPin).trim()) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  testSessions.clear();
  res.json({ success: true, message: 'All test sessions have been reset.' });
});

// Export Results as CSV
apiRouter.get('/export-csv', (_req: Request, res: Response) => {
  const students = Array.from(testSessions.values());
  const headers = [
    'Student Name',
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

// Mount router under both /api/test and /test for compatibility with Vercel rewrites
app.use('/api/test', apiRouter);
app.use('/test', apiRouter);

export default app;
