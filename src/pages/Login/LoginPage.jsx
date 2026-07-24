import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import Checkbox from '../../components/forms/Checkbox.jsx'
import Input from '../../components/forms/Input.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAppContext()
  const [remember, setRemember] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const errors = useMemo(() => {
    return {
      email: !form.email.includes('@') ? 'Enter a valid email address.' : '',
      password:
        form.password.length && form.password.length < 8
          ? 'Password should be at least 8 characters.'
          : '',
    }
  }, [form.email, form.password])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.email || !form.password || errors.email || errors.password) {
      toast.error('Please fix the login form errors.')
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      login(form)
      toast.success(`Welcome back${remember ? ', session remembered' : ''}.`)
      navigate('/dashboard')
    }, 700)
  }

  return (
    <div className="auth-backdrop flex items-center justify-center">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel tech-frame hidden rounded-[24px] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="pill">AI-powered study workspace</span>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-app-text">
              Study faster with notes, summaries, flashcards, and planning in one calm space.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-app-text-muted">
              NEXUS helps students capture ideas, organize coursework, and turn scattered study material into momentum.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {['Save notes', 'Generate recaps', 'Stay on top of tasks'].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-app-border bg-white/5 p-4 text-sm text-app-text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel-strong tech-frame rounded-[24px] p-6 sm:p-8">
          <p className="hud-label text-cyan-200">NEXUS / ACCESS</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-app-text">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Log in to continue building your second brain.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email"
                type="email"
                rightIcon={FiMail}
                value={form.email}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, email: event.target.value }))
                }
              />
              {errors.email && form.email ? (
                <p className="mt-2 text-xs text-rose-200">{errors.email}</p>
              ) : null}
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
              {errors.password ? (
                <p className="mt-2 text-xs text-rose-200">{errors.password}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox
                label="Remember Me"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              <button
                type="button"
                className="text-sm text-cyan-200 transition hover:text-cyan-100"
              >
                Forgot Password
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              icon={FiArrowRight}
              loading={isLoading}
            >
              Login
            </Button>
          </form>

          <p className="mt-6 text-sm text-app-text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-cyan-200 hover:text-cyan-100">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
