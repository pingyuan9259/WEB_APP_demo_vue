import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async ({ postId, likeType }) => {
  try {
    if (!postId || !likeType) {
      throw new Error('api: "LikePost.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_BBS}/v3/bbs/like-or-cancel`,
      data: {
        target_id: postId,
        target_type: 1,
        like_type: likeType
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
