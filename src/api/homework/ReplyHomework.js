import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async ({ postId, replyId, toUserId, message, imagesUrl }) => {
  try {
    if (!postId || !toUserId || !message) {
      throw new Error('api: "ReplyHomework.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_EXERCISE}/v3/bbs/reply`,
      data: {
        post_id: postId,
        to_user_id: toUserId,
        message: message,
        images_url: imagesUrl,
        images_w: new Array(imagesUrl.length).fill('0'),
        images_h: new Array(imagesUrl.length).fill('0'),
        type: 2,
        pid: replyId || 0,
        one_level_id: replyId || 0
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
