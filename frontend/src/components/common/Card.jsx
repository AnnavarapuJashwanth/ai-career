import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      {title && <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>}
      {children}
    </div>
  );
}
