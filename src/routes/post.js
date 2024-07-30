import { Router } from 'express'
import { create, getAll, getPostByID } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()
router.use(validateAuthentication)

router.post('/', create)
router.get('/', getAll)
router.get('/:id', getPostByID)
router.get('/like/:id', () => { })

export default router
