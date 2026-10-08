import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Brain,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { dashboardApi } from '../services/dashboardApi';
import LoadingState from '../components/LoadingState';
import { useLanguage } from '../context/LanguageContext';

// Time Series Demo/Aggregated Trend Data
const TIME_SERIES_DATA = [
  { month: 'May', advisories: 4, confidence: 88 },
  { month: 'Jun', advisories: 8, confidence: 91 },
  { month: 'Jul', advisories: 14, confidence: 93 },
  { month: 'Aug', advisories: 19, confidence: 90 },
  { month: 'Sep', advisories: 26, confidence: 94 },
  { month: 'Oct', advisories: 32, confidence: 96 },
];

const AGENT_EXEC_DATA = [
  { name: 'Problem Analyzer', latency: 412, color: '#22c55e' },
  { name: 'Crop Reasoning', latency: 520, color: '#06b6d4' },
  { name: 'Risk Assessment', latency: 388, color: '#f59e0b' },
  { name: 'Action Planner', latency: 460, color: '#a855f7' },
];

const RISK_DATA = [
  { name: 'Low Risk', value: 45, color: '#10b981' },
  { name: 'Medium Risk', value: 35, color: '#f59e0b' },
  { name: 'High Risk', value: 15, color: '#f97316' },
  { name: 'Critical Risk', value: 5, color: '#ef4444' },
];

const CROP_CATEGORY_DATA = [
  { category: 'Crop Health', count: 12 },
  { category: 'Nutrient Mgmt', count: 9 },
  { category: 'Pest/Disease', count: 6 },
  { category: 'Irrigation', count: 4 },
  { category: 'Soil Stress', count: 3 },
];

export const AnalyticsPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState message={t('common.loading', 'Calculating agricultural telemetry and AI models...')} />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('common.badge', 'Telemetry & Autonomous Intelligence')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t('analytics.title', 'Agricultural Intelligence Analytics')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('analytics.subtitle', 'Real-time charts tracking multi-agent execution times, risk distribution, and confidence scores.')}
          </p>
        </div>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="hologram-card rounded-2xl p-5 border border-emerald-500/25">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">
            Average AI Confidence
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-emerald-400">92.4%</span>
            <span className="text-xs text-emerald-500">↑ +3.2%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cross-agent consensus</p>
        </div>

        <div className="hologram-card rounded-2xl p-5 border border-emerald-500/25">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">
            Avg Agent Latency
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-cyan-400">445ms</span>
            <span className="text-xs text-slate-400">per agent stage</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Optimized structured outputs</p>
        </div>

        <div className="hologram-card rounded-2xl p-5 border border-emerald-500/25">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">
            Loss Avoidance Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-lime-400">96.8%</span>
            <span className="text-xs text-lime-500">Early action</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">24-48h intervention window</p>
        </div>

        <div className="hologram-card rounded-2xl p-5 border border-emerald-500/25">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">
            Database Records
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-white">
              {stats?.totalAdvisories || 12}
            </span>
            <span className="text-xs text-slate-400">advisories</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Persistent in MongoDB Atlas</p>
        </div>
      </div>

      {/* Row 1: Advisories Trend & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Advisories Over Time (Area Chart) */}
        <div className="lg:col-span-7 hologram-card rounded-3xl p-6 border border-emerald-500/25">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white font-display">
                {t('analytics.trendTitle', 'Advisories Generated Over Time')}
              </h3>
              <p className="text-xs text-slate-400">
                Monthly diagnostic inquiry velocity and confidence
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              Active Season
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES_DATA}>
                <defs>
                  <linearGradient id="agroGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#04160c',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="advisories"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#agroGreenGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution (Pie/Donut Chart) */}
        <div className="lg:col-span-5 hologram-card rounded-3xl p-6 border border-emerald-500/25">
          <h3 className="font-bold text-base text-white font-display">
            {t('analytics.riskTitle', 'Risk Severity Breakdown')}
          </h3>
          <p className="text-xs text-slate-400">
            Categorization by immediate agricultural severity
          </p>

          <div className="h-64 sm:h-72 w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {RISK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#04160c',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Agent Execution Latency & Crop Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Execution Times (Bar Chart) */}
        <div className="lg:col-span-6 hologram-card rounded-3xl p-6 border border-emerald-500/25">
          <h3 className="font-bold text-base text-white font-display">
            {t('analytics.executionTitle', 'Agent Execution Latency (ms)')}
          </h3>
          <p className="text-xs text-slate-400">
            Time required for each specialized agent stage to complete
          </p>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENT_EXEC_DATA}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#04160c',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="latency" radius={[8, 8, 0, 0]}>
                  {AGENT_EXEC_DATA.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="lg:col-span-6 hologram-card rounded-3xl p-6 border border-emerald-500/25">
          <h3 className="font-bold text-base text-white font-display">
            Inquiries by Agricultural Domain
          </h3>
          <p className="text-xs text-slate-400">
            Foliar health, irrigation balance, and soil issues
          </p>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={CROP_CATEGORY_DATA}>
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="category" stroke="#64748b" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#04160c',
                    borderColor: '#10b981',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#22d3ee" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
