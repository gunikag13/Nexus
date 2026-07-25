import Activity from '../models/Activity.js'
import Flashcard from '../models/Flashcard.js'
import Note from '../models/Note.js'
import Quiz from '../models/Quiz.js'

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const formatActivity = (activity) => ({
  id: activity._id.toString(),
  title: activity.title,
  detail: activity.detail,
  type: activity.type,
  time: activity.createdAt,
})

const formatNote = (note) => ({
  id: note._id.toString(),
  title: note.title,
  subject: note.subject,
  preview: note.content.replaceAll('#', '').replaceAll('\n', ' ').slice(0, 100),
  updatedAt: note.updatedAt,
})

export const getDashboard = async ({ userId }) => {
  const sevenDaysAgo = startOfDay(new Date())
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const [
    totalNotes,
    totalFlashcards,
    totalQuizzes,
    recentNotes,
    recentActivity,
    chartActivities,
  ] = await Promise.all([
    Note.countDocuments({ user: userId }),
    Flashcard.countDocuments({ user: userId }),
    Quiz.countDocuments({ user: userId }),
    Note.find({ user: userId }).sort({ updatedAt: -1 }).limit(3),
    Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(6),
    Activity.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }),
  ])

  const activityByDay = new Map()

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(sevenDaysAgo)
    day.setDate(sevenDaysAgo.getDate() + index)
    activityByDay.set(day.toISOString().slice(0, 10), {
      day: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      count: 0,
    })
  }

  chartActivities.forEach((activity) => {
    const key = activity.createdAt.toISOString().slice(0, 10)
    const existing = activityByDay.get(key)

    if (existing) {
      existing.count += 1
    }
  })

  return {
    totalNotes,
    totalFlashcards,
    totalQuizzes,
    pendingTasks: 0,
    recentNotes: recentNotes.map(formatNote),
    recentActivity: recentActivity.map(formatActivity),
    studyChart: [...activityByDay.values()],
  }
}

