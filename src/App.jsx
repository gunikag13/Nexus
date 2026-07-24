import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import { useAppContext } from './hooks/useAppContext.js'
import LandingPage from './pages/Landing/LandingPage.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import FlashcardsPage from './pages/Flashcards/FlashcardsPage.jsx'
import LoginPage from './pages/Login/LoginPage.jsx'
import NotesPage from './pages/Notes/NotesPage.jsx'
import NotFoundPage from './pages/NotFound/NotFoundPage.jsx'
import PlannerPage from './pages/Planner/PlannerPage.jsx'
import QuizPage from './pages/Quiz/QuizPage.jsx'
import SettingsPage from './pages/Settings/SettingsPage.jsx'
import SignupPage from './pages/Signup/SignupPage.jsx'

function ProtectedRoutes() {
  const { isAuthenticated } = useAppContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

function PublicOnlyRoutes() {
  const { isAuthenticated } = useAppContext()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicOnlyRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
