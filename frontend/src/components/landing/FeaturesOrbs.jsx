import React from 'react';

// Pure CSS "3D" gradient orbs behind the features section (no 3D libraries).
export default function FeaturesOrbs() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-gradient-to-tr from-blue-500/40 to-purple-500/40 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-400/40 to-cyan-400/40 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 w-52 h-52 rounded-full bg-gradient-to-tr from-emerald-400/40 to-sky-400/40 blur-3xl" />
    </div>
  );
}
