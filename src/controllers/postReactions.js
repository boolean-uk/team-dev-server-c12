import { getPostReactionsDb, getPostUserReactionDb, likePostDb, unsetReactionPostDb } from "../domain/postReaction.js"
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'


export const getReactions = async (req, res) => {
    try {
        sendDataResponse(res, 200, { reactions: await getPostReactionsDb() })
    } catch (err) {
        console.err(err)
        sendMessageResponse(res, 502, "Oopsie daisy...something bad happened with the database")
    }
}

export const togglePostLike = async (req, res) => {
    const { id } = req.user
    const postId = req.params.id

    try {

        const currentReaction = (await getPostUserReactionDb(id, postId)).reaction

        if (!currentReaction) {
            await likePostDb(postId, id)
        } else {
            await unsetReactionPostDb(postId, id)
        }

        sendDataResponse(res, 204)

    } catch (err) {
        console.error(err)
        sendMessageResponse(res, 502, "Oopsie daisy...something bad happened with the database")
    }

}
