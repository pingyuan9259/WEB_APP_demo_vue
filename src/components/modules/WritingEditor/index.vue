<!-- 写作写文章编辑框
     作者：平原
     创建：2017-8-9-->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="writing_editor">

    <div v-show="editorData.type === 'html'" class="html_editor">
      <div
        id="html_editor"
        ref="htmlEditor"
        :class="{ 'without_toolbar': floatToolbar }"
        class="simditor-body ql-container ql-snow"></div>
      <span
        :class="{ 'full_count': (20000 - htmlContentLength) < 1 }"
        class="text_count">
        {{ htmlContentLength + '/' + 20000 }}
      </span>

      <!-- 隐藏的文件上传入口 -->
      <input
        @change="uploadFile()"
        ref="selectFile"
        :accept="selectAccept"
        type="file" alt=""
        class="hidden"/>
    </div>

    <!-- markdown编辑框 -->
    <div v-show="editorData.type === 'mkdn'" class="markdown_editor">
      <textarea
        v-model="markdownContent"
        @keydown="onKeyDown($event)"
        @input="markdownEditorChange()"
        @propertychange="markdownEditorChange()"
        ref="markdownEditor"
        style="height: 200px"
        maxlength="20000"
        placeholder="请输入正文"></textarea>
      <span
        :class="{ 'full_count': (20000 - markdownContent.length) < 1 }"
        class="text_count">
        {{ markdownContent.length + '/' + 20000 }}
      </span>
    </div>
  </div>
</template>

