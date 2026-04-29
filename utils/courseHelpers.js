export const getDeterministicRating = (slug) => {
  if (!slug) return "4.9";
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash) % 31; // 0 to 30
  const rating = 4.7 + (normalized / 100);
  return rating.toFixed(1);
};
