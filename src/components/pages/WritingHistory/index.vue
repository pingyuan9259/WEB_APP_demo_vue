<!-- 写作历史文章列表
     作者：平原
     创建：2017-8-8 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="article_history_page">
    <div class="article_history">
      <h3>历史发表的文章</h3>
      <table v-if="articleList && articleList.length">
        <tr class="article_history_head">
          <th class="cover text_center"><span>封面</span></th>
          <th><span>文章标题</span></th>
          <th><span>发表时间</span></th>
        </tr>
        <tr
          v-for="(item, index) in articleList"
          :key="index"
          @click="selectArticle(item.post_id)"
          class="article_history_item">
          <td class="cover">
            <img v-lazy="item.cover" alt="">
          </td>
          <td class="bold no_warp">{{ item.title }}</td>
          <td>{{ item._createdAt }}</td>
        </tr>
      </table>

      <pagination :page-limit="12" v-if="showPagination"></pagination>

      <div  v-if="articleList && !articleList.length"class="tip">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          您还没有发布过历史文章
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
  import Clipboard from 'clipboard'
  import { ENV } from '../../../config'
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        shareUrl: 'web' + ENV + 'xinshengdaxue.com/writing/detail'
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
        this.$store.dispatch('getOldArticleList', {
          page: val,
          limit: 12
        })
      }
    },

    created () {
      this.$store.dispatch('getOldArticleList', {
        page: 1,
        limit: 12
      })

      let clipShareUrl = new Clipboard('#share_url')
      clipShareUrl.on('success', () => {
        this.$store.dispatch('boxyTip', { message: '该文章链接已复制到剪贴板' })
      })
    },

    methods: {
      selectArticle (postId) {
        window.open(`//m${ENV}.xinshengdaxue.com/post_detail.html?id=${postId}`)
      },

      reEdit (postId, index) {
        console.log(postId)
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
