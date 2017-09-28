<!-- 写作写文章预览
     作者：平原
     创建：2017-8-10-->

<style lang="scss">
  @import "./index";
</style>

<template>
  <transition name="fade-quick">
  <div v-if="showPreview" class="writing_preview">
    <div class="preview_container">
      <h1 class="preview_title">{{ editorData.title }}</h1>
      <span
        @click="previewClose()"
        class="preview_close icon-cross"></span>    
      <div
        v-if="editorData.type === 'html'"
        v-html="editorData.html"
        class="simditor-body preview_content html"></div>
      <div
        v-if="editorData.type === 'mkdn'"
        v-html="markdownContentHtml"
        class="nongshuoshu-body preview_content markdown"></div>
    </div>
  </div>
  </transition>
</template>

<script>
  import MarkdownIt from 'markdown-it'
  import MdExpand from '../../../libs/mdExtend'
  import MdVideo from '../../../libs/mdVideo'
  import Highlight from 'highlight.js'
  import { stopScrollBubble } from '../../../utils/enhance'
  import '../../../styles/writing/nongshuoshu-body.scss'
  import '../../../styles/writing/smiditor-body.scss'

  export default {
    data () {
      return {
        markdownContentHtml: null,
        timer: null
      }
    },

    props: {
      showPreview: { required: true, type: Number },
      editorData: { required: true, type: Object }
    },

    watch: {
      showPreview (val) {
        if (val) {
          if (this.editorData.type === 'mkdn') {
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
            }).use(MdExpand).use(MdVideo).render(this.editorData.html)
          }

          // 阻止滚动冒泡
          // 此处定时器是为了使el不是undefined
          this.timer = setTimeout(() => {
            stopScrollBubble(document.querySelector('.preview_content'))
          }, 50)
        }
      }
    },

    distroyed () {
      clearTimeout(this.timer)
    },

    methods: {
      previewClose () {
        this.$emit('update:showPreview', 0)
      }
    }
  }
</script>
