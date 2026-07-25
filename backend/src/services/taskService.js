import Task from '../models/Task.js'

const createHttpError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const getOwnedTask = async ({ taskId, userId }) => {
  const task = await Task.findOne({ _id: taskId, user: userId })

  if (!task) {
    throw createHttpError(404, 'Task not found.')
  }

  return task
}

const buildTaskPayload = (payload) => ({
  title: payload.title.trim(),
  priority: payload.priority || 'Medium',
  deadline: payload.deadline ? new Date(payload.deadline) : new Date(),
  completed: Boolean(payload.completed),
})

export const getTasks = async ({ userId }) => {
  return Task.find({ user: userId }).sort({ completed: 1, deadline: 1, createdAt: -1 })
}

export const createTask = async ({ payload, userId }) => {
  if (!payload.title?.trim()) {
    throw createHttpError(400, 'Task title is required.')
  }

  return Task.create({
    ...buildTaskPayload(payload),
    user: userId,
  })
}

export const updateTask = async ({ payload, taskId, userId }) => {
  const task = await getOwnedTask({ taskId, userId })

  if (payload.title !== undefined && !payload.title?.trim()) {
    throw createHttpError(400, 'Task title is required.')
  }

  if (payload.title !== undefined) task.title = payload.title.trim()
  if (payload.priority !== undefined) task.priority = payload.priority
  if (payload.deadline !== undefined) task.deadline = new Date(payload.deadline)
  if (payload.completed !== undefined) task.completed = Boolean(payload.completed)

  return task.save()
}

export const deleteTask = async ({ taskId, userId }) => {
  const task = await getOwnedTask({ taskId, userId })
  await task.deleteOne()
}

