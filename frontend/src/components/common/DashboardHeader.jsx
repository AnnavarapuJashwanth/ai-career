import React from 'react';

export default function DashboardHeader({ userName, role }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Hello, {userName}</h1>
        <div className="text-gray-600 text-base">
          Track your progress towards becoming a <span className="text-blue-700 font-semibold">{role}</span>.
        </div>
      </div>
    </div>
  );
}
