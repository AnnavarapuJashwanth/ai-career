import React from 'react';
import { DownloadOutlined, ShareOutlined } from '@mui/icons-material';

export default function DashboardHeader({ userName, role }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Hello, {userName}</h1>
        <div className="text-gray-600 text-base">
          Track your progress towards becoming a <span className="text-blue-700 font-semibold">{role}</span>.
        </div>
      </div>
      <div className="flex gap-2 mt-4 md:mt-0">
        <button className="flex items-center gap-1 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
          <ShareOutlined fontSize="small" /> Share
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
          <DownloadOutlined fontSize="small" /> Export Report
        </button>
      </div>
    </div>
  );
}
