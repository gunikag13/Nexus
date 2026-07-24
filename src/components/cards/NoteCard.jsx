import { FiEdit3, FiEye, FiShare2, FiStar, FiTrash2 } from 'react-icons/fi'
import Button from '../buttons/Button.jsx'
import Badge from './Badge.jsx'
import BaseCard from './BaseCard.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function NoteCard({
  note,
  onDelete,
  onEdit,
  onShare,
  onTogglePin,
  onView,
}) {
  return (
    <BaseCard className="flex h-full flex-col justify-between gap-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-app-text">{note.title}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="info">{note.subject}</Badge>
              {note.isPinned ? <Badge variant="warning">Pinned</Badge> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            className={`rounded-md p-2 transition ${
              note.isPinned ? 'bg-amber-300/12 text-amber-200' : 'text-app-text-muted hover:bg-white/6'
            }`}
          >
            <FiStar />
          </button>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-app-text-muted">
          {note.preview}
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-app-text-muted">
          Last edited {formatDate(note.lastEdited)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon={FiEye} onClick={() => onView(note)}>
            View
          </Button>
          <Button size="sm" variant="ghost" icon={FiEdit3} onClick={() => onEdit(note)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" icon={FiShare2} onClick={() => onShare(note)}>
            Share
          </Button>
          <Button size="sm" variant="danger" icon={FiTrash2} onClick={() => onDelete(note.id)}>
            Delete
          </Button>
        </div>
      </div>
    </BaseCard>
  )
}
