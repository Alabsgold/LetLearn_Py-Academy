import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { StudentProfile } from '../types';

const STORAGE_KEY = 'letlearn_py_current_student';

// Formats a Date object to YYYY-MM-DD in local time
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Calculates yesterday's date string
export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

// Generate clean safe alphanumeric document ID
function generateStudentDocId(name: string): string {
  const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `std_${sanitized}_${randomSuffix}`;
}

export function getStoredStudent(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setStoredStudent(student: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
  } catch (e) {
    console.warn('Failed to store student locally', e);
  }
}

export function clearStoredStudent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

/**
 * Login or register a student by Name & optional PIN
 */
export async function loginOrRegisterStudent(
  name: string,
  pin: string = ''
): Promise<{ student?: StudentProfile; error?: string; isNew?: boolean }> {
  const trimmedName = name.trim();
  const trimmedPin = pin.trim();

  if (!trimmedName) {
    return { error: 'Please enter your name.' };
  }

  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  try {
    // Check if a student with this exact name already exists
    const studentsCol = collection(db, 'students');
    const q = query(studentsCol, where('name', '==', trimmedName));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // Existing student found
      const existingDoc = snap.docs[0];
      const data = existingDoc.data() as StudentProfile;

      // Check PIN verification if PIN was previously set
      if (data.pin && data.pin.length > 0) {
        if (!trimmedPin || trimmedPin !== data.pin) {
          return { error: 'Incorrect PIN for this student account. Please enter your valid 4-digit PIN.' };
        }
      }

      // Calculate streak
      let newStreak = data.streak || 1;
      if (data.lastActiveDate === yesterday) {
        newStreak += 1;
      } else if (data.lastActiveDate !== today) {
        // Missed more than 1 day
        newStreak = 1;
      }

      // Update student activity
      const updatedProfile: StudentProfile = {
        ...data,
        id: existingDoc.id,
        name: trimmedName,
        streak: newStreak,
        lastActiveDate: today,
        updatedAt: new Date().toISOString()
      };

      // If user is adding a PIN for the first time
      if (!data.pin && trimmedPin) {
        updatedProfile.pin = trimmedPin;
      }

      await updateDoc(doc(db, 'students', existingDoc.id), {
        streak: newStreak,
        lastActiveDate: today,
        pin: updatedProfile.pin || '',
        updatedAt: updatedProfile.updatedAt
      });

      setStoredStudent(updatedProfile);
      return { student: updatedProfile, isNew: false };
    }

    // New student: create account
    const newId = generateStudentDocId(trimmedName);

    // Import any existing completed topics from localStorage
    let initialCompleted: string[] = [];
    try {
      const savedTopics = localStorage.getItem('letlearn_py_completed_topics');
      if (savedTopics) {
        initialCompleted = JSON.parse(savedTopics);
      }
    } catch (e) {
      // ignore
    }

    const newStudent: StudentProfile = {
      id: newId,
      name: trimmedName,
      pin: trimmedPin,
      streak: 1, // Day 1 streak
      lastActiveDate: today,
      completedModules: initialCompleted,
      totalTestsTaken: 0,
      highestScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'students', newId), newStudent);
    setStoredStudent(newStudent);
    return { student: newStudent, isNew: true };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'students');
    return { error: 'Failed to connect to Firebase database. Please check connection.' };
  }
}

/**
 * Update completed study modules for a student in Firestore
 */
export async function syncStudentModules(
  studentId: string,
  completedModules: string[]
): Promise<void> {
  try {
    const studentRef = doc(db, 'students', studentId);
    await updateDoc(studentRef, {
      completedModules,
      updatedAt: new Date().toISOString()
    });

    const current = getStoredStudent();
    if (current && current.id === studentId) {
      setStoredStudent({
        ...current,
        completedModules,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `students/${studentId}`);
  }
}

/**
 * Record a test score submission for a student
 */
export async function recordStudentTestScore(
  studentId: string,
  score: number,
  percentage: number
): Promise<void> {
  try {
    const studentRef = doc(db, 'students', studentId);
    const snap = await getDoc(studentRef);
    if (!snap.exists()) return;

    const data = snap.data() as StudentProfile;
    const totalTests = (data.totalTestsTaken || 0) + 1;
    const highest = Math.max(data.highestScore || 0, percentage);

    await updateDoc(studentRef, {
      totalTestsTaken: totalTests,
      highestScore: highest,
      updatedAt: new Date().toISOString()
    });

    const current = getStoredStudent();
    if (current && current.id === studentId) {
      setStoredStudent({
        ...current,
        totalTestsTaken: totalTests,
        highestScore: highest,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `students/${studentId}`);
  }
}

/**
 * Real-time listener for all students in the cohort (used by Mentor Dashboard)
 */
export function subscribeToAllStudents(
  callback: (students: StudentProfile[]) => void
): () => void {
  try {
    const studentsCol = collection(db, 'students');
    return onSnapshot(
      studentsCol,
      (snapshot) => {
        const list: StudentProfile[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        // Sort by streak (descending) or recent activity
        list.sort((a, b) => (b.streak || 0) - (a.streak || 0));
        callback(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'students');
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'students');
    return () => {};
  }
}
