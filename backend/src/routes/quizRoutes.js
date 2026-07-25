import express from 'express'
import {
  completeQuizHandler,
  getQuizSetsHandler,
} from '../controllers/quizController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getQuizSetsHandler)
router.post('/:noteId/complete', completeQuizHandler)

export default router

