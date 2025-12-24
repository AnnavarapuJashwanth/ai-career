import React from 'react';
import Card from '../common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Expects trends: [{ name, job_count, importance }]
export default function MarketTrendsBar({ trends = [], role = '' }) {
  const data = (trends || []).slice(0, 12).map((t) => ({ name: t.name, jobs: t.job_count || Math.round((t.importance || 0) * 100) }));
  return (
    <Card title="Market Demand Trends">
      {role && <div className="text-gray-500 text-sm mb-2">Top skills for "{role}"</div>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="jobs" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
