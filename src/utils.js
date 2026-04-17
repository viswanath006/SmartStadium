export const getStatusColor = (value, max) => {
  const ratio = value / max;
  if (ratio < 0.5) return 'var(--status-good)';
  if (ratio < 0.8) return 'var(--status-warning)';
  return 'var(--status-critical)';
};
