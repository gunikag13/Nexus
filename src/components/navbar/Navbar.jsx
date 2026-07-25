import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiBell, FiChevronDown, FiMenu, FiSearch } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../hooks/useAppContext.js'
import Input from '../forms/Input.jsx'

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const {
    currentUser,
    logout,
    searchQuery,
    setSearchQuery,
    toggleTheme,
  } = useAppContext()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="glass-panel tech-frame sticky top-4 z-20 mb-6 flex flex-col gap-4 rounded-[20px] p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-app-border bg-white/6 p-3 text-app-text"
        >
          <FiMenu />
        </button>
        <p className="hud-label">NEXUS LIVE</p>
      </div>

      <div className="w-full md:max-w-2xl">
        <Input
          aria-label="Global search"
          placeholder="Query notes, flashcards, tasks"
          rightIcon={FiSearch}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <button
          type="button"
          className="relative rounded-md border border-app-border bg-white/6 p-3 text-app-text"
        >
          <FiBell />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-cyan-300" />
        </button>
        <div className="hidden rounded-md border border-app-border bg-white/6 px-3 py-2 text-right md:block">
          <p className="hud-label">Signal</p>
          <p className="mt-1 text-sm font-medium text-app-text">
            Workspace ready
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((previous) => !previous)}
            className="flex items-center gap-3 rounded-md border border-cyan-300/12 bg-cyan-300/8 px-3 py-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300/14 text-sm font-semibold text-cyan-100">
              {currentUser.avatar}
            </div>
            <div className="hidden text-left md:block">
              <p className="hud-label">Session</p>
              <p className="mt-1 text-sm font-medium capitalize text-app-text">
                {currentUser.name}
              </p>
            </div>
            <FiChevronDown className="text-app-text-muted" />
          </button>

          {isProfileOpen ? (
            <div className="glass-panel absolute right-0 top-[calc(100%+12px)] z-20 w-52 rounded-[18px] p-3">
              <div className="space-y-2">
                <Link
                  className="block rounded-md px-3 py-2 text-sm text-app-text-muted transition hover:bg-white/6 hover:text-app-text"
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme()
                    setIsProfileOpen(false)
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-app-text-muted transition hover:bg-white/6 hover:text-app-text"
                >
                  Toggle Theme
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    toast.success('Logout successful.')
                    setIsProfileOpen(false)
                    navigate('/login')
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-rose-200 transition hover:bg-rose-400/10"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
