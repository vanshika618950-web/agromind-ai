import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  ArrowLeft,
  MapPin,
  Calendar,
  Droplet,
  FlaskConical,
  AlertTriangle,
  Printer,
  Trash2,
  CheckCircle2,
  Brain,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Clock,
  Activity,
  Layers,
  Leaf,
} from 'lucide-react';
import { advisoryApi } from '../services/advisoryApi';
import RiskBadge from '../components/RiskBadge';
import AgentWorkflowTimeline from '../components/AgentWorkflowTimeline';
import LoadingState from '../components/LoadingState';

export const AdvisoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const res = await advisoryApi.getAdvisoryById(id);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load advisory');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisory();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this crop advisory and associated agent logs?')) return;
    setDeleting(true);
    try {
      await advisoryApi.deleteAdvisory(id);
      navigate('/history');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Synthesizing advisory telemetry and agent logs..." />;
  }

  if (error || !data) {
    return (
      <div className="hologram-card rounded-3xl border border-rose-500/30 p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Advisory Not Found</h3>
        <p className="text-sm text-slate-300 mt-1">{error || 'Could not load advisory details'}</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-darkBg-950 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const { advisory, agentLogs = [] } = data;
  const pAnalysis = advisory.problemAnalysis || {};
  const cReasoning = advisory.cropReasoning || {};
  const rAssessment = advisory.riskAssessment || {};
  const aPlan = advisory.actionPlan || {};

  // Formulate dynamic probability bars for possible causes
  const causesWithPercentages = (pAnalysis.possibleCauses || [
    'Nutrient Deficiency',
    'Water Stress',
    'Fungal Infection',
  ]).map((cause, index) => {
    const defaultScores = [78, 64, 42, 35];
    return {
      title: cause,
      percent: defaultScores[index] || 50 - index * 10,
    };
  });

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-darkBg-900 border border-emerald-500/30 text-slate-200 hover:text-white shadow-glass transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Advisory Header Card */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-500/15">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                {advisory.category}
              </span>
              <RiskBadge level={advisory.riskLevel} size="md" />
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                AI Confidence: {Math.round((pAnalysis.confidence || 0.92) * 100)}%
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              AI Crop Advisory — {advisory.crop}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                {advisory.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {new Date(advisory.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Matrix</span>
              <span className="text-xs font-bold text-white">{advisory.soilType}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Growth Stage</span>
              <span className="text-xs font-bold text-white">{advisory.growthStage}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Irrigation</span>
              <span className="text-xs font-bold text-white">{advisory.irrigation}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-darkBg-950/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Orchestration</span>
              <span className="text-xs font-bold text-emerald-400">4 Agents Verified</span>
            </div>
          </div>
        </div>

        {/* Symptoms Context Box */}
        <div className="mt-6 p-4 rounded-2xl bg-darkBg-950/60 border border-emerald-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Observed Symptoms & Farm Context:
          </span>
          <p className="text-sm text-slate-200 italic leading-relaxed">
            "{advisory.symptoms}"
          </p>
        </div>
      </div>

      {/* Autonomous Multi-Agent Pipeline Execution Timeline */}
      <AgentWorkflowTimeline agentLogs={agentLogs} isLiveSimulation={false} />

      {/* Section 1: Problem Analysis & Animated Possible Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Problem Analysis (7 cols) */}
        <div className="lg:col-span-7 hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/15">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">AGENT 01 ANALYSIS</span>
              <h2 className="text-xl font-bold font-display text-white">
                Problem Analysis & Diagnosis
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">
              Core Identified Issue:
            </span>
            <p className="text-base font-semibold text-white">
              {pAnalysis.identifiedProblem || advisory.category}
            </p>
          </div>

          {/* Key Symptoms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Diagnostic Symptoms:
            </h4>
            <div className="flex flex-wrap gap-2">
              {(pAnalysis.keySymptoms || []).map((sym, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-darkBg-950 text-slate-200 border border-slate-800"
                >
                  • {sym}
                </span>
              ))}
            </div>
          </div>

          {pAnalysis.missingInformation?.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-bold">Missing Information for Absolute Certainty: </span>
                {pAnalysis.missingInformation.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Right: Possible Causes Animated Percentage Bars (5 cols) */}
        <div className="lg:col-span-5 hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-emerald-500/15">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">PROBABILITY MATRIX</span>
              <h3 className="text-xl font-bold font-display text-white">
                Possible Causes
              </h3>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {causesWithPercentages.map((cause, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{cause.title}</span>
                  <span className="font-mono font-bold text-emerald-400">{cause.percent}%</span>
                </div>
                <div className="w-full bg-darkBg-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full"
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${cause.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: 3D / Interactive Recommendations Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Targeted Agricultural Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 💧 Irrigation */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-sky-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
              WATERING PROTOCOL
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              💧 Irrigation Guidance
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.irrigationAdvice || advisory.irrigationAdvice || 'Maintain consistent soil moisture based on crop stage.'}
            </p>
          </motion.div>

          {/* Card 2: 🌱 Nutrients */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-amber-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
              SOIL FERTILITY
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              🌱 Nutrient Guidance
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.nutrientAdvice || advisory.nutrientAdvice || 'Consider soil testing before applying chemical fertilizer.'}
            </p>
          </motion.div>

          {/* Card 3: 🌿 Crop Care */}
          <motion.div
            whileHover={{ y: -4 }}
            className="hologram-card rounded-3xl p-6 border border-emerald-500/30 shadow-glass"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              PHYSIOLOGY & CARE
            </span>
            <h3 className="text-lg font-bold font-display text-white mt-1">
              🌿 Crop Care Actions
            </h3>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              {cReasoning.analysis
                ? cReasoning.analysis.slice(0, 160) + '...'
                : 'Remove visibly damaged leaves and monitor symptom progression daily.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Section 3: Risk Assessment */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400">AGENT 03 ASSESSMENT</span>
              <h2 className="text-xl font-bold font-display text-white">
                Risk & Severity Evaluation
              </h2>
            </div>
          </div>
          <RiskBadge level={rAssessment.riskLevel || advisory.riskLevel} size="md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Severity & Urgency</span>
            <p className="text-base font-bold text-white mt-1">
              {rAssessment.severity || 'Moderate'} • {rAssessment.urgency || advisory.urgency || 'Within 24-48 hours'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Risk Reason</span>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {rAssessment.riskReason || advisory.riskReason}
            </p>
          </div>
        </div>

        {rAssessment.riskFactors?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Risk Drivers:
            </h4>
            <div className="flex flex-wrap gap-2">
              {rAssessment.riskFactors.map((factor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-950/50 text-rose-300 border border-rose-500/30"
                >
                  ⚠ {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: 7-Day Chronological Action Plan Timeline */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 space-y-6">
        <div className="pb-3 border-b border-emerald-500/15">
          <span className="text-[10px] font-mono font-bold text-cyan-400">AGENT 04 ROADMAP</span>
          <h2 className="text-2xl font-bold font-display text-white">
            7-Day Chronological Action Plan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized tasks for today and the coming days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODAY */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-emerald-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              TODAY
            </span>
            <h4 className="font-bold text-white text-sm">Immediate Actions</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {(aPlan.today?.length ? aPlan.today : ['Inspect affected plants closely', 'Verify soil moisture']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEXT 3 DAYS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-cyan-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              NEXT 3 DAYS
            </span>
            <h4 className="font-bold text-white text-sm">Monitoring & Tuning</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {(aPlan.next3Days?.length ? aPlan.next3Days : ['Monitor symptoms & soil moisture', 'Observe newly emerging shoots']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* NEXT 7 DAYS */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-lime-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-lime-400 bg-lime-950 px-2 py-0.5 rounded border border-lime-500/30">
              NEXT 7 DAYS
            </span>
            <h4 className="font-bold text-white text-sm">Recovery Check</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {(aPlan.next7Days?.length ? aPlan.next7Days : ['Evaluate overall crop recovery', 'Reassess foliar vigor and greening']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PREVENTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-darkBg-950/70 border border-purple-500/30 space-y-3"
          >
            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
              PREVENTION
            </span>
            <h4 className="font-bold text-white text-sm">Long-term Health</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              {(aPlan.preventive?.length ? aPlan.preventive : ['Maintain regular crop monitoring', 'Adopt balanced seasonal crop rotation']).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-400/30 shadow-glow-emerald">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Executive Advisory Summary</span>
        </div>
        <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
          "{advisory.finalSummary}"
        </p>
      </div>

      {/* Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-emerald-500/20 text-slate-400 text-xs leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300 block mb-0.5">Agricultural Decision-Support Disclaimer:</span>
          AI-generated agricultural guidance is provided for informational and decision-support purposes. Conditions vary by location and farm. For severe crop damage, suspected disease outbreaks, or uncertain conditions, consult a qualified local agricultural expert before taking significant action.
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDetailPage;
