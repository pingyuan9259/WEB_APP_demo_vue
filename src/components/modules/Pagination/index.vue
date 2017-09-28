<!-- 分页组件
     作者：平原
     创建：2017-5-8
     优化：2017-7-7 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="pagination">
    <ul class="page-list">
<!--       <li class="item">
        <a  :class="preOrNext === -1 ? 'disabled' : ''" @click="prePage()">
          <span>&laquo;</span>
        </a>
      </li> -->
      <li class="item" v-for="item of pageItem">
        <a  
          :class="item.active ? 'active' : ''" 
          @click="item.active ? '' : jumpPage(item.page)">
          {{item.page}}
        </a>
      </li>
<!--       <li class="item">
        <a  :class="preOrNext === 1 ? 'disabled' : ''" @click="nextPage()">
          <span>&raquo;</span>
        </a>
      </li> -->
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState({
      showPagination: state => state.common.showPagination,
      pageItem: state => state.common.pageItem,
      curPage: state => state.common.curPage,
      preOrNext: state => state.common.preOrNext
    }),

    props: {
      pageLimit: {
        required: true,
        type: Number
      }
    },

    methods: {
      jumpPage (toPage) {
        this.$store.dispatch('updatePage', toPage)
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 100)
      }
      // },

      // prePage () {
      //   if (this.preOrNext === -1) return
      //   let targetPage = this.curPage - 1
      //   this.jumpPage(targetPage)
      // },

      // nextPage () {
      //   if (this.preOrNext === 1) return
      //   let targetPage = this.curPage + 1
      //   this.jumpPage(targetPage)
      // }
    }
  }
</script>
