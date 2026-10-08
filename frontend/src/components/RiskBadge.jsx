import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

const config = {
  LOW: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    dot: 'bg-emerald-500',
    icon: ShieldCheck,
    label: 'Low Risk',
  },
  MEDIUM: {
    bg: 'bg-amber-50 border-amber-200 text-amber-800',
    dot: 'bg-amber-500',
    icon: AlertTriangle,
    label: 'Medium Risk',
  },
  HIGH: {
    bg: 'bg-orange-50 border-orange-200 text-orange-800',
    dot: 'bg-orange-500',
    icon: AlertOctagon,
    label: 'High Risk',
  },
  CRITICAL: {
    bg: 'bg-rose-50 border-rose-200 text-rose-800',
    dot: 'bg-rose-500 animate-pulse',
    icon: Flame,
    label: 'Critical Risk',
  },
};

export const RiskBadge = ({ level = 'MEDIUM', size = 'md' }) => {
  const normLevel = level ? level.toUpperCase() : 'MEDIUM';
  const item = config[normLevel] || config.MEDIUM;
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-3 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-sm font-bold gap-2',
  }[size] || 'px-3 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${item.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{item.label}</span>
    </span>
  );
};

export default RiskBadge;
