import Request from '../../utils/request'
import { PREFIX } from '../../config'

export default async function () {
  try {
    let data = await Request.get({
      url: `${PREFIX}/v3/course/get-member-course`
    })

    if (data.code && data.code === 1) {
      let result = data.result
      return Promise.resolve(result)
    } else {
      throw new Error(data.message)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
