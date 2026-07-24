import LoadingSpinner from '../cards/LoadingSpinner.jsx'
import { cn } from '../../utils/helpers.js'

const variants = {
  primary:
    'border border-cyan-300/30 bg-linear-to-r from-cyan-300 to-teal-300 text-slate-950 shadow-[0_0_24px_rgba(34,199,242,0.18)] hover:brightness-105',
  secondary:
    'bg-white/6 text-app-text ring-1 ring-inset ring-app-border hover:border-cyan-300/25 hover:bg-cyan-300/8',
  ghost:
    'bg-transparent text-app-text-muted hover:bg-cyan-300/8 hover:text-app-text',
  danger:
    'bg-rose-500/14 text-rose-200 ring-1 ring-inset ring-rose-400/20 hover:bg-rose-500/20',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
}

export default function Button({
  children,
  className,
  icon: Icon,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium uppercase tracking-[0.12em] transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <LoadingSpinner className="h-4 w-4" /> : Icon ? <Icon className="text-base" /> : null}
      {children}
    </button>
  )
}
