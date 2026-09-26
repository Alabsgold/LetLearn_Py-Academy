import React, { useState } from 'react';
import { LAB_TIPS, LAB_BOOT_LOGS } from '../data/labTips';
import { X, Lightbulb, Copy, Check, Terminal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface LabTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInLab?: (code: string) => void;
}

export const LabTipsModal: React.FC<LabTipsModalProps> = ({ isOpen, onClose, onOpenInLab }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTip = LAB_TIPS[tipIndex];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Python Lab Briefing & Tips</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Tip {tipIndex + 1} of {LAB_TIPS.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Essential Python concepts, idiomatic practices, and gotchas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip Content Card */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              {currentTip.category}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTipIndex((prev) => (prev > 0 ? prev - 1 : LAB_TIPS.length - 1))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Previous Tip"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTipIndex((prev) => (prev < LAB_TIPS.length - 1 ? prev + 1 : 0))}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Next Tip"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white">{currentTip.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{currentTip.explanation}</p>

          {/* Code example */}
          <div className="relative p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-cyan-300">
            <pre className="overflow-x-auto">{currentTip.code}</pre>
            <button
              onClick={() => handleCopy(currentTip.code)}
              className="absolute top-2 right-2 p-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[10px] flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setTipIndex((prev) => (prev < LAB_TIPS.length - 1 ? prev + 1 : 0))}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Random Tip</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenInLab && (
              <button
                onClick={() => {
                  onOpenInLab(currentTip.code);
                  onClose();
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Open in Lab</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
