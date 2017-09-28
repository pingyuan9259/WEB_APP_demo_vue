/* 公共组件状态机
 * 作者：平原
 * 2017-6-14 */

// apis
import GetUserMemberInfo from '../../api/common/GetUserMemberInfo'

const state = {
  userMemberInfo: {},

  // 分页组件状态
  showPagination: false,
  pageItem: [],
  curPage: 1,
  preOrNext: 0,

  // 加载动画组件状态
  loading: {
    isShow: false,
    id: ''
  }
}

const mutations = {
  MEMBER_INFO (state, data) {
    state.userMemberInfo = data
  },

  INIT_PAGINATION (state, { total, page, limit }) {
    let pageCount = Math.ceil(total / limit)
    state.curPage = page
    state.showPagination = pageCount > 1

    let pageItem = []
    for (let i = 0; i < pageCount; i++) {
      if (i === page - 1) {
        pageItem.push({'page': i + 1, 'active': 1})
      } else {
        pageItem.push({'page': i + 1})
      }
    }
    state.pageItem = Object.assign([], pageItem)

    // 判断是否是第一页或最后一页disabled
    if (page === 1) {
      state.preOrNext = -1
    } else if (page === pageCount) {
      state.preOrNext = 1
    }
  },

  UPDATE_PAGE (state, toPage) {
    if (toPage) {
      state.curPage = toPage
    }
  },

  LOADING_SHOW (state, data) {
    state.loading = Object.assign({}, data)
  }
}

const actions = {
  async getUserMemberInfo ({ commit }) {
    try {
      let data = await GetUserMemberInfo()
      commit('MEMBER_INFO', data)
    } catch (err) {
      console.log(err)
    }
  },

  initPagination ({ commit }, data) {
    commit('INIT_PAGINATION', data)
  },

  updatePage ({commit}, toPage) {
    commit('UPDATE_PAGE', toPage)
  },

  loadingShow: ({ commit }, loadingId) => {
    commit('LOADING_SHOW', { id: loadingId, isShow: true })
  },

  loadingHide: ({ commit }, loadingId) => {
    commit('LOADING_SHOW', { id: loadingId, isShow: false })
    // const setCommit = () => {
    //   commit('LOADING_SHOW', { id: loadingId, isShow: false })
    // }

    // if (delay) { // 弹框支持延迟隐藏
    //   clearTimeout()
    //   setTimeout(() => {
    //     setCommit()
    //   }, delay)
    //   return
    // }

    // setCommit()
  }
}

export default {
  state,
  mutations,
  actions
}
