import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  School, 
  Assessment, 
  Timeline, 
  TrackChanges, 
  Psychology 
} from '@mui/icons-material';

export default function Features() {
  const features = [
    {
      icon: <Assessment className="text-5xl" />,
      title: 'Skill Gap Analysis',
      description: 'AI-powered analysis comparing your current skills with market demands for your target role.',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      shadow: 'shadow-blue-500/50'
    },
    {
      icon: <TrendingUp className="text-5xl" />,
      title: 'Live Market Insights',
      description: 'Real-time data on trending skills, salary ranges, and job demand across industries.',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100',
      shadow: 'shadow-purple-500/50'
    },
    {
      icon: <School className="text-5xl" />,
      title: 'Tailored Curriculum',
      description: 'Personalized learning paths with courses, certifications, and micro-projects.',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-gradient-to-br from-orange-100 to-red-100',
      shadow: 'shadow-orange-500/50'
    },
    {
      icon: <Timeline className="text-5xl" />,
      title: 'Visual Career Roadmap',
      description: '3D interactive roadmap showing your learning journey from beginner to expert.',
      gradient: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      shadow: 'shadow-emerald-500/50'
    },
    {
      icon: <TrackChanges className="text-5xl" />,
      title: 'Progress Tracking',
      description: 'Monitor your skill development with detailed analytics and milestone achievements.',
      gradient: 'from-indigo-500 to-blue-500',
      iconBg: 'bg-gradient-to-br from-indigo-100 to-blue-100',
      shadow: 'shadow-indigo-500/50'
    },
    {
      icon: <Psychology className="text-5xl" />,
      title: 'AI Career Mentor',
      description: 'Get personalized career advice and recommendations powered by advanced AI.',
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-pink-100 to-rose-100',
      shadow: 'shadow-pink-500/50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              Powerful Features for Your Career Growth
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Everything you need to transform your career journey with AI-powered insights and personalized learning paths
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/50 ${feature.shadow} shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`relative w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className={`text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${feature.gradient} transition-all`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="absolute bottom-8 right-8 text-3xl"
                >
                  →
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your personalized learning journey today with AI-powered career guidance
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/generate"
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/demo"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all"
              >
                View Demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
