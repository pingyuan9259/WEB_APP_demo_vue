import Request from '../../utils/request'
import { PREFIX_OLD, DEVICE_ID_KEY, APP_ID, USER_ID_KEY } from '../../config'
import Cookie from '../../utils/cookie'

export default async function () {
  try {
    let userId = Cookie.getCookie(USER_ID_KEY)
    let deviceId = Cookie.getCookie(DEVICE_ID_KEY)
    let result = await Request.post_json({
      url: `${PREFIX_OLD}/v3/wallet/get-key`,
      data: {
        app_id: APP_ID,
        user_id: userId,
        device_id: deviceId
      }
    })

    if (result.code && result.code === 1) {
      return Promise.resolve(result.result)
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
