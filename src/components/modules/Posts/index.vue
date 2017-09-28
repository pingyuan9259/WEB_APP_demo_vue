<!-- 论坛组件
     组件链1：作业tab页 > 作业列表组件 > 某作业内容组件 > 论坛组件
     组件链2：讨论tab页 > 论坛组件
     作者：平原
     创建：2017-6-12 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="posts">
    <div class="posts_content">
      <ul class="posts_list">
        <li 
          v-for="(item, index) in comments"
          :key="index"
          class="posts_item">
          <img v-lazy="item.avatar || defaultAvatar" alt="" class="avatar">
          <div class="item_content">
            <span class="name">{{ item.fromName }}</span>
            <span
              v-if="item.fromUserId === teacherUserId && commentsType === 'homework'"
              class="teacher_sign">老师</span>
            <span class="label" v-else-if="item.labels && item.labels.length > 0" :style="{backgroundColor: item.labels[0].color}">{{item.labels[0].name}}</span>

            <p class="article" v-html="item.content"></p>

            <div class="pic_card">
              <picture-card
                v-if="item.imageContents && item.imageContents.length > 0"
                :images="item.imageContents"></picture-card>
            </div>

            <audio-message
              v-if="item.audioUrl"
              :index="index"
              :audio-url="item.audioUrl"></audio-message>

            <div class="option">
              <span class="time">{{ item.createdTime }}</span>
              <span
                :class="'like ' + (item.isLike ? 'icon-love' : 'icon-not-love')"
                @click="like(item.postId, item.replyId, item.isLike, index)"></span>
              <span
                class="like_num"
                v-if="item.likeNum">{{ item.likeNum }}</span>
              <span
                class="reply icon-reply"
                @click="showReplyEditor({ 
                  index: index,
                  postId: item.postId,
                  replyId: item.replyId,
                  toUserId: item.fromUserId
                })"></span>
              <span
                class="delete_post icon-empty"
                v-if="item.fromUserId === userDetail.id"
                @click="deleteComment({
                  postId: item.postId,
                  replyId: item.replyId,
                  index: index
                })"></span>
            </div>

            <ul 
              v-if="item.replyList.length"
              class="reply_list"
              :style="{ 'paddingBottom': item.replyList.length > 3 ? '45px' : '' }">
              <li 
                v-for="(rItem, rIndex) in item.replyList"
                :key="rIndex"
                v-show="replyIndex === index || rIndex < 3"
                class="reply_item">
                <a
                  
                  class="reply_user"
                  @click="showReplyEditor({ 
                    index: index,
                    postId: item.postId,
                    replyId: item.replyId,
                    toUserId: rItem.fromUserId,
                    toName: rItem.fromName
                  })">
                  {{ rItem.fromName}}
                  <span
                    v-if="rItem.fromUserId === teacherUserId && commentsType === 'homework'"
                    class="teacher_sign">老师</span>
                  <span class="label" v-else-if="rItem.labels && rItem.labels.length > 0" :style="{backgroundColor: rItem.labels[0].color}">{{rItem.labels[0].name}}</span>
                  <span
                    v-if="rItem.toUserId !== item.fromUserId && commentsType === 'course'"
                    class="at_someone"> to {{ rItem.toName }}</span>
                  ：
                </a>
                <span class="reply_content" v-html="rItem.content"></span>

                <span
                  class="delete_reply"
                  v-if="rItem.fromUserId === userDetail.id"
                  @click="deleteReply(rItem.replyId, index, rIndex)">删除</span>

                <div class="pic_card">
                  <picture-card
                    v-if="rItem.imageContents && rItem.imageContents.length > 0"
                    :images="rItem.imageContents"
                    :style="{ 'marginTop': '10px' }"></picture-card>
                </div>

                <audio-message
                  v-if="rItem.audioUrl"
                  :index="(index + 1) * (rIndex + 1)"
                  :audio-url="rItem.audioUrl"
                  :style="{ 'marginTop': '15px' }"></audio-message>
              </li>

              <li class="show_more" v-if="item.replyList.length > 3">
                <a  @click="showReply(index)">
                  {{ replyIndex === index ? '收起' : '还有' + (item.replyList.length - 3) + '条回复' }}
                </a>
              </li>
            </ul>

            <post-editor 
              type="reply"
              :index="index"
              :reply-to="replyInfo.toName"
              v-if="replyEditorIndex === index"></post-editor>
          </div>
        </li>
      </ul>

      <div class="load" v-if="comments && comments.length">
        <span v-if="!allLoaded">加载中...</span>
        <span v-if="allLoaded">没有更多</span>
      </div>

      <div class="tip" v-if="comments && !comments.length">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          暂时没有回复
        </p>
      </div>

      <loading
        id="commentsList"
        :animation="true"></loading>
    </div>
  </div>
