import React from 'react';
import { PlayArrow, Schedule, Star, OpenInNew } from '@mui/icons-material';

export default function CourseCard({ course, onEnroll }) {
  const handleViewCourse = () => {
    if (course.url) {
      window.open(course.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
      {/* Course Image */}
      <div 
        className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden"
        style={course.image ? {
          backgroundImage: `url(${course.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {!course.image && <PlayArrow style={{ fontSize: 48 }} className="text-white" />}
        {course.level && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {course.level}
          </div>
        )}
        {course.provider && (
          <div className="absolute top-2 left-2 bg-white/90 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
            {course.provider}
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">{course.title}</h3>
        
        {/* Skills Tags */}
        {course.skills && course.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Schedule style={{ fontSize: 16 }} />
            <span>{course.duration_hours || course.duration} hours</span>
          </div>
        </div>

        {/* Rating and Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500" style={{ fontSize: 18 }} />
            <span className="font-semibold text-gray-900">{course.rating || 4.5}</span>
          </div>
          <button
            onClick={handleViewCourse}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
          >
            View Course <OpenInNew style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

