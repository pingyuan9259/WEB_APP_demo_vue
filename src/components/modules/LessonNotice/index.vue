<!-- 课程公告组件
     作者：平原
     创建：2017-9-1 -->

<style lang="scss">
  @import './index';  
</style>

<template>
  <div class="module_notice">
    <div class="logo">
      <span class="icon el-icon-warning"></span>
      <span class="label">公告</span>
    </div>

    <div v-if="!showEditor" class="content">
      <p
        v-html="content"
        :style="{ 'marginRight': canEdit ? '75px' : '0' }"
        class="text"></p>
      <a
        @click="showEditor = 1"
        class="edit">
        <span class="icon-quill"></span> 
        编辑
      </a>
    </div>

    <div v-if="showEditor" class="editor">
      <div class="textarea">
        <textarea
          v-model="editorContent"
          @input="editorChange()"
          @propertychange="editorChange()"
          ref="textarea"
          style="height: 100px"
          type="text" placeholder="请输入公告内容" maxlength="500"></textarea>
        <span
          :class="{ 'full_count': (500 - editorContent.length) < 1 }"
          class="text_count">
          {{ editorContent.length + '/' + 500 }}
        </span>
      </div>
      <a class="confirm btn_solid_small pull_right ml10">发 布</a>
      <a @click="showEditor = 0" class="back btn_hollow_small pull_right">返 回</a>
    </div>
    
  </div>
</template>

<script>
  import { adjustTextareaHeight } from '../../../utils/enhance'

  export default {
    data () {
      return {
        showEditor: 0,
        markdownContent: '',
        editorContent: '',
        $textarea: null
      }
    },

    props: {
      content: { required: true, type: String },
      canEdit: { required: true, type: Boolean }
    },

    mounted () {
      this.$textarea = this.$refs.textarea
    },

    methods: {
      editorChange () {
        adjustTextareaHeight(this.$textarea, 100, -2)
      }
    }
  }
</script>
