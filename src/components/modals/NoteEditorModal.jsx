import Button from '../buttons/Button.jsx'
import Input from '../forms/Input.jsx'
import Modal from './Modal.jsx'

export default function NoteEditorModal({
  form,
  isOpen,
  onCancel,
  onChange,
  onSave,
  subjects,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={form.id ? 'Edit Note' : 'Create Note'}
    >
      <div className="space-y-5">
        <Input
          label="Title"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
        />
        <div className="space-y-2">
          <span className="hud-label text-app-text">Subject</span>
          <select
            className="h-12 w-full rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
            value={form.subject}
            onChange={(event) => onChange('subject', event.target.value)}
          >
            {subjects.filter((item) => item !== 'All').map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <label className="block space-y-2">
          <span className="hud-label text-app-text">Markdown Editor</span>
          <textarea
            rows={12}
            className="w-full rounded-md border border-app-border bg-slate-950/45 px-4 py-4 text-sm text-app-text outline-none focus:border-cyan-300/50"
            value={form.content}
            onChange={(event) => onChange('content', event.target.value)}
          />
        </label>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.16em] text-app-text-muted">
            Auto save indicator: Draft synced locally
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
