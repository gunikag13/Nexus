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

export const noteSortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Favorites', value: 'favorites' },
  { label: 'A-Z', value: 'alphabetical' },
]
