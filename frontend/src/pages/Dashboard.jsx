import React, { useEffect, useMemo, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import RoadmapScene from '../components/3d/RoadmapScene';
import PhaseCard from '../components/cards/PhaseCard';
import DetailedPhaseCard from '../components/cards/DetailedPhaseCard';
import SkillCard from '../components/cards/SkillCard';
import CourseCard from '../components/cards/CourseCard';
import Sidebar from '../components/common/Sidebar';
import DashboardHeader from '../components/common/DashboardHeader';
import SkillGapRadar from '../components/cards/SkillGapRadar';
import MarketTrendsBar from '../components/cards/MarketTrendsBar';
import AIChatbot from '../components/AIChatbot';
import { useMarketTrends } from '../hooks/useMarketTrends';
import { useTranslate } from '../utils/translate';
import api from '../utils/api';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const user = JSON.parse(localStorage.getItem('careerai_user') || 'null') || { email: 'user@example.com', name: 'User' };
  const [roadmapData, setRoadmapData] = useState(location.state?.roadmap || null);
  const role = roadmapData?.target_role || location.state?.role || 'Frontend Developer';
  const loc = location.state?.location || '';
  
  // Use current_skills from roadmap data (should be populated from backend)
  // Fallback to location state or empty array
  const currentSkills = roadmapData?.current_skills || location.state?.currentSkills || [];

  // Debug: Log all relevant data
  console.log('=== DASHBOARD DEBUG ===');
  console.log('Roadmap data:', roadmapData);
  console.log('Readiness Score:', roadmapData?.readiness_score);
  console.log('Skill Gap Percentage:', roadmapData?.skill_gap_percentage);
  console.log('Current skills from roadmap:', roadmapData?.current_skills);
  console.log('Current skills from location:', location.state?.currentSkills);
  console.log('Final currentSkills being used:', currentSkills);
  console.log('Target role:', role);
  console.log('Location:', loc);
  console.log('=======================');

  const [selectedPhase, setSelectedPhase] = useState(null);
  const { fetch: fetchTrends, data: trendsData } = useMarketTrends();
  const [narrative, setNarrative] = useState('');
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [regenLoading, setRegenLoading] = useState(false);
  const [loadedFromAccount, setLoadedFromAccount] = useState(false);

  useEffect(() => {
    if (role) fetchTrends(role, loc).catch(() => {});
  }, [role, loc, fetchTrends]);

  // Scroll to top on mount to show overview section
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // If no roadmap passed from navigation, try to load latest from backend
    if (!roadmapData) {
      const token = localStorage.getItem('authToken');
      
      // Validate token expiration
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            
            if (currentTime >= expirationTime) {
              // Token expired
              localStorage.removeItem('authToken');
              localStorage.removeItem('careerai_user');
              navigate('/login');
              return;
            }
          }
        } catch (error) {
          // Invalid token
          localStorage.removeItem('authToken');
          localStorage.removeItem('careerai_user');
          navigate('/login');
          return;
        }
      }
      
      if (!token) {
        // No token, redirect to login
        navigate('/login');
        return;
      }
      api.get('/roadmaps/latest')
        .then((res) => { setRoadmapData(res.data); setLoadedFromAccount(true); toast.success('Loaded latest roadmap from your account'); })
        .catch(() => {
          // No roadmap found, redirect to input form
          toast.info('No roadmap found. Please create one first.');
          navigate('/generate');
        });
    }
  }, []);

  useEffect(() => {
    // When we have a roadmap, ask backend for explanation and micro-projects
    if (roadmapData?.phases?.length) {
      api.post('/explain_roadmap', { roadmap: roadmapData })
        .then(({ data }) => {
          setNarrative(data.narrative);
          setProjectIdeas(data.project_ideas || []);
        })
        .catch(() => {});
    }
  }, [roadmapData]);

  const radarData = useMemo(() => {
    const top = trendsData?.trending_skills?.slice(0, 6) || [];
    const haveSkills = roadmapData?.current_skills || currentSkills || [];
    const items = top.map((t) => {
      const you = haveSkills.some((s) => s.toLowerCase() === t.name.toLowerCase()) ? 4 : 1;
      const market = Math.max(1, Math.round((t.importance || 0.2) * 5));
      return { skill: t.name, you, market };
    });
    return items.length ? items : undefined;
  }, [trendsData, currentSkills, roadmapData]);

  // PDF Export Function
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;
      
      // Title
      doc.setFontSize(24);
      doc.setTextColor(66, 135, 245);
      doc.text('Career Roadmap', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
      
      // User Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${user.name || 'User'}`, margin, yPos);
      yPos += 8;
      doc.text(`Email: ${user.email}`, margin, yPos);
      yPos += 8;
      doc.text(`Target Role: ${role}`, margin, yPos);
      yPos += 8;
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 15;
      
      // Readiness Score
      if (roadmapData?.readiness_score) {
        doc.setFontSize(14);
        doc.setTextColor(66, 135, 245);
        doc.text('Readiness Score', margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${roadmapData.readiness_score}%`, margin, yPos);
        yPos += 15;
      }
      
      // Roadmap Phases
      if (roadmapData?.phases && roadmapData.phases.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(66, 135, 245);
        doc.text('Roadmap Phases', margin, yPos);
        yPos += 10;
        
        roadmapData.phases.forEach((phase, index) => {
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = margin;
          }
          
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text(`Phase ${index + 1}: ${phase.phase_name}`, margin, yPos);
          yPos += 8;
          
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          const durationText = `Duration: ${phase.duration || 'N/A'}`;
          doc.text(durationText, margin + 5, yPos);
          yPos += 6;
          
          if (phase.description) {
            const splitDesc = doc.splitTextToSize(phase.description, pageWidth - 2 * margin - 10);
            doc.text(splitDesc, margin + 5, yPos);
            yPos += splitDesc.length * 5 + 3;
          }
          
          if (phase.skills && phase.skills.length > 0) {
            doc.setFontSize(10);
            doc.text('Skills:', margin + 5, yPos);
            yPos += 5;
            const skillsText = phase.skills.join(', ');
            const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 2 * margin - 15);
            doc.text(splitSkills, margin + 10, yPos);
            yPos += splitSkills.length * 5 + 5;
          }
          
          yPos += 5;
        });
      }
      
      // Courses
      if (extractedCourses.length > 0) {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(66, 135, 245);
        doc.text('Recommended Courses', margin, yPos);
        yPos += 10;
        
        extractedCourses.slice(0, 5).forEach((course, index) => {
          if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
          }
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${index + 1}. ${course.title}`, margin, yPos);
          yPos += 7;
          
          if (course.url) {
            doc.setFontSize(9);
            doc.setTextColor(66, 135, 245);
            doc.textWithLink('View Course', margin + 5, yPos, { url: course.url });
            yPos += 7;
          }
        });
      }
      
      // Save PDF
      doc.save(`${role.replace(/\s+/g, '_')}_Roadmap.pdf`);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    }
  };

  function handleSignOut() {
    localStorage.removeItem('careerai_logged_in');
    navigate('/login');
  }

  // Extract courses from roadmap phases
  const extractedCourses = useMemo(() => {
    if (!roadmapData?.phases) return [];
    
    const courses = [];
    roadmapData.phases.forEach(phase => {
      if (phase.resources) {
        phase.resources.forEach(resource => {
          if (resource.type === 'course' && resource.url && !resource.url.includes('google.com')) {
            courses.push(resource);
          }
        });
      }
    });
    
    return courses.slice(0, 8); // Limit to 8 courses for display
  }, [roadmapData]);

  // Use extracted courses or fallback to generic ones
  const coursesToDisplay = extractedCourses.length > 0 ? extractedCourses : [
    {
      title: 'Machine Learning A-Z™',
      description: 'Learn ML from scratch',
      instructor: 'Kirill Eremenko',
      duration_hours: 44,
      rating: 4.5,
      reviews: '1.25K',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      provider: 'Udemy',
      url: 'https://www.udemy.com/course/machinelearning/'
    },
    {
      title: 'Deep Learning Specialization',
      description: 'Master deep learning',
      instructor: 'Andrew Ng',
      duration_hours: 100,
      rating: 4.9,
      reviews: '2.5K',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      provider: 'Coursera',
      url: 'https://www.coursera.org/specializations/deep-learning'
    },
    {
      title: 'SQL for Data Analysis',
      description: 'Advanced SQL queries',
      instructor: 'Maven Analytics',
      duration_hours: 12,
      rating: 4.7,
      reviews: '890',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
      provider: 'DataCamp',
      url: 'https://www.datacamp.com/courses/sql'
    },
    {
      title: 'TensorFlow for Everyone',
      description: 'Deploy ML models',
      instructor: 'TensorFlow Team',
      duration_hours: 20,
      rating: 4.6,
      reviews: '1.1K',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      provider: 'edX',
      url: 'https://www.edx.org/course/tensorflow'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Enhanced Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_50%)]"></div>
        
        {/* Floating Orbs */}
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
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-3xl"
        />
        
        {/* Animated Grid Pattern */}
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <Sidebar user={user} onSignOut={handleSignOut} />
      <main className="relative z-10 flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        {/* Welcome Banner with Modern Design */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 overflow-hidden shadow-[0_20px_70px_rgba(59,130,246,0.3)]"
        >
          {/* Animated Shimmer Effect */}
          <motion.div 
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          
          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
          
          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="flex items-center gap-5">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="text-6xl"
                >
                  👋
                </motion.div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
                    {t('Welcome back')}, {user.name || user.email?.split('@')[0] || 'User'}!
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      <span className="text-2xl">🎯</span>
                      <span className="text-white font-semibold">{role}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full">
                      <span className="text-lg">📧</span>
                      <span className="text-white/90 text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full">
                      <span className="text-lg">📅</span>
                      <span className="text-white/90 text-sm">Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern Stats Cards with Enhanced Animations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: t('Readiness Score'), 
              value: (currentSkills && currentSkills.length > 0) ? `${roadmapData?.readiness_score ?? 0}%` : 'Upload Resume',
              icon: '🎯', 
              color: 'from-emerald-500 to-teal-600',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/30'
            },
            { 
              label: t('Skill Gap'), 
              value: (currentSkills && currentSkills.length > 0) ? `${roadmapData?.skill_gap_percentage ?? 0}%` : 'Upload Resume',
              icon: '📊', 
              color: 'from-amber-500 to-orange-600',
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/30'
            },
            { 
              label: t('Current Phase'), 
              value: t('Foundation'), 
              icon: '🚀', 
              color: 'from-blue-500 to-indigo-600',
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/30'
            },
            { 
              label: t('Days Active'), 
              value: t('12 Days'), 
              icon: '⏱️', 
              color: 'from-purple-500 to-pink-600',
              bg: 'bg-purple-500/10',
              border: 'border-purple-500/30'
            }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + idx * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className={`relative group ${stat.bg} backdrop-blur-xl rounded-2xl p-6 border-2 ${stat.border} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer`}
            >
              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 rounded-bl-full`}></div>
              
              {/* Hover Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0, 0.1, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} blur-xl`}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-5xl filter drop-shadow-lg"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={`px-5 py-2 rounded-xl bg-gradient-to-r ${stat.color} text-white text-xl font-bold shadow-lg`}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <h3 className="text-white text-base font-bold tracking-wide">
                  {stat.label}
                </h3>
                <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                    className={`h-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section with Modern Design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          id="analytics"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -8 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring" }}
            className="relative group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-purple-500/30 shadow-[0_8px_32px_rgba(168,85,247,0.2)] hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300 overflow-hidden"
          >
            {/* Animated Corner Decoration */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <motion.span 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      className="text-4xl"
                    >
                      📈
                    </motion.span>
                    {t('Skill Gap Analysis')}
                  </h3>
                  <p className="text-blue-200 text-sm">Compare your skills with market demand</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white text-xs font-bold shadow-lg">
                  Live
                </div>
              </div>
              <SkillGapRadar data={radarData} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -8 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7, type: "spring" }}
            className="relative group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/30 shadow-[0_8px_32px_rgba(168,85,247,0.2)] hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300 overflow-hidden"
            id="market"
          >
            {/* Animated Corner Decoration */}
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                rotate: [360, 180, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <motion.span 
                      animate={{ 
                        rotate: [0, 20, -20, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                      className="text-4xl"
                    >
                      📊
                    </motion.span>
                    {t('Market Trends')}
                  </h3>
                  <p className="text-purple-200 text-sm">Real-time job market insights for {role}</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-xs font-bold shadow-lg">
                  Daily
                </div>
              </div>
              <MarketTrendsBar trends={trendsData?.trending_skills} role={role} />
            </div>
          </motion.div>
          
          {/* Job Opportunities Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="relative bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-3xl rounded-3xl p-10 shadow-2xl border-2 border-emerald-500/20 overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                    <motion.span 
                      animate={{ 
                        y: [0, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      💼
                    </motion.span>
                    {t('Job Opportunities')}
                  </h3>
                  <p className="text-emerald-200 text-sm">Career opportunities for {role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Card 1 - Indeed */}
                <motion.a
                  href={`https://www.indeed.com/jobs?q=${encodeURIComponent(role)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-2xl">
                        🔍
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Indeed Jobs</h4>
                        <p className="text-gray-400 text-xs">Search on Indeed</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-xl">→</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Find {role} positions on Indeed
                  </p>
                </motion.a>

                {/* Job Card 2 - LinkedIn */}
                <motion.a
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-2xl">
                        💼
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">LinkedIn Jobs</h4>
                        <p className="text-gray-400 text-xs">Professional network</p>
                      </div>
                    </div>
                    <span className="text-blue-400 text-xl">→</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Explore {role} opportunities on LinkedIn
                  </p>
                </motion.a>

                {/* Job Card 3 - Glassdoor */}
                <motion.a
                  href={`https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(role)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center text-2xl">
                        🏢
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Glassdoor</h4>
                        <p className="text-gray-400 text-xs">Company insights</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-xl">→</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Browse {role} jobs with company reviews
                  </p>
                </motion.a>

                {/* Job Card 4 - Remote Jobs */}
                <motion.a
                  href={`https://remoteok.com/remote-${encodeURIComponent(role.toLowerCase().replace(/\s+/g, '-'))}-jobs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-2xl">
                        🌍
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Remote Jobs</h4>
                        <p className="text-gray-400 text-xs">Work from anywhere</p>
                      </div>
                    </div>
                    <span className="text-purple-400 text-xl">→</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Find remote {role} positions worldwide
                  </p>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Roadmap Section with Enhanced Styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-3xl rounded-3xl p-10 shadow-2xl mb-8 border-2 border-white/20 overflow-hidden"
          id="roadmap"
        >
          {/* Animated Corner Accents */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-3 mb-2">
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl"
                  >
                    🗺️
                  </motion.span>
                  {t('Your Personalized Career Roadmap')}
                </h2>
                <p className="text-gray-400 text-sm">Tailored path to achieve your career goals</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleExportPDF}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-semibold shadow-xl transition-all"
                >
                  <span className="text-xl">📄</span>
                  {t('Export PDF')}
                </motion.button>
                {loadedFromAccount && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">Loaded from your account</span>
                )}
              </div>
            </div>
            {roadmapData?.phases ? (
              <RoadmapScene phases={roadmapData.phases} />
            ) : (
              <div className="text-gray-300">No roadmap yet. Go to Generate to create one.</div>
            )}
          </div>
        </motion.div>

        {/* Narrative + Micro-projects */}
        {narrative && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-3xl rounded-3xl p-10 shadow-2xl mb-8 border-2 border-white/20 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">🧭</span> Roadmap Guidance
              </h3>
              <button
                type="button"
                disabled={regenLoading}
                onClick={async () => {
                  if (!roadmapData) return;
                  try {
                    setRegenLoading(true);
                    const { data } = await api.post('/explain_roadmap', { roadmap: roadmapData });
                    setNarrative(data.narrative);
                    setProjectIdeas(data.project_ideas || []);
                    toast.success('Narrative regenerated');
                  } catch {
                    toast.error('Failed to regenerate');
                  } finally {
                    setRegenLoading(false);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-semibold text-white transition ${regenLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {regenLoading ? 'Regenerating...' : 'Regenerate narrative'}
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed mb-6">{narrative}</p>
            {projectIdeas?.length ? (
              <div>
                <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛠️</span> Micro-project Ideas
                </h4>
                <ul className="list-disc list-inside text-gray-200 space-y-1">
                  {projectIdeas.slice(0, 3).map((idea, idx) => (
                    <li key={idx}>{idea}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Toasts */}
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar theme="colored" />

        {/* Learning Phases - Detailed View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h3 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <span className="text-4xl">📚</span> Your Personalized Roadmap
              </h3>
              <p className="text-gray-400 text-sm">Step-by-step learning path tailored to your goals</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
                {role || 'Backend'}
              </button>
              <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg font-semibold text-sm hover:bg-white/20 transition">
                Data Science
              </button>
            </div>
          </div>
          {roadmapData?.phases && roadmapData.phases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-max">
              {roadmapData.phases.map((phase, idx) => (
                <DetailedPhaseCard 
                  key={idx} 
                  phase={phase} 
                  index={idx} 
                  isUnlocked={idx === 0 || idx <= (selectedPhase || 0)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-white/10">
              <p className="text-gray-400 text-lg mb-4">No roadmap found</p>
              <button
                onClick={() => navigate('/generate')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Generate Your Roadmap
              </button>
            </div>
          )}
        </motion.div>

        {/* Recommended Courses with Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          id="courses"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <motion.span
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-4xl"
                >
                  🎓
                </motion.span>
                {t('Recommended Courses')}
              </h3>
              <p className="text-gray-400 text-sm">Curated learning paths from top platforms</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
            >
              {t('View All Courses')}
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coursesToDisplay.map((course, idx) => {
              const gradients = [
                'from-cyan-600 via-blue-600 to-indigo-600',
                'from-purple-600 via-pink-600 to-rose-600',
                'from-orange-600 via-red-600 to-pink-600',
                'from-emerald-600 via-teal-600 to-cyan-600',
                'from-yellow-600 via-amber-600 to-orange-600',
                'from-pink-600 via-rose-600 to-red-600',
                'from-indigo-600 via-violet-600 to-purple-600',
                'from-teal-600 via-cyan-600 to-sky-600'
              ];

              const handleCourseClick = () => {
                if (course.url) {
                  window.open(course.url, '_blank', 'noopener,noreferrer');
                }
              };
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  onClick={handleCourseClick}
                  className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer"
                >
                  {/* Course Image */}
                  <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${gradients[idx % gradients.length]}`}>
                    {course.image ? (
                      <>
                        <motion.img 
                          src={course.image} 
                          alt={course.title}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">📚</span>
                      </div>
                    )}
                    
                    {/* Provider Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                      {course.provider}
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                      ⭐ {course.rating || 4.5}
                    </div>
                    
                    {/* Level Badge */}
                    {course.level && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold">
                        {course.level}
                      </div>
                    )}
                    
                    {/* Play Button */}
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-4 right-4 w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white text-xl cursor-pointer border-2 border-white/50 shadow-xl"
                    >
                      ▶️
                    </motion.div>
                  </div>
                  
                  {/* Course Info */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all">
                      {course.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-300 mb-5">
                      <span className="flex items-center gap-1">⏱️ {course.duration_hours || course.duration || 0}h</span>
                      {course.reviews && <span className="flex items-center gap-1">👥 {course.reviews}</span>}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 bg-gradient-to-r ${gradients[idx]} text-white rounded-2xl font-semibold shadow-lg transition-all`}
                    >
                      {t('Enroll Now')} →
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          id="achievements"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/20 shadow-2xl mb-8"
        >
          <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'First Resume Analyzed', 
                description: 'Successfully analyzed your first resume',
                icon: '📄',
                unlocked: currentSkills.length > 0,
                date: 'Dec 20, 2024'
              },
              { 
                title: 'Roadmap Creator', 
                description: 'Generated your first career roadmap',
                icon: '🗺️',
                unlocked: roadmapData?.phases?.length > 0,
                date: 'Dec 20, 2024'
              },
              { 
                title: 'Skill Explorer', 
                description: `Identified ${currentSkills.length} skills from your resume`,
                icon: '🎯',
                unlocked: currentSkills.length >= 5,
                date: 'Dec 20, 2024'
              },
              { 
                title: 'Market Researcher', 
                description: 'Explored market insights and trends',
                icon: '📊',
                unlocked: trendsData?.trending_skills?.length > 0,
                date: 'Dec 21, 2024'
              },
              { 
                title: 'Course Seeker', 
                description: 'Viewed recommended learning courses',
                icon: '📚',
                unlocked: true,
                date: 'Dec 22, 2024'
              },
              { 
                title: 'Goal Setter', 
                description: `Targeting ${role} role`,
                icon: '🎓',
                unlocked: role !== 'Frontend Developer',
                date: 'Dec 22, 2024'
              },
            ].map((achievement, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative bg-gradient-to-br ${achievement.unlocked ? 'from-amber-500/20 to-orange-500/20 border-amber-500/40' : 'from-gray-500/20 to-gray-600/20 border-gray-500/30'} backdrop-blur-sm rounded-2xl p-6 border-2 transition-all`}
              >
                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🔒</span>
                  </div>
                )}
                <div className={`text-5xl mb-4 ${!achievement.unlocked ? 'grayscale opacity-50' : ''}`}>
                  {achievement.icon}
                </div>
                <h4 className={`text-xl font-bold mb-2 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <span>✓</span>
                    <span>Unlocked {achievement.date}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
