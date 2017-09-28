import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async replyId => {
  try {
    if (!replyId) {
      throw new Error('api: "DeleteReply.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_BBS}/v3/bbs/delete-reply`,
      data: {
        reply_id: replyId
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
