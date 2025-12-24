import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function CoursesPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('careerai_user') || '{"email":"sravanthivarikuti233@gmail.com","name":"Sravanthivarikuti"}');
  
  const handleSignOut = () => {
    localStorage.removeItem('careerai_logged_in');
    navigate('/login');
  };

  const courses = [
    {
      title: 'Machine Learning A-Z™',
      description: 'Master ML algorithms, data science and Python',
      instructor: 'Kirill Eremenko',
      duration: '44 hours',
      rating: 4.5,
      reviews: '1.25K',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      provider: 'Udemy',
      level: 'Beginner',
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600'
    },
    {
      title: 'Deep Learning Specialization',
      description: 'Master deep learning and neural networks',
      instructor: 'Andrew Ng',
      duration: '100 hours',
      rating: 4.9,
      reviews: '2.5K',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      provider: 'Coursera',
      level: 'Intermediate',
      gradient: 'from-purple-600 via-pink-600 to-rose-600'
    },
    {
      title: 'SQL for Data Analysis',
      description: 'Advanced SQL queries and database management',
      instructor: 'Maven Analytics',
      duration: '12 hours',
      rating: 4.7,
      reviews: '890',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
      provider: 'DataCamp',
      level: 'Beginner',
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    },
    {
      title: 'TensorFlow for Everyone',
      description: 'Deploy ML models with TensorFlow',
      instructor: 'TensorFlow Team',
      duration: '20 hours',
      rating: 4.6,
      reviews: '1.1K',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      provider: 'edX',
      level: 'Intermediate',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600'
    },
    {
      title: 'Python for Data Science',
      description: 'Complete Python programming for data analysis',
      instructor: 'Jose Portilla',
      duration: '25 hours',
      rating: 4.8,
      reviews: '3.2K',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop',
      provider: 'Udemy',
      level: 'Beginner',
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    },
    {
      title: 'AWS Cloud Practitioner',
      description: 'Master cloud computing with AWS',
      instructor: 'Stephane Maarek',
      duration: '18 hours',
      rating: 4.7,
      reviews: '2.8K',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      provider: 'Udemy',
      level: 'Beginner',
      gradient: 'from-yellow-600 via-orange-600 to-red-600'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/5 w-[700px] h-[700px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-15 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 50, 0],
            x: [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/5 w-[600px] h-[600px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-15 blur-3xl"
        />
      </div>

      <Sidebar user={user} onSignOut={handleSignOut} />
      <main className="relative z-10 flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-transparent bg-clip-text flex items-center gap-4 mb-3">
            <span className="text-6xl">🎓</span>
            My Learning Courses
          </h1>
          <p className="text-gray-400 text-lg">Curated courses tailored to your career roadmap</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 mb-8 flex-wrap"
        >
          {['All Courses', 'In Progress', 'Completed', 'Bookmarked'].map((tab, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                idx === 0 
                  ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 backdrop-blur-xl text-gray-300 border border-white/20 hover:bg-white/20'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Enrolled', value: '6', icon: '📚', color: 'from-blue-500 to-cyan-500' },
            { label: 'In Progress', value: '3', icon: '📖', color: 'from-purple-500 to-pink-500' },
            { label: 'Completed', value: '2', icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: 'Hours Learned', value: '127', icon: '⏱️', color: 'from-orange-500 to-red-500' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              {/* Course Image */}
              <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${course.gradient}`}>
                <motion.img 
                  src={course.image} 
                  alt={course.title}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Provider & Level Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                    {course.provider}
                  </div>
                  <div className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                    {course.level}
                  </div>
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                  ⭐ {course.rating}
                </div>
                
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
                <h4 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all">
                  {course.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                <p className="text-cyan-300 text-sm mb-4 flex items-center gap-2">
                  <span className="text-base">👨‍🏫</span>
                  {course.instructor}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-300 mb-5">
                  <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                  <span className="flex items-center gap-1">👥 {course.reviews}</span>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-3 bg-gradient-to-r ${course.gradient} text-white rounded-2xl font-semibold shadow-lg transition-all`}
                  >
                    Continue →
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all"
                  >
                    🔖
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
