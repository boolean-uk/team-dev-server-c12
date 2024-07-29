import dbClient from '../utils/dbClient.js'

const getAllCommentsDb = async () => {
  return await dbClient.comment.findMany()
}

const postFound = async (postId) => {
  return await dbClient.post.findUnique({
    where: {
      id: postId
    }
  })
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

const getAllPostCommentsDb = async (post) => {
  return await dbClient.comment.findMany({
    where: {
      postId: post.id
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

export { getAllCommentsDb, postFound, createCommentDb, getAllPostCommentsDb }
