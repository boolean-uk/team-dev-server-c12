import supertest from 'supertest'
import app from '../../../src/server'
import jwt from 'jsonwebtoken'
import { createUser } from '../../helpers/createUser.js'

describe('DeliveryLog Endpoint', () => {
  describe('POST/deliveryLogs', () => {})
  it('will allow teachers to create delivery logs for each cohort', async () => {
    const teacher = await createUser(
      'newteacher@boolean.org',
      'password',
      'TEACHER'
    )
    const teacherToken = jwt.sign(teacher.id, process.env.JWT_SECRET)

    const request = {
      cohortID: 1,
      lines: 'today in the class we covered abstraction'
    }
    const response = await supertest(app)
      .post('/logs')
      .auth(teacherToken, { type: 'Bearer' })
      .send(request)

    expect(response.status).toEqual(201)
    expect(response.body).not.toEqual(undefined)
    expect(response.body.cohortID).toEqual(1)
    expect(response.body.author.id).toEqual(1)
    expect(response.body.lines).toEqual(
      'today in the class we covered abstraction'
    )
  })
  it('will send a status code 400 if the cohortId or lines is missing from the request body', async () => {
    const teacher = await createUser(
      'newteacher@boolean.org',
      'password',
      'TEACHER'
    )
    const teacherToken = jwt.sign(teacher.id, process.env.JWT_SECRET)

    const request = {}
    const response = await supertest(app)
      .post('/logs')
      .auth(teacherToken, { type: 'Bearer' })
      .send(request)

    expect(response.status).toEqual(400)
    expect(response.body.error).toEqual(
      'Cohort ID AND log-lines must be provided in order to create a delivery log'
    )
  })
  it('will send a status code 404 if the the cohort does not exist', async () => {
    const teacher = await createUser(
      'newteacher@boolean.org',
      'password',
      'TEACHER'
    )
    const teacherToken = jwt.sign(teacher.id, process.env.JWT_SECRET)

    const request = {
      cohortID: 1,
      lines: 'today in the class we covered abstraction'
    }
    const response = await supertest(app)
      .post('/logs')
      .auth(teacherToken, { type: 'Bearer' })
      .send(request)

    expect(response.status).toEqual(404)
    expect(response.body.error).toEqual('No cohort with the provided ID exists')
  })
})
