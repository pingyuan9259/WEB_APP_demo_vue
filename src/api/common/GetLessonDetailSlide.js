import Request from '../../utils/request'
import { PREFIX } from '../../config'

export default async courseId => {
  try {
    if (!courseId) {
      throw new Error('api: "GetLessonDetailSlide.js" needs param "courseId".')
    }

    let data = await Request.get({
      url: `${PREFIX}/v3/course/banners?product_id=${courseId}`
    })

    if (data.code && data.code === 1) {
      return Promise.resolve(data.result)
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
