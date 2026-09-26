import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, KeyRound, Flame, Sparkles, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginOrRegisterStudent } from '../services/studentService';
import { StudentProfile } from '../types';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: StudentProfile) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginOrRegisterStudent(name, pin);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      if (res.student) {
        onSuccess(res.student);
        onClose();
      }
    } catch (err) {
      setError('An error occurred connecting to Firebase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md liquid-glass rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-blue-500 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-bold">
            <User className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Student Sign-In & Dashboard
            </h2>
            <p className="text-xs text-slate-400 font-mono flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>Track daily streaks & curriculum progress</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Sarah Connor or Tunde"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Enter your name to load your existing profile or register a new one.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Your Unique PIN <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-mono">Secures your account</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                maxLength={8}
                placeholder="Set 4-digit PIN (e.g. 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 liquid-glass-input rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono tracking-widest"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              If you set a PIN, you'll need it every time you sign in to protect your progress.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Firebase Cloud Sync</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Your completed modules, assessment attempts, and daily streaks are permanently saved to our cohort database.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Syncing with Cloud...</span>
            ) : (
              <>
                <span>Enter Dashboard & Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
