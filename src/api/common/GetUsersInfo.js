import Request from '../../utils/request'
import { USER_PREFIX } from '../../config'
import qs from 'qs'

export default async (userIds) => {
  try {
    if (!userIds) {
      throw new Error('api: "GetUserDetail.js" needs param(array) "userIds".')
    }

    let data = await Request.post_json({
      url: `${USER_PREFIX}/user/findByIds`,
      data: qs.stringify({ids: userIds}, { arrayFormat: 'brackets', json: true })
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
