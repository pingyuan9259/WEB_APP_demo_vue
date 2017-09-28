import Request from '../../utils/request'
import { PREFIX_EXERCISE } from '../../config'

export default async ({ bbsId, title, content, endTime, imagesUrl }) => {
  try {
    if (!bbsId || !title) {
      throw new Error('api: "CreateHomework.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_EXERCISE}/v3/bbs/publish-homework-post`,
      data: {
        bbs_id: bbsId,
        plate_id: 1,
        title: title,
        content: content,
        // homework_end_at: endTime,
        homework_end_at: '2022-07-01 00:00:00',
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
