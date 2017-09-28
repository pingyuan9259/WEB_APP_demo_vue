<!-- 上传课件组件
     作者：平原
     创建：2017-7-3
     优化：2017-7-24 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="upload_ppt">
    <h3>课件</h3>
    <a
      @click="showEditor = true"
      
      id="picker"
      class="add_ppt btn_hollow_small">添加课件</a>

    <ul class="ppt_list" v-if="liveId">
      <li
        v-for="(item, index) in pptList"
        :key="index"
        class="ppt_item">
        <img
          v-lazy="item.links.length && item.links[0].link + '?imageView2/1/w/100/h/100/interlace/1'"
          class="ppt_cover">
        <span class="ppt_title">{{item.resource_name}}</span>
        <span class="ppt_time">{{item._updatedAt}}</span>
        <a
          v-if="!item._useing"
          @click="$store.dispatch('usePPT', {
            liveId: liveId,
            userId: userDetails.id,
            resourceId: item.id,
            index: index
          })"
          class="ppt_select">使用</a>
        <span
          v-if="item._useing"
          class="ppt_select disabled">使用中</span>
        <a
          @click="deletePPT(item.id, index)"
          class="ppt_delete">删除</a>
      </li>
    </ul>

    <div class="tip" v-if="!pptList.length">
      <p>
        <span class="icon-double-quotation tip_head"></span>
        快来添加课件吧
      </p>
    </div>

    <div class="editor_mash" v-show="showEditor">
      <div class="editor">
        <div class="option">
          <h3>添加课件</h3>
          <a
            @click="addPPT()"
            
            class="submit btn_solid_small">添 加</a>
          <a
            @click="close()"
            
            class="cancel btn_hollow_small">返 回</a>
        </div>
        <div class="title">
          <span>课件名称：</span>
          <input
            v-model="pptTitle"
            type="text"
            maxlength="100"
            placeholder="填写名称">
        </div>
        <a  class="add_btn btn_solid_small">
          <input 
            @change="files = $refs.addPPT.files"
            ref="addPPT"
            accept="image/png,image/jpg"
            type="file" multiple="true" alt=""
            class="add_ppt"/>
          选择图片
        </a>
        <span class="add_tip">
          {{ files.length ? '已选择' + files.length + '张图片' : '可以同时选择多张图片' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { USER_INFO_KEY } from '../../../config'
  import Storage from '../../../utils/storage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        userDetails: Storage.get(USER_INFO_KEY),
        liveId: '',
        curPPTId: '',
        showEditor: false,
        pptTitle: '',
        files: []
      }
    },

    computed: mapState({
      courseInfo: state => state.course.courseInfo,
      pptList: state => state.ppt.pptList
    }),

    watch: {
      courseInfo (val) {
        this.liveId = val.liveshowId
        if (this.liveId) {
          this.$store.dispatch('getPPTList', this.liveId)
        }
      }
    },

    methods: {
      close () {
        this.showEditor = false
        this.pptTitle = ''
        this.files = []
        this.$refs.addPPT.value = ''
      },

      async addPPT () {
        if (!this.pptTitle) {
          this.$store.dispatch('boxyTip', { message: '请输入课件名称' })
          return
        } else if (!this.files.length) {
          this.$store.dispatch('boxyTip', { message: '请选择上传的图片' })
          return
        }

        let formData = new window.FormData()
        for (let i in this.files) {
          let _i = this.files[i]
          formData.append(_i.name, _i)
        }
        formData.append('live_id', this.liveId)
        formData.append('user_id', this.userDetails.id)
        formData.append('resource_name', this.pptTitle)

        this.$store.dispatch('boxyProgress', { message: '正在上传...' })
        await this.$store.dispatch('uploadPPT', formData)
        this.close()
        this.$store.dispatch('boxyProgressClose')
      },

      deletePPT (resourceId, index) {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定要删除该组PPT？',
          confirm () {
            self.$store.dispatch('deletePPT', {
              liveId: self.liveId,
              userId: self.userDetails.id,
              resourceId: resourceId,
              index: index
            })
          }
        })
      }
    }
  }
</script>
