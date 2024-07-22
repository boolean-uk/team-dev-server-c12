import dotenv from 'dotenv'
import { exec } from 'node:child_process'
dotenv.config()

try {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
  console.log(`Connected to DB instance: ${process.env.DATABASE_URL}`)

  exec('npx prisma migrate reset --force', { encoding: 'utf-8' })
  exec('npx prisma generate', { encoding: 'utf-8' })
} catch (e) {
  console.log('An error occured with the test db migration:', e)
}
