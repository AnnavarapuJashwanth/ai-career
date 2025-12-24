import React from 'react';
import RoadmapScene from '../components/3d/RoadmapScene';
import PhaseTimeline from '../components/landing/PhaseTimeline';

const demoPhases = [
  {
    name: 'Foundation',
    duration: '0-3 months',
    skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'Responsive Design'],
  },
  {
    name: 'Intermediate',
    duration: '3-6 months',
    skills: ['React', 'Node.js', 'SQL', 'REST APIs', 'TypeScript'],
  },
  {
    name: 'Advanced',
    duration: '6-9 months',
    skills: ['System Design', 'Cloud (AWS/Azure)', 'DevOps', 'Microservices', 'Docker'],
  },
];

export default function DemoDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Sample Career Roadmap</h2>
      <div className="w-full mb-10">
        <RoadmapScene phases={demoPhases} />
      </div>
      {/* Personalized Roadmap preview (same as landing) */}
      <PhaseTimeline phases={demoPhases} />
    </div>
  );
}