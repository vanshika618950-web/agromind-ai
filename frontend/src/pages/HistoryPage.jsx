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
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();
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

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All Categories');
    setSelectedRisk('All Risks');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {t('history.title', 'Advisory History & Telemetry Archive')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('history.subtitle', 'Review past multi-agent diagnoses, actions, and yield recovery trajectories.')}
          </p>
        </div>

        <Link
          to="/advisory/new"
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-green transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('common.newAdvisory', 'New Advisory')}</span>
        </Link>
      </div>

      {/* Filters & Search Row */}
      <div className="hologram-card rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-glass flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('history.searchPlaceholder', 'Search crop, symptoms, or location...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500/20 bg-darkBg-950/80 text-white text-xs sm:text-sm outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
          />
        </form>

        {/* Category Filter */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-darkBg-950 text-white text-xs sm:text-sm outline-none focus:border-emerald-400 font-medium"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-darkBg-900 text-white">
                {c === 'All Categories' ? t('history.allCategories', 'All Categories') : c}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-darkBg-950 text-white text-xs sm:text-sm outline-none focus:border-emerald-400 font-medium"
          >
            {RISK_LEVELS.map((r) => (
              <option key={r} value={r} className="bg-darkBg-900 text-white">
                {r === 'All Risks'
                  ? t('history.allRisks', 'All Risks')
                  : t(`risk.${r.toLowerCase()}`, `${r} Risk`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisories Grid or Empty State */}
      {loading ? (
        <LoadingState message={t('common.loading', 'Loading archived crop records from MongoDB Atlas...')} />
      ) : advisories.length === 0 ? (
        <EmptyState
          title={t('history.noAdvisories', 'No Advisories Match Your Filter')}
          description={t('history.noAdvisoriesDesc', 'Try clearing search filters or generate a new crop inquiry.')}
          actionText={t('history.clearFilters', 'Clear Filters')}
          actionTo="#"
          onActionClick={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advisories.map((adv) => (
            <div
              key={adv._id}
              className="hologram-card rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-400/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    {adv.category}
                  </span>
                  <RiskBadge level={adv.riskLevel} size="sm" />
                </div>

                {/* Crop & Location */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                  {adv.crop}
                </h3>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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

                {/* Soil & Stage info */}
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <span className="bg-darkBg-950 px-2 py-0.5 rounded border border-slate-800">
                    {t(`soils.${adv.soilType}`, adv.soilType)}
                  </span>
                  <span className="bg-darkBg-950 px-2 py-0.5 rounded border border-slate-800">
                    {t(`stages.${adv.growthStage}`, adv.growthStage)}
                  </span>
                </div>

                {/* Symptoms Snippet */}
                <p className="mt-3 text-xs text-slate-300 line-clamp-2 italic leading-relaxed">
                  "{adv.symptoms}"
                </p>

                {/* Problem Summary */}
                <div className="mt-3.5 p-3 rounded-xl bg-darkBg-950/80 border border-emerald-500/20 text-xs text-slate-300">
                  <span className="font-semibold text-white">{t('advisory.problemAnalysisTitle', 'Diagnosis')}: </span>
                  {adv.problemAnalysis?.identifiedProblem || adv.category}
                </div>
              </div>

              {/* View Advisory Link */}
              <div className="mt-6 pt-4 border-t border-emerald-500/15">
                <Link
                  to={`/advisory/${adv._id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-darkBg-950 hover:bg-emerald-500 hover:text-black text-slate-200 border border-emerald-500/30 transition-all"
                >
                  <span>{t('history.reviewAdvisory', 'Review Multi-Agent Advisory')}</span>
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
