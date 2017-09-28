/* 获取全部课程列表API
 * 作者：平原
 * 创建：2017-6-14
 * 优化：2017-7-24 */

import Request from '../../utils/request'
import Cookie from '../../utils/cookie'
import { ENV, APP_TOKEN_KEY } from '../../config'
import Store from '../../vuex/store'

export default async ({ page, limit }) => {
  try {
    if (!page || !limit) {
      throw new Error('api: "GetAllCoursesList.js" params error')
    }

    let url = ''
    if (Cookie.getCookie(APP_TOKEN_KEY)) {
      url = `//course-api${ENV}.tinfinite.com/v3/course/course-list-login?page=${page}&limit=${limit}`
    } else {
      url = `//course-api${ENV}.tinfinite.com/v3/course/course-list-unlogin?page=${page}&limit=${limit}`
    }

    let res = await Request.get({
      url: url
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
