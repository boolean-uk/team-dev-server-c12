import { Router } from 'express'
import { createComment, getAllComments } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllComments)
router.post('/:id', validateAuthentication, createComment)

export default router
