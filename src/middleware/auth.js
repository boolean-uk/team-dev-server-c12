import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { JWT_SECRET } from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../domain/user.js'
import ERR from '../utils/errors.js'

export async function validateTeacherRole(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 500, 'Unable to verify user')
  }

  if (req.user.role !== 'TEACHER') {
    return sendDataResponse(res, 403, {
      error: ERR.NOT_AUTHORISED
    })
  }

  next()
}

export async function validateAuthentication(req, res, next) {
  const header = req.header('Authorization')

  if (!header) {
    return sendDataResponse(res, 401, {
      error: ERR.MISSING_AUTH_HEADER
    })
  }

  const [type, token] = header.split(' ')

  const isTypeValid = validateTokenType(type)
  if (!isTypeValid) {
    return sendDataResponse(res, 401, {
      error: `Invalid token type, expected Bearer but got ${type}`
    })
  }

  const isTokenValid = validateToken(token)
  if (!isTokenValid) {
    return sendDataResponse(res, 401, {
      error: ERR.TOKEN_FAILED
    })
  }

  const { userId } = jwt.decode(token)

  const foundUser = await User.findById(Number(userId))

  req.user = foundUser

  next()
}

function validateToken(token) {
  if (!token) {
    return false
  }

  return jwt.verify(token, JWT_SECRET, (error) => {
    return !error
  })
}

function validateTokenType(type) {
  if (!type) {
    return false
  }

  if (type.toUpperCase() !== 'BEARER') {
    return false
  }
  return true
}
