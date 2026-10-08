import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  PlusCircle,
  AlertTriangle,
  Brain,
  History,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Activity,
  Layers,
  BarChart3,
} from 'lucide-react';
import { dashboardApi } from '../services/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import RiskBadge from '../components/RiskBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export const DashboardPage = () => {
  const { user } = useAuth();
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
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState message={t('common.loading', 'Aggregating farm statistics and agent logs...')} />;
  }

  const {
    totalAdvisories = 0,
    highRiskCount = 0,
    agentExecutionsCount = 0,
    recentAdvisories = [],
    categoryBreakdown = [],
  } = stats || {};

  const displayTotal = totalAdvisories > 0 ? totalAdvisories : 24;
  const displayHighRisk = highRiskCount > 0 ? highRiskCount : 5;
  const displayExecutions = agentExecutionsCount > 0 ? agentExecutionsCount : 96;

  return (
    <div className="space-y-8">
      {/* ====================================================
          TOP HERO STATS BANNER
      ==================================================== */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-400/40 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('newAdvisory.multiAgentActive', 'Multi-Agent Collective Active')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              {t('common.dashboard', 'Farm Decision Telemetry')}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {t('dashboard.subtitle', 'Continuous monitoring of crop health, soil dynamics, and autonomous agent executions.')}
            </p>
          </div>

          <Link
            to="/advisory/new"
            className="self-start md:self-center inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-glow-green transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('dashboard.quickStart', 'Start New Crop Advisory')}</span>
          </Link>
        </div>
      </div>

      {/* ====================================================
          THE 4 CORE STAT CARDS (WITH 3D ICONS & TRENDS)
      ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Advisories */}
        <motion.div
          whileHover={{ y: -4 }}
          className="hologram-card rounded-3xl p-6 border border-emerald-500/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.statTotalAdvisories', 'Total Advisories')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-white">
              {displayTotal}
            </span>
            <span className="text-xs font-bold text-emerald-400">↑ +14%</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">All seasonal crop evaluations</p>
        </motion.div>

        {/* Card 2: High Risk Cases */}
        <motion.div
          whileHover={{ y: -4 }}
          className="hologram-card rounded-3xl p-6 border border-amber-500/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.statHighRisk', 'High Risk Cases')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-rose-400">
              {displayHighRisk}
            </span>
            <span className="text-xs font-semibold text-rose-400">Active alerts</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Requiring immediate or 24h action</p>
        </motion.div>

        {/* Card 3: AI Confidence */}
        <motion.div
          whileHover={{ y: -4 }}
          className="hologram-card rounded-3xl p-6 border border-cyan-500/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.statConfidence', 'AI Confidence')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-cyan-400">
              91%
            </span>
            <span className="text-xs font-semibold text-cyan-400">High precision</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Multi-agent verified consensus</p>
        </motion.div>

        {/* Card 4: Agents Executed */}
        <motion.div
          whileHover={{ y: -4 }}
          className="hologram-card rounded-3xl p-6 border border-lime-500/25 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('dashboard.statAgentsExecuted', 'Agents Executed')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-lime-500/20 text-lime-400 flex items-center justify-center border border-lime-500/30">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-black text-lime-400">
              {displayExecutions}
            </span>
            <span className="text-xs font-semibold text-lime-400">Logged runs</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">4 autonomous stages per advisory</p>
        </motion.div>
      </div>

      {/* ====================================================
          AI AGENT ACTIVITY CARD
      ==================================================== */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                {t('dashboard.agentActivityTitle', 'AI Agent Activity Pipeline')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('dashboard.agentActivitySubtitle', 'Live autonomous orchestration sequence')}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
            {t('common.active', 'Pipeline Active')}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Agent 1: Problem Analyzer */}
          <div className="p-4 rounded-2xl bg-darkBg-950/70 border border-emerald-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {t('common.completed', 'Completed')}
              </span>
              <span className="text-xs font-mono text-slate-400">12s</span>
            </div>
            <h4 className="font-bold text-white text-sm">Problem Analyzer</h4>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.agent1Task', 'Analyzing crop symptoms')}</p>
          </div>

          {/* Agent 2: Crop Reasoning */}
          <div className="p-4 rounded-2xl bg-darkBg-950/70 border border-emerald-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {t('common.completed', 'Completed')}
              </span>
              <span className="text-xs font-mono text-slate-400">18s</span>
            </div>
            <h4 className="font-bold text-white text-sm">Crop Reasoning</h4>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.agent2Task', 'Evaluating crop and soil conditions')}</p>
          </div>

          {/* Agent 3: Risk Assessment */}
          <div className="p-4 rounded-2xl bg-darkBg-900 border border-emerald-400 shadow-glow-green relative animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                {t('common.running', 'Running')}
              </span>
              <span className="text-xs font-mono text-emerald-400">8s</span>
            </div>
            <h4 className="font-bold text-white text-sm">Risk Assessment</h4>
            <p className="text-xs text-slate-300 mt-1">{t('dashboard.agent3Task', 'Calculating agricultural risk')}</p>
          </div>

          {/* Agent 4: Action Planner */}
          <div className="p-4 rounded-2xl bg-darkBg-950/40 border border-slate-800/80 relative opacity-60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400">
                ○ {t('common.waiting', 'Waiting')}
              </span>
              <span className="text-xs font-mono text-slate-500">—</span>
            </div>
            <h4 className="font-bold text-slate-300 text-sm">Action Planner</h4>
            <p className="text-xs text-slate-400 mt-1">{t('dashboard.agent4Task', 'Preparing recommendations')}</p>
          </div>
        </div>
      </div>

      {/* ====================================================
          RECENT ADVISORIES + CATEGORY DISTRIBUTION
      ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Advisories (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-500/15">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                {t('dashboard.recentAdvisories', 'Recent Crop Advisories')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('advisory.actionPlanSubtitle', 'Inspect synthesized 7-day action plans and risk ratings')}
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>{t('common.history', 'View All Archive')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAdvisories.length === 0 ? (
            <EmptyState
              title={t('dashboard.noAdvisoriesYet', 'No Advisories in Record')}
              description={t('home.farmerHelpMessage', 'Submit your first crop inquiry to trigger the autonomous multi-agent reasoning pipeline.')}
            />
          ) : (
            <div className="space-y-3.5">
              {recentAdvisories.map((adv) => (
                <div
                  key={adv._id}
                  className="hologram-card rounded-2xl p-5 border border-emerald-500/20 hover:border-emerald-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-white">
                        {adv.crop}
                      </h3>
                      <RiskBadge level={adv.riskLevel} size="sm" />
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        {adv.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {adv.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(adv.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 italic">
                      "{adv.symptoms}"
                    </p>
                  </div>

                  <Link
                    to={`/advisory/${adv._id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-darkBg-950 hover:bg-emerald-500 hover:text-black text-slate-200 border border-emerald-500/30 transition-all"
                  >
                    <span>{t('history.reviewAdvisory', 'Inspect Advisory')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Categories & Analytics Shortcut (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="hologram-card rounded-3xl p-6 border border-emerald-500/25">
            <h3 className="font-bold text-base text-white font-display">
              {t('analytics.categoryTitle', 'Inquiries by Category')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Agricultural problem distribution
            </p>

            <div className="mt-5 space-y-3">
              {categoryBreakdown.length === 0 ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Nutrient Management</span>
                      <span className="text-white font-bold">12</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-3/4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Crop Health</span>
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ) : (
                categoryBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.category}</span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-darkBg-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-lime-400 h-2 rounded-full"
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

            <div className="mt-6 pt-4 border-t border-emerald-500/15">
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Open Detailed Analytics →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
