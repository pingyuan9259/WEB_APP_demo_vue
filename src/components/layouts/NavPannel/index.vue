<!-- 侧边栏导航组件
     作者：平原
     创建：2017-5-31 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div 
    :style="{ marginLeft: '-' + fixedScrollOffset + 'px' }"
    class="nav_pannel">
    <div class="nav_avatar">
      <img :src="(userDetails && userDetails.avatar) || defaultAvatar">
      <span>{{userDetails && userDetails.fullname || '游客'}}</span>
    </div>

    <ul class="nav_list">
      <router-link
        v-for="(item, index) in this.navData"
        :key="index"
        v-if="item.authority ? item.condition : 1"
        tag="li"
        :to="item.path"
        class="nav_item">
        <span :class="item.iconClass"></span>
        {{ item.name }}
      </router-link>
    </ul>

    <div class="logout" @click="logout()">
      <span class="icon-switch"></span>
      <span class="text">退 出</span>
    </div>
  </div>
</template>

<script>
  import { DEFAULT_AVATAR } from '../../../config'

  export default {
    data () {
      return {
        userDetails: {},
        defaultAvatar: DEFAULT_AVATAR,
        fixedScrollOffset: 0
      }
    },

    props: {
      navData: { require: true, type: Array },
      logoutRedirectPath: { require: true, type: String }
    },

    watch: {
      '$route': 'routeChanged'
    },

    async mounted () {
      this.userDetails = await this.$store.dispatch('getUserDetails')
      window.addEventListener('scroll', () => {
        this.fixedScrollOffset = window.scrollX
      })
    },

    methods: {
      async routeChanged () {
        this.userDetails = await this.$store.dispatch('getUserDetails')
      },

      logout () {
        let self = this
        this.$store.dispatch('boxyConfirm', {
          message: '确定要退出新生大学？',
          confirm () {
            self.$store.dispatch('logout')
            self.$router.replace({
              path: '/login',
              query: { redirect: self.logoutRedirectPath }
            })
          }
        })
      }
    }
  }
</script>

