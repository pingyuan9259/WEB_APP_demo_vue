import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async postId => {
  try {
    if (!postId) {
      throw new Error('api: "GetHomeworkDetails.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_EXERCISE}/v3/bbs/post-details-post?post_id=${postId}`
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
