import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiBookOpen, FiPlus, FiSearch } from 'react-icons/fi'
import AIOutputModal from '../../components/modals/AIOutputModal.jsx'
import Button from '../../components/buttons/Button.jsx'
import EmptyState from '../../components/cards/EmptyState.jsx'
import NoteCard from '../../components/cards/NoteCard.jsx'
import Input from '../../components/forms/Input.jsx'
import NoteEditorModal from '../../components/modals/NoteEditorModal.jsx'
import NotePreviewModal from '../../components/modals/NotePreviewModal.jsx'
import { noteSortOptions } from '../../constants/app.js'
import { useAppContext } from '../../hooks/useAppContext.js'
import { subjects } from '../../utils/mockData.js'

const aiTemplates = {
  summary: (note) => `## Summary\n\n- ${note.title} covers the main concepts of ${note.subject}.\n- Focus on the key definitions, examples, and comparisons.\n- Review this note once more before your next revision block.`,
  eli5: (note) => `## Explain Like I'm 5\n\nImagine ${note.subject} is a game with simple rules. This note is teaching you the rules in small steps so you can play the game without getting confused.`,
  flashcards: (note) => `## Flashcards\n\n1. **Q:** What is the core topic of "${note.title}"?\n   **A:** ${note.subject}\n\n2. **Q:** What should you remember first?\n   **A:** The major concept and one example from the note.`,
  quiz: (note) => `## Mini Quiz\n\n1. What is the main idea behind **${note.title}**?\n2. Which example from the note best explains the concept?\n3. What is one likely exam question from this topic?`,
}

export default function NotesPage() {
  const {
    addNote,
    deleteNote,
    noteItems,
    searchQuery,
    toggleFavoriteNote,
    updateNote,
  } = useAppContext()
  const [selectedNote, setSelectedNote] = useState(null)
  const [editorNote, setEditorNote] = useState(null)
  const [localSearch, setLocalSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [sortBy, setSortBy] = useState('latest')
  const [aiState, setAiState] = useState({
    loading: false,
    note: null,
    output: '',
    title: '',
  })

  const filteredNotes = useMemo(() => {
    const combinedQuery = `${searchQuery} ${localSearch}`.toLowerCase().trim()
    let nextNotes = noteItems.filter((note) => {
      const matchesSearch = `${note.title} ${note.preview} ${note.subject}`
        .toLowerCase()
        .includes(combinedQuery)
      const matchesSubject =
        subjectFilter === 'All' || note.subject === subjectFilter

      return matchesSearch && matchesSubject
    })

    if (sortBy === 'latest') {
      nextNotes = nextNotes.sort(
        (first, second) => new Date(second.lastEdited) - new Date(first.lastEdited),
      )
    }

    if (sortBy === 'oldest') {
      nextNotes = nextNotes.sort(
        (first, second) => new Date(first.lastEdited) - new Date(second.lastEdited),
      )
    }

    if (sortBy === 'alphabetical') {
      nextNotes = nextNotes.sort((first, second) => first.title.localeCompare(second.title))
    }

    if (sortBy === 'favorites') {
      nextNotes = nextNotes.filter((note) => note.favorite)
    }

    return nextNotes
  }, [localSearch, noteItems, searchQuery, sortBy, subjectFilter])

  const blankNote = {
    id: '',
    title: '',
    subject: 'General',
    content: '',
  }

  const handleAddNote = () => {
    setEditorNote(blankNote)
  }

  const handleSaveNote = () => {
    if (!editorNote.title.trim() || !editorNote.content.trim()) {
      toast.error('Title and markdown content are required.')
      return
    }

    if (editorNote.id) {
      updateNote(editorNote.id, editorNote)
      toast.success('Note updated.')
    } else {
      addNote({
        ...editorNote,
        preview: editorNote.content.replaceAll('#', '').replaceAll('\n', ' ').slice(0, 100),
      })
      toast.success('Note created.')
    }

    setEditorNote(null)
  }

  const handleAiAction = (type, note) => {
    setAiState({
      loading: true,
      note,
      output: '',
      title: `AI ${type}`,
    })

    window.setTimeout(() => {
      setAiState({
        loading: false,
        note,
        output: aiTemplates[type](note),
        title:
          type === 'summary'
            ? 'AI Summary'
            : type === 'eli5'
              ? "Explain Like I'm 5"
              : type === 'flashcards'
                ? 'Generated Flashcards'
                : 'Generated Quiz',
      })
    }, 900)
  }

  return (
    <div className="surface-grid">
      <section className="glass-panel-strong tech-frame rounded-[24px] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="pill">
              <FiBookOpen />
              Knowledge hub
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-app-text">
              Notes
            </h1>
            <p className="mt-2 text-app-text-muted">
              Search, sort, edit in markdown, and trigger AI study actions from one surface.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            <Input
              placeholder="Search notes"
              rightIcon={FiSearch}
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
            />
            <select
              className="h-12 rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <select
              className="h-12 rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {noteSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button icon={FiPlus} onClick={handleAddNote}>
              Add Note
            </Button>
          </div>
        </div>
      </section>

      {filteredNotes.length ? (
        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={(noteId) => {
                deleteNote(noteId)
                toast.success('Note deleted.')
              }}
              onEdit={setEditorNote}
              onShare={() => toast('Share will connect to backend later.', { icon: '🔗' })}
              onToggleFavorite={(noteId) => {
                toggleFavoriteNote(noteId)
                toast.success('Favorite updated.')
              }}
              onView={setSelectedNote}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No notes found"
          description="Try changing your filters or create a new note to start building your study base."
          action={<Button onClick={handleAddNote}>Create Note</Button>}
        />
      )}

      <NotePreviewModal
        note={selectedNote}
        onAiAction={handleAiAction}
        onClose={() => setSelectedNote(null)}
        onEdit={(note) => {
          setSelectedNote(null)
          setEditorNote(note)
        }}
      />

      <NoteEditorModal
        form={editorNote ?? blankNote}
        isOpen={Boolean(editorNote)}
        onCancel={() => setEditorNote(null)}
        onChange={(field, value) =>
          setEditorNote((previous) => ({
            ...(previous ?? blankNote),
            [field]: value,
          }))
        }
        onSave={handleSaveNote}
        subjects={subjects}
      />

      <AIOutputModal
        content={aiState.output}
        isLoading={aiState.loading}
        isOpen={Boolean(aiState.note)}
        onClose={() => setAiState({ loading: false, note: null, output: '', title: '' })}
        onCopy={() => {
          navigator.clipboard.writeText(aiState.output)
          toast.success('Copied AI output.')
        }}
        onRegenerate={() => handleAiAction('summary', aiState.note)}
        onSave={() => toast.success('Saved to note actions queue.')}
        title={aiState.title}
      />
    </div>
  )
}
