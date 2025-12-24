export const formatDuration = (months) => {
  if (months < 1) return '< 1 month';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''}`;
};

export const getImportanceColor = (importance) => {
  if (!importance) return 'bg-gray-100';
  if (importance >= 0.8) return 'bg-red-100 text-red-800';
  if (importance >= 0.6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const getImportanceLabel = (importance) => {
  if (!importance) return 'Medium';
  if (importance >= 0.8) return 'High';
  if (importance >= 0.6) return 'Medium';
  return 'Low';
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
