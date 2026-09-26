import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppView } from '../types';
import { BookOpen, Terminal, Clock, Lock, Share2, Check, Radio } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  activeTestCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, activeTestCount }) => {
  const [copied, setCopied] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/test/session-status');
        if (res.ok) {
          const data = await res.json();
          setIsSessionOpen(data.isOpen);
        }
      } catch (e) {
        // ignore in background
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyStudentLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?view=test`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const navItems = [
    { id: 'study' as AppView, label: 'Study Notes', shortLabel: 'Notes', icon: BookOpen, badge: null },
    { id: 'practice' as AppView, label: 'Python Lab', shortLabel: 'Lab', icon: Terminal, badge: null },
    { id: 'test' as AppView, label: "Today's Test", shortLabel: 'Test', icon: Clock, badge: isSessionOpen ? 'PIN 0000' : 'Closed' },
    { id: 'mentor' as AppView, label: 'Mentor', shortLabel: 'Mentor', icon: Lock, badge: activeTestCount > 0 ? `${activeTestCount}` : null }
  ];

  return (
    <>
      {/* 1. Sleek Top Navigation Bar (Strict One-Row, Zero-Scatter Design) */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 pt-2.5 sm:pt-4 pb-1">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto liquid-glass rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl relative"
        >
          {/* Zone 1: Single Brand Element with OS26 Liquid Py Glyph */}
          <button
            onClick={() => onViewChange('study')}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: 2 }}
              whileTap={{ scale: 0.94 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-blue-500 flex items-center justify-center shadow-lg shadow-amber-500/25 text-slate-950 font-mono font-black text-xs shrink-0 ring-1 ring-white/20"
            >
              Py
            </motion.div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors">
                LetLearn_Py
              </span>
              {/* Subtle status dot */}
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${
                  isSessionOpen
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1 ${
                    isSessionOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`}
                />
                <span className="hidden sm:inline">{isSessionOpen ? 'Session Live' : 'Session Closed'}</span>
                <span className="sm:hidden">{isSessionOpen ? 'Live' : 'Closed'}</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Pill Bar with Animated Sliding Pill */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl backdrop-blur-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Sliding Liquid Glass Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-active-pill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-blue-500/30 border border-white/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-semibold">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Action (Share Student Test Link) */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleCopyStudentLink}
              title="Copy direct test link for students (PIN: 0000)"
              className="flex items-center space-x-1.5 px-3 py-1.5 liquid-glass-pill hover:bg-white/[0.08] text-slate-200 text-xs font-semibold rounded-xl transition shadow-sm border border-white/10 min-h-[36px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">Share Test Link</span>
                  <span className="sm:hidden text-amber-300">Share</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* 2. OS26 Mobile Liquid Glass Bottom Navigation Dock (Ergonomic Thumb-Zone) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-40 liquid-glass-dock rounded-2xl px-2 py-1.5 shadow-2xl flex items-center justify-around border border-white/20 select-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onViewChange(item.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-xl transition-colors focus:outline-none"
            >
              {/* Active liquid glass backing */}
              {isActive && (
                <motion.div
                  layoutId="mobile-dock-active-pill"
                  className="absolute inset-1 bg-gradient-to-tr from-amber-500/20 via-blue-500/25 to-indigo-500/20 rounded-xl border border-white/25 shadow-inner"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              {/* Icon with active highlight */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'text-amber-300 scale-110' : 'text-slate-400'
                    }`}
                  />
                  {/* Small badge dot on icon if notification exists */}
                  {item.id === 'mentor' && activeTestCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[8px] flex items-center justify-center font-mono animate-pulse">
                      {activeTestCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium tracking-tight transition-colors ${
                    isActive ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.shortLabel}
                </span>
              </div>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
};
