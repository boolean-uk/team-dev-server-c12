import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'

const getAllCourses = async (req, res) => {
  const courses = await dbClient.course.findMany()

  return sendDataResponse(res, 200, courses)
}

const createCourse = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return sendMessageResponse(res, 400, { error: ERR.INCOMPLETE_REQUEST })
  }

  const course = await dbClient.course.create({
    data: {
      name: name
    }
  })

  return sendDataResponse(res, 201, course)
}

export { getAllCourses, createCourse }
