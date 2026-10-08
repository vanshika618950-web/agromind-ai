import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sprout,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const CARDS = [
  {
    number: '01',
    name: 'Problem Analyzer',
    icon: Brain,
    description: 'Understands crop symptoms and identifies possible causes.',
    status: 'Autonomous • Step 1',
    tag: 'Symptom Extraction',
    color: 'emerald',
    borderColor: 'border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.25)',
  },
  {
    number: '02',
    name: 'Crop Reasoning',
    icon: Sprout,
    description: 'Combines crop, soil, growth stage and environmental context.',
    status: 'Agronomic • Step 2',
    tag: 'Physiology Modeling',
    color: 'teal',
    borderColor: 'border-teal-500/30',
    glowColor: 'rgba(20, 184, 166, 0.25)',
  },
  {
    number: '03',
    name: 'Risk Assessment',
    icon: ShieldAlert,
    description: 'Evaluates severity, urgency and agricultural risk.',
    status: 'Evaluative • Step 3',
    tag: 'Yield Loss Impact',
    color: 'amber',
    borderColor: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  {
    number: '04',
    name: 'Action Planner',
    icon: ClipboardList,
    description: 'Creates prioritized actions for today and the coming days.',
    status: 'Chronological • Step 4',
    tag: '7-Day Farm Roadmap',
    color: 'cyan',
    borderColor: 'border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.25)',
  },
];

export const HowAgroMindThinks = () => {
  return (
    <section id="how-it-thinks" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cognitive Multi-Agent Pipeline</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          How AgroMind{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
            Thinks & Reasons
          </span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          A four-stage collaborative pipeline that breaks complex farming decisions into dedicated AI responsibilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`hologram-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border ${card.borderColor} flex flex-col justify-between group cursor-default`}
            >
              {/* Subtle Ambient Hover Glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: card.glowColor }}
              />

              <div>
                {/* Header: Number & Tag */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20">
                    STAGE {card.number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>

                {/* 3D Glass Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-darkBg-950 to-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-glass group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Agent Name & Description */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                  {card.name}
                </h3>
                <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
                  "{card.description}"
                </p>
              </div>

              {/* Status Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  {card.status}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default HowAgroMindThinks;
