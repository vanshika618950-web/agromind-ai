import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, AlertTriangle, Cpu, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroFloatingCards = ({ mouseOffset = { x: 0, y: 0 } }) => {
  return (
    <>
      {/* Card 1: Crop Health (Top Left) */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          x: mouseOffset.x * 0.4,
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          x: { type: 'spring', damping: 20 },
        }}
        className="absolute top-24 left-4 sm:left-8 lg:left-12 z-20 pointer-events-auto"
      >
        <div className="hologram-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-emerald-400/30 shadow-glow-emerald backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Crop Health
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-wide">
                OPTIMAL / GOOD
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Risk Level (Top Right) */}
      <motion.div
        animate={{
          y: [0, 12, 0],
          x: -mouseOffset.x * 0.35,
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          x: { type: 'spring', damping: 20 },
        }}
        className="absolute top-20 right-4 sm:right-8 lg:right-16 z-20 pointer-events-auto"
      >
        <div className="hologram-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-amber-400/30 shadow-elevated backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Risk Level
            </span>
            <span className="text-sm font-black text-amber-400 tracking-wide">
              MEDIUM RISKS
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card 3: AI Confidence (Bottom Left) */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          x: mouseOffset.x * 0.5,
        }}
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
          x: { type: 'spring', damping: 20 },
        }}
        className="absolute bottom-20 left-6 sm:left-12 lg:left-20 z-20 hidden sm:block pointer-events-auto"
      >
        <div className="hologram-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-cyan-400/30 shadow-glow-cyan backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              AI Diagnostic
            </span>
            <span className="text-sm font-black text-cyan-300 tracking-wide">
              92% CONFIDENCE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card 4: 4 Agents Active (Bottom Right) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          x: -mouseOffset.x * 0.45,
        }}
        transition={{
          y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
          x: { type: 'spring', damping: 20 },
        }}
        className="absolute bottom-20 right-6 sm:right-12 lg:right-24 z-20 pointer-events-auto"
      >
        <div className="hologram-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-emerald-400/40 shadow-glow-emerald backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Autonomous Mesh
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-emerald-400 tracking-wide">
                4 AGENTS ACTIVE
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HeroFloatingCards;
