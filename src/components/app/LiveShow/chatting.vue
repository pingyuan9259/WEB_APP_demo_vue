<!-- 直播IM
     作者：阎垚月
     创建：2017-6 -->

<template>

  <transition name="slide-left">
    <div class="chatting">
      <!-- 聊天内容区域 -->
      <div id="chatting-content"
      @click.stop.prevent="isShowEmoji=false" ref="chattingContent" class="chatting-content">
        <!-- socket 断开提示 -->
        <div class="socket-message"
        :class="{'socket-bg': (socketLoading || successSocket)}"
          v-show="viewSocketStatus">
          <p v-show="!socketLoading">聊天区连接失败，请检查网络并
          <span @click="socketReconnect">重新连接</span></p>
          <div class="sk-ing" v-show="socketLoading && !successSocket"><img src="//o4a7cbihz.qnssl.com/unknown/a762c472-1662-4607-96e3-da37b94aeb54">正在连接</div>
          <div v-show="successSocket" class="sk-success">聊天区域连接成功</div>
        </div>

        <div class="chatting-all" v-show="!isTeacher">
          <div class="msgs-box">
            <div v-for="(item, index) of msgs" key="index" class="index">
              <div :class="{ 'myself': item.myself}" class="chatting-item other">
                <div class="msg-from" :class="{ 'not-self-from': !item.myself}">
                  <p class="msg-author">
                    {{ item.from }}
                  </p>
                  <img v-if="!(item.isTeacher && item.isAssistant) && item.isTeacher" class="icon-admin" src="//o4a7cbihz.qnssl.com/cover/60303410-8317-4c93-8807-f45f945da969">
                  <img v-if="item.isAssistant" class="icon-admin" src="//o4a7cbihz.qnssl.com/cover/3b0c99e5-208e-4fff-902e-12d11567b223">
                  <img v-if="item.isAdmin" class="icon-admin-admin" src="//o4a7cbihz.qnssl.com/picture/612ddb14-f5e4-4aaf-a01a-21974c28de5a">
                </div>
                <div class="msg-content" :class="{ 'myselfContent': item.myself}">
                <p>{{ item.content }}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chatting-some" v-show="isTeacher">
          <div class="msgs-teacher-box">
            <div v-for="(item, index) of teachersMsgs" key="index" class="index">
              <div :class="{ 'myself': item.myself}" class="chatting-item other">
                <div class="msg-from" :class="{ 'not-self-from': !item.myself}">
                  <p class="msg-author">
                    {{ item.from }}
                  </p>
                  <img v-if="!(item.isTeacher && item.isAssistant) && item.isTeacher" class="icon-admin" src="//o4a7cbihz.qnssl.com/cover/60303410-8317-4c93-8807-f45f945da969">
                  <img v-if="item.isAssistant" class="icon-admin" src="//o4a7cbihz.qnssl.com/cover/3b0c99e5-208e-4fff-902e-12d11567b223">
                  <img v-if="item.isAdmin" class="icon-admin-admin" src="//o4a7cbihz.qnssl.com/picture/612ddb14-f5e4-4aaf-a01a-21974c28de5a">
                </div>
                <div class="msg-content" :class="{ 'myselfContent': item.myself}">
                <p>{{ item.content }}</p></div>
              </div>
            </div>
          </div>
        </div>


        <!-- 只显示老师 -->
        <div @click="teacherMsg" class="show-teacher-message">
          <img v-show="!isTeacher" src="//o4a7cbihz.qnssl.com/picture/8164a799-e287-4ea7-9c8d-24d15031d3d7">
          <img v-show="isTeacher" src="//o4a7cbihz.qnssl.com/picture/f1cb289b-cc52-4db9-b8a7-1acc19ccafcf">
        </div>

        <!-- 提示窗口 -->
        <div v-show="showDialog" class="show-prompt-dialog">
          <p>{{ promptDes }}</p>
        </div>
      </div>

      <!-- 未读消息数 -->
      <div class="no-read-msg" v-show="noReadMsg > 0 && !isTeacher" @click="readMsg">
        <p>有 {{ noReadMsg }} 条新消息</p>
      </div>

      <!-- 老师未读消息数 -->
      <div class="no-read-msg" v-show="noReadTeacherMsg > 0 && isTeacher" @click="readTeacherMsg">
        <p>有 {{ noReadTeacherMsg }} 条新消息</p>
      </div>

      <!-- 输入区域 -->
      <div class="chatting-input">
        <transition name="slide-bottom">
          <emoji  v-show="isShowEmoji" class="emoji-display"></emoji>
        </transition>

        <div class="input-box">
          <div class="input-content">
            <i @click="showEmoji(isShowEmoji=!isShowEmoji, 'emoji');" class="icon-emoji"></i>
            <div contenteditable="true"
              class="input-input"
              placeholder="上课不互动，等于没听讲"
              id="input-input"
              @click="showEmoji(isShowEmoji=!isShowEmoji, 'textarea');"
              @keydown.13="send"
              @blur="loseBlur"
              @focus="getInputFocus"
              ref="textarea">
            </div>
            <span @click="getFocus" v-show="noContent" class="input-placeholder">上课不互动，等于没听讲</span>
            <div v-if="funcStatus.noWords === 1" class="input-stop">
              全员禁言
            </div>
          </div>
        </div>
      </div>

    </div>
  </transition>

