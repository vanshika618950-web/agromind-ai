import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Cpu,
  ShieldCheck,
  CalendarCheck2,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VisualAIWorkflow = () => {
  const { t } = useLanguage();

  const STAGES = [
    {
      step: '01',
      title: t('home.step1Title', 'FARMER INPUT'),
      icon: FileText,
      color: 'emerald',
      badge: 'Context Intake',
      items: [
        t('newAdvisory.cropLabel', 'Crop & Variety'),
        t('newAdvisory.soilLabel', 'Soil Matrix'),
        t('newAdvisory.locationLabel', 'Location / Climate'),
        t('newAdvisory.symptomsLabel', 'Symptom Details'),
      ],
    },
    {
      step: '02',
      title: t('home.step2Title', 'AI AGENTS'),
      icon: Cpu,
      color: 'teal',
      badge: 'Orchestration',
      items: [
        t('home.agent1Title', 'Problem Analyzer'),
        t('home.agent2Title', 'Crop Reasoning'),
        t('newAdvisory.multiAgentActive', 'Multi-Agent Validation'),
        t('common.confidence', 'Confidence Scoring'),
      ],
    },
    {
      step: '03',
      title: t('home.step3Title', 'RISK ANALYSIS'),
      icon: ShieldCheck,
      color: 'amber',
      badge: 'Urgency Matrix',
      items: [
        t('risk.level', 'Severity Calculation'),
        t('advisory.keyRiskDrivers', 'Risk Progression'),
        t('advisory.riskEvaluation', 'Impact Assessment'),
      ],
    },
    {
      step: '04',
      title: t('home.step4Title', 'ACTION PLAN'),
      icon: CalendarCheck2,
      color: 'cyan',
      badge: '7-Day Execution',
      items: [
        t('advisory.today', 'Today\'s Interventions'),
        t('advisory.next3Days', 'Next 3 Days Tuning'),
        t('advisory.next7Days', 'Next 7 Days Recovery'),
        t('advisory.prevention', 'Preventive Defense'),
      ],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('home.workflowTitle', 'Autonomous Multi-Agent Workflow')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          {t('home.workflowTitle', 'Autonomous Multi-Agent Workflow')}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-400">
          {t('home.workflowSubtitle', 'How farmer observations transform into scientific action steps.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {STAGES.map((stg, i) => {
          const Icon = stg.icon;
          return (
            <div key={stg.step} className="relative flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="hologram-card rounded-3xl p-6 sm:p-7 flex-1 flex flex-col justify-between border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                      PHASE {stg.step}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {stg.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold font-display text-white tracking-wide">
                      {stg.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 mt-4">
                    {stg.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-300 bg-darkBg-950/60 p-2 rounded-xl border border-slate-800/80"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VisualAIWorkflow;
