import React from 'react';
import { motion } from 'framer-motion';

const aboutCards = [
  {
    icon: 'lightbulb',
    title: 'Our Mission',
    text: 'Empower every student and professional to make smarter career decisions with AI-driven guidance, upskilling, and market insights.'
  },
  {
    icon: 'groups',
    title: 'Our Team',
    text: 'A passionate group of educators, engineers, and career coaches dedicated to building the future of career guidance.'
  },
  {
    icon: 'insights',
    title: 'Our Approach',
    text: 'We blend real-time market analytics, personalized learning, and mentorship to help you achieve your career goals.'
  },
  {
    icon: 'verified',
    title: 'Our Values',
    text: 'Integrity, innovation, and student success are at the core of everything we do.'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">About CareerAI Guidance</h1>
        <p className="text-lg text-gray-700 mb-6">We believe everyone deserves a clear, data-driven, and inspiring path to their dream career. Discover who we are and why we built CareerAI Guidance.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {aboutCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 #6366f1cc' }}
            transition={{ duration: 0.5, type: 'spring', delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-10 flex flex-col items-center text-center cursor-pointer hover:ring-4 hover:ring-blue-400 hover:shadow-2xl transition-all group"
          >
            <span className="material-icons text-blue-600 text-5xl mb-4 bg-white/80 rounded-full shadow p-2 group-hover:bg-blue-50 transition-all">{card.icon}</span>
            <h3 className="font-bold text-2xl mb-2 text-blue-800">{card.title}</h3>
            <p className="text-gray-700 text-base">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
