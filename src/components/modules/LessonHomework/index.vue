<!-- 作业tab页
     作者：平原
     组件链：作业tab页 > 作业列表组件 > 某作业内容组件 > 论坛组件
     创建：2017-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="comments">
    <div class="comments_content" v-if="userDetail.verify_status === 1">
      <h3>课程作业</h3>
      <a
        v-if="isTeacherPage"
        @click="showEditor()"
        class="create btn_hollow_small">新建作业</a>
      <post-editor type="createHomework" v-if="isShow"></post-editor>
      <homework-list :all-loaded="scrollLoad.allLoaded"></homework-list>
    </div>
    
    <div class="tip" v-if="userDetail.verify_status !== 1">
      <p>
        <span class="icon-double-quotation tip_head"></span>
        通过新生大学APP进行「绑定手机号」后才能看到老师发的作业哦
      </p>
    </div>
  </div>
</template>

<script>
  import { USER_INFO_KEY } from '../../../config'
  import { getUrlQuery } from '../../../utils/enhance'
  import Storage from '../../../utils/storage'
  import HomeworkList from '../HomeworkList/'
  import PostEditor from '../PostEditor/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        isShow: false,
        userDetail: Storage.get(USER_INFO_KEY),
        isTeacherPage: window.location.pathname.indexOf('teacher') > -1,
        courseId: getUrlQuery('course_id'),
        scrollLoad: {
          loaded: false,
          allLoaded: false
        },
        curPage: 1
      }
    },

    components: {
      HomeworkList,
      PostEditor
    },

    computed: mapState({
      courseInfo: state => state.course.courseInfo,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      courseInfo (val) {
        this.loadHomeworkList(1)
      },

      eventEmitter (val) {
        let { event, data } = val
        switch (event) {
          // 监听来自PostEditor下create类型的确定回复消息
          case 'confirmReply':
            if (data.type !== 'createHomework') return
            this.$store.dispatch('createHomework', {
              bbsId: this.courseInfo.jobId,
              type: 'homework',
              title: data.title,
              content: data.message,
              endTime: data.endTime,
              imagesUrl: data.imagesUrl
            }).then(() => {
              // 发贴成功后重新加载整个列表
              // 并隐藏编辑框
              // 之前滚动加载的列表内容也因state的更新而被清空
              this.loadHomeworkList(1)
              this.curPage = 1
              this.isShow = false
              data.callback && data.callback()
            })
            break

          // 监听来自PostEditor下create类型的关闭回复输入框消息
          case 'closeReplyEditor':
            if (data.type !== 'createHomework') return
            this.showEditor()
            break
        }
      }
    },

    created () {
      this.$store.dispatch('getCourseInfo', this.courseId)
      window.addEventListener('scroll', this.loadMore)
    },

    destroyed () {
      window.removeEventListener('scroll', this.loadMore)
    },

    methods: {
      showEditor () {
        if (this.isShow) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      },

      createPost (data) {
        // let self = this
        this.$store.dispatch('createPost', data).then(() => {
          // 回复成功以后关闭输入框，重新加载列表
          this.isShow = false
        })
      },

      // 滚动加载
      loadMore () {
        let sh = window.scrollY
        let wh = window.innerHeight
        let dh = document.body.scrollHeight
        if (dh - sh - wh < 30 && this.scrollLoad.loaded && !this.scrollLoad.allLoaded) {
          this.scrollLoad.loaded = false
          this.loadHomeworkList(++this.curPage)
        }
      },

      async loadHomeworkList (curPage) {
        let loadStatus = await this.$store.dispatch('getHomeworkList', {
          bbsId: this.courseInfo.jobId,
          page: curPage,
          limit: 10
        })
        if (!loadStatus) return
        this.scrollLoad = loadStatus
      }
    }
  }
</script>
