<!-- 余额页面
     作者：平原
     创建：2017-6-10 -->

<style lang="scss">
  @import "./index";
</style>

<template>
  <div class="my_account_page">
    <div class="my_account">
      <span class="icon-sun-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span><span class="path14"></span><span class="path15"></span><span class="path16"></span><span class="path17"></span><span class="path18"></span><span class="path19"></span><span class="path20"></span><span class="path21"></span></span>

      <div class="balance">
        <h2>余额</h2>
        <span class="coin_count">{{ accountInfo.newbornBalance }}</span>
      </div>
      <div class="charge">
        <!-- <a
          v-if="!showPriceList"
          @click="showPriceList = true"
          class="show_price_list btn_solid">充 值</a> -->
        <a
          v-if="!showPriceList"
          @click="$store.dispatch('boxyPrompt', { message: '请使用手机「新生大学」进行充值' })"
          class="show_price_list btn_solid">充 值</a>
      </div>

      <div v-if="showPriceList" class="price_list">
        <div class="option">
          <h4>请选择所要充值的金额</h4>
          <a
            @click="charge()"
            class="charge btn_solid_small">确认充值</a>
          <a
            @click="showPriceList = false"

            class="cancel btn_hollow_small">取 消</a>
        </div>

        <ul>
          <li
            v-for="(item, index) in priceList"
            :key="index"
            @click="selectPrice(index)"
            :class="{ 'active': selectedPriceIndex === index }"
            class="price_item">
            <span class="icon-gold-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span>
            <span class="coin_num">{{item._newbornNum}}</span>
            <span class="price">{{ '¥ ' + item.price }}</span>
          </li>
        </ul>
      </div>

      <div class="paylog">
        <h3>购买记录</h3>
        <table v-if="payLog && payLog.length">
          <tr class="paylog_head">
            <th>方式</th>
            <th>余额</th>
            <th>支付项目</th>
            <th>时间</th>
          </tr>
          <tr
            v-for="(item, index) in payLog"
            :key="index"
            class="paylog_item">
            <td>{{ item._type }}</td>
            <td :class="{ 'charge': item._charge }" class="cost">
              {{ (item._charge ? '+ ' : '- ') + item._amount }}
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item._createdAt }}</td>
          </tr>
        </table>

        <pagination :page-limit="12" v-if="showPagination"></pagination>

        <div class="tip" v-if="payLog && !payLog.length">
          <p>
            <span class="icon-double-quotation tip_head"></span>
            暂无购买记录
          </p>
        </div>

        <loading
          id="paylog"
          :animation="true"></loading>
      </div>
    </div>
  </div>
</template>

<script>
  import Pagination from '../../modules/Pagination/'
  import Loading from '../../modules/Loading/'
  import { initAliPayOrderInfo, completePayOrder } from '../../../utils/payOrder'
  import sensorsdata from '../../../utils/sensorsdata'
  import { mapState } from 'vuex'

  // apis
  import CreateNewbornOrder from '../../../api/pay/CreateNewbornOrder'

  export default {
    data () {
      return {
        showPriceList: false,
        selectedPriceIndex: -1
      }
    },

    components: {
      Pagination,
      Loading
    },

    computed: mapState({
      payLog: state => state.account.payLog,
      priceList: state => state.account.priceList,
      accountInfo: state => state.pay.accountInfo,
      showPagination: state => state.common.showPagination,
      curPage: state => state.common.curPage
    }),

    watch: {
      curPage (val) {
        this.$store.dispatch('getPayLog', { page: val, limit: 12 })
      }
    },

    created () {
      this.$store.dispatch('getAccountInfo')
      this.$store.dispatch('getPayLog', { page: 1, limit: 12 })
      this.$store.dispatch('getPriceList')

      // 神策数据上报
      sensorsdata.track()
      let saTitle = 'web端余额页'
      sensorsdata.saEvent(saTitle)
    },

    methods: {
      selectPrice (index) {
        this.selectedPriceIndex = index
      },

      async charge () {
        try {
          if (this.selectedPriceIndex < 0) {
            this.$store.dispatch('boxyTip', { message: '请选择所要充值的价格' })
            return
          }

          this.$store.dispatch('boxyProgress', { message: '前往支付页面...' })
          let info = initAliPayOrderInfo({
            courseId: this.priceList[this.selectedPriceIndex].id,
            returnUrl: '/user/my-account'
          })
          let order = await CreateNewbornOrder(info)

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
