import React from 'react';
import { CheckCircle, SchoolOutlined, CodeOutlined } from '@mui/icons-material';

export default function PhaseCard({ phase, index }) {
  const phaseColors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
  ];

  return (
    <div className="card-shadow rounded-lg overflow-hidden bg-white hover:shadow-xl transition transform hover:scale-105">
      {/* Header */}
      <div className={`bg-gradient-to-r ${phaseColors[index % 3]} text-white p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle style={{ fontSize: 28 }} />
          <h3 className="text-xl font-bold">{phase.name}</h3>
        </div>
        <p className="text-sm opacity-90">{phase.duration}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CodeOutlined style={{ fontSize: 20 }} />
            Key Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {phase.skills?.slice(0, 5).map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                {skill}
              </span>
            ))}
            {phase.skills?.length > 5 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                +{phase.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Resources */}
        {phase.resources && phase.resources.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <SchoolOutlined style={{ fontSize: 20 }} />
              Resources
            </h4>
            <ul className="space-y-2">
              {phase.resources.slice(0, 3).map((resource, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <div>
                    <p className="font-medium text-gray-900">{resource.title}</p>
                    <p className="text-xs text-gray-500">{resource.provider} • {resource.duration_hours}h</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
