import dbClient from '../src/utils/dbClient.js'

const deleteTables = () => {
  console.log('fired')
  const deleteTables = [
    dbClient.deliveryLogLine.deleteMany(),
    dbClient.deliveryLog.deleteMany(),
    dbClient.cohort.deleteMany(),
    dbClient.post.deleteMany(),
    dbClient.note.deleteMany(),
    dbClient.profile.deleteMany(),
    dbClient.user.deleteMany()
  ]
  return dbClient.$transaction(deleteTables)
}

global.beforeAll(() => {
  return deleteTables()
})

global.beforeEach(() => {
  return deleteTables()
})

global.afterEach(() => {
  return deleteTables()
})

global.afterAll(() => {
  return dbClient.$disconnect()
})
