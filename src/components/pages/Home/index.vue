<!-- 首页页面
     作者：平原
     创建：2017-5-27 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="home_page">
    <section class="banners_container" id="home_banner">
      <video-banner></video-banner>
    </section>

    <section class="intro">
      <div class="card">
        <h3>学到不如做到</h3>
        <p>学代码就要写，学英语就要用，学东西就要践行，只有实践才是真正的成长</p>
        <ul>
          <li class="intro_card">
            <span class="icon-smile"></span>
            <h4>课程直播</h4>
            <p>享受在线课程直播，与老师实时互动</p>
          </li>
          <li class="intro_card">
            <span class="icon-danao"></span>
            <h4>课后实践</h4>
            <p>课后辅导及答疑解惑，跟踪学习进度</p>
          </li>
          <li class="intro_card">
            <span class="icon-shijian"></span>
            <h4>学习社区</h4>
            <p>找到志同道合的学习伙伴，互相督促</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="lessons">
      <h3>推荐课程</h3>

      <lessons-list
        :show-page="false"
        :page-limit="3"
        page-type="recommand"
        loadingBg="#F9FCFD"></lessons-list>

      <router-link tag="a" to="/home/lessons" class="more_lessons btn_hollow">更多课程</router-link>
    </section>

    <section class="app_end">
      <div class="card">
        <a ref="appEndAnchor"  class="app_end_anchor"></a>
        <div class="app_intro">
          <h3>移动学习平台</h3>
          <p>把课堂装进口袋，把知识装进脑袋，碎片化时代，随时随地在线学习</p>
          <a
            href="https://itunes.apple.com/us/app/xin-sheng-da-xue/id1087250503?l=zh&ls=1&mt=8"
            target="_blank"
            class="download_ios btn_hollow_large">iPhone</a>
          <a
            href="http://m.xinshengdaxue.com/app_download.html"
            target="_blank"
            class="download_android btn_hollow_large">Android</a>
          <!-- <a href="http://m.xinshengdaxue.com/android_download.html" class="download_android btn_hollow_large">Android</a> -->
        </div>
        <img
          :src="'//o4a7cbihz.qnssl.com/picture/a6f933c0-3e58-4e0f-8c21-6a1d4b999eb1'"
          class="phone1">
        <img
          :src="'//o4a7cbihz.qnssl.com/picture/f3817397-82f4-44fd-a329-4b222b5b8ce3'"
          :style="{ 'right': showAppEnd ? '310px' : '' }"
          class="phone2">
        <img
          :src="'//o4a7cbihz.qnssl.com/picture/e554acdb-6865-4ac5-862c-60c2a6b0ad8c'"
          :style="{ 'right': showAppEnd ? '0px' : '' }"
          class="phone3">
      </div>
    </section>

