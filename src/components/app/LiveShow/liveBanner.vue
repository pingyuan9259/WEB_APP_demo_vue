<!-- 直播banner
     作者：阎垚月
     创建：2017-6 -->

<template>
  <div class="live-banner">
    <div class="slide_banner" v-if="bannerType === 'slide'">
      <ul class="slide_list">
        <transition-group name="fade">
          <li class="slide_item"
            :key="index"
            ref="slideItem"
            v-show="index === curSlideIndex"
            v-for="(item, index) in slideArray">
            <img :src="item">
          </li>
        </transition-group>
      </ul>

      <div class="slide_ctrl">

        <!-- <div class="slide_switch">
          <span class="prev icon-circle-left" @click="switchSlide('prev')"></span>
          <span
            v-show="limit >= curSlideIndex + 1"
            class="next icon-circle-right"
            @click="switchSlide('next')"></span>
        </div> -->
        <div class="slide_page" v-show="showPage">
          <span>{{curSlideIndex + 1}}/{{slideLength}}</span>
        </div>
      </div>
    </div>

    <loading
      v-show="slideArray.length === 0"
      id="banner"
      background-color="#f7f7f7"
      :animation="true"></loading>

  </div>
</template>

<script>
  import Loading from '../../modules/Loading/'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        bannerType: 'slide',
        curSlideIndex: 0,
        slideLength: 0,
        slideInterval: null,
        showJumpCtrl: false,
        showPage: true,
        autoPlay: false,
        slideArray: [],
        limit: 0
      }
    },
    components: {
      Loading
    },

    computed: mapState({
      resources: state => state.liveshow.resources,
      resourceSel: state => state.liveshow.resourceSel,
      joinInfo: state => state.liveshow.joinInfo
      // switchToSlide () {
      //   this.curSlideIndex = this.switchToSlide
      // }
    }),
    watch: {
      resources (data) {
        this.slideArray = data.result[0].links.map(item => {
          return item.link
        })
        this.slideLength = this.slideArray.length
        this.slideArray = [].concat(this.slideArray)

        // 当老师切换ppt下一组ppt时，定位到下一组的第一张
        this.curSlideIndex = 0
        this.switchSlide('jump', 0)
      },
      resourceSel (data) {
        for (let i in this.slideArray) {
          if (this.slideArray[i] === data.link) {
            this.limit = i
          }
        }
        this.switchSlide('jump', +this.limit)
      },
      joinInfo (data) {
        setTimeout(() => {
          for (let i in this.slideArray) {
            if (this.slideArray[i] === data.live_resource_sel.link) {
              this.limit = i
            }
          }
          this.switchSlide('jump', +this.limit)
        }, 1000)
      }
    },
    created () {
      if (this.slideArray.length > 0) {
        this.slideLength = this.slideArray.length
      }
      setTimeout(() => {
        this.$store.dispatch('loadingHide', { loadingId: 'banner' })
      }, 1000)
    },

    methods: {
      switchSlide (type, index) { // 轮播图切换 *slide_banner*
        switch (type) {
          case 'jump':
            this.curSlideIndex = index
            break
          case 'next':
            if (this.curSlideIndex < this.slideLength - 1) {
              this.curSlideIndex ++
            } else {
              this.curSlideIndex = 0
            }
            break
          case 'prev':
            if (this.curSlideIndex === 0) {
            } else {
              this.curSlideIndex --
            }
        }
      }
    }
  }
</script>
