/* 获取推荐课程列表API
 * 作者：平原
 * 创建：2017-6-14
 * 优化：2017-7-24 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async type => {
  try {
    if (!type) {
      // type 推荐类型：1: 课程 2. 文章 3. 频道
      throw new Error('api: "GetRecommandition.js" needs param "type".')
    }

    let res = await Request.get({
      url: `//api-saas${ENV}.tinfinite.com/v3/recommendation?type=${type}`
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
