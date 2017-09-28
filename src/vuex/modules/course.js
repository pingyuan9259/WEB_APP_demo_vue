/* 课程相关状态机
 * 作者：平原
 * 创建：2017-5-31
 * 优化：2017-7-24 */

import _ from 'lodash'
import { arrToObjByKey, parseTime } from '../../utils/enhance'
import Logger from '../../utils/logger'

// apis
import GetAllCoursesList from '../../api/course/GetAllCoursesList'
import GetMyCoursesList from '../../api/course/GetMyCoursesList'
import GetTeacherCoursesList from '../../api/course/GetTeacherCoursesList'
import GetRecommandition from '../../api/course/GetRecommandition'
import GetTeacherIntros from '../../api/course/GetTeacherIntros'
import GetCourseInfo from '../../api/course/GetCourseInfo'
import GetCourseFeatures from '../../api/course/GetCourseFeatures'
import GetCourseBanners from '../../api/course/GetCourseBanners'
import GetCourseOutlines from '../../api/course/GetCourseOutlines'
import GetCourseFaqs from '../../api/course/GetCourseFaqs'
import GetLiveInfo from '../../api/live/GetLiveInfo'

const state = {
  courses: {
    type: '', // all/user/teacher，lessonList组件是共用的
    recommand: {},
    all: {},
    user: {},
    teacher: {}
  },
  courseInfo: {
    teacherIntro: {
      content: '',
      teacherName: ''
    }
  },
  banners: [],
  features: [],
  outlines: [],
  faqs: [],
  teacherIntros: []
}

const mutations = {
  GET_COURSES_LIST (state, { courses, data, firstRende }) {
    state.courses[data.type] = _.assign(state.courses[data.type], {
      [data.page]: courses,
      page: data.page,
      limit: data.limit,
      total: data.total,
      firstRende: firstRende
    })
    state.courses.type = data.type
    state.courses = _.assign({}, state.courses)
  },

  RECOMMAND_COURSES (state, courses) {
    // 仅为了结构化赋值
    state.courses.recommand = {
      '1': courses,
      page: 1,
      limit: 3,
      total: 3
    }
    state.courses.type = 'recommand'
    state.courses = _.assign({}, state.courses)
  },

  GET_COURSE_INFO (state, courseInfo) {
    state.courseInfo = Object.assign({}, courseInfo)
  },

  GET_COURSE_BANNER (state, banners) {
    state.banners = Object.assign([], banners)
  },

  GET_LESSON_FEATURES (state, features) {
    let res = []
    for (let i in features) {
      let _i = features[i]
      if (!res[_i.flag]) {
        res[_i.flag] = {}
      }
      res[_i.flag][_i.contentTag] = _i.content
    }
    state.features = Object.assign([], res)
  },

  GET_LESSON_OUTLINES (state, outlines) {
    let res = []
    for (let i in outlines) {
      let item = outlines[i]
      if (!res[item.flag]) {
        res[item.flag] = {}
      }
      res[item.flag][item.contentTag] = item.content
    }
    for (let j in res) {
      res[j]['1'] = res[j]['1'] + '?imageView2/1/w/100/h/100/interlace/1'
    }
    state.outlines = Object.assign([], res)
  },

  GET_LESSON_FAQS (state, faqs) {
    let res = []
    for (let i in faqs) {
      let item = faqs[i]
      if (!res[item.flag]) {
        res[item.flag] = {}
      }
      res[item.flag][item.contentTag] = item.content
    }
    state.faqs = Object.assign([], res)
  },

  GET_LESSON_TEACHER_INTROS (state, teacherIntros) {
    for (let i in teacherIntros) {
      let _i = teacherIntros[i]
      _i._avatar = _i.content + '?imageView2/1/w/760/h/760/interlace/1'
      if (_i.text) {
        // eslint-disable-next-line
        _i._introduction = _i.text.replace(/\n/g, '<br>')
      }
    }
    state.teacherIntros = Object.assign([], teacherIntros)
  }
}

