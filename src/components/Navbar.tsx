import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { BookOpen, Terminal, Clock, Lock, Share2, Check, Sparkles } from 'lucide-react';

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
        // ignore
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

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-1">
      <div className="max-w-7xl mx-auto liquid-glass rounded-2xl px-4 py-2.5 flex items-center justify-between transition-all">
        {/* Brand */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onViewChange('study')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400/90 to-blue-500/90 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-mono font-black text-sm">
            Py
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-amber-300 transition">
                LetLearn_Py
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                isSessionOpen
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isSessionOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {isSessionOpen ? 'Test Ready' : 'Test Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Floating Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5">
          <button
            onClick={() => onViewChange('study')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'study'
                ? 'liquid-glass-pill text-amber-300 font-semibold border-amber-400/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Notes</span>
          </button>

          <button
            onClick={() => onViewChange('practice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'practice'
                ? 'liquid-glass-pill text-amber-300 font-semibold border-amber-400/30'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Lab</span>
          </button>

          <button
            onClick={() => onViewChange('test')}
            className={`relative flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'test'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Test</span>
            <span className="text-[10px] opacity-75 font-mono">(PIN: 0000)</span>
          </button>

          <button
            onClick={() => onViewChange('mentor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'mentor'
                ? 'liquid-glass-pill text-emerald-300 font-semibold border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-white/[0.04]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Mentor</span>
            {activeTestCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[9px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                {activeTestCount}
              </span>
            )}
          </button>
        </nav>

        {/* Share Button */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={handleCopyStudentLink}
            title="Copy test link for students (PIN: 0000)"
            className="flex items-center space-x-1.5 px-3 py-1.5 liquid-glass-pill hover:bg-white/[0.08] text-slate-300 text-xs font-medium rounded-xl transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share Student Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
