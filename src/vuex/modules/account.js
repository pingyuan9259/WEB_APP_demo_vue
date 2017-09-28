/* 我的余额状态机
 * 作者：平原
 * 2017-7-4 */

import { formatTime } from '../../utils/enhance'

// apis
import GetPayLog from '../../api/account/GetPayLog'
import GetPriceList from '../../api/account/GetPriceList'

const state = {
  payLog: [],
  priceList: []
}

const mutations = {
  ACCOUNT_PAY_LOG (state, payLog) {
    state.payLog = payLog
  },

  PRICE_LIST (state, data) {
    for (let i in data) {
      data[i]._newbornNum = data[i].newbornNum / 100
    }
    state.priceList = data
  }
}

const actions = {
  async getPayLog ({ commit }, data) {
    try {
      commit('LOADING_SHOW', { id: 'paylog', isShow: true })

      // payLog接口所需的分页参数是index不是page
      data.offset = data.limit * (data.page - 1)
      let res = await GetPayLog(data)
      if (res.code === 0) return commit('REQUEST_FAIL', res)
      let payLog = res.result.rows
      data.total = res.result.total
      commit('INIT_PAGINATION', data)

      // 格式化支付方式、时间戳
      for (let i in payLog) {
        let _i = payLog[i]
        switch (_i.type) {
          case 1:
            _i._type = '充值余额'
            _i._charge = true
            break
          case 2:
            _i._type = '购买课程'
            break
          case 3:
            _i._type = '购买会员'
            break
          case 4:
            _i._type = '续费会员'
            break
          case 5:
            _i._type = '购买会员送余额'
            _i._charge = true
            break
          case 6:
            _i._type = '续费会员送余额'
            break
          case 7:
            _i._type = '获赠余额'
            _i._charge = true
            break
          case 8:
            _i._type = '扣除余额'
            break
          case 9:
            _i._type = '获赠余额'
            _i._charge = true
            break
        }

        let amount = _i.amount / 100
        _i._amount = amount.toFixed(2)
        _i._createdAt = formatTime(_i.createdAt / 1000, '{y}年{m}月{d}日 {h}:{i}')
      }

      commit('LOADING_SHOW', { id: 'paylog', isShow: false })
      commit('ACCOUNT_PAY_LOG', payLog)
    } catch (err) {
      console.log(err)
    }
  },

  async getPriceList ({ commit }) {
    try {
      let data = await GetPriceList()
      commit('PRICE_LIST', data)
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
