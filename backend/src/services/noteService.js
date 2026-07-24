import mongoose from 'mongoose'
import Note from '../models/Note.js'

const MAX_TITLE_LENGTH = 150
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

const createHttpError = (statusCode, message) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const normalizeTags = (tags = []) => {
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  if (!Array.isArray(tags)) {
    return []
  }

  return tags.map((tag) => String(tag).trim()).filter(Boolean)
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const validateNotePayload = ({ title, content }) => {
  if (!title?.trim()) {
    throw createHttpError(400, 'Title is required.')
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    throw createHttpError(400, 'Title cannot exceed 150 characters.')
  }

  if (!content?.trim()) {
    throw createHttpError(400, 'Content is required.')
  }
}

const buildNotePayload = (payload) => ({
  title: payload.title.trim(),
  content: payload.content.trim(),
  subject: payload.subject?.trim() || 'General',
  tags: normalizeTags(payload.tags),
  color: payload.color?.trim() || '',
})

const ensureValidNoteId = (noteId) => {
  if (!mongoose.isValidObjectId(noteId)) {
    throw createHttpError(400, 'Invalid note id.')
  }
}

const getOwnedNote = async (noteId, userId) => {
  ensureValidNoteId(noteId)

  const note = await Note.findOne({
    _id: noteId,
    user: userId,
  })

  if (!note) {
    throw createHttpError(404, 'Note not found.')
  }

  return note
}

const getPagination = ({ page, limit }) => {
  const currentPage = Math.max(Number(page) || DEFAULT_PAGE, 1)
  const pageSize = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT)

  return {
    currentPage,
    pageSize,
    skip: (currentPage - 1) * pageSize,
  }
}

const getSort = (sort) => {
  if (sort === 'oldest') {
    return { createdAt: 1 }
  }

  if (sort === 'pinned') {
    return { isPinned: -1, updatedAt: -1 }
  }

  return { createdAt: -1 }
}

const buildListFilter = ({ userId, search, subject }) => {
  const filter = { user: userId }

  if (subject && subject !== 'All') {
    filter.subject = subject
  }

  if (search?.trim()) {
    const searchRegex = new RegExp(escapeRegex(search.trim()), 'i')
    filter.$or = [
      { title: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ]
  }

  return filter
}

export const createNote = async ({ userId, payload }) => {
  validateNotePayload(payload)

  return Note.create({
    ...buildNotePayload(payload),
    user: userId,
  })
}

export const getNotes = async ({ userId, query }) => {
  const { currentPage, pageSize, skip } = getPagination(query)
  const filter = buildListFilter({
    userId,
    search: query.search,
    subject: query.subject,
  })

  const [notes, total] = await Promise.all([
    Note.find(filter).sort(getSort(query.sort)).skip(skip).limit(pageSize),
    Note.countDocuments(filter),
  ])

  return {
    notes,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize) || 1,
    },
  }
}

export const getNoteById = async ({ noteId, userId }) => {
  return getOwnedNote(noteId, userId)
}

export const updateNote = async ({ noteId, userId, payload }) => {
  validateNotePayload(payload)

  const note = await getOwnedNote(noteId, userId)
  note.set(buildNotePayload(payload))

  return note.save()
}

export const deleteNote = async ({ noteId, userId }) => {
  const note = await getOwnedNote(noteId, userId)
  await note.deleteOne()

  return note
}

export const toggleNotePin = async ({ noteId, userId }) => {
  const note = await getOwnedNote(noteId, userId)
  note.isPinned = !note.isPinned

  return note.save()
}
