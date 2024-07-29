import dbClient from '../utils/dbClient.js'

const getAllCommentsDb = async () => {
  return await dbClient.comment.findMany()
}

const createCommentDb = async (content, id, postId) => {
  return await dbClient.comment.create({
    data: {
      content: content,
      userId: id,
      postId: postId
    },
    include: {
      user: {
        select: {
          profile: true
        }
      }
    }
  })
}

export { getAllCommentsDb, createCommentDb }
