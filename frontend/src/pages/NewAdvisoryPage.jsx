import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  AlertCircle,
  Sparkles,
  Layers,
  Brain,
  ShieldCheck,
  CalendarCheck2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { advisoryApi } from '../services/advisoryApi';
import AIProcessingModal from '../components/AIProcessingModal';

const CROPS = [
  'Tomato',
  'Rice',
  'Wheat',
  'Cotton',
  'Maize',
  'Potato',
  'Groundnut',
  'Soybean',
  'Sugarcane',
  'Other',
];

const SOILS = [
  'Red Soil',
  'Black Soil',
  'Sandy Soil',
  'Clay Soil',
  'Loamy Soil',
  'Alluvial Soil',
  'Unknown',
];

const STAGES = [
  'Flowering',
  'Seedling',
  'Vegetative',
  'Fruiting',
  'Harvest',
  'Unknown',
];

const IRRIGATIONS = [
  'Drip',
  'Flood/Furrow',
  'Sprinkler',
  'Rainfed',
  'Other',
  'Unknown',
];

export const NewAdvisoryPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    crop: 'Tomato',
    customCrop: '',
    location: 'Telangana',
    soilType: 'Red Soil',
    growthStage: 'Flowering',
    symptoms: 'Yellow leaves and dark brown spots appearing along lower foliage.',
    irrigation: 'Drip',
    weather: 'Hot and dry, 34°C',
    additionalInformation: 'Drip irrigation paused for 2 days during maintenance.',
  });

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreFillExample = () => {
    setFormData({
      crop: 'Tomato',
      customCrop: '',
      location: 'Telangana',
      soilType: 'Red Soil',
      growthStage: 'Flowering',
      symptoms: 'Yellow leaves and spots on lower foliage. Mild blossom drop.',
      irrigation: 'Drip',
      weather: 'Hot and dry, 34°C',
      additionalInformation: 'Observed yellowing spreading upward over the last 48 hours.',
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
      setError('Please describe symptoms in at least 5 characters.');
      return;
    }

    setIsProcessing(true);
    setActiveStep(0);

    // Cinematic sequential multi-agent execution step simulation
    const timer1 = setTimeout(() => setActiveStep(1), 1100);
    const timer2 = setTimeout(() => setActiveStep(2), 2200);
    const timer3 = setTimeout(() => setActiveStep(3), 3300);

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

      // Complete all steps
      setActiveStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#06b6d4', '#a3e635'],
      });

      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/advisory/${res.data.advisory._id}`);
      }, 1000);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to orchestrate advisory pipeline. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cinematic AI Processing Experience Modal */}
      <AIProcessingModal isOpen={isProcessing} activeStep={activeStep} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Agent Diagnostic Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Start New Crop Advisory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter field observations to trigger autonomous collaborative reasoning across 4 AI agents.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreFillExample}
          className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold bg-darkBg-900 hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 transition-all shadow-glass"
        >
          Pre-fill Example (Tomato / Telangana)
        </button>
      </div>

      {/* Futuristic Form Card */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-glow-emerald">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Crop + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Crop <span className="text-emerald-400">*</span>
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {CROPS.map((c) => (
                  <option key={c} value={c} className="bg-darkBg-900 text-white">
                    {c}
                  </option>
                ))}
              </select>

              {formData.crop === 'Other' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="customCrop"
                    placeholder="Enter custom crop..."
                    value={formData.customCrop}
                    onChange={handleChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-2.5 rounded-2xl border border-emerald-500/20 bg-darkBg-950 text-white text-sm outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Location <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Telangana"
                value={formData.location}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Soil Type, Growth Stage, Irrigation Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Soil Type <span className="text-emerald-400">*</span>
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {SOILS.map((s) => (
                  <option key={s} value={s} className="bg-darkBg-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Growth Stage <span className="text-emerald-400">*</span>
              </label>
              <select
                name="growthStage"
                value={formData.growthStage}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {STAGES.map((st) => (
                  <option key={st} value={st} className="bg-darkBg-900 text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Irrigation Method <span className="text-emerald-400">*</span>
              </label>
              <select
                name="irrigation"
                value={formData.irrigation}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white font-medium text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              >
                {IRRIGATIONS.map((irr) => (
                  <option key={irr} value={irr} className="bg-darkBg-900 text-white">
                    {irr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Symptoms */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Symptoms <span className="text-emerald-400">*</span>
              </label>
              <span className="text-xs text-slate-400">Be descriptive</span>
            </div>
            <textarea
              name="symptoms"
              required
              rows={4}
              placeholder="Describe color changes, leaf spots, wilting, curling, affected plant portions, or spreading velocity..."
              value={formData.symptoms}
              onChange={handleChange}
              disabled={isProcessing}
              className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-y"
            />
          </div>

          {/* Row 4: Weather & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Weather Conditions <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="weather"
                placeholder="e.g. Hot and dry"
                value={formData.weather}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Additional Information <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="additionalInformation"
                placeholder="e.g. Yellowing started 3 days ago"
                value={formData.additionalInformation}
                onChange={handleChange}
                disabled={isProcessing}
                className="w-full px-4 py-3 rounded-2xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-sm outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Orchestrates: Problem Analyzer → Reasoning → Risk → Action Planner</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-black font-extrabold text-sm sm:text-base shadow-glow-green transition-all hover:scale-105 disabled:opacity-50"
            >
              <span>Run AI Analysis →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAdvisoryPage;
