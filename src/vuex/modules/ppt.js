/* 添加PPT状态机
 * 作者：平原
 * 创建：2017-6-14
 * 优化：2017-7-24 */

import { formatTime } from '../../utils/enhance'
import Logger from '../../utils/logger'

// apis
import GetPPTList from '../../api/ppt/GetPPTList'
import UploadPPT from '../../api/ppt/UploadPPT'
import DeletePPT from '../../api/ppt/DeletePPT'
import UsePPT from '../../api/ppt/UsePPT'
import GetLiveInfo from '../../api/live/GetLiveInfo'

const state = {
  pptList: []
}

const mutations = {
  GET_PPT_LIST (state, { pptList, liveInfo }) {
    // 判读当前ppt是否正在使用、格式化ppt创建时间
    for (let i in pptList) {
      let _i = pptList[i]
      if (liveInfo.live_resource_sel && liveInfo.live_resource_sel.id === _i.id) {
        _i._useing = true
      }
      _i._updatedAt = formatTime(Date.parse(_i.updated_at) / 1000)
    }
    state.pptList = Object.assign([], pptList)
  },

  UPDATE_UPLOAD (state, result) {
    result._updatedAt = formatTime(Date.parse(result.updated_at) / 1000)
    state.pptList.unshift(result)
  },

  UPDATE_DELETE (state, index) {
    state.pptList.splice(index, 1)
  },

  UPDATE_USE (state, index) {
    for (let i in state.pptList) {
      let _i = state.pptList[i]
      _i._useing = false
    }
    state.pptList[index]._useing = true
    state.pptList = Object.assign([], state.pptList)
  }
}

const actions = {
  async getPPTList ({ commit }, liveId) {
    try {
      let pptList = await GetPPTList(liveId)
      let liveInfo = await GetLiveInfo(liveId)
      commit('GET_PPT_LIST', { pptList, liveInfo })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课件列表获取失败' })
      Logger.error(err, 'action: ppt/getPPTList')
    }
  },

  async uploadPPT ({ commit }, formData) {
    try {
      let result = await UploadPPT(formData)
      commit('UPDATE_UPLOAD', result)
      commit('BOXY_SHOW', { type: 'tip', message: '添加成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课件上传失败' })
      Logger.error(err, 'action: ppt/uploadPPT')
    }
  },

  async deletePPT ({ commit }, data) {
    try {
      await DeletePPT(data)
      commit('UPDATE_DELETE', data.index)
      commit('BOXY_SHOW', { type: 'tip', message: '删除成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '删除失败' })
      Logger.error(err, 'action: ppt/deletePPT')
    }
  },

  async usePPT ({ commit }, data) {
    try {
      await UsePPT(data)
      commit('UPDATE_USE', data.index)
      commit('BOXY_SHOW', { type: 'tip', message: '操作成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '操作失败' })
      Logger.error(err, 'action: ppt/usePPT')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
