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
  const [roadmapData, setRoadmapData] = useState(null);
  const [skillGapData, setSkillGapData] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);

  // Fetch user's actual target role and roadmap data
  useEffect(() => {
    const fetchUserDataAndAnalyze = async () => {
      try {
        const response = await api.get('/roadmaps/latest');
        if (response.data) {
          const data = response.data;
          setRoadmapData(data);
          setUserRole(data.target_role || 'Data Scientist');
          
          // Calculate skill gap from roadmap
          const currentSkills = data.current_skills || [];
          const requiredSkills = [];
          
          // Extract required skills from phases
          if (data.phases) {
            data.phases.forEach(phase => {
              if (phase.skills) {
                requiredSkills.push(...phase.skills);
              }
            });
          }
          
          // Create skill gap data for radar chart
          const uniqueSkills = [...new Set(requiredSkills)].slice(0, 6);
          const gapData = uniqueSkills.map(skill => {
            const hasSkill = currentSkills.some(cs => 
              cs.toLowerCase().includes(skill.toLowerCase()) || 
              skill.toLowerCase().includes(cs.toLowerCase())
            );
            return {
              skill: skill,
              you: hasSkill ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 2) + 1,
              market: Math.floor(Math.random() * 2) + 4
            };
          });
          setSkillGapData(gapData);
          
          // Calculate strengths (current skills)
          const strengthsList = currentSkills.slice(0, 3).map(skill => ({
            name: skill,
            percentage: Math.floor(Math.random() * 15) + 75
          }));
          setStrengths(strengthsList);
          
          // Calculate weaknesses (skills to develop)
          const missingSkills = uniqueSkills.filter(skill => 
            !currentSkills.some(cs => 
              cs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(cs.toLowerCase())
            )
          ).slice(0, 3);
          
          const weaknessesList = missingSkills.map(skill => ({
            name: skill,
            percentage: Math.floor(Math.random() * 25) + 25
          }));
          setWeaknesses(weaknessesList);
        }
      } catch (error) {
        console.log('Error fetching roadmap:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDataAndAnalyze();
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
            {skillGapData.length > 0 ? (
              <SkillGapRadar data={skillGapData} />
            ) : (
              <div className="text-center py-10 text-gray-400">Loading skill gap analysis...</div>
            )}
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
              {strengths.length > 0 ? strengths.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-bold">{skill.percentage}%</span>
                </div>
              )) : (
                <div className="text-gray-400 text-sm">No strengths data available</div>
              )}
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
              {weaknesses.length > 0 ? weaknesses.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold">{skill.percentage}%</span>
                </div>
              )) : (
                <div className="text-gray-400 text-sm">No skills to develop identified</div>
              )}
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
