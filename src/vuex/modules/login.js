/* 登录相关状态机
 * 原作：刘政
 * 重构：平原
 * 2017-6 */

import UUID from 'node-uuid'
import Cookie from '../../utils/cookie'
import Storage from '../../utils/storage'
import { TOP_LEVEL_HOST, DEVICE_ID_KEY, USER_INFO_KEY, APP_TOKEN_KEY, USER_ID_KEY } from '../../config'

// apis
import GetUserDetail from '../../api/common/GetUserDetail'
import GetQrCode from '../../api/login/GetQrCode'
import CheckClientSubmit from '../../api/login/CheckClientSubmit'
import GetIdentifyingCode from '../../api/login/GetIdentifyingCode'
import GetVoiceCode from '../../api/login/GetVoiceCode'
import PhoneLogin from '../../api/login/PhoneLogin'

const state = {
  qr: '',
  identifyingCode: '',
  qrStatus: false,
  isLogin: false,
  checkSubmitLogin: {
    code: ''
  },
  checkSublimeStatus: 0, // 轮询请求状态，若发生变化怎做出相应的改动
  deviceId: ''
}

const mutations = {
  GET_DEVICE_ID (state, deviceId) {
    state.deviceId = deviceId
  },

  GET_QR_CODE (state, qrCode) {
    if (qrCode) {
      state.qrStatus = true
      state.qr = qrCode
    } else {
      state.qrStatus = false
    }
  },

  CHECK_CLIENT_SUBMIT_LOGIN (state, data) {
    state.checkSubmitLogin = data
    state.checkSublimeStatus++
  },

  GET_IDENTIFYING_CODE (state, res) {
    state.identifyingCode = res.result.key
  },

  GET_VOICE (state, res) {
    state.identifyingCode = res.result.key
  },

  LOGIN_STATUS (state, flag) {
    if (!flag) {
      Storage.clear()
      Cookie.delCookie(APP_TOKEN_KEY, TOP_LEVEL_HOST)
      Cookie.delCookie(USER_ID_KEY, TOP_LEVEL_HOST)
      Cookie.delCookie(DEVICE_ID_KEY, TOP_LEVEL_HOST)
    }
    state.isLogin = flag
  }
}

const actions = {
  // 获取用户详情并补充到localstorage
  async getUserDetails () {
    try {
      let userId = Cookie.getCookie(USER_ID_KEY)
      let userInfo = Storage.get(USER_INFO_KEY) || {}
      let userDetails = await GetUserDetail(userId)
      userDetails = Object.assign(userInfo, userDetails)
      Storage.set(USER_INFO_KEY, userDetails)
      return userDetails
    } catch (err) {
      console.log(err)
    }
  },

  // 获取登录用户信息
  async saveUserInfo ({ commit }, data) {
    try {
      if (data) {
        Cookie.setCookie(APP_TOKEN_KEY, data.token, TOP_LEVEL_HOST, 30)
        Cookie.setCookie(USER_ID_KEY, data.id, TOP_LEVEL_HOST, 30)
        Storage.set(USER_INFO_KEY, data)

        commit('LOGIN_STATUS', true)
      } else {
        commit('BOXY_SHOW', { type: 'tip', message: '无此用户信息' })
        commit('LOGIN_STATUS', false)
      }
    } catch (err) {
      console.log(err)
    }
  },

  // deviceId用于二维码登录以及鉴别其他设备登陆情况
  getDeviceId ({ commit }) {
    let deviceId = Cookie.getCookie(DEVICE_ID_KEY)
    if (!deviceId) {
      deviceId = UUID.v4()
      Cookie.setCookie(DEVICE_ID_KEY, deviceId, TOP_LEVEL_HOST, 30)
      Storage.set(DEVICE_ID_KEY, deviceId)
    }
    commit('GET_DEVICE_ID', deviceId)
  },

  deleteDeviceId ({ commit }) {
    Cookie.delCookie(DEVICE_ID_KEY)
    commit('GET_DEVICE_ID', '')
  },

  async getQrCode ({ commit, state }) {
    try {
      let deviceId = state.deviceId
      let qrCode = await GetQrCode(deviceId)
      commit('GET_QR_CODE', qrCode)
    } catch (err) {
      console.log(err)
    }
  },

  // 检查客户端是否确认扫码登录
  async checkClientSubmitLogin ({ commit, state }) {
    try {
      let deviceId = state.deviceId
      let qr = state.qr
      let res = await CheckClientSubmit({ qr, deviceId })
      commit('CHECK_CLIENT_SUBMIT_LOGIN', res)
    } catch (err) {
      console.log(err)
    }
  },

  // 获取登录手机验证码
  async getIdentifyingCode ({commit, state}, { phone, fn }) {
    try {
      let res = await GetIdentifyingCode(phone)
      if (res.code !== 0) {
        commit('GET_IDENTIFYING_CODE', res)
        fn && fn()
      } else {
        commit('BOXY_SHOW', { type: 'tip', message: res.message })
      }
    } catch (err) {
      console.log(err)
    }
  },

  // 获取语音验证码
  async getVoice ({commit}, phone) {
    try {
      let res = await GetVoiceCode(phone)
      commit('GET_VOICE', res)
    } catch (err) {
      console.log(err)
    }
  },

  // 手机号码登录验证，进入系统
  async phoneLogin ({ commit }, params) {
    try {
      let data = params.data
      let callback = params.signIn
      let res = await PhoneLogin(data)

      // 未注册或出错
      if (res.code !== 1) {
        commit('BOXY_SHOW', { type: 'tip', message: res.message })
        return false
      }

      commit('LOGIN_STATUS', true)
      commit('CHECK_CLIENT_SUBMIT_LOGIN', res)
      callback && callback()
    } catch (err) {
      console.log(err)
    }
  },

  // 登录成功
  loginSuccess ({ commit }) {
    commit('LOGIN_STATUS', true)
  },

  // 退出登录
  logout ({ commit }) {
    commit('LOGIN_STATUS', false)
  }
}

export default {
  state,
  mutations,
  actions
}
