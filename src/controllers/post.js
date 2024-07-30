import { getAllPostsDb, findPostById, updatePostDb } from '../domain/post.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'
import dbClient from '../utils/dbClient.js'

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
  const getPosts = await getAllPostsDb()
  const posts = getPosts.map((post) => {
    const { user } = post

    if (!user.profile) {
      return post
    }
    return {
      id: post.id,
      content: post.content,
      comments: post.user.comments,
      author: {
        id: user.profile.id,
        cohortId: user.cohortId,
        role: user.role,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        bio: user.profile.bio,
        githubUrl: user.profile.githubUrl
      }
    }
  })
  return sendDataResponse(res, 200, { posts: posts })
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
