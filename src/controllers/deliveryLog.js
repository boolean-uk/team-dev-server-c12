import { getCohortById } from '../domain/cohort.js'
import { createDeliveryLogDb } from '../domain/deliveryLog.js'
import { sendDataResponse } from '../utils/responses.js'

export const createDeliveryLog = async (req, res) => {
  const { cohort_id: cohortId, lines } = req.body

  if (!cohortId || !lines) {
    throw new Error(
      'Cohort id and Line must be provided in order to create a Delivery log'
    )
  }

  try {
    const existing = await getCohortById(cohortId)

    if (!existing) {
      throw new Error('No cohort with the provided id exists')
    }
    const log = await createDeliveryLogDb(cohortId, req.user.id, lines)

    return sendDataResponse(res, 201, {
      data: {
        log: {
          id: log.id,
          cohortId: cohortId,
          author: {
            id: log.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName
          },
          lines: log.lines.map((line) => ({
            id: line.id,
            content: line.content
          }))
        }
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the delivery log.'
    })
  }
}
