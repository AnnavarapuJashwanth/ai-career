import React from 'react';
import Card from '../common/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';

export default function SkillGapRadar({ data }) {
  const chartData = data && data.length ? data : null;

  return (
    <Card title="Skill Gap Analysis" className="h-full">
      <div className="text-gray-500 text-sm mb-2">Your current skills vs. Market demand</div>
      {chartData ? (
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="You" dataKey="you" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
            <Radar name="Market Demand" dataKey="market" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[260px] text-sm text-gray-400">
          Collecting your skill insights...
        </div>
      )}
    </Card>
  );
}
