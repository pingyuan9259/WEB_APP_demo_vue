<!-- 写作写文章页面
     作者：平原
     创建：2017-8-9 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="edit_page">
    <div class="edit_container">
      <h3 class="pull_left">文章编辑器</h3>
      <a
        v-if="postId"
        @click="newArticle()"
        class="new_article pull_left btn_hollow_small">
        新建文章
      </a>
      <div class="editor_switch pull_right">
        <a
          @click="switchEditor()"
          class="btn_solid_small">
          {{ editorData.type === 'html' ? 'Markdown模式' : '富文本模式' }}
        </a>
      </div>

      <div class="article_title">
        <input v-model="editorData.title" type="text" maxlength="50" placeholder="请输入标题">
        <span class="text_count">
          {{ editorData.title.length + '/50' }}
        </span>
      </div>

      <writing-editor
        :has-upload.sync="hasUpload"
        :editor-html.sync="editorHtml"
        :editor-val.sync="editorVal"
        :editor-data="editorData"></writing-editor>

      <!-- 图片上传 -->
      <div class="upload_container">
        <span class="section_title">上传封面</span>
        <span class="section_desc">图片建议尺寸（像素）：900x500</span>
        <el-upload
          action=""
          list-type="picture-card"
          :http-request="uploadImage"
          :file-list="editorData.cover"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>

    <!-- <upload-image :multiple="false" :limit="1"></upload-image> -->

    <!-- 摘要 -->
    <div class="abstract">
      <span class="section_title">输入摘要</span>
      <span class="section_desc">选填，如果为空则摘要为正文前54字</span>
      <textarea v-model="editorData.content" rows="3" maxlength="120" placeholder="请输入摘要"></textarea>
      <span class="text_count">
        {{ editorData.content.length + '/120' }}
      </span>
    </div>

    <div class="bottom_option">
      <!-- 选择频道 -->
      <div class="select_channel pull_left">
        <span class="section_title">发表在</span>
        <a
          @click="clickChannelList()"
          class="select_channel_btn btn_hollow">
          <img v-if="editorData.bbsId" :src="editorData.bbsAvatar" alt="">
          {{ editorData.bbsName }}
          <span class="icon-arrow-left2"></span>
        </a>
        <ul v-show="showChannelList" class="channel_list" id="channel_list">
          <li
            v-for="(item, index) in channelList"
            :key="index"
            @click="selectChannel(item.bbsAvatar, item.bbsName, item.bbsId)"
            class="channel_item">
            <img v-lazy="item.bbsAvatar" alt="">
            <span class="no_warp">{{ item.bbsName }}</span>
          </li>
        </ul>
      </div>

      <div
        class="option pull_right">
        <a
          @click="clickSaveBtn()"
          :class="{ 'btn_hollow_disabled': hasUpload }"
          class="save btn_hollow">保 存</a>
        <a
          @click="clickPreviewBtn()"
          :class="{ 'btn_hollow_disabled': hasUpload }"
          class="preview btn_hollow">预 览</a>
        <a
          @click="clickPublishBtn()"
          :class="{ 'btn_solid_disabled': hasUpload }"
          class="publish btn_solid">发 布</a>
      </div>
    </div>

    <writing-preview
      :show-preview.sync="showPreview"
      :editor-data="editorData"></writing-preview>
  </div>
</template>

