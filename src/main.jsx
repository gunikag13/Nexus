import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#091223',
              color: '#ecf3ff',
              border: '1px solid rgba(91, 120, 170, 0.24)',
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
