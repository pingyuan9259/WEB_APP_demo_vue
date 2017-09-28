<!-- 课程表tab页
     作者：平原
     创建：2017-6-1
     优化：2017-7-14
     注释2#，代表不是由vue事件绑定或生命周期直接调用的方法，即二级方法 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="lesson_content">
    <lesson-notice
      :content="courseInfo._notice"
      :can-edit="canEdit"></lesson-notice>

    <div class="notice">
      <span class="el-icon-warning"></span>
      <p v-html="'公告：' + (courseInfo._notice || '暂无公告')"></p>
    </div>

    <div v-if="isTeacherPage && canEdit" class="ppt">
      <upload-p-p-t></upload-p-p-t>
    </div>

    <div class="schedules">
      <h3>课程表</h3>
      <a
        v-if="liveStatus"
        @click="toLiveRoom()"
        class="live_btn btn_solid_small">直播间</a>
      <span 
        v-if="!liveStatus"
        class="live_btn_disabled btn_solid_small">暂无直播</span>
      <a
        v-if="isTeacherPage && canEdit"
        @click="callSchedule('add')"
        class="edit btn_hollow_small">添加课程</a>

      <ul class="schedules_list">
        <li class="schedules_item"
          v-for="(item, index) in schedules"
          :key="index">
          <span class="index">{{ index + 1 }}</span>
          <p class="schedules_title">{{ item.title || '无描述'}}</p>
          <span class="schedules_time">
            {{ item.playbackUrl ? (item.playbackDes ? item.playbackDes : '直播回放') : (item._showBegin + ' - ' + item._showEnd) }}
          </span>
          <a 
            @click="callSchedule('update', item.id, item.title, item.showBegin, item.showEnd, item.playbackUrl, item.playbackDes)"
            v-if="canEdit && !(nextShowId === item.id && liveStatus)"
            class="update">
            编辑
          </a>
          <a
            v-if="liveScheduleId === item.id && liveStatus && isTeacherPage && canEdit"
            :data-clipboard-text="liveUrl"
            id="get_live_url"
            class="live_option">复制OBS的URL</a>
          <a
            v-if="liveScheduleId === item.id && liveStatus && isTeacherPage && canEdit"
            :data-clipboard-text="livePassword"
            id="get_live_password"
            class="live_option">复制OBS流名称</a>

          <a
            v-if="liveScheduleId === item.id && liveStatus && !isTeacherPage && canEdit"
            @click="toLiveRoom()"
            class="live_btn btn_hollow_small">正在直播</a>

          <a v-if="item.playbackUrl"
            @click="toPlayBack(item.playbackUrl, index)"
            class="live_btn btn_hollow_small">回放</a>
          
          <!-- 如果直播信息存在课时id并且正在推流，并且在‘我的授课’页面 -->
          <a
            v-if="liveScheduleId === item.id && liveStatus && isTeacherPage && canEdit"
            @click="startLesson(item.id, 2)"
            class="start_lesson btn_hollow_small">
            下课
          </a>

          <a
            v-if="nextShowId === item.id && !liveStatus && isTeacherPage && canEdit"
            @click="startLesson(item.id, 1)"
            class="start_lesson btn_hollow_small">
            上课
          </a>
        </li>
      </ul>

      <div v-if="schedules && schedules.length" class="load">
        <span v-if="!scrollLoad.allLoaded">加载中...</span>
        <span v-if="scrollLoad.allLoaded">没有更多</span>
      </div>

      <div v-if="schedules && !schedules.length" class="tip">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          老师还未添加课程表
        </p>
      </div>
    </div>

    <schedule-editor
      v-if="showEditor"
      :course-id="courseId"
      :editor-data="editorData"
      :editor-type="editorType"></schedule-editor>
  </div>
</template>

