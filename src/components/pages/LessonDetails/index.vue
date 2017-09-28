<!-- 课程详情页面
     作者：平原
     创建：2017-5-27 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="lesson_details_page">
    <section class="banners_container">
      <banners banners-type="brBanner"></banners>
    </section>

    <section class="lessonInfo">
      <h2>{{ courseInfo.name }}</h2>
      <span class="icon-gold-coin" style="marginRight: 5px;"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span>
      <span
        v-if="courseInfo.price"
        class="price">
        {{ courseInfo.price }}
      </span>
      <span
        v-if="!courseInfo.price"
        class="free">
        免费
      </span>
      <span
        v-if="!courseInfo.memberPrice && courseInfo.price"
        class="members_price">
        会员免费
      </span>
      <span
        v-if="courseInfo.memberPrice && (courseInfo.memberPrice < courseInfo.price)"
        class="members_price">
        {{ '会员减 ' + (courseInfo.price - courseInfo.memberPrice) }}
      </span>
      <p class="date">报名截止时间：{{ courseInfo._signupDeadline }}</p>
    </section>

    <div v-if="!isTeacher" class="buy">
      <a
        v-if="!isBuy && courseInfo._signupDeadline !== '已截止'"
        @click="buyCourse()"

        class="btn_solid_large">我要报名</a>
      <span
        v-if="!isBuy && courseInfo._signupDeadline === '已截止'"
        class="btn_solid_large">报名已截止</span>
      <span
        v-if="isBuy"
        class="btn_solid_large">已购买</span>
    </div>
    <div v-if="isTeacher" class="teacher">
      <router-link
        tag="a"
        :to="{
          path: '/teacher/lessons/details/schedules',
          query: { course_id: courseId }
        }"
        @click="buyCourse()"
        class="btn_solid_large">进入课程</router-link>
    </div>

    <section class="features" v-if="features.length && courseInfo.type === 1">
      <h3>我能学到什么</h3>
      <ul class="features_list">
        <li
          v-for="(item, index) in features"
          :key="index"
          class="features_item">
          <h4>
            <span class="icon-medal"></span>
            {{ item['2'] }}
          </h4>
          <p>{{ item['3'] }}</p>
        </li>
      </ul>
    </section>

    <section class="desc_pic" v-if="banners.length && courseInfo.type === 2">
      <ul class="desc_pic_list">
        <li
          v-for="(item, index) in banners"
          :key="index"
          class="desc_pic_item">
          <img :src="item">
        </li>
      </ul>
    </section>

    <section class="outlines" v-if="outlines.length">
      <h3>课程大纲</h3>
      <ul class="outlines_list">
        <li
          v-for="(item, index) in outlines"
          :key="index"
          class="outlines_item">
          <img :src="item['1']">
          <h4>{{ item['2'] }}</h4>
          <span v-if="item['4']">日期：{{ item['4'] | outLineTime }}</span>
          <p>{{ item['3'] }}</p>
        </li>
      </ul>
    </section>

    <section class="teacher_intros" v-if="teacherIntros.length">
      <ul class="intros_list">
        <li
          v-for="(item, index) in teacherIntros"
          :key="index"
          class="intros_item">
          <div class="teacher_avatar">
            <img :src="item._avatar">
          </div>
          <div class="teacher_desc">
            <h3>授课老师</h3>
            <h3 class="bold">{{ item.teacherName || '暂无' }}</h3>
            <p v-html="item._introduction || '暂无介绍'"></p>
          </div>
        </li>
      </ul>
    </section>

    <section class="faqs" v-if="faqs.length">
      <h3>常见问题</h3>
      <ul class="faqs_list">
        <li
          v-for="(item, index) in faqs"
          :key="index"
          class="faqs_item">
          <h4>{{ item['1'] }}</h4>
          <p>{{ item['2'] }}</p>
        </li>
      </ul>
    </section>

    <div v-if="!isTeacher" class="buy">
      <a
        v-if="!isBuy && courseInfo._signupDeadline !== '已截止'"
        @click="buyCourse()"

        class="btn_solid_large">我要报名</a>
      <span
        v-if="!isBuy && courseInfo._signupDeadline === '已截止'"
        class="btn_solid_large">报名已截止</span>
      <span
        v-if="isBuy"
        class="btn_solid_large">已购买</span>
    </div>
    <div v-if="isTeacher" class="teacher">
      <router-link
        tag="a"
        :to="{
          path: '/teacher/lessons/details/schedules',
          query: { course_id: courseId }
        }"
        @click="buyCourse()"
        class="btn_solid_large">进入课程</router-link>
    </div>

  </div>
</template>