const actions = {
  // 获取课程列表
  // 在此使用async同步以后context将不能使用解构赋值，why?
  async getCoursesList (context, data) {
    let commit = context.commit
    let cache = context.state.cache

    try {
      let result = {}
      let courses = {}

      commit('LOADING_SHOW', { id: 'coursesList', isShow: true })

      // 如果缓存存在，则直接使用缓存
      if (cache) {
        courses = cache.courses[data.type][data.page]
        data.total = cache.courses[data.type].total
        if (courses && JSON.stringify(courses) !== '{}') {
          return commit('GET_COURSES_LIST', { courses, data })
        }
      }
      switch (data.type) {
        case 'all':
          // 获取所有课程列表，允许未登录时调用
          result = await GetAllCoursesList(data)
          courses = result.rows
          break
        case 'user':
          // 获取我的课程列表
          result = await GetMyCoursesList(data)
          courses = result.rows
          break
        case 'teacher':
          // 获取老师开的课程列表
          result = await GetTeacherCoursesList()
          courses = result
          break
      }
      data.total = result.total

      // 将每个课程的courseId(productId)收集，获取老师介绍
      // 将每个课程的liveshowId收集，获取是否正在直播
      let courseIds = []
      let liveIds = []
      for (let i in courses) {
        let _i = courses[i]
        courseIds.push(_i.id)
        liveIds.push(_i.liveshowId)

        // 先存入一些可以渲染的数据
        _i._avatar = _i.avatar + '?imageView2/1/w/640/h/420/interlace/1'
        _i._beginAt = parseTime(_i.beginAt / 1000, '{y}.{m}.{d}')
        _i._endAt = parseTime(_i.endAt / 1000, '{y}.{m}.{d}')
        if (_i.showBegin) {
          _i._showBegin = parseTime(_i.showBegin / 1000, '{m}月{d}日 {h}:{i}')
        }
      }

      // 初期先把列表加载出来
      // 标记第一次渲染列表
      let firstRende = 1
      commit('LOADING_SHOW', { id: 'coursesList', isShow: false })
      commit('GET_COURSES_LIST', { courses, data, firstRende })

      // 循环获得老师介绍数组并以courseId规约为对象
      // “我的授课”不需要获取老师信息
      let teacherIntros = []
      if (data.type !== 'teacher') {
        for (let j in courseIds) {
          let teacherIntro = await GetTeacherIntros(courseIds[j])
          teacherIntros.push(teacherIntro[0])
        }
        teacherIntros = arrToObjByKey('productId', teacherIntros)
      }

      // 如果是“我的课程”，则需要获取是否正在推流
      let liveStatus = []
      if (data.type === 'user' && courses.length) {
        let liveInfo = await GetLiveInfo(liveIds)
        for (let l in liveInfo) {
          let _l = liveInfo[l]
          let status = {
            liveId: _l.id,
            liveStatus: _l.live_status === 1
          }
          liveStatus.push(status)
        }
        liveStatus = arrToObjByKey('liveId', liveStatus)
      }

      // 补充列表信息
      for (let k in courses) {
        let _k = courses[k]
        if (data.type !== 'teacher') _k.teacherIntro = teacherIntros[_k.id]

        // 正在直播：处在上课时间并且正在推流
        if (data.type === 'user') {
          let curTime = Date.parse(new Date())
          let atLiveTime = curTime > _k.showBegin && curTime < _k.showEnd
          let hasLiveStream = liveStatus[_k.liveshowId].liveStatus
          _k._liveStatus = atLiveTime && hasLiveStream
        }
      }

      // 渲染完整的列表，包括老师介绍和直播状态
      commit('GET_COURSES_LIST', { courses, data })
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程列表获取失败' })
      Logger.error(err, 'action: course/getCoursesList')
    }
  },

  async getRecommandCourses ({ commit }) {
    try {
      let courses = []
      let recommandition = await GetRecommandition(1)
      for (let i in recommandition) {
        // 主页取3个就够了
        if (i === '3') break

        // 获取课程详情
        let courseId = recommandition[i].id
        let courseInfo = await GetCourseInfo(courseId)
        let course = courseInfo

        // 获取老师信息
        let teacherIntro = await GetTeacherIntros(courseId)
        course.teacherIntro = teacherIntro[0]

        // 数据处理
        course._avatar = course.avatar + '?imageView2/1/w/640/h/420/interlace/1'
        course._beginAt = parseTime(course.beginAt / 1000, '{y}.{m}.{d}')
        course._endAt = parseTime(course.endAt / 1000, '{y}.{m}.{d}')
        courses.push(course)
      }

      commit('LOADING_SHOW', { id: 'coursesList', isShow: false })
      commit('RECOMMAND_COURSES', courses)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '推荐课程获取失败' })
      Logger.error(err, 'action: course/getRecommandCourses')
    }
  },

  async getCourseInfo ({ commit }, courseId) {
    try {
      let courseInfo = await GetCourseInfo(courseId)

      // 获取老师信息
      let teacherIntro = await GetTeacherIntros(courseId)
      // 给出默认值
      if (!teacherIntro[0]) {
        teacherIntro[0] = {
          content: '',
          teacherName: ''
        }
      }
      courseInfo.teacherIntro = teacherIntro[0]
      if (courseInfo.notice) {
        // eslint-disable-next-line
        courseInfo._notice = courseInfo.notice.replace(/\n/g, '<br>')
      }
      courseInfo._beginAt = parseTime(courseInfo.beginAt / 1000, '{y}.{m}.{d}')
      courseInfo._endAt = parseTime(courseInfo.endAt / 1000, '{y}.{m}.{d}')
      let curTime = Date.parse(new Date())
      if (curTime < courseInfo.signupDeadline) {
        courseInfo._signupDeadline = parseTime(courseInfo.signupDeadline / 1000, '{y}.{m}.{d}')
      } else {
        courseInfo._signupDeadline = '已截止'
      }

      commit('GET_COURSE_INFO', courseInfo)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程详情信息获取失败' })
      Logger.error(err, 'action: course/getCourseInfo')
    }
  },

  async getCourseBanners ({ commit }, courseId) {
    try {
      let res = await GetCourseBanners(courseId)
      let banners = []
      for (let i in res) {
        let _i = res[i]
        _i._content = _i.content + '?imageView2/5/w/1000/h/562'
        banners.push(_i._content)
      }
      commit('GET_COURSE_BANNER', banners)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程封面获取失败' })
      Logger.error(err, 'action: course/getCourseBanners')
    }
  },

  async getCourseFeatures ({ commit }, courseId) {
    try {
      let features = await GetCourseFeatures(courseId)
      commit('GET_LESSON_FEATURES', features)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程特色获取失败' })
      Logger.error(err, 'action: course/getCourseFeatures')
    }
  },

  async getCourseOutlines ({ commit }, courseId) {
    try {
      let outlines = await GetCourseOutlines(courseId)
      commit('GET_LESSON_OUTLINES', outlines)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '课程大纲获取失败' })
      Logger.error(err, 'action: course/getCourseOutlines')
    }
  },

  async getCourseFaqs ({ commit }, courseId) {
    try {
      let faqs = await GetCourseFaqs(courseId)
      commit('GET_LESSON_FAQS', faqs)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: 'FAQ获取失败' })
      Logger.error(err, 'action: course/getCourseFaqs')
    }
  },

  async getCourseTeacherIntros ({ commit }, courseId) {
    try {
      let teacherIntros = await GetTeacherIntros(courseId)
      commit('GET_LESSON_TEACHER_INTROS', teacherIntros)
    } catch (err) {
      commit('BOXY_SHOW', { type: 'tip', message: '老师信息获取失败' })
      Logger.error(err, 'action: course/getCourseTeacherIntros')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
