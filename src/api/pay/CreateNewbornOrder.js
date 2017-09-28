import Request from '../../utils/request'
import RSA from '../../libs/RSA'
import DES from '../../libs/DES'
import { PREFIX_OLD } from '../../config'

// apis
import GetPublicKey from './GetPublicKey'
import GetSignatureKey from './GetSignatureKey'

export default async function (data) {
  try {
    // 创建订单前，先从服务器拿到验证key
    let publicKeyResult = await GetPublicKey()
    let keys = await GetSignatureKey()

    console.log(data)
    let info = data
    info = JSON.stringify(info)

    // 进行rsa加密
    let params = RSA.encrypt(publicKeyResult.public_key, info)

    // 进行des加密
    let signature = DES.encrypt(params[1], keys.key2)
    signature = signature.toString()

    let result = await Request.post_json({
      url: `${PREFIX_OLD}/v3/wallet/create-newborn-order`,
      data: {
        param: params[0],
        signature: signature,
        wallet_key: keys.key1
      }
    })

    if (result.code && result.code === 1) {
      let order = {pay_order: result.result, pay_channel: data.pay_channel}
      return Promise.resolve(order)
    } else {
      throw new Error(result.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
