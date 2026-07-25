import Flashcard from '../models/Flashcard.js'
import Quiz from '../models/Quiz.js'
import { createActivity } from './activityService.js'
import { generateJson, generateText } from './openaiService.js'
import { getNoteById } from './noteService.js'

const createHttpError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const textActivityMap = {
  summarize: 'SUMMARY_GENERATED',
}

const textTitleMap = {
  summarize: 'Generated Summary',
  explain: 'Generated Simple Explanation',
  keyConcepts: 'Extracted Key Concepts',
  studyTips: 'Generated Study Tips',
  mnemonics: 'Generated Mnemonics',
  revisionSheet: 'Generated Revision Sheet',
}

const normalizeFlashcards = (items) =>
  items.slice(0, 10).map((item) => ({
    question: String(item.question || '').trim(),
    answer: String(item.answer || '').trim(),
  })).filter((item) => item.question && item.answer)

const normalizeQuiz = (items) =>
  items.slice(0, 10).map((item) => ({
    question: String(item.question || '').trim(),
    options: Array.isArray(item.options)
      ? item.options.slice(0, 4).map((option) => String(option).trim())
      : [],
    correctAnswer: Number(item.correctAnswer),
    explanation: String(item.explanation || '').trim(),
  })).filter(
    (item) =>
      item.question &&
      item.options.length === 4 &&
      item.options.every(Boolean) &&
      Number.isInteger(item.correctAnswer) &&
      item.correctAnswer >= 0 &&
      item.correctAnswer <= 3,
  )

export const generateStudyText = async ({ noteId, type, userId }) => {
  const note = await getNoteById({ noteId, userId })
  const output = await generateText({ type, note })

  await createActivity({
    userId,
    noteId: note._id,
    type: textActivityMap[type] || 'SUMMARY_GENERATED',
    title: textTitleMap[type],
    detail: note.title,
  })

  return {
    note,
    type,
    output,
  }
}

export const generateFlashcards = async ({ noteId, userId }) => {
  const note = await getNoteById({ noteId, userId })
  const generatedItems = normalizeFlashcards(await generateJson({ type: 'flashcards', note }))

  if (!generatedItems.length) {
    throw createHttpError(500, 'AI did not return valid flashcards.')
  }

  await Flashcard.deleteMany({ note: note._id, user: userId })

  const flashcards = await Flashcard.insertMany(
    generatedItems.map((item) => ({
      ...item,
      note: note._id,
      user: userId,
    })),
  )

  await createActivity({
    userId,
    noteId: note._id,
    type: 'FLASHCARDS_GENERATED',
    title: 'Generated Flashcards',
    detail: note.title,
  })

  return {
    note,
    flashcards,
  }
}

export const generateQuiz = async ({ noteId, userId }) => {
  const note = await getNoteById({ noteId, userId })
  const generatedItems = normalizeQuiz(await generateJson({ type: 'quiz', note }))

  if (!generatedItems.length) {
    throw createHttpError(500, 'AI did not return a valid quiz.')
  }

  await Quiz.deleteMany({ note: note._id, user: userId })

  const quiz = await Quiz.insertMany(
    generatedItems.map((item) => ({
      ...item,
      note: note._id,
      user: userId,
    })),
  )

  await createActivity({
    userId,
    noteId: note._id,
    type: 'QUIZ_GENERATED',
    title: 'Generated Quiz',
    detail: note.title,
  })

  return {
    note,
    quiz,
  }
}
