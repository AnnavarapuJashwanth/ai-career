import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { 
  EmojiEvents, 
  TrendingUp, 
  School, 
  CheckCircle,
  AutoAwesome,
  Speed,
  Stars
} from '@mui/icons-material';

export default function ProgressTrackerNew() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('careerai_user') || 'null');
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    fetchProgress();
    
    // Listen for custom event to refresh progress when skills are marked
    const handleProgressUpdate = () => {
      fetchProgress();
    };
    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
    };
  }, []);

  const fetchProgress = async () => {
    try {
      console.log('🔄 Fetching progress data...');
      const response = await api.get('/progress/status');
      console.log('✅ Progress data received:', response.data);
      console.log('📊 Phase progress:', response.data.phase_progress);
      setProgressData(response.data);
      
      if (response.data.completed_courses?.length > 0) {
        console.log('✓ Completed courses:', response.data.completed_courses);
      } else {
        console.log('⚠️ No completed courses found');
      }
    } catch (error) {
      console.error('❌ Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('careerai_user');
    navigate('/');
  };

  // Calculate overall progress
  const overallProgress = Math.round(
    ((progressData?.phase_progress?.foundation?.progress || 0) +
      (progressData?.phase_progress?.intermediate?.progress || 0) +
      (progressData?.phase_progress?.advanced?.progress || 0)) / 3
  );

  // Phase configurations
  const phases = [
    {
      name: 'Foundation',
      key: 'foundation',
      color: 'from-blue-400 to-blue-600',
      ringColor: '#3b82f6',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      textColor: 'text-blue-600',
      icon: '🎯',
      description: 'Building the basics'
    },
    {
      name: 'Intermediate',
      key: 'intermediate',
      color: 'from-purple-400 to-purple-600',
      ringColor: '#9333ea',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      textColor: 'text-purple-600',
      icon: '🚀',
      description: 'Advancing your skills'
    },
    {
      name: 'Advanced',
      key: 'advanced',
      color: 'from-orange-400 to-orange-600',
      ringColor: '#f97316',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
      textColor: 'text-orange-600',
      icon: '⭐',
      description: 'Mastering expertise'
    }
  ];

  // Get completed skills for a phase
  const getPhaseSkills = (phaseKey) => {
    console.log(`\n🔍 getPhaseSkills called for: ${phaseKey}`);
    console.log('📦 Full progressData:', progressData);
    console.log('📊 phase_progress object:', progressData?.phase_progress);
    
    const phaseData = progressData?.phase_progress?.[phaseKey];
    console.log(`📋 ${phaseKey} phaseData:`, phaseData);
    
    if (!phaseData) {
      console.log(`⚠️ No phaseData found for ${phaseKey}`);
      return { completed: [], total: 0, progress: 0, count: 0 };
    }
    
    console.log(`✓ ${phaseKey} completed array:`, phaseData.completed);
    
    // Parse skill names from "phase_skillname" format
    const completedSkills = (phaseData.completed || []).map(course => {
      const parts = course.split('_');
      return parts.slice(1).join('_');
    });
    
    console.log(`🎯 ${phaseKey} parsed skills:`, completedSkills);
    
    return {
      completed: completedSkills,
      total: phaseData.total || 0,
      progress: phaseData.progress || 0,
      count: completedSkills.length
    };
  };

  // Circle SVG Component
  const PhaseCircle = ({ phase, delay }) => {
    const phaseInfo = getPhaseSkills(phase.key);
    const circumference = 2 * Math.PI * 80;
    const strokeDashoffset = circumference - (phaseInfo.progress / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="relative cursor-pointer"
        onClick={() => setSelectedPhase(selectedPhase === phase.key ? null : phase.key)}
      >
        <div className={`bg-gradient-to-br ${phase.bgGradient} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 ${selectedPhase === phase.key ? 'ring-4 ring-offset-4' : ''}`}
             style={{ ringColor: selectedPhase === phase.key ? phase.ringColor : 'transparent' }}>
          
          {/* Circle SVG */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke={phase.ringColor}
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl mb-2">{phase.icon}</span>
                <span className={`text-4xl font-bold ${phase.textColor}`}>
                  {Math.round(phaseInfo.progress)}%
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {phaseInfo.count}/{phaseInfo.total}
                </span>
              </div>
            </div>
          </div>

          {/* Phase Info */}
          <div className="text-center">
            <h4 className={`text-xl font-bold ${phase.textColor} mb-1`}>
              {phase.name}
            </h4>
            <p className="text-gray-600 text-sm mb-4">{phase.description}</p>
            
            {/* Skills Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${phaseInfo.progress}%` }}
                transition={{ duration: 1, delay: delay + 0.5 }}
              />
            </div>

            {/* Completed Skills Badge */}
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className={phase.textColor} fontSize="small" />
              <span className="text-sm font-medium text-gray-700">
                {phaseInfo.count} skills completed
              </span>
            </div>
          </div>

          {/* Expanded Skills List */}
          <AnimatePresence>
            {selectedPhase === phase.key && phaseInfo.completed.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <h5 className="text-sm font-bold text-gray-700 mb-3">Completed Skills:</h5>
                <div className="grid grid-cols-2 gap-2">
                  {phaseInfo.completed.slice(0, 8).map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`text-xs px-3 py-2 rounded-lg bg-gradient-to-r ${phase.color} text-white flex items-center gap-2`}
                    >
                      <CheckCircle fontSize="small" />
                      <span className="truncate">{skill}</span>
                    </motion.div>
                  ))}
                </div>
                {phaseInfo.completed.length > 8 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    +{phaseInfo.completed.length - 8} more skills
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Sidebar user={user} onSignOut={handleSignOut} />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalSkillsCompleted = 
    (getPhaseSkills('foundation').count || 0) +
    (getPhaseSkills('intermediate').count || 0) +
    (getPhaseSkills('advanced').count || 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Sidebar user={user} onSignOut={handleSignOut} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={fetchProgress}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Progress
              </button>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'L'}
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LEARNER
                </h2>
                <p className="text-gray-600 font-medium">
                  {user?.name || 'Career Enthusiast'}
                </p>
              </div>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all">
              UPGRADE
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Overall Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <TrendingUp className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall</p>
                <p className="text-2xl font-bold text-purple-600">{overallProgress}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Skills Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <CheckCircle className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{totalSkillsCompleted}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Skills mastered</p>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Speed className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-orange-600">7 days</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Keep it up! 🔥</p>
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Stars className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Badges</p>
                <p className="text-2xl font-bold text-yellow-600">{Math.floor(totalSkillsCompleted / 3)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Achievements earned</p>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Learning Journey
          </h1>
          <p className="text-gray-600">
            Track your progress across all skill phases
          </p>
        </motion.div>

        {/* Three Phase Circles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {phases.map((phase, idx) => (
            <PhaseCircle key={phase.key} phase={phase} delay={0.3 + idx * 0.15} />
          ))}
        </div>

        {/* Recommendations & Motivation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl shadow-lg p-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <AutoAwesome className="text-purple-500" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <School />
                View Full Roadmap
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp />
                Explore Courses
              </button>
              <button
                onClick={() => {
                  fetchProgress();
                  toast.success('Progress refreshed!', { autoClose: 1500 });
                }}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle />
                Refresh Progress
              </button>
            </div>
          </motion.div>

          {/* Motivation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-3xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <EmojiEvents className="text-yellow-300" fontSize="large" />
              <h3 className="text-2xl font-bold">Keep Going!</h3>
            </div>
            <p className="text-purple-100 mb-6 text-lg">
              {totalSkillsCompleted === 0 
                ? "Start your journey by completing your first skill in the roadmap!" 
                : totalSkillsCompleted < 5
                ? "Great start! Keep completing skills to unlock more achievements."
                : totalSkillsCompleted < 10
                ? "You're making excellent progress! Keep up the momentum."
                : "Amazing work! You're well on your way to mastery! 🎉"
              }
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm font-semibold mb-2">💡 Pro Tip:</p>
              <p className="text-sm text-purple-100">
                Click on the phase circles above to view your completed skills and track your detailed progress!
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
