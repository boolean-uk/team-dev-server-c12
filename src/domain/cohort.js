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
    }
  })

  return new Cohort(createdCohort)
}

export class Cohort {
  constructor(id = null, startDate, endDate) {
    this.id = id
    this.startDate = startDate
    this.endDate = endDate
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
