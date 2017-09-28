/* DES加密
 * 作者：徐高阳
 * 创建：2017-6 */

import CryptoJS from 'crypto-js'

export default {

  encrypt: function (message, key) {
    var keyHex = CryptoJS.enc.Base64.parse(key)
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })

    return encrypted.toString()
  },
  inAes: function (message, key) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(message, key)
    return ciphertext.toString()
  },
  outAes: function (message, key) {
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(message, key)
    var plaintext = bytes.toString(CryptoJS.enc.Utf8)
    return plaintext
  }
}
