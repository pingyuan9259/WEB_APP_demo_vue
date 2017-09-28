import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async formData => {
  try {
    if (!formData) {
      throw new Error('api: "UploadImage.js" formData error.')
    }

    let data = await Request.post_json({
      url: `${PREFIX_OLD}/v3/upload/picture`,
      data: formData
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
