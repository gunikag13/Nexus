import { completeQuiz, getQuizSets } from '../services/quizService.js'

const formatQuestion = (question) => ({
  id: question._id.toString(),
  question: question.question,
  options: question.options,
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  createdAt: question.createdAt,
})

const formatQuizSet = (quizSet) => ({
  ...quizSet,
  questions: quizSet.questions.map(formatQuestion),
})

export const getQuizSetsHandler = async (request, response, next) => {
  try {
    const quizSets = await getQuizSets({ userId: request.user._id })

    return response.status(200).json({
      success: true,
      message: 'Quizzes fetched successfully.',
      data: {
        quizzes: quizSets.map(formatQuizSet),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export const completeQuizHandler = async (request, response, next) => {
  try {
    await completeQuiz({
      noteId: request.params.noteId,
      score: Number(request.body.score) || 0,
      total: Number(request.body.total) || 0,
      userId: request.user._id,
    })

    return response.status(200).json({
      success: true,
      message: 'Quiz completion tracked successfully.',
      data: {},
    })
  } catch (error) {
    return next(error)
  }
}

