import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dashboard, 
  Timeline, 
  School, 
  TrendingUp, 
  Settings, 
  Home,
  Info,
  ExitToApp,
  Person,
  EmojiEvents,
  Assessment,
  Menu,
  Close,
  SmartToy
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '../../utils/translate';

const Sidebar = ({ user, onSignOut }) => {
  const [activeItem, setActiveItem] = useState('Overview');
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslate();

  // Navigation items with translated labels
  const navItems = [
    { label: t('Overview'), icon: Dashboard, path: '/dashboard', gradient: 'from-cyan-500 to-blue-600' },
    { label: t('AI Assistant'), icon: SmartToy, path: '#chatbot', gradient: 'from-blue-500 to-purple-600', special: true },
    { label: t('Generate Roadmap'), icon: Timeline, path: '/generate', gradient: 'from-purple-500 to-pink-600' },
    { label: t('My Courses'), icon: School, path: '/courses', gradient: 'from-orange-500 to-red-600' },
    { label: t('Market Insights'), icon: TrendingUp, path: '/market-trends', gradient: 'from-green-500 to-emerald-600' },
    { label: t('Skill Gap Analysis'), icon: Assessment, path: '/skill-gap', gradient: 'from-indigo-500 to-purple-600' },
    { label: t('My Profile'), icon: Person, path: '/profile', gradient: 'from-pink-500 to-rose-600' },
  ];

  const bottomNavItems = [
    { label: t('Features'), icon: Home, path: '/features' },
    { label: t('About Us'), icon: Info, path: '/#about', scrollTo: true },
    { label: t('Settings'), icon: Settings, path: '#settings' },
  ];

  const handleNavClick = (e, label, path) => {
    setActiveItem(label);
    setIsOpen(false); // Close mobile menu after click
    if (path === '#chatbot') {
      e.preventDefault();
      // Trigger chatbot open by dispatching custom event
      window.dispatchEvent(new CustomEvent('openChatbot'));
    } else if (path.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBottomNavClick = (e, item) => {
    setIsOpen(false);
    if (item.scrollTo) {
      e.preventDefault();
      // Navigate to landing page first if not already there
      if (location.pathname !== '/') {
        window.location.href = item.path;
      } else {
        const sectionId = item.path.split('#')[1];
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? <Close /> : <Menu />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -288 }}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -288 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed lg:relative w-72 min-h-screen flex flex-col bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 border-r-2 border-purple-500/20 shadow-2xl z-40"
      >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo & Sign Out */}
        <div className="px-6 py-6">
          <div className="flex flex-col items-center justify-center mb-6 gap-3">
            <div className="flex items-center justify-center p-3 bg-white/10 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/30 shadow-2xl hover:shadow-cyan-500/70 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="CareerAI Logo" 
                className="h-14 w-auto object-contain drop-shadow-2xl"
                style={{ maxHeight: '56px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text tracking-tight">
              CareerAI
            </h2>
          </div>

          {/* User Profile Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <Person />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">
                  {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}
                </div>
                <div className="text-gray-400 text-xs truncate">{user?.email || 'No email'}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 rounded-xl font-medium hover:from-red-500/30 hover:to-pink-500/30 transition-all"
            >
              <ExitToApp fontSize="small" />
              {t('Sign Out')}
            </motion.button>
          </motion.div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 px-3 mb-3">MAIN MENU</div>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <Link
                key={item.label}
                to={item.path.startsWith('#') ? location.pathname : item.path}
                onClick={(e) => handleNavClick(e, item.label, item.path)}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${isActive 
                      ? 'bg-white/10 text-white shadow-lg backdrop-blur-xl border border-white/20' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }
                    ${item.special ? 'animate-pulse' : ''}
                  `}
                >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-xl`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient}` : item.special ? `bg-gradient-to-br ${item.gradient}` : 'bg-white/5'}`}>
                  <Icon fontSize="small" />
                </div>
                <span className="relative flex items-center gap-2">
                  {item.label}
                  {item.special && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 text-[10px] font-bold rounded-full text-white">
                      NEW
                    </span>
                  )}
                </span>
              </motion.div>
              </Link>
            );
          })}

          {/* Bottom Navigation */}
          <div className="pt-6">
            <div className="text-xs font-semibold text-gray-400 px-3 mb-3">GENERAL</div>
            {bottomNavItems.map((item, idx) => {
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => handleBottomNavClick(e, item)}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + idx) * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white font-medium transition-all"
                  >
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Icon fontSize="small" />
                    </div>
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="text-xs font-semibold text-gray-300 mb-2">💡 Pro Tip</div>
            <div className="text-xs text-gray-400">Complete daily tasks to unlock badges!</div>
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
};

export default Sidebar;
