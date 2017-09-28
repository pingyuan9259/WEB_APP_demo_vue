<!-- 讨论tab页
     作者：平原
     组件链：讨论tab页 > 论坛组件
     创建：2017-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="comments">
    <div class="comments_content" v-if="userDetail.verify_status === 1">
      <h3>课程讨论</h3>
      <a  class="create btn_hollow_small" @click="showEditor()">我有话说</a>

      <post-editor type="create" v-if="isShow"></post-editor>
      <posts comments-type="course" :all-loaded="scrollLoad.allLoaded"></posts>
    </div>
    
    <div class="tip" v-if="userDetail.verify_status !== 1">
      <p>
        <span class="icon-double-quotation tip_head"></span>
        通过新生大学APP进行「绑定手机号」后再参与讨论吧
      </p>
    </div>
  </div>
</template>

<script>
  import { USER_INFO_KEY } from '../../../config'
  import { getUrlQuery } from '../../../utils/enhance'
  import Storage from '../../../utils/storage'
  import Posts from '../Posts/'
  import PostEditor from '../PostEditor/'
  import Loading from '../Loading/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        isShow: false,
        userDetail: Storage.get(USER_INFO_KEY),
        courseId: getUrlQuery('course_id'),
        scrollLoad: {
          loaded: false,
          allLoaded: false
        },
        curPage: 1
      }
    },

    components: {
      Posts,
      PostEditor,
      Loading
    },

    computed: mapState({
      courseInfo: state => state.course.courseInfo,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      courseInfo () {
        this.loadCommentsList(1)
      },

      eventEmitter (val) {
        let { event, data } = val
        switch (event) {
          // 监听来自PostEditor下create类型的确定回复消息
          case 'confirmReply':
            if (data.type !== 'create') return
            this.$store.dispatch('createPost', {
              // bbsId: this.courseInfo.bbsId,
              bbsId: this.courseInfo.bbsId,
              type: 'comments',
              content: data.message,
              imagesUrl: data.imagesUrl
            }).then(() => {
              // 发贴成功后重新加载整个列表
              // 并隐藏编辑框
              // 之前滚动加载的列表内容也因state的更新而被清空
              this.loadCommentsList(1)
              this.curPage = 1
              this.isShow = false
              data.callback && data.callback()
            })
            break

          // 监听来自PostEditor下create类型的关闭回复输入框消息
          case 'closeReplyEditor':
            if (data.type !== 'create') return
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

      // 滚动加载
      loadMore () {
        let sh = window.scrollY
        let wh = window.innerHeight
        let dh = document.body.scrollHeight
        if (dh - sh - wh < 30 && this.scrollLoad.loaded && !this.scrollLoad.allLoaded) {
          this.scrollLoad.loaded = false
          this.loadCommentsList(++this.curPage)
        }
      },

      async loadCommentsList (curPage) {
        let loadStatus = await this.$store.dispatch('getCommentsList', {
          bbsId: this.courseInfo.bbsId,
          page: curPage,
          limit: 10
        })
        if (!loadStatus) return
        this.scrollLoad = loadStatus
      }
    }
  }
</script>
