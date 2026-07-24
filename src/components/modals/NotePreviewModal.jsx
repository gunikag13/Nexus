import ReactMarkdown from 'react-markdown'
import Button from '../buttons/Button.jsx'
import Badge from '../cards/Badge.jsx'
import Modal from './Modal.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function NotePreviewModal({ note, onAiAction, onClose, onEdit }) {
  return (
    <Modal isOpen={Boolean(note)} onClose={onClose} title={note?.title ?? 'Preview'}>
      {note ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info">{note.subject}</Badge>
            {note.isPinned ? <Badge variant="warning">Pinned</Badge> : null}
            {note.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            <span className="text-sm text-app-text-muted">
              Last edited {formatDate(note.lastEdited)}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-sm leading-7 text-app-text-muted">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>

          {onAiAction ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="secondary" onClick={() => onAiAction('summary', note)}>
                Summarize
              </Button>
              <Button variant="secondary" onClick={() => onAiAction('eli5', note)}>
                Explain Like I&apos;m 5
              </Button>
              <Button variant="secondary" onClick={() => onAiAction('flashcards', note)}>
                Generate Flashcards
              </Button>
              <Button variant="secondary" onClick={() => onAiAction('quiz', note)}>
                Generate Quiz
              </Button>
            </div>
          ) : null}

          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => onEdit(note)}>
              Edit Note
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
