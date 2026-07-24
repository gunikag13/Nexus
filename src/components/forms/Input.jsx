import { cn } from '../../utils/helpers.js'

export default function Input({
  className,
  label,
  rightIcon: RightIcon,
  ...props
}) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="hud-label text-app-text">
          {label}
        </span>
      ) : null}
      <span className="relative block">
        <input
          className={cn(
            'h-12 w-full rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none transition placeholder:text-app-text-muted focus:border-cyan-300/50 focus:bg-cyan-300/5 focus:shadow-[0_0_0_1px_rgba(102,227,255,0.15)]',
            RightIcon ? 'pr-11' : '',
            className,
          )}
          {...props}
        />
        {RightIcon ? (
          <RightIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted" />
        ) : null}
      </span>
    </label>
  )
}
