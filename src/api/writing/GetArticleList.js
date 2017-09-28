/* 获取写作平台的文章列表API
 * 作者：平原
 * 创建：2017-8-7 */

import Request from '../../utils/request'
import { ENV, USER_ID_KEY } from '../../config'
import Cookie from '../../utils/cookie'
import Store from '../../vuex/store'

export default async ({ page, limit, status }) => {
  try {
    if (!page || !limit) {
      throw new Error('api: "writing/GetOldArticleList.js" params error')
    }

    let userId = Cookie.getCookie(USER_ID_KEY)
    let res = await Request.get({
      url: `//bbs-api${ENV}.tinfinite.com/v3/bbs/my-article?page=${page}&limit=${limit}&status=${status}&user_id=${userId}`
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
