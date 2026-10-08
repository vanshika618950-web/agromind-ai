import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'te', label: 'తెలుగు', name: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'en', label: 'English', name: 'English' },
];

export const LanguageSelector = ({ variant = 'default', className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-darkBg-950/80 border border-emerald-500/25 backdrop-blur-md shadow-glass text-xs font-semibold ${className}`}
      role="group"
      aria-label="Select Language"
    >
      <div className="pl-2 pr-1 hidden sm:flex items-center text-emerald-400">
        <Languages className="w-3.5 h-3.5" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-1">
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              aria-pressed={isActive}
              aria-label={`Switch to ${lang.name}`}
              className={`min-h-[36px] px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 text-xs font-bold whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-glow-green scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              {lang.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSelector;
