import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      trim: true,
    },
    subject: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      trim: true,
      default: '',
    },
    isPinned: {
      type: Boolean,
      default: false,
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

noteSchema.index({ user: 1, createdAt: -1 })
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 })

const Note = mongoose.model('Note', noteSchema)

export default Note

