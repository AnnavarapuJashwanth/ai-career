import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Close, AutoAwesome, Translate, Check } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Language options - Including all major Indian state languages
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('careerai_language') || 'en';
  });
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('careerai_language', langCode);
    setLanguageMenuOpen(false);
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  const user = (() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          
          if (currentTime >= expirationTime) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('careerai_user');
            return null;
          }
        }
      }
      
      return JSON.parse(localStorage.getItem('careerai_user')) || null;
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('careerai_user');
      return null;
    }
  })();
  const isLoggedIn = !!localStorage.getItem('authToken') && !!user;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100] border-b border-gray-100 relative">
      {isLanding && (
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50 pointer-events-none" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 z-10">
        <div className="flex items-center justify-between">
          {/* Logo with Icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <AutoAwesome className="text-white text-lg" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              CareerAI
            </h1>
          </div>

          {/* Right side - Language selector and user name */}
          <div className="hidden lg:flex items-center gap-4 relative z-50">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Language button clicked, current state:', languageMenuOpen);
                  setLanguageMenuOpen(!languageMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-200 cursor-pointer relative z-50"
                aria-label="Select language"
                type="button"
              >
                <Translate className="text-blue-600" fontSize="small" />
                <span className="text-xl">{currentLangObj.flag}</span>
                <span className="text-sm font-medium text-gray-700">{currentLangObj.code.toUpperCase()}</span>
                <span className="text-xs text-blue-600">▼</span>
              </button>

              {/* Language Dropdown - Simplified */}
              {languageMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-[90]" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguageMenuOpen(false);
                    }}
                  />
                  
                  {/* Dropdown Menu */}
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-blue-500 z-[100] max-h-[500px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-500">
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                        <Translate fontSize="small" />
                        Select Your Language
                      </div>
                    </div>
                    
                    <div className="p-2 max-h-96 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLanguageChange(lang.code);
                          }}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mb-1
                            ${currentLanguage === lang.code 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
                              : 'hover:bg-blue-50 text-gray-700 hover:scale-102'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium text-sm">{lang.name}</span>
                          </div>
                          {currentLanguage === lang.code && (
                            <Check className="text-white" fontSize="small" />
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="border-t-2 border-blue-500 p-3 bg-gradient-to-r from-blue-50 to-purple-50">
                      <p className="text-xs text-gray-700 text-center font-semibold">
                        🚀 Powered by Gemini AI
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isLoggedIn && user?.name && (
              <span className="text-sm text-gray-700 font-medium">
                Hi, <span className="font-semibold text-blue-600">{user.name}</span>
              </span>
            )}
            {!isLoggedIn && (
              <a href="/login" className="btn-gradient px-5 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition text-sm">
                Login
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Close className="text-gray-700" /> : <Menu className="text-gray-700" />}
          </button>
        </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
              {/* Mobile Language Selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm
                        ${currentLanguage === lang.code 
                          ? 'bg-blue-50 border-2 border-blue-500 text-blue-700' 
                          : 'bg-gray-50 border border-gray-200 text-gray-700'
                        }
                      `}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {isLoggedIn && user?.name && (
                <div className="py-2 text-sm text-gray-700">
                  Hi, <span className="font-semibold text-blue-600">{user.name}</span>
                </div>
              )}
              {!isLoggedIn && (
                <a href="/login" className="block btn-gradient px-4 py-2 rounded-lg font-semibold text-center">
                  Login
                </a>
              )}
            </div>
          )}
      </div>
    </header>
  );
}
