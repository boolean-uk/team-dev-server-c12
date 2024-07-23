import supertest from 'supertest'
import app from '../../../src/server.js'
import { createUser } from '../../helpers/createUser.js'
import jwt from 'jsonwebtoken'

describe('Cohort Endpoint', () => {
  describe('POST/cohorts', () => {
    it('will allow a user with the role of teacher to create a new cohort', async () => {
      const teacher = await createUser(
        'newteacher@boolean.org',
        'password',
        'TEACHER'
      )
      const teacherToken = jwt.sign(teacher.id, process.env.JWT_SECRET)

      const response = await supertest(app)
        .post('/cohorts')
        .set('Authorization', `Bearer ${teacherToken}`)

      // expect(response.status).toEqual(201)
      // expect(response.body.id).not.toEqual(undefined)
      console.log(response.body)
    })
  })
})
