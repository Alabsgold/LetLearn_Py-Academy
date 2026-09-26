import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Lightbulb, 
  Check, 
  Copy, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  Zap, 
  FlaskConical 
} from 'lucide-react';
import { LAB_TIPS, LAB_BOOT_LOGS, LabTip } from '../data/labTips';

interface OS26LoaderProps {
  onComplete: () => void;
}

export const OS26Loader: React.FC<OS26LoaderProps> = ({ onComplete }) => {
  // Total progress percentage (0 - 100)
  const [progress, setProgress] = useState(0);

  // Random tip chosen initially on entrance
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(() =>
    Math.floor(Math.random() * LAB_TIPS.length)
  );

  // Copied state for the code snippet in tip
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  // Random lab session hex ID for futuristic feel
  const labSessionId = useMemo(
    () => `LL-PY-${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
    []
  );

  // Total planned duration is ~13 seconds (within user's requested 10-20 seconds)
  // 13,000ms total: tick every 65ms, adding approx 0.5% with minor organic fluctuations
  useEffect(() => {
    const totalDurationMs = 13000;
    const intervalMs = 65;
    const incrementPerTick = (100 / (totalDurationMs / intervalMs));

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }

        // Slight organic variation
        const jitter = (Math.random() - 0.5) * 0.15;
        const next = Math.min(100, prev + incrementPerTick + jitter);

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Rotate tips automatically every 4.8 seconds if user doesn't interact
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % LAB_TIPS.length);
    }, 4800);

    return () => clearInterval(tipInterval);
  }, []);

  // Keyboard shortcut: Press Enter or Space to skip immediately into lab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  const currentTip: LabTip = LAB_TIPS[currentTipIndex] || LAB_TIPS[0];

  // Current boot log stage
  const currentBootLog = useMemo(() => {
    const sorted = [...LAB_BOOT_LOGS].sort((a, b) => b.progress - a.progress);
    const match = sorted.find((log) => progress >= log.progress);
    return match || LAB_BOOT_LOGS[0];
  }, [progress]);

  // Remaining seconds calculation
  const remainingSeconds = Math.max(0, Math.ceil(((100 - progress) / 100) * 13));

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % LAB_TIPS.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + LAB_TIPS.length) % LAB_TIPS.length);
  };

  const handleRandomTip = () => {
    let nextIdx = Math.floor(Math.random() * LAB_TIPS.length);
    if (nextIdx === currentTipIndex) {
      nextIdx = (nextIdx + 1) % LAB_TIPS.length;
    }
    setCurrentTipIndex(nextIdx);
  };

  const handleCopyCode = () => {
    if (!currentTip?.code) return;
    navigator.clipboard.writeText(currentTip.code).then(() => {
      setHasCopiedCode(true);
      setTimeout(() => setHasCopiedCode(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        filter: 'blur(16px)',
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030610] text-slate-100 overflow-y-auto px-3 sm:px-6 py-6 select-none"
    >
      {/* OS26 Ambient Floating Refraction Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 0.9, 1],
          opacity: [0.2, 0.42, 0.25, 0.2],
          x: [0, 45, -35, 0],
          y: [0, -35, 25, 0]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed w-[520px] h-[520px] rounded-full bg-blue-600/25 blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.25, 1, 0.95],
          opacity: [0.18, 0.38, 0.2, 0.18],
          x: [0, -45, 35, 0],
          y: [0, 35, -25, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="fixed w-[460px] h-[460px] rounded-full bg-amber-500/20 blur-[150px] pointer-events-none"
      />

      {/* Main Glass Laboratory Entry HUD */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl liquid-glass rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col space-y-4 sm:space-y-5 border border-white/20 my-auto"
      >
        {/* Top Header: Lab Terminal Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
          {/* Lab Title & Insignia */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-500 flex items-center justify-center font-mono font-black text-xs text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-white/30">
              Py
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  LetLearn_Py Coding Lab
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  OS26
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 flex items-center space-x-1.5">
                <FlaskConical className="w-3 h-3 text-blue-400" />
                <span>Session: {labSessionId}</span>
                <span>•</span>
                <span className="text-emerald-400">Sandbox V3.12</span>
              </p>
            </div>
          </div>

          {/* Right Status Badge & Telemetry */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACCESSING LAB</span>
            </div>

            {/* Quick Skip Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onComplete}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white border border-white/15 transition shadow-sm"
              title="Skip directly into the coding lab"
            >
              <span>Enter Now</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </motion.button>
          </div>
        </div>

        {/* Live Lab Boot Telemetry Banner */}
        <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-black/40 border border-white/[0.07] text-slate-300">
          <div className="flex items-center space-x-2 overflow-hidden truncate">
            <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />
            <span className="text-slate-400">&gt;</span>
            <span className="truncate text-slate-200">{currentBootLog.text}</span>
          </div>
          <span className="text-amber-400 font-bold ml-2 shrink-0">{Math.floor(progress)}%</span>
        </div>

        {/* Introduction & Random Learning Tip Card */}
        <div className="relative rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 sm:p-5 shadow-inner overflow-hidden">
          {/* Subtle Ambient Refraction inside the card */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Tip Card Top Ribbon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Lab Tip #{currentTipIndex + 1}/{LAB_TIPS.length}</span>
              </span>

              <span
                className={`text-[9px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${currentTip.badgeColor.bg} ${currentTip.badgeColor.text} border ${currentTip.badgeColor.border}`}
              >
                {currentTip.category}
              </span>
            </div>

            {/* Tip Navigation Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevTip}
                aria-label="Previous tip"
                className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
                title="Previous Tip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleRandomTip}
                aria-label="Random tip"
                className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-amber-400 transition"
                title="Shuffle Random Tip"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNextTip}
                aria-label="Next tip"
                className="p-1 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition"
                title="Next Tip"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated Tip Content Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {/* Tip Title & Takeaway */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center space-x-2">
                  <span>{currentTip.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-0.5">
                  &ldquo;{currentTip.rule}&rdquo;
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl bg-[#070b14] border border-white/[0.09] overflow-hidden group">
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.05] text-[10px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/70" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                    <span className="ml-1 text-slate-400">python_snippet.py</span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition py-0.5 px-1.5 rounded hover:bg-white/[0.05]"
                  >
                    {hasCopiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[9px] font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[9px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 text-xs sm:text-[13px] font-mono overflow-x-auto text-slate-200 leading-relaxed max-h-36 no-scrollbar">
                  <code>{currentTip.code}</code>
                </pre>
              </div>

              {/* Explanation & Did You Know */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentTip.explanation}
                </p>
                {currentTip.didYouKnow && (
                  <div className="flex items-start space-x-1.5 text-[11px] text-blue-300/90 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-blue-200 font-semibold">Did you know?</strong>{' '}
                      {currentTip.didYouKnow}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Lab Calibration Status */}
        <div className="space-y-2 pt-1">
          {/* OS26 Liquid Glass Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-white/[0.06] backdrop-blur-xl overflow-hidden p-[1px] border border-white/10 relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 shadow-md shadow-blue-500/40 relative overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            >
              {/* Specular shimmer highlight traversing the progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-pulse" />
            </motion.div>
          </div>

          {/* Lower HUD Info & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 text-center sm:text-left">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                Entering Coding Lab in{' '}
                <strong className="text-amber-300 font-bold">{remainingSeconds}s</strong>
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-400">18 Questions Ready</span>
            </div>

            {/* Large Enter Coding Lab Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-blue-600 hover:from-amber-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition cursor-pointer min-h-[44px]"
            >
              <span>Enter Coding Lab Now</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
