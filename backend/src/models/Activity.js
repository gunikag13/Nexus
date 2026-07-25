import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'NOTE_CREATED',
        'NOTE_EDITED',
        'SUMMARY_GENERATED',
        'FLASHCARDS_GENERATED',
        'QUIZ_GENERATED',
        'QUIZ_COMPLETED',
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      default: '',
      trim: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      default: null,
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

activitySchema.index({ user: 1, createdAt: -1 })

const Activity = mongoose.model('Activity', activitySchema)

export default Activity

