import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(startDate, endDate) {
  const createdCohort = await dbClient.cohort.create({
    data: {
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
        startDate: this.startDate,
        endDate: this.endDate
      }
    }
  }
}
