/* RSA加密
 * 作者：徐高阳
 * 创建：2017-6 */

import { JSEncrypt } from 'jsencrypt'

export default {

  encrypt: function (publicKey, info) {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(publicKey)

    // 这里定义了paramList和param，这是因为js这边将分段数据拼接后服务端解析不了
    // param 给des加密用的数据
    // paramList 是将加密的参数分段保存在数据，服务器按照数据来分段解析
    let paramList = []
    let param = ''
    let start = 0
    let end = info.length
    while (end - start > 0) {
      let middle = ''

      if (end - start > 117) {
        middle = encrypt.encrypt(info.slice(start, start + 117))
        start = start + 117
      } else {
        middle = encrypt.encrypt(info.slice(start, end))
        start = end
      }
      paramList.push(middle)
      param += middle
    }

    return [paramList, param]
  }
}
