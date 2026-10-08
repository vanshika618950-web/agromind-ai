import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PlusCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmptyState = ({
  title,
  description,
  actionText,
  actionTo = '/advisory/new',
  onActionClick,
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('dashboard.noAdvisoriesYet', 'No Advisories Found');
  const displayDesc = description || t('home.farmerHelpMessage', 'Submit your first crop inquiry to trigger the multi-agent reasoning pipeline.');
  const displayAction = actionText || t('dashboard.quickStart', 'Generate First Advisory');

  return (
    <div className="hologram-card rounded-3xl border border-emerald-500/20 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-glass">
      <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
        <Sprout className="w-8 h-8" />
      </div>
      <h3 className="font-display font-bold text-lg text-white">{displayTitle}</h3>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{displayDesc}</p>
      {actionTo && (
        <div className="mt-6">
          {onActionClick ? (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-glow-green transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{displayAction}</span>
            </button>
          ) : (
            <Link
              to={actionTo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-glow-green transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{displayAction}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
