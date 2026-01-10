import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, Lock, Star, TrendingUp, Award, Zap, Circle } from 'lucide-react';
import api from '../utils/api';

// Animated Progress Circle Component
function ProgressCircle({ progress, phase, label }) {
  const colors = {
    foundation: { bg: 'from-blue-500 to-blue-600', ring: 'text-blue-500', glow: 'shadow-blue-500/50' },
    intermediate: { bg: 'from-pink-500 to-pink-600', ring: 'text-pink-500', glow: 'shadow-pink-500/50' },
    advanced: { bg: 'from-purple-500 to-purple-600', ring: 'text-purple-500', glow: 'shadow-purple-500/50' }
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={colors[phase].ring}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{progress}%</div>
            <div className="text-sm text-gray-400 mt-1">{label}</div>
          </div>
        </div>
      </div>
      {/* Animated glow effect */}
      <motion.div
        animate={{
          boxShadow: [
            `0 0 20px ${progress > 0 ? 'rgba(59, 130, 246, 0.5)' : 'transparent'}`,
            `0 0 40px ${progress > 0 ? 'rgba(59, 130, 246, 0.7)' : 'transparent'}`,
            `0 0 20px ${progress > 0 ? 'rgba(59, 130, 246, 0.5)' : 'transparent'}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full pointer-events-none ${progress === 100 ? colors[phase].glow : ''}`}
      />
    </motion.div>
  );
}

// 2D Progress Tracker Visualization
function Progress2DTracker({ phaseProgress }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProgressCircle
          progress={phaseProgress?.foundation?.progress || 0}
          phase="foundation"
          label="Foundation"
        />
        <ProgressCircle
          progress={phaseProgress?.intermediate?.progress || 0}
          phase="intermediate"
          label="Intermediate"
        />
        <ProgressCircle
          progress={phaseProgress?.advanced?.progress || 0}
          phase="advanced"
          label="Advanced"
        />
      </div>
    </div>
  );
}

// Celebration Effect Component - Pure CSS Animation
function CelebrationEffect({ show, phaseName }) {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (show) {
      setShowEffect(true);
      const timer = setTimeout(() => setShowEffect(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!showEffect) return null;

  return (
    <>
      {/* Animated falling elements */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              top: '-10px'
            }}
          >
            <div 
              className="text-2xl"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {['🎉', '⭐', '🏆', '✨', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          </div>
        ))}
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: 2
            }}
            className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 p-8 rounded-3xl shadow-2xl"
          >
            <div className="text-center text-white">
              <Trophy className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
              <p className="text-2xl">{phaseName} Level Completed!</p>
              <div className="flex justify-center gap-4 mt-4">
                <Star className="w-8 h-8 animate-bounce" style={{animationDelay: '0s'}} />
                <Award className="w-8 h-8 animate-bounce" style={{animationDelay: '0.1s'}} />
                <Zap className="w-8 h-8 animate-bounce" style={{animationDelay: '0.2s'}} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </>
  );
}

