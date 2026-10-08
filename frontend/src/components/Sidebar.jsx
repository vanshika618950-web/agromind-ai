import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  LogOut,
  Sprout,
  ShieldCheck,
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
      label: 'New AI Advisory',
      icon: PlusCircle,
      highlight: true,
    },
    {
      to: '/history',
      label: 'Advisory History',
      icon: History,
    },
    {
      to: '/profile',
      label: 'Farmer Profile',
      icon: User,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 sm:h-20 flex items-center px-6 border-b border-slate-100">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-agro-700 to-agro-500 flex items-center justify-center text-white shadow-sm">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-lg text-slate-900">
                  AgroMind<span className="text-agro-600">.AI</span>
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5">
                  Multi-Agent Core
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
                        ? 'bg-agro-50 text-agro-800 border border-agro-200/80 shadow-xs'
                        : item.highlight
                        ? 'text-agro-700 bg-agro-50/50 hover:bg-agro-50 hover:text-agro-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-agro-200 text-agro-800">
                      AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mini Agent Status Badge inside Sidebar */}
          <div className="px-4 mt-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-agro-400" />
                <span className="text-xs font-bold text-agro-300">Agent Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                4 Specialized agents active and ready to reason.
              </p>
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-agro-100 text-agro-800 font-bold text-sm flex items-center justify-center shrink-0 border border-agro-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Farmer Account'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || 'farmer@agromind.ai'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
