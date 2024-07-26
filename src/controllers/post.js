import { getAllPostsDb, getPostByIdDb } from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'
import ERR from '../utils/errors.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body
  const { id } = req.user

  if (!content) {
    return sendDataResponse(res, 400, { error: ERR.MISSING_CONTENT })
  }

  if (!id) {
    return sendDataResponse(res, 404, { error: ERR.USER_NOT_FOUND })
  }

  const post = await dbClient.post.create({
    data: {
      content: content,
      userId: id
    }
  })

  return res.json({
    post
  })
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

  const found = await getPostByIdDb(postId)

  if (!found) {
    return sendDataResponse(res, 401, { error: ERR.POST_NOT_FOUND })
  }
  const { id, content } = found

  return sendDataResponse(res, 200, { post: { id, content } })
}
