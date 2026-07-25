import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters.'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    deadline: {
      type: Date,
      default: () => new Date(),
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

taskSchema.index({ user: 1, completed: 1, deadline: 1 })

const Task = mongoose.model('Task', taskSchema)

export default Task

