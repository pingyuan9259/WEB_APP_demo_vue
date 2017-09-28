<!-- 直播页面入口
     作者：阎垚月
     创建：2017-6 -->

<style lang="scss">
  @import './index';
</style>
<template>
  <div class="hello-live">

    <!-- 直播间的header -->
    <div class="live_header">
      <img src="https://o4a7cbihz.qnssl.com/picture/08616906-f559-4b73-b7ad-cc7b91f5c7ee">
      <h4>{{nowLiveName}}</h4>
    </div>

    <div id="hello-box">
      <div
        @click="changeVideoSize"
        v-show="liveInfoStream.videoboard_status !== 2">
        <div id="video-container"></div>
      </div>

      <!-- 小黑板 -->
      <div v-show="featStatus.blackboard === 1 && havePPT && liveInfoStream.liveStatus !== 2 && pptIsSelect === 1"
        id="carousel-example-generic"
        class="swiper-box-position">
        <div class="swiper-change-big" v-show="!isActive">
          <img @click="changeSwiperSize" src="http://o4a7cbihz.qnssl.com/unknown/5077c1f8-03e2-4912-a08d-2db813937f0b">
        </div>
        <live-banner></live-banner>
      </div>
      <!-- 小黑板结束 -->

      <!-- 直播结束 -->
      <div class="live-over-box" v-show="+liveInfoStream.liveStatus === 2 && closeLivePrompt">
        <h2 class="live-over-title">直播结束了</h2>
        <p class="live-over-content">下次上课请查看课程详情与课程表</p>
        <button @click="closePrompt">关闭</button>
      </div>

      <div class="live-err-box" v-show="(+liveInfoStream.liveStatus === 1 && loadLong) && closeLivePrompt">
        <h2 class="live-over-title">暂时无法获取直播画面</h2>
        <p class="live-over-content">请尝试<span @click="review"> 刷新 </span>页面。<br>
        若多次刷新页面后仍无法观看直播，请联系 <span @click="call">客服人员</span>。
        </p>
        <button @click="closeError">关闭</button>
      </div>

      <div v-show="(+flash.f !== 1 || +flash.v <= 10) && liveInfoStream.videoboard_status !== 2 && (+liveInfoStream.liveStatus !== 2)"  class="flash-error">
        <p class="live-flash-title">同学，您的flash插件已过期，无法播放视频了。</p>
        <p class="live-flash-content">建议您…</p>
        <a class="live-flash-a" v-if="+flash.f === 1" href="http://get.adobe.com/cn/flashplayer/update/osx/?psrc=pc_web-baidu-brand">
          <img src="//o4a7cbihz.qnssl.com/picture/eb1b1c3e-1b9e-4056-bd28-d965cfd5f397">安装Flash插件
        </a>
        <a class="live-flash-a" v-if="+flash.f !== 1 && +flash.v <= 10" href="http://get.adobe.com/cn/flashplayer/update/osx/?psrc=pc_web-baidu-brand">
          <img src="//o4a7cbihz.qnssl.com/picture/eb1b1c3e-1b9e-4056-bd28-d965cfd5f397">升级Flash插件
        </a>
      </div>


    </div>
    <div class="xs-chat">
      <chatting></chatting>
    </div>
  </div>
</template>

<script>
import {
  USER_INFO_KEY,
  USER_ID_KEY
} from '../../../config'
import cookie from '../../../utils/cookie'
import storage from '../../../utils/storage'
import { mapState } from 'vuex'
import CheckFlash from '../../../utils/checkFlash.js'
import sensorsdata from '../../../utils/sensorsdata'
import LiveBanner from './liveBanner.vue'
import chatting from './chatting.vue'

let $ = window.$
let w = document.documentElement.clientWidth - 320
let h = document.documentElement.clientHeight - 60
let player

/* eslint-disable */
  (function(m, ei, q, i, a, j, s) {
      m[i] = m[i] || function() {
          (m[i].a = m[i].a || []).push(arguments)
      };
      j = ei.createElement(q),
          s = ei.getElementsByTagName(q)[0];
      j.async = true;
      j.charset = 'UTF-8';
      j.src = '//static.meiqia.com/dist/meiqia.js?_=t';
      s.parentNode.insertBefore(j, s);
  })(window, document, 'script', '_MEIQIA');
  _MEIQIA('entId', 36862);
  _MEIQIA('withoutBtn');

  // 在这里开启手动模式（必须紧跟美洽的嵌入代码）
  _MEIQIA('manualInit');
/* eslint-enable */

