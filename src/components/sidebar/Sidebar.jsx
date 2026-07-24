import { FiLogOut, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'
import { navItems } from '../../constants/app.js'
import { useAppContext } from '../../hooks/useAppContext.js'
import { cn } from '../../utils/helpers.js'

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAppContext()

  const handleLogout = async () => {
    await logout()
    toast.success('Logout successful.')
    navigate('/login')
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'glass-panel-strong tech-frame fixed left-0 top-0 z-40 flex h-full w-[300px] flex-col rounded-r-[24px] border-l-0 p-5 transition duration-300 md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="hud-label text-cyan-200/80">NEXUS / CORE</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-app-text">
              Cognitive Workspace
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-app-text-muted transition hover:bg-white/8 md:hidden"
          >
            <FiX />
          </button>
        </div>

        <div className="mb-8 rounded-[18px] border border-cyan-300/12 bg-linear-to-r from-cyan-300/10 to-transparent p-4">
          <p className="hud-label">Operator</p>
          <p className="mt-2 text-sm font-medium capitalize text-app-text">
            {currentUser.name}
          </p>
          <p className="mt-1 text-sm text-app-text-muted">{currentUser.course}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] transition',
                  isActive
                    ? 'border border-cyan-300/20 bg-cyan-300/12 text-app-text'
                    : 'border border-transparent text-app-text-muted hover:border-cyan-300/10 hover:bg-cyan-300/6 hover:text-app-text',
                )
              }
            >
              <Icon className="text-base" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] text-app-text-muted transition hover:bg-cyan-300/6 hover:text-app-text"
        >
          <FiLogOut className="text-base" />
          Logout
        </button>
      </aside>
    </>
  )
}
