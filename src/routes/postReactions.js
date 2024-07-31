import { Router } from 'express'
import { getReactions, togglePostLike } from '../controllers/postReactions.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.use(validateAuthentication)
router.get('/', getReactions)
router.get('/:id', togglePostLike)

export default router
