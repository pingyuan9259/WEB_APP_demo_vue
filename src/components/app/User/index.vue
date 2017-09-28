<!-- 我的课程入口组件
     作者：平原
     创建：2017-6-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="user_app" @click="$store.dispatch('globalClick', $event)">
    <nav-pannel
      :nav-data="navData"
      :logout-redirect-path="logoutRedirectPath"></nav-pannel>
    <header-pannel header-type="user"></header-pannel>
    <div class="body_pannel">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import NavPannel from '../../layouts/NavPannel/'
  import HeaderPannel from '../../layouts/HeaderPannel/'

  export default {
    data () {
      return {
        navData: [
          {
            name: '我的课程',
            iconClass: 'icon-course',
            path: '/user/lessons'
          },
          {
            authority: true,
            condition: 0,
            name: '我的授课',
            iconClass: 'icon-library',
            path: '/teacher/lessons'
          },
          {
            name: '个人信息',
            iconClass: 'icon-personal',
            path: '/user/my-profile'
          },
          {
            name: '余额',
            iconClass: 'icon-coin',
            path: '/user/my-account'
          }
        ],
        logoutRedirectPath: '/user'
      }
    },

    components: {
      NavPannel,
      HeaderPannel
    },

    watch: {
      $route () {
        this.init()
      }
    },

    created () {
      this.init()
    },

    methods: {
      async init () {
        this.navData[1].condition = await this.$store.dispatch('isTeacher')
      }
    }
  }
</script>
