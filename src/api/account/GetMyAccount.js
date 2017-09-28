import Request from '../../utils/request'
import { PREFIX_OLD } from '../../config'

export default async () => {
  try {
    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/wallet/wallet-info`
    })

    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
