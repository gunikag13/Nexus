import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiPlus, FiSearch } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import EmptyState from '../../components/cards/EmptyState.jsx'
import ErrorState from '../../components/cards/ErrorState.jsx'
import NoteCard from '../../components/cards/NoteCard.jsx'
import PageLoader from '../../components/cards/PageLoader.jsx'
import Input from '../../components/forms/Input.jsx'
import AIOutputModal from '../../components/modals/AIOutputModal.jsx'
import NoteEditorModal from '../../components/modals/NoteEditorModal.jsx'
import NotePreviewModal from '../../components/modals/NotePreviewModal.jsx'
import { noteSortOptions, subjectOptions } from '../../constants/app.js'
import { useAppContext } from '../../hooks/useAppContext.js'
import { aiService, getApiErrorMessage, notesService } from '../../services/api.js'

const PAGE_LIMIT = 12

const getPreview = (content) => content.replaceAll('#', '').replaceAll('\n', ' ').slice(0, 100)

const normalizeNote = (note) => ({
  ...note,
  preview: getPreview(note.content),
  lastEdited: note.updatedAt,
})

const getTagsFromInput = (tagsInput = '') =>
  tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

const toEditorForm = (note) => ({
  ...note,
  tagsInput: note.tags?.join(', ') ?? '',
})

