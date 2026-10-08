import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ArrowLeft,
  MapPin,
  Calendar,
  Layers,
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
  Share2,
} from 'lucide-react';
import { advisoryApi } from '../services/advisoryApi';
import RiskBadge from '../components/RiskBadge';
import RecommendationCard from '../components/RecommendationCard';
import ActionPlanView from '../components/ActionPlanView';
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
    if (!window.confirm('Are you sure you want to delete this crop advisory and its agent logs?')) {
      return;
    }

    setDeleting(true);
    try {
      await advisoryApi.deleteAdvisory(id);
      navigate('/history');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete advisory');
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState message="Retrieving advisory intelligence and agent logs..." />;
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-lg mx-auto shadow-sm">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Advisory Not Found</h3>
        <p className="text-sm text-slate-600 mt-1">{error || 'Could not load advisory details'}</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
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

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Navigation Bar with Back & Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Advisory Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-elevated relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-agro-700 bg-agro-50 px-2.5 py-1 rounded-md border border-agro-200">
                {advisory.category}
              </span>
              <RiskBadge level={advisory.riskLevel} size="md" />
              <span className="text-xs text-slate-400 font-medium">
                Advisory #{advisory._id.slice(-6).toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              {advisory.crop} Crop Advisory
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {advisory.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(advisory.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Quick Crop Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Matrix</span>
              <span className="text-xs font-bold text-slate-800">{advisory.soilType}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Growth Stage</span>
              <span className="text-xs font-bold text-slate-800">{advisory.growthStage}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Irrigation</span>
              <span className="text-xs font-bold text-slate-800">{advisory.irrigation}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Confidence</span>
              <span className="text-xs font-bold text-agro-700">
                {Math.round((pAnalysis.confidence || 0.82) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms Context Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Submitted Field Symptoms & Notes:
          </span>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            "{advisory.symptoms}"
          </p>
          {(advisory.weather || advisory.additionalInformation) && (
            <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              {advisory.weather && <span><strong>Weather Context:</strong> {advisory.weather}</span>}
              {advisory.additionalInformation && <span><strong>Notes:</strong> {advisory.additionalInformation}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Autonomous Multi-Agent Pipeline Timeline Component */}
      <AgentWorkflowTimeline agentLogs={agentLogs} isLiveSimulation={false} />

      {/* Section 1: Problem Analysis (Agent 1 Output) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700">AGENT 01 OUTPUT</span>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Problem Analysis & Diagnosis
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Confidence: {Math.round((pAnalysis.confidence || 0.8) * 100)}%
          </span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-slate-800">
          <span className="text-xs font-bold uppercase text-emerald-900 block mb-1">
            Core Identified Issue:
          </span>
          <p className="text-base font-semibold text-slate-900">
            {pAnalysis.identifiedProblem || advisory.category}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Probable Root Causes:
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {(pAnalysis.possibleCauses || []).map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Diagnostic Symptoms:
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {(pAnalysis.keySymptoms || []).map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-agro-600 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {pAnalysis.missingInformation?.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold">Missing Information for Absolute Certainty: </span>
              {pAnalysis.missingInformation.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: AI Recommendations & Soil/Irrigation Guidance (Agent 2 Output) */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-700">AGENT 02 OUTPUT</span>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Crop Reasoning & Recommendations
              </h2>
            </div>
          </div>

          {cReasoning.analysis && (
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Agronomic Physiology Analysis:</span>
              {cReasoning.analysis}
            </p>
          )}

          {/* Numbered Recommendation Cards */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Prioritized Corrective Recommendations:
            </h3>
            {(cReasoning.recommendations || advisory.recommendations || []).map(
              (rec, index) => (
                <RecommendationCard
                  key={index}
                  index={index}
                  recommendation={rec}
                />
              )
            )}
          </div>
        </div>

        {/* Dual Guidance: Irrigation & Nutrient Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Irrigation Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Irrigation Guidance
                </h3>
                <span className="text-xs text-slate-400">
                  Calibrated for {advisory.soilType}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {cReasoning.irrigationAdvice || advisory.irrigationAdvice || 'Maintain consistent soil moisture matching crop stage.'}
            </p>
          </div>

          {/* Nutrient Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Nutrient & Fertilizer Guidance
                </h3>
                <span className="text-xs text-slate-400">
                  Tailored for {advisory.growthStage} stage
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {cReasoning.nutrientAdvice || advisory.nutrientAdvice || 'Ensure balanced macro and micro-nutrients before applying top-dressing.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Risk Assessment (Agent 3 Output) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-700">AGENT 03 OUTPUT</span>
              <h2 className="text-xl font-bold font-display text-slate-900">
                Risk & Severity Assessment
              </h2>
            </div>
          </div>
          <RiskBadge level={rAssessment.riskLevel || advisory.riskLevel} size="md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Severity & Urgency Window</span>
            <p className="text-base font-bold text-slate-900 mt-1">
              {rAssessment.severity || 'Moderate'} • {rAssessment.urgency || advisory.urgency || 'Within 24-48 hours'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Yield Impact Assessment</span>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {rAssessment.riskReason || advisory.riskReason}
            </p>
          </div>
        </div>

        {rAssessment.riskFactors?.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Specific Risk Drivers:
            </h4>
            <div className="flex flex-wrap gap-2">
              {rAssessment.riskFactors.map((factor, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                >
                  ⚠ {factor}
                </span>
              ))}
            </div>
          </div>
        )}

        {rAssessment.expertConsultationRecommended && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">
                Local Agricultural Expert Consultation Recommended
              </h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                Due to elevated risk and potential yield penalty, consider notifying your local Krishi Vigyan Kendra (KVK) or extension officer for an in-person field visit.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Action Planner (Agent 4 Output) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-700">AGENT 04 OUTPUT</span>
            <h2 className="text-xl font-bold font-display text-slate-900">
              7-Day Chronological Farm Action Roadmap
            </h2>
          </div>
        </div>

        <ActionPlanView actionPlan={aPlan} />
      </div>

      {/* Executive Summary Card */}
      <div className="rounded-2xl bg-gradient-to-r from-agro-900 to-slate-900 text-white p-6 sm:p-8 shadow-elevated">
        <div className="flex items-center gap-2 text-agro-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-agro-400" />
          <span>Executive Advisory Summary</span>
        </div>
        <p className="text-base sm:text-lg text-agro-50 leading-relaxed font-medium">
          "{advisory.finalSummary}"
        </p>
      </div>

      {/* Mandatory Safety Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Agricultural Decision-Support Disclaimer:</span>
          AI-generated agricultural guidance is provided for informational and decision-support purposes. Conditions vary by location and farm. For severe crop damage, suspected disease outbreaks, or uncertain conditions, consult a qualified local agricultural expert before taking significant chemical or pesticide actions.
        </div>
      </div>
    </div>
  );
};

export default AdvisoryDetailPage;
