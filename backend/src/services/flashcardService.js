import Flashcard from '../models/Flashcard.js'
import Note from '../models/Note.js'

const formatDeck = ({ cards, note }) => ({
  id: note._id.toString(),
  noteId: note._id.toString(),
  title: note.title,
  subject: note.subject,
  createdDate: cards[0]?.createdAt,
  cards,
})

export const getFlashcardDecks = async ({ userId }) => {
  const flashcards = await Flashcard.find({ user: userId }).sort({ createdAt: -1 })
  const noteIds = [...new Set(flashcards.map((card) => card.note.toString()))]
  const notes = await Note.find({ _id: { $in: noteIds }, user: userId })
  const notesById = new Map(notes.map((note) => [note._id.toString(), note]))

  return noteIds
    .map((noteId) => ({
      note: notesById.get(noteId),
      cards: flashcards.filter((card) => card.note.toString() === noteId),
    }))
    .filter((deck) => deck.note)
    .map(formatDeck)
}

export const deleteFlashcardDeck = async ({ noteId, userId }) => {
  const note = await Note.findOne({ _id: noteId, user: userId })

  if (!note) {
    const error = new Error('Flashcard deck not found.')
    error.statusCode = 404
    throw error
  }

  await Flashcard.deleteMany({ note: noteId, user: userId })
}

