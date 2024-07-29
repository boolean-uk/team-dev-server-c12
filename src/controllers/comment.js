import { sendDataResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'
import { createCommentDb, getAllCommentsDb } from '../domain/comment.js'
import { findPostById } from '../domain/post.js'

const getAllComments = async (req, res) => {
  const comments = await getAllCommentsDb()

  return sendDataResponse(res, 200, { comments })
}

const createComment = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: ERR.MISSING_CONTENT })
  }

  const { id } = req.user
  const postId = Number(req.params.id)

  const post = await findPostById(postId)

  if (!post) {
    return sendDataResponse(res, 404, { error: ERR.POST_NOT_FOUND })
  }

  const comment = await createCommentDb(content, id, postId)

  return sendDataResponse(res, 201, { comment })
}

export { getAllComments, createComment }
