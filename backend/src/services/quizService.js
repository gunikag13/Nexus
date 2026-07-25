import Quiz from '../models/Quiz.js'
import Note from '../models/Note.js'
import { createActivity } from './activityService.js'

const formatQuizSet = ({ questions, note }) => ({
  id: note._id.toString(),
  noteId: note._id.toString(),
  title: note.title,
  subject: note.subject,
  createdDate: questions[0]?.createdAt,
  questions,
})

export const getQuizSets = async ({ userId }) => {
  const questions = await Quiz.find({ user: userId }).sort({ createdAt: -1 })
  const noteIds = [...new Set(questions.map((question) => question.note.toString()))]
  const notes = await Note.find({ _id: { $in: noteIds }, user: userId })
  const notesById = new Map(notes.map((note) => [note._id.toString(), note]))

  return noteIds
    .map((noteId) => ({
      note: notesById.get(noteId),
      questions: questions.filter((question) => question.note.toString() === noteId),
    }))
    .filter((quizSet) => quizSet.note)
    .map(formatQuizSet)
}

export const completeQuiz = async ({ noteId, score, total, userId }) => {
  const note = await Note.findOne({ _id: noteId, user: userId })

  if (!note) {
    const error = new Error('Quiz not found.')
    error.statusCode = 404
    throw error
  }

  await createActivity({
    userId,
    noteId: note._id,
    type: 'QUIZ_COMPLETED',
    title: 'Completed Quiz',
    detail: `${note.title}: ${score}/${total}`,
  })
}

