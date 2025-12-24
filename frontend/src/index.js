// Common Components
export { default as Header } from '../components/common/Header';
export { default as Footer } from '../components/common/Footer';

// Card Components
export { default as SkillCard } from '../components/cards/SkillCard';
export { default as PhaseCard } from '../components/cards/PhaseCard';
export { default as CourseCard } from '../components/cards/CourseCard';

// 3D Components
export { default as RoadmapScene } from '../components/3d/RoadmapScene';

// Pages
export { default as Landing } from '../pages/Landing';
export { default as InputForm } from '../pages/InputForm';
export { default as Dashboard } from '../pages/Dashboard';

// Hooks
export { useResumeAnalysis } from '../hooks/useResumeAnalysis';
export { useRoadmapGeneration } from '../hooks/useRoadmapGeneration';
export { useMarketTrends } from '../hooks/useMarketTrends';

// Utils
export { formatDuration, getImportanceColor, getImportanceLabel, truncateText, capitalize } from '../utils/format';
