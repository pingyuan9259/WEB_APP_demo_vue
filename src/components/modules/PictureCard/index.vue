<!-- 上传图片后的图片展示组件
     作者：张军祥
     创建：2017-6-24 -->

<style lang="scss">
  @import "./index";
</style>
<template>
  <div class="picture-page">
    <div class="pic_box">
      <div class="el-upload--picture-card image-item" v-for="item in images">
        <img :src="item.mediaContent + '?imageView2/5/w/60/h/60'" alt="">
        <span class="image-preview" @click="handleImagePreview(item.mediaContent)"><i class="el-icon-view"></i></span>
      </div>
    </div>

    <div class="image_preview_dialog">
      <el-dialog v-model="showPreview" size="small" style="textAlign: center;">
        <img style="maxWidth: 100%;" :src="previewImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'picture-page',
    data () {
      return {
        showPreview: false,
        previewImageUrl: ''
      }
    },
    props: {
      images: {
        type: Array,
        required: true
      }
    },
    methods: {
      handleImagePreview (url) {
        this.previewImageUrl = url
        this.showPreview = true
      }
    }
  }
</script>
