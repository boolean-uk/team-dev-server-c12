import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  deleteUserById,
  searchUserByName
} from '../controllers/user.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.delete('/:id', validateAuthentication, deleteUserById)
router.patch('/:id', validateAuthentication, updateById)
router.get('/search', validateAuthentication, searchUserByName)

export default router