export default {
  name: 'LiveShow',
  data () {
    return {
      clearTime: null,           // 定时器，用于直播断流时使用
      havePPT: false,
      closeLivePrompt: true,
      loadLong: false,
      isActive: false,
      myPlayer: null,
      featStatus: {
        blackboard: 0,
        videoBoard: 0,
        microPhone: 0
      },
      nowLiveName: '',
      joinLiveRoom: {},
      rtmpPublishUrl: '',
      rtmpPlayUrl: '',
      flvPlayUrl: '',
      hlsPlayUrl: '',

      liveInfoStream: {
        liveId: '',
        liveStatus: null,
        videoboard_status: 1
      },
      pptIsSelect: 0,
      flash: 1
    }
  },
  async created () {
    // 获取url上的参数
    function GetQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    }

    let userInfo = storage.get(USER_INFO_KEY)
    let params = {}
    params.user_id = cookie.getCookie(USER_ID_KEY)
    params.user_name = userInfo.fullname
    params.live_id = GetQueryString('liveId')
    params.type = 1

    await this.$store.dispatch('getLiveParams', params)

    this.$store.dispatch('getLiveShowStream', params).then(res => {
      res.code && res.code === 1 ? this.joinLiveRoom = {...res.result} : this.joinLiveRoom = {...res.message}

      this.nowLiveName = this.joinLiveRoom.name

      let data = res.result.feature
      // 判断请求结果是否开启了视频和黑板
      if (data.blackboard === 1 && data.blackboard_status === 1) {
        this.featStatus.blackboard = 1
      } else {
        this.featStatus.blackboard = 0
      }
      if (data.videoboard === 1 && data.videoboard_status === 1) {
        this.featStatus.videoboard = 1
      } else {
        this.featStatus.videoboard = 0
      }
      // 加入房间初始化流地址
      let stream = res.result.live_schema
      this.rtmpPublishUrl = stream.rtmp_publish_url
      this.rtmpPlayUrl = stream.rtmp_play_url
      this.flvPlayUrl = stream.flv_play_url.replace('http', 'https')
      this.hlsPlayUrl = stream.hls_play_url.replace('http', 'https')

      // 创建播放器
      this.playerCreate()

      // 获取资源
      let liveResourcesData = {
        live_id: res.result.id,
        resource_id: res.result.live_resource_sel.id
      }
      this.$store.dispatch('getResources', liveResourcesData)
    })

    // flash的检测
    let flash = CheckFlash()
    this.flash = flash

    // 神策数据上报
    sensorsdata.track()
  },
  components: {
    LiveBanner,
    chatting
  },
  mounted () {
    let isChrome = window.navigator.userAgent.indexOf('Chrome') > -1
    if (!isChrome) {
      this.$store.dispatch('boxyPrompt', { message: '为保证最佳的直播体验，请使用Chrome（谷歌）浏览器' })
    }
    $('body').css('overflow', 'hidden')

    // 禁止点击画面暂停事件
    $('.vcp-bigplay').css('display', 'none')

    let self = this
    let chatContentHeigh = document.documentElement.clientHeight - 110
    $('#chatting-content').css('height', chatContentHeigh)
    w = document.documentElement.clientWidth - 320
    h = document.documentElement.clientHeight - 60
    $('#hello-box').css('width', w)
    $('#hello-box').css('height', h)
    $('#carousel-example-generic').draggable({containment: '#hello-box'})
    window.onresize = function () {
      chatContentHeigh = document.documentElement.clientHeight - 110
      w = document.documentElement.clientWidth - 320
      h = document.documentElement.clientHeight - 60
      $('#chatting-content').css('height', chatContentHeigh)
      $('#hello-box').css('width', w)
      $('#hello-box').css('height', h)
      if (!self.isActive) {
        // 控制播放器自适应
        window.qcplayer.el.style.width = w + 'px'
        window.qcplayer.el.style.height = h + 'px'
        // $('video').css('width', '100%')
        // $('video').css('height', '100%')
        $('video').css('width', w)
        $('video').css('height', h)
      }
      if (self.isActive) {
        $('#carousel-example-generic').css('width', w)
        $('#carousel-example-generic').css('height', h)
      }
    }
    setTimeout(() => {
      // 判断如果20秒中视频没有播放，则提示用户连接失败
      let a = window.qcplayer.playing()
      if (!a || a === undefined) {
        self.loadLong = true
      }
    }, 20000)

    // 神策数据上报
    let saTitle = `${this.nowLiveName}课程直播间`
    sensorsdata.saEvent(saTitle)
  },
  computed: mapState({
    live: state => state.liveshow.live,
    resources: state => state.liveshow.resources,
    resourceSel: state => state.liveshow.resourceSel,
    joinInfo: state => state.liveshow.joinInfo,
    feature: state => state.liveshow.feature,
    featureStatus: state => state.liveshow.featureStatus,
    socketLiveInfo: state => state.liveshow.socketLiveInfo,
    liveName: state => state.liveshow.liveName
  }),
  watch: {
    // 进入直播间首先请求v1/live/user接口，获取到直播的状态
    live (data) {
      if (!data.result) {
        return
      }
      // 不希望看到接口和 socket有数据的冲突
      this.liveInfoStream.liveStatus = data.result.live_status

      // 是否有ppt
      if (data.result.live_resource_sel.id !== '') {
        this.pptIsSelect = 1
      }
    },

    resourceSel (data) {
      if (data.resource_id) {
        this.pptIsSelect = 1
      }
    },

    // 进入直播间拉去resources/info获取是否有ppt
    resources (data) {
      if (data.result && data.result.length > 0) {
        data.result[0].links && data.result[0].links.length > 0 ? (this.havePPT = true) : (this.havePPT = false)
      }
    },

    // 加入直播间会收到join-info
    joinInfo (data) {
      if (data.feature.blackboard === 1 && data.feature.blackboard_status === 1) {
        this.featStatus.blackboard = 1
      }
      if (data.feature.videoboard === 1 && data.feature.videoboard_status === 1) {
        this.featStatus.videoBoard = 1
      } else if (data.feature.videoboard === 1 && data.feature.videoboard_status === 2) {
        this.hideVideo()
      }

      if (data.live_resource_sel.id) {
        this.havePPT = true
      }
    },

    // 监听socket 推送直播间流地址与直播状态
    socketLiveInfo (data) {
      if (data.videoboard_status === 1 && data.live_status === 1) {
        this.featStatus.videoBoard = 1
        this.showVideo()
      }
      this.liveInfoStream.videoboard_status = data.videoboard_status  // socket异步推送视频状态
      this.liveInfoStream.liveId = data.live_id
      this.liveInfoStream.liveStatus = data.live_status
      this.rtmpPublishUrl = data.live_schema.rtmp_publish_url
      this.rtmpPlayUrl = data.live_schema.rtmp_play_url
      this.flvPlayUrl = data.live_schema.flv_play_url
      this.hlsPlayUrl = data.live_schema.hls_play_url
    },
    // 监听socket 推送直播间名字
    liveName (data) {
      this.nowLiveName = data.name
    },
    // 监听socket 推送事件功能
    feature (data) {
      this.judgeFeature(data)
      // this.controllVideo()
    },
    // 监听socket 推送事件状态
    featureStatus (data) {
      this.judgeFeature(data)

      // 初始化黑板和视频的大小
      if (data.status === 1 && (data.kind === 1 || data.kind === 2)) {
        this.controllVideo()
        this.isActive = false
      }
      if (data.status === 1 && data.kind === 2) {
        this.showVideo()
      } else if (data.status === 2 && data.kind === 2) {
        this.hideVideo()
      }
    },
    // 检测视频版与黑板的是否可拖动
    isActive (val) {
      if (!val) {
        $('#video-container').draggable({disabled: true})
        $('#carousel-example-generic').draggable({disabled: false})
        $('#carousel-example-generic').draggable({containment: '#hello-box'})
      }
      if (val) {
        $('#carousel-example-generic').draggable({disabled: true})
        $('#video-container').draggable({disabled: false})
        $('#video-container').draggable({containment: '#hello-box'})
      }
    }
  },
  methods: {
    // 开启／关闭 小黑板,视频板,麦克风 功能与状态 的判断
    judgeFeature (data) {
      if (data.status === 1) {
        switch (data.kind) {
          case 1:
            this.featStatus.blackboard = 1
            this.havePPT = true
            break
          case 2:
            this.featStatus.videoBoard = 1
            break
          case 4:
            this.featStatus.microPhone = 1
            break
        }
      } else if (data.status === 2) {
        switch (data.kind) {
          case 1:
            this.featStatus.blackboard = 0
            break
          case 2:
            this.featStatus.videoBoard = 0
            break
          case 4:
            this.featStatus.microPhone = 0
            break
        }
      }
    },

    // 初始化视频播放器
    /**
    * 视频类型播放优先级
    * mobile ：m3u8>mp4
    * PC ：RTMP>flv>m3u8>mp4
    */
    playerCreate () {
      let self = this
      let options = {
        flv: this.flvPlayUrl,
        rtmp: this.rtmpPlayUrl,
        // m3u8: this.hlsPlayUrl,
        // coverpic: 'http://imgcache.qq.com/open/qcloud/video/share/img/back-img.png',
        autoplay: true,
        live: true,
        width: w,
        height: h,
        flash: true,
        wording: {
          1002: '即将直播，请稍等',
          2032: '请求视频失败，请检查网络',
          2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
        },
        listener: function (msg) {
          if (msg.type === 'netStatus' && msg.detail.code === 'NetStream.Buffer.Empty') {
            self.clearTime = setTimeout(() => {
              self.loadLong = true
            }, 5000)
          }
          if (msg.type === 'netStatus' && msg.detail.code === 'NetStream.Buffer.Full') {
            clearTimeout(self.clearTime)
          }
          if (msg.type === 'netStatus' && msg.detail.code === 'NetConnection.Connect.Closed') {
            self.loadLong = true
          }
        }
      }

      player = new window.TcPlayer('video-container', options)
      window.qcplayer = player
    },

    // 关闭直播结束提示
    closePrompt () {
      this.closeLivePrompt = false
    },

    // 关闭断流提示
    closeError () {
      this.loadLong = false
    },

    // 放大黑板
    changeSwiperSize () {
      // 减小浏览器性能消耗
      if (this.isActive) {
        return
      }
      this.isActive = true
      this.controllBoard()
    },

    // 放大直播
    changeVideoSize () {
      // 减小浏览器性能消耗
      if (!this.isActive) {
        return
      }
      this.isActive = false

      this.controllVideo()
    },

    // 控制视频画面 -- 放大视频，缩小黑板
    controllVideo () {
      w = document.documentElement.clientWidth - 320
      h = document.documentElement.clientHeight - 60
      $('#hello-box').css('width', w)
      $('#hello-box').css('height', h)
      $('#carousel-example-generic').css('width', 300)
      $('#carousel-example-generic').css('height', 200)
      $('#video-container').css('top', 60)
      $('#video-container').css('left', 0)
      $('#video-container').css('z-index', 0)
      // 控制播放器自适应
      window.qcplayer.el.style.width = w + 'px'
      window.qcplayer.el.style.height = h + 'px'
      $('video').css('width', w)
      $('video').css('height', h)
      // $('video').css('width', '100%')
      // $('video').css('height', '100%')
      if (this.featStatus.videoBoard === 0) {
        $('#video-container').css('opacity', 0)
      }

      $('#carousel-example-generic').animate({
        opacity: 0
      }, 0)
      setTimeout(function () {
        $('#carousel-example-generic').animate({
          opacity: 1
        }, 1000)
      }, 0)
    },

    // 控制黑板 -- 放大黑板，缩小视频
    controllBoard () {
      w = document.documentElement.clientWidth - 320
      h = document.documentElement.clientHeight - 60
      $('#hello-box').css('width', w)
      $('#hello-box').css('height', h)
      $('#carousel-example-generic').css('width', w)
      $('#carousel-example-generic').css('height', h)
      $('#carousel-example-generic').css('top', 60)
      $('#carousel-example-generic').css('left', 0)
      $('#video-container').css('z-index', 102)

      // 控制播放器大小
      window.qcplayer.el.style.width = 300 + 'px'
      window.qcplayer.el.style.height = 200 + 'px'
      $('video').css('width', 300)
      $('video').css('height', 200)

      $('#video-container').animate({
        opacity: 0
      }, 0)

      if (this.featStatus.videoBoard === 0) {
        $('#video-container').css('opacity', 0)
      } else {
        setTimeout(function () {
          $('#video-container').animate({
            opacity: 1
          }, 1000)
        }, 0)
      }
    },

    // 隐藏视频播放器
    hideVideo () {
      if (this.featStatus.videoBoard === 0) {
        $('#video-container').css('opacity', 0)
      }
    },
    // 显示视频播放器
    showVideo () {
      if (this.featStatus.videoBoard === 1) {
        $('#video-container').css('opacity', 1)
      }
    },
    review () {
      window.location.reload()
    },
    call () {
      window._MEIQIA('withoutBtn')
      window._MEIQIA('init')
      window._MEIQIA('allSet', function () {
        window._MEIQIA('showPanel')
      })
    }
  },

  beforeDestroy () {
    $('body').css('overflow', 'auto')
  }
}

</script>

<style scoped>
</style>
