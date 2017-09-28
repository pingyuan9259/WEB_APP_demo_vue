<!-- 页面入口
     作者：平原
     入口功能：登录态、store初始化
     创建：2017-6-6 -->

<template>
  <div class="container" @click="$store.dispatch('globalClick', $event)">
    <router-view></router-view>
    <boxy></boxy>
  </div>
</template>

<script>
  import { APP_ENV, APP_TOKEN_KEY, TOP_LEVEL_HOST } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import Boxy from '../../modules/Boxy/'
  import Loading from '../../modules/Loading/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        requestFailRes: {}
      }
    },

    components: {
      Boxy,
      Loading
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      redirect: state => state.global.redirect,
      requestFail: state => state.global.requestFail
    }),

    watch: {
      isLogin (val) {
        this.goToPost()

        // 登录成功方法
        // 如果isLogin为true表示拥有了登录态
        // 并且需要token，无token时islogin也会变为true
        // 并且路由需要登陆跳转的重定向信息
        let redirectPath = this.$route.query.redirect
        if (val && Cookie.getCookie(APP_TOKEN_KEY) && redirectPath) {
          this.$router.replace({ path: redirectPath })
        }
      },

      redirect (val) {
        this.$router.replace(val)
      },

      requestFail (val) {
        this.$store.dispatch('requestFail', this.requestFail)
      },

      '$route': 'routeChanged'
    },

    created () {
      if (Cookie.getCookie(APP_TOKEN_KEY)) {
        this.$store.dispatch('loginSuccess')
      }
      this.$store.dispatch('getPcFlag')
      this.goToPost(this.isLogin)
    },

    methods: {
      routeChanged (to, from) {
        // 所跳转页面是否需要初始化Store
        // 判断依据：当前页面与下个页面均不需要初始化，以区分是同级路由
        // 此判断主要用于解决userBanner切换tab时出现闪动的问题
        if (to.meta.initStateDisabled && from.meta.initStateDisabled) return
        this.$store.dispatch('initState')
      },

      goToPost () {
        let hash = window.location.hash
        let env = APP_ENV === 'dev' ? '-dev' : ''

        if (hash.indexOf('post_login') !== -1) {
          this.showLogin()
          window.location.href = `//post${env}.${TOP_LEVEL_HOST}`
          return
        }
      },

      click () {
        console.log(this.requestFail)
      }
    }
  }
</script>
