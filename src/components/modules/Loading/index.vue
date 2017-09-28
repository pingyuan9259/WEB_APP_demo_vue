<!-- 加载中组件
     作者：平原
     创建：2017-5-27
     优化：2017-7-17 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <transition name="fade-quick">
    <div
      v-if="isShow"
      :style="{
        'backgroundColor': backgroundColor,
      }"
      class="loading">
      <span
        v-if="animation"
        :style="{ 'top': offset + 'vh' }"
        class="icon-spinner rotate"></span>
    </div>
  </transition>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        isShow: true
      }
    },

    props: {
      id: {
        required: true,
        type: String
      },
      animation: {
        required: true,
        type: Boolean
      },
      offset: {},
      backgroundColor: {}
    },

    computed: mapState({
      loading: state => state.common.loading
    }),

    watch: {
      loading (val) {
        if (val.id !== this.id) return
        if (!val.isShow) {
          setTimeout(() => {
            this.isShow = val.isShow
          }, 200)
          return
        }
        this.isShow = val.isShow
      },

      '$route': 'routeChanged'
    },

    methods: {
      routeChanged () {
        // this.isShow = true
      }
    }
  }
</script>
