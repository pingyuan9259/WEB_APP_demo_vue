import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async ({ bbsId, page, limit }) => {
  try {
    if (!bbsId || !page || !limit) {
      throw new Error('api: "GetPostsList" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_BBS}/v3/bbs/all-post?page=${page}&limit=${limit}&bbs_id=${bbsId}&reply_size=0`
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
