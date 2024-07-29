import dbClient from '../utils/dbClient.js'

export const getAllPostsDb = async () => {
  return await dbClient.post.findMany({
    include: {
      user: {
        select: {
          cohortId: true,
          role: true,
          profile: true,
          comments: true
        }
      }
    }
  })
}

export const findPostById = async (postId) => {
  return await dbClient.post.findUnique({
    where: {
      id: postId
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
