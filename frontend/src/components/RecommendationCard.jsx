import React from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

const priorityColors = {
  CRITICAL: 'bg-rose-100 text-rose-800 border-rose-300',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
  MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
  LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export const RecommendationCard = ({ index, recommendation }) => {
  const { action, reason, priority = 'MEDIUM' } = recommendation;
  const pColor = priorityColors[priority.toUpperCase()] || priorityColors.MEDIUM;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-soft hover:shadow-elevated hover:border-agro-300 transition-all duration-200 group relative">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-agro-100 text-agro-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 group-hover:bg-agro-600 group-hover:text-white transition-colors">
            {index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-agro-900 transition-colors">
              {action}
            </h4>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              <span className="font-medium text-slate-700">Agronomic Rationale:</span> {reason}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-md font-semibold border ${pColor}`}
        >
          {priority} Priority
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
