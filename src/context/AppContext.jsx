import { useEffect, useState } from 'react'
import { AppContext } from './app-context.js'
import { authService, setAuthToken } from '../services/api.js'
import {
  activities,
  aiSuggestions,
  flashcardSets,
  notes,
  notifications,
  quotes,
  tasks,
  user,
  weeklyStudyData,
} from '../utils/mockData.js'

const THEME_KEY = 'nexus-theme'
const TOKEN_KEY = 'nexus-token'
const USER_KEY = 'nexus-user'

function buildUserProfile(profile) {
  const name = profile?.name || user.name

  return {
    ...user,
    ...profile,
    id: profile?.id || profile?._id || user.id,
    avatar: name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    course: profile?.course || user.course,
    streak: profile?.streak || user.streak,
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    return storedUser ? buildUserProfile(JSON.parse(storedUser)) : user
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [noteItems, setNoteItems] = useState(notes)
  const [taskItems, setTaskItems] = useState(tasks)
  const [flashcardItems] = useState(flashcardSets)
  const [activityItems] = useState(activities)
  const [suggestions] = useState(aiSuggestions)
  const [notificationItems] = useState(notifications)
  const [studyChart] = useState(weeklyStudyData)
  const [quoteOfTheDay] = useState(quotes[1])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setAuthLoading(false)
        return
      }

      setAuthToken(token)

      try {
        const response = await authService.getMe()
        const restoredUser = buildUserProfile(response.data.data.user)

        setCurrentUser(restoredUser)
        localStorage.setItem(USER_KEY, JSON.stringify(restoredUser))
      } catch {
        setToken('')
        setAuthToken('')
        setCurrentUser(user)
        localStorage.removeItem(USER_KEY)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [token])

  const completeAuth = ({ user: authenticatedUser, token: authToken }) => {
    const nextUser = buildUserProfile(authenticatedUser)

    setToken(authToken)
    setAuthToken(authToken)
    setCurrentUser(nextUser)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const login = async (credentials) => {
    const response = await authService.login(credentials)
    completeAuth(response.data.data)
    return response.data
  }

  const signup = async (payload) => {
    const response = await authService.signup(payload)
    completeAuth(response.data.data)
    return response.data
  }

  const logout = async () => {
    try {
      if (token) {
        await authService.logout()
      }
    } finally {
      setToken('')
      setAuthToken('')
      setCurrentUser(user)
      localStorage.removeItem(USER_KEY)
    }
  }

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))
  }

  const addTask = (task) => {
    setTaskItems((previous) => [
      {
        id: `task-${Date.now()}`,
        completed: false,
        ...task,
      },
      ...previous,
    ])
  }

  const toggleTask = (taskId) => {
    setTaskItems((previous) =>
      previous.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTaskItems((previous) => previous.filter((task) => task.id !== taskId))
  }

  const addNote = (note) => {
    setNoteItems((previous) => [
      {
        id: `note-${Date.now()}`,
        lastEdited: new Date().toISOString(),
        favorite: false,
        ...note,
      },
      ...previous,
    ])
  }

  const updateNote = (noteId, updates) => {
    setNoteItems((previous) =>
      previous.map((note) =>
        note.id === noteId
          ? {
              ...note,
              ...updates,
              preview: updates.content
                ? updates.content.replaceAll('#', '').replaceAll('\n', ' ').slice(0, 100)
                : note.preview,
              lastEdited: new Date().toISOString(),
            }
          : note,
      ),
    )
  }

  const deleteNote = (noteId) => {
    setNoteItems((previous) => previous.filter((note) => note.id !== noteId))
  }

  const toggleFavoriteNote = (noteId) => {
    setNoteItems((previous) =>
      previous.map((note) =>
        note.id === noteId ? { ...note, favorite: !note.favorite } : note,
      ),
    )
  }

  return (
    <AppContext.Provider
      value={{
        activityItems,
        addNote,
        addTask,
        currentUser,
        deleteNote,
        deleteTask,
        flashcardItems,
        authLoading,
        isAuthenticated: Boolean(token && currentUser?.email),
        login,
        logout,
        noteItems,
        notificationItems,
        quoteOfTheDay,
        searchQuery,
        setSearchQuery,
        signup,
        studyChart,
        suggestions,
        taskItems,
        theme,
        toggleFavoriteNote,
        toggleTask,
        toggleTheme,
        updateNote,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
