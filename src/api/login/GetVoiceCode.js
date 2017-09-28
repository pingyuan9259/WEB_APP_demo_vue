import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async (phone) => {
  try {
    if (!phone) {
      throw new Error('api: "GetVoiceCode.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/passport/code/voice?phone=${phone}`
    })

    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
