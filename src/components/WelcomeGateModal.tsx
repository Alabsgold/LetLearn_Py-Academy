import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { loginOrRegisterStudent } from '../services/studentService';
import { 
  User, 
  KeyRound, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface WelcomeGateModalProps {
  isOpen: boolean;
  onStudentSuccess: (student: StudentProfile) => void;
  onMentorSuccess: (mentorPin: string) => void;
  onClose?: () => void;
}

export const WelcomeGateModal: React.FC<WelcomeGateModalProps> = ({
  isOpen,
  onStudentSuccess,
  onMentorSuccess,
  onClose
}) => {
  // Mode: student sign-in (default) vs mentor PIN entry
  const [showMentorGate, setShowMentorGate] = useState(false);

  // Student inputs
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  // Mentor inputs
  const [mentorPin, setMentorPin] = useState('');
  const [isVerifyingMentor, setIsVerifyingMentor] = useState(false);
  const [mentorError, setMentorError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStudentError('Please enter your name to proceed.');
      return;
    }
    setStudentError(null);
    setIsSubmittingStudent(true);

    try {
      const res = await loginOrRegisterStudent(name.trim(), pin.trim() || '0000');
      if (res.error) {
        setStudentError(res.error);
        return;
      }
      if (res.student) {
        localStorage.setItem('letlearn_py_device_role', 'student');
        onStudentSuccess(res.student);
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setStudentError(err.message || 'Could not register profile. Please try again.');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMentorError(null);
    setIsVerifyingMentor(true);

    try {
      const res = await fetch('/api/test/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: mentorPin.trim(), role: 'instructor' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authorized) {
          sessionStorage.setItem('letlearn_py_mentor_auth', 'authorized');
          sessionStorage.setItem('letlearn_py_mentor_pin', mentorPin.trim());
          localStorage.setItem('letlearn_py_device_role', 'mentor');
          onMentorSuccess(mentorPin.trim());
          return;
        }
      }
      setMentorError('Access Denied: Incorrect Mentor PIN');
    } catch (err) {
      // Fallback verification if offline / server booting
      if (mentorPin.trim() === '2480') {
        sessionStorage.setItem('letlearn_py_mentor_auth', 'authorized');
        sessionStorage.setItem('letlearn_py_mentor_pin', mentorPin.trim());
        localStorage.setItem('letlearn_py_device_role', 'mentor');
        onMentorSuccess(mentorPin.trim());
        return;
      }
      setMentorError('Could not verify Mentor PIN. Please try again.');
    } finally {
      setIsVerifyingMentor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-auto">
        {/* Glow ambient decoration */}
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-500 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 text-slate-950 font-mono font-black text-sm ring-2 ring-white/20">
            Py
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome to LetLearn_Py
            </h1>
            <p className="text-xs text-slate-300">
              Python 3 Mastery, Coding Lab & Real-Time Assessments
            </p>
          </div>
        </div>

        {/* Dynamic Panel: Student Sign-in or Mentor PIN */}
        <div className="relative z-10">
          {!showMentorGate ? (
            /* Student Form */
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-amber-200">
                <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                <span>Sign in once on this device to track your progress & test scores.</span>
              </div>

              {studentError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{studentError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chidinma or Tunde"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Student Access PIN
                  </label>
                  <span className="text-[10px] text-amber-400/80">Default: 0000</span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="0000"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingStudent}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmittingStudent ? 'Connecting...' : 'Enter as Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Mentor PIN Form */
            <form onSubmit={handleMentorSubmit} className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Authorized Mentor Access • Command Center</span>
              </div>

              {mentorError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{mentorError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Instructor PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="••••"
                    value={mentorPin}
                    onChange={(e) => setMentorPin(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMentorGate(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Back to Student
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingMentor}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  {isVerifyingMentor ? 'Verifying...' : 'Unlock Mentor'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Discreet Mentor Dot at the Bottom Center (As requested by user) */}
        {!showMentorGate && (
          <div className="pt-2 text-center relative z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowMentorGate(true)}
              className="group p-2 flex items-center justify-center focus:outline-none transition opacity-40 hover:opacity-100"
              title="Mentor Access"
              aria-label="Mentor Access"
            >
              {/* Subtle discreet dot with tiny subtle hover indicator */}
              <span className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-all duration-300 shadow-sm group-hover:scale-125" />
            </button>
            <span className="text-[9px] text-slate-600 group-hover:text-slate-400 transition select-none -mt-1">
              Protected Area
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