<script>
  import { parseTime, getUrlQuery } from '../../../utils/enhance'
  import { USER_INFO_KEY } from '../../../config'
  import Storage from '../../../utils/storage'
  import LessonNotice from '../LessonNotice/'
  import UploadPPT from '../UploadPPT/'
  import ScheduleEditor from '../ScheduleEditor/'
  import { mapState } from 'vuex'
  import Clipboard from 'clipboard'
  import AES from '../../../libs/DES'
  import { AES_KEY } from '../../../config/'

  // apis
  import GetLiveInfo from '../../../api/live/GetLiveInfo'

  export default {
    data () {
      return {
        courseId: getUrlQuery('course_id'),
        userDetails: Storage.get(USER_INFO_KEY),
        isTeacherPage: false,
        liveId: '',
        liveStatus: false,
        liveScheduleId: '',
        liveUrl: '',
        livePassword: '',

        // 课时编辑框
        showEditor: false,
        editorData: {},
        editorType: '', // add、update、delete共享一个编辑组件，默认为add

        // 滚动加载
        scrollLoad: {
          loaded: false,
          allLoaded: false
        },
        curPage: 1
      }
    },

    components: {
      LessonNotice,
      UploadPPT,
      ScheduleEditor
    },

    computed: mapState({
      schedules: state => state.schedule.schedules,
      nextShowId: state => state.schedule.nextShowId,
      canEdit: state => state.schedule.canEdit,
      courseInfo: state => state.course.courseInfo,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      courseInfo (val) {
        this.liveId = val.liveshowId
        this.getLiveInfo()
      },

      eventEmitter (val) {
        let { event, data } = val
        if (event === 'closeScheduleEditor') {
          this.showEditor = false
          if (data.needInit) {
            this.loadScheduleList(1)
            this.curPage = 1
          }
        }
      }
    },

    async created () {
      try {
        this.loadScheduleList(1)
        this.$store.dispatch('canEditCourseSchedule', this.courseId)
        await this.$store.dispatch('getCourseInfo', this.courseId)

        // 利用clipbroad将liveUrl复制到剪贴板
        let clipLiveUrl = new Clipboard('#get_live_url')
        clipLiveUrl.on('success', () => {
          this.$store.dispatch('boxyTip', { message: 'OBS的URL已复制到剪贴板' })
        })
        let clipLivePassword = new Clipboard('#get_live_password')
        clipLivePassword.on('success', () => {
          this.$store.dispatch('boxyTip', { message: 'OBS流名称已复制到剪贴板' })
        })

        window.addEventListener('scroll', this.loadMore)
      } catch (err) {
        console.log(err)
      }
    },

    mounted () {
      this.isTeacherPage = window.location.pathname.indexOf('teacher') > -1
    },

    destroyed () {
      window.removeEventListener('scroll', this.loadMore)
    },

    methods: {
      // 打开课课时编辑框组件
      // 两种情况：‘添加课程’和‘编辑’
      callSchedule (type, id, title, start, end, playbackUrl, playbackDes) {
        if (type === 'update') {
          this.editorData = {
            scheduleId: id,
            title: title,
            date: parseTime(start / 1000, '{y}-{m}-{d}'),
            start: parseTime(start / 1000, '{h}:{i}'),
            end: parseTime(end / 1000, '{h}:{i}'),
            // 如果是删除操作并且删除的是即将上课的课时
            // 那么即将上课的标签将被放倒下一个相邻的课程中
            isNextShow: this.nextShowId === id,
            playbackUrl: playbackUrl && AES.outAes(playbackUrl, AES_KEY), // 回放地址
            playbackDes: playbackDes  // 回放描述
          }
        }
        this.editorType = type
        this.showEditor = true
      },

      // 跳转到直播页
      toLiveRoom () {
        if (this.liveStatus) {
          window.open('/liveshow?liveId=' + this.liveId)
        } else {
          this.$store.dispatch('boxyTip', { message: '直播马上开始，请耐心等待' })
        }
      },

      // 跳转到回放
      toPlayBack (backUrl, index) {
        window.localStorage.setItem('pburl', backUrl)
        window.open(`/playback?courseId=${this.courseId}&index=${index}`)
      },

      // 上课或下课
      async startLesson (scheduleId, status) {
        let success = await this.$store.dispatch('changeLiveStatus', {
          scheduleId: scheduleId,
          status: status
        })
        if (success) this.getLiveInfo()
      },

      // 2#: 获取liveUrl, 更新liveStatus
      async getLiveInfo () {
        try {
          let liveInfo = await GetLiveInfo(this.liveId)
          this.liveStatus = liveInfo.live_status === 1
          this.liveScheduleId = liveInfo.section_id
          let liveAdress = liveInfo.live_schema.rtmp_publish_url.split('live/')
          this.liveUrl = liveAdress[0] + 'live/'
          this.livePassword = liveAdress[1]
        } catch (err) {
          if (err.message.indexOf('split') > -1) return // 容错：无直播地址
          this.$store.dispatch('boxyTip', { message: '未找到直播信息' })
          this.liveStatus = false
        }
      },

      // 滚动加载
      loadMore () {
        let sh = window.scrollY
        let wh = window.innerHeight
        let dh = document.body.scrollHeight
        if (dh - sh - wh < 30 && this.scrollLoad.loaded && !this.scrollLoad.allLoaded) {
          this.scrollLoad.loaded = false
          this.loadScheduleList(++this.curPage)
        }
      },

      async loadScheduleList (curPage) {
        let loadStatus = await this.$store.dispatch('getCourseSchedule', {
          productId: this.courseId,
          page: curPage,
          limit: 10
        })
        if (!loadStatus) return
        this.scrollLoad = loadStatus
      }
    }
  }
</script>
