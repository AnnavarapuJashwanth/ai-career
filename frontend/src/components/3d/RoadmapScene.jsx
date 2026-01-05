import React from 'react';
import { motion } from 'framer-motion';
import TechLogo from '../common/TechLogo';



// SVG path for a curvy roadmap built from sampled points so milestones sit exactly on the road




function RoadPath({ width = 2600, height = 900 }) {
  // MOVED ROAD UP: lower baseY value makes the road sit higher (closer to title)
  const baseY = height - 340; // previously height - 240 (moved up by 100)
  const amp = 220; // slightly larger amplitude for wider canvas
  const points = [];
  const segments = 120;
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    // INCREASED LEFT/RIGHT MARGINS proportionally for the wider canvas
    const x = 180 + t * (width - 360);
    const y = baseY - amp * Math.sin(Math.PI * t);
    points.push(`${x},${y}`);
  }
  const d = `M ${points[0]} ` + points.slice(1).map(p => `L ${p}`).join(' ');

  return (
    <svg width={width} height={height} className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* Dark base road with stronger outline */}
      <path d={d} stroke="#1e293b" strokeWidth={18} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      {/* White dashed center line with animation */}
      <path d={d} stroke="#ffffff" strokeWidth={6} fill="none" strokeDasharray="20 15" className="dash-animate" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glowing line for premium effect */}
      <path d={d} stroke="url(#roadGradient)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      
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
  // Debug: Log phases to see if skills are included
  console.log('RoadmapScene received phases:', JSON.stringify(phases, null, 2));
  
  // Milestone positions along the curve (simple even spread for now)
  const width = 2200;             // INCREASED width
  const height = 800;            // keep taller canvas so badges fit
  const baseY = height - 340;    // moved road up
  const amp = 220;               // slightly larger amplitude
  const getPoint = t => {
    const x = 180 + t * (width - 360); // keep margins proportional with new width
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
      className="w-[1150px] mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] 
                 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 
                 p-8 md:p-12 relative border-2 border-white/60 backdrop-blur-xl" 
      style={{ minHeight: height }}
    >


      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-60 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      {/* Floating animated orbs */}
      {floatingOrbs.map((orb, idx) => (
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

      {/* Shimmering light effect */}
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
      
      <div className="w-full h-full relative" style={{ minHeight: height }}>
        <RoadPath width={width} height={height} />
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
                left: `calc(${(x / width) * 100}% - 90px)`, 
                top: `${y - 140}px`, // keep badges inside canvas after road moved up
                width: '180px'
              }}
            >
              {/* Phase name above pin */}
              <div className="mb-3 text-gray-800 text-xl font-black text-center drop-shadow-sm">
                {phase.name}
              </div>

              {/* Location Pin Marker like timeline image */}
              <div className="relative">
                {/* Outer circle */}
                <div className={`w-[90px] h-[90px] rounded-full bg-gradient-to-br ${colorScheme.bg} flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-[5px] border-white ring-4 ${colorScheme.ring} relative`}>
                  {/* Inner white circle */}
                  <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shadow-inner">
                    <div className={`w-[35px] h-[35px] rounded-full bg-gradient-to-br ${colorScheme.bg}`}></div>
                  </div>
                </div>
                {/* Pin point triangle */}
                <div className={`absolute left-1/2 -bottom-4 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] bg-gradient-to-br ${colorScheme.bg}`} style={{ borderTopColor: 'inherit' }}>
                  <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] bg-gradient-to-br ${colorScheme.bg}`} style={{ filter: `hue-rotate(${idx * 30}deg)` }}></div>
                </div>
              </div>
              
              {/* Year/Duration label below pin */}
              <div className="mt-8 text-white text-base font-black text-center bg-gray-800 backdrop-blur-sm px-5 py-2.5 rounded-2xl border-2 border-gray-700 shadow-xl min-w-[120px]">
                {phase.duration}
              </div>
              
              {/* Skill badges below - show ALL skills from phase - CLICKABLE for YouTube courses */}
              {phase.skills && phase.skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2 w-[220px]">
                  {phase.skills.map((skill, skillIdx) => {
                    // Function to search YouTube for full course
                    const openYouTubeCourse = () => {
                      const searchQuery = encodeURIComponent(`${skill} full course tutorial`);
                      const youtubeURL = `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIQAw%253D%253D`;
                      window.open(youtubeURL, '_blank', 'noopener,noreferrer');
                    };

                    return (
                      <motion.button
                        key={skillIdx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 + skillIdx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openYouTubeCourse}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white text-xs font-bold text-gray-900 shadow-lg border-2 border-gray-300 hover:border-blue-400 hover:shadow-xl transition-all backdrop-blur-sm cursor-pointer"
                        title={`Click to find ${skill} full courses on YouTube`}
                      >
                        <TechLogo name={skill} size={18} />
                        <span className="whitespace-nowrap">{skill}</span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 text-xs text-gray-500 italic">No skills data</div>
              )}
            </div>
          );
        })}
        {/* Roadmap Title */}
        <div className="absolute left-1/2 top-6 -translate-x-1/2 text-gray-800 text-3xl md:text-4xl font-black drop-shadow-sm">
          Career Roadmap
        </div>
      </div>
    </motion.div>
  );
}
