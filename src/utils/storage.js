/* localStorage操作
 * 作者：刘政
 * 创建：2016... */

import base64 from '../libs/base64'
import logger from './logger'
import { SOTRAGE_PREFIX } from '../config'

const localStorage = window.localStorage

let store = {
  set (key, value) {
    try {
      if (key && value) {
        value = JSON.stringify(value)
        value = base64.encode(value)
        value = encodeURIComponent(value)
      }
      document.domain = 'xinshengdaxue.com'
      localStorage[`${SOTRAGE_PREFIX}:${key}`] = value
    } catch (e) {
      logger.error('storage set error:', e)
    }
  },

  get (key) {
    try {
      let value = localStorage[`${SOTRAGE_PREFIX}:${key}`]
      if (value && value !== 'null' && value !== 'undefined') {
        value = decodeURIComponent(value)
        value = base64.decode(value)
        value = JSON.parse(value)
      }
      return value
    } catch (e) {
      logger.error('storage get error:', e)
      return null
    }
  },

  remove (key) {
    localStorage.removeItem(`${SOTRAGE_PREFIX}:${key}`)
  },

  clear () {
    localStorage.clear()
  }
}

export default store
