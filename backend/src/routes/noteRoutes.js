import express from 'express'
import {
  createNoteHandler,
  deleteNoteHandler,
  getNoteByIdHandler,
  getNotesHandler,
  toggleNotePinHandler,
  updateNoteHandler,
} from '../controllers/noteController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.route('/').post(createNoteHandler).get(getNotesHandler)
router.route('/:id').get(getNoteByIdHandler).put(updateNoteHandler).delete(deleteNoteHandler)
router.patch('/:id/pin', toggleNotePinHandler)

export default router

