<!-- 写作草稿列表
     作者：平原
     创建：2017-8-8 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div class="article_draft_page">
    <div class="article_draft">
      <h3>保存的草稿</h3>
      <table v-if="articleList && articleList.length">
        <tr class="article_draft_head">
          <th><span>频道</span></th>
          <th><span>文章标题</span></th>
          <th><span>创建时间</span></th>
          <th class="text_center"><span>操作</span></th>
        </tr>
        <tr
          v-for="(item, index) in articleList"
          :key="index"
          @click="reEdit(item.id, index, $event.target)"
          class="article_draft_item">
          <td class="no_warp">{{ item.bbsName }}</td>
          <td class="bold no_warp">{{ item.title }}</td>
          <td :style="{ 'width': '20vw' }">{{ item._createdAt }}</td>
          <td class="option" :style="{ 'width': '80px' }">
            <a
              @click="preview(item.id)"
              class="option_btn icon-eye mr20 alt">
              <span>预览草稿</span>
            </a>
            <a
              :data-clipboard-text="shareUrl + 'post_id=' + item.id"
              id="share_url"
              class="option_btn icon-share2 mr20 alt">
              <span>复制链接</span>
            </a>
            <a
              @click="deleteArticle(item.id, index)"
              class="option_btn icon-empty alt">
              <span>删除草稿</span>
            </a>
          </td>
        </tr>
      </table>

      <pagination :page-limit="12" v-if="showPagination"></pagination>

      <div class="tip" v-if="articleList && !articleList.length">
        <p>
          <span class="icon-double-quotation tip_head"></span>
          草稿箱为空
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
        shareUrl: `https://m${ENV}.xinshengdaxue.com/post_detail.html?`
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
          status: 2
        })
      }
    },

    created () {
      this.$store.dispatch('getArticleList', {
        page: 1,
        limit: 12,
        status: 2
      })

      let clipShareUrl = new Clipboard('#share_url')
      clipShareUrl.on('success', () => {
        this.$store.dispatch('boxyTip', { message: '该文章链接已复制到剪贴板' })
      })
    },

    methods: {
      preview (postId) {
        window.open(`//m${ENV}.xinshengdaxue.com/post_detail.html?post_id=${postId}`)
      },

      reEdit (postId, index, target) {
        if (target.className.indexOf('option_btn') > -1) return
        this.$router.push({
          path: '/writing/edit',
          query: { 'postId': postId }
        })
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
