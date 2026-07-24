import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  toggleNotePin,
  updateNote,
} from '../services/noteService.js'

const formatNote = (note) => ({
  id: note._id.toString(),
  title: note.title,
  content: note.content,
  subject: note.subject,
  tags: note.tags,
  color: note.color,
  isPinned: note.isPinned,
  user: note.user.toString(),
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
})

const sendResponse = (response, statusCode, success, message, data = {}) => {
  return response.status(statusCode).json({
    success,
    message,
    data,
  })
}

export const createNoteHandler = async (request, response, next) => {
  try {
    const note = await createNote({
      userId: request.user._id,
      payload: request.body,
    })

    return sendResponse(response, 201, true, 'Note created successfully.', {
      note: formatNote(note),
    })
  } catch (error) {
    return next(error)
  }
}

export const getNotesHandler = async (request, response, next) => {
  try {
    const result = await getNotes({
      userId: request.user._id,
      query: request.query,
    })

    return sendResponse(response, 200, true, 'Notes fetched successfully.', {
      notes: result.notes.map(formatNote),
      pagination: result.pagination,
    })
  } catch (error) {
    return next(error)
  }
}

export const getNoteByIdHandler = async (request, response, next) => {
  try {
    const note = await getNoteById({
      noteId: request.params.id,
      userId: request.user._id,
    })

    return sendResponse(response, 200, true, 'Note fetched successfully.', {
      note: formatNote(note),
    })
  } catch (error) {
    return next(error)
  }
}

export const updateNoteHandler = async (request, response, next) => {
  try {
    const note = await updateNote({
      noteId: request.params.id,
      userId: request.user._id,
      payload: request.body,
    })

    return sendResponse(response, 200, true, 'Note updated successfully.', {
      note: formatNote(note),
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteNoteHandler = async (request, response, next) => {
  try {
    await deleteNote({
      noteId: request.params.id,
      userId: request.user._id,
    })

    return sendResponse(response, 200, true, 'Note deleted successfully.')
  } catch (error) {
    return next(error)
  }
}

export const toggleNotePinHandler = async (request, response, next) => {
  try {
    const note = await toggleNotePin({
      noteId: request.params.id,
      userId: request.user._id,
    })

    return sendResponse(response, 200, true, 'Note pin status updated.', {
      note: formatNote(note),
    })
  } catch (error) {
    return next(error)
  }
}

