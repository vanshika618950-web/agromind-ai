import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sprout,
  ShieldAlert,
  CalendarCheck2,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';

const AGENTS = [
  {
    id: 'problem_analyzer',
    number: '01',
    name: 'Problem Analyzer Agent',
    role: 'Autonomous Symptom Decoding',
    description: 'Ingests farmer observation and parses chlorophyll chlorosis, necrosis, pest markings, and environmental distress.',
    executionTime: '12ms (Cached/Parallel)',
    status: 'ACTIVE',
    color: '#22c55e',
    glowClass: 'shadow-glow-green',
    icon: Brain,
    x: 0,
    y: -150,
  },
  {
    id: 'crop_reasoning',
    number: '02',
    name: 'Crop Reasoning Agent',
    role: 'Physiological Agronomic Context',
    description: 'Correlates soil absorption capacity, root hypoxia, and crop growth stage needs to establish cause hypotheses.',
    executionTime: '18ms (Sequential)',
    status: 'ACTIVE',
    color: '#06b6d4',
    glowClass: 'shadow-glow-cyan',
    icon: Sprout,
    x: 170,
    y: 0,
  },
  {
    id: 'risk_assessment',
    number: '03',
    name: 'Risk Assessment Agent',
    role: 'Yield Loss & Severity Scoring',
    description: 'Calculates the rate of symptom velocity, yield damage threshold, and flags whether human extension intervention is needed.',
    executionTime: '14ms (Evaluative)',
    status: 'ACTIVE',
    color: '#f59e0b',
    glowClass: 'shadow-elevated',
    icon: ShieldAlert,
    x: 0,
    y: 150,
  },
  {
    id: 'action_planner',
    number: '04',
    name: 'Action Planner Agent',
    role: '7-Day Chronological Roadmap',
    description: 'Synthesizes findings into chronological milestones: Immediate, Day 1, 3-Day Window, 7-Day Recovery, and Prevention.',
    executionTime: '16ms (Synthesized)',
    status: 'ACTIVE',
    color: '#a855f7',
    glowClass: 'shadow-elevated',
    icon: CalendarCheck2,
    x: -170,
    y: 0,
  },
];

export const AgenticNetworkVisualization = () => {
  const [hoveredAgent, setHoveredAgent] = useState(null);

  const activeInfo = hoveredAgent
    ? AGENTS.find((a) => a.id === hoveredAgent)
    : AGENTS[0];

  return (
    <div className="relative py-12 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Multi-Agent Network Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          How Autonomous AI Agents{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
            Collaborate in Real-Time
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          Hover over each specialized agent to inspect its responsibilities, input stream, and execution status.
        </p>
      </div>

      {/* Network Core Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Interactive SVG & Node Orbit System */}
        <div className="lg:col-span-7 relative h-[440px] sm:h-[480px] flex items-center justify-center">
          {/* Ambient Circular Grid Rings */}
          <div className="absolute w-[360px] sm:w-[400px] h-[360px] sm:h-[400px] rounded-full border border-emerald-500/10 pointer-events-none" />
          <div className="absolute w-[240px] sm:w-[260px] h-[240px] sm:h-[260px] rounded-full border border-cyan-500/15 pointer-events-none" />

          {/* SVG Animated Connecting Neural Strands */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Center coordinates: 50% 50% */}
            {/* Strands from center to the 4 nodes */}
            <line
              x1="50%"
              y1="50%"
              x2="50%"
              y2="18%"
              stroke="url(#streamGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-neural"
            />
            <line
              x1="50%"
              y1="50%"
              x2="85%"
              y2="50%"
              stroke="url(#streamGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-neural"
            />
            <line
              x1="50%"
              y1="50%"
              x2="50%"
              y2="82%"
              stroke="url(#streamGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-neural"
            />
            <line
              x1="50%"
              y1="50%"
              x2="15%"
              y2="50%"
              stroke="url(#streamGrad)"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-neural"
            />
          </svg>

          {/* Central AgroMind AI Core Node */}
          <div className="relative z-20 w-28 h-28 rounded-3xl bg-gradient-to-tr from-darkBg-900 via-darkBg-800 to-emerald-950 border-2 border-emerald-400/50 shadow-glow-emerald flex flex-col items-center justify-center text-center p-2 group hover:scale-105 transition-transform duration-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <span className="text-[11px] font-black text-white tracking-wider font-display">
              AGROMIND
            </span>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest -mt-0.5">
              AI CORE
            </span>
          </div>

          {/* 4 Satellite Agents Positioned in Cross Geometry */}
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const isHovered = hoveredAgent === agent.id;
            const isDimmed = hoveredAgent && hoveredAgent !== agent.id;

            return (
              <motion.div
                key={agent.id}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                className={`absolute z-30 cursor-pointer transition-all duration-300 ${
                  isDimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{
                  transform: `translate(${agent.x}px, ${agent.y}px)`,
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className={`px-3.5 py-2.5 rounded-2xl bg-darkBg-900/90 backdrop-blur-xl border flex items-center gap-2.5 shadow-glass transition-all ${
                    isHovered
                      ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-glow-emerald'
                      : 'border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${agent.color}22`, color: agent.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold block" style={{ color: agent.color }}>
                      AGENT {agent.number}
                    </span>
                    <span className="text-xs font-bold text-white whitespace-nowrap block">
                      {agent.name.split(' ')[0]} {agent.name.split(' ')[1]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Live Agent Inspection Card */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeInfo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="hologram-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-emerald-500/30"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-2xl"
                    style={{ backgroundColor: `${activeInfo.color}20`, color: activeInfo.color }}
                  >
                    <activeInfo.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider block"
                      style={{ color: activeInfo.color }}
                    >
                      AGENT {activeInfo.number} • {activeInfo.status}
                    </span>
                    <h3 className="text-xl font-bold font-display text-white">
                      {activeInfo.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Sub-role & Description */}
              <div className="mt-4 space-y-3">
                <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                  {activeInfo.role}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {activeInfo.description}
                </p>
              </div>

              {/* Execution Metrics Bar */}
              <div className="mt-6 pt-4 border-t border-emerald-500/15 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-darkBg-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Execution Window
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-white font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{activeInfo.executionTime}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-darkBg-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Pipeline Schema
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-emerald-400 font-mono font-semibold">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Strict JSON</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AgenticNetworkVisualization;
