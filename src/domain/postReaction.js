import dbClient from '../utils/dbClient.js'

export const getPostReactionsDb = async () => {
    return await dbClient.postLike.findMany()
}
export const getPostUserReactionDb = async (postId, userId) => {
    return await dbClient.postLike.findFirst({
        where: {
            userId,
            postId
        }
    })
}

//=============

export const REACTIONS = {
    //add negative reactions above
    dislike: -1,
    unset: 0,
    like: 1,
    //add positive reactions bellow
}

const postReactionDb = async (postId, userId, reaction) => {
    return await dbClient.postLike.createOrUpdate({
        data: {
            postId: postId,
            userId: userId,
            state: reaction,
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

export const unsetReactionPostDb = (postId, userId) => postReactionDb(postId, userId, REACTIONS.unset)
export const likePostDb = (postId, userId) => postReactionDb(postId, userId, REACTIONS.like)
