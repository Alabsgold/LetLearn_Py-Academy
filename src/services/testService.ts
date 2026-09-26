import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MentorTest, FlaggedQuestion } from '../types';

const TESTS_COLLECTION = 'tests';
const FLAGGED_COLLECTION = 'flaggedQuestions';
const LOCAL_STORAGE_TESTS_KEY = 'letlearn_py_mentor_tests';
const LOCAL_STORAGE_ACTIVE_TEST_KEY = 'letlearn_py_active_test_id';

// Helper for local caching fallback
function getLocalTests(): MentorTest[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalTests(tests: MentorTest[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TESTS_KEY, JSON.stringify(tests));
  } catch (e) {
    console.warn('Failed to save tests to localStorage:', e);
  }
}

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

// 1. Subscribe to all tests in real-time
export function subscribeToAllTests(callback: (tests: MentorTest[]) => void) {
  try {
    const testsRef = collection(db, TESTS_COLLECTION);
    const q = query(testsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tests: MentorTest[] = [];
        const now = Date.now();

        snapshot.forEach((docSnap) => {
          const t = { ...docSnap.data() as MentorTest, id: docSnap.id };

          // Check for auto-activation of scheduled tests
          if (t.isScheduled && !t.isLive && t.date && t.time) {
            const scheduledEpoch = parseScheduledDateTime(t.date, t.time);
            if (scheduledEpoch && now >= scheduledEpoch) {
              t.isLive = true;
              t.isScheduled = false;
              // trigger update in background
              setTestLiveStatus(t.id, true).catch(() => {});
            }
          }

          tests.push(t);
        });
        // Sort newest first
        tests.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        saveLocalTests(tests);
        callback(tests);
      },
      (error) => {
        console.warn('Firestore tests snapshot fallback:', error);
        callback(getLocalTests());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToAllTests error:', err);
    callback(getLocalTests());
    return () => {};
  }
}

// 2. Subscribe to the currently active / live test (with auto-activation)
export function subscribeToActiveTest(callback: (test: MentorTest | null) => void) {
  try {
    const testsRef = collection(db, TESTS_COLLECTION);
    const unsubscribe = onSnapshot(
      testsRef,
      (snapshot) => {
        let activeTest: MentorTest | null = null;
        const now = Date.now();

        snapshot.forEach((docSnap) => {
          const t = docSnap.data() as MentorTest;
          if (t.isLive) {
            activeTest = { ...t, id: docSnap.id };
          } else if (t.isScheduled && t.date && t.time) {
            // Check if scheduled time has arrived
            const scheduledEpoch = parseScheduledDateTime(t.date, t.time);
            if (scheduledEpoch && now >= scheduledEpoch) {
              activeTest = { ...t, id: docSnap.id, isLive: true, isScheduled: false };
              // trigger update in background
              setTestLiveStatus(docSnap.id, true).catch(() => {});
            }
          }
        });

        // If no test is marked live, check local preference or upcoming scheduled test
        if (!activeTest) {
          const localTests = getLocalTests();
          for (const lt of localTests) {
            if (lt.isLive) {
              activeTest = lt;
              break;
            } else if (lt.isScheduled && lt.date && lt.time) {
              const epoch = parseScheduledDateTime(lt.date, lt.time);
              if (epoch && now >= epoch) {
                activeTest = { ...lt, isLive: true, isScheduled: false };
                break;
              }
            }
          }
        }

        callback(activeTest);
      },
      (error) => {
        console.warn('Firestore active test fallback:', error);
        const local = getLocalTests().find((t) => t.isLive) || null;
        callback(local);
      }
    );

    return unsubscribe;
  } catch (e) {
    const local = getLocalTests().find((t) => t.isLive) || null;
    callback(local);
    return () => {};
  }
}

// 3. Save or update a mentor test
export async function saveMentorTest(test: MentorTest): Promise<void> {
  const cleanId = test.id || `test_${Date.now()}`;
  const testData: MentorTest = {
    ...test,
    id: cleanId,
    updatedAt: new Date().toISOString()
  };

  // Sync to local
  const current = getLocalTests().filter((t) => t.id !== cleanId);
  current.unshift(testData);
  saveLocalTests(current);

  // Sync to server API
  try {
    await fetch('/api/test/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
  } catch (e) {
    console.warn('Server test sync notice:', e);
  }

  // Sync to Firestore
  try {
    const docRef = doc(db, TESTS_COLLECTION, cleanId);
    await setDoc(docRef, testData, { merge: true });
  } catch (err) {
    console.warn('Firestore saveMentorTest notice:', err);
  }
}

// 4. Update an existing test (e.g. mentor correcting a question)
export async function updateMentorTest(test: MentorTest): Promise<void> {
  await saveMentorTest(test);
}

// 5. Delete a test
export async function deleteMentorTest(testId: string): Promise<void> {
  // Local
  const filtered = getLocalTests().filter((t) => t.id !== testId);
  saveLocalTests(filtered);

  // Server
  try {
    await fetch(`/api/test/tests/${encodeURIComponent(testId)}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Server delete test notice:', e);
  }

  // Firestore
  try {
    const docRef = doc(db, TESTS_COLLECTION, testId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore deleteMentorTest notice:', err);
  }
}

// 6. Set a test as Live (and deactivate others if exclusive)
export async function setTestLiveStatus(testId: string, isLive: boolean): Promise<void> {
  // Update local
  const tests = getLocalTests().map((t) => {
    if (t.id === testId) {
      return { ...t, isLive, updatedAt: new Date().toISOString() };
    }
    // If setting this one live, optionally deactivate others so only one is active at a time
    if (isLive) {
      return { ...t, isLive: false };
    }
    return t;
  });
  saveLocalTests(tests);

  // Update server
  try {
    await fetch(`/api/test/tests/${encodeURIComponent(testId)}/set-live`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLive })
    });
  } catch (e) {
    console.warn('Server set live notice:', e);
  }

  // Update Firestore
  try {
    const docRef = doc(db, TESTS_COLLECTION, testId);
    await updateDoc(docRef, { isLive, updatedAt: new Date().toISOString() });

    if (isLive) {
      // Deactivate other tests
      const allDocs = await getDocs(collection(db, TESTS_COLLECTION));
      allDocs.forEach(async (d) => {
        if (d.id !== testId && d.data().isLive) {
          await updateDoc(doc(db, TESTS_COLLECTION, d.id), { isLive: false });
        }
      });
    }
  } catch (err) {
    console.warn('Firestore setTestLiveStatus notice:', err);
  }
}

// 7. Student Flags a Question
export async function submitFlaggedQuestion(
  flag: Omit<FlaggedQuestion, 'id' | 'status' | 'flaggedAt'> & Partial<Pick<FlaggedQuestion, 'status' | 'flaggedAt'>>
): Promise<string> {
  const flagId = `flag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: FlaggedQuestion = {
    status: 'pending',
    flaggedAt: new Date().toISOString(),
    ...flag,
    id: flagId
  };

  // Local storage
  try {
    const raw = localStorage.getItem('letlearn_py_flagged_questions') || '[]';
    const parsed = JSON.parse(raw);
    parsed.unshift(record);
    localStorage.setItem('letlearn_py_flagged_questions', JSON.stringify(parsed));
  } catch (e) {}

  // Server
  try {
    await fetch('/api/test/flag-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
  } catch (e) {}

  // Firestore
  try {
    const docRef = doc(db, FLAGGED_COLLECTION, flagId);
    await setDoc(docRef, record);
  } catch (err) {
    console.warn('Firestore submitFlaggedQuestion notice:', err);
  }

  return flagId;
}

// 8. Subscribe to Flagged Questions for Mentor
export function subscribeToFlaggedQuestions(callback: (flags: FlaggedQuestion[]) => void) {
  try {
    const flagsRef = collection(db, FLAGGED_COLLECTION);
    const q = query(flagsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: FlaggedQuestion[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data() as FlaggedQuestion, id: docSnap.id });
        });
        list.sort((a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime());
        callback(list);
      },
      (error) => {
        console.warn('Firestore flagged questions fallback:', error);
        try {
          const raw = localStorage.getItem('letlearn_py_flagged_questions') || '[]';
          callback(JSON.parse(raw));
        } catch (e) {
          callback([]);
        }
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('subscribeToFlaggedQuestions error:', err);
    return () => {};
  }
}

// 9. Resolve Flagged Question
export async function resolveFlaggedQuestion(flagId: string): Promise<void> {
  try {
    const docRef = doc(db, FLAGGED_COLLECTION, flagId);
    await updateDoc(docRef, { status: 'resolved' });
  } catch (err) {
    console.warn('Resolve flag error:', err);
  }

  try {
    await fetch('/api/test/resolve-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagId })
    });
  } catch (e) {}
}
