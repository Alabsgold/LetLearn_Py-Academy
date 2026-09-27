import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, RotateCcw, Award, Sparkles, Flame, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgressRingProps {
  completedCount: number;
  totalCount: number;
  onMarkAll: () => void;
  onReset: () => void;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  completedCount,
  totalCount,
  onMarkAll,
  onReset,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // SVG Circular Ring Dimensions
  const size = 120;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  const triggerCelebration = () => {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#3B82F6', '#10B981', '#6366F1', '#EC4899']
    });
  };

  const handleMarkAllWithCelebration = () => {
    onMarkAll();
    triggerCelebration();
  };

  // Readiness status badge based on percentage
  const getReadinessStatus = () => {
    if (percentage === 100) {
      return {
        label: '100% Curriculum Mastered',
        color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
        note: `Exceptional work! You have mastered all ${totalCount} days of Python. Ready for assessment certification.`
      };
    }
    if (percentage >= 70) {
      return {
        label: 'High Test Readiness',
        color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
        note: 'Great mastery! Reaching advanced OOP, data analysis, and web development topics.'
      };
    }
    if (percentage >= 30) {
      return {
        label: 'Progressing Steadily',
        color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        note: 'Building strong foundations across Python data structures, functions, and control flow.'
      };
    }
    return {
      label: 'Learning Path Kickoff',
      color: 'text-slate-300 bg-white/10 border-white/15',
      note: 'Mark days as completed as you study tutorials and solve daily exercises.'
    };
  };

  const status = getReadinessStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden border border-white/15"
    >
      {/* Subtle ambient accent glow */}
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Side: Circular SVG Progress Ring */}
        <div className="flex items-center space-x-6 shrink-0">
          <div className="relative flex items-center justify-center">
            {/* SVG Ring */}
            <svg
              width={size}
              height={size}
              className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(245,158,11,0.25)]"
            >
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-white/[0.08]"
                fill="transparent"
              />

              {/* Animated Progress Stroke */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            {/* Inner Content inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span
                key={percentage}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono font-black text-2xl tracking-tight text-white"
              >
                {percentage}%
              </motion.span>
              <span className="text-[10px] font-mono text-slate-400 font-medium">
                {completedCount}/{totalCount} Done
              </span>
            </div>
          </div>

          {/* Ring Description and Milestones */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Study Progress Ring</span>
              </span>

              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${status.color}`}
              >
                {status.label}
              </span>
            </div>

            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              {status.note}
            </p>

            <div className="flex items-center space-x-3 pt-1 text-[11px] font-mono text-slate-400 justify-center sm:justify-start">
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{totalCount - completedCount} topics left</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                Saved in Local Storage
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons & Metrics */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
          {percentage < 100 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleMarkAllWithCelebration}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-semibold transition shadow-sm"
              title="Mark all 12 curriculum modules as reviewed"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Mark All Complete</span>
            </motion.button>
          ) : (
            <button
              onClick={triggerCelebration}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Celebrate 100%!</span>
            </button>
          )}

          {completedCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onReset}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-rose-300 border border-white/10 text-xs font-medium transition"
              title="Reset completed study module checklist in localStorage"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
