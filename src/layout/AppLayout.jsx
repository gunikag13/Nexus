import { useState } from 'react'
import Navbar from '../components/navbar/Navbar.jsx'
import Sidebar from '../components/sidebar/Sidebar.jsx'

export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="app-shell mx-auto grid min-h-screen max-w-[1680px] gap-4 px-4 py-4 md:grid-cols-[300px_minmax(0,1fr)] md:px-5">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="relative min-w-0 md:pl-2">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-cyan-300/8 to-transparent" />
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="pb-8">{children}</div>
      </main>
    </div>
  )
}
