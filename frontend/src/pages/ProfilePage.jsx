import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Calendar, LogOut, Lock, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-emerald-500/15">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          User & Farm Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account credentials, authorization status, and cryptographic session isolation.
        </p>
      </div>

      {/* Profile Card */}
      <div className="hologram-card rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-glow-emerald space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-2xl flex items-center justify-center border-2 border-emerald-400/40 shadow-glow-green">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Farmer Account'}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Role: {user?.role || 'Farmer'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-500/15">
          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800 flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">Email Address</span>
              <span className="text-sm font-semibold text-white">{user?.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-darkBg-950/80 border border-slate-800 flex items-start gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block">Member Since</span>
              <span className="text-sm font-semibold text-white">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Active Season'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Data Isolation Notice */}
        <div className="p-5 rounded-2xl bg-darkBg-950/90 border border-emerald-500/25 text-white space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Cryptographic Data Isolation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All crop inquiries and AI agent execution logs are bound directly to your user ID via signed JSON Web Tokens (JWT). Your farm records are fully isolated in MongoDB Atlas and never accessible to other accounts.
          </p>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-emerald-500/15 flex justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 font-semibold text-sm border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
