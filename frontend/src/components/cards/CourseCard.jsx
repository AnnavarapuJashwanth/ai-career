import React, { useState, useEffect } from 'react';
import { PlayArrow, Schedule, Star, OpenInNew, CheckCircle, Circle } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function CourseCard({ course, onEnroll, phaseType }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if course is already completed
  useEffect(() => {
    checkCompletionStatus();
  }, [course.title]);

  const checkCompletionStatus = async () => {
    try {
      const response = await api.get('/progress/status');
      const completedCourses = response.data.completed_courses || [];
      setIsCompleted(completedCourses.includes(course.title));
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  };

  const handleViewCourse = () => {
    if (course.url) {
      window.open(course.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (isCompleted) {
        // Uncomplete the course
        await api.post('/progress/uncomplete', {
          course_title: course.title,
          phase: phaseType || 'foundation'
        });
        setIsCompleted(false);
        toast.info('Course unmarked as complete');
      } else {
        // Mark as complete
        await api.post('/progress/mark-complete', {
          course_title: course.title,
          phase: phaseType || 'foundation'
        });
        setIsCompleted(true);
        toast.success('🎉 Course marked as complete!');
      }
    } catch (error) {
      toast.error('Failed to update progress');
      console.error('Error updating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white hover:shadow-xl transition transform hover:-translate-y-2 relative">
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 z-10 bg-green-500 text-white p-2 rounded-full shadow-lg animate-pulse">
          <CheckCircle style={{ fontSize: 24 }} />
        </div>
      )}

      {/* Course Image */}
      <div 
        className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative overflow-hidden cursor-pointer"
        onClick={handleViewCourse}
        style={course.image ? {
          backgroundImage: `url(${course.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {!course.image && <PlayArrow style={{ fontSize: 48 }} className="text-white" />}
        {course.level && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {course.level}
          </div>
        )}
        {course.provider && (
          <div className="absolute bottom-2 left-2 bg-white/90 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
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

        {/* Rating and Actions */}
        <div className="flex items-center justify-between pt-4 border-t gap-2">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500" style={{ fontSize: 18 }} />
            <span className="font-semibold text-gray-900">{course.rating || 4.5}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mark as Complete Button */}
            <button
              onClick={handleToggleComplete}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                isCompleted
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle style={{ fontSize: 16 }} />
                  <span className="hidden sm:inline">Done</span>
                </>
              ) : (
                <>
                  <Circle style={{ fontSize: 16 }} />
                  <span className="hidden sm:inline">Mark Complete</span>
                </>
              )}
            </button>

            {/* View Course Button */}
            <button
              onClick={handleViewCourse}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
            >
              <span className="hidden sm:inline">View</span>
              <OpenInNew style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

