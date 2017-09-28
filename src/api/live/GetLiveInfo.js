import Request from '../../utils/request'
import { LIVE_PREFIX } from '../../config'
import Store from '../../vuex/store'

export default async liveId => {
  try {
    if (!liveId || !liveId.length) {
      throw new Error('api: "live/GetLiveInfo.js" params error')
    }

    let data = { 'live_ids': liveId }
    if (typeof liveId === 'string') {
      data = { 'live_ids': [liveId] }
    }

    let res = await Request.post_urlencoded({
      url: `${LIVE_PREFIX}/v1/live/info`,
      data: data
    })

    let result = res.result
    if (typeof liveId === 'string') {
      result = res.result[0]
    }

    if (res.code && res.code === 1) {
      return Promise.resolve(result)
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
