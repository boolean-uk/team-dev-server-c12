import { findPostById, getAllPostsDb, updatePostDb } from '../domain/post.js'
import dbClient from '../utils/dbClient.js'
import ERR from '../utils/errors.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body
  const { id } = req.user

  if (!content) {
    return sendDataResponse(res, 400, { error: ERR.MISSING_CONTENT })
  }

  const post = await dbClient.post.create({
    data: {
      content: content,
      userId: id
    }
  })

  return sendDataResponse(res, 201, { post })
}

export const getAll = async (req, res) => {
  const commentsLimit = parseInt(req.query.comments) || undefined

  try {
    const getPosts = await getAllPostsDb()

    const posts = getPosts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      comments: post.comments.slice(0, commentsLimit).map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        author: {
          id: comment.user.profile?.id,
          firstName: comment.user.profile?.firstName,
          lastName: comment.user.profile?.lastName,
          bio: comment.user.profile?.bio
        }
      })),
      author: {
        id: post.user.profile?.id,
        firstName: post.user.profile?.firstName,
        lastName: post.user.profile?.lastName,
        bio: post.user.profile?.bio
      }
    }))

    return sendDataResponse(res, 200, { posts })
  } catch (error) {
    return sendMessageResponse(res, 500, { error: ERR.INTERNAL_ERROR })
  }
}

export const getPostByID = async (req, res) => {
  const postId = Number(req.params.id)

  const found = await findPostById(postId)

  if (!found) {
    return sendDataResponse(res, 404, { error: ERR.POST_NOT_FOUND })
  }
  const { id, content } = found

  return sendDataResponse(res, 200, { post: { id, content } })
}

export const updatePostById = async (req, res) => {
  const postId = Number(req.params.id)
  const { content } = req.body
  const { id: userId } = req.user

  const foundPost = await findPostById(postId)

  if (!foundPost) {
    return sendDataResponse(res, 404, { error: ERR.POST_NOT_FOUND })
  }

  if (foundPost.userId !== userId) {
    return sendDataResponse(res, 403, { error: ERR.NOT_AUTHORISED })
  }

  try {
    const updatedPost = await updatePostDb(postId, content, userId)

    return sendDataResponse(res, 200, { post: updatedPost })
  } catch (error) {
    console.error(ERR.UNABLE_TO_UPDATE_POST, error)
    return sendMessageResponse(res, 500, ERR.UNABLE_TO_UPDATE_POST)
  }
}
