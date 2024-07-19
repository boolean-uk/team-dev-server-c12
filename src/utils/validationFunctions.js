import { emailRegex, passwordRegex, dateRegex } from './regexMatchers.js'
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
export function dateValidation(startDate, endDate) {
  if (!startDate) {
    throw Error(ERR.DATE_REQUIRED)
  }
  if (!endDate) {
    throw Error(ERR.DATE_REQUIRED)
  }
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    throw Error(ERR.DATE_FORMATTING)
  }
  const parseAndValidateDate = (dateString) => {
    const [year, month, day] = dateString.split('/').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return date.toISOString().startsWith(dateString.replace(/\//g, '-'))
      ? date
      : null
  }
  const parsedStartDate = parseAndValidateDate(startDate)
  const parsedEndDate = parseAndValidateDate(endDate)
  if (!parsedStartDate || !parsedEndDate) {
    throw Error(ERR.DATE_FORMATTING)
  }
  return { parsedStartDate, parsedEndDate }
}