// Phase Card Component
function PhaseCard({ phase, phaseData, completedCourses, onCourseToggle }) {
  const [courses, setCourses] = useState([]);
  const progress = phaseData?.progress || 0;
  const isCompleted = progress === 100;

  const phaseColors = {
    foundation: 'from-blue-500 to-blue-600',
    intermediate: 'from-pink-500 to-pink-600',
    advanced: 'from-purple-500 to-purple-600'
  };

  const phaseIcons = {
    foundation: '📚',
    intermediate: '🚀',
    advanced: '⭐'
  };

  useEffect(() => {
    // Fetch user's roadmap to get courses
    api.get('/generate_roadmap').then(res => {
      if (res.data && res.data.phases) {
        const phaseData = res.data.phases.find(p => p.name.toLowerCase() === phase);
        if (phaseData && phaseData.resources) {
          setCourses(phaseData.resources.filter(r => r.type === 'course'));
        }
      }
    }).catch(err => console.error('Error fetching roadmap:', err));
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${phaseColors[phase]} p-4 rounded-xl mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{phaseIcons[phase]}</span>
            <div>
              <h3 className="text-2xl font-bold text-white capitalize">{phase}</h3>
              <p className="text-white/80 text-sm">
                {phaseData?.completed?.length || 0} / {phaseData?.total || 0} completed
              </p>
            </div>
          </div>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Trophy className="w-12 h-12 text-yellow-300" />
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <p className="text-white text-right mt-1 font-bold">{progress}%</p>
      </div>

      {/* Courses List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {courses.map((course, index) => {
          const courseId = `${phase}_${course.title}`;
          const isCompleted = completedCourses.includes(courseId);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                isCompleted
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onCourseToggle(phase, course.title, !isCompleted)}
                  className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400 hover:border-green-400'
                  }`}
                >
                  {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                    {course.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{course.provider || 'Online Course'}</p>
                  {course.duration_hours && (
                    <p className="text-xs text-gray-500 mt-1">
                      ⏱️ {course.duration_hours}h learning time
                    </p>
                  )}
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-400"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {courses.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No courses available for this phase</p>
            <p className="text-sm mt-2">Complete your roadmap first!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Main Progress Tracker Component
export default function ProgressTracker() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrationPhase, setCelebrationPhase] = useState(null);
  const [lastProgress, setLastProgress] = useState({});

  // Fetch progress on mount
  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress/status');
      setProgressData(response.data);
      
      // Store current progress for comparison
      if (response.data.phase_progress) {
        setLastProgress(response.data.phase_progress);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const handleCourseToggle = async (phase, courseTitle, markComplete) => {
    try {
      if (markComplete) {
        await api.post('/progress/mark-complete', {
          phase,
          course_title: courseTitle
        });
      } else {
        await api.post('/progress/uncomplete', {
          phase,
          course_title: courseTitle
        });
      }

      // Refetch progress
      const response = await api.get('/progress/status');
      const newProgress = response.data.phase_progress;

      // Check if phase just completed
      if (newProgress[phase]?.progress === 100 && lastProgress[phase]?.progress < 100) {
        setCelebrationPhase(phase);
        setTimeout(() => setCelebrationPhase(null), 5000);
      }

      setProgressData(response.data);
      setLastProgress(newProgress);
    } catch (error) {
      console.error('Error toggling course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading Progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <CelebrationEffect show={!!celebrationPhase} phaseName={celebrationPhase} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-2 flex items-center gap-3">
          <TrendingUp className="w-12 h-12" />
          Learning Progress Tracker
        </h1>
        <p className="text-gray-300 text-lg">Track your journey to career success</p>
      </motion.div>

      {/* Overall Progress Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-white">
              {progressData?.total_progress || 0}%
            </div>
            <p className="text-white/80 mt-2">Overall Progress</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {progressData?.completed_courses?.length || 0}
            </div>
            <p className="text-white/80 mt-2">Courses Completed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {Object.values(progressData?.phase_progress || {}).filter(p => p.progress === 100).length}
            </div>
            <p className="text-white/80 mt-2">Levels Mastered</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white flex items-center justify-center gap-2">
              {progressData?.total_progress === 100 ? <Trophy className="w-10 h-10" /> : <Star className="w-10 h-10" />}
            </div>
            <p className="text-white/80 mt-2">
              {progressData?.total_progress === 100 ? 'Champion!' : 'Keep Going!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3D Progress Visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-8 h-8" />
          Progress Visualization
        </h2>
        <Progress2DTracker phaseProgress={progressData?.phase_progress} />
      </motion.div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PhaseCard
          phase="foundation"
          phaseData={progressData?.phase_progress?.foundation}
          completedCourses={progressData?.completed_courses || []}
          onCourseToggle={handleCourseToggle}
        />
        <PhaseCard
          phase="intermediate"
          phaseData={progressData?.phase_progress?.intermediate}
          completedCourses={progressData?.completed_courses || []}
          onCourseToggle={handleCourseToggle}
        />
        <PhaseCard
          phase="advanced"
          phaseData={progressData?.phase_progress?.advanced}
          completedCourses={progressData?.completed_courses || []}
          onCourseToggle={handleCourseToggle}
        />
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