<script>
  // markdown相关
  import MarkdownIt from 'markdown-it'
  import MdExpand from '../../../libs/mdExtend'
  import MdVideo from '../../../libs/mdVideo'
  import Highlight from 'highlight.js'
  import ToMarkdown from 'to-markdown'

  // html(富文本)相关
  // 为了多个仓库的统一性
  // 富文本样式采用我们平台的smiditor-body.scss替换quill的quill.snow.css
  import '../../../styles/writing/smiditor-body.scss'

  import Handlers from './handlers'
  import { adjustTextareaHeight } from '../../../utils/enhance'
  import UploadImage from '../../../api/common/UploadImage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        showPreview: 0,
        timer: null,

        // html
        quill: null,
        htmlContentVal: '',
        htmlContentLength: 0,
        $htmlEditor: null,
        $toolbar: null,
        floatToolbar: 0,
        htmlEditorRange: 0,
        $selectFile: null,
        selectAccept: '',
        $audioNode: null,

        // markdown
        markdownContent: '',
        markdownContentHtml: '<p><br></p>',
        $markdownEditor: null
      }
    },

    props: {
      hasUpload: { required: true, type: Boolean },
      editorHtml: { required: true, type: String },
      editorVal: { required: true, type: String },
      editorData: { required: true, type: Object }
    },

    computed: mapState({
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      // 如果是编辑草稿则恢复草稿内容
      editorData (val) {
        if (val.html) {
          if (val.type === 'html') {
            this.$htmlEditor.innerHTML = val.html
            // 防止图片被遮住（这破编辑器quill的图片被视为内联元素）
            this.timer = setTimeout(() => {
              adjustTextareaHeight(this.$htmlEditor, 200, 0)
              clearTimeout(this.timer)
            }, 500)
          }
          if (val.type === 'mkdn') {
            this.markdownContent = ToMarkdown(val.html)
            // html刚加载时候自动触发了更新markdown没有
            this.markdownEditorChange()
          }
        }
      },

      eventEmitter (val) {
        // 清理html和markdown编辑框内容，由切换编辑器触发
        if (val.event === 'clearWritingEditor') {
          this.quill.setText('')
          this.markdownContent = ''
        }
      }
    },

    mounted () {
      if (this.editorData.type === 'html') {
        this.quill = Handlers.initQuill(
          this.quillHandlers,
          this.htmlEditorChange
        )
        // 定义文件上传入口，上传图片、音频都将利用该元素
        this.$selectFile = this.$refs.selectFile
        // 定义编辑框父元素，用于内容提取、调整编辑框高度
        this.$htmlEditor = this.$refs.htmlEditor.children[0]
        // 页面滚动触发是否浮动toolbar
        Handlers.scrollEvent(true, this.makeToolbarFloat)
      }

      if (this.editorData.type === 'mkdn') {
        // markdown编辑框textarea DOM元素
        this.$markdownEditor = this.$refs.markdownEditor
      }
    },

    destroyed () {
      // 页面销毁时候注销此组件的滚动事件
      Handlers.scrollEvent(false, this.makeToolbarFloat)
    },

    methods: {
      // 防止页面过长找不到html的toolbar
      // 页面滚动一定程度以后将toolbar设为浮动
      makeToolbarFloat () {
        this.$toolbar = document.querySelector('#html_editor, .ql-toolbar')
        if (window.pageYOffset > 210 && this.floatToolbar === 0) {
          this.$toolbar.className += ' fixed_toolbar'
          this.floatToolbar = 1
        }
        if (window.pageYOffset <= 210 && this.floatToolbar === 1) {
          this.$toolbar.className = this.$toolbar.className.replace(' fixed_toolbar', '')
          this.floatToolbar = 0
        }
      },

      async htmlEditorChange () {
        // 获取编辑器的光标位置、内容字数
        this.htmlEditorRange = this.quill.getSelection()
        this.htmlContentLength = this.quill.getLength() - 1

        // 超出规定字数以后禁止输入
        if (this.htmlContentLength > 20000) {
          let index = this.htmlEditorRange.index - 1
          let length = this.htmlContentLength - 20000
          await this.quill.deleteText(index, length)
          this.quill.setSelection(index, 0)
        }

        // 自动调整编辑框高度
        adjustTextareaHeight(this.$htmlEditor, 200, 0)

        // 将编辑框内容回传给父组件（update:后面不能有空格）
        this.$emit('update:editorHtml', this.$htmlEditor.innerHTML)
        this.$emit('update:editorVal', this.quill.getText(0, 54))
      },

      quillHandlers (type) {
        clearTimeout(this.timer)
        if (type === 'image') {
          this.selectAccept = 'image/*'
        }
        // if (type === 'audio') {
        //   this.selectAccept = 'audio/*'
        // }

        // 延迟为了使this.selectAccept的赋值生效
        this.timer = setTimeout(() => {
          this.$selectFile.click()
          this.quill.setSelection(this.htmlEditorRange.index, 0)
        }, 50)
      },

      // 添加图片（音频也借这个接口发上去），由<input>的@change触发
      async uploadFile () {
        try {
          this.$emit('update:hasUpload', true)
          let file = this.$selectFile.files
          if (!file.length) return
          let data = new window.FormData()
          let fileName = ''
          if (this.selectAccept === 'image/*') fileName = 'avatar'
          if (this.selectAccept === 'audio/*') fileName = 'voice'
          data.append(fileName, file[0])

          let res = await UploadImage(data)
          if (res) {
            let url = res[fileName].replace('https:', '')
            if (fileName === 'avatar') {
              // quill插入元素
              this.quill.insertEmbed(this.htmlEditorRange.index, 'image', url)
              // 插入图片以后重新调整编辑框高度，光标移到图片后面
              this.timer = setTimeout(() => {
                this.quill.setSelection(this.htmlEditorRange.index + 1, 0)
                adjustTextareaHeight(this.$htmlEditor, 200, 0)
                clearTimeout(this.timer)
              }, 500)
            }
            // if (fileName === 'voice') {
            //   // 编辑器头部插入音频
            //   // 没有找到在quill中快速插入节点的方法，暂时先用这个方式，缺陷就是音频只能在顶部
            //   let $htmlContainer = document.querySelector('#html_editor')
            //   this.$audioNode = document.createElement('div')
            //   this.$audioNode.innerHTML = '<p id="html_audio"><audio controls="controls" src="' + url + '"></audio><br></p>'
            //   $htmlContainer.insertBefore(this.$audioNode, this.$htmlEditor)
            //   let html = this.$audioNode.innerHTML + this.$htmlEditor.innerHTML
            //   this.$emit('update:editorHtml', html)
            // }
            this.$emit('update:hasUpload', false)
          }
          // 防止如果再次上传相同文件不会触法onchange
          this.$selectFile.value = null
        } catch (err) {
          console.log(err)
        }
      },

      // 使tab键不会跳到下一个输入框
      onKeyDown (e) {
        if (e.keyCode === 9) {
          e.preventDefault()
          let indent = '    '
          let start = this.$markdownEditor.selectionStart
          let end = this.$markdownEditor.selectionEnd
          let selected = window.getSelection().toString()
          selected = indent + selected.replace(/\n/g, '\n' + indent)
          this.markdownContent = this.markdownContent.substring(0, start) + selected + this.markdownContent.substring(end)
          let selectedPositionIndex = start + indent.length
          this.timer = setTimeout(() => {
            this.$markdownEditor.setSelectionRange(selectedPositionIndex, selectedPositionIndex)
            clearTimeout(this.timer)
          }, 10)
        }
      },

      // markdown监听键入
      markdownEditorChange () {
        // 将markdown文本解析为html
        this.markdownContentHtml = MarkdownIt().set({
          html: true,
          breaks: true,
          highlight: (str, lang) => {
            if (lang && Highlight.getLanguage(lang)) {
              try {
                return '<pre class="hljs"><code>' +
                  Highlight.highlight(lang, str, true).value +
                  '</code></pre>'
              } catch (__) {}
            }
            return ''
          }
        }).use(MdExpand).use(MdVideo).render(this.markdownContent)
        // 将markdown编辑框的内容返回给父组件
        this.$emit('update:editorHtml', this.markdownContentHtml)
        this.$emit('update:editorVal', this.markdownContent.substring(0, 54))
        // 自动调整编辑框高度
        adjustTextareaHeight(this.$refs.markdownEditor, 200, 24)
      }
    }
  }
</script>
