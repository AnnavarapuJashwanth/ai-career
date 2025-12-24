import React from 'react';
import { PlayArrow, Schedule, Person } from '@mui/icons-material';

export default function CourseCard({ course, onEnroll }) {
  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white hover:shadow-lg transition transform hover:-translate-y-1">
      {/* Course Image */}
      <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <PlayArrow style={{ fontSize: 48 }} className="text-white" />
      </div>

      {/* Course Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        {/* Metadata */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Person style={{ fontSize: 16 }} />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Schedule style={{ fontSize: 16 }} />
            <span>{course.duration} hours</span>
          </div>
        </div>

        {/* Rating and Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold text-gray-900">{course.rating || 4.5}</span>
            <span className="text-gray-500 text-xs">({course.reviews || 120})</span>
          </div>
          <button
            onClick={() => onEnroll?.(course)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
}