<!--     <section class="teacherIntro_container">
      <h3>这些好老师都在</h3>

      <teacher-intro-slide></teacher-intro-slide>
    </section> -->

    <section class="join">
      <h3>成为新生大学会员</h3>
      <div class="card">
        <h4 v-if="showPrice" class="price">{{ price }}元</h4>
        <div v-if="!showPrice" class="loading_price">
          <span class="icon-spinner rotate"></span>
        </div>
        <div class="desc">
          <div class="item">
            <!-- <span class="icon-medal"></span> -->
            <p><span>送新生币</span>购买会员赠送4588新生币</p>
          </div>
          <div class="item">
            <!-- <span class="icon-medal"></span> -->
            <p><span>课程免费</span>新生大学不定期为您提供免费精品课程</p>
          </div>
          <div class="item">
            <!-- <span class="icon-medal"></span> -->
            <p><span>独享优惠</span>收费课程价格减免、主题演讲门票优惠</p>
          </div>
          <div class="item">
            <!-- <span class="icon-medal"></span> -->
            <p><span>专属活动</span>免费参加新生大学在各大城市举办的同学会</p>
          </div>
          <div class="item">
            <!-- <span class="icon-medal"></span> -->
            <p><span>优先权利</span>优先参加合作课程</p>
          </div>
        </div>

        <pay
          :price="+price"
          :is-member="isMember"
          :is-buy-member="isBuyMember"
          :member-course-id="memberCourseInfo.id"></pay>
      </div>
      <div class="boys_and_girls">
        <div class="group_A">
          <span class="icon-girl2">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span><span class="path26"></span><span class="path27"></span>
          </span>

          <span class="icon-boy2">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span>
          </span>

          <span class="icon-boy1">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span><span class="path26"></span><span class="path27"></span><span class="path28"></span><span class="path29"></span><span class="path30"></span><span class="path31"></span>
          </span>
        </div>

        <div class="group_B">
          <span class="icon-girl1">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span>
          </span>
          <span class="icon-boy3">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span><span class="path22"></span><span class="path23"></span><span class="path24"></span><span class="path25"></span><span class="path26"></span><span class="path27"></span><span class="path28"></span><span class="path29"></span>
          </span>

          <span class="icon-boy4">
          <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import VideoBanner from '../../modules/VideoBanner/'
  import LessonsList from '../../modules/LessonsList/'
  import TeacherIntroSlide from '../../modules/TeacherIntroSlide/'
  import Pay from '../../modules/Pay/'
  import { APP_TOKEN_KEY } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {
        showAppEnd: false,
        isMember: false,
        isBuy: false,
        isBuyMember: false, // 判断用户曾经是否购买过会员
        price: '',
        showPrice: 0
      }
    },

    components: {
      VideoBanner,
      LessonsList,
      TeacherIntroSlide,
      Pay
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      eventEmitter: state => state.global.eventEmitter,
      userMemberInfo: state => state.pay.userMemberInfo,
      memberCourseInfo: state => state.pay.memberCourseInfo,
      isBuyMemberInThePast: state => state.pay.isBuyMemberInThePast
    }),

    watch: {
      // 如果未登录，会员功能变为登录入口
      async isLogin (val) {
        if (!val && !Cookie.getCookie(APP_TOKEN_KEY)) {
          this.isMember = false
          this.isBuyMember = false
        }

        if (val && Cookie.getCookie(APP_TOKEN_KEY)) {
          this.$store.dispatch('getRecommandCourses')

          let userInfo = await this.$store.dispatch('getUserDetails')
          if (userInfo && userInfo.is_member) {
            this.isMember = true
          }

          this.$store.dispatch('getMemberCourseInfo')
          this.$store.dispatch('getUserMemberInfo')
          this.$store.dispatch('isBuyMemberInThePast')

          // 神策数据上报
          sensorsdata.track()
          let saTitle = 'web首页'
          sensorsdata.saEvent(saTitle)
        }
      },

      eventEmitter (val) {
        let { event } = val

        if (event === 'downloadApp') {
          this.$refs.appEndAnchor.scrollIntoView()
        }
      },

      isBuyMemberInThePast (val) {
        if (val.onceMember) {
          this.isBuyMember = true
        }
      }
    },

    async mounted () {
      window.addEventListener('scroll', this.scrollChanged)

      try {
        this.$store.dispatch('getRecommandCourses')

        // 获取会员购买信息
        await this.$store.dispatch('getMemberCourseInfo')
        this.price = this.memberCourseInfo.price

        if (this.isLogin && Cookie.getCookie(APP_TOKEN_KEY)) {
          let userInfo = await this.$store.dispatch('getUserDetails')
          if (userInfo && userInfo.is_member) {
            this.isMember = true
          }

          await this.$store.dispatch('isBuyMemberInThePast')
          if (this.isBuyMember) {
            this.price = this.memberCourseInfo.renewPrice
          }

          this.$store.dispatch('getUserMemberInfo')
          this.showPrice = 1
        }
      } catch (err) {
        console.log(err)
      }
    },

    destroyed () {
      window.removeEventListener('scroll', this.scrollChanged)
    },

    methods: {
      scrollChanged () {
        let bannerHeight = document.getElementById('home_banner').clientHeight
        if (window.scrollY > 1200 + bannerHeight) {
          this.showAppEnd = true
        }
      }
    }
  }
</script>
