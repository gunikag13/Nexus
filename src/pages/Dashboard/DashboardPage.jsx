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
import BaseCard from '../../components/cards/BaseCard.jsx'
import StatCard from '../../components/cards/StatCard.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'
import { getGreeting } from '../../utils/helpers.js'

export default function DashboardPage() {
  const {
    activityItems,
    currentUser,
    flashcardItems,
    noteItems,
    studyChart,
    suggestions,
    taskItems,
  } = useAppContext()

  const stats = [
    {
      label: 'Total Notes',
      value: noteItems.length,
      icon: FiBookOpen,
      tone: 'bg-cyan-300/12',
    },
    {
      label: 'Flashcards',
      value: flashcardItems.reduce((count, set) => count + set.cards.length, 0),
      icon: FiLayers,
      tone: 'bg-teal-300/12',
    },
    {
      label: 'Tasks',
      value: taskItems.filter((task) => !task.completed).length,
      icon: FiCheckSquare,
      tone: 'bg-amber-300/12',
    },
    {
      label: 'Study Streak',
      value: `${currentUser.streak} days`,
      icon: FiTrendingUp,
      tone: 'bg-violet-300/12',
    },
  ]

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
              Capture notes, compile revision loops, and execute study sessions from one technical workspace built for high-context learning.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">Latency</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">0.8s</p>
              </div>
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">Recall Rate</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">92%</p>
              </div>
              <div className="rounded-[18px] border border-app-border bg-white/4 p-4">
                <p className="hud-label">Focus Window</p>
                <p className="mt-2 text-2xl font-semibold text-app-text">48m</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[20px] border border-cyan-300/14 bg-linear-to-br from-cyan-300/10 to-transparent p-5">
              <p className="hud-label text-cyan-100">Today&apos;s directive</p>
              <p className="mt-3 text-2xl font-semibold text-app-text">
                Finish one hard task before 18:00.
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text-muted">
                Use planner priority sorting and review the latest AI flashcard set after the task closes.
              </p>
            </div>
            <div className="rounded-[20px] border border-app-border bg-black/20 p-5">
              <p className="hud-label">System status</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Knowledge graph</span>
                  <span className="text-emerald-300">Stable</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Planner sync</span>
                  <span className="text-cyan-200">Queued</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-text-muted">Study streak</span>
                  <span className="text-app-text">{currentUser.streak} days</span>
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
            <p className="section-subtitle">Telemetry view for future analytics data.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyChart}>
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
                  dataKey="minutes"
                  stroke="#66e3ff"
                  fill="url(#studyFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BaseCard>

        <BaseCard>
          <h2 className="section-heading">AI Suggestions</h2>
          <div className="mt-6 space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="rounded-[18px] border border-app-border bg-linear-to-r from-white/5 to-transparent p-4 text-sm leading-6 text-app-text-muted"
              >
                {suggestion}
              </div>
            ))}
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
            {noteItems.slice(0, 3).map((note) => (
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
            ))}
          </div>
        </BaseCard>

        <BaseCard>
          <div className="mb-6">
            <h2 className="section-heading">Recent Activity</h2>
            <p className="section-subtitle">Small wins that keep the system moving.</p>
          </div>
          <div className="space-y-4">
            {activityItems.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-4 rounded-[18px] border border-app-border bg-linear-to-r from-white/5 to-transparent p-4"
              >
                <div>
                  <h3 className="font-medium text-app-text">{activity.title}</h3>
                  <p className="mt-1 text-sm text-app-text-muted">{activity.detail}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.16em] text-app-text-muted">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </BaseCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BaseCard>
          <h2 className="section-heading">Today&apos;s Tasks</h2>
          <div className="mt-6 space-y-3">
            {taskItems.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-[18px] border border-app-border bg-linear-to-r from-white/5 to-transparent p-4"
              >
                <div>
                  <p className="font-medium text-app-text">{task.title}</p>
                  <p className="mt-1 text-sm text-app-text-muted">{task.priority} priority</p>
                </div>
                <span className={`h-3 w-3 rounded-full ${task.completed ? 'bg-emerald-300' : 'bg-amber-300'}`} />
              </div>
            ))}
          </div>
        </BaseCard>

        <BaseCard>
          <h2 className="section-heading">Focus Snapshot</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] border border-app-border bg-linear-to-b from-white/5 to-transparent p-5">
              <p className="hud-label">Review sessions</p>
              <p className="mt-3 text-3xl font-semibold text-app-text">6</p>
            </div>
            <div className="rounded-[18px] border border-app-border bg-linear-to-b from-white/5 to-transparent p-5">
              <p className="hud-label">Upcoming deadlines</p>
              <p className="mt-3 text-3xl font-semibold text-app-text">3</p>
            </div>
          </div>
        </BaseCard>
      </section>
    </div>
  )
}
