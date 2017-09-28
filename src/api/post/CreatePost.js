import Request from '../../utils/request'
import { PREFIX_BBS } from '../../config'

export default async ({ bbsId, content, imagesUrl }) => {
  try {
    if (!bbsId || !content) {
      throw new Error('api: "CreatPost.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_BBS}/v3/bbs/publish-normal-post`,
      data: {
        bbs_id: bbsId,
        plate_id: 1,
        title: '',
        content: content,
        images_url: imagesUrl,
        images_w: new Array(imagesUrl.length).fill('0'),
        images_h: new Array(imagesUrl.length).fill('0')
      }
    })

    data.code = Number(data.code)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
