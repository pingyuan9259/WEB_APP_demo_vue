import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async (phone) => {
  try {
    if (!phone) {
      throw new Error('api: "GetIdentifyingCode.js" params error.')
    }

    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/passport/send-code?phone=${phone}&country_code=CN`
    })

    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
