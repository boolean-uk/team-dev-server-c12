import supertest from 'supertest'
import app from '../../../src/server.js'
import { createTeacher, createUser } from '../../helpers/createUser.js'
import jwt from 'jsonwebtoken'

describe('Cohort Endpoint', () => {
  describe('POST/cohorts', () => {
    it('will allow a user with the role of teacher to create a new cohort', async () => {
      const teacher = await createTeacher(
        'teacher@boolean.org',
        'password',
        'TEACHER'
      )
      const token = jwt.sign(teacher.id, process.env.JWT_SECRET)
      const request = {}
      const response = await supertest(app)
        .post('/cohorts')
        .auth(token, { type: 'bearer' })
        .send(request)

      expect(response.status).toEqual(201)
      expect(response.body.id).not.toEqual(undefined)
    })
  })
})
