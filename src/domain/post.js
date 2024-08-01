import dbClient from '../utils/dbClient.js'

export const getAllPostsDb = async () => {
  return await dbClient.post.findMany({
    include: {
      comments: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      },
      user: {
        include: {
          profile: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
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

export const updatePostDb = async (postId, content, userId) => {
  return await dbClient.post.update({
    where: {
      id: postId,
      userId: userId
    },
    data: {
      content: content
    }
  })
}
