/* 删除写作平台的文章API
 * 作者：平原
 * 创建：2017-8-7 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async postId => {
  try {
    if (!postId) {
      throw new Error('api: "writing/DeleteArticle.js" params error')
    }

    let res = await Request.post_urlencoded({
      url: `//bbs-api${ENV}.tinfinite.com/v3/bbs/delete-post`,
      data: {
        post_id: postId
      }
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
