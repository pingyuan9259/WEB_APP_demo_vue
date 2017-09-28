<!-- 所有课程页面
     作者：平原
     创建：2017-5-27 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div
    :style="{ 'minHeight': minHeight }"
    class="lessons_page">
    <div class="lessons">
      <lessons-list
        :show-page="true"
        :page-limit="9"
        page-type="all"
        loadingOffset="30"></lessons-list>
    </div>
  </div>
</template>

<script>
  import LessonsList from '../../modules/LessonsList/'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {
        minHeight: ''
      }
    },

    components: {
      LessonsList
    },

    computed: mapState({
      curPage: state => state.common.curPage
    }),

    watch: {
      curPage (val) {
        this.$store.dispatch('getCoursesList', { page: val, limit: 9, type: 'all' })
      }
    },

    mounted () {
      this.minHeight = window.innerHeight - 235 + 'px' // 235为lessons_page的padding之和再加上footer高度
      this.$store.dispatch('getCoursesList', { page: 1, limit: 9, type: 'all' })
      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端课程列表页'
      sensorsdata.saEvent(saTitle)
    }
  }
</script>
