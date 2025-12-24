import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CareerGuidanceCursor from '../components/CareerGuidanceCursor';
import StatsStrip from '../components/landing/StatsStrip';
import RoadmapShowcase from '../components/landing/RoadmapShowcase';
import BackgroundMesh from '../components/landing/BackgroundMesh';
import HeroParallax from '../components/landing/HeroParallax';
import Testimonials from '../components/landing/Testimonials';
import FeaturesOrbs from '../components/landing/FeaturesOrbs';
import PhaseTimeline from '../components/landing/PhaseTimeline';

// Landing sections below

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <CareerGuidanceCursor />
      <div className="relative min-h-screen bg-gradient-to-br from-white to-blue-50">
      <BackgroundMesh />
      <HeroParallax />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 text-center relative">
        <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1600&q=80')] bg-no-repeat bg-center bg-cover opacity-25 pointer-events-none" aria-hidden="true"></div>
        <div className="relative z-10">
          <div className="inline-block px-3 sm:px-4 py-1 mb-4 sm:mb-6 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold shadow-sm">AI-Powered Career Guidance V1.0</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 text-gray-900 px-2">
            Stop guessing your <span className="text-blue-700">career path.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Analyze market trends, identify skill gaps, and generate a personalized roadmap to reach your dream role—powered by advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <button
              type="button"
              onClick={() => navigate('/generate')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow transition flex items-center justify-center gap-2"
            >
              Generate Roadmap <span className="ml-2">→</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg border-2 border-gray-400 text-gray-900 bg-white hover:bg-gray-50 transition"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>
      {/* Problem Statement Section */}
      <section className="max-w-4xl mx-auto my-8 sm:my-12 bg-white/80 rounded-xl shadow p-6 sm:p-8 text-left mx-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-blue-700">Why CareerAI?</h2>
        <p className="mb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
          In today’s rapidly evolving job market, professionals struggle to identify which skills are most valuable and relevant to their career growth. The lack of clear guidance and structured upskilling plans often leads to wasted effort and missed opportunities. There is a need for an intelligent system that analyzes market trends and personal competencies to recommend tailored learning paths. An AI-driven platform can bridge this gap by generating personalized career roadmaps aligned with industry demand.
        </p>
      </section>
      <StatsStrip />
      {/* Features Section */}
      <section id="features" className="relative max-w-7xl mx-auto my-12 sm:my-16 lg:my-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4">
            AI-Powered Career Guidance Features
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Comprehensive tools to transform your career journey from uncertainty to clarity
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Background effects */}
          <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-5 rounded-3xl pointer-events-none blur-sm" aria-hidden="true"></div>
          <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-60 pointer-events-none">
            <FeaturesOrbs />
          </div>

          {/* Skill Gap Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="sm:w-12 sm:h-12"><circle cx="24" cy="24" r="20" fill="#3b82f6" opacity="0.2"/><circle cx="24" cy="24" r="10" stroke="#2563eb" strokeWidth="3"/><circle cx="24" cy="24" r="4" fill="#2563eb"/><path d="M24 14v-4M24 38v-4M14 24h-4M38 24h-4M33.9 33.9l-2.8-2.8M14.1 14.1l2.8 2.8M33.9 14.1l-2.8 2.8M14.1 33.9l2.8-2.8" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <h3 className="font-extrabold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">Skill Gap Analysis</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">Upload your resume and let AI identify exactly what skills you're missing for your target role with precision insights.</p>
          </motion.div>

          {/* Market Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 w-20 h-20 flex justify-center items-center bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#a855f7" opacity="0.2"/><rect x="14" y="22" width="5" height="12" rx="2.5" fill="#8b5cf6"/><rect x="21" y="16" width="5" height="18" rx="2.5" fill="#a855f7"/><rect x="28" y="19" width="5" height="15" rx="2.5" fill="#8b5cf6"/></svg>
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900">Live Market Insights</h3>
            <p className="text-gray-700 leading-relaxed">Real-time data on job demand, salary trends, and emerging technologies driving your industry forward.</p>
          </motion.div>

          {/* Tailored Curriculum */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 w-20 h-20 flex justify-center items-center bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#ec4899" opacity="0.2"/><rect x="12" y="14" width="24" height="18" rx="4" fill="#ec4899"/><rect x="16" y="20" width="16" height="4" rx="2" fill="#fff"/><path d="M16 14v-2a2 2 0 012-2h12a2 2 0 012 2v2" stroke="#ec4899" strokeWidth="2.5"/></svg>
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900">Tailored Curriculum</h3>
            <p className="text-gray-700 leading-relaxed">Get a phase-by-phase learning plan with specific courses, hands-on projects, and achievement milestones.</p>
          </motion.div>

          {/* Career Roadmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(14,165,233,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 w-20 h-20 flex justify-center items-center bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#06b6d4" opacity="0.2"/><path d="M24 12l4 10h-8l4-10z" fill="#0891b2"/><circle cx="24" cy="27" r="4" fill="#06b6d4"/><path d="M24 31v4" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900">Visual Career Roadmap</h3>
            <p className="text-gray-700 leading-relaxed">Interactive timeline showing your learning journey from foundation to mastery with clear milestones.</p>
          </motion.div>

          {/* Progress Tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(34,197,94,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 w-20 h-20 flex justify-center items-center bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#22c55e" opacity="0.2"/><path d="M16 24l6 6 12-12" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900">Progress Tracking</h3>
            <p className="text-gray-700 leading-relaxed">Monitor your skill development with interactive dashboards and celebrate achievements along the way.</p>
          </motion.div>

          {/* AI Mentorship */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative glassmorphism-card bg-white/80 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_20px_60px_rgba(249,115,22,0.4)] transition-all duration-300 border-2 border-white/60 backdrop-blur-xl group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 w-20 h-20 flex justify-center items-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" fill="#f97316" opacity="0.2"/><circle cx="24" cy="20" r="6" fill="#ea580c"/><path d="M14 36c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#ea580c" strokeWidth="3" strokeLinecap="round"/><circle cx="32" cy="16" r="3" fill="#f97316"/></svg>
            </div>
            <h3 className="font-extrabold text-xl mb-3 text-gray-900">AI Career Mentor</h3>
            <p className="text-gray-700 leading-relaxed">Get personalized guidance, answer career questions, and receive expert advice powered by AI insights.</p>
          </motion.div>
        </div>
      </section>
      {/* Roadmap Showcase */}
      <RoadmapShowcase />

      {/* Detailed Phase Timeline */}
      <PhaseTimeline />

      {/* Testimonials */}
      <Testimonials />

      {/* Call To Action */}
      <section className="max-w-5xl mx-auto my-16 px-6">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center shadow-2xl">
          <h3 className="text-white text-3xl font-extrabold mb-3">Ready to build your personalized career roadmap?</h3>
          <p className="text-white/90 mb-6">Upload your resume, select your target role, and let CareerAI guide you step-by-step.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/generate')} className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg shadow hover:shadow-lg transition">
              Generate Roadmap
            </button>
            <button onClick={() => navigate('/demo')} className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
              View Demo
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
