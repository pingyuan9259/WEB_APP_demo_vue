import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async (deviceId) => {
  try {
    if (!deviceId) {
      throw new Error('api: "GetQrCode.js" params error.')
    }

    let data = await Request.post_urlencoded({
      url: `${PREFIX_OLD}/v3/l`,
      data: {
        device_id: deviceId
      }
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
