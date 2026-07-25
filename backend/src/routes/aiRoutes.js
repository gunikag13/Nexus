import express from 'express'
import {
  generateFlashcardsHandler,
  generateQuizHandler,
  generateTextHandler,
} from '../controllers/aiController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/summarize', generateTextHandler('summarize'))
router.post('/explain', generateTextHandler('explain'))
router.post('/key-concepts', generateTextHandler('key-concepts'))
router.post('/study-tips', generateTextHandler('study-tips'))
router.post('/mnemonics', generateTextHandler('mnemonics'))
router.post('/revision-sheet', generateTextHandler('revision-sheet'))
router.post('/flashcards', generateFlashcardsHandler)
router.post('/quiz', generateQuizHandler)

export default router

