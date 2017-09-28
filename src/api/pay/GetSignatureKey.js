import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async function () {
  try {
    let result = await Request.get({
      url: `${PREFIX_OLD}/v3/wallet/get-signature-key`
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
