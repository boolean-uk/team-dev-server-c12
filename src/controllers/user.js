import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import * as validation from '../utils/validationFunctions.js'
import ERR from '../utils/errors.js'

export const create = async (req, res) => {
  try {
    validation.register(req.body.email, req.body.password)
  } catch (e) {
    return sendDataResponse(res, 400, { error: e.message })
  }

  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { error: ERR.EMAIL_IN_USE })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    console.error(ERR.UNABLE_TO_CREATE_USER, error)
    return sendMessageResponse(res, 500, ERR.UNABLE_TO_CREATE_USER)
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  const { cohort_id: cohortId } = req.body
  const paramsId = Number(req.params.id)
  const { id } = req.user
  const foundUser = await User.findById(paramsId)

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }
  if (!foundUser) {
    return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
  }
  const canPatch = validation.validateCanPatch(req)
  if (!canPatch) {
    return sendDataResponse(res, 403, { error: ERR.NOT_AUTHORISED })
  }
  const updatedUser = await User.updateUser(id, req.body)
  return sendDataResponse(res, 200, { user: updatedUser })
}

export const deleteUserById = async (req, res) => {
  const id = Number(req.params.id)
  const user = req.user
  console.log(id)
  console.log(typeof id)

  try {
    const userToDelete = await User.findById(id)

    if (userToDelete.id !== id || user.role !== 'TEACHER') {
      return res.status(401).json({
        status: 'error',
        data: ERR.DELETE_NOT_ALLOWED
      })
    }

    if (!userToDelete) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    const deletedUser = User.deleteUserByIdDb(userToDelete)
    return sendDataResponse(res, 201, { deleted_user: deletedUser })
  } catch (error) {
    console.error('An error occurred while creating the delivery log', error)
    return res.status(500).json({
      status: 'error',
      data: ERR.DELETE_GENERIC_ERROR
    })
  }
}
