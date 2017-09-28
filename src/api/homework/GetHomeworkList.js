import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async ({ bbsId, page, limit }) => {
  try {
    if (!bbsId || !page || !limit) {
      throw new Error('api: "GetHomeworkList.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_EXERCISE}/v3/bbs/homework-post?page=${page}&limit=${limit}&bbs_id=${bbsId}&reply_size=0`
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
