import User from '../domain/user.js'
import { createNoteDb } from '../domain/note.js'
import ERR from '../utils/errors.js'
import { sendDataResponse } from '../utils/responses.js'

export const createNote = async (req, res) => {
  const { teacherId, studentId, content } = req.body
  const contentIsValid = content.length > 0

  if (!studentId || !content) {
    return sendDataResponse(res, 400, { error: ERR.INCOMPLETE_REQUEST })
  }

  if (!contentIsValid) {
    return sendDataResponse(res, 400, { error: ERR.INVALID_NOTE_CONTENT })
  }

  try {
    const studentExists = await User.findById(studentId)
    if (!studentExists) {
      return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
    }

    const note = await createNoteDb(teacherId, studentId, content)

    return sendDataResponse(res, 201, {
      data: {
        note: {
          id: note.id,
          teacherId: note.teacherId,
          studentId: note.studentId,
          content: note.content
        }
      }
    })
  } catch (error) {
    console.error('An error occured while adding the note', error)
    return sendDataResponse(res, 500, { error: ERR.INTERNAL_ERROR })
  }
}
