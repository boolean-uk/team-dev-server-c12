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

export const getCohortById = async (cohortId) => {
  const foundCohort = await dbClient.cohort.findUniqueOrThrow({
    where: {
      id: cohortId
    },
    include: {
      users: {
        select: {
          id: true,
          cohortId: true,
          role: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bio: true,
              githubUsername: true
            }
          }
        }
      }
    }
  })

  if (foundCohort) {
    return { ...foundCohort, users: flatten(foundCohort) }
  }

  return foundCohort
}

function flatten(foundCohort) {
  const formattedCohort = foundCohort.users.map((user) => {
    const { profile, ...rest } = user
    return { ...profile, ...rest }
  })

  return formattedCohort
}

async function getAllCohorts() {
  return await dbClient.cohort.findMany({
    orderBy: {
      id: 'desc'
    }
  })
}

export { getAllCohorts }