</template>

<script>
  import PostEditor from '../PostEditor/'
  import PictureCard from '../PictureCard/'
  import AudioMessage from '../AudioMessage/'
  import Loading from '../Loading/'
  import Storage from '../../../utils/storage'
  import { DEFAULT_AVATAR, USER_INFO_KEY } from '../../../config'
  import { getUrlQuery } from '../../../utils/enhance'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        userDetail: Storage.get(USER_INFO_KEY),
        defaultAvatar: DEFAULT_AVATAR,
        teacherUserId: getUrlQuery('user_id'),
        replyInfo: {
          postId: '',
          replyId: '',
          toName: '',
          toUserId: '',
          name: '',
          userId: ''
        },
        replyIndex: -1,
        replyEditorIndex: -1
      }
    },

    props: {
      commentsType: {
        required: true,
        type: String
      },
      allLoaded: {
        required: true,
        type: Boolean
      }
    },

    components: {
      PostEditor,
      PictureCard,
      AudioMessage,
      Loading
    },

    computed: mapState({
      comments (state) {
        if (this.commentsType === 'homework') {
          return state.homework.homeworkComments
        }
        return state.post.comments
      },
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      eventEmitter (val) {
        let { event, data } = val
        switch (event) {
          // 监听来自PostEditor下reply类型的确定回复消息
          case 'confirmReply':
            if (data.type !== 'reply') return
            this.reply(data)
            break

          // 监听来自PostEditor下reply类型的关闭回复输入框消息
          case 'closeReplyEditor':
            if (data.type !== 'reply') return
            this.replyEditorIndex = -1
            this.replyInfo.toName = ''
            break
        }
      }
    },

    methods: {
      // 显示指定的更多回复，默认只显示3条
      showReply (index) {
        // 如果目前已经展开并且是本身，则收起
        if (this.replyIndex === index) {
          this.replyIndex = -1
          return
        }

        // 显示贴子的更多回复
        this.replyIndex = index
      },

      // 显示指定的回复输入框
      showReplyEditor (data) {
        // 如果目前已经显示并且是本身，则隐藏
        if (this.replyEditorIndex === data.index) {
          this.replyEditorIndex = -1
          return
        }

        // 显示贴子的回复输入框
        this.replyEditorIndex = data.index

        // 储存回复贴子(或者给某人)的信息
        this.replyInfo = Object.assign(data, {
          userId: this.userDetail.id,
          name: this.userDetail.fullname
        })
      },

      like (postId, replyId, isLike, index) {
        if (this.commentsType === 'course') {
          this.$store.dispatch('likePost', { postId, isLike, index })
        }

        if (this.commentsType === 'homework') {
          this.$store.dispatch('likeHomework', { replyId, isLike, index })
        }
      },

      async reply (data) {
        try {
          let success = false
          let replyParams = Object.assign(this.replyInfo, data, this.replyEditorIndex)

          if (this.commentsType === 'course') {
            success = await this.$store.dispatch('replyPost', replyParams)
          }

          if (this.commentsType === 'homework') {
            success = await this.$store.dispatch('replyHomework', replyParams)
          }

          // 状态恢复初始
          if (success) {
            this.replyEditorIndex = -1
            this.replyInfo = {
              postId: '',
              replyId: '',
              toUserId: '',
              pid: '',
              name: '',
              userId: ''
            }
            data.callback && data.callback()
          }
        } catch (err) {
          console.log(err)
        }
      },

      deleteComment (data, confirm) {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定要删除该内容？',
          data: data,
          confirm () {
            if (self.commentsType === 'course') {
              self.$store.dispatch('deletePost', data)
            }

            if (self.commentsType === 'homework') {
              self.$store.dispatch('deleteHomeworkReply', data)
            }
          }
        })
      },

      deleteReply (replyId, index, rIndex) {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定删除该条回复？',
          confirm () {
            if (self.commentsType === 'course') {
              self.$store.dispatch('deletePostReply', { replyId, index, rIndex })
            }

            if (self.commentsType === 'homework') {
              self.$store.dispatch('deleteHomeworkCommentsReply', { replyId, index, rIndex })
            }
          }
        })
      }
    }
  }
</script>
