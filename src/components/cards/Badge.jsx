import { cn } from '../../utils/helpers.js'

const variants = {
  default: 'border-app-border bg-white/6 text-app-text-muted',
  info: 'border-cyan-300/18 bg-cyan-300/10 text-cyan-200',
  success: 'border-emerald-300/18 bg-emerald-300/10 text-emerald-200',
  warning: 'border-amber-300/18 bg-amber-300/10 text-amber-200',
  danger: 'border-rose-300/18 bg-rose-300/10 text-rose-200',
}

export default function Badge({ children, className, variant = 'default' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-3 py-1 text-xs uppercase tracking-[0.16em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
