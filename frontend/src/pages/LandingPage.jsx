import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  BarChart3,
  Droplet,
  ChevronRight,
  Globe,
  Cpu,
  CheckCircle2,
  Volume2,
  Camera,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Hero3DScene from '../components/Hero3DScene';
import HeroFloatingCards from '../components/HeroFloatingCards';
import HowAgroMindThinks from '../components/HowAgroMindThinks';
import AgenticNetworkVisualization from '../components/AgenticNetworkVisualization';
import VisualAIWorkflow from '../components/VisualAIWorkflow';
import heroEnvironmentImg from '../assets/hero_3d_environment.jpg';
import aiAssistantImg from '../assets/ai_assistant.jpg';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage = () => {
  const { t } = useLanguage();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.04;
    const y = (clientY - window.innerHeight / 2) * 0.04;
    setMouseOffset({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-darkBg-950 text-slate-100 flex flex-col relative overflow-hidden"
    >
      <Navbar />

      {/* ====================================================
          CINEMATIC 3D HERO SECTION
      ==================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 overflow-hidden">
        {/* Deep 3D Environmental Backdrop with Parallax */}
        <div
          className="absolute inset-0 z-0 opacity-30 mix-blend-screen bg-cover bg-center transition-transform duration-700 ease-out pointer-events-none"
          style={{
            backgroundImage: `url(${heroEnvironmentImg})`,
            transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px) scale(1.05)`,
          }}
        />

        {/* 3D WebGL / Canvas Holographic Particle & Geometry Engine */}
        <Hero3DScene />

        {/* Floating Holographic AI Status Cards */}
        <HeroFloatingCards mouseOffset={mouseOffset} />

        {/* Hero Center Composition */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-12">
          {/* Futuristic Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-glow-green backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{t('common.badge', 'AGENTIC AI • AGRICULTURE INTELLIGENCE')}</span>
          </motion.div>

          {/* Main Cinematic Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto"
          >
            {t('home.heroTitle1', 'Smarter Farming.')}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
              {t('home.heroTitle2', 'Powered by Autonomous AI.')}
            </span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            {t('home.heroSubtitle', 'AgroMind AI analyzes crop conditions, evaluates risks, and creates actionable farming recommendations using a team of intelligent AI agents.')}
          </motion.p>

          {/* Prominent Farmer Voice & Photo Help Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-2xl mx-auto p-4 rounded-2xl bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-sm sm:text-base font-medium flex items-center justify-center gap-3 shadow-glow-emerald backdrop-blur-md"
          >
            <Camera className="w-5 h-5 text-lime-400 shrink-0" />
            <span>{t('home.farmerHelpMessage', "Don't know what's wrong with your crop? Just show us a photo, speak in your language, and AgroMind AI will help.")}</span>
            <Volume2 className="w-5 h-5 text-cyan-400 shrink-0" />
          </motion.div>

          {/* Floating Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/advisory/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm sm:text-base shadow-glow-emerald hover:shadow-glow-green transition-all hover:scale-105"
            >
              <span>{t('home.ctaStart', 'Start Free Advisory →')}</span>
            </Link>

            <a
              href="#how-it-thinks"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-darkBg-900/80 hover:bg-darkBg-850 text-slate-200 font-bold text-sm sm:text-base border border-emerald-500/30 hover:border-emerald-400/50 shadow-glass transition-all backdrop-blur-md"
            >
              <span>{t('home.ctaExplore', 'Explore How It Works')}</span>
            </a>
          </motion.div>

          {/* 3D Character Assistant Supporting Badge / Teaser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-14 max-w-xl mx-auto p-3.5 rounded-3xl hologram-card border border-emerald-500/25 flex items-center gap-4 shadow-glass text-left"
          >
            <div className="relative shrink-0">
              <img
                src={aiAssistantImg}
                alt="Agricultural AI Assistant"
                className="w-14 h-14 rounded-2xl object-cover border border-emerald-400/40 shadow-glow-emerald"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-darkBg-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {t('dashboard.aiAssistantTitle', '3D AI Agricultural Assistant')}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {t('common.active', 'ONLINE')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t('home.farmerHelpMessage', 'Multi-agent collective synthesizing crop physiology, soil dynamics, and 7-day action roadmaps.')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SECTION 1: HOW AGROMIND THINKS (4 3D CARDS)
      ==================================================== */}
      <HowAgroMindThinks />

      {/* ====================================================
          SECTION 2: INTERACTIVE AGENTIC AI VISUALIZATION
      ==================================================== */}
      <section id="agents" className="relative py-12 bg-darkBg-900/40 border-y border-emerald-500/15">
        <AgenticNetworkVisualization />
      </section>

      {/* ====================================================
          SECTION 3: VISUAL WORKFLOW (INPUT → AGENTS → RISK → PLAN)
      ==================================================== */}
      <section id="workflow">
        <VisualAIWorkflow />
      </section>

      {/* ====================================================
          SECTION 4: ENTERPRISE CAPABILITIES & BENCHMARKS
      ==================================================== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t('common.badge', 'Enterprise Agronomic Standards')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Designed for High-Impact Agriculture
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Engineered to safeguard farm yields, optimize input efficiency, and eliminate diagnostic delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="hologram-card rounded-3xl p-7 border border-emerald-500/25">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Dynamic Crop Matrix
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Precision physiological context for Rice, Wheat, Cotton, Maize, Tomato, Potato, Groundnut, Soybean, Sugarcane, and custom crops across diverse soil matrices.
            </p>
          </div>

          <div className="hologram-card rounded-3xl p-7 border border-emerald-500/25">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Cryptographic Data Isolation
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Every crop advisory and agent execution log is isolated in MongoDB Atlas with signed JWT credentials and bcrypt password protection.
            </p>
          </div>

          <div className="hologram-card rounded-3xl p-7 border border-emerald-500/25">
            <div className="w-12 h-12 rounded-2xl bg-lime-500/20 text-lime-400 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Deterministic 7-Day Actions
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Converts abstract diagnostic predictions into immediate physical actions: today, next 3 days, 7-day follow-up, and preventive crop rotation defense.
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================
          CALL TO ACTION BANNER
      ==================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-tr from-darkBg-900 via-emerald-950 to-darkBg-900 p-8 sm:p-14 border border-emerald-400/30 shadow-glow-emerald text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Ready to Protect Your Crops with AI Agents?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Experience the future of agricultural decision support. Launch an autonomous multi-agent analysis in under 30 seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base shadow-glow-emerald transition-all hover:scale-105"
            >
              <span>{t('common.register', 'Get Started')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          FOOTER WITH MANDATORY SAFETY DISCLAIMER
      ==================================================== */}
      <footer className="bg-darkBg-950 py-12 border-t border-emerald-500/15 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span>AgroMind AI</span>
            </div>
            <p className="text-slate-500">
              © {new Date().getFullYear()} AgroMind AI — Agentic Crop Advisory & Decision Support System.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-darkBg-900/60 border border-slate-800 text-slate-400 leading-relaxed text-[11px]">
            <span className="font-bold text-emerald-400 block mb-1">
              {t('advisory.disclaimerTitle', 'Safety & Decision-Support Disclaimer')}:
            </span>
            {t('advisory.disclaimerText', 'AI-generated agricultural guidance is provided for informational and decision-support purposes only. Conditions vary by location and farm. For severe crop damage, suspected disease outbreaks, or uncertain conditions, consult a qualified local agricultural expert before taking significant action.')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
