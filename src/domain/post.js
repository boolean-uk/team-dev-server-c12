import dbClient from '../utils/dbClient.js'

export default getAllPostsDb = async () => {
  return await dbClient.post.findMany({
    include: {
          user: true, {
      select: {
              profile: true
          }
      }
    }
  })
}
