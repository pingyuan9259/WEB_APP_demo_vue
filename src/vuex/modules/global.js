/* 全局状态机
 * 内容：[请求失败的处理]、[全局消息广播]、[全局点击事件]、[判断手机端还是PC端]
 * 作者：平原
 * 2017-6-14 */

import Logger from '../../utils/logger'

// apis
import CheckIsTeacher from '../../api/common/CheckIsTeacher'

const state = {
  isPc: true,
  isTeacher: false,
  eventEmitter: {},
  requestFail: {},
  redirect: ''
}

const mutations = {
  // 回收请求业务层的错误信息
  REQUEST_FAIL (state, res) {
    state.requestFail = Object.assign({}, res)
  },

  EVENT_EMITTER (state, data) {
    state.eventEmitter = Object.assign({}, data)
  },

  IS_PC (state, flag) {
    state.isPc = flag
  },

  IS_TEACHER (state, isTeacher) {
    state.isTeacher = isTeacher
  },

  REDIRECT (state, data) {
    state.redirect = data
  }
}

const actions = {
  // 依照业务层的错误信息进行相关操作
  requestFail ({ commit }, res) {
    commit('BOXY_SHOW', { type: 'tip', message: res.mag || res.message })

    // 异地登录
    if (res.need_login === 2) {
      commit('REDIRECT', {
        path: '/login',
        query: { redirect: '/user/lessons' }
      })
      commit('LOGIN_STATUS', false)
    }

    // 登录超时
    if (res.need_login === 1) {
      commit('REDIRECT', {
        path: '/login',
        query: { redirect: '/user/lessons' }
      })
      commit('LOGIN_STATUS', false)
    }

    // 贴子不存在
    if (res.message === '贴子不存在') {
      window.history.back(-1)
      commit('LOGIN_STATUS', false)
    }
  },

  // 全剧消息广播
  eventEmitter ({ commit }, { event, data }) {
    try {
      if (!event && typeof event !== String) {
        throw new Error('action[eventEmitter]只接收字符串格式的消息类型！')
      }
      commit('EVENT_EMITTER', { event, data })
    } catch (err) {
      console.log(err)
    }
  },

  // 判断浏览设备
  getPcFlag ({ commit }) {
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let item of Agents) {
      if (userAgentInfo.indexOf(item) > 0) {
        flag = false
        break
      }
    }
    commit('IS_PC', flag)
  },

  globalClick ({ commit, state }, e) {
  },

  // 判断是否是老师
  async isTeacher ({ commit }) {
    try {
      let isTeacher = await CheckIsTeacher()
      commit('IS_TEACHER', isTeacher)
      return isTeacher
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '教师身份获取失败' })
      Logger.error(err, 'action: global/isTeacher')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
