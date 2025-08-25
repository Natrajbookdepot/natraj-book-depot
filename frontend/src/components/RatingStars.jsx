export default function RatingStars({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const out = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array(full).fill(0).map((_, i) => (
        <span key={"f"+i}>⭐</span>
      ))}
      {half && <span>🌗</span>}
      {Array(out).fill(0).map((_, i) => (
        <span key={"e"+i} className="opacity-30">⭐</span>
      ))}
    </div>
  );
}
