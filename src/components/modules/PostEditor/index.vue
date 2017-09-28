<!-- 论坛输入框组件
     作者：平原
     创建：2017-6-12 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="post_editor">
    <!-- 定位锚点 -->
    <span class="target_fix" ref="targetFix" :style="{ 'top': offset }"></span>
    <div class="editor_container">
      <div class="homework_title" v-if="type === 'createHomework'">
        <input
          type="text"
          v-model="titleVal"
          placeholder="作业标题..."
          maxLength="50"
          ref="inputArea">
        <span class="text_count">
          {{ titleVal.length + '/50' }}
        </span>
      </div>

      <div class="textarea">
        <textarea
          type="text"
          v-model="contentVal"
          :placeholder="placeholder"
          :maxLength="contentLimit"
          ref="textArea"></textarea>
        <span
          :class="{ 'full_count': (contentLimit - contentVal.length) < 1 }"
          class="text_count">
          {{ contentVal.length + '/' + contentLimit }}
        </span>
        <transition name="fade"><span v-if="drafted" class="text_has_drafted">编辑内容已保存</span></transition>
      </div>

      <!-- 图片上传 -->
      <div class="upload_container">
        <el-upload
          :disabled="imageContent.length > 8"
          action=""
          list-type="picture-card"
          :http-request="uploadImage"
          :before-upload="handleBeforeUpload"
          :on-remove="handleRemove">
          <i class="el-icon-plus" @click="imgCount()"></i>
        </el-upload>
      </div>

<!--       <div class="homework_end_date" v-if="type === 'createHomework'">
        <span>截止时间：</span>
        <el-date-picker
          v-model="dateModel.date"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          @change="getDate"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-time-select
          v-model="dateModel.time"
          placeholder="选择时间"
          @change="getTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:45',
            format: 'HH:mm:ss'
          }">
        </el-time-select>
      </div> -->

      <a
        v-if="hasDraft"
        @click="getDraft()"
        class="draft pull_left">还原上次编辑的内容</a>

      <a
        @click="confirmReply()"
        :class="{ 'btn_solid_disabled': !uploadSuccess }"
        class="confirm btn_solid_small">
        {{ type ===  'reply' ? '评论' : '发布'}}
      </a>

      <a
        @click="closeReplyEditor()"
        class="cancel btn_solid_small">取消</a>
    </div>
  </div>
</template>

