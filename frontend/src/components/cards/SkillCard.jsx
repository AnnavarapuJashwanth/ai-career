import React from 'react';
import { getImportanceColor, getImportanceLabel } from '../../utils/format';

export default function SkillCard({ skill, importance = 0.7 }) {
  const openYouTubeCourse = () => {
    const searchQuery = encodeURIComponent(`${skill} full course tutorial`);
    const youtubeURL = `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIQAw%253D%253D`;
    window.open(youtubeURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={openYouTubeCourse}
      className="card-shadow bg-white hover:bg-blue-50 rounded-lg p-4 hover:shadow-xl transition-all transform hover:scale-105 w-full text-left cursor-pointer border-2 border-transparent hover:border-blue-400"
      title={`Click to find ${skill} full courses on YouTube`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{skill}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getImportanceColor(importance)}`}>
          {getImportanceLabel(importance)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${(importance || 0.5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-3">Importance Score</p>
    </button>
  );
}
