import mongoose from 'mongoose'

const flashcardSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required.'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required.'],
      trim: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

flashcardSchema.index({ user: 1, note: 1, createdAt: -1 })

const Flashcard = mongoose.model('Flashcard', flashcardSchema)

export default Flashcard

