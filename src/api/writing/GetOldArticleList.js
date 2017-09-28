/* 获取老写作平台的文章列表API
 * 作者：平原
 * 创建：2017-7-24 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ page, limit }) => {
  try {
    if (!page || !limit) {
      throw new Error('api: "writing/GetOldArticleList.js" params error')
    }

    let res = await Request.get({
      url: `//api-saas${ENV}.tinfinite.com/v3/official-account/post/my-post?page=${page}&limit=${limit}&publish_status=1`
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