</template>

<script>
import socket from '../../../utils/socketClient.js'
import { SOCKET_PREFIX, APP_TOKEN_KEY } from '../../../config/'
import { mapState } from 'vuex'
import cookie from '../../../utils/cookie'
import Emoji from './Emoji/'

let $ = window.$
export default {
  name: 'chatting',
  data () {
    return {
      promptDes: '显示全部',  // 提示窗说明
      showDialog: false,     // 显示提示窗条件
      successSocket: false,
      isTeacher: false,
      noReadMsg: 0,        // 未读消息数
      noReadTeacherMsg: 0, // 老师未读消息数
      scrollBottom: 0,
      sumHeight: 0,        // 未读区域的高度
      sumHeightTeacher: 0, // 老师未读区域的高度
      noContent: true,
      wordEmoji: '',
      msgs: [],
      teachersMsgs: [],
      msgsCopy: [],
      admin: [],
      teachers: [],
      assistants: [],
      inputContent: '',
      oContent: {},
      oContentTeacher: {},
      oTextarea: {},
      isShowEmoji: false,
      isAdmin: false,
      voteObj: {
        action: 'SELECTOR-ACTION',
        id: 'abcd',
        live_id: 'abc',
        title: '',
        items: [],
        status: 1
      },
      voteSel: '',
      vote: 2,
      openVote: false,
      funcStatus: {
        blackboard: 0,
        videoBoard: 0,
        microPhone: 0,
        noWords: 0,
        likeIt: 0
      },
      likeNum: 0,
      liveManNum: 0,
      liveInfo: {},
      controll: false,
      liveResouce: {},
      socketLoading: true,
      viewSocketStatus: true,
      socketClientStatus: ''
    }
  },
  components: {
    Emoji
  },
  created () {
    let params = {
      uri: SOCKET_PREFIX,
      userName: this.requestParams.user_name,
      userId: this.requestParams.user_id,
      token: cookie.getCookie(APP_TOKEN_KEY),
      liveId: this.requestParams.live_id
    }

    // socket.disconnect()
    socket.init(params, function () {
      console.log('init 回调函数')
    })
  },
  watch: {
    msgs (arr) {
      if (arr.length > 300) {
        let msgsArray = arr.splice(0, 1)
        msgsArray = []
        this.msgs = msgsArray.concat(arr)
      }
    },
    live (data) {
      if (data.feature && data.feature.muteall === 1 && data.feature.muteall_status === 1) {
        this.funcStatus.noWords = 1
      } else {
        this.funcStatus.noWords = 0
      }
    },
    // liveParams (data) {
    //   this.requestParams = {...data}
    // },
    resources (data) {
      this.liveResouce = {...data}
    },
    chatEmoji (data) {
      this.insertText(data)
      this.wordEmoji = data
    }
  },
  computed: {
    ...mapState({
      liveParams: state => state.liveshow.liveParams,
      live: state => state.liveshow.live,
      resources: state => state.liveshow.resources,
      chatEmoji: state => state.liveshow.chatEmoji
      // name: state => state.liveshow.name
      // avatarUrl: state => state.liveshow.avatarUrl
    }),
    requestParams () {
      return this.liveParams
    }
  },
  mounted () {
    this.oContent = document.querySelector('.chatting-all')
    this.oContent.scrollTop = this.oContent.scrollHeight

    this.oContentTeacher = document.querySelector('.chatting-some')
    this.oContentTeacher.scrollTop = this.oContentTeacher.scrollHeight

    this.oTextarea = document.querySelector('.input-input')

    $('.chatting-some').scroll(() => {
      if (this.isTeacher) {
        let viewHeight = $('.chatting-some').height()
        let scrolling = $('.chatting-some').scrollTop()
        let chatHeight = $('.msgs-teacher-box').height()
        if ((scrolling + viewHeight) >= (chatHeight)) {
          this.noReadTeacherMsg = 0
          this.sumHeightTeacher = 0
        }
      }
    })
    $('.chatting-all').scroll(() => {
      if (!this.isTeacher) {
        let viewHeight = $('.chatting-all').height()
        let scrolling = $('.chatting-all').scrollTop()
        let chatHeight = $('.msgs-box').height()
        if ((scrolling + viewHeight) >= (chatHeight)) {
          this.noReadMsg = 0
          this.sumHeight = 0
        }
      }
    })

    // 连接成功的事件
    socket.on('connect', () => {
      this.socketClientStatus = 'success'
      this.successSocket = true
      setTimeout(() => {
        this.viewSocketStatus = false
        this.socketLoading = false
        this.successSocket = false
      }, 3000)
    })

    // 断开连接的事件
    socket.on('disconnect', () => {
      this.socketClientStatus = 'disconnect'
      this.socketTimeout()
    })

    // 正在链接的事件
    socket.on('connecting', () => {
      this.socketClientStatus = 'connecting'
      this.socketTimeout()
    })

    // 连接超时的事件
    socket.on('connect_timeout', () => {
      this.socketClientStatus = 'connect_timeout'
      this.socketTimeout()
    })

    // 成功重新连接的事件
    socket.on('reconnect', () => {
      this.socketClientStatus = 'success'
      this.successSocket = true
      setTimeout(() => {
        this.viewSocketStatus = false
        this.socketLoading = false
        this.successSocket = false
      }, 3000)
    })

    // 正在重新连接
    socket.on('reconnecting', () => {
      this.socketClientStatus = 'reconnecting'
      this.socketTimeout()
    })

    // 重新连接失败
    socket.on('reconnect_failed', () => {
      this.socketClientStatus = 'reconnect_failed'
      this.socketTimeout()
    })

    socket.on('MESSAGE', (res) => {
      let oldChatHeight = $('.msgs-box').height()
      let oldChatHeightTeacher = $('.msgs-teacher-box').height()
      // console.log('老的高度', oldChatHeight)
      let lenT = this.teachers.length
      let teacher = false
      let lenA = this.assistants.length
      let assistant = false
      let lenAdmin = this.admin.length
      let admin = false
      for (let i = 0; i < lenT; i++) {
        if (this.teachers[i] === res.user_id) teacher = true
      }
      for (let j = 0; j < lenA; j++) {
        if (this.assistants[j] === res.user_id) assistant = true
      }

      for (let k = 0; k < lenAdmin; k++) {
        if (this.admin[k] === res.user_id) admin = true
      }

      if (res.socket_id !== socket._io.id) {
        if (res.user_id === this.requestParams.user_id) {
          this.msgs.push({
            from: res.user_name,
            myself: true,
            content: res.content,
            isTeacher: teacher,
            isAssistant: assistant,
            isAdmin: admin
          })
          if (assistant || teacher || admin) {
            this.teachersMsgs.push({
              from: res.user_name,
              myself: true,
              content: res.content,
              isTeacher: teacher,
              isAssistant: assistant,
              isAdmin: admin
            })
          }
        } else {
          this.msgs.push({
            from: res.user_name,
            myself: false,
            content: res.content,
            isTeacher: teacher,
            isAssistant: assistant,
            isAdmin: admin
          })
          if (assistant || teacher || admin) {
            this.teachersMsgs.push({
              from: res.user_name,
              myself: false,
              content: res.content,
              isTeacher: teacher,
              isAssistant: assistant,
              isAdmin: admin
            })
          }
        }
      }
      let messageTandA = assistant || teacher || admin
      setTimeout(() => {
        if (this.isTeacher) {
          let scrolled = $('.chatting-some').scrollTop()
          let chatHeight = $('.msgs-teacher-box').height()
          let viewHeight = $('.chatting-some').height()

          if ((chatHeight - scrolled - viewHeight) >= 80 && messageTandA) {
            this.noReadTeacherMsg += 1
            this.sumHeightTeacher += chatHeight - oldChatHeightTeacher
          } else if (messageTandA) {
            this.noReadTeacherMsg = 0
            this.sumHeightTeacher = 0
            this.scrollFun(messageTandA)
          } else if (!messageTandA) {
            this.noReadMsg += 1
          }
        } else {
          let scrolled = $('.chatting-all').scrollTop()
          let chatHeight = $('.msgs-box').height()
          let viewHeight = $('.chatting-all').height()

          if ((chatHeight - scrolled - viewHeight) >= 80) {
            this.noReadMsg += 1
            this.sumHeight += chatHeight - oldChatHeight
          } else {
            this.noReadMsg = 0
            this.sumHeight = 0
            this.scrollFun()
          }
        }
        messageTandA = false
      }, 0)
      admin = false
      assistant = false
      teacher = false
    })

    socket.on('LIVE_INFO', (res) => {
      this.$store.dispatch('pushLiveInfo', res[0])
      if (!res) {
        return
      }
      this.liveInfo = {...res[0]}
      if (!res[0]) {
        return
      }

      // 获取老师的ID 用于加身份显示
      this.teachers = res[0].speaker.map(item => {
        return item.id
      })
      // 获取管理员的ID 用于加身份显示
      this.admin = res[0].admin.map(item => {
        return item.id
      })
      // 获取助教的ID 用于加身份显示
      if (res[0].assistant) {
        this.assistants = res[0].assistant.map(item => {
          return item.id
        })
      }
      let data = res[0]
      if (data.feature && data.feature.like === 1 && data.feature.like_status === 1) {
        this.funcStatus.likeIt = 1
      } else {
        this.funcStatus.likeIt = 0
      }
      if (data.extend) {
        this.likeNum = data.extend.like_sum
        this.liveManNum = data.extend.user_sum
      }
    })

    // 接收事件
    socket.on('LIVESHOW', data => {
      switch (data.action) {
        case 'FEATURE':
          this.$store.dispatch('socketFeature', data).then(res => {
            this.judgeFun(res)
          })
          break
        case 'FEATURESTATUS':
          this.$store.dispatch('socketFeatureStatus', data).then(res => {
            this.judgeFun(res)
          })
          break
        case 'LIKE':
          this.$store.dispatch('socketLike', data).then(res => {
            this.likeNum = res.like_sum
          })
          break
        case 'USER-ACTION':
          this.$store.dispatch('socketUserAction', data).then(res => {
            this.liveManNum = res.user_sum
          })
          break
        case 'LIVE-INFO':
          this.$store.dispatch('socketLiveShowInfo', data)
          break
        case 'LIVE-NAME':
          this.$store.dispatch('socketLiveName', data)
          break
        case 'SELECTOR-CREATE':
          this.$store.dispatch('socketSelectorCreate', data).then(res => {
            if (res.status === 1) {
              this.vote = 1
              this.voteObj = {...res}
            } else {
              this.vote = 2
              this.voteObj = {}
            }
          })
          break
        case 'SELECTOR-ACTION':
          this.$store.dispatch('socketSelectorAction', data).then(res => {
            if (res.status === 1) {
              this.vote = 1
              this.voteObj = {...res}
            } else {
              this.vote = 2
              this.voteObj = {}
            }
          })
          break
        case 'RESOURCE-SEL':
          this.$store.dispatch('socketResourceSel', data).then(res => {
            if (!res) {
              return
            }
            if (res.resource_id === this.liveResouce.result[0].id) {
              return
            }
            let liveResourcesData = {
              live_id: res.live_id,
              resource_id: res.resource_id
            }
            this.$store.dispatch('getResources', liveResourcesData)
          })
          break
        case 'ADMIN-MESSAGE':
          this.$store.dispatch('socketAdminMessage', data).then(res => {
            this.isAdmin = true
            this.msgs.push({
              from: res.user_name,
              myself: false,
              content: res.content
            })
          })
          break
      }
      this.isAdmin = false
      this.scrollFun()
    })

    this.oContent.scrollTop = this.oContent.scrollHeight
  },
  methods: {
    // 点赞
    likeFun () {
      if (this.controll) {
        return
      }
      let data = {
        live_id: this.liveInfo.id
      }
      this.controll = true
      this.$store.dispatch('handleLikeAction', data).then(res => {
        res.code === 1 ? this.likeNum = res.result : ''
      })
      setTimeout(() => {
        this.controll = false
      }, 2000)
    },
    // 开启／关闭 小黑板,视频板,点赞,麦克风,全体禁言 功能与状态 的判断
    judgeFun (data) {
      if (data.status === 1) {
        switch (data.kind) {
          case 1:
            this.funcStatus.blackboard = 1
            break
          case 2:
            this.funcStatus.videoBoard = 1
            break
          case 3:
            this.funcStatus.likeIt = 1
            break
          case 4:
            this.funcStatus.microPhone = 1
            break
          case 5:
            this.funcStatus.noWords = 1
            $('#input-input').attr('disabled', true)
            break
        }
      } else if (data.status === 2) {
        switch (data.kind) {
          case 1:
            this.funcStatus.blackboard = 0
            break
          case 2:
            this.funcStatus.videoBoard = 0
            break
          case 3:
            this.funcStatus.likeIt = 0
            break
          case 4:
            this.funcStatus.microPhone = 0
            break
          case 5:
            this.funcStatus.noWords = 0
            $('#input-input').removeAttr('disabled')
            break
        }
      }
    },
    // 投票功能
    voteFun () {
      if (!this.voteObj) {
        return
      }
      let voteData = {
        live_id: this.voteObj.live_id,
        selector_id: this.voteObj.id,
        item_key: this.voteSel
      }
      this.$store.dispatch('voteSelectAction', voteData).then(res => {
        console.log('socketSelectorAction', res)
      })
    },
    // 投票面板显示与隐藏
    openVoteCont () {
      !this.openVote ? (this.openVote = true) : (this.openVote = false)
    },
    // 聊天室滚动到最底下
    scrollFun (bool) {
      setTimeout(() => {
        if (this.isTeacher && bool) {
          this.oContentTeacher.scrollTop = this.oContentTeacher.scrollHeight
        }
        if (!this.isTeacher) {
          this.oContent.scrollTop = this.oContent.scrollHeight
        }
      }, 0)
    },
    // 发送消息
    send (e) {
      if (this.funcStatus.noWords === 1) {
        return
      }
      this.isShowEmoji = false
      this.inputContent = $('#input-input').text()
      if (this.inputContent === '') {
        return
      } else {
        socket.emit('MESSAGE', {
          content: this.inputContent
        })

        let lenT = this.teachers.length
        let teacher = false
        let lenA = this.assistants.length
        let assistant = false
        let lenAdmin = this.admin.length
        let admin = false
        for (let i = 0; i < lenT; i++) {
          if (this.teachers[i] === this.requestParams.user_id) teacher = true
        }
        for (let j = 0; j < lenA; j++) {
          if (this.assistants[j] === this.requestParams.user_id) assistant = true
        }
        for (let k = 0; k < lenAdmin; k++) {
          if (this.admin[k] === this.requestParams.user_id) admin = true
        }
        this.msgs.push({
          from: this.requestParams.user_name,
          myself: true,
          content: this.inputContent,
          isTeacher: teacher,
          isAssistant: assistant,
          isAdmin: admin
        })
        if (assistant || teacher || admin) {
          this.teachersMsgs.push({
            from: this.requestParams.user_name,
            myself: true,
            content: this.inputContent,
            isTeacher: teacher,
            isAssistant: assistant,
            isAdmin: admin
          })
        }
        assistant = false
        teacher = false
        admin = false
        this.inputContent = ''
        $('#input-input').text('')
        this.noReadMsg = 0
        this.sumHeight = 0
        this.scrollFun()
        e.preventDefault() // 阻止发送后换行
      }
    },
    // 表情包显示与隐藏
    showEmoji (flag, val) {
      if (val === 'textarea') {
        this.isShowEmoji = flag && false
        return
      }
      this.isShowEmoji = flag
    },
    teacherMsg () {
      if (this.isTeacher) {
        this.promptDes = '显示全部'
        this.showDialog = true
        this.isTeacher = false
        setTimeout(() => {
          this.showDialog = false
        }, 2000)
      } else {
        this.promptDes = '只显示老师'
        this.showDialog = true
        this.isTeacher = true
        setTimeout(() => {
          this.showDialog = false
        }, 2000)
      }
    },
    socketReconnect () {
      this.socketLoading = true
    },
    insertText (str) {
      str = str + ' '
      let inputDiv = $('#input-input')
      inputDiv.text(`${inputDiv.text()}${str}`)
    },
    getFocus () {
      $('#input-input').focus()
      this.noContent = false
    },
    loseBlur () {
      if ($('#input-input').text() === '') {
        this.noContent = true
      }
    },
    getInputFocus () {
      this.noContent = false
    },

    // 点击所有人区域的未读消息
    readMsg () {
      this.noReadMsg = 0
      this.sumHeight = 0
      this.scrollFun()
    },

    // 点击老师区域的未读消息
    readTeacherMsg () {
      this.noReadTeacherMsg = 0
      this.sumHeightTeacher = 0
      this.scrollFun(true)
    },

    // socket 断开30秒检查
    socketTimeout () {
      setTimeout(() => {
        if (this.socketClientStatus !== 'success') {
          this.viewSocketStatus = true
        }
      }, 15000)
    }

  },
  beforeDestroy () {
    socket.disconnect()
  }
}
</script>

