import {
  FiBookOpen,
  FiCalendar,
  FiHome,
  FiLayers,
  FiSettings,
  FiZap,
} from 'react-icons/fi'

export const navItems = [
  { label: 'Dashboard', icon: FiHome, to: '/dashboard' },
  { label: 'Notes', icon: FiBookOpen, to: '/notes' },
  { label: 'Flashcards', icon: FiLayers, to: '/flashcards' },
  { label: 'Planner', icon: FiCalendar, to: '/planner' },
  { label: 'Quiz', icon: FiZap, to: '/quiz' },
  { label: 'Settings', icon: FiSettings, to: '/settings' },
]

export const priorityOptions = ['High', 'Medium', 'Low']

export const subjectOptions = ['All', 'AI', 'DBMS', 'OS', 'Math', 'General', 'Getting Started', 'AI Guide', 'Computer Science']

export const noteSortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Pinned', value: 'pinned' },
]
