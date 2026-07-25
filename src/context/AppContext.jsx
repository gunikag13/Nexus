import { useEffect, useState } from 'react'
import { AppContext } from './app-context.js'
import { authService, setAuthToken } from '../services/api.js'

const THEME_KEY = 'nexus-theme'
const TOKEN_KEY = 'nexus-token'
const USER_KEY = 'nexus-user'

const fallbackUser = {
  id: '',
  name: 'Student',
  email: '',
  course: 'Your course',
  avatar: 'ST',
  streak: 0,
}

function buildUserProfile(profile) {
  const name = profile?.name || fallbackUser.name

  return {
    ...fallbackUser,
    ...profile,
    id: profile?.id || profile?._id || fallbackUser.id,
    avatar: name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    course: profile?.course || fallbackUser.course,
    streak: profile?.streak || fallbackUser.streak,
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    return storedUser ? buildUserProfile(JSON.parse(storedUser)) : fallbackUser
  })
  const [searchQuery, setSearchQuery] = useState('')

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
        setCurrentUser(fallbackUser)
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
      setCurrentUser(fallbackUser)
      localStorage.removeItem(USER_KEY)
    }
  }

  const toggleTheme = () => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authLoading,
        isAuthenticated: Boolean(token && currentUser?.email),
        login,
        logout,
        searchQuery,
        setSearchQuery,
        signup,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
