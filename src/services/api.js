import axios from 'axios'

const TOKEN_KEY = 'nexus-token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  delete api.defaults.headers.common.Authorization
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authService = {
  login: (payload) => api.post('/auth/login', payload),
  signup: (payload) => api.post('/auth/signup', payload),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
}

export const getApiErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.code === 'ECONNABORTED') {
    return 'Server request timed out.'
  }

  if (error.request) {
    return 'Server unavailable. Please try again.'
  }

  return 'Something went wrong. Please try again.'
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
