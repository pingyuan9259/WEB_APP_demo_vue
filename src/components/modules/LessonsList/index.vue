<!-- 课程列表组件
     作者：平原
     组件链1：首页页面 > 课程列表组件
     组件链2：全部课程页面 > 课程列表组件
     组件链3：我的课程页面 > 课程列表组件
     组件链4：我的授课页面 > 课程列表组件
     创建：2017-5-31
     优化：2017-7-20 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="lessons_list">
    <ul>
      <li
        v-for="(item, index) in coursesList"
        v-if="index < pageLimit"
        :key="index"
        class="lessons_item">
        <router-link
          tag="div"
          :to="{ path: 'lessons/details', query: { course_id: item.id }}"
          class="card">
          <div class="lesson_cover">
            <img v-lazy="item._avatar" ref="lessonCover">
          </div>
          <div class="lesson_desc">
            <h3 class="lesson_name">{{ item.name || '未命名课程' }}</h3>
            <span class="lesson_date">{{ '上课时间：' + item._beginAt + ' - ' + item._endAt }}</span>

            <div class="teacher_info" v-if="pageType !== 'teacher'">
              <img v-lazy="(item.teacherIntro ? item.teacherIntro.content : defaultPersonlAvatar)">
              <span>
                授课老师：
              </span>
              <span class="teacher_name no_warp">
                {{ item.teacherIntro ? item.teacherIntro.teacherName : '暂无'}}
              </span>
            </div>
            <span
              v-if="pageType === 'user' && item._liveStatus"
              class="lesson_is_living">
              正在直播
            </span>
            <span
              v-if="pageType === 'user' && item._showBegin && !item._liveStatus">
              {{ '下次开课：' + item._showBegin }}
            </span>
            <span
              v-if="pageType === 'user' && !item._showBegin && !item._liveStatus">
              暂无直播课
            </span>
          </div>
        </router-link>
      </li>

      <pagination :page-limit="pageLimit" v-if="showPagination && showPage"></pagination>
    </ul>

    <div v-if="!showList" class="tip">
      <p>
        <span class="icon-double-quotation tip_head"></span>
        暂无课程
      </p>
    </div>

    <loading
      id="coursesList"
      :offset="loadingOffset"
      :background-color="loadingBg"
      :animation="true"></loading>
  </div>
</template>

<script>
  import Pagination from '../Pagination/'
  import Loading from '../Loading/'
  import { DEFAULT_AVATAR } from '../../../config'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        defaultPersonlAvatar: DEFAULT_AVATAR,
        type: '',
        coursesList: {},
        showList: false,
        firstRende: 0
      }
    },

    components: {
      Pagination,
      Loading
    },

    props: {
      showPage: {
        required: true,
        type: Boolean
      },
      pageLimit: {
        required: true,
        type: Number
      },
      pageType: {
        required: true,
        type: String
      },
      loadingOffset: {},
      loadingBg: {}
    },

    computed: mapState({
      courses: state => state.course.courses,
      showPagination: state => state.common.showPagination
    }),

    watch: {
      courses (val) {
        if (val.type !== this.pageType) return
        let rows = val[val.type]
        let { page, limit, total, firstRende } = rows
        this.firstRende = firstRende
        if (rows[page].length) this.showList = true
        this.coursesList = Object.assign({}, rows[page])
        if (this.showPage) {
          this.$store.dispatch('initPagination', { page, limit, total })
        }
      }
    },

    updated () {
      // 组件更新时，置空课程封面
      if (this.firstRende) {
        for (let i in this.$refs.lessonCover) {
          let _i = this.$refs.lessonCover[i]
          _i.src = ''
        }
      }
    }
  }
</script>
