import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

dotenv.config()

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

app.get('/api/health', (_request, response) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1

  if (!isDatabaseConnected) {
    return response.status(503).json({
      success: false,
      database: 'Disconnected',
    })
  }

  return response.status(200).json({
    success: true,
    message: 'NEXUS Backend Running',
    database: 'Connected',
  })
})

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
    data: {},
  })
})

app.use((error, _request, response, _next) => {
  const statusCode = error.statusCode || 500

  if (statusCode >= 500) {
    console.error('[APP] Unhandled error:', error.message)
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map((validationError) => validationError.message)
        .join(' '),
      data: {},
    })
  }

  return response.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    data: {},
  })
})

export default app
