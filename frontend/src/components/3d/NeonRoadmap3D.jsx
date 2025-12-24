import React from 'react';
import RoadmapScene from './RoadmapScene';

// Simple wrapper kept for compatibility, now using SVG-based roadmap only.
export default function NeonRoadmap3D({ phases = [] }) {
  return <RoadmapScene phases={phases} />;
}