<script>
  import UploadImage from '../../../api/common/UploadImage'
  import Cookie from '../../../utils/cookie'
  import base64 from '../../../libs/base64'
  import { ENV, TOP_LEVEL_HOST } from '../../../config'

  export default {
    data () {
      return {
        placeholder: '',
        offset: '0',
        titleVal: '',
        titleCount: 0,
        contentVal: '',
        contentCount: 0,
        contentLimit: 1000,
        curScrollTop: '',
        imageContent: [],
        uploadSuccess: true,
        timer1: null,
        timer2: null,
        draftKey: '',
        hasDraft: 0,
        drafted: 0
      }
    },

    props: {
      type: {}, // 通过type去对应接收消息的组件
      index: {},
      replyTo: {}
    },

    created () {
      // 使锚点元素在浏览器最顶端时post_editor底部与浏览器底部齐平
      let offsetValue = document.documentElement.clientHeight - 360 // 260是依据post_editor初始高度调整出来的
      this.offset = '-' + offsetValue + 'px'

      // 判断字数限制以及placeholder
      switch (this.type) {
        case 'createHomework':
          this.placeholder = '作业内容...'
          this.contentLimit = 1000
          break
        case 'replyHomework':
          this.placeholder = '写作业...'
          this.contentLimit = 3000
          break
        case 'create':
          this.placeholder = '说点儿什么...'
          this.contentLimit = 1000
          break
        case 'reply':
          this.placeholder = this.replyTo ? '回复给 ' + this.replyTo + ':' : '回复内容...'
          this.contentLimit = 500
          break
      }
    },

    mounted () {
      // 滚动至锚点
      if (this.type === 'reply') {
        this.$refs.targetFix.scrollIntoView()
      }
      if (this.type === 'createHomework') {
        this.$refs.inputArea.focus()
      } else {
        this.$refs.textArea.focus()
      }

      this.draftKey = '_draft_' + this.type + ENV

      // 检查是否有草稿
      if (Cookie.getCookie(this.draftKey)) {
        this.hasDraft = 1
      }

      // 轮询保存草稿
      this.timer1 = setInterval(() => {
        if (this.contentVal) {
          let draftVal = base64.encodeURI(this.contentVal)
          Cookie.setCookie(this.draftKey, draftVal, TOP_LEVEL_HOST, 1)
          this.drafted = 1
          this.timer2 = setTimeout(() => {
            this.drafted = 0
          }, 3000)
        }
      }, 60000)
    },

    destroyed () {
      clearInterval(this.timer1)
      clearTimeout(this.timer2)
    },

    methods: {
      // 点击取消按钮时对该父组件发消息
      closeReplyEditor () {
        this.$store.dispatch('eventEmitter', {
          event: 'closeReplyEditor',
          data: {
            type: this.type
          }
        })
      },

      // 点击发送按钮时对该父组件发消息
      confirmReply () {
        if (!this.uploadSuccess) return
        if (!this.contentVal && this.type !== 'createHomework') {
          this.$store.dispatch('boxyTip', { message: '请输入内容' })
          return
        }

        if (this.type === 'createHomework') {
          if (!this.titleVal) {
            this.$store.dispatch('boxyTip', { message: '请输入作业标题' })
            return
          } else if (!this.contentVal) {
            this.$store.dispatch('boxyTip', { message: '请输入作业内容' })
            return
          }
          // } else if (!this.dateSelected) {
          //   this.$store.dispatch('boxyTip', { message: '请选择截止日期' })
          //   return
          // } else if (!this.timeSelected) {
          //   this.$store.dispatch('boxyTip', { message: '请选择截止时间' })
          //   return
          // }
        }

        this.$store.dispatch('eventEmitter', {
          event: 'confirmReply',
          data: {
            type: this.type,
            title: this.titleVal,
            message: this.contentVal,
            index: this.index,
            // endTime: this.dateSelected + ' ' + this.timeSelected + ':00',
            imagesUrl: this.imageContent,
            callback: () => {
              // 发布之后清除草稿
              Cookie.delCookie(this.draftKey, TOP_LEVEL_HOST)
            }
          }
        })
      },

      // // el-date-picker、el-time-select组件change事件
      // getDate (val) { this.dateSelected = val },
      // getTime (val) { this.timeSelected = val },

      // 上传图片
      async uploadImage (file) {
        let data = new window.FormData()
        data.append('avatar', file.file)
        try {
          let res = await UploadImage(data)
          if (res && file.file) {
            this.imageContent.push(res.avatar)
            this.uploadSuccess = true
            file.file.netUrl = res.avatar
          }
        } catch (err) {
          console.log(err)
        }
      },

      // 上传图片之前
      handleBeforeUpload () {
        this.uploadSuccess = false
      },

      // 删除图片
      handleRemove (file, fileList) {
        if (file && file.raw && file.raw.netUrl) {
          this.imageContent.splice(this.imageContent.indexOf(file.raw.netUrl), 1)
        }
      },

      // 限制图片最多上传数量
      imgCount () {
        if (this.imageContent.length > 8) {
          this.$store.dispatch('boxyTip', { message: '最多允许上传9张图片' })
          return
        }
      },

      // 获取上次编辑的草稿
      // 草稿功能主要防止编辑半天后文字丢了
      getDraft () {
        this.contentVal = base64.decode(Cookie.getCookie(this.draftKey))
        this.hasDraft = 0
      }
    }
  }
</script>
