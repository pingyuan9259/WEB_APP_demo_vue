/* 封装请求
 * 作者：张军祥
 * 创建：2017-6 */

import axios from 'axios'
import qs from 'qs'
import logger from './logger'
import cookie from './cookie'
import storage from './storage'
import base64 from '../libs/base64'
import { APP_TOKEN_KEY, TOP_LEVEL_HOST, APP_ID, USER_ID_KEY } from '../config'

export default {
  _checkParams (params) {
    if (!params.url) {
      throw new Error('无效的请求地址')
    }
  },

  _checkLogin (data) {
    if (data.need_login !== 1 && data.need_login !== 2) {
      return
    }
    storage.clear()
    cookie.delCookie(APP_TOKEN_KEY, TOP_LEVEL_HOST)
  },

  _logError (data, url, type) {
    if (data.code === 0) {
      logger.error(`${url}'s request fail(${type}):`, data)
    }
  },

  _logFail (data, url, type) {
    logger.error(`${url}'s request fail(${type}):`, data)
  },

  init () {
    axios.defaults.headers.common['x-app-id'] = APP_ID
    axios.defaults.headers.common['x-user-id'] = cookie.getCookie(USER_ID_KEY)
    axios.defaults.headers.common['x-access-token'] = cookie.getCookie(APP_TOKEN_KEY)
    axios.defaults.headers.common['x-device-info'] = base64.encode(JSON.stringify({platform: 'web'}))
  },

  get (params, token) {
    this._checkParams(params)
    this.init()
    if (token) {
      axios.defaults.headers.common['x-access-token'] = token
    }
    return axios({
      method: 'get',
      url: params.url
    }).then((res) => {
      let data = res.data
      this._checkLogin(data)
      this._logError(data, params.url, 'get')
      return data
    }).catch((error) => {
      this._logFail(error.data, params.url, 'get')
    })
  },

  post_json (params) {
    this._checkParams(params)
    this.init()
    return axios({
      method: 'post',
      url: params.url,
      data: params.data
    }).then((res) => {
      let data = res.data
      this._checkLogin(data)
      this._logError(data, params.url, 'post')
      return data
    }).catch((error) => {
      this._logFail(error.data, params.url, 'post')
    })
  },

  post_urlencoded (params) {
    this._checkParams(params)
    this.init()
    return axios({
      method: 'post',
      url: params.url,
      data: qs.stringify(params.data, { arrayFormat: 'brackets', json: true }),
      header: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      let data = res.data
      this._checkLogin(data)
      this._logError(data, params.url, 'post')
      return data
    }).catch((error) => {
      this._logFail(error.data, params.url, 'post')
    })
  }
}