<style lang="scss" scoped>
  .chatting {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    height: 100%;
    position: relative;

    .chatting-header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      color: #319BF5;
      padding-top: 20px;
      padding-bottom: 20px;
      padding-left: 10px;
      padding-right: 15px;
      border-bottom: 1px solid #E8EEF4;

      .chatting-title {
        display: flex;
        justify-content: row;
      }
    }
    .msgs-box {
      // overflow-y: auto;
      width: 100%;
      // height: 100%;
    }
    .msgs-teacher-box {
      width: 100%;
    }
    .no-read-msg {
      position: absolute;
      bottom: 10px;
      right: 50%;
      margin-right: -80px;
      background: #13ce66;
      width: 160px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 18px;
      p {
        color: #fff;
        font-size: 14px;
      }
    }
    .chatting-content {
      position: relative;
      .socket-bg {
        background-color: rgba(255, 255, 255, 0)!important;
        .sk-ing {
          color: #9CA2AF;
          font-size: 14px;
          img {
            margin-right: 10px;
            margin-bottom: -3px;
            width: 16px;
            height: 16px;
          }
        }
        .sk-success {
          color: #00D377;
        }

      }

      .show-prompt-dialog {
        width: 80px;
        height: 36px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -40px;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
        line-height: 36px;
        border-radius: 3px;
        p {
          font-size: 13px;
          color: #FFF;
        }
      }

      .socket-message {
        position: fixed;
        background-color: rgba(45, 63, 82, 0.7);
        text-align: center;
        width: 320px;
        padding: 10px;

        p {
          font-size: 14px;
          color: #fff;
          span {
            text-decoration: underline;
          }
        }
      }

      .show-teacher-message {
        position: fixed;
        bottom: 60px;
        right: 30px;
        text-align: center;
        width: 30px;
        height: 21px;
        border-radius: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .other {
        text-align: left;
      }

      .myself {
        text-align: right;
      }

      .chatting-item {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        margin-top: 5px;
        padding-left: 20px;
        padding-right: 20px;

        .msg-from {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .msg-author {
            // font-size: 1.15rem;
            display: inline-block;
            font-size: 11px;
            color: #9CA2AF;
          }
          .icon-teacher {
            margin-left: 4px;
            width: 25px;
            height: 15px;
          }
          .icon-admin {
            margin-left: 4px;
            width: 25px;
            height: 15px;
          }
          .icon-admin-admin {
            margin-left: 4px;
            width: 35px;
            height: 15px;
          }
        }
        .not-self-from {
          display: flex;
          justify-content: flex-start;
        }
        .msg-content {
          margin-top: 11px;
          p {
            min-width: 24px;
            text-align: left;
            display: inline-block;
            *display: inline;
            *zoom: 1;
            padding-top: 7px;
            padding-bottom: 7px;
            padding-left: 14px;
            padding-right: 14px;
            background-color: #F2F3F8;
            color: #28313B;
            // font-size: 1rem;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            word-break: break-word;
            overflow: hidden;
            border-radius: 18px;
          }
        }
        .myselfContent {
          p {
            background-color: #7F87DD;
            color: #FFF;
          }

        }
      }

      .chatting-item + .chatting-item {
        margin-top: 10px;
      }
    }

    .chatting-content {
      .chatting-all {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .fontColor {
          border: 1px solid #2ECC71;
          color: #2ECC71;
        }

        .other {
          text-align: left;
        }

        .myself {
          text-align: right;
        }

        .chatting-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          margin-top: 5px;
          padding-left: 20px;
          padding-right: 20px;

          .msg-from {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .msg-author {
              // font-size: 1.15rem;
              display: inline-block;
              font-size: 11px;
              color: #9CA2AF;
            }
            .icon-teacher {
              margin-left: 4px;
              width: 25px;
              height: 15px;
            }
            .icon-admin {
              margin-left: 4px;
              width: 25px;
              height: 15px;
            }
            .icon-admin-admin {
              margin-left: 4px;
              width: 35px;
              height: 15px;
            }
          }
          .not-self-from {
            display: flex;
            justify-content: flex-start;
          }
          .msg-content {
            margin-top: 11px;
            p {
              min-width: 24px;
              text-align: left;
              display: inline-block;
              *display: inline;
              *zoom: 1;
              padding-top: 7px;
              padding-bottom: 7px;
              padding-left: 14px;
              padding-right: 14px;
              background-color: #F2F3F8;
              color: #28313B;
              // font-size: 1rem;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              word-wrap: break-word;
              word-break: break-all;
              word-break: break-word;
              overflow: hidden;
              border-radius: 18px;
            }
          }
          .myselfContent {
            p {
              background-color: #7F87DD;
              color: #FFF;
            }

          }
        }

        .chatting-item + .chatting-item {
          margin-top: 10px;
        }
      }
      .chatting-some {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .fontColor {
          border: 1px solid #2ECC71;
          color: #2ECC71;
        }

        .other {
          text-align: left;
        }

        .myself {
          text-align: right;
        }

        .chatting-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          margin-top: 5px;
          padding-left: 20px;
          padding-right: 20px;

          .msg-from {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .msg-author {
              // font-size: 1.15rem;
              display: inline-block;
              font-size: 11px;
              color: #9CA2AF;
            }
            .icon-teacher {
              margin-left: 4px;
              width: 25px;
              height: 15px;
            }
            .icon-admin {
              margin-left: 4px;
              width: 25px;
              height: 15px;
            }
            .icon-admin-admin {
              margin-left: 4px;
              width: 35px;
              height: 15px;
            }
          }
          .not-self-from {
            display: flex;
            justify-content: flex-start;
          }
          .msg-content {
            margin-top: 11px;
            p {
              min-width: 24px;
              text-align: left;
              display: inline-block;
              *display: inline;
              *zoom: 1;
              padding-top: 7px;
              padding-bottom: 7px;
              padding-left: 14px;
              padding-right: 14px;
              background-color: #F2F3F8;
              color: #28313B;
              // font-size: 1rem;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              word-wrap: break-word;
              word-break: break-all;
              word-break: break-word;
              overflow: hidden;
              border-radius: 18px;
            }
          }
          .myselfContent {
            p {
              background-color: #7F87DD;
              color: #FFF;
            }

          }
        }

        .chatting-item + .chatting-item {
          margin-top: 10px;
        }
      }
    }

    .chatting-input {
      position: fixed;
      // position: absolute;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      width: 320px;
      .emoji-display {
        position: absolute;
        width: 318px;
        height: 210px;
        background-color: white;
        top: -210px;
        left: 0;
          overflow-y: auto;
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            padding: 2px 3px;
            font-size: 2.2rem;
          }
        }
      }
      .vote-display {
        border-top: 1px solid #E8EEF4;
        color: #445C6A;
        position: absolute;
        width: 100%;
        height: 208px;
        background-color: #fff;
        top: -210px;
        left: 0;
        overflow-y: auto;
        text-align: center;
        h4 {
          padding: 10px 0;
          font-size: 20px;
        }
        span {
          display: inline-block;
          margin: 5px 10px 5px 10px;
        }
        button {
          position: absolute;
          bottom: 10px;
          right: 20px;
          border: 0;
          outline: 0;
          width: 80px;
          height: 28px;
          background-color: #1180DF;
          border-radius: 3px;
          color: #fdfcff;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }
      }
      .emoji {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-top: 2px solid #E8EEF4;
        border-bottom: 2px solid #E8EEF4;
        width: 100%;
        color: #445C6A;
        background: #fff;
        padding-top: 5px;
        padding-bottom: 5px;
        p {
          line-height: 40px;
          margin-left: 15px;
          width: 40px;
          height: 40px;
        }
        .icon-emoji {
          margin-left: 10px;
          width: 30px;
          height: 30px;
          border-radius: 100%;
          background: url('http://o4a7cbihz.qnssl.com/unknown/1099f21b-8fec-4dc7-b9bb-b1f601fd3b90') no-repeat;
          background-size: contain;
        }
        .icon-like {
          margin-left: 10px;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          background: url('http://o4a7cbihz.qnssl.com/unknown/dc171b49-a3a7-453e-9845-814bc2756118') no-repeat;
          background-size: contain;
        }

        .icon-vote {
          margin-left: 10px;
          width: 30px;
          height: 30px;
          background: url('http://o4a7cbihz.qnssl.com/unknown/4d6b8741-c46d-4bcf-8778-afd3e86444d7') no-repeat;
          background-size: contain;
        }
      }

      .input-box {
        position: relative;
        background-color: #FFF;
        .input-content {
          border-top: 1px solid #E8EEF4;
          width: 100%;
          min-height: 45px;
          outline: 0;
          display: flex;
          flex-direction: row;
          align-items: center;

          .icon-emoji {
            margin-left: 12px;
            margin-right: 10px;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background: url('https://o4a7cbihz.qnssl.com/cover/c760aac3-0274-480f-897c-ddf2231795d3') no-repeat;
            background-size: contain;
          }
          .input-input {
            resize: none;
            overflow-y: auto;
            overflow-x: hidden;
            // vertical-align: middle;
            border: 0;
            color: #28313B;
            width: 280px;
            min-height: 15px;
            max-height: 110px;
            line-height: 1.5;
            outline: 0;
            font-size: 14px;
            word-break: break-word;
            word-wrap: pre-word;
            // &::placeholder {
            //   // line-height: 1;
            //   line-height: 15px;
            // }
          }
          .input-placeholder {
            position: absolute;
            top: 35%;
            left: 15%;
            color: #999;
          }
          .input-stop {
            position: absolute;
            top: 60px;
            right: 135px;
            color: #EB5858;
          }
        }
        .input-send {
          position: absolute;
          top: 130px;
          right: 0;
          width: 80px;
          height: 28px;
          line-height: 28px;
          margin: 5px 20px 0 0;
          background-color: #1180DF;
          border-radius: 3px;
          color: #fdfcff;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }
      }

    }
  }
</style>
