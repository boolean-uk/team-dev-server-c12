import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { startDate, endDate } = req.body
  if (!startDate || !endDate) {
    return sendMessageResponse(res, 400, 'missing fields in request body')
  }
  try {
    const createdCohort = await createCohort(startDate, endDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}
