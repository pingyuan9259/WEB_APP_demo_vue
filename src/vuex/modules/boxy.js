/* 此module为弹框状态机
 * 作者：平原
 * 2017-7-13 */

const state = {
  boxyShow: {},
  boxyProgress: {}
}

const mutations = {
  BOXY_SHOW (state, data) {
    state.boxyShow = Object.assign({}, data)
  },

  BOXY_PROGRESS (state, data) {
    state.boxyProgress = Object.assign({}, data)
  }
}

const actions = {
  boxyTip ({ commit }, data) {
    data.type = 'tip'
    commit('BOXY_SHOW', data)
  },

  boxyConfirm ({ commit }, data) {
    data.type = 'confirm'
    commit('BOXY_SHOW', data)
  },

  boxyWarning ({ commit }, data) {
    data.type = 'warning'
    commit('BOXY_SHOW', data)
  },

  boxyPrompt ({ commit }, data) {
    data.type = 'prompt'
    commit('BOXY_SHOW', data)
  },

  boxyProgress ({ commit }, data) {
    data.isShow = true
    commit('BOXY_PROGRESS', data)
  },

  boxyProgressClose ({ commit }) {
    commit('BOXY_PROGRESS', { isShow: false })
  }
}

export default {
  state,
  mutations,
  actions
}
