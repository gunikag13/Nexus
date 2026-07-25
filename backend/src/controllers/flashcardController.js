import {
  deleteFlashcardDeck,
  getFlashcardDecks,
} from '../services/flashcardService.js'

const formatCard = (card) => ({
  id: card._id.toString(),
  question: card.question,
  answer: card.answer,
  createdAt: card.createdAt,
})

const formatDeck = (deck) => ({
  ...deck,
  createdDate: deck.createdDate,
  cards: deck.cards.map(formatCard),
})

export const getFlashcardDecksHandler = async (request, response, next) => {
  try {
    const decks = await getFlashcardDecks({ userId: request.user._id })

    return response.status(200).json({
      success: true,
      message: 'Flashcard decks fetched successfully.',
      data: {
        decks: decks.map(formatDeck),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteFlashcardDeckHandler = async (request, response, next) => {
  try {
    await deleteFlashcardDeck({
      noteId: request.params.noteId,
      userId: request.user._id,
    })

    return response.status(200).json({
      success: true,
      message: 'Flashcard deck deleted successfully.',
      data: {},
    })
  } catch (error) {
    return next(error)
  }
}

