import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

// Create Language Context
const LanguageContext = createContext();

// Supported languages
export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  hi: { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ar: { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  pt: { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' },
};

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Language Provider Component
export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('careerai_language') || 'en';
  });
  const [translations, setTranslations] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('careerai_language', currentLanguage);
  }, [currentLanguage]);

  // Translation function using Gemini API
  const translate = async (text, targetLang) => {
    if (!text || targetLang === 'en') return text;

    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      setIsTranslating(true);
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          text: text,
          target_language: targetLang,
          source_language: 'en'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data.translated_text;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }

    return text;
  };

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setTranslations({});
  };

  const value = {
    currentLanguage,
    changeLanguage,
    translate,
    isTranslating,
    languages: LANGUAGES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Hook for translating text
export function useTranslation() {
  const { currentLanguage, translate } = useLanguage();
  
  const t = async (text) => {
    if (currentLanguage === 'en') return text;
    return await translate(text, currentLanguage);
  };

  return { t, currentLanguage };
}
