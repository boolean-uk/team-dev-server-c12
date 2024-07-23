import prisma from '@prisma/client'

if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
  console.log(`Connected to DB instance: ${process.env.DATABASE_URL}`)
}

const dbClient = new prisma.PrismaClient()

export default dbClient
