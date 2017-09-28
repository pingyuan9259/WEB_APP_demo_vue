/* 写作文章保存草稿API
 * 作者：平原
 * 创建：2017-8-7 */

import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ postId, bbsId, title, html, imagesUrl, content }) => {
  try {
    if (!title || !bbsId || !html || !imagesUrl) {
      throw new Error('api: "writing/DraftArticle.js" params error')
    }

    let res = await Request.post_urlencoded({
      url: `//bbs-api${ENV}.tinfinite.com/v3/bbs/draft-article-post`,
      data: {
        post_id: postId,
        bbs_id: bbsId,
        plate_id: 1,
        title: title,
        html: html,
        content: content,
        publish_status: 0,
        images_url: imagesUrl,
        images_w: new Array(imagesUrl.length).fill(0),
        images_h: new Array(imagesUrl.length).fill(0)
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
