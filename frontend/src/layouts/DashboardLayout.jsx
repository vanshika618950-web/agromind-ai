import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Bell, PlusCircle, Settings, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Akshaya';

  return (
    <div className="min-h-screen bg-darkBg-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="h-16 sm:h-20 bg-darkBg-900/80 backdrop-blur-xl border-b border-emerald-500/15 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-display">
                {t('dashboard.greeting', 'Good Morning')}, {firstName} 👋
              </h2>
              <p className="text-[11px] text-emerald-400/90 font-medium">
                {t('dashboard.subtitle', 'Your AI farming assistant is ready.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector />

            <Link
              to="/advisory/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-glow-green transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('common.newAdvisory', 'New Advisory')}</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden md:block" />

            {/* Notification & Settings Icon Buttons */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                title="Notifications"
                className="p-2 rounded-xl hover:text-white hover:bg-slate-800/60 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-2 right-2 animate-ping" />
              </button>
              <Link
                to="/profile"
                title="Settings"
                className="p-2 rounded-xl hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40 shadow-glow-green">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
