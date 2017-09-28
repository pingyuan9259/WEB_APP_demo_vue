/* 直播相关状态机
 * 作者：阎垚月
 * 2017-6 */

import { LIVE_PREFIX } from '../../config'
import request from '../../utils/request'
import log from '../../utils/logger'

const state = {
  liveParams: {},
  live: {},
  resources: {},
  voteSelect: {},
  handleLike: {},
  joinInfo: {},
  feature: {},
  featureStatus: {},
  like: {},
  userAction: {},
  socketLiveInfo: {},
  liveName: {},
  selectorCreate: {},
  selectorAction: {},
  resourceSel: {},
  adminMessage: {},
  chatEmoji: ''
}

const mutations = {
  // 表情接收
  CHAT_EMOJI (state, chatEmoji) {
    state.chatEmoji = chatEmoji
  },

  LIVE_INFO (state, liveInfo) {
    state.liveInfo = Object.assign({}, liveInfo)
  },

  LIVE_PARAMS (state, liveParams) {
    state.liveParams = Object.assign({}, liveParams)
  },

  GET_LIVE_SHOW_STREAM (state, live) {
    state.live = Object.assign({}, live)
  },

  GET_LIVE_RESOURCES (state, resources) {
    state.resources = Object.assign({}, resources)
  },

  VOTE_SELECT (state, voteSelect) {
    state.voteSelect = Object.assign({}, voteSelect)
  },

  LIKE_ACTION (state, handleLike) {
    state.handleLike = Object.assign({}, handleLike)
  },

  JOIN_INFO (state, joinInfo) {
    state.joinInfo = Object.assign({}, joinInfo)
  },

  SOCKET_FEATURE (state, feature) {
    state.feature = Object.assign({}, feature)
  },

  SOCKET_FEATURESTATUS (state, featureStatus) {
    state.featureStatus = Object.assign({}, featureStatus)
  },

  SOCKET_LIKE (state, like) {
    state.like = Object.assign({}, like)
  },

  SOCKET_USER_ACTION (state, userAction) {
    state.userAction = Object.assign({}, userAction)
  },

  SOCKET_LIVE_INFO (state, socketLiveInfo) {
    state.socketLiveInfo = Object.assign({}, socketLiveInfo)
  },

  SOCKET_LIVE_NAME (state, liveName) {
    state.liveName = Object.assign({}, liveName)
  },

  SOCKET_SELECTOR_CREATE (state, selectorCreate) {
    state.selectorCreate = Object.assign({}, selectorCreate)
  },

  SOCKET_SELECTOR_ACTION (state, selectorAction) {
    state.selectorAction = Object.assign({}, selectorAction)
  },

  SOCKET_RESOURCE_SEL (state, resourceSel) {
    state.resourceSel = Object.assign({}, resourceSel)
  },

  SOCKET_ADMIN_MESSAGE (state, adminMessage) {
    state.adminMessage = Object.assign({}, adminMessage)
  }
}

const actions = {
  // 获取用户的信息
  getLiveParams ({commit}, data) {
    return new Promise(resolve => {
      commit('LIVE_PARAMS', data)
      resolve(data)
    })
  },

  // 加入直播间
  getLiveShowStream ({commit}, data) {
    return new Promise(resolve => {
      request.post_urlencoded({
        url: LIVE_PREFIX + '/v1/live/user',
        data: data
      }).then((res) => {
        if (res.code === 1) {
          commit('GET_LIVE_SHOW_STREAM', res)
          resolve(res)
        } else {
          log.error(res)
        }
      }).catch((err) => {
        log.error(err)
      })
    })
  },

  // 拉去资源（PPT）
  getResources ({commit}, data) {
    return new Promise(resolve => {
      request.post_urlencoded({
        url: LIVE_PREFIX + '/v1/live/resource/info',
        data: data
      }).then((res) => {
        if (res.code === 1) {
          commit('GET_LIVE_RESOURCES', res)
          resolve(res)
        } else {
          log.error(res)
        }
      }).catch((err) => {
        log.error(err)
      })
    })
  },

  // 用户点赞
  handleLikeAction ({commit}, data) {
    return new Promise(resolve => {
      request.post_urlencoded({
        url: LIVE_PREFIX + '/v1/live/like',
        data: data
      }).then((res) => {
        if (res.code === 1) {
          commit('LIKE_ACTION', res)
          resolve(res)
        } else {
          log.error(res)
        }
      }).catch((err) => {
        log.error(err)
      })
    })
  },

  // 用户投票
  voteSelectAction ({commit}, data) {
    return new Promise(resolve => {
      request.post_urlencoded({
        url: LIVE_PREFIX + '/v1/live/selector/item',
        data: data
      }).then((res) => {
        if (res.code === 1) {
          commit('VOTE_SELECT', res)
          resolve(res)
        } else {
          log.error(res)
        }
      }).catch((err) => {
        log.error(err)
      })
    })
  },

  // 获取表情
  getChatEmoji ({commit}, data) {
    return new Promise(resolve => {
      commit('CHAT_EMOJI', data)
      resolve(data)
    })
  },

  // LIVE_INFO
  pushLiveInfo ({commit}, data) {
    return new Promise(resolve => {
      commit('JOIN_INFO', data)
      resolve(data)
    })
  },

  // SOCKET_FEATURE
  socketFeature ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_FEATURE', data)
      resolve(data)
    })
  },

  // SOCKET_FEATURESTATUS
  socketFeatureStatus ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_FEATURESTATUS', data)
      resolve(data)
    })
  },

  // SOCKET_LIKE
  socketLike ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_LIKE', data)
      resolve(data)
    })
  },

  // SOCKET_USER_ACTION
  socketUserAction ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_USER_ACTION', data)
      resolve(data)
    })
  },

  // SOCKET_LIVE_INFO
  socketLiveShowInfo ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_LIVE_INFO', data)
      resolve(data)
    })
  },

  // SOCKET_LIVE_NAME
  socketLiveName ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_LIVE_NAME', data)
      resolve(data)
    })
  },

  // SOCKET_SELECTOR_CREATE
  socketSelectorCreate ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_SELECTOR_CREATE', data)
      resolve(data)
    })
  },

  // SOCKET_SELECTOR_ACTION
  socketSelectorAction ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_SELECTOR_ACTION', data)
      resolve(data)
    })
  },

  // SOCKET_RESOURCE_SEL
  socketResourceSel ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_RESOURCE_SEL', data)
      resolve(data)
    })
  },

  // SOCKET_ADMIN_MESSAGE
  socketAdminMessage ({commit}, data) {
    return new Promise(resolve => {
      commit('SOCKET_ADMIN_MESSAGE', data)
      resolve(data)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
