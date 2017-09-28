<!-- 登录页面组件
     作者：平原
     创建：2017-6-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="login_pannel">
    <div class="video_bg">
      <div class="mash"></div>
      <video
        ref="videoBg"
        loop
        preload="meta"
        :muted="true"
        :controls="false"
        class="video_bg"> 
        <source src="https://o3b126ie1.qnssl.com/cover/96642cc1-5791-4761-a1ce-17931dbd39bf" type="video/mp4">
        <source src="https://static.tinfinite.com/xinsheng_web_first_page_video.webm" type="video/webm">
      </video>
    </div>

    <div class="logo">
      <router-link tag="a" to="/">
        <img src="//o4a7cbihz.qnssl.com/picture/57140c0c-4ffa-4dde-9757-570b53f96796" alt="新生大学首页">
        <span>新生大学</span>
      </router-link>
      <div class="slogen">
        <h3>学到不如「做到」</h3>
        <p>不再半途而废，为每天成长的自己感到骄傲</p>
        <router-link tag="a" to='/' class="toHome btn_solid">返回首页</router-link>
      </div>
    </div>

    <login></login>

    <loading
      id="login"
      background-color="#fff"
      :animation="false"></loading>
  </div>
</template>

<script>
  import Login from '../../modules/Login/'
  import Loading from '../../modules/Loading/'
  import { APP_TOKEN_KEY } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import { mapState } from 'vuex'

  export default {
    components: {
      Login,
      Loading
    },

    computed: mapState({
      isPc: state => state.global.isPc
    }),

    created () {
      if (Cookie.getCookie(APP_TOKEN_KEY)) {
        this.$router.replace('/user/lessons')
      }
    },

    mounted () {
      this.$store.dispatch('loadingHide', 'login')
      // 如果是不是pc浏览器的话，阻断视频播放
      if (this.isPc) {
        this.$refs.videoBg.play()
      }
    }
  }
</script>
