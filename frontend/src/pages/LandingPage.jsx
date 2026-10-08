import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Brain,
  ShieldAlert,
  CalendarCheck2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Droplet,
  Layers,
  BarChart3,
  Globe,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';

export const LandingPage = () => {
  const agents = [
    {
      number: '01',
      name: 'Problem Analyzer Agent',
      desc: 'Decodes farmer symptoms, cross-checks soil and crop growth stage, extracts root anomalies, and identifies probable causes with confidence metrics.',
      icon: Brain,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      number: '02',
      name: 'Crop Reasoning Agent',
      desc: 'Correlates specific crop physiological requirements, soil nutrient bioavailability, and irrigation practices to formulate targeted agricultural recommendations.',
      icon: Sprout,
      color: 'bg-teal-500/10 text-teal-600 border-teal-200',
    },
    {
      number: '03',
      name: 'Risk Assessment Agent',
      desc: 'Determines real-time severity (Low to Critical) and urgency window to avert irreversible yield loss, flagging when local extension officers must intervene.',
      icon: ShieldAlert,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
    {
      number: '04',
      name: 'Action Planner Agent',
      desc: 'Synthesizes all multi-agent insights into a prioritized chronological farm management plan: Immediate, Today, Next 3 Days, Next 7 Days, and Preventive.',
      icon: CalendarCheck2,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    },
  ];

  const features = [
    {
      title: 'Multi-Agent Autonomous Orchestration',
      desc: 'Not a simplistic single-turn chatbot. Four specialized agents coordinate in an auditable pipeline, passing structured intelligence sequentially.',
      icon: Layers,
    },
    {
      title: 'Precision Soil & Crop Physiology',
      desc: 'Tailored specifically to Rice, Wheat, Cotton, Maize, Tomato, Potato, Groundnut, Soybean, Sugarcane, and custom crops across diverse soil matrices.',
      icon: Sprout,
    },
    {
      title: 'Real-Time Risk & Urgency Scoring',
      desc: 'Categorizes agricultural hazards from Low to Critical so farmers prioritize interventions before economic injury thresholds are breached.',
      icon: BarChart3,
    },
    {
      title: '7-Day Chronological Action Roadmap',
      desc: 'Converts abstract agricultural guidance into concrete daily tasks: today, 3-day window, 7-day follow-up, and sustainable seasonal prevention.',
      icon: CalendarCheck2,
    },
    {
      title: 'Irrigation & Nutrient Guidance',
      desc: 'Calibrates watering volumes and nutrient splits to prevent waterlogging hypoxia or nutrient lockout in high-retention or sandy soils.',
      icon: Droplet,
    },
    {
      title: 'Complete Audit Trail & History',
      desc: 'Every agent step, execution time in milliseconds, input, and output is persistently recorded in MongoDB for transparent accountability.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-agro-400/20 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agro-50 border border-agro-200 text-agro-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-agro-600" />
            <span>Autonomous Agricultural AI Agent Architecture</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Intelligent Crop Decisions.{' '}
            <span className="bg-gradient-to-r from-agro-700 via-agro-600 to-teal-600 bg-clip-text text-transparent">
              Powered by AI Agents.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            AgroMind AI autonomously coordinates four specialized AI agents to analyze crop symptoms, evaluate risk severity, and build actionable 7-day farm recovery plans.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-base shadow-elevated hover:shadow-glow transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-300 shadow-soft transition-all"
            >
              <span>Sign In to Dashboard</span>
            </Link>
          </div>

          {/* Interactive Agent Flow Banner */}
          <div className="mt-14 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-elevated">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Autonomous Collaboration Pipeline
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-agro-600">AGENT 01</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Problem Analyzer</p>
                <p className="text-[11px] text-slate-500">Extracts root causes</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-teal-600">AGENT 02</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Crop Reasoning</p>
                <p className="text-[11px] text-slate-500">Soil & stage dynamics</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-amber-600">AGENT 03</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Risk Assessment</p>
                <p className="text-[11px] text-slate-500">Evaluates yield impact</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono font-bold text-indigo-600">AGENT 04</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Action Planner</p>
                <p className="text-[11px] text-slate-500">7-day farm roadmap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-agro-600 bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
              Specialized Agent Collective
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-3">
              Four Autonomous AI Agents Working For Your Farm
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Unlike monolithic AI models, AgroMind AI breaks agricultural decision making into distinct specialized roles that validate and build on each other's reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.number}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 hover:bg-white hover:shadow-elevated hover:border-agro-300 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${agent.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-400 group-hover:text-agro-600 transition-colors">
                        {agent.number}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-agro-800 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {agent.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-agro-700">
                    <span>Autonomous pipeline stage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (Workflow) */}
      <section id="workflow" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-agro-600 bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
              Agentic Orchestration Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-3">
              How AgroMind AI Produces Trusted Advisories
            </h2>
            <p className="mt-3 text-base text-slate-600">
              A transparent, deterministic execution pipeline from symptom observation to field action.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 font-bold flex items-center justify-center mb-5">
                1
              </div>
              <h3 className="font-bold text-xl text-slate-900">1. Input Farming Reality</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Provide your crop type, location, soil profile, growth phase, symptoms, and irrigation method through our validated multi-field form.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 font-bold flex items-center justify-center mb-5">
                2
              </div>
              <h3 className="font-bold text-xl text-slate-900">2. Multi-Agent Reasoning</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                The central Orchestrator triggers the 4 specialized agents in sequence, validating structured JSON responses and logging execution times.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-soft relative">
              <div className="w-10 h-10 rounded-xl bg-agro-100 text-agro-700 font-bold flex items-center justify-center mb-5">
                3
              </div>
              <h3 className="font-bold text-xl text-slate-900">3. Execute 7-Day Plan</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Receive prioritized recommendations, customized irrigation/nutrient guidance, risk badges, and a chronological farm action plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-agro-600 bg-agro-50 px-3 py-1 rounded-full border border-agro-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-3">
              Engineered for Modern Agriculture
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Everything you need to prevent yield loss, reduce chemical waste, and make proactive decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-agro-400 hover:shadow-soft transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-agro-50 text-agro-700 border border-agro-200 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Call to Action Banner */}
      <section className="py-16 bg-gradient-to-br from-agro-900 via-agro-800 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
            Ready to Protect Your Crops with AI Agents?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-agro-100/90 max-w-2xl mx-auto">
            Create your account today and generate actionable, risk-assessed crop advisories in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-agro-900 font-bold text-base hover:bg-agro-50 transition-all shadow-md"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Mandatory Agricultural Safety Disclaimer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sprout className="w-5 h-5 text-agro-400" />
              <span>AgroMind AI</span>
            </div>
            <p className="text-slate-400">
              © {new Date().getFullYear()} AgroMind AI — Agentic Crop Advisory & Decision Support System.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 leading-relaxed text-[11px]">
            <span className="font-bold text-agro-400 block mb-1">Safety & Decision-Support Disclaimer:</span>
            AI-generated agricultural guidance is provided for informational and decision-support purposes only. Field conditions vary significantly by geographic micro-climate and soil history. For severe crop damage, suspected disease outbreaks, or uncertain conditions, always consult a qualified local agricultural extension officer or certified agronomist before taking significant chemical action.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
