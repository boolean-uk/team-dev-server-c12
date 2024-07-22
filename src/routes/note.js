import { Router } from 'express'
import { createNote } from '../controllers/note.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, createNote)

export default router
