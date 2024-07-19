import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'

export const create = async (req, res) => {
  const parseAndValidateDate = (dateString) => {
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/
    if (!dateRegex.test(dateString)) {
      return null
    }
    const [year, month, day] = dateString.split('/').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.toISOString().startsWith(dateString.replace(/\//g, '-'))
      ? date
      : null
  }
  const { startDate, endDate } = req.body
  if (!startDate || !endDate) {
    return sendMessageResponse(res, 400, 'missing fields in request body')
  }
  const parsedStartDate = parseAndValidateDate(startDate)
  const parsedEndDate = parseAndValidateDate(endDate)

  try {
    validation.date(parsedStartDate, parsedEndDate)
  } catch (e) {
    return sendDataResponse(res, 400, { error: e.message })
  }

  try {
    const createdCohort = await createCohort(parsedStartDate, parsedEndDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}
