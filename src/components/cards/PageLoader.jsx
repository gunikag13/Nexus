import LoadingSpinner from './LoadingSpinner.jsx'

export default function PageLoader({ label = 'Loading workspace' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="glass-panel tech-frame rounded-[22px] px-8 py-6 text-center">
        <LoadingSpinner className="mx-auto h-8 w-8 text-cyan-200" />
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-app-text-muted">
          {label}
        </p>
      </div>
    </div>
  )
}
