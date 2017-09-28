/* 获取课时编辑权限API
 * 作者：平原
 * 创建：2017-6-5
 * 优化：2017-7-14 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async productId => {
  try {
    if (!productId) {
      throw new Error('api: "schedule/CanEditCourseSchedule.js" params error')
    }

    let res = await Request.get({
      url: `//course-api${ENV}.tinfinite.com/v3/course/can-edit-course-schedules?product_id=${productId}`
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
