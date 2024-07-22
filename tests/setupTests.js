import dbClient from '../src/utils/dbClient'

const deleteTables = () => {
  const deleteTables = [
    dbClient.cohort.deleteMany(),
    dbClient.deliveryLog.deleteMany()
  ]
  return dbClient.$transaction(deleteTables)
}

global.beforeAll(() => {
  return deleteTables()
})

global.afterEach(() => {
  return deleteTables()
})

global.afterAll(() => {
  return dbClient.$disconnect
})
