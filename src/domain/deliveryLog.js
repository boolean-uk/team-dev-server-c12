import dbClient from '../utils/dbClient.js'

export const createDeliveryLogDb = async (cohortId, userId, lines) => {

  const linesArray = Array.isArray(lines) ? lines : []

  return await dbClient.deliveryLog.create({
    data: {
      cohort: {
        connect: { id: cohortId }
      },
      user: {
        connect: { id: userId }
      },
      lines: {
        create: linesArray.map((line) => ({
          content: line.content
        }))
      }
    },
    include: {
      user: true,
      lines: true
    }
  })
}
