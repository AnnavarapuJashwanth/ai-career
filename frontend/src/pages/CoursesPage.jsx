import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import AIChatbot from '../components/AIChatbot';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlayArrow, Schedule, Star, OpenInNew, School } from '@mui/icons-material';

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  
  // Get actual user from localStorage with proper fallback
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('careerai_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { email: 'user@example.com', name: 'User' };
  };
  
  const user = getUserData();

  useEffect(() => {
    fetchUserRoleAndCourses();
  }, []);

  const fetchUserRoleAndCourses = async () => {
    try {
      setLoading(true);
      // Get user's roadmap to find their role
      const roadmapResponse = await api.get('/roadmaps/latest');
      const role = roadmapResponse.data.target_role;
      setUserRole(role);
      
      // Fetch courses for that specific role
      const coursesResponse = await api.get(`/courses?role=${encodeURIComponent(role)}`);
      setCourses(coursesResponse.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback: fetch all courses if no roadmap found
      try {
        const coursesResponse = await api.get('/courses');
        setCourses(coursesResponse.data.courses || []);
      } catch (err) {
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title?.toLowerCase().includes(query) ||
      course.provider?.toLowerCase().includes(query) ||
      (course.skills && course.skills.some(skill => skill.toLowerCase().includes(query)))
    );
  });

  const handleViewCourse = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <School className="text-blue-600" style={{ fontSize: 48 }} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Learning Courses
              </h1>
              {userRole && (
                <p className="text-lg text-gray-600 mt-1">
                  Curated for <span className="font-semibold text-blue-600">{userRole}</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="🔍 Search courses by name, provider, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading courses...</p>
          </div>
        )}

        {/* Courses Grid with Scroll */}
        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            <AnimatePresence>
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={`${course.title}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100">
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <School style={{ fontSize: 64 }} className="text-white opacity-80" />
                        </div>
                      )}
                      
                      {/* Provider Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-lg">
                          {course.provider}
                        </span>
                      </div>
                      
                      {/* Level Badge */}
                      {course.level && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-blue-500/95 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                            {course.level}
                          </span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {course.rating && (
                        <div className="absolute bottom-3 right-3">
                          <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/95 backdrop-blur-sm rounded-full shadow-lg">
                            <Star className="text-white" style={{ fontSize: 14 }} />
                            <span className="text-xs font-bold text-white">{course.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight min-h-[56px]">
                        {course.title}
                      </h3>
                      
                      {/* Skills */}
                      {course.skills && course.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {course.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Schedule style={{ fontSize: 18 }} />
                        <span>{course.duration_hours || course.duration} hours</span>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleViewCourse(course.url)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <span>View Course</span>
                        <OpenInNew style={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <School style={{ fontSize: 80 }} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </motion.div>
        )}
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}
