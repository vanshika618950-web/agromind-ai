import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  AlertTriangle,
  History,
  Brain,
  ShieldCheck,
  Calendar,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { dashboardApi } from '../services/dashboardApi';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState message="Aggregating farm statistics and agent logs..." />;
  }

  const {
    totalAdvisories = 0,
    highRiskCount = 0,
    agentExecutionsCount = 0,
    recentAdvisory = null,
    recentAdvisories = [],
    categoryBreakdown = [],
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-agro-900 via-agro-800 to-slate-900 p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-agro-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-500/20 text-agro-300 text-xs font-semibold mb-3 border border-agro-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Decision Support Online</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Welcome back, {user?.name || 'Farmer'} 🌾
            </h1>
            <p className="mt-1 text-sm sm:text-base text-agro-100/80 max-w-xl">
              Your autonomous AI agents are ready to analyze crop symptoms, calibrate soil moisture, and assess field risk.
            </p>
          </div>

          <Link
            to="/advisory/new"
            className="self-start md:self-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-agro-500 hover:bg-agro-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Advisory</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Advisories */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Advisories
            </span>
            <div className="p-2.5 rounded-xl bg-agro-50 text-agro-700 border border-agro-100">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-slate-900">
              {totalAdvisories}
            </span>
            <span className="text-xs text-slate-500">synthesized</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Across all crop cycles & plots
          </p>
        </div>

        {/* High / Critical Risk */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              High / Critical Risk
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-rose-600">
              {highRiskCount}
            </span>
            <span className="text-xs text-slate-500">alerts flagged</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Requiring immediate or 24h action
          </p>
        </div>

        {/* AI Agent Executions */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Agent Runs
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Brain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-display font-black text-teal-700">
              {agentExecutionsCount}
            </span>
            <span className="text-xs text-slate-500">executions logged</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            4 Specialized agents per advisory
          </p>
        </div>

        {/* Latest Active Status */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-elevated transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Latest Crop Status
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <History className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {recentAdvisory ? (
              <div>
                <p className="text-lg font-bold text-slate-900 truncate">
                  {recentAdvisory.crop}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge level={recentAdvisory.riskLevel} size="sm" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No advisories yet</p>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {recentAdvisory
              ? `Generated ${new Date(recentAdvisory.createdAt).toLocaleDateString()}`
              : 'Submit your first report'}
          </p>
        </div>
      </div>

      {/* Main Two-Column Content: Recent Advisories + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Advisories List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                Recent Crop Advisories
              </h2>
              <p className="text-xs text-slate-500">
                Inspect AI reasoning and 7-day action roadmaps
              </p>
            </div>
            {recentAdvisories.length > 0 && (
              <Link
                to="/history"
                className="text-xs font-semibold text-agro-600 hover:text-agro-700 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentAdvisories.length === 0 ? (
            <EmptyState
              title="No Advisories in Record"
              description="Your farm history is clean. Generate your first advisory to observe the 4 AI agents in action."
            />
          ) : (
            <div className="space-y-3.5">
              {recentAdvisories.map((adv) => (
                <div
                  key={adv._id}
                  className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-soft hover:shadow-elevated hover:border-agro-300 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-agro-700 transition-colors">
                        {adv.crop}
                      </h3>
                      <RiskBadge level={adv.riskLevel} size="sm" />
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {adv.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {adv.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(adv.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{adv.symptoms}"
                    </p>
                  </div>

                  <Link
                    to={`/advisory/${adv._id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-agro-600 hover:text-white text-slate-700 transition-all self-start sm:self-center"
                  >
                    <span>View Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Categories & Quick Agent Insight (1 Col) */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft">
            <h3 className="font-bold text-base text-slate-900 font-display">
              Advisories by Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of farm stress domains
            </p>

            <div className="mt-5 space-y-3">
              {categoryBreakdown.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No category data available yet.</p>
              ) : (
                categoryBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <span className="font-bold text-slate-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-agro-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((item.count / Math.max(1, totalAdvisories)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Autonomous Agent Protocol Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 shadow-elevated border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-agro-400 text-xs font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>Orchestration Standard</span>
            </div>
            <h4 className="font-bold text-sm text-white">
              Multi-Stage AI Validation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every crop advisory is processed sequentially through Problem Analyzer, Crop Reasoning, Risk Assessment, and Action Planner agents.
            </p>
            <div className="pt-2">
              <Link
                to="/advisory/new"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-agro-300 hover:text-agro-200"
              >
                <span>Launch New Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
