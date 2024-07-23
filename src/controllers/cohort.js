import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  const { startDate, endDate } = req.body

  if (!startDate || !endDate) {
    return sendMessageResponse(res, 400, { error: ERR.DATE_REQUIRED })
  }

  try {
    const { parsedStartDate, parsedEndDate } = validation.dateValidation(
      startDate,
      endDate
    )
    const createdCohort = await createCohort(parsedStartDate, parsedEndDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    console.error('error creating cohort:', e)
    if (e.message === ERR.DATE_REQUIRED || e.message === ERR.DATE_FORMATTING) {
      return sendMessageResponse(res, 400, { error: e.message })
    }
    return sendMessageResponse(res, 500, 'unable to create cohort!')
  }
}
