import dbClient from '../../src/utils/dbClient'

export const createCohort = async () => {
  return await dbClient.cohort.create({
    data: {
      id: 1
    }
  })
}
