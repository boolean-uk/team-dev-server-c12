import { emailRegex, passwordRegex } from './regexMatchers.js'
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
export function date(parsedStartDate, parsedEndDate) {
  if (!parsedStartDate || !parsedEndDate) {
    throw Error(ERR.DATE_FORMATTING)
  }
}
