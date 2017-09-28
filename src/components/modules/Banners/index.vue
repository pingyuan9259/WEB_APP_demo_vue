<!-- banner组件
     作者：平原
     创建：2017-6-6
     优化：2017-7-13 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="banners" :style="{ overflow: bannersType !== 'lessonDetail' ? 'hidden' : 'visible' }">
    <!-- 用于课程详情的br banner -->
    <div class="br_banner" v-if="bannersType === 'brBanner'">
      <img v-lazy="courseInfo.avatar" class="cover">
    </div>

    <!-- 用于我的课程详情的banner -->
    <div class="lesson_detail"
      ref="lessonDetail"
      :style="tagScrollStop"
      v-lazy:background-image="'//o4a7cbihz.qnssl.com/picture/a9d69159-179a-46b8-9b1c-91312e73bca1'"
      v-if="bannersType === 'lessonDetail' && courseInfo">
      <h2 class="title">{{ courseInfo.name }}</h2>
      <div class="teacher_info">
        <img v-lazy="(courseInfo.teacherIntro.content || defaultPersonlAvatar)" alt="">
        <div>
          <span class="teacher_name">授课老师：{{ courseInfo.teacherIntro.teacherName || '暂无' }}</span>
          <span class="lesson_date">{{ courseInfo._beginAt + ' - ' + courseInfo._endAt }}</span>
        </div>
      </div>

      <div class="tabs">
        <ul>
          <router-link
            tag="li"
            :to="{ path: 'schedules', query: { course_id: courseId }}"
            replace
            class="tabs_item">内容</router-link>
          <router-link
            tag="li"
            :to="{ path: 'homework', query: { course_id: courseId }}"
            replace
            :class="{ 'not_verified': userDetail.verify_status !== 1 }"
            class="tabs_item">作业</router-link>
          <router-link
            tag="li"
            :to="{ path: 'comments', query: { course_id: courseId }}"
            replace
            :class="{ 'not_verified': userDetail.verify_status !== 1 }"
            class="tabs_item">讨论</router-link>
        </ul>
      </div>
    </div>

    <!-- 用于我的个人信息的banner -->
    <div class="my_profile"
      v-if="bannersType === 'myProfile'">
      <img v-lazy="(userDetail.avatar || defaultPersonlAvatar)" alt="">
      <div>
        <div class="name">
          <h3>{{ userDetail.fullname }}</h3>
          <span class="label" v-if="userDetail.labels && userDetail.labels.length > 0" :style="{backgroundColor: userDetail.labels[0].color}">{{userDetail.labels[0].name}}</span>
        </div>
        <span class="industry">{{ userDetail.industry || '自由人' }}</span>
        <span class="dot">·</span>
        <span class="city">{{ userDetail.city }}</span>
        <p class="introduction">{{ userDetail.introduce || '暂无签名' }}</p>
      </div>
    </div>

    <loading
      v-if="bannersType === 'slide'"
      id="banner"
      background-color="#f7f7f7"
      :animation="true"></loading>

  </div>
</template>

<script>
  import Loading from '../Loading/'
  import { DEFAULT_AVATAR, USER_INFO_KEY } from '../../../config'
  import { getUrlQuery } from '../../../utils/enhance'
  import Storage from '../../../utils/storage'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        defaultPersonlAvatar: DEFAULT_AVATAR,
        courseId: getUrlQuery('course_id'),
        userDetail: Storage.get(USER_INFO_KEY),
        tagScrollStop: {}
      }
    },

    props: {
      bannersType: {
        type: String,
        required: true
      }
    },

    components: {
      Loading
    },

    computed: mapState({
      courseInfo: state => state.course.courseInfo
    }),

    mounted () {
      window.addEventListener('scroll', this.scrollChanged)
    },

    destroyed () {
      window.removeEventListener('scroll', this.scrollChanged)
    },

    methods: {
      scrollChanged () {
        if (window.scrollY > 150) {
          this.tagScrollStop = {
            position: 'fixed',
            top: '-60px',
            left: '200px',
            right: '0',
            zIndex: '100'
          }
        } else {
          this.tagScrollStop = {}
        }
      }
    }
  }
</script>
