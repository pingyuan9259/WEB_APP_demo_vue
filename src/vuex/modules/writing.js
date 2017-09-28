/* 写作状态机
 * 作者：平原
 * 创建：2017-8-8 */

import { formatTime } from '../../utils/enhance'
import Logger from '../../utils/logger'

// apis
import GetArticleList from '../../api/writing/GetArticleList'
import GetOldArticleList from '../../api/writing/GetOldArticleList'
import DeleteArticle from '../../api/writing/DeleteArticle'
import GetChannelList from '../../api/writing/GetChannelList'
import DraftArticle from '../../api/writing/DraftArticle'
import PublishArticle from '../../api/writing/PublishArticle'
import GetArticleDetails from '../../api/writing/GetArticleDetails'

const state = {
  articleList: [],
  channelList: [],
  articleDetails: {}
}

const mutations = {
  GET_ARTICLE_LIST (state, articleList) {
    for (let i in articleList) {
      let _i = articleList[i]
      _i._createdAt = formatTime(_i.createdAt / 1000, '{y}年{m}月{d}日 {h}:{i}')
      _i._publishedAt = formatTime(_i.publishedAt / 1000, '{y}年{m}月{d}日 {h}:{i}')
    }
    state.articleList = Object.assign([], articleList)
  },

  UPDATE_DELETE (state, index) {
    state.articleList.splice(index, 1)
  },

  GET_CHANNEL_LIST (state, channelList) {
    state.channelList = Object.assign([], channelList)
  },

  GET_ARTICLE_DETAILS (state, articleDetails) {
    state.articleDetails = Object.assign({}, articleDetails)
  }
}

const actions = {
  // 获取写作平台文章列表
  async getArticleList ({ commit }, data) {
    try {
      commit('LOADING_SHOW', { id: 'articleList', isShow: true })
      let result = await GetArticleList(data)
      let articleList = result.rows
      data.total = result.total
      commit('INIT_PAGINATION', data)
      commit('GET_ARTICLE_LIST', articleList)
      commit('LOADING_SHOW', { id: 'articleList', isShow: false })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '文章列表获取失败' })
      Logger.error(err.message, 'action: writing/getArticleList')
    }
  },

  // 获取老写作平台的文章列表（针对老用户）
  async getOldArticleList ({ commit }, data) {
    try {
      commit('LOADING_SHOW', { id: 'articleList', isShow: true })
      let result = await GetOldArticleList(data)
      let articleList = result.posts
      data.total = result.paging.total
      commit('INIT_PAGINATION', data)

      for (let i in articleList) {
        let _i = articleList[i]
        _i.createdAt = Date.parse(_i.created_at)
      }

      commit('GET_ARTICLE_LIST', articleList)
      commit('LOADING_SHOW', { id: 'articleList', isShow: false })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '文章列表获取失败' })
      Logger.error(err.message, 'action: writing/getOldArticleList')
    }
  },

  // 删除文章、草稿
  async deleteArticle ({ commit }, data) {
    try {
      await DeleteArticle(data.postId)
      commit('UPDATE_DELETE', data.index)
      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '删除失败' })
      Logger.error(err, 'action: writing/deleteArticle')
    }
  },

  // 获取发布时需要的频道类表
  async getChannelList ({ commit }, data) {
    try {
      let channelList = await GetChannelList()
      commit('GET_CHANNEL_LIST', channelList)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '频道列表获取失败' })
      Logger.error(err, 'action: writing/getChannelList')
    }
  },

  // 保存草稿
  async draftArticle ({ commit }, data) {
    try {
      let result = await DraftArticle(data)
      if (data.autoSave) {
        commit('BOXY_SHOW', { type: 'toast', message: '文章已自动保存' })
      } else {
        commit('BOXY_SHOW', { type: 'tip', message: '已保存到草稿箱' })
      }
      return result
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '保存草稿失败' })
      Logger.error(err, 'action: writing/draftArticle')
    }
  },

  // 发布文章
  async publishArticle ({ commit }, data) {
    try {
      await PublishArticle(data)
      commit('BOXY_SHOW', { type: 'tip', message: '发布成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '发布文章失败' })
      Logger.error(err, 'action: writing/publishArticle')
    }
  },

  // 通过文章详情来获取草稿的详情信息
  async getArticleDetails ({ commit }, postId) {
    try {
      let articleDetails = await GetArticleDetails(postId)
      commit('GET_ARTICLE_DETAILS', articleDetails)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '文章详情获取失败' })
      Logger.error(err, 'action: writing/publishArticle')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
