import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const config = {
  LOW: {
    bg: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300',
    dot: 'bg-emerald-400',
    icon: ShieldCheck,
    translationKey: 'risk.low',
    defaultLabel: 'Low Risk',
  },
  MEDIUM: {
    bg: 'bg-amber-950/80 border-amber-500/30 text-amber-300',
    dot: 'bg-amber-400',
    icon: AlertTriangle,
    translationKey: 'risk.medium',
    defaultLabel: 'Medium Risk',
  },
  HIGH: {
    bg: 'bg-orange-950/80 border-orange-500/30 text-orange-300',
    dot: 'bg-orange-400',
    icon: AlertOctagon,
    translationKey: 'risk.high',
    defaultLabel: 'High Risk',
  },
  CRITICAL: {
    bg: 'bg-rose-950/80 border-rose-500/30 text-rose-300',
    dot: 'bg-rose-400 animate-pulse',
    icon: Flame,
    translationKey: 'risk.critical',
    defaultLabel: 'Critical Risk',
  },
};

export const RiskBadge = ({ level = 'MEDIUM', size = 'md' }) => {
  const { t } = useLanguage();
  const normLevel = level ? level.toUpperCase() : 'MEDIUM';
  const item = config[normLevel] || config.MEDIUM;
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-sm font-bold gap-2',
  }[size] || 'px-3 py-1 text-xs font-semibold gap-1.5';

  const label = t(item.translationKey, item.defaultLabel);

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${item.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};

export default RiskBadge;
