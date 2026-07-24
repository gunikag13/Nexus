import dotenv from 'dotenv'
import app from './app.js'
import { connectDatabase } from './config/database.js'

dotenv.config()

const PORT = Number(process.env.PORT) || 5000

const startServer = async () => {
  await connectDatabase()

  app.listen(PORT, () => {
    console.log(`[SERVER] NEXUS backend listening on port ${PORT}`)
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer()
