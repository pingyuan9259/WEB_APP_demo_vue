/* 获取我的课程列表API
 * 作者：平原
 * 创建：2017-6-14
 * 优化：2017-7-24 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ page, limit }) => {
  try {
    if (!page || !limit) {
      throw new Error('api: "GetMyCoursesList.js" params error')
    }

    let res = await Request.get({
      url: `//course-api${ENV}.tinfinite.com/v3/course/my-course-list?page=${page}&limit=${limit}`
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
