import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiInfo, FiMoon, FiShield, FiSun } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'
import Input from '../../components/forms/Input.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'

export default function SettingsPage() {
  const { currentUser, theme, toggleTheme } = useAppContext()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  return (
    <div className="surface-grid">
      <section className="glass-panel-strong tech-frame rounded-[24px] p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-app-text">Settings</h1>
        <p className="mt-2 text-app-text-muted">
          Customize your workspace and wire these controls into backend APIs later.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BaseCard>
          <h2 className="section-heading">Profile Card</h2>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-cyan-300/12 text-xl font-semibold text-cyan-100">
              {currentUser.avatar}
            </div>
            <div>
              <p className="text-lg font-semibold capitalize text-app-text">{currentUser.name}</p>
              <p className="text-sm text-app-text-muted">{currentUser.email || 'Not connected'}</p>
              <p className="mt-1 text-sm text-app-text-muted">{currentUser.course}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <h2 className="section-heading">Theme Toggle</h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Theme preference persists between sessions using local storage.
          </p>
          <div className="mt-6">
            <Button
              variant="secondary"
              icon={theme === 'dark' ? FiSun : FiMoon}
              onClick={toggleTheme}
            >
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </Button>
          </div>
        </BaseCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BaseCard>
          <div className="flex items-start gap-3">
            <FiShield className="mt-1 text-lg text-app-text" />
            <div className="w-full">
              <h2 className="section-heading">Change Password UI</h2>
              <div className="mt-5 space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      currentPassword: event.target.value,
                    }))
                  }
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      newPassword: event.target.value,
                    }))
                  }
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((previous) => ({
                      ...previous,
                      confirmPassword: event.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() => toast.success('Password update UI placeholder ready.')}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div className="flex items-start gap-3">
            <FiInfo className="mt-1 text-lg text-app-text" />
            <div>
              <h2 className="section-heading">About Application</h2>
              <p className="mt-2 text-sm leading-7 text-app-text-muted">
                NEXUS is a modern student productivity dashboard for notes, AI summaries, flashcards, planner workflows, and quiz practice.
              </p>
            </div>
          </div>
        </BaseCard>
      </section>
    </div>
  )
}
