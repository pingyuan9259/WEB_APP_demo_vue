<!-- 首页视频banner组件
     作者：平原
     创建：2017-6-28
     优化：2017-7-19 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="video_banner">
    <div class="mash"></div>
    <div v-if="isPc" class="dynamic">
      <video
        ref="videoBg"
        loop
        preload="meta"
        :muted="true"
        :controls="false"
        poster="https://o4a7cbihz.qnssl.com/cover/a1b0801d-102a-4d8e-b3a5-b911d5881aae?imageView2/5/w/1920/h/1080"> 
        <source src="https://o3pvuu23u.qnssl.com/webm/tinfinite.webm" type="video/webm">  
        <source src="https://o3pvuu23u.qnssl.com/mp4/tinfinite.mp4" type="video/mp4">
        您的浏览器暂时不支持展示视频信息
      </video>

      <div :class="{ 'center': atCenter }" class="title">
        <span :class="{ 'show': showTitle1 }" class="title_1">学到</span>
        <span :class="{ 'show': showTitle2 }" class="title_2">不如</span>
        <span :class="{ 'show': showDash }" class="icon-dash"></span>
        <span :class="{ 'show': showCorred }" class="correct">做到</span>
      </div>

      <transition name="fade-slow">
        <p v-if="descContent" class="content" v-html="descContent"></p>
      </transition>
    </div>

    <!-- 适配手机端浏览 -->
    <div v-if="!isPc" class="static">
      <img
        :class="{ 'active': staticActive === 0 }"
        src="//o4a7cbihz.qnssl.com/picture/78edf313-b8d6-4eb3-9052-e6767634c6ac">
      <img
        :class="{ 'active': staticActive === 1 }"
        src="//o4a7cbihz.qnssl.com/picture/314a976c-4f7c-4453-a42a-e70ac9c635ce">
      <img
        :class="{ 'active': staticActive === 2 }"
        src="//o4a7cbihz.qnssl.com/picture/60d1406f-9ff4-475d-9b3b-900f20e1a421">
      <img
        :class="{ 'active': staticActive === 3 }"
        src="//o4a7cbihz.qnssl.com/picture/af7f0f27-66aa-4dc9-8742-58dfa4103e97">
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        descContent: '',
        showTitle1: false,
        showTitle2: false,
        showDash: false,
        showCorred: false,
        atCenter: true,
        video: null,
        canPlay: false,
        timer: null,
        xueWei: ' 学语言才不是为了考试，是为了与世界多一个交流的维度',
        gaoYang: '从0到1赋予代码生命，用思维和指尖创造世界',
        xiaoJing: '没有人是天生的演讲者，从现在起让听众欲罢不能',
        huiFeng: '发现躺在字里行间的财富，普通人最容易掌握的赚钱技能',
        staticActive: -1
      }
    },

    computed: mapState({
      isPc: state => state.global.isPc
    }),

    mounted () {
      // 如果是不是pc浏览器的话，阻断视频播放
      if (!this.isPc) {
        // 此处setTimeout 与 staticActive = -1
        // 是为了banner加载时能够淡入
        this.timer = setTimeout(() => {
          this.staticActive = 0
        }, 0)
        this.timer = null
        this.timer = setInterval(() => {
          if (this.staticActive === 3) {
            this.staticActive = 0
            return
          }
          this.staticActive++
        }, 5000)
        return
      }

      this.video = this.$refs.videoBg
      this.initTitle()

      // 如果进入可播放状态，title则取消居中
      let self = this
      this.videoEvent('canplay', () => {
        self.canPlay = true
        if (self.showCorred && self.atCenter) {
          self.video.play()
          self.atCenter = false
        }
      })

      this.videoEvent('play', this.addContent)
      this.videoEvent('playing', this.addContent)
      this.videoEvent('ended', () => {
        this.timer = null
      })

      // 视频移出窗口暂停播放，会导致字幕不同步。。。
      // window.addEventListener('scroll', this.scrollChanged)
    },

    // destroyed () {
    //   window.removeEventListener('scroll', this.scrollChanged)
    // },

    methods: {
      // 视频移出窗口暂停播放，会导致字幕不同步。。。
      // scrollChanged () {
      //   let videoHeight = this.video.clientHeight
      //   if (window.scrollY > videoHeight) {
      //     this.video.pause()
      //   } else {
      //     this.video.play()
      //   }
      // },

      videoEvent (event, callback) {
        this.video.addEventListener(event, callback, false)
      },

      timeDelay (callback, time) {
        return new Promise((resolve, reject) => {
          this.timer = setTimeout(() => {
            callback && callback()
            this.timer = null
            resolve()
          }, time)
        })
      },

      async initTitle () {
        try {
          await this.timeDelay(() => {
            this.showTitle1 = true
          }, 300)

          await this.timeDelay(() => {
            this.showTitle2 = true
          }, 700)

          await this.timeDelay(() => {
            this.showDash = true
            this.showCorred = true
            if (this.canPlay) {
              this.atCenter = false
              this.video.play()
            }
          }, 700)
        } catch (err) {}
      },

      async addContent () {
        try {
          await this.timeDelay(() => {
            this.descContent = this.xueWei
          }, 1000)

          await this.timeDelay(() => {
            this.descContent = ''
          }, 4000)

          await this.timeDelay(() => {
            this.descContent = this.gaoYang
          }, 2000)

          await this.timeDelay(() => {
            this.descContent = ''
          }, 4000)

          await this.timeDelay(() => {
            this.descContent = this.xiaoJing
          }, 3000)

          await this.timeDelay(() => {
            this.descContent = ''
          }, 4000)

          await this.timeDelay(() => {
            this.descContent = this.huiFeng
          }, 3000)

          await this.timeDelay(() => {
            this.descContent = ''
          }, 7000)
        } catch (err) {}
      }
    }
  }
</script>
