import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBookOpen, FiCheckSquare, FiLayers, FiTrendingUp } from 'react-icons/fi'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import Button from '../../components/buttons/Button.jsx'
import BaseCard from '../../components/cards/BaseCard.jsx'
import ErrorState from '../../components/cards/ErrorState.jsx'
import PageLoader from '../../components/cards/PageLoader.jsx'
import StatCard from '../../components/cards/StatCard.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'
import { dashboardService, getApiErrorMessage } from '../../services/api.js'
import { formatDate, getGreeting } from '../../utils/helpers.js'

const initialDashboard = {
  totalNotes: 0,
  totalFlashcards: 0,
  totalQuizzes: 0,
  pendingTasks: 0,
  recentNotes: [],
  recentActivity: [],
  studyChart: [],
}

export default function DashboardPage() {
  const { currentUser } = useAppContext()
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await dashboardService.get()
      setDashboard(response.data.data)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadDashboard()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const stats = [
    {
      label: 'Total Notes',
      value: dashboard.totalNotes,
      icon: FiBookOpen,
      tone: 'bg-cyan-300/12',
    },
    {
      label: 'Flashcards',
      value: dashboard.totalFlashcards,
      icon: FiLayers,
      tone: 'bg-teal-300/12',
    },
    {
      label: 'Quizzes',
      value: dashboard.totalQuizzes,
      icon: FiCheckSquare,
      tone: 'bg-amber-300/12',
    },
    {
      label: 'Pending Tasks',
      value: dashboard.pendingTasks,
      icon: FiTrendingUp,
      tone: 'bg-violet-300/12',
    },
  ]

  if (isLoading) {
    return <PageLoader label="Loading dashboard" />
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load dashboard"
        description={error}
        action={<Button onClick={loadDashboard}>Try Again</Button>}
      />
    )
  }

  return (
    <div className="surface-grid">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-strong tech-frame overflow-hidden rounded-[24px] p-6 md:p-8"
      >
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="pill">Neural command surface</span>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-app-text md:text-5xl">
              {getGreeting()}, {currentUser.name.split(' ')[0]}. Your second brain is online.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-app-text-muted">
              Capture notes, generate study assets, and track your learning activity from one workspace.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">Recent notes</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">
                  {dashboard.recentNotes.length}
                </p>
              </div>
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">AI assets</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">
                  {dashboard.totalFlashcards + dashboard.totalQuizzes}
                </p>
              </div>
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">Activity events</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">
                  {dashboard.recentActivity.length}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[20px] border border-cyan-300/14 bg-linear-to-br from-cyan-300/10 to-transparent p-5">
              <p className="hud-label text-cyan-100">Today&apos;s directive</p>
              <p className="mt-3 text-2xl font-semibold text-app-text">
                Generate one revision asset from your latest note.
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text-muted">
                Use summary, flashcards, or quiz generation from the Notes page.
              </p>
            </div>
            <div className="rounded-[20px] border border-app-border bg-black/20 p-5">
              <p className="hud-label">System status</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Notes</span>
                  <span className="text-emerald-300">{dashboard.totalNotes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Flashcards</span>
                  <span className="text-cyan-200">{dashboard.totalFlashcards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Quizzes</span>
                  <span className="text-app-text">{dashboard.totalQuizzes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <BaseCard>
          <div className="mb-6">
            <h2 className="section-heading">Study Activity</h2>
            <p className="section-subtitle">Live activity events from the last 7 days.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.studyChart}>
                <defs>
                  <linearGradient id="studyFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#66e3ff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#66e3ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#7f93ba" />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(5,14,28,0.95)',
                    border: '1px solid rgba(91,120,170,0.24)',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#66e3ff"
                  fill="url(#studyFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BaseCard>

        <BaseCard>
          <h2 className="section-heading">Recent Activity</h2>
          <div className="mt-6 space-y-3">
            {dashboard.recentActivity.length ? (
              dashboard.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-[18px] border border-app-border bg-linear-to-r from-white/5 to-transparent p-4 text-sm leading-6 text-app-text-muted"
                >
                  <p className="font-medium text-app-text">{activity.title}</p>
                  <p>{activity.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-app-text-muted">No activity yet.</p>
            )}
          </div>
        </BaseCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BaseCard>
          <div className="mb-6">
            <h2 className="section-heading">Recent Notes</h2>
            <p className="section-subtitle">Your latest study material at a glance.</p>
          </div>
          <div className="space-y-4">
            {dashboard.recentNotes.length ? (
              dashboard.recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-[18px] border border-app-border bg-linear-to-r from-white/5 to-transparent p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-app-text">{note.title}</h3>
                      <p className="mt-1 text-sm text-app-text-muted">{note.preview}</p>
                    </div>
                    <span className="rounded-md bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-200">
                      {note.subject}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-app-text-muted">No notes created yet.</p>
            )}
          </div>
        </BaseCard>

        <BaseCard>
          <h2 className="section-heading">Latest Timestamp</h2>
          <p className="mt-3 text-sm text-app-text-muted">
            {dashboard.recentActivity[0]
              ? formatDate(dashboard.recentActivity[0].time)
              : 'No activity recorded yet.'}
          </p>
        </BaseCard>
      </section>
    </div>
  )
}
