/* 支付状态机
 * 作者：平原
 * 2017-8-4 */

// apis
import GetMyAccount from '../../api/account/GetMyAccount'
import GetMemberCourseInfo from '../../api/pay/GetMemberCourseInfo'
import IsBuyMemberInThePast from '../../api/pay/IsBuyMemberInThePast'

const state = {
  accountInfo: {},
  memberCourseInfo: {},
  isBuyMemberInThePast: {},
  isPaying: false
}

const mutations = {
  ACCOUNT_INFO (state, data) {
    state.accountInfo = data
  },

  GET_MEMBER_COURSE_INFO (state, data) {
    state.memberCourseInfo = data
  },

  IS_BUY_MEMBER_IN_THE_PAST (state, data) {
    state.isBuyMemberInThePast = data
  },

  PAY_STATUS (state, status) {
    state.isPaying = status
  }
}

const actions = {
  async getAccountInfo ({ commit }) {
    try {
      let res = await GetMyAccount()
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let accountInfo = res.result
      commit('ACCOUNT_INFO', accountInfo)
    } catch (err) {
      console.log(err)
    }
  },

  async getMemberCourseInfo ({ commit }) {
    try {
      let data = await GetMemberCourseInfo()
      commit('GET_MEMBER_COURSE_INFO', data)
    } catch (err) {
      console.log(err)
    }
  },

  async isBuyMemberInThePast ({ commit }) {
    try {
      let data = await IsBuyMemberInThePast()
      commit('IS_BUY_MEMBER_IN_THE_PAST', data)
    } catch (err) {
      console.log(err)
    }
  },

  setPayingStatus ({ commit }, flag) {
    commit('PAY_STATUS', flag)
  }
}

export default {
  state,
  mutations,
  actions
}
