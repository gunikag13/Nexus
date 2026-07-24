export default function SkeletonCard({ className = 'h-44' }) {
  return (
    <div className={`glass-panel tech-frame animate-pulse rounded-[22px] p-5 ${className}`}>
      <div className="h-3 w-20 rounded bg-white/8" />
      <div className="mt-5 h-7 w-2/3 rounded bg-white/8" />
      <div className="mt-3 h-3 w-full rounded bg-white/6" />
      <div className="mt-2 h-3 w-5/6 rounded bg-white/6" />
    </div>
  )
}
