import React, { useState } from 'react';
import { Zap, Calendar, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ActionPlanView = ({ actionPlan = {} }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  const stages = [
    {
      id: 'today',
      label: t('advisory.today', 'Today'),
      badge: t('advisory.todayTitle', 'Immediate Actions'),
      color: 'amber',
      icon: Clock,
      items: actionPlan.today || [],
      desc: t('advisory.todayTitle', 'Immediate adjustments to irrigation, soil, and scouting protocols'),
    },
    {
      id: 'next3Days',
      label: t('advisory.next3Days', 'Next 3 Days'),
      badge: t('advisory.next3DaysTitle', 'Monitoring & Tuning'),
      color: 'blue',
      icon: Calendar,
      items: actionPlan.next3Days || [],
      desc: t('advisory.next3DaysTitle', 'Targeted biological or nutritional interventions & symptom monitoring'),
    },
    {
      id: 'next7Days',
      label: t('advisory.next7Days', 'Next 7 Days'),
      badge: t('advisory.next7DaysTitle', 'Recovery Check'),
      color: 'indigo',
      icon: CheckCircle,
      items: actionPlan.next7Days || [],
      desc: t('advisory.next7DaysTitle', 'Vigor reassessment and verification of symptom remission'),
    },
    {
      id: 'preventive',
      label: t('advisory.prevention', 'Preventive'),
      badge: t('advisory.preventionTitle', 'Long-term Health'),
      color: 'emerald',
      icon: ShieldAlert,
      items: actionPlan.preventive || [],
      desc: t('advisory.preventionTitle', 'Systemic soil health, crop rotation, and preventive defenses'),
    },
  ];

  const filteredStages =
    activeTab === 'all' ? stages : stages.filter((s) => s.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Stage Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-darkBg-950/80 rounded-xl border border-emerald-500/20">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-emerald-500 text-black shadow-sm font-bold'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {t('advisory.actionPlan', 'Complete Roadmap')}
        </button>
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === stage.id
                  ? 'bg-emerald-500 text-black shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{stage.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 rounded-full text-emerald-400">
                {stage.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Stage Timeline Grid */}
      <div className="space-y-4">
        {filteredStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="rounded-2xl border border-emerald-500/20 border-l-4 p-5 hologram-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-500/15">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-darkBg-950 border border-emerald-500/30 text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{stage.label}</h4>
                    <p className="text-xs text-slate-400">{stage.desc}</p>
                  </div>
                </div>
                <span className="self-start sm:self-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {stage.badge}
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {stage.items.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No specific actions required for this stage.</p>
                ) : (
                  stage.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xl bg-darkBg-950/70 border border-slate-800 text-sm text-slate-200 leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionPlanView;
