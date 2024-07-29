import { Router } from 'express'
import {
  createComment,
  getAllComments,
  getAllPostComments
} from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllComments)
router.post('/:id', validateAuthentication, createComment)
router.get('/:id', validateAuthentication, getAllPostComments)

export default router
