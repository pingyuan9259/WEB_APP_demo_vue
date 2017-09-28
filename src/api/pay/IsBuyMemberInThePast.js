import Request from '../../utils/request'
import { PREFIX, USER_ID_KEY } from '../../config'
import Cookie from '../../utils/cookie'

export default async function () {
  try {
    let userId = Cookie.getCookie(USER_ID_KEY)
    let data = await Request.get({
      url: `${PREFIX}/v3/course/user-member-info?user_id=${userId}`
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
