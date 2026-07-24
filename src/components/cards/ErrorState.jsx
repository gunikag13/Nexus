export default function ErrorState({ action, description, title }) {
  return (
    <div className="glass-panel tech-frame rounded-[22px] border-rose-300/18 p-8 text-center">
      <p className="hud-label text-rose-200">Error state</p>
      <h3 className="mt-3 text-2xl font-semibold text-app-text">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-app-text-muted">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
