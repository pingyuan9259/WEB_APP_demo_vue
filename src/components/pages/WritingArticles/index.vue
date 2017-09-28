<!-- 写作文章列表
     作者：平原
     创建：2017-8-8 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="article_list_page">
    <div class="article_list">
      <div class="top_bar">
        <h3 class="pull_left">已经发表的文章</h3>
        <a
          @click="$router.push('/writing/edit')"
          class="edit btn_hollow pull_right">写文章</a>
      </div>
      <table v-if="articleList && articleList.length">
        <tr class="article_list_head">
<!--           <th><span>封面</span></th> -->
          <th><span>频道</span></th>
          <th><span>文章标题</span></th>
          <th><span>发表时间</span></th>
          <th><span>操作</span></th>
        </tr>
        <tr
          v-for="(item, index) in articleList"
          :key="index"
          @click="selectArticle(item.id, $event.target)"
          class="article_list_item">
<!--           <td class="cover">
            <img v-lazy="item.cover" alt="">
          </td> -->
          <td class="no_warp">{{ item.bbsName }}</td>
          <td class="bold no_warp">{{ item.title }}</td>
          <td>{{ item._publishedAt }}</td>
          <td class="delete">
            <a
              @click="deleteArticle(item.id, index)"
              class="del_btn">删除</a>
          </td>
        </tr>
      </table>

      <pagination :page-limit="12" v-if="showPagination"></pagination>

      <div class="tip" v-if="articleList && !articleList.length">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          您还没有发布文章
        </p>
      </div>

      <loading
        id="articleList"
        offset="26"
        :animation="true"></loading>
    </div>
  </div>
</template>

<script>
  import Pagination from '../../modules/Pagination/'
  import Loading from '../../modules/Loading/'
  import { ENV } from '../../../config'
  import { mapState } from 'vuex'
  import sensorsdata from '../../../utils/sensorsdata'

  export default {
    data () {
      return {

      }
    },

    components: {
      Pagination,
      Loading
    },

    computed: mapState({
      articleList: state => state.writing.articleList,
      showPagination: state => state.common.showPagination,
      curPage: state => state.common.curPage
    }),

    watch: {
      curPage (val) {
        this.$store.dispatch('getArticleList', {
          page: val,
          limit: 12,
          status: 1
        })
      }
    },

    created () {
      this.$store.dispatch('getArticleList', {
        page: 1,
        limit: 12,
        status: 1
      })
      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端文章页'
      sensorsdata.saEvent(saTitle)
    },

    methods: {
      selectArticle (postId, target) {
        if (target.className.indexOf('del_btn') > -1) return
        window.open(`//m${ENV}.xinshengdaxue.com/post_detail.html?post_id=${postId}`)
      },

      deleteArticle (postId, index) {
        let self = this
        this.$store.dispatch('boxyWarning', {
          message: '确定要删除此文章？',
          confirm () {
            self.$store.dispatch('deleteArticle', {
              postId: postId,
              index: index
            })
          }
        })
      }
    }
  }
</script>
