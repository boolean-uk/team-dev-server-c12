import dbClient from '../../src/utils/dbClient'
import bcrypt from 'bcrypt'

export const createUser = async (email, password) => {
  return await dbClient.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 8)
    }
  })
}
