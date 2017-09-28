/* 在某课程中获取课时列表API
 * 作者：平原
 * 创建：2017-6-5
 * 优化：2017-7-14 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ productId, page, limit }) => {
  try {
    if (!productId || !page || !limit) {
      throw new Error('api: "schedule/GetCourseSchedule.js" params error')
    }

    let res = await Request.get({
      url: `//course-api${ENV}.tinfinite.com/v3/course/course-schedules?product_id=${productId}&page=${page}&limit=${limit}`
    })

    if (res.code && res.code === 1) {
      return Promise.resolve(res.result.rows)
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
