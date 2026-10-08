import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  LogOut,
  Sprout,
  BarChart3,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/advisory/new',
      label: 'New Advisory',
      icon: PlusCircle,
      highlight: true,
    },
    {
      to: '/analytics',
      label: 'AI Analytics',
      icon: BarChart3,
    },
    {
      to: '/history',
      label: 'Advisory History',
      icon: History,
    },
    {
      to: '/profile',
      label: 'User Profile',
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-darkBg-950/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-darkBg-900/90 backdrop-blur-2xl border-r border-emerald-500/15 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-16 sm:h-20 flex items-center px-6 border-b border-emerald-500/15">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 flex items-center justify-center text-darkBg-950 font-black shadow-glow-green">
                <Sprout className="w-5 h-5 text-darkBg-950" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-white">
                  AgroMind<span className="text-emerald-400">.AI</span>
                </span>
                <span className="block text-[8px] uppercase tracking-widest text-emerald-400/80 font-bold -mt-0.5">
                  AGENTIC SYSTEM
                </span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-glow-green'
                        : item.highlight
                        ? 'text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-black">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Active Agent Badge Box */}
          <div className="px-4 mt-4">
            <div className="p-3.5 rounded-2xl bg-darkBg-950 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4 AI Agents Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Autonomous sequential orchestration ready for crop symptoms.
              </p>
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-emerald-500/15 bg-darkBg-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Farmer Account'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || 'farmer@agromind.ai'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
