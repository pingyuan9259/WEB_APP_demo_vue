/* 在某直播间中使用某课件API
 * 作者：平原
 * 创建：2017-6-2
 * 优化：2017-7-24 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ liveId, userId, resourceId }) => {
  try {
    if (!liveId || !userId || !resourceId) {
      throw new Error('api: "UsePPT.js" params error')
    }

    let res = await Request.post_urlencoded({
      url: `//liveshow-api${ENV}.tinfinite.com/v1/live/resource/link-sel`,
      data: {
        live_id: liveId,
        user_id: userId,
        resource_id: resourceId,
        link: ''
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
