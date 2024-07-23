import dbClient from '../../src/utils/dbClient.js'
import bcrypt from 'bcrypt'

export const createUser = async (email, password, role) => {
  password = await bcrypt.hash(password, 8)
  return await dbClient.user.create({
    data: {
      email,
      password,
      role
    }
  })
}
