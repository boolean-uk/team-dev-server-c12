import {
  emailRegex,
  passwordRegex,
  dateRegex,
  nameRegex
} from './regexMatchers.js'
import ERR from './errors.js'

export function register(email, password) {
  if (!email) {
    throw Error(ERR.EMAIL_REQUIRED)
  }

  if (!password) {
    throw Error(ERR.PASSWORD_REQUIRED)
  }

  if (!email.match(emailRegex)) {
    throw Error(ERR.EMAIL_FORMATING)
  }

  if (!password.match(passwordRegex)) {
    throw Error(ERR.PASSWORD_REQUIREMENTS)
  }
}
const parseAndValidateDate = (dateString) => {
  const [year, month, day] = dateString.split('/').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (!date.toISOString() && !date.startsWith(dateString.replace(/\//g, '-'))) {
    return null
  } else {
    return date
  }
}
export function dateValidation(startDate, endDate) {
  if (!startDate || !endDate) {
    throw Error(ERR.DATE_REQUIRED)
  }
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    throw Error(ERR.DATE_FORMATTING)
  }

  const parsedStartDate = parseAndValidateDate(startDate)
  const parsedEndDate = parseAndValidateDate(endDate)
  if (!parsedStartDate || !parsedEndDate) {
    throw Error(ERR.DATE_FORMATTING)
  }
  return { parsedStartDate, parsedEndDate }
}

export function validateCanModify(req) {
  const { role, id } = req.user
  const targetUserId = Number(req.params.id)
  const isUser = id === targetUserId
  const isTeacher = role === 'TEACHER'

  if (!isTeacher && !isUser) {
    return false
  }
  return true
}

export function isValidName(name) {
  nameRegex.test(name)
  return true
}
