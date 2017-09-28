import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async ({ postId, toUserId, message }) => {
  try {
    if (!postId || !toUserId || !message) {
      throw new Error('api: "ReplyPost.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_BBS}/v3/bbs/reply`,
      data: {
        post_id: postId,
        to_user_id: toUserId,
        message: message,
        type: 1,
        pid: 0,
        one_level_id: 0
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
