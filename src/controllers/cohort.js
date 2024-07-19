import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'

export const create = async (req, res) => {
  const { startDate, endDate } = req.body

  try {
    const { parsedStartDate, parsedEndDate } = validation.dateValidation(
      startDate,
      endDate
    )
    const createdCohort = await createCohort(parsedStartDate, parsedEndDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 400, { error: e.message })
  }
}
