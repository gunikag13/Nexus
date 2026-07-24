import mongoose from 'mongoose'

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    console.error('[DB] MONGODB_URI is required.')
    process.exit(1)
  }

  try {
    const connection = await mongoose.connect(mongoUri)

    console.log('✅ MongoDB Connected')
    console.log(`[DB] Database Name: ${connection.connection.name}`)
  } catch (error) {
    console.error('[DB] MongoDB connection failed.')
    console.error(error.message)
    process.exit(1)
  }
}

