/* 课程表状态机
 * 作者：平原
 * 创建：2017-6-14
 * 优化：2017-7-14 */

import { parseTime } from '../../utils/enhance'
import Logger from '../../utils/logger'

// apis
import GetCourseSchedule from '../../api/schedule/GetCourseSchedule'
import CanEditCourseSchedule from '../../api/schedule/CanEditCourseSchedule'
import AddCourseSchedule from '../../api/schedule/AddCourseSchedule'
import UpdateCourseSchedule from '../../api/schedule/UpdateCourseSchedule'
import ChangeLiveStatus from '../../api/live/ChangeLiveStatus'

const state = {
  schedules: [],
  nextShowId: '', // 可以上课的scheduleId
  hasNextShow: 0,
  canEdit: 0
}

const mutations = {
  GET_COURSE_SCHEDULE (state, { schedules, data }) {
    // 如果当前页不是1，则代表是滚动加载，数组需要追加
    if (data.page === 1) {
      state.schedules = Object.assign([], schedules)
    } else {
      state.schedules = state.schedules.concat(schedules)
    }

    state.hasNextShow = data.hasNextShow
    state.nextShowId = data.nextShowId
  },

  CAN_EDIT_COURSE_SCHEDULE (state, canEdit) {
    state.canEdit = canEdit
  },

  INIT_HAS_NEXT_SHOW (state) {
    state.hasNextShow = 0
  }
}

const actions = {
  async getCourseSchedule (context, data) {
    let commit = context.commit
    let state = context.state

    try {
      let schedules = await GetCourseSchedule(data)
      for (let i in schedules) {
        let _i = schedules[i]
        _i._showBegin = parseTime(_i.showBegin / 1000, '{m}月{d}日 {h}:{i}')
        _i._showEnd = parseTime(_i.showEnd / 1000, '{h}:{i}')

        let curTime = Date.parse(new Date())
        // 判断该课程是否过期
        if (curTime > _i.showEnd) _i._isPassed = 1

        // 判断该课程是否正在直播
        if (curTime > _i.showBegin && curTime < _i.showEnd) _i._liveStatus = 1

        // 判断该课程是否为即将上课的课程
        // 该属性只有一次
        // 因为滚动加载需要追加列表，所以还要在state里添加hasNextShow来辅助判断
        if (curTime < _i.showEnd && !data.hasNextShow && !state.hasNextShow) {
          data.hasNextShow = 1
          data.nextShowId = _i.id
        }
      }
      commit('GET_COURSE_SCHEDULE', { schedules, data })

      // loadStatus用于滚动加载的状态判断
      let loadStatus = {
        loaded: true,
        allLoaded: schedules.length < data.limit
      }
      return loadStatus
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程表获取失败' })
      Logger.error(err.message, 'action: schedule/getCourseSchedule')
    }
  },

  // 判断是否允许编辑课表(老师、助教、管理员有权编辑)
  async canEditCourseSchedule ({ commit }, productId) {
    try {
      let canEdit = await CanEditCourseSchedule(productId)
      commit('CAN_EDIT_COURSE_SCHEDULE', canEdit)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程编辑权限获取失败' })
      Logger.error(err.message, 'action: schedule/canEditCourseSchedule')
    }
  },

  async addCourseSchedule ({ commit }, data) {
    try {
      await AddCourseSchedule(data)
      commit('BOXY_SHOW', { type: 'tip', message: '添加成功' })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '添加失败，请稍后重试' })
      Logger.error(err.message, 'action: schedule/addCourseSchedule')
    }
  },

  async updateCourseSchedule ({ commit }, data) {
    try {
      await UpdateCourseSchedule(data)
      let msg = data.status === 0 ? '删除成功' : '修改成功'
      commit('BOXY_SHOW', { type: 'tip', message: msg })
      // 编辑时会重新渲染列表
      // 需要初始化hasNextShow标记
      commit('INIT_HAS_NEXT_SHOW')
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '操作失败，请稍后重试' })
      Logger.error(err.message, 'action: schedule/updateCourseSchedule')
    }
  },

  // 开启直播
  async changeLiveStatus ({commit}, data) {
    try {
      await ChangeLiveStatus(data)
      commit('BOXY_SHOW', { type: 'tip', message: '操作成功' })
      return true
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '操作失败，请稍后重试' })
      Logger.error(err.message, 'action: schedule/changeLiveStatus')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
