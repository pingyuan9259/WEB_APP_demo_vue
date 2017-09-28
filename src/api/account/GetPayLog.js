/* 查询消费记录API
 * 作者：徐高阳
 * 创建：2017-6 */

import Request from '../../utils/request'
import Cookie from '../../utils/cookie'
import { USER_ID_KEY, PREFIX_OLD } from '../../config'

export default async ({ offset, limit }) => {
  try {
    if (!offset === undefined || !limit) {
      throw new Error('api: "GetPayLog.js" params error.')
    }

    // 1充新生币 2购买课程 3购买会员 4会员续费 5赠送新生币
    let data = await Request.get({
      url: `${PREFIX_OLD}/v3/wallet/record-list?user_id=` + Cookie.getCookie(USER_ID_KEY) +
        '&type=' + 2 + '&offset=' + offset + '&limit=' + limit
    })

    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}
