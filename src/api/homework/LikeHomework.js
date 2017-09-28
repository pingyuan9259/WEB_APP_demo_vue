import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async ({ replyId, likeType }) => {
  try {
    if (!replyId || !likeType) {
      throw new Error('api: "LikeHomework.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_EXERCISE}/v3/bbs/like-or-cancel`,
      data: {
        target_id: replyId,
        target_type: 2,
        like_type: likeType
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
