import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import SkillGapRadar from '../components/cards/SkillGapRadar';
import api from '../utils/api';
import AIChatbot from '../components/AIChatbot';

export default function SkillGapPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('careerai_user') || '{"email":"sravanthivarikuti233@gmail.com","name":"Sravanthivarikuti"}');
  const [userRole, setUserRole] = useState('Data Scientist');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's actual target role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/roadmaps/latest');
        if (response.data && response.data.target_role) {
          setUserRole(response.data.target_role);
        }
      } catch (error) {
        console.log('Using default role: Data Scientist');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, []);
  
  const handleSignOut = () => {
    localStorage.removeItem('careerai_logged_in');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"
        />
      </div>
      <Sidebar user={user} onSignOut={handleSignOut} />
      <main className="relative z-10 flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text flex items-center gap-4 mb-3">
            <motion.span
              animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl"
            >
              📊
            </motion.span>
            Skill Gap Analysis
          </h1>
          <p className="text-gray-400 text-xl">
            {isLoading ? 'Loading...' : `Comprehensive analysis for ${userRole} - Current skills vs market demand`}
          </p>
        </motion.div>

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-10 border-2 border-blue-500/30 shadow-[0_20px_70px_rgba(59,130,246,0.3)] mb-8 overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Your Skills Overview - {userRole}</h2>
                <p className="text-blue-200">Compare your current expertise with {userRole} market requirements</p>
              </div>
              <div className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-sm font-bold shadow-lg">
                Live Analysis
              </div>
            </div>
            <SkillGapRadar />
          </div>
        </motion.div>

        {/* Skills Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">✅</span> Your Strengths
            </h3>
            <div className="space-y-3">
              {['Python', 'Data Analysis', 'Statistics'].map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <span className="text-white font-medium">{skill}</span>
                  <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">85%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Skills to Develop
            </h3>
            <div className="space-y-3">
              {['Machine Learning', 'Deep Learning', 'Cloud Computing'].map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <span className="text-white font-medium">{skill}</span>
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">35%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📚', title: 'Take Courses', desc: 'Start with ML fundamentals' },
              { icon: '💼', title: 'Build Projects', desc: 'Apply your new skills' },
              { icon: '🎓', title: 'Get Certified', desc: 'Validate your expertise' }
            ].map((action, idx) => (
              <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="text-4xl mb-3">{action.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{action.title}</h4>
                <p className="text-white/80">{action.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
