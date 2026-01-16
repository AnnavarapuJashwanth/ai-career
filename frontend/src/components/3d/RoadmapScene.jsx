import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TechLogo from '../common/TechLogo';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { useAnimationSettings } from '../../utils/mobileDetect';



// SVG path for a curvy roadmap built from sampled points so milestones sit exactly on the road




function RoadPath({ width = 2600, height = 900, isMobile = false }) {
  // Adjust for mobile: smaller amplitude and different positioning
  const baseY = isMobile ? height - 200 : height - 340;
  const amp = isMobile ? 120 : 220;
  const points = [];
  const segments = isMobile ? 60 : 120;
  const marginX = isMobile ? 60 : 180;
  
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = marginX + t * (width - marginX * 2);
    const y = baseY - amp * Math.sin(Math.PI * t);
    points.push(`${x},${y}`);
  }
  const d = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');

  return (
    <svg width={width} height={height} className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* Dark base road with stronger outline */}
      <path d={d} stroke="#1e293b" strokeWidth={isMobile ? 12 : 18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      {/* White dashed center line with animation */}
      <path d={d} stroke="#ffffff" strokeWidth={isMobile ? 4 : 6} fill="none" strokeDasharray={isMobile ? "12 10" : "20 15"} className="dash-animate" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glowing line for premium effect */}
      <path d={d} stroke="url(#roadGradient)" strokeWidth={isMobile ? 2 : 3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      
      <defs>
        <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const SKILL_BADGE_META = {
  HTML: {
    label: 'HTML',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  CSS: {
    label: 'CSS',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  JavaScript: {
    label: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  Git: {
    label: 'Git',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
  'Responsive Design': {
    label: 'Responsive Design',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  React: {
    label: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  'Node.js': {
    label: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  SQL: {
    label: 'SQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  },
  'REST APIs': {
    label: 'REST APIs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  TypeScript: {
    label: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  'System Design': {
    label: 'System Design',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  'Cloud (AWS/Azure)': {
    label: 'Cloud',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  },
  DevOps: {
    label: 'DevOps',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  Microservices: {
    label: 'Microservices',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  },
  Docker: {
    label: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
};

export default function RoadmapScene({ phases = [] }) {
  const [completedSkills, setCompletedSkills] = useState([]);
  const [loading, setLoading] = useState({});

  useEffect(() => {
    fetchCompletedSkills();
  }, []);

  const fetchCompletedSkills = async () => {
    try {
      const response = await api.get('/progress/status');
      // Backend stores as "phase_skillname", extract just the skill names
      const completed = (response.data.completed_courses || []).map(course => {
        // Split "foundation_TypeScript" -> "TypeScript"
        const parts = course.split('_');
        return parts.slice(1).join('_'); // Handle skills with underscores
      });
      setCompletedSkills(completed);
    } catch (error) {
      console.error('Error fetching completed skills:', error);
    }
  };

  const handleToggleSkill = async (skill, phaseName, phaseSkills = []) => {
    setLoading(prev => ({ ...prev, [skill]: true }));
    
    try {
      const isCompleted = completedSkills.includes(skill);
      
      // Convert phase name to lowercase (Foundation -> foundation)
      const phaseType = phaseName.toLowerCase();
      
      // Calculate total skills in this phase
      const phase_total = phaseSkills.length || 1;
      
      if (isCompleted) {
        await api.post('/progress/uncomplete', {
          course_title: skill,
          phase: phaseType,
          phase_total
        });
        setCompletedSkills(prev => prev.filter(s => s !== skill));
        toast.info(`✓ ${skill} unmarked from ${phaseName}`, {
          autoClose: 2000
        });
      } else {
        await api.post('/progress/mark-complete', {
          course_title: skill,
          phase: phaseType,
          phase_total
        });
        setCompletedSkills(prev => [...prev, skill]);
        toast.success(`🎉 ${skill} completed in ${phaseName}!`, {
          autoClose: 2000
        });
      }
      
      // Refresh completed skills list
      fetchCompletedSkills();
      
      // Notify Progress Tracker to update
      window.dispatchEvent(new Event('progressUpdated'));
    } catch (error) {
      toast.error('Failed to update');
      console.error('Error toggling skill:', error);
    } finally {
      setLoading(prev => ({ ...prev, [skill]: false }));
    }
  };
  // Debug: Log phases to see if skills are included
  console.log('RoadmapScene received phases:', JSON.stringify(phases, null, 2));
  
  // Get animation settings for mobile optimization
  const animSettings = useAnimationSettings();
  const isMobile = animSettings.reduceMotion;
  
  // Responsive dimensions
  const width = isMobile ? 800 : 2200;
  const height = isMobile ? 500 : 800;
  const baseY = isMobile ? height - 200 : height - 340;
  const amp = isMobile ? 120 : 220;
  const marginX = isMobile ? 60 : 180;
  
  const getPoint = t => {
    const x = marginX + t * (width - marginX * 2);
    const y = baseY - amp * Math.sin(Math.PI * t);
    return { x, y };
  };

  const pinColors = [
    { bg: 'from-pink-400 via-pink-500 to-pink-600', ring: 'ring-pink-200/50', text: 'text-white' },
    { bg: 'from-orange-400 via-orange-500 to-orange-600', ring: 'ring-orange-200/50', text: 'text-white' },
    { bg: 'from-cyan-400 via-cyan-500 to-cyan-600', ring: 'ring-cyan-200/50', text: 'text-white' },
  ];

  // Floating orbs with animation (unchanged)
  const floatingOrbs = [
    { size: 'w-64 h-64', color: 'bg-blue-400/30', blur: 'blur-3xl', x: '10%', y: '15%', delay: 0 },
    { size: 'w-80 h-80', color: 'bg-purple-400/25', blur: 'blur-3xl', x: '80%', y: '20%', delay: 2 },
    { size: 'w-72 h-72', color: 'bg-pink-400/20', blur: 'blur-3xl', x: '50%', y: '60%', delay: 4 },
    { size: 'w-56 h-56', color: 'bg-indigo-400/25', blur: 'blur-3xl', x: '20%', y: '70%', delay: 1 },
    { size: 'w-60 h-60', color: 'bg-cyan-400/20', blur: 'blur-3xl', x: '75%', y: '75%', delay: 3 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-[1150px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] 
                 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 
                 p-4 sm:p-6 md:p-8 lg:p-12 relative border-2 border-white/60 backdrop-blur-xl" 
      style={{ minHeight: isMobile ? '400px' : `${height}px` }}
    >


      {/* Animated gradient mesh background - Disabled on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 animate-pulse" style={{ animationDuration: '8s' }}></div>
        </div>
      )}

      {/* Floating animated orbs - Disabled on mobile */}
      {!isMobile && floatingOrbs.map((orb, idx) => (
        <motion.div
          key={idx}
          className={`absolute ${orb.size} ${orb.color} ${orb.blur} rounded-full pointer-events-none`}
          style={{ left: orb.x, top: orb.y }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent pointer-events-none backdrop-blur-sm"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Shimmering light effect - Disabled on mobile */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 5,
          }}
        />
      )}
      
      <div className="w-full h-full relative overflow-x-auto" style={{ minHeight: isMobile ? '400px' : `${height}px` }}>
        <RoadPath width={width} height={height} isMobile={isMobile} />
        {/* Milestones */}
        {phases.map((phase, idx) => {
          const t = phases.length === 1 ? 0.5 : idx / (phases.length - 1);
          const { x, y } = getPoint(t);
          const colorScheme = pinColors[idx] || pinColors[0];
          
          return (
            <div
              key={idx}
              className="absolute flex flex-col items-center z-10 group"
              style={{ 
                left: `calc(${(x / width) * 100}% - ${isMobile ? '60' : '90'}px)`, 
                top: `${y - (isMobile ? 100 : 140)}px`,
                width: isMobile ? '120px' : '180px'
              }}
            >
              {/* Phase name above pin */}
              <div className={`mb-2 sm:mb-3 text-gray-800 ${isMobile ? 'text-sm' : 'text-xl'} font-black text-center drop-shadow-sm`}>
                {phase.name}
              </div>

              {/* Location Pin Marker - Responsive Size */}
              <div className="relative">
                {/* Outer circle */}
                <div className={`${isMobile ? 'w-[60px] h-[60px]' : 'w-[90px] h-[90px]'} rounded-full bg-gradient-to-br ${colorScheme.bg} flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] ${isMobile ? 'border-[3px]' : 'border-[5px]'} border-white ${isMobile ? 'ring-2' : 'ring-4'} ${colorScheme.ring} relative`}>
                  {/* Inner white circle */}
                  <div className={`${isMobile ? 'w-[34px] h-[34px]' : 'w-[50px] h-[50px]'} rounded-full bg-white flex items-center justify-center shadow-inner`}>
                    <div className={`${isMobile ? 'w-[24px] h-[24px]' : 'w-[35px] h-[35px]'} rounded-full bg-gradient-to-br ${colorScheme.bg}`}></div>
                  </div>
                </div>
                {/* Pin point triangle - Responsive Size */}
                <div className={`absolute left-1/2 ${isMobile ? '-bottom-2' : '-bottom-4'} -translate-x-1/2 w-0 h-0 ${isMobile ? 'border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px]' : 'border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px]'} bg-gradient-to-br ${colorScheme.bg}`} style={{ borderTopColor: 'inherit' }}>
                  <div className={`absolute ${isMobile ? '-top-3.5' : '-top-5'} left-1/2 -translate-x-1/2 w-0 h-0 ${isMobile ? 'border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px]' : 'border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px]'} bg-gradient-to-br ${colorScheme.bg}`} style={{ filter: `hue-rotate(${idx * 30}deg)` }}></div>
                </div>
              </div>
              
              {/* Year/Duration label below pin - Responsive Size */}
              <div className={`${isMobile ? 'mt-4 text-xs px-3 py-1.5' : 'mt-8 text-base px-5 py-2.5'} text-white font-black text-center bg-gray-800 backdrop-blur-sm rounded-2xl border-2 border-gray-700 shadow-xl ${isMobile ? 'min-w-[80px]' : 'min-w-[120px]'}`}>
                {phase.duration}
              </div>
              
              {/* Skill badges below - Responsive Layout */}
              {phase.skills && phase.skills.length > 0 ? (
                <div className={`${isMobile ? 'mt-3' : 'mt-6'} flex flex-wrap justify-center gap-1.5 sm:gap-2 ${isMobile ? 'w-[140px]' : 'w-[220px]'}`}>
                  {phase.skills.map((skill, skillIdx) => {
                    const isCompleted = completedSkills.includes(skill);
                    const isLoading = loading[skill];

                    // Function to search YouTube for full course
                    const openYouTubeCourse = () => {
                      const searchQuery = encodeURIComponent(`${skill} full course tutorial`);
                      const youtubeURL = `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIQAw%253D%253D`;
                      window.open(youtubeURL, '_blank', 'noopener,noreferrer');
                    };

                    return (
                      <div key={skillIdx} className="relative group/skill">
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 + skillIdx * 0.05 }}
                          {...(animSettings.enableHoverEffects ? {
                            whileHover: { scale: 1.1 },
                            whileTap: { scale: 0.95 }
                          } : {})}
                          onClick={openYouTubeCourse}
                          className={`flex items-center gap-1 ${isMobile ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'} rounded-lg font-bold shadow-lg border-2 transition-all backdrop-blur-sm cursor-pointer ${
                            isCompleted 
                              ? 'bg-green-500 text-white border-green-600 hover:border-green-400' 
                              : 'bg-white text-gray-900 border-gray-300 hover:border-blue-400'
                          } hover:shadow-xl`}
                          title={`Click to find ${skill} full courses on YouTube`}
                        >
                          <TechLogo name={skill} size={isMobile ? 14 : 18} />
                          <span className="whitespace-nowrap">{skill}</span>
                        </motion.button>
                        
                        {/* Mark as Complete Checkbox - Responsive Size */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSkill(skill, phase.name, phase.skills || []);
                          }}
                          disabled={isLoading}
                          {...(animSettings.enableHoverEffects ? {
                            whileHover: { scale: 1.2 },
                            whileTap: { scale: 0.9 }
                          } : {})}
                          className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-2 -right-2'} z-20 rounded-full bg-white shadow-lg border-2 ${
                            isCompleted ? 'border-green-500' : 'border-gray-300'
                          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} hover:shadow-xl transition-all`}
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isCompleted ? (
                            <CheckCircle style={{ fontSize: isMobile ? 16 : 20 }} className="text-green-500" />
                          ) : (
                            <RadioButtonUnchecked style={{ fontSize: isMobile ? 16 : 20 }} className="text-gray-400" />
                          )}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`mt-3 sm:mt-6 ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 italic`}>No skills data</div>
              )}
            </div>
          );
        })}
        {/* Roadmap Title - Responsive */}
        <div className={`absolute left-1/2 ${isMobile ? 'top-2' : 'top-6'} -translate-x-1/2 text-gray-800 ${isMobile ? 'text-xl' : 'text-3xl md:text-4xl'} font-black drop-shadow-sm`}>
          Career Roadmap
        </div>
      </div>
    </motion.div>
  );
}
