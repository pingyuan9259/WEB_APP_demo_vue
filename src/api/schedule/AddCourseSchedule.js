/* 在某课程中添加课时API
 * 作者：平原
 * 创建：2017-6-5
 * 优化：2017-7-14 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ productId, title, description, beginAt, endAt, playbackUrl, playbackDes }) => {
  try {
    if (!productId || !title || !beginAt || !endAt) {
      throw new Error('api: "schedule/AddCourseSchedule.js" params error')
    }

    let res = await Request.post_urlencoded({
      url: `//course-api${ENV}.tinfinite.com/v3/course/add-course-schedule`,
      data: {
        product_id: productId,
        title: title,
        description: description,
        begin_at: beginAt,
        end_at: endAt,
        playback_url: playbackUrl,
        playback_des: playbackDes
      }
    })

    if (res.code && res.code === 1) {
      Promise.resolve()
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
