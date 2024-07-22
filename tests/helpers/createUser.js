import dbClient from '../../src/utils/dbClient'
import bcrypt from 'bcrypt'

export const createUser = async (email, password, role) => {
  return await dbClient.user.create({
    data: {
      email: email,
      password: await bcrypt.hash(password, 8),
      role: role
    }
  })
}
