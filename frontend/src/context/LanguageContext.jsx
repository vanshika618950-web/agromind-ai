import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en.json';
import te from '../locales/te.json';
import hi from '../locales/hi.json';

const LOCALES = { en, te, hi };
const STORAGE_KEY = 'agromind-language';
const SUPPORTED_LANGUAGES = ['en', 'te', 'hi'];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback if localStorage is inaccessible
    }
    return 'en';
  });

  const setLanguage = useCallback((newLang) => {
    if (!SUPPORTED_LANGUAGES.includes(newLang)) return;
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language in localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Nested property lookup helper
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  };

  // Translation function with English fallback
  const t = useCallback(
    (key, fallback = null) => {
      if (!key) return '';

      // 1. Try active language
      const activeDict = LOCALES[language] || LOCALES.en;
      const val = getNestedValue(activeDict, key);
      if (val !== null && val !== undefined) return val;

      // 2. Fall back to English
      const enVal = getNestedValue(LOCALES.en, key);
      if (enVal !== null && enVal !== undefined) return enVal;

      // 3. Fall back to provided fallback or formatted key name
      if (fallback !== null && fallback !== undefined) return fallback;

      // Never show broken dots if key not found; return the last segment
      const parts = key.split('.');
      return parts[parts.length - 1];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
