import supertest from 'supertest'
import app from '../../../src/server.js'
import jwt from 'jsonwebtoken'
import { createUser } from '../../helpers/createUser.js'
import { createCohort } from '../../helpers/createCohort.js'

describe('DeliveryLog Endpoint', () => {
  describe('POST/logs', () => {
    it('will allow teachers to create delivery logs for each cohort', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const token = jwt.sign(teacher.id, process.env.JWT_SECRET)
      const cohort = await createCohort()

      const request = {
        cohort_id: cohort.id,
        userId: teacher.id,
        lines: [{ id: 1, content: 'today in the class we covered abstraction' }]
      }
      const response = await supertest(app)
        .post('/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(request)

      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body).not.toEqual(undefined)
      expect(response.body.data.log.lines[0].content).toEqual(
        'today in the class we covered abstraction'
      )
    })
    it('will send a status code 400 if the cohortId or lines is missing from the request body', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const token = jwt.sign(teacher.id, process.env.JWT_SECRET)

      const request = {}
      const response = await supertest(app)
        .post('/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(request)

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.data.error).toEqual(
        'Cohort ID AND log-lines must be provided in order to create a delivery log'
      )
    })
    it('will send a status code 404 if the the cohort does not exist', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const token = jwt.sign(teacher.id, process.env.JWT_SECRET)
      const cohort = await createCohort()

      const request = {
        cohort_id: 100,
        lines: 'today in the class we covered abstraction'
      }
      const response = await supertest(app)
        .post('/logs')
        .set('Authorization', `Bearer ${token}`)
        .send(request)

      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.data.error).toEqual(
        'No cohort with the provided ID exists'
      )
    })
  })
})
