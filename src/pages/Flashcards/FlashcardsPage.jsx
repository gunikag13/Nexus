import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiLayers, FiShuffle } from 'react-icons/fi'
import Button from '../../components/buttons/Button.jsx'
import EmptyState from '../../components/cards/EmptyState.jsx'
import ErrorState from '../../components/cards/ErrorState.jsx'
import FlashcardSetCard from '../../components/cards/FlashcardSetCard.jsx'
import PageLoader from '../../components/cards/PageLoader.jsx'
import Modal from '../../components/modals/Modal.jsx'
import { useAppContext } from '../../hooks/useAppContext.js'
import {
  aiService,
  flashcardsService,
  getApiErrorMessage,
} from '../../services/api.js'
import { subjects } from '../../utils/mockData.js'

export default function FlashcardsPage() {
  const { searchQuery } = useAppContext()
  const [flashcardSets, setFlashcardSets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [busyDeckId, setBusyDeckId] = useState('')
  const [error, setError] = useState('')

  const loadDecks = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await flashcardsService.getAll()
      setFlashcardSets(response.data.data.decks)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadDecks()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredSets = useMemo(() => {
    return flashcardSets.filter((set) => {
      const matchesQuery = `${set.title} ${set.subject}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesSubject = subjectFilter === 'All' || set.subject === subjectFilter
      return matchesQuery && matchesSubject
    })
  }, [flashcardSets, searchQuery, subjectFilter])

  const openSet = (flashcardSet) => {
    setSelectedSet(flashcardSet)
    setCardIndex(0)
    setIsFlipped(false)
  }

  const handleDeleteDeck = async (flashcardSet) => {
    const previousSets = flashcardSets

    setFlashcardSets((sets) => sets.filter((set) => set.noteId !== flashcardSet.noteId))
    setSelectedSet((current) => (current?.noteId === flashcardSet.noteId ? null : current))

    try {
      await flashcardsService.deleteDeck(flashcardSet.noteId)
      toast.success('Flashcard deck deleted.')
    } catch (deleteError) {
      setFlashcardSets(previousSets)
      toast.error(getApiErrorMessage(deleteError))
    }
  }

  const handleRegenerateDeck = async (flashcardSet) => {
    setBusyDeckId(flashcardSet.noteId)

    try {
      await aiService.flashcards(flashcardSet.noteId)
      await loadDecks()
      toast.success('Flashcard deck regenerated.')
    } catch (regenerateError) {
      toast.error(getApiErrorMessage(regenerateError))
    } finally {
      setBusyDeckId('')
    }
  }

  const currentCard = selectedSet?.cards[cardIndex]
  const progress = selectedSet ? ((cardIndex + 1) / selectedSet.cards.length) * 100 : 0

  const moveCard = (direction) => {
    if (!selectedSet) return

    setIsFlipped(false)
    setCardIndex((previous) => {
      const nextIndex = previous + direction

      if (nextIndex < 0) return selectedSet.cards.length - 1
      if (nextIndex >= selectedSet.cards.length) return 0
      return nextIndex
    })
  }

  const shuffleCards = () => {
    if (!selectedSet) return
    setCardIndex(Math.floor(Math.random() * selectedSet.cards.length))
    setIsFlipped(false)
  }

  return (
    <div className="surface-grid">
      <section className="glass-panel-strong tech-frame rounded-[24px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="pill">
              <FiLayers />
              Active recall
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-app-text">
              Flashcards
            </h1>
            <p className="mt-2 text-app-text-muted">
              Practice generated decks with flip motion, shuffle, and progress tracking.
            </p>
          </div>
          <div className="w-full max-w-56">
            <select
              className="h-12 w-full rounded-md border border-app-border bg-slate-950/45 px-4 text-sm text-app-text outline-none"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <PageLoader label="Loading flashcards" />
      ) : error ? (
        <ErrorState
          title="Could not load flashcards"
          description={error}
          action={<Button onClick={loadDecks}>Try Again</Button>}
        />
      ) : filteredSets.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredSets.map((flashcardSet) => (
            <FlashcardSetCard
              key={flashcardSet.id}
              flashcardSet={flashcardSet}
              onDelete={handleDeleteDeck}
              onOpen={openSet}
              onRegenerate={
                busyDeckId === flashcardSet.noteId ? () => {} : handleRegenerateDeck
              }
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No flashcard decks yet"
          description="Generate flashcards from a note to start practicing active recall."
        />
      )}

      <Modal
        isOpen={Boolean(selectedSet)}
        onClose={() => setSelectedSet(null)}
        title={selectedSet?.title ?? 'Flashcards'}
      >
        {selectedSet && currentCard ? (
          <div className="space-y-6">
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm text-app-text-muted">
              <span>
                Card {cardIndex + 1} of {selectedSet.cards.length}
              </span>
              <span>{selectedSet.subject}</span>
            </div>
            <div
              className="[perspective:1200px] cursor-pointer"
              onClick={() => setIsFlipped((previous) => !previous)}
            >
              <motion.div
                className="relative h-72 w-full rounded-[28px]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.45 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="glass-panel absolute inset-0 flex items-center justify-center rounded-[28px] p-8 text-center [backface-visibility:hidden]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-app-text-muted">
                      Question
                    </p>
                    <p className="mt-4 text-2xl font-semibold leading-9 text-app-text">
                      {currentCard.question}
                    </p>
                  </div>
                </div>
                <div className="glass-panel absolute inset-0 flex items-center justify-center rounded-[28px] p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-app-text-muted">
                      Answer
                    </p>
                    <p className="mt-4 text-xl leading-8 text-app-text">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" icon={FiChevronLeft} onClick={() => moveCard(-1)}>
                Previous
              </Button>
              <Button variant="ghost" icon={FiShuffle} onClick={shuffleCards}>
                Shuffle
              </Button>
              <Button variant="secondary" icon={FiChevronRight} onClick={() => moveCard(1)}>
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
