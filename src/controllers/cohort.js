import { createCohort, getAllCohorts, getCohortById } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  const { name, users, startDate, endDate } = req.body

  try {
    validation.validateCreateCohort(name, users, startDate, endDate)
  } catch (e) {
    return sendDataResponse(res, 400, { error: e.message })
  }

  try {
    const { parsedStartDate, parsedEndDate } = validation.dateValidation(
      startDate,
      endDate
    )
    const createdCohort = await createCohort(
      name,
      users,
      parsedStartDate,
      parsedEndDate
    )

    return sendDataResponse(res, 201, { cohort: createdCohort })
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

export const getById = async (req, res) => {
  const cohortId = Number(req.params.id)

  try {
    const foundCohort = await getCohortById(cohortId)

    if (!foundCohort) {
      return sendDataResponse(res, 404, {
        error: ERR.COHORT_NOT_FOUND
      })
    }

    return sendDataResponse(res, 200, { cohort: foundCohort })
  } catch (e) {
    console.error(ERR.UNABLE_TO_GET_COHORT, e)
    return sendMessageResponse(res, 500, { error: ERR.UNABLE_TO_GET_COHORT })
  }
}
