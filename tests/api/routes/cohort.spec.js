import supertest from 'supertest'
import app from '../../../src/server.js'
import { createUser } from '../../helpers/createUser.js'
import jwt from 'jsonwebtoken'
import { beforeEach } from 'node:test'
import dbClient from '../../../src/utils/dbClient.js'

describe('Cohort Endpoint', () => {
  describe('POST/cohorts', () => {
    beforeEach(async () => {
      await dbClient.user.deleteMany()
    })
    it('will allow a user with the role of teacher to create a new cohort', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const token = jwt.sign(teacher.id, process.env.JWT_SECRET)
      const request = {}
      const response = await supertest(app)
        .post('/cohorts')
        .set('Authorization', `Bearer ${token}`)
        .send(request)

      expect(response.status).toEqual(201)
      expect(response.body).not.toEqual(undefined)
      expect(response.body.data.id).toEqual(3)
    })
  })
})
