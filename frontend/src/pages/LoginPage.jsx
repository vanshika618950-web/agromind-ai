import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('farmer@agromind.ai');
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="min-h-screen bg-darkBg-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-lime-400 flex items-center justify-center text-darkBg-950 shadow-glow-green group-hover:scale-105 transition-transform">
            <Sprout className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="font-display font-extrabold text-2xl text-white">
            AgroMind<span className="text-emerald-400">.AI</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold text-white">
          Sign In to Your Farm Dashboard
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Or{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="hologram-card py-8 px-6 sm:px-10 rounded-3xl border border-emerald-500/25 shadow-glow-emerald">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500/20 bg-darkBg-950/80 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500/20 bg-darkBg-950/80 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-400 hover:from-emerald-400 hover:to-lime-300 text-black font-extrabold text-sm shadow-glow-green transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="mt-6 pt-6 border-t border-emerald-500/15 text-center">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fill Demo Credentials (Ramesh Patel)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
