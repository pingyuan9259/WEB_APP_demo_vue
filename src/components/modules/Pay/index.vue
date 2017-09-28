<!-- 支付组件
     作者：平原
     创建：2017-8-3 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="pay_module">
    <a
      v-if="!isMember"
      @click="buyCourse()"
      class="buy btn_hollow">购买会员</a>
    <a
      v-if="isMember"
      @click="buyCourse()"
      class="buy btn_hollow">续 费</a>
  </div>
</template>
<script>
  import { APP_TOKEN_KEY } from '../../../config'
  import Cookie from '../../../utils/cookie'
  import { initAliPayOrderInfo, completePayOrder } from '../../../utils/payOrder'
  import { mapState } from 'vuex'

  // apis
  import CreateMemberOrder from '../../../api/pay/CreateMemberOrder'

  export default {
    data () {
      return {
      }
    },

    props: {
      price: { required: true, type: Number },
      isMember: { required: true, type: Boolean },
      isBuyMember: { required: true, type: Boolean },
      memberCourseId: { required: true, type: Number }
    },

    computed: mapState({
      isLogin: state => state.login.isLogin
    }),

    methods: {
      buyCourse () {
        let self = this

        // 3.0.2暂停使用支付start
        let stopPay = 1
        if (stopPay) {
          this.$store.dispatch('boxyPrompt', { message: '请使用手机「新生大学」购买会员' })
          return
        }

        // 如果未登录，会员功能变为登录入口
        if (!this.isLogin && !Cookie.getCookie(APP_TOKEN_KEY)) {
          this.$store.dispatch('eventEmitter', { event: 'showLogin' })
          return
        }

        this.$store.dispatch('boxyConfirm', {
          message: '确认支付 ' + this.price,
          confirm () {
            self.confirmBuy()
          }
        })
      },

      async confirmBuy () {
        try {
          this.$store.dispatch('boxyProgress', { message: '前往支付页面...' })
          let info = initAliPayOrderInfo({
            courseId: this.memberCourseId,
            returnUrl: '/'
          })
          let order = await CreateMemberOrder({
            data: info,
            type: this.isBuyMember ? 2 : 1
          })
          if (order) {
            completePayOrder(order)
          } else {
            this.$store.dispatch('boxyProgressClose')
            this.$store.dispatch('boxyConfirm', { message: '订单信息为空' })
          }
        } catch (err) {
          this.$store.dispatch('boxyProgressClose')
          this.$store.dispatch('boxyConfirm', { message: '订单信息获取失败' })
          console.log(err)
        }
      }
    }
  }
</script>
