import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async (params) => {
  try {
    if (!params) {
      throw new Error('api: "PhoneLogin.js" params error.')
    }

    let data = await Request.post_json({
      url: `${PREFIX_OLD}/v3/passport/sign-in`,
      data: params
    })

    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
