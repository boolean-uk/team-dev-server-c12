import { createCohort } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const parseAndValidateDate = (dateString) => {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/
    if (!regex.test(dateString)) {
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

  if (!parsedStartDate || !parsedEndDate) {
    return sendMessageResponse(
      res,
      400,
      'Invalid date format. Please use yyyy/mm/dd.'
    )
  }
  try {
    const createdCohort = await createCohort(parsedStartDate, parsedEndDate)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Unable to create cohort')
  }
}