<script>
  import Banners from '../../modules/Banners/'
  import LessonsList from '../../modules/LessonsList/'
  import { getUrlQuery } from '../../../utils/enhance'
  import { APP_TOKEN_KEY } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import { initWalletOrderInfo } from '../../../utils/payOrder'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'
  import moment from 'moment'

  // api
  import CheckCourseIsBuy from '../../../api/pay/CheckCourseIsBuy'
  import BuyCourse from '../../../api/pay/BuyCourse'

  export default {
    data () {
      return {
        courseId: getUrlQuery('course_id'),
        isTeacher: false,
        isBuy: false,
        isMember: false,
        buyInfo: {}
      }
    },

    components: {
      Banners,
      LessonsList
    },

    computed: mapState({
      isLogin: state => state.login.isLogin,
      courseInfo: state => state.course.courseInfo,
      banners: state => state.course.banners,
      features: state => state.course.features,
      outlines: state => state.course.outlines,
      faqs: state => state.course.faqs,
      teacherIntros: state => state.course.teacherIntros,
      canEdit: state => state.schedule.canEdit,
      accountInfo: state => state.pay.accountInfo
    }),

    filters: {
      outLineTime (value) { // 课程大纲时间整形
        if (!value) { return }
        let time = value.split('-')
        return moment(time[0]).format('MM月DD HH:mm') + ' - ' + moment(time[1]).format('HH:mm')
      }
    },

    watch: {
      courseInfo (data) {
        // 神策数据上报
        let saTitle = `web端-${data.name}-课程详情页`
        sensorsdata.saEvent(saTitle)
      },

      // 如果未登录，购买功能变为登录入口
      async isLogin (val) {
        if (!val && !Cookie.getCookie(APP_TOKEN_KEY)) {
          this.isMember = false
          this.isBuy = false
          this.isTeacher = false
        }

        try {
          if (this.isLogin && Cookie.getCookie(APP_TOKEN_KEY)) {
            let userInfo = await this.$store.dispatch('getUserDetails')
            if (userInfo && userInfo.is_member) {
              this.isMember = true
            }

            // 判断是否购买
            this.isBuy = await CheckCourseIsBuy(this.courseId)

            // 如果具有编辑权限，则可以直接进入“我的授课”
            this.$store.dispatch('canEditCourseSchedule', this.courseId)
          }
        } catch (err) {
          console.log(err)
        }
      },

      canEdit (val) {
        this.isTeacher = val
      }
    },

    async mounted () {
      this.$store.dispatch('getCourseInfo', this.courseId)
      this.$store.dispatch('getCourseFeatures', this.courseId)
      this.$store.dispatch('getCourseBanners', this.courseId)
      this.$store.dispatch('getCourseOutlines', this.courseId)
      this.$store.dispatch('getCourseFaqs', this.courseId)
      this.$store.dispatch('getCourseTeacherIntros', this.courseId)

      try {
        // 登录后会调用以下接口
        if (this.isLogin && Cookie.getCookie(APP_TOKEN_KEY)) {
          // 获取我的钱包信息
          this.$store.dispatch('getAccountInfo')

          // 如果具有编辑权限，则可以直接进入“我的授课”
          this.$store.dispatch('canEditCourseSchedule', this.courseId)

          // 判断是否购买
          this.isBuy = await CheckCourseIsBuy(this.courseId)

          let userInfo = await this.$store.dispatch('getUserDetails')
          if (userInfo && userInfo.is_member) {
            this.isMember = true
          }
          // 神策数据上报
          sensorsdata.track()
        }
      } catch (err) {
        console.log(err)
      }
    },

    methods: {
      buyCourse () {
        let self = this

        // 如果未登录，购买功能变为登录入口
        if (!this.isLogin && !Cookie.getCookie(APP_TOKEN_KEY)) {
          this.$store.dispatch('eventEmitter', { event: 'showLogin' })
          return
        }

        let coursePrice = this.courseInfo.price
        if (this.isMember) {
          coursePrice = this.courseInfo.memberPrice
        }
        if (this.accountInfo.newbornBalance < coursePrice) {
          this.$store.dispatch('boxyConfirm', {
            message: '余额还差 ' + (coursePrice - this.accountInfo.newbornBalance) + ' ，请充值',
            confirm () {
              self.$router.push('/user/my-account')
            }
          })
          return
        }

        this.buyInfo = initWalletOrderInfo(this.courseId)

        this.$store.dispatch('boxyConfirm', {
          message: '购买此课程将会扣除 ￥' + coursePrice,
          confirm () {
            self.confirmBuy()
          }
        })
      },

      async confirmBuy () {
        try {
          this.$store.dispatch('boxyProgress', { message: '正在支付...' })

          // 直接调支付的api，不走action，因为数据不需要存储
          BuyCourse(this.buyInfo).then(result => {
            if (result) {
              this.$store.dispatch('boxyProgressClose')
              this.$store.dispatch('boxyTip', { message: '支付成功' })
              this.isBuy = true
            } else {
              this.$store.dispatch('boxyProgressClose')
              this.$store.dispatch('boxyTip', { message: '支付失败' })
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
