<!-- 我的课程列表页面
     作者：平原
     创建：2017-5-27 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="my_lessons_page">
    <h2>{{ pageName }}</h2>
    <lessons-list
      :show-page="true"
      :page-limit="9"
      loadingOffset="25"
      :page-type="pageType"
      loadingBg="#F9FCFD"></lessons-list>
  </div>
</template>

<script>
  import LessonsList from '../../modules/LessonsList/'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {
        pageName: '我的课程',
        pageType: ''
      }
    },

    components: {
      LessonsList
    },

    computed: mapState({
      isTeacher: state => state.global.isTeacher,
      curPage: state => state.common.curPage
    }),

    watch: {
      curPage (val) {
        if (val) {
          this.$store.dispatch('getCoursesList', { page: val, limit: 9, type: 'user' })
        }
      },

      // 因为公用组件所以改变路由后组件不会更新状态，所以监听路由变化从新调接口，渲染页面
      '$route': 'routeChanged'
    },

    mounted () {
      this.init()
      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端我的课程列表页'
      sensorsdata.saEvent(saTitle)
    },

    methods: {
      routeChanged () {
        this.init()
      },

      init () {
        // 老师和用户共享此组件及其子组件，需要在此声明组件的类型，并dispatch不同的action
        if (location.pathname.indexOf('teacher') > -1) {
          this.pageName = '我的授课'
          this.pageType = 'teacher'
        } else {
          this.pageName = '我的课程'
          this.pageType = 'user'
        }
        this.$store.dispatch('getCoursesList', { page: 1, limit: 9, type: this.pageType })
      }
    }
  }
</script>
