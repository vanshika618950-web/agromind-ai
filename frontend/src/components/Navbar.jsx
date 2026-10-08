import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, ArrowRight, LogOut, LayoutDashboard, PlusCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-darkBg-950/70 backdrop-blur-xl border-b border-emerald-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Top-left: 🌱 AgroMind AI Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-black shadow-glow-green group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-darkBg-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                AgroMind<span className="text-emerald-400 font-black">.AI</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-emerald-400/80 font-bold -mt-1">
                {t('common.badge', 'AGENTIC AI ADVISORY')}
              </span>
            </div>
          </Link>

          {/* Top Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {t('common.home', 'Home')}
            </Link>
            <a
              href="#how-it-thinks"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {t('common.howItWorks', 'How It Works')}
            </a>
            <a
              href="#agents"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {t('common.aiAgents', 'AI Agents')}
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {t('common.features', 'Features')}
            </a>

            {/* Language Selector */}
            <LanguageSelector />

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-950/40 transition-all border border-transparent hover:border-emerald-500/20"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  {t('common.dashboard', 'Dashboard')}
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-emerald-950/40 transition-all border border-transparent hover:border-emerald-500/20"
                >
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  {t('common.analytics', 'Analytics')}
                </Link>
                <Link
                  to="/advisory/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-green transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('common.newAdvisory', 'New Advisory')}
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  {t('common.login', 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-green hover:scale-105 transition-all"
                >
                  <span>{t('common.register', 'Get Started')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu and Language Selector */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-emerald-500/20 bg-darkBg-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            {t('common.home', 'Home')}
          </Link>
          <a
            href="#how-it-thinks"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            {t('common.howItWorks', 'How It Works')}
          </a>
          <a
            href="#agents"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            {t('common.aiAgents', 'AI Agents')}
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            {t('common.features', 'Features')}
          </a>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                {t('common.dashboard', 'Dashboard')}
              </Link>
              <Link
                to="/advisory/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-400"
              >
                <PlusCircle className="w-4 h-4" />
                {t('common.newAdvisory', 'New Advisory')}
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cyan-400"
              >
                <BarChart3 className="w-4 h-4" />
                {t('common.analytics', 'Analytics')}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-medium text-rose-400"
              >
                <LogOut className="w-4 h-4" />
                {t('common.logout', 'Sign Out')}
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl border border-slate-700 font-semibold text-slate-200 text-sm"
              >
                {t('common.login', 'Login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-glow-green"
              >
                {t('common.register', 'Get Started')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
