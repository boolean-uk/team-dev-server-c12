import { createCohort, getAllCohorts } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'
import ERR from '../utils/errors.js'
import { dateRegex } from '../utils/regexMatchers.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { name, course, startDate, endDate } = req.body

  const courseInUse = await dbClient.cohort.findUnique({
    where: {
      course: course
    }
  })

  if (courseInUse) {
    return sendMessageResponse(res, 409, { error: ERR.COURSE_IN_USE })
  }

  if (!name || !course || !startDate || !endDate) {
    return sendMessageResponse(res, 400, { error: ERR.DATE_REQUIRED })
  }

  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return sendMessageResponse(res, 400, { error: ERR.DATE_FORMATTING })
  }

  try {
    const { parsedStartDate, parsedEndDate } = validation.dateValidation(
      startDate,
      endDate
    )
    const createdCohort = createCohort(
      name,
      course,
      parsedStartDate,
      parsedEndDate
    )

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    console.error('error creating cohort:', e)
    if (e.message === ERR.DATE_REQUIRED || e.message === ERR.DATE_FORMATTING) {
      return sendMessageResponse(res, 400, { error: e.message })
    }
    return sendMessageResponse(res, 500, ERR.UNABLE_TO_CREATE_COHORT)
  }
}

export const getAll = async (req, res) => {
  try {
    const foundCohorts = await getAllCohorts()
    return sendDataResponse(res, 200, { cohorts: foundCohorts })
  } catch (e) {
    console.error(ERR.UNABLE_TO_GET_COHORTS, e)
    return sendMessageResponse(res, 500, { error: ERR.UNABLE_TO_GET_COHORTS })
  }
}
