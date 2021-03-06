import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async postId => {
  try {
    if (!postId) {
      throw new Error('api: "DeletePost.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_BBS}/v3/bbs/delete-post`,
      data: {
        post_id: postId
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
