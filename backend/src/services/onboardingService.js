import { defaultNotes } from '../constants/defaultNotes.js'
import { defaultTasks } from '../constants/defaultTasks.js'
import Note from '../models/Note.js'
import Task from '../models/Task.js'

const getStarterDeadline = (index) => {
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + index)
  return deadline
}

export const createStarterContent = async (userId) => {
  const [existingNotesCount, existingTasksCount] = await Promise.all([
    Note.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId }),
  ])

  const operations = []

  if (existingNotesCount === 0) {
    operations.push(
      Note.insertMany(
        defaultNotes.map((note) => ({
          ...note,
          tags: [],
          color: '',
          user: userId,
        })),
      ),
    )
  }

  if (existingTasksCount === 0) {
    operations.push(
      Task.insertMany(
        defaultTasks.map((task, index) => ({
          ...task,
          priority: index === 0 ? 'Low' : 'Medium',
          deadline: getStarterDeadline(index),
          user: userId,
        })),
      ),
    )
  }

  await Promise.all(operations)
}

