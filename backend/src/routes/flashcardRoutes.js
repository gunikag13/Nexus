import express from 'express'
import {
  deleteFlashcardDeckHandler,
  getFlashcardDecksHandler,
} from '../controllers/flashcardController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getFlashcardDecksHandler)
router.delete('/decks/:noteId', deleteFlashcardDeckHandler)

export default router

