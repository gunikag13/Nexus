import express from 'express'
import { getDashboardHandler } from '../controllers/dashboardController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getDashboardHandler)

export default router

