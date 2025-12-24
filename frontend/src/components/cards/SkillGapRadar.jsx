import React from 'react';
import Card from '../common/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';

const sampleData = [
  { skill: 'React', you: 3, market: 5 },
  { skill: 'Node.js', you: 2, market: 4 },
  { skill: 'Python', you: 2, market: 3 },
  { skill: 'System Design', you: 1, market: 4 },
  { skill: 'Cloud (AWS)', you: 1, market: 3 },
  { skill: 'Database', you: 2, market: 4 },
];

export default function SkillGapRadar({ data = sampleData }) {
  return (
    <Card title="Skill Gap Analysis" className="h-full">
      <div className="text-gray-500 text-sm mb-2">Your current skills vs. Market demand</div>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={30} domain={[0, 5]} />
          <Radar name="You" dataKey="you" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
          <Radar name="Market Demand" dataKey="market" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}
