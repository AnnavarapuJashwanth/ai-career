import React from 'react';

export default function StatsStrip() {
  const stats = [
    { value: '50k+', label: 'Jobs Analyzed' },
    { value: '12k+', label: 'Roadmaps Generated' },
    { value: '2x', label: 'Faster Offers' },
    { value: '98%', label: 'User Satisfaction' },
  ];

  return (
    <section className="w-full bg-white/80 backdrop-blur rounded-xl shadow-md mt-10 mb-8 border border-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 p-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-700">{s.value}</div>
            <div className="text-gray-600 text-sm sm:text-base">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
