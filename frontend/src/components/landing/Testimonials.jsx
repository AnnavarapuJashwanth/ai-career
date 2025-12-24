import React from 'react';
import { motion } from 'framer-motion';

const items = [
  {
    name: 'Aarav',
    role: 'Full Stack Developer',
    text: 'CareerAI gave me a clear, personalized plan. I landed an offer 2x faster.',
    avatar: 'https://i.pravatar.cc/80?img=3',
  },
  {
    name: 'Diya',
    role: 'Data Scientist',
    text: 'The market insights and skill-gap analysis were spot on. Highly recommend!',
    avatar: 'https://i.pravatar.cc/80?img=5',
  },
  {
    name: 'Karan',
    role: 'Cloud Engineer',
    text: 'The roadmap and curated resources made learning focused and fun.',
    avatar: 'https://i.pravatar.cc/80?img=11',
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto my-20 px-4">
      <h3 className="text-center text-2xl font-extrabold text-gray-900 mb-8">What learners say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((t, idx) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full shadow" />
              <div>
                <div className="font-bold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-600">{t.role}</div>
              </div>
            </div>
            <p className="text-gray-700">“{t.text}”</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
