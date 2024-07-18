import { getCohortById } from '../domain/cohort.js'
import { createDeliveryLogDb } from '../domain/deliveryLog.js'
import { sendDataResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

export const createDeliveryLog = async (req, res) => {
  const { cohort_id: cohortId, lines } = req.body
  const { firstName, lastName } = req.user

  try {
    if (!cohortId || !lines) {
      throw Error(ERR.INCOMPLETE_REQUEST)
    }

    const cohortExists = await getCohortById(cohortId)
    if (!cohortExists) {
      throw Error(ERR.COHORT_NOT_FOUND)
    }

    const log = await createDeliveryLogDb(cohortId, req.user.id, lines)

    return sendDataResponse(res, 201, {
      data: {
        log: {
          id: log.id,
          cohortId: cohortId,
          date: log.date,
          author: {
            id: log.user.id,
            firstName,
            lastName
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
    if (error.message === ERR.INCOMPLETE_REQUEST) {
      return res.status(400).json({
        status: 'error',
        data: error.message
      })
    } else if (error.message === ERR.COHORT_NOT_FOUND) {
      return res.status(404).json({
        status: 'error',
        data: error.message
      })
    } else {
      return res.status(500).json({
        status: 'error',
        data: ERR.DELIVERY_LOG_GENERIC_ERROR
      })
    }
  }
}
