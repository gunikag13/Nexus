import express from 'express'
import {
  createTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  updateTaskHandler,
} from '../controllers/taskController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/').get(getTasksHandler).post(createTaskHandler)
router.route('/:id').put(updateTaskHandler).delete(deleteTaskHandler)

export default router

