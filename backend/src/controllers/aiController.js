import {
  generateFlashcards,
  generateQuiz,
  generateStudyText,
} from '../services/aiService.js'

const textTypeByRoute = {
  summarize: 'summarize',
  explain: 'explain',
  'key-concepts': 'keyConcepts',
  'study-tips': 'studyTips',
  mnemonics: 'mnemonics',
  'revision-sheet': 'revisionSheet',
}

const formatFlashcard = (flashcard) => ({
  id: flashcard._id.toString(),
  question: flashcard.question,
  answer: flashcard.answer,
  note: flashcard.note.toString(),
  createdAt: flashcard.createdAt,
})

const formatQuizQuestion = (question) => ({
  id: question._id.toString(),
  question: question.question,
  options: question.options,
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  note: question.note.toString(),
  createdAt: question.createdAt,
})

const sendResponse = (response, statusCode, message, data = {}) => {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

const getNoteId = (request) => request.body.noteId

export const generateTextHandler = (routeType) => async (request, response, next) => {
  try {
    const result = await generateStudyText({
      noteId: getNoteId(request),
      type: textTypeByRoute[routeType],
      userId: request.user._id,
    })

    return sendResponse(response, 200, 'AI output generated successfully.', {
      noteId: result.note._id.toString(),
      type: result.type,
      output: result.output,
    })
  } catch (error) {
    return next(error)
  }
}

export const generateFlashcardsHandler = async (request, response, next) => {
  try {
    const result = await generateFlashcards({
      noteId: getNoteId(request),
      userId: request.user._id,
    })

    return sendResponse(response, 201, 'Flashcards generated successfully.', {
      noteId: result.note._id.toString(),
      flashcards: result.flashcards.map(formatFlashcard),
    })
  } catch (error) {
    return next(error)
  }
}

export const generateQuizHandler = async (request, response, next) => {
  try {
    const result = await generateQuiz({
      noteId: getNoteId(request),
      userId: request.user._id,
    })

    return sendResponse(response, 201, 'Quiz generated successfully.', {
      noteId: result.note._id.toString(),
      quiz: result.quiz.map(formatQuizQuestion),
    })
  } catch (error) {
    return next(error)
  }
}

