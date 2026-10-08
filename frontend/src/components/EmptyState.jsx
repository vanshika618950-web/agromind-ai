import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PlusCircle } from 'lucide-react';

export const EmptyState = ({
  title = 'No Advisories Found',
  description = 'You have not generated any crop advisories yet. Submit your first crop inquiry to trigger the multi-agent reasoning pipeline.',
  actionText = 'Generate First Advisory',
  actionTo = '/advisory/new',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-agro-50 border border-agro-200 text-agro-600 flex items-center justify-center mx-auto mb-4">
        <Sprout className="w-8 h-8" />
      </div>
      <h3 className="font-display font-bold text-lg text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
      {actionTo && (
        <div className="mt-6">
          <Link
            to={actionTo}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-semibold text-sm shadow-soft hover:shadow-glow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
