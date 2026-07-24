import { FiClock, FiTrash2 } from 'react-icons/fi'
import BaseCard from './BaseCard.jsx'
import { formatDate } from '../../utils/helpers.js'

const priorityClasses = {
  High: 'bg-rose-500/12 text-rose-200',
  Medium: 'bg-amber-500/12 text-amber-200',
  Low: 'bg-emerald-500/12 text-emerald-200',
}

export default function TaskCard({ task, onDelete, onToggle }) {
  return (
    <BaseCard className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <button
          type="button"
          aria-label={`Toggle ${task.title}`}
          onClick={() => onToggle(task.id)}
          className={`mt-1 h-5 w-5 rounded-full border transition ${
            task.completed
              ? 'border-emerald-300 bg-emerald-300'
              : 'border-app-border bg-transparent'
          }`}
        />
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              className={`text-base font-semibold ${
                task.completed ? 'text-app-text-muted line-through' : 'text-app-text'
              }`}
            >
              {task.title}
            </h3>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityClasses[task.priority]}`}>
              {task.priority}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-app-text-muted">
            <FiClock />
            <span>{formatDate(task.deadline)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="rounded-xl p-2 text-app-text-muted transition hover:bg-white/8 hover:text-app-text"
      >
        <FiTrash2 />
      </button>
    </BaseCard>
  )
}
