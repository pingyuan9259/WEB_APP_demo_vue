import Request from '../../utils/request'
import { ENV, USER_ID_KEY } from '../../config'
import Cookie from '../../utils/cookie'
import Store from '../../vuex/store'

export default async function () {
  try {
    let userId = Cookie.getCookie(USER_ID_KEY)
    let res = await Request.get({
      url: `//course-api${ENV}.tinfinite.com/v3/course/user-member-from-to?user_id=${userId}`
    })

    if (res.code && res.code === 1) {
      return Promise.resolve(res.result)
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
