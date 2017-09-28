<!-- 主页相关无需登录的页面入口组件
     作者：平原
     创建：2017-6-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="index_app" @click="$store.dispatch('globalClick', $event)">
    <header-pannel header-type="home"></header-pannel>
    <div class="body_pannel">
      <router-view></router-view>
    </div>
    <footer-pannel></footer-pannel>
    <div
      v-if="showLogin"
      @click="closeLogin($event.target)"
      class="login_container">
      <login></login>
    </div>
  </div>
</template>

<script>
  import { APP_TOKEN_KEY } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import HeaderPannel from '../../layouts/HeaderPannel/'
  import FooterPannel from '../../layouts/FooterPannel/'
  import Login from '../../modules/Login/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        showLogin: false
      }
    },

    components: {
      HeaderPannel,
      FooterPannel,
      Login
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      eventEmitter: state => state.global.eventEmitter
    }),

    watch: {
      // 在首页登录后直接隐藏登录弹框
      isLogin (val) {
        if (val && Cookie.getCookie(APP_TOKEN_KEY)) {
          this.showLogin = false
        }
      },

      eventEmitter (val) {
        if (val.event === 'showLogin') {
          this.showLogin = true
        }

        if (val.event === 'hiddeLogin') {
          this.showLogin = false
        }
      }
    },

    methods: {
      closeLogin (target) {
        if (!target.closest('.login')) {
          this.showLogin = false
        }
      }
    }
  }
</script>
