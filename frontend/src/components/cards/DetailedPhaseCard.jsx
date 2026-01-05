import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, School, Code, OpenInNew, Lock } from '@mui/icons-material';
import TechLogo from '../common/TechLogo';


export default function DetailedPhaseCard({ phase, index, isUnlocked = true }) {
  const colorSchemes = {
    0: { bg: 'from-blue-500 to-indigo-600', text: 'text-blue-500', border: 'border-blue-500/30', light: 'bg-blue-500/10' },
    1: { bg: 'from-purple-500 to-pink-600', text: 'text-purple-500', border: 'border-purple-500/30', light: 'bg-purple-500/10' },
    2: { bg: 'from-pink-500 to-rose-600', text: 'text-pink-500', border: 'border-pink-500/30', light: 'bg-pink-500/10' }
  };

  const colors = colorSchemes[index % 3];


  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 ${colors.border} overflow-hidden ${!isUnlocked ? 'opacity-60' : ''} h-full flex flex-col`}
    >
      {/* Phase Header */}
      <div className={`bg-gradient-to-r ${colors.bg} p-4 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isUnlocked ? (
              <CheckCircle style={{ fontSize: 28 }} className="text-white" />
            ) : (
              <Lock style={{ fontSize: 28 }} className="text-white/70" />
            )}
            <div>
              <h3 className="text-2xl font-bold text-white">{phase.name}</h3>
              <p className="text-white/90 text-sm">{phase.duration}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/80 mb-1">Duration</div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-white font-semibold text-sm">
              {phase.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
        {/* Skills to Learn - Clickable for YouTube courses */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code style={{ fontSize: 20 }} className={colors.text} />
            <h4 className="font-bold text-white">Key Skills</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {phase.skills?.map((skill, idx) => {
              const openYouTubeCourse = () => {
                const searchQuery = encodeURIComponent(`${skill} full course tutorial`);
                const youtubeURL = `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIQAw%253D%253D`;
                window.open(youtubeURL, '_blank', 'noopener,noreferrer');
              };

              return (
                <motion.button
                  key={idx}
                  onClick={openYouTubeCourse}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-2 ${colors.light} ${colors.text} rounded-lg text-sm font-medium border ${colors.border} hover:border-white/40 transition-all cursor-pointer`}
                  title={`Click to find ${skill} full courses on YouTube`}
                >
                  <TechLogo name={skill} size={24} />
                  <span>{skill}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Learning Resources */}
        {phase.resources && phase.resources.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <School style={{ fontSize: 20 }} className={colors.text} />
              <h4 className="font-bold text-white">Learning Resources</h4>
            </div>
            <div className="space-y-3">
              {phase.resources.slice(0, 4).map((resource, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 ${colors.light} ${colors.text} rounded text-xs font-semibold uppercase`}>
                        {resource.type}
                      </span>
                      <span className="text-xs text-gray-400">{resource.provider}</span>
                    </div>
                    <h5 className="text-white font-medium text-sm group-hover:text-blue-400 transition">
                      {resource.title}
                    </h5>
                    {resource.duration_hours && (
                      <p className="text-xs text-gray-400 mt-1">{resource.duration_hours}h learning time</p>
                    )}
                  </div>
                  <OpenInNew style={{ fontSize: 16 }} className="text-gray-400 group-hover:text-blue-400 transition" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Start Learning Button */}
        {isUnlocked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 bg-gradient-to-r ${colors.bg} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all`}
          >
            ▶ Start Learning
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
