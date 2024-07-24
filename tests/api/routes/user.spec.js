import supertest from 'supertest'
import app from '../../../src/server.js'
import jwt from 'jsonwebtoken'
import { createUser } from '../../helpers/createUser.js'

describe('Users Endpoint', () => {
  describe('POST /users', () => {
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
  describe('GET users/:id', () => {
    it('should get a user by ID', async () => {
      const user = await createUser(
        'newuser@boolean.org',
        'password',
        'STUDENT'
      )

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET
      )

      const response = await supertest(app)
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toEqual(200)
      expect(response.body.data.user.email).toEqual(user.email)
    })
    it('should throw an error if no user exists with that ID', async () => {
      const user1 = await createUser(
        'newuser@boolean.org',
        'password',
        'STUDENT'
      )
      const user2 = await createUser(
        'newuser2@boolean.org',
        'password2',
        'STUDENT'
      )

      const token = jwt.sign(
        { userId: user1.id, email: user1.email },
        process.env.JWT_SECRET
      )

      let idToSearch = 1
      while (idToSearch === user1.id || idToSearch === user2.id) {
        idToSearch++
      }

      const response = await supertest(app)
        .get(`/users/${idToSearch}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toEqual(404)
      expect(response.body.data.error).toEqual('User not found by that Id')
    })
  })
  describe('GET users/', () => {
    it('should get all users', async () => {
      const user1 = await createUser(
        'newuser@boolean.org',
        'password',
        'STUDENT'
      )
      await createUser('newuser2@boolean.org', 'password2', 'STUDENT')

      const token = jwt.sign(
        { userId: user1.id, email: user1.email },
        process.env.JWT_SECRET
      )

      const response = await supertest(app)
        .get(`/users`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.body.status).toEqual('success')
      expect(response.body.data.users.length).toEqual(2)
    })
  })
})
