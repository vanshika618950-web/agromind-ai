import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sprout,
  ShieldAlert,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowAgroMindThinks = () => {
  const { t } = useLanguage();

  const CARDS = [
    {
      number: '01',
      name: t('home.agent1Title', 'Problem Analyzer'),
      icon: Brain,
      description: t('home.agent1Desc', 'Understands crop symptoms and identifies possible causes.'),
      status: 'Step 1',
      tag: t('newAdvisory.agent1Progress', 'Symptom Extraction'),
      borderColor: 'border-emerald-500/30',
      glowColor: 'rgba(16, 185, 129, 0.25)',
    },
    {
      number: '02',
      name: t('home.agent2Title', 'Crop Reasoning'),
      icon: Sprout,
      description: t('home.agent2Desc', 'Combines crop, soil, growth stage and environmental context.'),
      status: 'Step 2',
      tag: t('newAdvisory.agent2Progress', 'Physiology Modeling'),
      borderColor: 'border-teal-500/30',
      glowColor: 'rgba(20, 184, 166, 0.25)',
    },
    {
      number: '03',
      name: t('home.agent3Title', 'Risk Assessment'),
      icon: ShieldAlert,
      description: t('home.agent3Desc', 'Evaluates severity, urgency and agricultural risk.'),
      status: 'Step 3',
      tag: t('newAdvisory.agent3Progress', 'Yield Loss Impact'),
      borderColor: 'border-amber-500/30',
      glowColor: 'rgba(245, 158, 11, 0.25)',
    },
    {
      number: '04',
      name: t('home.agent4Title', 'Action Planner'),
      icon: ClipboardList,
      description: t('home.agent4Desc', 'Creates prioritized actions for today and the coming days.'),
      status: 'Step 4',
      tag: t('newAdvisory.agent4Progress', '7-Day Farm Roadmap'),
      borderColor: 'border-cyan-500/30',
      glowColor: 'rgba(6, 182, 212, 0.25)',
    },
  ];

  return (
    <section id="how-it-thinks" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('home.howItThinksTitle', 'How AgroMind Thinks')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          {t('home.howItThinksTitle', 'How AgroMind Thinks')}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          {t('home.howItThinksSubtitle', 'Four specialized AI agents collaborate autonomously to formulate precise agricultural decisions.')}
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
                  <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {card.number}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    {card.status}
                  </span>
                </div>

                {/* Agent Icon & Name */}
                <div className="w-12 h-12 rounded-2xl bg-darkBg-900 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform shadow-glass">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-2">
                  {card.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between text-xs">
                <span className="text-emerald-400/90 font-medium truncate">
                  {card.tag}
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
