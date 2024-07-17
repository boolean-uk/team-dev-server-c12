import { emailRegex, passwordRegex } from './regexMatchers.js'

export function register(email, password) {
  if (!email) {
    throw Error('Email is required')
  }

  if (!password) {
    throw Error('Password is required')
  }

  if (!email.match(emailRegex)) {
    throw Error('Email format invalid')
  }

  if (!password.match(passwordRegex)) {
    throw Error(
      'Password must contain at least one upper case character, at least one number, at least one special character and not be less than 8 characters in length.'
    )
  }
}
