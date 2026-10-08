import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Brain,
  ShieldAlert,
  CalendarCheck2,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { advisoryApi } from '../services/advisoryApi';
import AgentWorkflowTimeline from '../components/AgentWorkflowTimeline';

const CROPS = [
  'Rice',
  'Wheat',
  'Cotton',
  'Maize',
  'Tomato',
  'Potato',
  'Groundnut',
  'Soybean',
  'Sugarcane',
  'Other',
];

const SOILS = [
  'Black Soil',
  'Red Soil',
  'Sandy Soil',
  'Clay Soil',
  'Loamy Soil',
  'Alluvial Soil',
  'Unknown',
];

const STAGES = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Harvest',
  'Unknown',
];

const IRRIGATIONS = [
  'Rainfed',
  'Drip',
  'Sprinkler',
  'Flood/Furrow',
  'Other',
  'Unknown',
];

export const NewAdvisoryPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop: 'Rice',
    customCrop: '',
    location: '',
    soilType: 'Black Soil',
    growthStage: 'Vegetative',
    symptoms: '',
    irrigation: 'Flood/Furrow',
    weather: '',
    additionalInformation: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [simulatedAgentStep, setSimulatedAgentStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreFillExample = () => {
    setFormData({
      crop: 'Cotton',
      customCrop: '',
      location: 'Telangana, Warangal',
      soilType: 'Black Soil',
      growthStage: 'Flowering',
      symptoms: 'Older leaves display yellowing along leaf margins and inward veins. Some squares and early bolls dropping after recent heavy rain.',
      irrigation: 'Drip',
      weather: 'Humid, 32°C, intermittent sunshine',
      additionalInformation: 'Drip fertigation was paused during the heavy rains 3 days ago.',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCrop =
      formData.crop === 'Other' ? formData.customCrop.trim() : formData.crop;

    if (!finalCrop) {
      setError('Please specify a crop name.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Please provide your location or district.');
      return;
    }

    if (!formData.symptoms.trim() || formData.symptoms.trim().length < 5) {
      setError('Please provide detailed symptoms (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    setSimulatedAgentStep(0);

    // Dynamic pipeline step simulation for visual feedback
    const stepInterval = setInterval(() => {
      setSimulatedAgentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const payload = {
        crop: finalCrop,
        location: formData.location.trim(),
        soilType: formData.soilType,
        growthStage: formData.growthStage,
        symptoms: formData.symptoms.trim(),
        irrigation: formData.irrigation,
        weather: formData.weather.trim(),
        additionalInformation: formData.additionalInformation.trim(),
      };

      const res = await advisoryApi.createAdvisory(payload);

      clearInterval(stepInterval);
      setSimulatedAgentStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#4ade80', '#22c55e', '#f59e0b'],
      });

      // Quick pause so user sees final completed state
      setTimeout(() => {
        navigate(`/advisory/${res.data.advisory._id}`);
      }, 700);
    } catch (err) {
      clearInterval(stepInterval);
      setSubmitting(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to orchestrate advisory pipeline. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-agro-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Agent Diagnostic Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Generate AI Crop Advisory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Provide crop observations to trigger autonomous collaborative reasoning across 4 agents.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreFillExample}
          className="self-start sm:self-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-agro-50 hover:bg-agro-100 text-agro-800 border border-agro-200 transition-colors"
        >
          Pre-fill Example Data
        </button>
      </div>

      {/* Live AI Processing Overlay if Submitting */}
      {submitting && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-agro-50 border border-agro-200 flex items-center justify-between text-agro-900">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agro-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-agro-500" />
              </span>
              <span className="font-bold text-sm">
                AI Agent Collective Actively Reasoning...
              </span>
            </div>
            <span className="text-xs font-mono text-agro-700 font-semibold">
              Step {Math.min(4, simulatedAgentStep + 1)} of 4
            </span>
          </div>

          <AgentWorkflowTimeline
            activeStep={simulatedAgentStep}
            isLiveSimulation={true}
          />
        </div>
      )}

      {/* Advisory Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-elevated">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Crop Selection + Custom Crop + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Crop <span className="text-rose-500">*</span>
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm font-medium outline-none transition-all"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {formData.crop === 'Other' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="customCrop"
                    placeholder="Enter custom crop name..."
                    value={formData.customCrop}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm outline-none transition-all"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Location / District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Telangana, Warangal"
                value={formData.location}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm font-medium outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Soil Type, Growth Stage, Irrigation Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Soil Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm font-medium outline-none transition-all"
              >
                {SOILS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Growth Stage <span className="text-rose-500">*</span>
              </label>
              <select
                name="growthStage"
                value={formData.growthStage}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm font-medium outline-none transition-all"
              >
                {STAGES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Irrigation Method <span className="text-rose-500">*</span>
              </label>
              <select
                name="irrigation"
                value={formData.irrigation}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm font-medium outline-none transition-all"
              >
                {IRRIGATIONS.map((irr) => (
                  <option key={irr} value={irr}>
                    {irr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Observed Symptoms (Large textarea) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Observed Crop Symptoms <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                Be as descriptive as possible
              </span>
            </div>
            <textarea
              name="symptoms"
              required
              rows={4}
              placeholder="Describe color changes, leaf spots, wilting, curling, pest presence, affected plant portions, or spreading patterns..."
              value={formData.symptoms}
              onChange={handleChange}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm outline-none transition-all resize-y"
            />
          </div>

          {/* Row 4: Weather & Additional Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Weather / Environmental Context <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="weather"
                placeholder="e.g. Recent unseasonal rain, dry spell, 36°C heat wave"
                value={formData.weather}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Recent Inputs / Observations <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="additionalInformation"
                placeholder="e.g. Applied urea 4 days ago, noticed spots spreading north to south"
                value={formData.additionalInformation}
                onChange={handleChange}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-agro-500/20 focus:border-agro-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Layers className="w-4 h-4 text-agro-600" />
              <span>Orchestrates: Problem Analyzer → Reasoning → Risk → Action Planner</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-elevated hover:shadow-glow transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Orchestrating AI Agents...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate AI Advisory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdvisoryPage;
