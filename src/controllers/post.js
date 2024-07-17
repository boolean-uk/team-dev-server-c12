import { getAllPostsDb, getPostByIdDb } from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
}

export const getAll = async (req, res) => {
  const getPosts = await getAllPostsDb()
  const posts = getPosts.map((post) => {
    const { user } = post
    if (user && user.profile) {
      return {
        id: post.id,
        content: post.content,
        author: {
          cohortId: user.cohortId,
          role: user.role,
          ...user.profile
        }
      }
    }
    return post
  })
  return sendDataResponse(res, 200, { posts: posts })
}

export const getPostByID = async (req, res) => {
  const postId = Number(req.params.id)

  const found = await getPostByIdDb(postId)

  if (!found) {
    return sendDataResponse(res, 401, {error: "Post not found by that Id"})
  }
  const {id, content} = found

  return sendDataResponse(res, 200, {post: {id, content}})
}
