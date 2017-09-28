import Request from '../../utils/request'
import { ENV } from '../../config'
import Store from '../../vuex/store'

export default async ({ scheduleId, status, userId }) => {
  try {
    if (!scheduleId || !status) {
      throw new Error('api: "live/ChangeLiveStatus.js" params error')
    }

    let res = await Request.post_urlencoded({
      url: `//course-api${ENV}.tinfinite.com/v4/section/${scheduleId}/live/status`,
      data: {
        status: status
      }
    })

    if (res.code && res.code === 1) {
      Promise.resolve()
    } else {
      Store.commit('REQUEST_FAIL', res)
      throw new Error(res.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
