import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCalendar, FiPlus } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import Badge from '../../components/cards/Badge.jsx'
import ErrorState from '../../components/cards/ErrorState.jsx'
import PageLoader from '../../components/cards/PageLoader.jsx'
import TaskCard from '../../components/cards/TaskCard.jsx'
import Input from '../../components/forms/Input.jsx'
import { priorityOptions } from '../../constants/app.js'
import { useAppContext } from '../../hooks/useAppContext.js'
import { getApiErrorMessage, tasksService } from '../../services/api.js'

export default function PlannerPage() {
  const { searchQuery } = useAppContext()
  const [taskItems, setTaskItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    priority: 'Medium',
    deadline: new Date().toISOString().slice(0, 10),
  })

  const loadTasks = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await tasksService.getAll()
      setTaskItems(response.data.data.tasks)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadTasks()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredTasks = taskItems.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const dashboardGroups = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)

    return {
      today: filteredTasks.filter((task) => task.deadline.startsWith(today)),
      upcoming: filteredTasks.filter((task) => !task.completed),
      completed: filteredTasks.filter((task) => task.completed),
    }
  }, [filteredTasks])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      toast.error('Task title is required.')
      return
    }

    try {
      const response = await tasksService.create({
        ...form,
        deadline: new Date(form.deadline).toISOString(),
      })

      setTaskItems((previous) => [response.data.data.task, ...previous])
      toast.success('Task added.')
      setForm({
        title: '',
        priority: 'Medium',
        deadline: new Date().toISOString().slice(0, 10),
      })
      setShowForm(false)
    } catch (createError) {
      toast.error(getApiErrorMessage(createError))
    }
  }

  const handleDeleteTask = async (taskId) => {
    const previousTasks = taskItems

    setTaskItems((previous) => previous.filter((task) => task.id !== taskId))

    try {
      await tasksService.delete(taskId)
      toast.success('Task deleted.')
    } catch (deleteError) {
      setTaskItems(previousTasks)
      toast.error(getApiErrorMessage(deleteError))
    }
  }

  const handleToggleTask = async (taskId) => {
    const task = taskItems.find((item) => item.id === taskId)
    const previousTasks = taskItems

    if (!task) return

    setTaskItems((previous) =>
      previous.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item,
      ),
    )

    try {
      const response = await tasksService.update(taskId, {
        completed: !task.completed,
      })

      setTaskItems((previous) =>
        previous.map((item) => (item.id === taskId ? response.data.data.task : item)),
      )
      toast.success('Task updated.')
    } catch (updateError) {
      setTaskItems(previousTasks)
      toast.error(getApiErrorMessage(updateError))
    }
  }

  if (isLoading) {
    return <PageLoader label="Loading planner" />
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load planner"
        description={error}
        action={<Button onClick={loadTasks}>Try Again</Button>}
      />
    )
  }

  return (
    <div className="surface-grid">
      <section className="glass-panel-strong tech-frame rounded-[24px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="pill">
              <FiCalendar />
              Smart planning
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-app-text">
              Planner
            </h1>
            <p className="mt-2 text-app-text-muted">
              Keep deadlines visible, priorities clear, and progress easy to track.
            </p>
          </div>
          <Button icon={FiPlus} onClick={() => setShowForm((previous) => !previous)}>
            Add Task
          </Button>
        </div>

        {showForm ? (
          <form
            className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
            onSubmit={handleSubmit}
          >
            <Input
              placeholder="Task title"
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, title: event.target.value }))
              }
            />
            <select
              className="h-12 rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={form.priority}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, priority: event.target.value }))
              }
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Input
              type="date"
              value={form.deadline}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, deadline: event.target.value }))
              }
            />
            <Button type="submit">Save</Button>
          </form>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass-panel tech-frame rounded-[22px] p-5">
          <p className="hud-label">Today&apos;s Tasks</p>
          <p className="mt-3 text-3xl font-semibold text-app-text">
            {dashboardGroups.today.length}
          </p>
          <Badge className="mt-3" variant="info">
            Active today
          </Badge>
        </div>
        <div className="glass-panel tech-frame rounded-[22px] p-5">
          <p className="hud-label">Upcoming Tasks</p>
          <p className="mt-3 text-3xl font-semibold text-app-text">
            {dashboardGroups.upcoming.length}
          </p>
          <Badge className="mt-3" variant="warning">
            Scheduled
          </Badge>
        </div>
        <div className="glass-panel tech-frame rounded-[22px] p-5">
          <p className="hud-label">Completed Tasks</p>
          <p className="mt-3 text-3xl font-semibold text-app-text">
            {dashboardGroups.completed.length}
          </p>
          <Badge className="mt-3" variant="success">
            Finished
          </Badge>
        </div>
      </section>

      <section className="space-y-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        ))}
      </section>
    </div>
  )
}