export default function NotesPage() {
  const { searchQuery } = useAppContext()
  const [notes, setNotes] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    pages: 1,
  })
  const [selectedNote, setSelectedNote] = useState(null)
  const [editorNote, setEditorNote] = useState(null)
  const [filters, setFilters] = useState({
    localSearch: '',
    page: 1,
    sortBy: 'newest',
    subjectFilter: 'All',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [aiState, setAiState] = useState({
    generatingAction: '',
    output: '',
    title: '',
    type: '',
  })

  const blankNote = useMemo(
    () => ({
      id: '',
      title: '',
      subject: 'General',
      content: '',
      tagsInput: '',
    }),
    [],
  )

  const loadNotes = useCallback(async (nextFilters = filters) => {
    setIsLoading(true)
    setError('')

    const combinedSearch = `${searchQuery} ${nextFilters.localSearch}`.trim()

    try {
      const response = await notesService.getAll({
        search: combinedSearch,
        subject:
          nextFilters.subjectFilter === 'All' ? undefined : nextFilters.subjectFilter,
        sort: nextFilters.sortBy,
        page: nextFilters.page,
        limit: PAGE_LIMIT,
      })

      setNotes(response.data.data.notes.map(normalizeNote))
      setPagination(response.data.data.pagination)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }, [filters, searchQuery])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadNotes()
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [loadNotes])

  const updateFilters = (updates) => {
    setFilters((previous) => ({
      ...previous,
      ...updates,
      page: updates.page ?? 1,
    }))
  }

  const handleAddNote = () => {
    setEditorNote(blankNote)
  }

  const getPayload = (note) => ({
    title: note.title,
    content: note.content,
    subject: note.subject,
    tags: getTagsFromInput(note.tagsInput),
  })

  const handleSaveNote = async () => {
    if (isSaving) return

    if (!editorNote.title.trim() || !editorNote.content.trim()) {
      toast.error('Title and markdown content are required.')
      return
    }

    if (editorNote.title.trim().length > 150) {
      toast.error('Title cannot exceed 150 characters.')
      return
    }

    setIsSaving(true)

    if (editorNote.id) {
      try {
        const response = await notesService.update(editorNote.id, getPayload(editorNote))
        const updatedNote = normalizeNote(response.data.data.note)

        setNotes((previous) =>
          previous.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
        )
        setSelectedNote((previous) =>
          previous?.id === updatedNote.id ? updatedNote : previous,
        )
        setEditorNote(null)
        toast.success('Note updated.')
      } catch (saveError) {
        toast.error(getApiErrorMessage(saveError))
      } finally {
        setIsSaving(false)
      }

      return
    }

    const temporaryNote = normalizeNote({
      id: `temp-${Date.now()}`,
      ...getPayload(editorNote),
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    setNotes((previous) => [temporaryNote, ...previous])
    setEditorNote(null)

    try {
      const response = await notesService.create(getPayload(editorNote))
      const createdNote = normalizeNote(response.data.data.note)

      setNotes((previous) =>
        previous.map((note) => (note.id === temporaryNote.id ? createdNote : note)),
      )
      setPagination((previous) => ({
        ...previous,
        total: previous.total + 1,
      }))
      toast.success('Note created.')
    } catch (saveError) {
      setNotes((previous) => previous.filter((note) => note.id !== temporaryNote.id))
      toast.error(getApiErrorMessage(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    const previousNotes = notes
    const deletedNote = notes.find((note) => note.id === noteId)

    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId))
    setSelectedNote((previous) => (previous?.id === noteId ? null : previous))

    try {
      await notesService.delete(noteId)
      setPagination((previous) => ({
        ...previous,
        total: Math.max(previous.total - 1, 0),
      }))
      toast.success('Note deleted.')
    } catch (deleteError) {
      setNotes(previousNotes)
      if (deletedNote) {
        setSelectedNote((previous) => previous ?? deletedNote)
      }
      toast.error(getApiErrorMessage(deleteError))
    }
  }

  const handleTogglePin = async (noteId) => {
    const previousNotes = notes

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
      ),
    )

    try {
      const response = await notesService.togglePin(noteId)
      const updatedNote = normalizeNote(response.data.data.note)

      setNotes((currentNotes) =>
        currentNotes.map((note) => (note.id === noteId ? updatedNote : note)),
      )
      setSelectedNote((previous) =>
        previous?.id === noteId ? updatedNote : previous,
      )
      toast.success('Pin status updated.')
    } catch (pinError) {
      setNotes(previousNotes)
      toast.error(getApiErrorMessage(pinError))
    }
  }

  const handleViewNote = async (note) => {
    setSelectedNote(note)

    try {
      const response = await notesService.getById(note.id)
      setSelectedNote(normalizeNote(response.data.data.note))
    } catch (viewError) {
      setSelectedNote(null)
      toast.error(getApiErrorMessage(viewError))
    }
  }

  const handleAiAction = async (type, note) => {
    setAiState({
      generatingAction: type,
      output: '',
      title: '',
      type,
    })

    try {
      if (type === 'flashcards') {
        await aiService.flashcards(note.id)
        toast.success('Flashcards generated.')
        return
      }

      if (type === 'quiz') {
        await aiService.quiz(note.id)
        toast.success('Quiz generated.')
        return
      }

      if (!aiService[type]) {
        toast.error('This AI action is not available yet.')
        return
      }

      const response = await aiService[type](note.id)

      setAiState({
        generatingAction: '',
        output: response.data.data.output,
        title: response.data.message,
        type,
      })
    } catch (aiError) {
      setAiState({
        generatingAction: '',
        output: '',
        title: '',
        type: '',
      })
      toast.error(getApiErrorMessage(aiError))
    } finally {
      if (type === 'flashcards' || type === 'quiz') {
        setAiState({
          generatingAction: '',
          output: '',
          title: '',
          type: '',
        })
      }
    }
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
              Search, sort, edit in markdown, and organize your study notes.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            <Input
              placeholder="Search notes"
              rightIcon={FiSearch}
              value={filters.localSearch}
              onChange={(event) => updateFilters({ localSearch: event.target.value })}
            />
            <select
              className="h-12 rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={filters.subjectFilter}
              onChange={(event) => updateFilters({ subjectFilter: event.target.value })}
            >
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <select
              className="h-12 rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={filters.sortBy}
              onChange={(event) => updateFilters({ sortBy: event.target.value })}
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

      {isLoading ? (
        <PageLoader label="Loading notes" />
      ) : error ? (
        <ErrorState
          title="Could not load notes"
          description={error}
          action={<Button onClick={loadNotes}>Try Again</Button>}
        />
      ) : notes.length ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={(noteToEdit) => setEditorNote(toEditorForm(noteToEdit))}
                onShare={() => toast('Sharing is not part of Module 4 yet.')}
                onTogglePin={handleTogglePin}
                onView={handleViewNote}
              />
            ))}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-app-border bg-white/4 p-4">
            <p className="text-sm text-app-text-muted">
              Page {pagination.page} of {pagination.pages} - {pagination.total} notes
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={FiChevronLeft}
                disabled={filters.page <= 1}
                onClick={() =>
                  updateFilters({ page: Math.max(filters.page - 1, 1) })
                }
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={FiChevronRight}
                disabled={filters.page >= pagination.pages}
                onClick={() =>
                  updateFilters({ page: Math.min(filters.page + 1, pagination.pages) })
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No notes found"
          description="Try changing your filters or create a new note to start building your study base."
          action={<Button onClick={handleAddNote}>Create Note</Button>}
        />
      )}

      <NotePreviewModal
        generatingAction={aiState.generatingAction}
        note={selectedNote}
        onAiAction={handleAiAction}
        onClose={() => setSelectedNote(null)}
        onEdit={(note) => {
          setSelectedNote(null)
          setEditorNote(toEditorForm(note))
        }}
      />

      <AIOutputModal
        content={aiState.output}
        isLoading={Boolean(aiState.generatingAction && aiState.output)}
        isOpen={Boolean(aiState.output)}
        onClose={() =>
          setAiState({ generatingAction: '', output: '', title: '', type: '' })
        }
        onCopy={() => {
          navigator.clipboard.writeText(aiState.output)
          toast.success('Copied AI output.')
        }}
        onRegenerate={() => selectedNote && handleAiAction(aiState.type, selectedNote)}
        onSave={() => toast.success('AI output is ready to copy into your notes.')}
        title={aiState.title || 'AI Output'}
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
        subjects={subjectOptions}
        isSaving={isSaving}
      />
    </div>
  )
}
