<!-- 作业列表组件
     作者：平原
     组件链：作业tab页 > 作业列表组件 > 某作业内容组件 > 论坛组件
     创建：2017-6 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="homework_list_page">
    <ul class="homework_list">
      <router-link
        :to="{ 
          path: '../homework-comments',
          query: {
            course_id: courseId,
            post_id: item.postId,
            user_id: item.userId
          }
        }"
        tag="li"
        v-for="(item, index) in homeworkList"
        :key="index"
        class="homework_item">
        <h4 class="no_warp">{{ item.title }}</h4>
        <p class="no_warp">{{ item.content }}</p>
        <span class="date">{{ item.createdTime }}</span>
        <span class="icon-reply"></span>
        <span class="reply_num">{{ item.replyNum }} 回应</span>
      </router-link>
    </ul>

    <div class="load" v-if="homeworkList && homeworkList.length">
      <span v-if="!allLoaded">加载中...</span>
      <span v-if="allLoaded">没有更多</span>
    </div>

    <div class="tip" v-if="homeworkList && !homeworkList.length">
      <p>
        <span class="icon-double-quotation tip_head"></span>
        老师还没有留作业
      </p>
    </div>
  </div>
</template>

<script>
  import { getUrlQuery } from '../../../utils/enhance'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        courseId: getUrlQuery('course_id')
      }
    },

    props: {
      allLoaded: {
        required: true,
        type: Boolean
      }
    },

    computed: mapState({
      homeworkList: state => state.homework.homeworkList
    })
  }
</script>
