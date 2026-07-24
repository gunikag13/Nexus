import ReactMarkdown from 'react-markdown'
import Button from '../buttons/Button.jsx'
import LoadingSpinner from '../cards/LoadingSpinner.jsx'
import Modal from './Modal.jsx'

export default function AIOutputModal({
  content,
  isLoading,
  isOpen,
  onClose,
  onCopy,
  onRegenerate,
  onSave,
  title,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {isLoading ? (
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <LoadingSpinner className="mx-auto h-10 w-10 text-cyan-200" />
            <p className="mt-4 text-sm text-app-text-muted">Generating AI output...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="prose prose-invert max-w-none text-sm leading-7 text-app-text-muted">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onCopy}>
              Copy
            </Button>
            <Button variant="secondary" onClick={onSave}>
              Save
            </Button>
            <Button onClick={onRegenerate}>Regenerate</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
