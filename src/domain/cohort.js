import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(name, startDate, endDate) {
  const createdCohort = await dbClient.cohort.create({
    data: {
      name,
      startDate,
      endDate
    },
    include: {
      users: true,
      deliveryLogs: true
    }
  })

  return new Cohort(createdCohort)
}

export class Cohort {
  constructor(id = null) {
    this.id = id
  }

  toJSON() {
    return {
      cohort: {
        id: this.id,
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate
      }
    }
  }
}

export const getCohortById = (cohortId) => {
  return dbClient.cohort.findFirst({
    where: {
      id: cohortId
    }
  })
}

async function getAllCohorts() {
  return await dbClient.cohort.findMany({
    orderBy: {
      id: 'desc'
    }
  })
}

export { getAllCohorts }
