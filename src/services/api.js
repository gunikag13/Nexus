import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  signup: (payload) => api.post('/auth/signup', payload),
}

export const notesService = {
  getAll: () => api.get('/notes'),
  create: (payload) => api.post('/notes', payload),
  update: (id, payload) => api.put(`/notes/${id}`, payload),
  delete: (id) => api.delete(`/notes/${id}`),
}

export const flashcardsService = {
  getAll: () => api.get('/flashcards'),
}

export const tasksService = {
  getAll: () => api.get('/tasks'),
  create: (payload) => api.post('/tasks', payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
}
