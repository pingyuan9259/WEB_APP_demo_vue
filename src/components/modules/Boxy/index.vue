<!-- 弹框组件
     作者：平原
     创建：2017-4-14
     优化：2017-6-14 -->

<style lang="scss">
  @import "./index"
</style>

<template>
  <div
    :class="{ 'showBoxyMash': boxys.length }"
    class="boxy">
    <ul>
      <li 
        v-for="(item, index) in boxys"
        :key="index"
        :class="{ 'confirm_boxy': item.type !== 'tip' }"
        class="boxy_content">
        <span class="message" v-html="item.message"></span>
<!-- 
        <input
          v-model="password"
          @load="alert('a')"
          ref="password"
          type="password"
          class="password"> -->

        <div class="confirm_option" v-if="item.type === 'confirm'">
          <a  class="cancel btn_hollow" @click="boxyHide(item.id, false)">返 回</a>
          <a  class="confirm btn_solid" @click="boxyHide(item.id, true, item.message, item.data)">确 定</a>
        </div>

        <div class="warning_option" v-if="item.type === 'warning'">
          <a  class="cancel btn_hollow" @click="boxyHide(item.id, false)">取 消</a>
          <a  class="warning btn_solid" @click="boxyHide(item.id, true, item.message, item.data)">确 定</a>
        </div>

        <div class="prompt_option" v-if="item.type === 'prompt'">
          <a  class="prompt btn_solid" @click="boxyHide(item.id, false)">确 定</a>
        </div>
      </li>
    </ul>

    <ul>
      <transition-group name="fade">
      <li
        v-for="(item, index) in toasts"
        :key="index"
        class="toast">
        <span class="message" v-html="item.message"></span>
      </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        password: '',
        boxys: [], // 存放boxy的数组，当没有弹框显示时将被置空
        toasts: [], // 存放toast的数组，同理与boxys
        id: '', // 为每一个弹出的boxy加上保证唯一性的id， 当没有弹框显示时将被置空
        tipTimer: {}
      }
    },

    computed: mapState({
      boxyShow: state => state.boxy.boxyShow,
      boxyProgress: state => state.boxy.boxyProgress
    }),

    watch: {
      boxyShow (val) {
        if (!val.message) return
        let { type, message, confirm, cancel, data } = val
        let self = this

        // 生成弹框ID
        let id = Math.random()

        // 解析message的换行符
        // eslint-disable-next-line
        if (message) {
          message = message.replace(/\n/g, '<br>')
        }

        // 如果是tip，则自动关闭
        if (type === 'tip') {
          this.tipTimer[id] = setTimeout(() => {
            self.boxyHide(id)
            clearTimeout(this.tipTimer[id])
          }, 1500)
        }

        if (type === 'toast') {
          this.toasts.push({
            message: message,
            id: id
          })
          this.tipTimer[id] = setTimeout(() => {
            self.toastHide(id)
            clearTimeout(this.tipTimer[id])
          }, 1500)
        } else {
          this.boxys.push({
            type: type,
            message: message,
            confirm: confirm,
            cancel: cancel,
            data: data,
            id: id
          })
        }
      },

      // progress同一时间只有一个
      boxyProgress (val) {
        if (val.isShow) {
          // 打开弹框
          this.boxys.push({
            type: 'tip',
            message: val.message,
            id: 'progress'
          })
        } else {
          // 关闭弹框
          this.boxyHide('progress', false)
        }
      }
    },

    methods: {
      boxyHide (id, confirm, message, data) {
        // 获取当前弹框的index
        let index = NaN
        for (let i in this.boxys) {
          if (this.boxys[i].id === id) index = i
        }

        // 执行回调
        if (confirm) {
          let callback = this.boxys[index].confirm
          callback && callback(true)
        } else {
          let callback = this.boxys[index].cancel
          callback && callback(false)
        }

        // 关闭弹窗
        this.boxys.splice(index, 1)
      },

      toastHide (id) {
        // 获取当前弹框的index
        let index = NaN
        for (let i in this.toasts) {
          if (this.toasts[i].id === id) index = i
        }
        // 关闭弹窗
        this.toasts.splice(index, 1)
      }
    }
  }
</script>
