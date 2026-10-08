import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sprout,
  ShieldAlert,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

const STAGES = [
  {
    id: 0,
    name: 'Problem Analyzer Agent',
    task: 'Extracting foliar symptoms & identifying probable root causes...',
    icon: Brain,
    color: '#22c55e',
  },
  {
    id: 1,
    name: 'Crop Reasoning Agent',
    task: 'Evaluating soil nutrient matrix and crop growth stage physiology...',
    icon: Sprout,
    color: '#06b6d4',
  },
  {
    id: 2,
    name: 'Risk Assessment Agent',
    task: 'Calculating yield injury velocity and expert consultation thresholds...',
    icon: ShieldAlert,
    color: '#f59e0b',
  },
  {
    id: 3,
    name: 'Action Planner Agent',
    task: 'Synthesizing chronological 7-day farm recovery roadmap...',
    icon: CalendarCheck2,
    color: '#a855f7',
  },
];

export const AIProcessingModal = ({ activeStep = 0, isOpen = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-darkBg-950/85 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-xl hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center relative z-10 pb-6 border-b border-emerald-500/15">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400/40 text-emerald-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Multi-Agent Collective Active</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            AgroMind AI is thinking...
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            4 specialized autonomous agents collaborating on your crop inquiry
          </p>
        </div>

        {/* Visual Animated Agent Stepper */}
        <div className="mt-6 space-y-3.5 relative z-10">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = activeStep > stage.id;
            const isRunning = activeStep === stage.id;
            const isWaiting = activeStep < stage.id;

            return (
              <div
                key={stage.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                  isRunning
                    ? 'bg-darkBg-900/90 border-emerald-400 shadow-glow-green ring-1 ring-emerald-400/40'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/20'
                    : 'bg-darkBg-950/40 border-slate-800/60 opacity-40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isRunning
                        ? 'bg-emerald-500 text-black font-bold animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 truncate">
                    <h4 className="text-sm font-bold text-white truncate">
                      {stage.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {stage.task}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete
                    </span>
                  )}
                  {isRunning && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Running
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-[11px] font-mono text-slate-500 px-2">
                      Waiting
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs text-slate-400">
          <span>Orchestration Progress</span>
          <span className="font-mono text-emerald-400 font-bold">
            {Math.min(100, (activeStep + 1) * 25)}%
          </span>
        </div>
        <div className="w-full bg-darkBg-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min(100, (activeStep + 1) * 25)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AIProcessingModal;
