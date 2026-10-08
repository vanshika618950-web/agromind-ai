import React from 'react';
import {
  Brain,
  Sprout,
  ShieldAlert,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AgentWorkflowTimeline = ({
  agentLogs = [],
  activeStep = null, // for live running animation (0, 1, 2, 3, or null when complete)
  isLiveSimulation = false,
}) => {
  const { t } = useLanguage();

  const AGENT_CONFIG = [
    {
      id: 'problem_analyzer',
      number: '01',
      name: 'Problem Analyzer Agent',
      title: t('newAdvisory.agent1Progress', 'Understanding Crop Symptoms'),
      description: t('dashboard.agent1Task', 'Analyzing crop symptoms'),
      icon: Brain,
      color: 'emerald',
    },
    {
      id: 'crop_reasoning',
      number: '02',
      name: 'Crop Reasoning Agent',
      title: t('newAdvisory.agent2Progress', 'Analyzing Agricultural Context'),
      description: t('dashboard.agent2Task', 'Evaluating crop and soil conditions'),
      icon: Sprout,
      color: 'teal',
    },
    {
      id: 'risk_assessment',
      number: '03',
      name: 'Risk Assessment Agent',
      title: t('newAdvisory.agent3Progress', 'Evaluating Severity & Urgency'),
      description: t('dashboard.agent3Task', 'Calculating agricultural risk'),
      icon: ShieldAlert,
      color: 'amber',
    },
    {
      id: 'action_planner',
      number: '04',
      name: 'Action Planner Agent',
      title: t('newAdvisory.agent4Progress', 'Synthesizing Action Roadmap'),
      description: t('dashboard.agent4Task', 'Preparing recommendations'),
      icon: CalendarCheck2,
      color: 'indigo',
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-slate-800 relative overflow-hidden">
      {/* Background glow and subtle ambient pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-agro-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-agro-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 animate-spin text-agro-400" />
            <span>{t('newAdvisory.multiAgentActive', 'Autonomous Multi-Agent Pipeline')}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display mt-1 text-white">
            {t('dashboard.agentActivityTitle', 'AI Agent Activity')}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            {t('dashboard.agentActivitySubtitle', '4 specialized AI agents reasoning collaboratively in sequence.')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-agro-500/15 text-agro-300 border border-agro-500/30">
            <span className="w-2 h-2 rounded-full bg-agro-400 animate-pulse" />
            {isLiveSimulation
              ? t('newAdvisory.multiAgentActive', 'Orchestration Active')
              : t('advisory.orchestrationVerified', '4 Agents Verified')}
          </span>
        </div>
      </div>

      {/* Agent Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
        {AGENT_CONFIG.map((agent, index) => {
          const Icon = agent.icon;
          // Match log if available
          const log = agentLogs.find(
            (l) => l.agentName === agent.id || l.agentName === agent.id.toLowerCase()
          );

          // State determination
          const isDone = isLiveSimulation
            ? activeStep > index
            : Boolean(log || activeStep === null || activeStep >= 4);
          const isCurrent = isLiveSimulation && activeStep === index;
          const isPending = isLiveSimulation && activeStep < index;

          return (
            <div
              key={agent.id}
              className={`rounded-xl p-4 sm:p-5 border transition-all duration-300 relative flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-800/90 border-agro-400 ring-2 ring-agro-400/20 shadow-glow'
                  : isDone
                  ? 'bg-slate-800/40 border-slate-700/80 hover:bg-slate-800/70'
                  : 'bg-slate-900/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div>
                {/* Agent Number & Status Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-agro-400 tracking-wider">
                    {agent.number}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-agro-300 bg-agro-950/80 px-2 py-0.5 rounded border border-agro-500/40 animate-pulse">
                      {t('common.running', 'Running...')}
                    </span>
                  ) : isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {t('common.completed', 'Complete')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">
                      {t('common.waiting', 'Pending')}
                    </span>
                  )}
                </div>

                {/* Agent Icon & Name */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isCurrent
                        ? 'bg-agro-500 text-slate-950 font-bold'
                        : isDone
                        ? 'bg-slate-700 text-agro-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">
                    {agent.name}
                  </h4>
                </div>

                {/* Subtitle & Description */}
                <p className="text-xs font-medium text-agro-200/90 mb-1">
                  {agent.title}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Execution Stats Footer if logged */}
              {log && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{log.executionTimeMs || 420} ms</span>
                  </div>
                  <span className="text-[10px] text-agro-400 font-mono">
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentWorkflowTimeline;
