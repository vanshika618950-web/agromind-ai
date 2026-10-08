import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  Filter,
  MapPin,
  Calendar,
  ArrowRight,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { advisoryApi } from '../services/advisoryApi';
import RiskBadge from '../components/RiskBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'All Categories',
  'Crop Health',
  'Nutrient Management',
  'Irrigation',
  'Soil Management',
  'Pest/Disease Risk',
  'Weather/Environmental Stress',
  'General Crop Management',
];

const RISK_LEVELS = ['All Risks', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const HistoryPage = () => {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRisk, setSelectedRisk] = useState('All Risks');

  const fetchAdvisories = async () => {
    try {
      const params = {};
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;
      if (selectedRisk !== 'All Risks') params.riskLevel = selectedRisk;
      if (search.trim()) params.search = search.trim();

      const res = await advisoryApi.getAdvisories(params);
      if (res.success) {
        setAdvisories(res.data);
      }
    } catch (err) {
      console.error('Failed to load advisories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, [selectedCategory, selectedRisk]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdvisories();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Advisory History & Archive
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review past multi-agent diagnoses, actions, and yield recovery trajectories.
          </p>
        </div>

        <Link
          to="/advisory/new"
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-agro-600 hover:bg-agro-700 text-white shadow-soft hover:shadow-glow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Advisory</span>
        </Link>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-soft flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop, symptoms, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-agro-500 focus:ring-2 focus:ring-agro-500/20 transition-all"
          />
        </form>

        {/* Category Filter */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:border-agro-500 focus:ring-2 focus:ring-agro-500/20 font-medium"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:border-agro-500 focus:ring-2 focus:ring-agro-500/20 font-medium"
          >
            {RISK_LEVELS.map((r) => (
              <option key={r} value={r}>
                {r === 'All Risks' ? 'All Risks' : `${r} Risk`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisories Grid or Empty State */}
      {loading ? (
        <LoadingState message="Loading archived crop records..." />
      ) : advisories.length === 0 ? (
        <EmptyState
          title="No Advisories Match Your Filter"
          description="Try clearing your search filters or generate a new crop inquiry."
          actionText="Clear Filters"
          actionTo="#"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisories.map((adv) => (
            <div
              key={adv._id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-soft hover:shadow-elevated hover:border-agro-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-agro-700 bg-agro-50 px-2 py-0.5 rounded border border-agro-200">
                    {adv.category}
                  </span>
                  <RiskBadge level={adv.riskLevel} size="sm" />
                </div>

                {/* Crop & Location */}
                <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-agro-700 transition-colors">
                  {adv.crop}
                </h3>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
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

                {/* Soil & Stage info */}
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    {adv.soilType}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    {adv.growthStage}
                  </span>
                </div>

                {/* Symptoms Snippet */}
                <p className="mt-3 text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                  "{adv.symptoms}"
                </p>

                {/* Problem Summary */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Diagnosis: </span>
                  {adv.problemAnalysis?.identifiedProblem || adv.category}
                </div>
              </div>

              {/* View Advisory Link */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link
                  to={`/advisory/${adv._id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-agro-600 hover:text-white text-slate-700 transition-all"
                >
                  <span>Review Multi-Agent Advisory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