<script>
  import Handlers from './handlers'
  // import UploadImage from '../../modules/UploadImage'
  import WritingEditor from '../../modules/WritingEditor'
  import WritingPreview from '../../modules/WritingPreview'
  import { getUrlQuery, stopScrollBubble } from '../../../utils/enhance'
  import UploadImage from '../../../api/common/UploadImage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        postId: '',
        editorHtml: '<p><br></p>', // 送给子组件并通过.sync把编辑框内容带回来
        editorVal: '', // 送给子组件并通过.sync把编辑框内容带回来，用于摘要
        hasUpload: false,
        $addCoverBtn: null,
        timer1: null,
        timer2: null,
        initEditorData: {},
        editorData: {
          type: 'html',
          title: '',
          html: '<p><br></p>',
          content: '',
          bbsId: '',
          bbsAvatar: '',
          bbsName: '请选择频道',
          cover: []
        },
        showChannelList: 0,
        showPreview: 0,
        isPublish: 0
      }
    },

    components: {
      // UploadImage,
      WritingEditor,
      WritingPreview
    },

    computed: mapState({
      channelList: state => state.writing.channelList,
      articleDetails: state => state.writing.articleDetails
    }),

    async mounted () {
      // 图片上传按钮
      this.$addCoverBtn = document.getElementsByClassName('el-upload--picture-card')[0]
      // 获取频道列表
      await this.$store.dispatch('getChannelList')
      // 将草稿信息回复到编辑页面中
      // 如果能够从url上获取到postId代表是重新编辑草稿
      this.postId = getUrlQuery('postId')
      if (this.postId) {
        // 通过文章详情来获取草稿的详情信息
        await this.$store.dispatch('getArticleDetails', this.postId)
        // init数据作为整个编辑器是否被修改的参照
        this.initEditorData = Object.assign(
          {},
          Handlers.initEditorData(this.articleDetails, this.channelList)
        )
        // 将草稿信息注入
        this.editorData = Object.assign({}, this.initEditorData)
        // 如果存在图片则隐藏添加按钮
        if (this.editorData.cover.length) {
          this.$addCoverBtn.className += ' hidden'
        }
      } else {
        // 初始化init数据
        this.initEditorData = Object.assign({}, this.editorData)
      }

      // 未保存离开页面时可屏蔽路由跳转
      let self = this
      this.$router.beforeEach((to, from, next) => {
        if (from.path !== '/writing/edit' || self.isPublish) {
          return next()
        }
        self.boxyModified(next)
      })

      // 自动保存，需要有文章标题
      this.timer2 = setInterval(() => {
        let isModified = this.checkContent('modified')
        if (isModified && this.editorData.title) {
          this.submitArticle({ type: 'save', autoSave: true })
        }
      }, 60000)
    },

    destroyed () {
      clearInterval(this.timer2)
      // $router.beforeEach会追加一个新的router的beforehook，离开时需要清理
      this.$router.beforeHooks.splice(-1, 1)
    },

    methods: {
      // 新建文章，清空所有
      newArticle () {
        let buildNewArticle = () => {
          this.$store.dispatch('eventEmitter', { event: 'clearWritingEditor' })
          this.editorHtml = '<p><br></p>'
          this.editorData = {
            type: 'html',
            title: '',
            html: '<p><br></p>',
            content: '',
            bbsId: '',
            bbsAvatar: '',
            bbsName: '请选择频道',
            cover: []
          }
          this.initEditorData = Object.assign({}, this.editorData)
          this.postId = ''
          this.$router.replace('/writing/edit')
        }
        this.boxyModified(buildNewArticle)
      },

      // 切换编辑器清空内容
      switchEditor () {
        let type = 'html'
        if (this.editorData.type === type) type = 'mkdn'
        let doSwitch = () => {
          this.$store.dispatch('eventEmitter', { event: 'clearWritingEditor' })
          this.editorData.type = type
        }
        if (this.editorHtml !== '<p><br></p>') {
          this.$store.dispatch('boxyWarning', {
            message: '切换编辑器将清空正文内容',
            confirm: doSwitch
          })
        } else {
          this.editorData.type = type
        }
      },

      // 页面被修改之后操作的提示
      boxyModified (callback) {
        let isModified = this.checkContent('modified')
        if (isModified) {
          this.$store.dispatch('boxyWarning', {
            message: '是否放弃对文章的编辑',
            confirm: callback
          })
        } else {
          callback && callback()
        }
      },

      // 上传封面
      async uploadImage (file) {
        try {
          this.hasUpload = true
          let data = new window.FormData()
          data.append('cover', file.file)
          let res = await UploadImage(data)
          if (res && file.file) {
            this.editorData.cover.push({ url: res.cover })
            this.$addCoverBtn.className += ' hidden'
            this.hasUpload = false
          }
        } catch (err) {
          console.log(err)
        }
      },

      // 删除封面
      handleRemove (file) {
        if (file && file.url) {
          this.cover = []
          this.editorData.cover = []
          this.$addCoverBtn.className = this.$addCoverBtn.className.replace(' hidden', '')
        }
      },

      // 展开、收起频道列表
      clickChannelList () {
        this.showChannelList = !this.showChannelList
        // 阻止滚动冒泡
        // 此处定时器是为了使el不是undefined
        if (!this.showChannelList) return
        this.timer1 = setTimeout(() => {
          stopScrollBubble(document.querySelector('.channel_list'))
          clearTimeout(this.timer1)
        }, 50)
      },

      // 选择频道
      selectChannel (bbsAvatar, bbsName, bbsId) {
        this.editorData.bbsId = bbsId
        this.editorData.bbsName = bbsName
        this.editorData.bbsAvatar = bbsAvatar
        this.showChannelList = 0
      },

      // 内容检查
      checkContent (type) {
        // 同步编辑器正文内容
        this.editorData.html = this.editorHtml
        // 表单校验
        let checkStatus = Handlers.checkEditorData(
          type,
          this.hasUpload,
          this.editorData,
          this.initEditorData
        )
        return checkStatus
      },

      // 预览文章
      clickPreviewBtn () {
        let checkStatus = this.checkContent('preview')
        if (!checkStatus) return
        this.showPreview = 1
      },

      // 点击“保存”按钮
      clickSaveBtn () {
        let isModified = this.checkContent('modified')
        if (!isModified) {
          this.$store.dispatch('boxyTip', { message: '文章未被修改' })
        } else {
          this.submitArticle({ type: 'save', path: '/writing/draft' })
        }
        this.isPublish = 1
      },

      // 点击“发布”按钮
      clickPublishBtn () {
        this.submitArticle({ type: 'publish', path: '/writing/article' })
        this.isPublish = 1
      },

      // 保存、发布文章
      async submitArticle ({ type, path, autoSave }) {
        let checkStatus = this.checkContent(type)
        if (!checkStatus) return
        // 插入标注编辑器类型的隐藏标签
        this.editorData.html += '<pry type="new' + this.editorData.type + '"></pry>'
        // 添加封面链接
        let imagesUrl = []
        try {
          imagesUrl.push(this.editorData.cover[0].url)
        } catch (err) {}

        let action = ''
        if (type === 'save') {
          action = 'draftArticle'
        } else if (type === 'publish') {
          action = 'publishArticle'
          // 如果没有摘要，则取正文前54字
          if (!this.editorData.content) {
            this.editorData.content = this.editorVal
          }
        }

        // 调发布、保存接口，并依据返回更新postId
        let result = await this.$store.dispatch(action, {
          // postId传空是新文章或新建草稿
          postId: this.postId || '',
          // 没有选择频道则发默认316
          bbsId: this.editorData.bbsId || 316,
          title: this.editorData.title,
          html: this.editorData.html,
          imagesUrl: imagesUrl,
          content: this.editorData.content,
          autoSave: autoSave
        })
        if (result) {
          this.postId = result.id
        }

        // 给服务器一个缓冲时间，不然跳转之后没有刚刚编辑的条目
        if (!path) return
        this.timer1 = setTimeout(() => {
          this.$router.push(path)
          clearTimeout(this.timer1)
        }, 500)
      }
    }
  }
</script>
