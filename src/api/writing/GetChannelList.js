/* 获取频道列表API
 * 作者：平原
 * 创建：2017-8-7 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async () => {
  try {
    let res = await Request.get({
      url: `//bbs-api${ENV}.tinfinite.com/v3/bbs/list?is_public=1&limit=1000`
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
