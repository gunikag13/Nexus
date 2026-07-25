import Button from '../buttons/Button.jsx'
import BaseCard from './BaseCard.jsx'
import { formatDate } from '../../utils/helpers.js'

export default function FlashcardSetCard({
  flashcardSet,
  onDelete,
  onOpen,
  onRegenerate,
}) {
  return (
    <BaseCard className="flex h-full flex-col justify-between gap-6">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-teal-300/15 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200">
          {flashcardSet.subject}
        </span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-app-text">
            {flashcardSet.title}
          </h3>
          <p className="mt-2 text-sm text-app-text-muted">
            {flashcardSet.cards.length} cards
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-app-text-muted">
          Created {formatDate(flashcardSet.createdDate)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onOpen(flashcardSet)}>
            Open
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRegenerate(flashcardSet)}>
            Regenerate
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(flashcardSet)}>
            Delete
          </Button>
        </div>
      </div>
    </BaseCard>
  )
}
