import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { createCourse, getAllCourses } from '../controllers/course.js'

const route = Router()

route.get('/', validateAuthentication, getAllCourses)
route.post('/', validateAuthentication, createCourse)

export default route
