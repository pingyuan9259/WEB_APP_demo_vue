<!-- 写作平台入口组件
     作者：平原
     创建：2017-8-7 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="writing_app" @click="$store.dispatch('globalClick', $event)">
    <nav-pannel
      :nav-data="navData"
      :logout-redirect-path="logoutRedirectPath"></nav-pannel>
    <header-pannel header-type="writing"></header-pannel>
    <div class="body_pannel">
      <router-view v-if="verifyStatus === 1"></router-view>

      <div class="tip" v-if="verifyStatus !== 1">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          通过新生大学APP进行「绑定手机号」后再发布文章
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import NavPannel from '../../layouts/NavPannel/'
  import HeaderPannel from '../../layouts/HeaderPannel/'

  export default {
    data () {
      return {
        verifyStatus: {},
        navData: [
          {
            name: '我的文章',
            iconClass: 'icon-stack',
            path: '/writing/article'
          },
          {
            name: '写文章',
            iconClass: 'icon-pencil',
            path: '/writing/edit'
          },
          {
            name: '草稿箱',
            iconClass: 'icon-file-text2',
            path: '/writing/draft'
          },
          {
            name: '历史文章',
            iconClass: 'icon-history',
            path: '/writing/history'
          }
        ],
        logoutRedirectPath: '/writing'
      }
    },

    components: {
      NavPannel,
      HeaderPannel
    },

    async created () {
      let userDetail = await this.$store.dispatch('getUserDetails')
      this.verifyStatus = userDetail.verify_status
    }
  }
</script>
