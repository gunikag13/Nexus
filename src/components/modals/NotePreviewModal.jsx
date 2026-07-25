import ReactMarkdown from 'react-markdown'
import Button from '../buttons/Button.jsx'
import Badge from '../cards/Badge.jsx'
import Modal from './Modal.jsx'
import { formatDate } from '../../utils/helpers.js'

const aiActions = [
  { label: 'Summarize', type: 'summary' },
  { label: "Explain Like I'm 5", type: 'explain' },
  { label: 'Key Concepts', type: 'keyConcepts' },
  { label: 'Study Tips', type: 'studyTips' },
  { label: 'Mnemonics', type: 'mnemonics' },
  { label: 'Revision Sheet', type: 'revisionSheet' },
  { label: 'Generate Flashcards', type: 'flashcards' },
  { label: 'Generate Quiz', type: 'quiz' },
]

export default function NotePreviewModal({
  generatingAction,
  note,
  onAiAction,
  onClose,
  onEdit,
}) {
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
              {aiActions.map((action) => (
                <Button
                  key={action.type}
                  disabled={Boolean(generatingAction)}
                  loading={generatingAction === action.type}
                  variant="secondary"
                  onClick={() => onAiAction(action.type, note)}
                >
                  {action.label}
                </Button>
              ))}
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
