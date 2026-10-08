import React, { useState } from 'react';
import { Zap, Calendar, Clock, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const ActionPlanView = ({ actionPlan = {} }) => {
  const [activeTab, setActiveTab] = useState('all');

  const stages = [
    {
      id: 'immediate',
      label: 'Immediate',
      badge: 'Right Now',
      color: 'rose',
      icon: Zap,
      items: actionPlan.immediate || [],
      desc: 'Critical diagnostic & stabilization steps before leaving the plot',
    },
    {
      id: 'today',
      label: 'Today',
      badge: 'Day 1',
      color: 'amber',
      icon: Clock,
      items: actionPlan.today || [],
      desc: 'Immediate adjustments to irrigation, soil, and scouting protocols',
    },
    {
      id: 'next3Days',
      label: 'Next 3 Days',
      badge: 'Days 2-3',
      color: 'blue',
      icon: Calendar,
      items: actionPlan.next3Days || [],
      desc: 'Targeted biological or nutritional interventions & symptom monitoring',
    },
    {
      id: 'next7Days',
      label: 'Next 7 Days',
      badge: 'Days 4-7',
      color: 'indigo',
      icon: CheckCircle,
      items: actionPlan.next7Days || [],
      desc: 'Vigor reassessment and verification of symptom remission',
    },
    {
      id: 'preventive',
      label: 'Preventive',
      badge: 'Long-term',
      color: 'emerald',
      icon: ShieldAlert,
      items: actionPlan.preventive || [],
      desc: 'Systemic soil health, crop rotation, and preventive defenses',
    },
  ];

  const filteredStages =
    activeTab === 'all' ? stages : stages.filter((s) => s.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Stage Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Complete Roadmap (All Stages)
        </button>
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveTab(stage.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === stage.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{stage.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 rounded-full text-slate-500">
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
          const borderClasses = {
            rose: 'border-l-rose-500 bg-rose-50/20',
            amber: 'border-l-amber-500 bg-amber-50/20',
            blue: 'border-l-sky-500 bg-sky-50/20',
            indigo: 'border-l-indigo-500 bg-indigo-50/20',
            emerald: 'border-l-emerald-500 bg-emerald-50/20',
          }[stage.color] || 'border-l-emerald-500';

          const badgeClasses = {
            rose: 'bg-rose-100 text-rose-800 border-rose-200',
            amber: 'bg-amber-100 text-amber-800 border-amber-200',
            blue: 'bg-sky-100 text-sky-800 border-sky-200',
            indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          }[stage.color] || 'bg-slate-100 text-slate-800';

          return (
            <div
              key={stage.id}
              className={`rounded-xl border border-slate-200/90 border-l-4 p-5 shadow-soft bg-white ${borderClasses}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-200">
                    <Icon className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{stage.label}</h4>
                    <p className="text-xs text-slate-500">{stage.desc}</p>
                  </div>
                </div>
                <span className={`self-start sm:self-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeClasses}`}>
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
                      className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50/80 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-sm text-slate-700 leading-relaxed"
                    >
                      <div className="w-5 h-5 rounded-full bg-agro-100 text-agro-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
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
