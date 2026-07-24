import { useEffect, useState } from 'react'
import { AppContext } from './app-context.js'
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
const AUTH_KEY = 'nexus-auth'
const USER_KEY = 'nexus-user'

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true'
  })
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    return storedUser ? JSON.parse(storedUser) : user
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
    localStorage.setItem(AUTH_KEY, String(isAuthenticated))
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
  }, [currentUser])

  const login = ({ email }) => {
    const fallbackName = email?.split('@')[0]?.replace(/[._-]+/g, ' ') || user.name

    setCurrentUser((previous) => ({
      ...previous,
      name: previous.name === 'Student' ? fallbackName : previous.name,
      email,
      avatar: (previous.name === 'Student' ? fallbackName : previous.name)
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }))
    setIsAuthenticated(true)
  }

  const signup = ({ email, name }) => {
    setCurrentUser((previous) => ({
      ...previous,
      name,
      email,
      avatar: name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    }))
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
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
        isAuthenticated,
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
