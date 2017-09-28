import { PREFIX_OLD } from '../../config'
import Request from '../../utils/request'
import RSA from '../../libs/RSA'
import DES from '../../libs/DES'
import Store from '../../vuex/store'

// apis
import GetPublicKey from './GetPublicKey'
import GetSignatureKey from './GetSignatureKey'

export default async data => {
  try {
    // 创建订单前，先从服务器拿到验证key
    let publicKeyResult = await GetPublicKey()
    let keys = await GetSignatureKey()

    let info = data
    info = JSON.stringify(info)

    // 进行rsa加密
    let params = RSA.encrypt(publicKeyResult.public_key, info)

    // 进行des加密
    let signature = DES.encrypt(params[1], keys.key2)
    signature = signature.toString()

    let res = await Request.post_json({
      url: `${PREFIX_OLD}/v3/wallet/subscribe`,
      data: {
        param: params[0],
        signature: signature,
        wallet_key: keys.key1
      }
    })

    if (res.code && res.code === 1) {
      return Promise.resolve(res.result)
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
