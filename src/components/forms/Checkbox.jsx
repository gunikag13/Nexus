export default function Checkbox({ checked, label, ...props }) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-app-text-muted">
      <input
        type="checkbox"
        checked={checked}
        className="h-4 w-4 rounded border-app-border bg-white/5 accent-cyan-300"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
