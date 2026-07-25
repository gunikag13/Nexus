import Activity from '../models/Activity.js'

export const createActivity = async ({ userId, noteId = null, type, title, detail = '' }) => {
  return Activity.create({
    type,
    title,
    detail,
    note: noteId,
    user: userId,
  })
}

export const getRecentActivity = async ({ userId, limit = 8 }) => {
  return Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(limit)
}

