<!-- 某作业内容组件
     组件链：作业tab页 > 作业列表组件 > 某作业内容组件 > 论坛组件
     作者：平原
     创建：2017-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="homework_details_page" v-if="userDetail.verify_status">
    <div class="homework_desc">
      <h3>作业内容</h3>
      <a
        
        @click="$router.go(-1)"
        class="back btn_hollow_small">返 回</a>
      <a
        
        v-if="isTeacherPage"
        @click="deleteHomework()"
        class="delete btn_hollow_small">删 除</a>
      <div>
        <h4>{{ homeworkDetails.title || '暂无作业标题' }}</h4>
        <p v-html="homeworkDetails._content || ''"></p>
        <!-- 作业详情图片墙 -->
        <picture-card v-if="homeworkDetails && homeworkDetails.imageContents && homeworkDetails.imageContents.length > 0" :images="homeworkDetails.imageContents"></picture-card>
      </div>
    </div>
    <div class="homework_details_content">
      <a  class="do_homework btn_hollow_small" @click="showEditor()">写作业</a>
      <h3>作业详情</h3>
      
      <post-editor type="replyHomework" v-if="isShow"></post-editor>
      <posts comments-type="homework" :all-loaded="scrollLoad.allLoaded"></posts>
    </div>
  </div>
</template>

<script>
  import { USER_INFO_KEY } from '../../../config'
  import { getUrlQuery } from '../../../utils/enhance'
  import Storage from '../../../utils/storage'
  import Posts from '../../modules/Posts/'
  import PostEditor from '../../modules/PostEditor/'
  import PictureCard from '../../modules/PictureCard/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        isShow: false,
        isTeacherPage: window.location.pathname.indexOf('teacher') > -1,
        userDetail: Storage.get(USER_INFO_KEY),
        courseId: getUrlQuery('course_id'),
        postId: getUrlQuery('post_id'),
        toUserId: getUrlQuery('user_id'),
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
      PictureCard
    },

    computed: mapState({
      homeworkDetails: state => state.homework.homeworkDetails,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      eventEmitter (val) {
        let { event, data } = val
        switch (event) {
          // 监听来自PostEditor下replyHomework类型的确定回复消息
          case 'confirmReply':
            if (data.type !== 'replyHomework') return
            this.$store.dispatch('replyHomework', {
              postId: this.postId,
              toUserId: this.toUserId,
              message: data.message,
              imagesUrl: data.imagesUrl
            }).then(() => {
              // 发贴成功后重新加载整个列表
              // 并隐藏编辑框
              // 之前滚动加载的列表内容也因state的更新而被清空
              this.loadHomeworkCommentsList(1)
              this.curPage = 1
              this.isShow = false
              data.callback && data.callback()
            })
            break

          // 监听来自PostEditor下replyHomework类型的关闭回复输入框消息
          case 'closeReplyEditor':
            if (data.type !== 'replyHomework') return
            this.showEditor()
            break

          // 监听来自Boxy的确定信息
          case 'boxyHide':
            if (data && data.message === '确定要删除此讨论及相关回复？') {
            }
            break
        }
      }
    },

    created () {
      this.loadHomeworkCommentsList(1)
      this.$store.dispatch('getHomeworkDetails', this.postId)
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
          this.loadHomeworkCommentsList(++this.curPage)
        }
      },

      async loadHomeworkCommentsList (curPage) {
        let loadStatus = await this.$store.dispatch('getReplysList', {
          postId: this.postId,
          page: curPage,
          limit: 10
        })
        if (!loadStatus) return
        this.scrollLoad = loadStatus
      },

      deleteHomework () {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定要删除此讨论及相关回复？',
          async confirm () {
            try {
              await self.$store.dispatch('deleteHomework', {
                postId: self.postId
              })

              // 删除作业后重定向到作业列表页
              self.$router.replace({
                path: 'details/homework',
                query: { course_id: self.courseId }
              })
            } catch (err) {
              console.log(err)
            }
          }
        })
      }
    }
  }
</script>
