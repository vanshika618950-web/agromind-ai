import React from 'react';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LoadingState = ({ message }) => {
  const { t } = useLanguage();
  const displayMsg = message || t('common.loading', 'Loading crop intelligence...');

  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center animate-pulse">
          <Sprout className="w-6 h-6" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border-2 border-emerald-400 animate-spin border-t-transparent" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-200">{displayMsg}</p>
      <p className="text-xs text-slate-400 mt-1">{t('newAdvisory.processingSubtitle', 'Connecting with AgroMind agent network...')}</p>
    </div>
  );
};

export default LoadingState;
