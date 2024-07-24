import supertest from 'supertest'
import app from '../../../src/server'
import { beforeEach, describe } from 'node:test'
import { createUser } from '../../helpers/createUser.js'
import dbClient from '../../../src/utils/dbClient.js'

describe('Auth Endpoint', () => {
  describe('POST/auth', () => {
    beforeEach(async () => {
      await dbClient.user.deleteMany()
    })
    it('will allow a user to login', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const request = {
        email: uniqueEmail,
        password: 'password'
      }
      const response = await supertest(app).post('/login').send(request)

      expect(response.status).toEqual(200)
      expect(response.body).not.toEqual(undefined)
      expect(response.body.data.user.email).toEqual(uniqueEmail)
    })
    it('will return status code 400 if the credentials provided do not match', async () => {
      const uniqueEmail = `testuser${Date.now()}@gmail.com`
      const teacher = await createUser(uniqueEmail, 'password', 'TEACHER')
      const request = {
        email: uniqueEmail,
        password: 'incorrectpassword'
      }
      const response = await supertest(app).post('/login').send(request)

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.data.error).toEqual(
        'The email or password is incorrect'
      )
    })
  })
})
