import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, ChevronRight } from 'lucide-react';

interface OS26LoaderProps {
  onComplete: () => void;
}

export const OS26Loader: React.FC<OS26LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing LetLearn_Py OS26 Runtime...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 350);
          return 100;
        }

        const increment = Math.floor(Math.random() * 14) + 8;
        const next = Math.min(100, prev + increment);

        if (next > 20 && next < 50) {
          setStatusText('Compiling Python Lists & Methods Curriculum...');
        } else if (next >= 50 && next < 80) {
          setStatusText('Syncing 1-Hour Timed Assessment & PIN Gateways...');
        } else if (next >= 80) {
          setStatusText('LetLearn_Py Environment Ready');
        }
        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: 'blur(16px)',
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040711] text-slate-100 overflow-hidden select-none px-4"
    >
      {/* OS26 Ambient Floating Liquid Refraction Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1],
          opacity: [0.25, 0.45, 0.3, 0.25],
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[480px] h-[480px] rounded-full bg-blue-600/30 blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.3, 1, 0.95],
          opacity: [0.2, 0.42, 0.25, 0.2],
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute w-[440px] h-[440px] rounded-full bg-amber-500/25 blur-[140px] pointer-events-none"
      />

      {/* Main Glass Centerpiece */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm liquid-glass rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-6 border border-white/20"
      >
        {/* Animated Python OS26 Emblem */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-24 h-24 rounded-3xl bg-amber-500/20 blur-md pointer-events-none"
          />

          {/* Rotating Orbital Track */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute w-28 h-28 rounded-full border border-dashed border-blue-400/30 pointer-events-none"
          />

          {/* Core Liquid Glass Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-600 p-[1.5px] shadow-2xl shadow-amber-500/30 flex items-center justify-center relative z-10"
          >
            <div className="w-full h-full rounded-2xl bg-[#070b14]/90 backdrop-blur-2xl flex flex-col items-center justify-center">
              <span className="font-mono font-black text-2xl sm:text-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-blue-400 bg-clip-text text-transparent">
                Py
              </span>
            </div>
          </motion.div>
        </div>

        {/* Title & OS Tag */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              LetLearn_Py
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OS26
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono h-5 flex items-center justify-center truncate">
            {statusText}
          </p>
        </div>

        {/* Fluid Glass Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2 rounded-full bg-white/[0.08] backdrop-blur-xl overflow-hidden p-[1px] border border-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 shadow-sm shadow-blue-500/50"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
            <span>Python 3.12 Community</span>
            <span className="text-amber-300 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Quick Launch Skip Button */}
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-white transition flex items-center space-x-1 py-1 px-3 rounded-lg hover:bg-white/[0.05]"
        >
          <span>Skip to site</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
};
