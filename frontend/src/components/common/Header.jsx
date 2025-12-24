import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Close } from '@mui/icons-material';

export default function Header() {
  const [active, setActive] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handler = () => {
      let current = 'home';
      if (window.location.pathname === '/about') current = 'about';
      if (window.location.pathname === '/features') current = 'features';
      const features = document.getElementById('features');
      if (features && window.location.pathname === '/') {
        const rect = features.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) current = 'features';
      }
      setActive(current);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('hashchange', handler);
    };
  }, [location.pathname]);

  const linkBase =
    'text-gray-600 transition font-medium relative after:absolute after:w-full after:h-1 after:bg-blue-600 after:bottom-0 after:left-0 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300';

  const user = (() => {
    try {
      // Validate token before showing logged-in state
      const token = localStorage.getItem('authToken');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          
          if (currentTime >= expirationTime) {
            // Token expired, clear everything
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
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 relative overflow-hidden">
      {isLanding && (
        <div aria-hidden className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=60')] bg-cover bg-center opacity-10 pointer-events-none" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight">CareerAI</h1>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-8 items-center text-base font-bold">
            {!isLoggedIn && (
              <a href="/" className={`${linkBase} ${active === 'home' ? 'text-blue-700 after:scale-x-100' : 'hover:text-blue-600'}`}>Home</a>
            )}
            <a href="/features" className={`${linkBase} ${active === 'features' ? 'text-blue-700 after:scale-x-100' : 'hover:text-blue-600'}`}>Features</a>
            <a href="/about" className={`${linkBase} ${active === 'about' ? 'text-blue-700 after:scale-x-100' : 'hover:text-blue-600'}`}>About</a>
          </nav>

          {/* Desktop Right side buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {isLoggedIn ? (
              <>
                {user?.name && (
                  <span className="text-sm text-gray-700 mr-2 hidden xl:inline">Hi, <span className="font-semibold">{user.name}</span></span>
                )}
                <a href="/generate" className="btn-glass px-3 xl:px-5 py-2 rounded-lg font-semibold shadow hover:shadow-xl transition-all scale-100 hover:scale-105 text-sm xl:text-base">Resume</a>
                <a href="/demo" className="btn-glass px-3 xl:px-5 py-2 rounded-lg font-semibold shadow hover:shadow-xl transition-all scale-100 hover:scale-105 text-sm xl:text-base">Demo</a>
                <a href="/dashboard" className="btn-gradient px-3 xl:px-5 py-2 rounded-lg font-semibold shadow hover:shadow-xl transition-all scale-100 hover:scale-105 text-sm xl:text-base">Dashboard</a>
                <button onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('careerai_user'); window.location.href = '/'; }} className="btn-danger px-3 xl:px-5 py-2 rounded-lg font-semibold shadow hover:shadow-xl transition-all scale-100 hover:scale-105 text-sm xl:text-base">Logout</button>
              </>
            ) : (
              <a href="/login" className="btn-gradient px-4 xl:px-6 py-2 rounded-lg font-semibold shadow hover:shadow-lg transition">Login</a>
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
            {!isLoggedIn && (
              <a href="/" className="block py-2 text-gray-700 hover:text-blue-600 font-semibold">Home</a>
            )}
            <a href="/features" className="block py-2 text-gray-700 hover:text-blue-600 font-semibold">Features</a>
            <a href="/about" className="block py-2 text-gray-700 hover:text-blue-600 font-semibold">About</a>
            
            {isLoggedIn ? (
              <>
                {user?.name && (
                  <div className="py-2 text-sm text-gray-700">Hi, <span className="font-semibold">{user.name}</span></div>
                )}
                <a href="/generate" className="block btn-glass px-4 py-2 rounded-lg font-semibold text-center">Resume</a>
                <a href="/demo" className="block btn-glass px-4 py-2 rounded-lg font-semibold text-center">Demo</a>
                <a href="/dashboard" className="block btn-gradient px-4 py-2 rounded-lg font-semibold text-center">Dashboard</a>
                <button onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('careerai_user'); window.location.href = '/'; }} className="w-full btn-danger px-4 py-2 rounded-lg font-semibold">Logout</button>
              </>
            ) : (
              <a href="/login" className="block btn-gradient px-4 py-2 rounded-lg font-semibold text-center">Login</a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
