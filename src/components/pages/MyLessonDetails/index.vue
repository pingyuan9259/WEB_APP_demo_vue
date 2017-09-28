<!-- 我的课程详情
     作者：平原
     创建：2017-5-27 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="lesson_page">
    <banners banners-type="lessonDetail"></banners>
    <router-view></router-view>
  </div>
</template>

<script>
  import Banners from '../../modules/Banners/'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {
        activeName: 'first'
      }
    },
    mounted () {
      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端我的课程详情页'
      sensorsdata.saEvent(saTitle)
    },
    components: {
      Banners
    }
  }
</script>
