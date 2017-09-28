import Request from '../../utils/request'
import { PREFIX } from '../../config'

export default async () => {
  try {
    let data = await Request.get({
      url: `${PREFIX}/v3/course/is-teacher`
    })

    if (data.code && data.code === 1) {
      return Promise.resolve(data.result)
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
