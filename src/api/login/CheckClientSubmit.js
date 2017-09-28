import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async ({ qr, deviceId }) => {
  try {
    if (!qr || !deviceId) {
      throw new Error('api: "CheckClientSubmit.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/l?qr=${qr}&device_id=${deviceId}`
    })
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
