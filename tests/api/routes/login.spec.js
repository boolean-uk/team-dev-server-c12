import supertest from 'supertest'
import app from '../../../src/server.js'

describe('login endpoint', () => {
  describe('POST /login', () => {
    it('should allow registered users to log in', async () => {
      const registerRequest = {
        firstName: 'Jonny',
        lastName: 'Smith',
        email: 'jonny@smith.com',
        bio: 'lorem',
        githubUsername: 'ipsum',
        password: 'Password!1',
        username: 'string',
        mobile: 'string'
      }
      const registerResponse = await supertest(app)
        .post('/users')
        .send(registerRequest)
      const user = registerResponse.body.data.user

      const loginRequest = {
        email: user.email,
        password: 'Password!1'
      }

      const loginResponse = await supertest(app)
        .post('/login')
        .send(loginRequest)

      expect(loginResponse.body.status).toEqual('success')
      expect(loginResponse.body.data.token).not.toEqual(undefined)
    })
  })
})
