<!-- header组件
     作者：平原
     创建：2017-5-25 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="header_pannel">
    <div class="home_header"
      v-if="headerType === 'home'"
      style="border: none;"
      :style="{
        backgroundColor: backgroundColor,
        marginLeft: '-' + fixedScrollOffset + 'px'
      }">
      <div class="header_content">
        <div class="logo">
          <router-link tag="a" to="/">
            <img v-lazy="'//o4a7cbihz.qnssl.com/picture/8e3e5e3c-bc05-4ff6-a8f0-47209cad89bd'" alt="新生大学首页">
            <span>新生大学</span>
          </router-link>
        </div>

        <ul class="nav">
          <li class="nav_item">
            <router-link to="/home/lessons">全部课程</router-link>
          </li>
          <li class="nav_item">
            <router-link to="/writing/article">写作平台</router-link>
          </li>
        </ul>
        
        <router-link
          v-if="isLogin"
          tag="a"
          to="/user/lessons"
          class="my_lessons btn_solid">我的课程</router-link>
        <a
          v-if="!isLogin"
          @click="login()"
          
          class="login">登 录</a>
        <a
          v-if="isLogin"
          @click="logout()"
          
          class="logout">退 出</a>

        <a
          @click="downloadApp()"
          
          class="download_app">下载手机版</a>
      </div>
    </div>

    <div
      v-if="headerType === 'user' || headerType === 'writing'"
      style="backgroundColor: #fff"
      :style="{ marginLeft: '-' + fixedScrollOffset + 'px' }"
      class="user_header">
      <div class="logo">
        <router-link tag="a" to="/">
          <img 
            v-if="headerType === 'user'"
            src="//o4a7cbihz.qnssl.com/picture/57140c0c-4ffa-4dde-9757-570b53f96796"
            alt="返回首页">
          <img 
            v-if="headerType === 'writing'"
            src="//o4a7cbihz.qnssl.com/picture/809fbf1b-2f60-43e4-857d-92f73fe7c72d"
            alt="返回首页">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { APP_ENV } from '../../../config'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        env: APP_ENV === 'pro' ? '' : '-' + APP_ENV,
        backgroundColor: '',
        homeBanner: null,
        isHomePage: false,
        fixedScrollOffset: 0
      }
    },

    props: {
      headerType: {
        required: true,
        type: String
      }
    },

    computed: mapState({
      isLogin: state => state.login.isLogin
    }),

    watch: {
      '$route': 'routeChanged'
    },

    mounted () {
      this.routeChanged()
      window.addEventListener('scroll', () => {
        this.fixedScrollOffset = window.scrollX
      })
    },

    methods: {
      routeChanged () {
        this.homeBanner = document.getElementById('home_banner')
        this.backgroundColor = '#fff'
        const path = window.location.pathname
        this.isHomePage = path === '/' || path === '/home'
        if (this.isHomePage && this.homeBanner) {
          this.backgroundColor = 'transparent'
          window.addEventListener('scroll', this.headerOpacity)
        } else {
          window.removeEventListener('scroll', this.headerOpacity)
        }
      },

      headerOpacity () {
        this.backgroundColor = 'rgba(255,255,255,' + window.scrollY / this.homeBanner.offsetHeight + ')'
      },

      async downloadApp () {
        await this.$router.push('/')
        this.$store.dispatch('eventEmitter', { event: 'downloadApp' })
      },

      login () {
        this.$store.dispatch('eventEmitter', { event: 'showLogin' })
      },

      logout (confirm) {
        let self = this
        this.$store.dispatch('boxyConfirm', {
          message: '确定要退出新生大学？',
          confirm () {
            self.$store.dispatch('logout')
          }
        })
      }
    }
  }
</script>
