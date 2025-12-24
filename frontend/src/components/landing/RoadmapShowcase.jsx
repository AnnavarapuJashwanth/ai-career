import React from 'react';
import { motion } from 'framer-motion';
import NeonRoadmap3D from '../3d/NeonRoadmap3D';

const samplePhases = [
  {
    id: 1,
    name: 'Foundation',
    duration: '0-3 months',
    skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'Responsive Design'],
  },
  {
    id: 2,
    name: 'Intermediate',
    duration: '3-6 months',
    skills: ['React', 'Node.js', 'SQL', 'REST APIs', 'TypeScript'],
  },
  {
    id: 3,
    name: 'Advanced',
    duration: '6-9 months',
    skills: ['System Design', 'Cloud (AWS/Azure)', 'DevOps', 'Microservices', 'Docker'],
  },
];

export default function RoadmapShowcase() {
  return (
    <section className="max-w-7xl mx-auto my-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 mb-4">
          Your Career Roadmap
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Follow a clear three-phase path from foundations to mastery. Each stop on the road corresponds to the detailed roadmap just below.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden card-shadow bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-700 p-6 md:p-8"
      >
        {/* Soft grid + glow background for career guidance feel */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.6),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.7),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/25 p-4 md:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.55)]">
          <NeonRoadmap3D phases={samplePhases} />
        </div>
      </motion.div>

      {/* Phase details cards below (textual explanation of the curve) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        {samplePhases.map((phase, index) => (
          <div
            key={phase.id}
            className="glassmorphism-card bg-white/95 border-2 border-white/50 rounded-2xl p-6 text-left shadow-2xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)] transition-all duration-300 backdrop-blur-xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                index === 0 ? 'from-cyan-400 to-sky-600' :
                index === 1 ? 'from-indigo-400 to-purple-600' :
                'from-fuchsia-500 to-pink-600'
              } flex items-center justify-center text-white font-extrabold text-3xl shadow-xl ${
                index === 0 ? 'shadow-cyan-500/50' :
                index === 1 ? 'shadow-purple-500/50' :
                'shadow-pink-500/50'
              } ring-4 ring-white/30 shrink-0`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">{phase.name}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  index === 0 ? 'text-cyan-600' :
                  index === 1 ? 'text-purple-600' :
                  'text-pink-600'
                }`}>{phase.duration}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {index === 0 && 'Build rock-solid web fundamentals with HTML, CSS, and JavaScript.'}
                  {index === 1 && 'Move into real-world app development using React, Node.js, and SQL backends.'}
                  {index === 2 && 'Level up into architecture, cloud, and DevOps for production systems.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {phase.skills.map((skill, i) => {
                const iconMap = {
                  'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                  'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                  'Responsive Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
                  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
                  'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                  'REST APIs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
                  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
                  'System Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
                  'Cloud (AWS/Azure)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
                  'DevOps': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
                  'Microservices': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
                  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
                };
                const icon = iconMap[skill];
                return (
                  <span
                    key={i}
                    className={`px-3 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
                      index === 0 ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 hover:bg-cyan-100' :
                      index === 1 ? 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100' :
                      'bg-pink-50 text-pink-800 border border-pink-200 hover:bg-pink-100'
                    }`}
                  >
                    {icon ? (
                      <img src={icon} alt={skill} className="w-5 h-5" />
                    ) : (
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-cyan-500' :
                        index === 1 ? 'bg-purple-500' :
                        'bg-pink-500'
                      } shadow-lg`} />
                    )}
                    <span>{skill}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
