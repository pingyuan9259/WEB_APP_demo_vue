<!-- 上传图片组件
     作者：平原
     创建：2017-8-18 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="upload_image">
    <div v-if="Object.getOwnPropertyNames(images).length <= limit" class="add">
      <a @click="$refs.selectImage.click()" class="add_btn">
        <!-- 隐藏的文件上传入口 -->
        <input
          @change="uploadImage()"
          ref="selectImage"
          accept="image/*"
          :multiple="multiple"
          type="file" alt=""
          class="hidden"/>
        <span class="icon-plus"></span>
      </a>
    </div>
    <ul class="thumb">
      <li
        v-for="(item, index) in images"
        :key="index"
        :class="{ 'upload_success': item[index] }"
        class="thumb_item">
        <img v-if="item[index]" v-lazy="item[index]" alt="">
        <span v-if="!item[index]" class="icon-spinner rotate"></span>
      </li>
    </ul>
  </div>
</template>

<script>
  import UploadImage from '../../../api/common/UploadImage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        images: {}
      }
    },

    props: {
      multiple: { required: true, type: Boolean },
      limit: { required: true, type: Number }
    },

    computed: mapState({
    }),

    watch: {

    },

    methods: {
      async uploadImage () {
        try {
          let formData = new window.FormData()
          let files = this.$refs.selectImage.files
          for (let i in files) {
            let _i = files[i]
            this.images[_i.name] = {}
            formData.append(_i.name, _i)
            let res = await UploadImage(formData)
            if (res) {
              this.images[_i.name] = res[_i.name]
              debugger
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
