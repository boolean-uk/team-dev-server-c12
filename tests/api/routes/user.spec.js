import supertest from 'supertest'
import app from '../../../src/server.js'

describe('Users Endpoint', () => {
  describe('POST/ users', () => {
    it('should create/register a user', async () => {
      const request = {
        firstName: 'Jonny',
        lastName: 'Smith',
        email: 'jonny@smith.com',
        bio: 'lorem',
        githubUsername: 'ipsum',
        password: 'Password!1',
        username: 'string',
        mobile: 'string'
      }

      const response = await supertest(app).post('/users').send(request)

      const { user } = response.body.data

      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(user.firstName).toEqual('Jonny')
    })

    it('should reject registration if no email supplied', async () => {
      const request = {
        firstName: 'Jonny',
        lastName: 'Smith',
        email: '',
        bio: 'lorem',
        githubUsername: 'ipsum',
        password: 'Password!1',
        username: 'string',
        mobile: 'string'
      }

      const response = await supertest(app).post('/users').send(request)

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.data.error).toEqual('Email is required')
    })

    it('should reject registration if password does not meet requirements', async () => {
      const request = {
        firstName: 'Jonny',
        lastName: 'Smith',
        email: 'jonny@smith.com',
        bio: 'lorem',
        githubUsername: 'ipsum',
        password: 'password!1',
        username: 'string',
        mobile: 'string'
      }

      const response = await supertest(app).post('/users').send(request)

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.data.error).toEqual(
        'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
      )
    })
  })
})
