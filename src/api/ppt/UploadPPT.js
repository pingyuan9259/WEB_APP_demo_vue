/* 在某直播间中上传一组课件API
 * 作者：平原
 * 创建：2017-6-2
 * 优化：2017-7-24 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async formData => {
  try {
    if (!formData) {
      throw new Error('api: "UploadPPT.js" formData error')
    }

    let res = await Request.post_json({
      url: `//liveshow-api${ENV}.tinfinite.com/v1/live/resource`,
      data: formData
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
