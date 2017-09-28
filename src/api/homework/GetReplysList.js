import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async ({ postId, page, limit }) => {
  try {
    if (!postId || !page || !limit) {
      throw new Error('api: "GetReplyList.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_EXERCISE}/v3/bbs/reply-list-page?post_id=${postId}&page=${page}&limit=${limit}&is_tree=1&second_reply_num=0`
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
