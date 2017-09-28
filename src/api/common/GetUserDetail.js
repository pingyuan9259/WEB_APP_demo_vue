import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async userId => {
  try {
    if (!userId) {
      throw new Error('api: "GetUserDetail.js" needs param "userId".')
    }

    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/user/detail/new?id=${userId}`
    })

    if (data.code && data.code === 1) {
      return Promise.resolve(data.result)
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
