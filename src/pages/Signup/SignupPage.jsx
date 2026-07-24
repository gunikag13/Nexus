import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLock, FiMail, FiUser } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import Input from '../../components/forms/Input.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'
import { getApiErrorMessage } from '../../services/api.js'

function getPasswordStrength(password) {
  if (password.length < 6) return { label: 'Weak', width: '33%', tone: 'bg-rose-300' }
  if (password.length < 10) return { label: 'Medium', width: '66%', tone: 'bg-amber-300' }
  return { label: 'Strong', width: '100%', tone: 'bg-emerald-300' }
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const validation = useMemo(() => {
    return {
      name: !form.name.trim() ? 'Name is required.' : '',
      email: !form.email.includes('@') ? 'Valid email required.' : '',
      password: form.password.length < 6 ? 'Use at least 6 characters.' : '',
      confirmPassword:
        form.confirmPassword && form.confirmPassword !== form.password
          ? 'Passwords do not match.'
          : '',
    }
  }, [form])

  const passwordStrength = getPasswordStrength(form.password)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoading) return

    if (
      validation.name ||
      validation.email ||
      validation.password ||
      validation.confirmPassword
    ) {
      toast.error('Please complete the signup form correctly.')
      return
    }

    setIsLoading(true)
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      toast.success('Signup successful.')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-backdrop flex items-center justify-center">
      <div className="grid w-full max-w-6xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel tech-frame hidden rounded-[24px] p-8 xl:block">
          <p className="hud-label text-cyan-200">NEXUS / INIT</p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold tracking-tight text-app-text">
            Build a study operating system, not just another dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-app-text-muted">
            NEXUS is designed like a cognitive control panel: notes, flashcards, tasks, and AI workflows structured as one continuous learning surface.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-[18px] border border-app-border bg-white/4 p-5">
              <p className="hud-label">Modules</p>
              <p className="mt-3 text-2xl font-semibold text-app-text">05</p>
              <p className="mt-2 text-sm text-app-text-muted">Notes, recall, planning, insights, settings</p>
            </div>
            <div className="rounded-[18px] border border-app-border bg-white/4 p-5">
              <p className="hud-label">Boot profile</p>
              <p className="mt-3 text-2xl font-semibold text-app-text">Student</p>
              <p className="mt-2 text-sm text-app-text-muted">API-ready frontend with reusable components</p>
            </div>
          </div>
        </section>

        <section className="glass-panel-strong tech-frame w-full rounded-[24px] p-6 sm:p-8">
          <p className="hud-label text-cyan-200">Create account</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-app-text">
            Initialize your workspace
          </h1>
          <p className="mt-2 text-sm text-app-text-muted">
            Create your identity, then launch directly into the NEXUS control layer.
          </p>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <Input
                label="Name"
                rightIcon={FiUser}
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, name: event.target.value }))
                }
              />
              {validation.name ? <p className="mt-2 text-xs text-rose-200">{validation.name}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Email"
                type="email"
                rightIcon={FiMail}
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
              />
              {validation.email ? <p className="mt-2 text-xs text-rose-200">{validation.email}</p> : null}
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                rightIcon={FiLock}
                value={form.password}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, password: event.target.value }))
                }
              />
              {validation.password ? (
                <p className="mt-2 text-xs text-rose-200">{validation.password}</p>
              ) : null}
            </div>
            <div>
              <Input
                label="Confirm Password"
                type="password"
                rightIcon={FiLock}
                value={form.confirmPassword}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    confirmPassword: event.target.value,
                  }))
                }
              />
              {validation.confirmPassword ? (
                <p className="mt-2 text-xs text-rose-200">{validation.confirmPassword}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/8">
                <div className={`h-full ${passwordStrength.tone}`} style={{ width: passwordStrength.width }} />
              </div>
              <p className="text-xs uppercase tracking-[0.16em] text-app-text-muted">
                Password strength: {passwordStrength.label}
              </p>
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                icon={FiArrowRight}
                loading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-app-text-muted">
            <span>Already initialized?</span>
            <Link to="/login" className="font-medium text-cyan-200 hover:text-cyan-100">
              Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
