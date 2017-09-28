/* 创建支付订单
 * 作者：平原
 * 创建：2017-8-4 */

import { ENV, DEVICE_ID_KEY, USER_ID_KEY } from '../config'
import Cookie from './cookie'
import Pingpp from 'pingpp-js'
import Store from '../vuex/store'

const userId = Cookie.getCookie(USER_ID_KEY)
const deviceId = Cookie.getCookie(DEVICE_ID_KEY)

const initAliPayOrderInfo = ({ courseId, returnUrl }) => {
  if (courseId === '') return {}
  let info = {
    user_id: userId,
    device_id: deviceId,
    product_id: courseId,
    amount: 1,
    pay_channel: 7,
    from_channel: 'pc',
    success_url: `http://web${ENV}.xinshengdaxue.com${returnUrl}`,
    cancel_url: `http://web${ENV}.xinshengdaxue.com${returnUrl}`
  }
  return info
}

const initWalletOrderInfo = courseId => {
  if (courseId === '') return {}
  let info = {
    user_id: userId,
    device_id: deviceId,
    product_id: courseId,
    amount: 1,
    pay_channel: 6,
    from_channel: 'pc'
  }
  return info
}

const completePayOrder = order => {
  return new Promise(function (resolve, reject) {
    Pingpp.createPayment(order.pay_order, function (result, err) {
      if (result === 'success') {
        resolve(result)
      } else if (result === 'fail') {
        Store.commit('REQUEST_FAIL', err.message)
        reject(err)
      } else if (result === 'cancel') {
        resolve()
      }
    })
  })
}

export {
  initAliPayOrderInfo,
  initWalletOrderInfo,
  completePayOrder
}
